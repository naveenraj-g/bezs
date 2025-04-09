/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/lib/constants/env";

export const auth = betterAuth({
  rateLimit: {
    window: 10,
    max: 100,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        await axios.post("http://localhost:3000/api/send-email", {
          to: user.email,
          subject: "Reset your password",
          text: `Click the link to reset your password: ${url}`,
        });
      } catch (error: any) {
        throw new error(error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        await axios.post("http://localhost:3000/api/send-email", {
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${url}`,
        });
      } catch (error: any) {
        throw new error(error);
      }
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        try {
          await axios.post("http://localhost:3000/api/send-email", {
            to: user.email,
            subject: "Approve email change",
            text: `Click the link to approve the change: ${url}`,
          });
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }, request) => {
        try {
          await axios.post("http://localhost:3000/api/send-email", {
            to: user.email,
            subject: "Confirm your account delection",
            text: `Click the link to approve your account delection: ${url}`,
          });
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
  },

  appName: "Bezs",

  plugins: [
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          try {
            await axios.post("http://localhost:3000/api/send-email", {
              to: user.email,
              subject: "2 FA OTP",
              text: `Your 2 FA OTP: ${otp}`,
            });
          } catch (error: any) {
            throw new error(error);
          }
        },
      },
    }),
    nextCookies(),
  ],
});
