import { Message } from "discord.js";

export interface Embed {
    type: string;
    title: string;
    description: string;
}

export interface News {
    id?: string;
    title: string;
    messageID?: string;
    guildID?: string;
    embeds?: Embed[];
    message?: Message;
    description: string;
    timestamp?: string;
}
