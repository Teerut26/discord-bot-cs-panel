import { APIMessage } from "discord-api-types/v9";
export interface News {
    id?: string;
    title: string;
    webhookURL: string;
    channel?: APIMessage;
    description: string;
    timestamp?: string;
}
