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
    let result = await rest.get(Routes.guild("962930543534698526"));
    console.log(JSON.stringify(result));
    res.status(200).send("55555");
}
