import { REST } from "@discordjs/rest";
import {
    Client,
    Collection,
    FetchMembersOptions,
    GuildMember,
    Intents,
    Message,
    MessageAttachment,
    MessageEmbed,
    OAuth2Guild,
    TextChannel,
    User,
} from "discord.js";
import { Routes } from "discord-api-types/v10";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { GuildResponse } from "interfaces/GuildResponse";

export default class Discord extends Client {
    public restAPI: REST = new REST({ version: "10" }).setToken(
        process.env.BOT_TOKEN as string
    );
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
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

    getMembers(
        guildID: string,
        option: FetchMembersOptions | undefined = undefined
    ): Promise<Collection<string, GuildMember> | undefined> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let resutl = await this.guilds.cache.get(guildID);
                    let members = await resutl?.members.fetch(option);
                    resolve(members);
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

    async getGuildInfo(guildID: string): Promise<GuildResponse> {
        try {
            let result = await this.restAPI.get(Routes.guild(guildID));
            return result as GuildResponse;
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(
        embeds: MessageEmbed[],
        imageAttachment: MessageAttachment[] = [],
        imageAttachmentURL: string[],
        channelID: string,
        user: User
    ): Promise<Message> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let resutl = this.channels.cache.get(
                        channelID
                    ) as TextChannel;
                    embeds[0].setFooter({
                        text: `Post by ${user.username}`,
                        iconURL: user.avatarURL()!,
                    });
                    let res = await resutl.send({
                        embeds: embeds,
                        files: [...imageAttachment, ...imageAttachmentURL],
                    });
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async getUserInfo(userID: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let resutl = await this.users.fetch(userID);
                    resolve(resutl);
                } catch (error) {
                    reject(error);
                }
            });
        });
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
