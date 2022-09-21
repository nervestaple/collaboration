import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import db from '../../../db';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async session({ session }) {
      if (!session.user || !session.user.email) {
        return session;
      }

      const dbUser = await db.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      session.userId = dbUser?.id;
      return session;
    },

    async signIn({ user }) {
      if (!user.email || !user.name) {
        return false;
      }

      try {
        await db.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            name: user.name,
          },
          create: {
            email: user.email,
            name: user.name,
          },
        });

        return true;
      } catch (e) {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
