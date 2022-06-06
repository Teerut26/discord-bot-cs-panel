import { Message } from "discord.js";

export interface News {
    id?: string;
    title: string;
    message?: Message;
    description: string;
    timestamp?: string;
}
