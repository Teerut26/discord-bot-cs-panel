// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Discord from "modules/Discord";
import type { NextApiRequest, NextApiResponse } from "next";
import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";

const rest = new REST({ version: "10" }).setToken(
    process.env.BOT_TOKEN as string
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let discord = new Discord()
    let result = await discord.getMembers("962930543534698526",{query:"Hol"})
    console.log(JSON.parse(JSON.stringify(result)))
    res.status(200).json(result);
}
