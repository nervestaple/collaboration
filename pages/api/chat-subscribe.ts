import type { Server } from 'http';
import { isFinite, isString } from 'lodash-es';
import type { Socket as NetSocket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer, Socket } from 'socket.io';

import db from '../../db';
import {
  CLIENT_CHAT_MESSAGE_KEY,
  SERVER_CHAT_MESSAGE_KEY,
  SERVER_CHAT_STATUS_KEY,
} from '../../utils/constants';
import getUserIdFromCookieString from '../../utils/getUserIdFromCookieString';

type SocketsByUserId = Map<string, Set<string>>;
type OnlineStatusByCollaborationId = Map<number, SocketsByUserId>;

export default async function chatSubscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const httpSocket = res.socket as NetSocket & {
    server: Server & { io?: SocketServer };
  };

  if (httpSocket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new SocketServer(httpSocket.server);
  httpSocket.server.io = io;

  const onlineStatus: OnlineStatusByCollaborationId = new Map();

  io.on('connection', async (socket) => {
    const { referer: url, cookie: cookieString } = socket.handshake.headers;
    const userId = await getUserIdFromCookieString(url, cookieString);
    if (!userId) {
      console.error('disconnecting, missing userId');
      socket.disconnect();
      return;
    }

    const collaborationId = await getValidCollaborationId(socket, userId);
    if (collaborationId === null) {
      console.error('disconnecting, missing collaborationId');
      socket.disconnect();
      return;
    }

    updateOnlineStatusOnConnect(
      onlineStatus,
      collaborationId,
      userId,
      socket.id,
    );

    const roomId = `collaboration:${collaborationId}`;
    socket.join(roomId);

    async function sendRoomStatus() {
      if (!userId || collaborationId === null) {
        return;
      }

      const socketsByUserId = onlineStatus.get(collaborationId);
      if (!socketsByUserId) {
        return;
      }

      const onlineUserIds = [...socketsByUserId.entries()]
        .filter(([, socketsForUser]) => socketsForUser.size > 0)
        .map(([id]) => id);

      io.to(roomId).emit(SERVER_CHAT_STATUS_KEY, { onlineUserIds });
    }

    sendRoomStatus();

    socket.on('disconnect', () => {
      updateOnlineStatusOnDisconnect(
        onlineStatus,
        collaborationId,
        userId,
        socket.id,
      );
      sendRoomStatus();
    });

    async function handleIncomingChatMessage(text: string) {
      if (!text || text === '' || collaborationId === null || userId === null) {
        return;
      }

      const { id } = await db.message.create({
        data: { text, collaborationId, userId },
      });

      const socketMessage = { id, userId, text };
      io.to(roomId).emit(SERVER_CHAT_MESSAGE_KEY, socketMessage);
    }

    socket.on(CLIENT_CHAT_MESSAGE_KEY, handleIncomingChatMessage);
  });

  res.end();
}

async function getValidCollaborationId(
  socket: Socket,
  userId: string,
): Promise<number | null> {
  if (!isString(socket.handshake.query.collaborationId)) {
    return null;
  }

  const collaborationId = parseInt(socket.handshake.query.collaborationId);
  if (!isFinite(collaborationId)) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { collaborations: { where: { collaborationId } } },
  });

  if (!user || user.collaborations.length === 0) {
    return null;
  }

  return collaborationId;
}

function updateOnlineStatusOnDisconnect(
  onlineStatus: OnlineStatusByCollaborationId,
  collaborationId: number,
  userId: string,
  socketId: string,
) {
  const socketsByUserId = onlineStatus.get(collaborationId);
  if (!socketsByUserId) {
    return;
  }

  const socketsForUser = socketsByUserId.get(userId);
  if (!socketsForUser) {
    return;
  }

  socketsForUser.delete(socketId);

  socketsByUserId.set(userId, socketsForUser);
  onlineStatus.set(collaborationId, socketsByUserId);
}

function updateOnlineStatusOnConnect(
  onlineStatus: OnlineStatusByCollaborationId,
  collaborationId: number,
  userId: string,
  socketId: string,
) {
  if (!onlineStatus.has(collaborationId)) {
    onlineStatus.set(collaborationId, new Map());
  }

  const socketsByUserId = onlineStatus.get(collaborationId);
  if (!socketsByUserId) {
    return;
  }

  if (!socketsByUserId.has(userId)) {
    socketsByUserId.set(userId, new Set());
  }

  const socketsForUser = socketsByUserId.get(userId);
  if (!socketsForUser) {
    return;
  }

  socketsForUser.add(socketId);
  socketsByUserId.set(userId, socketsForUser);
  onlineStatus.set(collaborationId, socketsByUserId);
}
