import { REST } from "@discordjs/rest";
import {
    Client,
    Collection,
    GuildBasedChannel,
    Intents,
    Message,
    MessageEmbed,
    OAuth2Guild,
    TextChannel,
    WebhookClient,
} from "discord.js";
import { Routes } from "discord-api-types/v10";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { messageResponse } from "interfaces/messageResponse";

export default class Discord extends Client {
    public restAPI: REST = new REST({ version: "10" }).setToken(
        process.env.BOT_TOKEN as string
    );
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES, // <= Don't miss this :)
            ],
        });
    }

    execute() {
        this.login(process.env.BOT_TOKEN);
    }

    getGuilds(): Promise<Collection<string, OAuth2Guild>> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    resolve(this.guilds.fetch());
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async getChannels(guildID: string): Promise<ChannelAPI[]> {
        try {
            let result = await this.restAPI.get(Routes.guildChannels(guildID));
            return result as ChannelAPI[];
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(
        embeds: MessageEmbed[],
        channelID: string
    ): Promise<messageResponse> {
        try {
            let result = await this.restAPI.post(
                Routes.channelMessages(channelID),
                {
                    body: {
                        embeds: embeds,
                    },
                }
            );
            return result as messageResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteMessage(messagesID: string, channelID: string): Promise<void> {
        try {
            await this.restAPI.delete(
                Routes.channelMessage(channelID, messagesID)
            );
            return;
        } catch (error) {
            throw error;
        }
    }
}
