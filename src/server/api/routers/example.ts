import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// export const exampleRouter = createTRPCRouter({
//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.db.profile.findMany();
//   }),
// });

export const signUpRouter = createTRPCRouter({
  // signup: publicProcedure
  //   .input(z.object({ email: z.string() }))
  //   .mutation((opts) => {}),
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
      const result = await ctx.db.profile.create({
        data: {
          name: name,
          email: email,
          password: pass,
        },
      });
      return {
        status: 201,
        message: "Profile Created",
        result: result,
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
      // const { name, email, pass } = opts.input;
      const result = await opts.ctx.db.profile.findUnique({
        where: {
          email: opts.input.email,
          password: opts.input.pass,
        },
      });
      if (result !== null) {
        return {
          status: 201,
          message: "Success",
          result: result,
        };
      }
      return {
        status: 404,
        message: "Failed",
        result: result,
      };
    }),
});
