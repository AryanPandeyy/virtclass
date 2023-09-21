import { createTRPCMiddleware, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { verifyJWT } from "../utils/jwt";

type user = {
  id: number,
  email: string,
  name: string,
  password: string,
}

const isAuthed = createTRPCMiddleware(async (opts) => {
  const { ctx } = opts;
  const { req} = ctx;
  // const token = req.headers.authorization.split('')[1];
  const token = req.cookies;
  console.log('token from server ', token);
  try {
    const user:user = verifyJWT(token.myCookie!);
    return opts.next({
      ctx: {
        user: user,
        // Infers that the `user` is non-nullable
        // user: ctx.user,
      },
    });
  } catch (e) {
    console.log(req.cookies.myCookie);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized",
    });
  }
});
export const protectedProcedure = publicProcedure.use(isAuthed);
