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
export default class Discord extends Client {
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

    getChannels(
        guildID: string
    ): Promise<Collection<string, GuildBasedChannel>> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let guild = await this.guilds.fetch(guildID);
                    resolve(guild.channels.cache);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async sendMessage(embeds: MessageEmbed[], channelID: string):Promise<Message<boolean>> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let channel = this.channels.cache.get(
                        channelID
                    ) as TextChannel;
                    let res = await channel.send({ embeds });
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async deleteMessage(messagesID: string, channelID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.execute();
            this.on("ready", async () => {
                try {
                    let channel = this.channels.cache.get(
                        channelID
                    ) as TextChannel;
                    let res = await channel.messages.delete(messagesID);
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
