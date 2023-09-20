import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const signUpRouter = createTRPCRouter({
  demo: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        signup: `hi ${input.text}`,
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
      const result = await opts.ctx.db.profile.findUnique({
        where: {
          email: opts.input.email,
        },
      });
      if (result !== null) {
        const hashPass = await bcrypt.compare(opts.input.pass, result.password);
        if (hashPass) {
          return {
            status: 201,
            message: "Success",
            result: result,
          };
        } else {
          return {
            status: 404,
            message: "Password is incorrect",
            result: result,
          };
        }
      }
      return {
        status: 404,
        message: "Failed",
        result: result,
      };
    }),
});
