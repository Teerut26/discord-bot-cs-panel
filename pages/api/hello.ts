// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Discord from "modules/Discord";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let discord = new Discord();
    let result = await discord.deleteMessage("983234697964449834","796350971982774302");

    res.status(200).json({ sdf: "sdfd" });
}
