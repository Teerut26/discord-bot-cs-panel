import { JWT } from "next-auth/jwt";

export interface Token extends JWT {
    sub: string;
    iat: number
    exp: number
}
