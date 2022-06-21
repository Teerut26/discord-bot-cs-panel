import { Message, MessageAttachment, User } from "discord.js";

export interface Embed {
    type: string;
    title: string;
    description: string;
}

export interface News {
    id?: string;
    title: string;
    channelID?: string;
    messageID?: string;
    author? : User 
    guildID?: string;
    embeds?: Embed[];
    attachments?: MessageAttachment[];
    message?: Message;
    description: string;
    timestamp?: string;
}
