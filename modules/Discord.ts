import {
    Client,
    ClientUser,
    Collection,
    GuildManager,
    Intents,
    OAuth2Guild,
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
                let guild = await this.guilds.fetch("962930543534698526");
                guild.channels.cache.map((channel) => {
                    console.log(channel.name);
                });
                resolve(this.guilds.fetch());
            });
        });
    }

    async sendMessage(description: string, title: string, url: string) {
        const webhookClient = new WebhookClient({
            url,
        });

        return await webhookClient.send({
            embeds: [
                {
                    title,
                    description,
                },
            ],
        });
    }

    async deleteMessage(id: string, url: string) {
        const webhookClient = new WebhookClient({
            url,
        });

        return await webhookClient.deleteMessage(id);
    }
}
