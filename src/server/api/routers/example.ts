import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signJWT } from "../utils/jwt";
import { protectedProcedure } from "../controller/auth";

export const signUpRouter = createTRPCRouter({
  demo: protectedProcedure
    .query(({ ctx }) => {
      return {
        signup: `hi`,
        user: ctx.user,
      };
    }),
  // name, email, password
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name Please").max(10),
        email: z.string().email(),
        pass: z.string().min(3, "Password must be more than 3 words").max(10),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, pass } = input;
      const hashPass = await bcrypt.hash(pass, 12);
      try {
        await ctx.db.profile.create({
          data: {
            name: name,
            email: email,
            password: hashPass,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already Exist",
            });
          }
        }
        throw e;
      }
      return {
        status: 201,
        message: "Profile Created",
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        pass: z.string().min(3).max(10),
      }),
    )
    .mutation(async (opts) => {
      // do this in nextjs app
      // const something = opts.ctx.resHeaders.set("set-cookie",`customCookie:${token}; HttpOnly`)
      try {
        await opts.ctx.db.profile
          .findUnique({
            where: {
              email: opts.input.email,
            },
          })
          .then(async (result) => {
            if (result !== null) {
              const hashPass = await bcrypt.compare(
                opts.input.pass,
                result.password,
              );
              if (hashPass) {
                // https://github.com/trpc/trpc/discussions/4226
                // https://codevoweb.com/trpc-api-with-nextjs-postgresql-access-refresh-tokens/
                const token = signJWT(opts.input);
                // chatgpt
                opts.ctx.res.setHeader(
                  "Set-Cookie",
                  `myCookie=${token}; HttpOnly`,
                );
                return {
                  status: 201,
                  token: token,
                  message: "Success",
                };
              } else {
                throw new TRPCError({
                  code: "FORBIDDEN",
                  message: "Incorrect Credential",
                });
              }
            } else {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "Incorrect Email",
              });
            }
          });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Prisma error, ${e.message}`,
          });
        }
        throw e;
      }
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    try {
      ctx.res.setHeader("Set-Cookie", `myCookie=; HttpOnly`);
    } catch (e) {
      console.log(e);
    }
  }),
  // testAuth: protectedProcedure.input(z.object(text: z.string())).query({})
});
