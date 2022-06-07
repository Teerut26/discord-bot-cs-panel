import db from "@/config/firestore";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { gql, ApolloServer } from "apollo-server-micro";
import { MessageEmbed } from "discord.js";
import { News } from "interfaces/news";
import Discord from "modules/Discord";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const typeDefs = gql`
    type GuildAPI {
        id: String
        name: String
        icon: String
        shardId: Int
        splash: String
        banner: String
        description: String
        verificationLevel: String
        vanityURLCode: String
        nsfwLevel: String
        premiumSubscriptionCount: Int
        discoverySplash: String
        memberCount: Int
        large: Boolean
        premiumProgressBarEnabled: Boolean
        applicationId: String
        afkTimeout: Int
        afkChannelId: String
        systemChannelId: String
        premiumTier: String
        explicitContentFilter: String
        mfaLevel: String
        joinedTimestamp: Int
        defaultMessageNotifications: String
        systemChannelFlags: Int
        maximumMembers: Int
        maximumPresences: Int
        approximateMemberCount: Int
        approximatePresenceCount: Int
        vanityURLUses: String
        rulesChannelId: String
        publicUpdatesChannelId: String
        preferredLocale: String
        ownerId: String
        widgetEnabled: Boolean
        widgetChannelId: String
        createdTimestamp: Int
        nameAcronym: String
        iconURL: String
        splashURL: String
        discoverySplashURL: String
        bannerURL: String
        stickers: [String]
        emojis: [String]
        scheduledEvents: [String]
        invites: [String]
        stageInstances: [String]
        roles: [String]
        bans: [String]
        channels: [String]
        members: [String]
        commands: [String]
        features: [String]
    }

    type PermissionOverwrites {
        id: String
        type: Int
        allow: String
        deny: String
    }

    type Channel {
        id: String
        last_message_id: String
        type: Int
        name: String
        position: Int
        flags: Int
        parent_id: String
        topic: String
        guild_id: String
        last_pin_timestamp: String
        rate_limit_per_user: Int
        nsfw: Boolean
        permission_overwrites: [PermissionOverwrites]
    }

    type Embeds {
        type: String
        title: String
        description: String
    }

    type Author {
        id: String
        username: String
        avatar: String
        avatar_decoration: String
        discriminator: String
        public_flags: Int
        bot: Boolean
    }

    type Roles {
        id: String
        name: String
        permissions: String
        position: Int
        color: Int
        hoist: Boolean
        managed: Boolean
        mentionable: Boolean
        icon: String
        unicode_emoji: String
        flags: Int
    }

    type GuildInfo {
        id: String
        name: String
        icon: String
        description: String
        splash: String
        discovery_splash: String
        banner: String
        owner_id: String
        application_id: String
        region: String
        afk_channel_id: String
        afk_timeout: Int
        system_channel_id: String
        widget_enabled: Boolean
        widget_channel_id: String
        verification_level: Int
        default_message_notifications: Int
        mfa_level: Int
        explicit_content_filter: Int
        max_presences: String
        max_members: Int
        max_video_channel_users: Int
        vanity_url_code: String
        premium_tier: Int
        premium_subscription_count: Int
        system_channel_flags: Int
        preferred_locale: String
        rules_channel_id: String
        public_updates_channel_id: String
        hub_type: String
        premium_progress_bar_enabled: Boolean
        nsfw: Boolean
        nsfw_level: Int
        roles: [Roles]
        stickers: [String]
        emojis: [String]
        features: [String]
    }

    type MemberResponse {
        guildId: String
        joinedTimestamp: Int
        premiumSinceTimestamp: String
        nickname: String
        pending: Boolean
        communicationDisabledUntilTimestamp: String
        userId: String
        avatar: String
        displayName: String
        avatarURL: String
        displayAvatarURL: String
        roles: [String]
    }

    input MemberResponseInput {
        guildID: String!
        query: String
        limit: Int
        withPresences: Boolean
        time: Int
        nonce: String
        force: Boolean
    }

    type News {
        id: String
        messageID: String
        channelID: String
        guildID: String
        embeds: [Embeds]
        timestamp: String
    }
    type AddNewsRespone {
        id: String
        title: String
        description: String
        channelID: String
        timestamp: String
    }
    input AddNewsInput {
        title: String
        guildID: String
        channelID: String
        description: String
    }
    type DeleteNewsRespone {
        id: String
    }

    type Query {
        getChannel(guildID: String!): [Channel]
        getGuildInfo(guildID: String!): GuildInfo
        getMember(option: MemberResponseInput!): [MemberResponse]
        getGuild: [GuildAPI]
        getNews: [News]
    }

    type Mutation {
        addNews(news: AddNewsInput!): AddNewsRespone
        deleteNews(id: String!): DeleteNewsRespone
    }
`;

const resolvers = {
    Query: {
        getMember: async (parent: any, args: any) => {
            let discord = new Discord();
            let result = await discord.getMembers(args.option.guildID, {
                ...args.option,
            });
            console.log(JSON.parse(JSON.stringify(result)))
            return JSON.parse(JSON.stringify(result));
        },
        getGuildInfo: async (parent: any, args: any) => {
            let discord = new Discord();
            let result = await discord.getGuildInfo(args.guildID);
            return result;
        },
        getChannel: async (parent: any, args: any) => {
            let discord = new Discord();
            let result = await discord.getChannels(args.guildID);
            return result.filter((channel) => channel.type === 0);
        },
        getGuild: async () => {
            let discord = new Discord();
            let result = await discord.getGuilds();

            let resutl = await Promise.all(
                result.map(async (item) => {
                    let guild = await item.fetch();
                    let guildJSON = guild.toJSON();
                    return guildJSON;
                })
            );
            return resutl;
        },
        getNews: async () => {
            let newsCollection = await db.collection("news");
            let newDocs = await newsCollection
                .orderBy("timestamp", "desc")
                .get();
            let resutl: FirebaseFirestore.DocumentData[] = [];
            newDocs.forEach((doc) => {
                resutl.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });
            return resutl;
        },
    },
    Mutation: {
        addNews: async (parent: any, args: any) => {
            let NewsCollection = await db.collection("news");

            let newEmbed = new MessageEmbed();
            newEmbed.setTitle(args.news.title);
            newEmbed.setDescription(args.news.description);

            let res = await new Discord().sendMessage(
                [newEmbed],
                args.news.channelID
            );

            await NewsCollection.add({
                messageID: res.id,
                channelID: args.news.channelID,
                guildID: args.news.guildID,
                embeds: res.embeds,
                timestamp: res.timestamp,
            });

            return {
                description: args.news.description,
                channelID: args.news.channelID,
                title: args.news.title,
            };
        },
        deleteNews: async (parent: any, args: any) => {
            let NewsCollection = await db.collection("news").doc(args.id);
            let result = (await (await NewsCollection.get()).data()) as News;

            try {
                await new Discord().deleteMessage(
                    result.messageID!,
                    result.channelID!
                );
            } catch (error) {}

            await NewsCollection.delete();

            return {
                id: args.id,
            };
        },
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const session = await getSession({ req });

        // if (!session) {
        //     throw new Error("Not authenticated");
        // }

        // if (Date.now() >= new Date(session.expires).getTime() * 1000) {
        //     throw new Error("Session expires");
        // }

        return { session };
    },
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await startServer;
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false,
    },
};
