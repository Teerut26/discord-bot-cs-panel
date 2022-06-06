// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Discord from "modules/Discord";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let discord = new Discord();
    let result = await discord.getGuilds();
    // console.log(result);
    res.status(200).json(
        result.map((item) => ({
            id: item.id,
            name: item.name,
            icon: item.icon,
        }))
    );
}
