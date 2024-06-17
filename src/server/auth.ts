import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";

import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

// import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties
 * to the `session` object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    acceptedTOSId: string | null;
  }
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session: nextAuthSession, user }) => {
      const session = {
        ...nextAuthSession,
        user: {
          ...nextAuthSession.user,
          id: user.id,
          image: user.image
            ? user.image
            : `https://ui-avatars.com/api/?name=${user.name as string}`,
          role: user.role,
          acceptedTOSId: user.acceptedTOSId,
        },
      };
      return session;
    },
  },
  events: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile, isNewUser }) {
      const currentTOSId = (
        await prisma.tOS.findFirst({
          where: { isCurrent: true },
          select: { id: true },
        })
      )?.id;

      console.debug("user.acceptedTOSId", user.acceptedTOSId);
      console.debug("currentTOSId", currentTOSId);

      // console.debug(
      //   "Event: SIGN IN",
      //   user,
      //   account,
      //   profile,
      //   isNewUser
      // );
    },
    // session(message) {
    //   console.debug("Event: SESSION", message.session);
    // },
    // createUser({ user }) {
    //   console.debug("Event: CREATE USER", user);
    // },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    TwitterProvider({
      clientId: env.TWITTER_API_KEY,
      clientSecret: env.TWITTER_API_KEY_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    EmailProvider({
      from: env.EMAIL_FROM,
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },

      // LOG VERIFYLINK TO CONSOLE IN DEVELOPMENT MODE ONLY
      ...(env.NODE_ENV !== "production"
        ? {
            sendVerificationRequest({ url }) {
              console.debug("LOGIN LINK", url);
            },
          }
        : {}),
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
