import type { Server } from 'http';
import { isFinite, isString } from 'lodash-es';
import type { Socket as NetSocket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer, Socket } from 'socket.io';

import db from '../../db';
import { CHAT_MESSAGE_KEY } from '../../utils/constants';
import getUserIdFromCookieString from '../../utils/getUserIdFromCookieString';

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

  io.on('connection', async (socket) => {
    const url = socket.request.url;
    const cookieString = socket.handshake.headers.cookie;
    const userId = await getUserIdFromCookieString(url, cookieString);
    if (!userId) {
      console.error(`disconnecting, missing userId`, {
        url,
        cookieString,
        userId,
      });
      socket.disconnect();
      return;
    }

    const collaborationId = await getValidCollaborationId(socket, userId);
    if (collaborationId === null) {
      console.error('disconnecting, missing collaborationId');
      socket.disconnect();
      return;
    }

    const roomId = `collaboration:${collaborationId}`;
    socket.join(roomId);

    async function handleIncomingChatMessage(text: string) {
      if (!text || text === '' || collaborationId === null || userId === null) {
        return;
      }

      const { id } = await db.message.create({
        data: { text, collaborationId, userId },
      });

      const socketMessage = { id, userId, text };
      io.to(roomId).emit(CHAT_MESSAGE_KEY, socketMessage);
    }

    socket.on(CHAT_MESSAGE_KEY, handleIncomingChatMessage);
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
