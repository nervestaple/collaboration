/* eslint-disable */
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & NextAuth.DefaultSession['user'];
  }
}
