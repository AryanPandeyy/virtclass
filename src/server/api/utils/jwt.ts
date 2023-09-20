import jwt from "jsonwebtoken";
import { env } from "../../../env.mjs";

const key = env.ACCESS_TOKEN_PRIVATE_KEY;
export const signJWT = (payload: object): string => {
  return jwt.sign(payload, key, {
    expiresIn: "1h",
    algorithm: "RS256",
  });
};

export const verifyJWT = <T>(token: string): T => {
  return jwt.verify(token, key) as T;
};
