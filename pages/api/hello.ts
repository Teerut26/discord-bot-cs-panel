// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Discord from "modules/Discord";
import type { NextApiRequest, NextApiResponse } from "next";
import { Routes } from 'discord-api-types/v10';
import { REST } from "@discordjs/rest";

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN as string);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
       let result = await rest.get(Routes.guildChannels("574794024712405003"));
       res.status(200).json(result);
    } catch (error) {
        console.error(error);
    }
    // let discord = new Discord();
    // let result = await discord.getChannels("574794024712405003");
    // res.status(200).json(result.toJSON());
    
}
