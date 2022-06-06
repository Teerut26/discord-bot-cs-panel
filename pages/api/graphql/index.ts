import db from "@/config/firestore";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { gql, ApolloServer } from "apollo-server-micro";
import { MessageEmbed } from "discord.js";
import { News } from "interfaces/news";
import Discord from "modules/Discord";
import { NextApiRequest, NextApiResponse } from "next";

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

    type Author {
        avatar: String
        id: String
        discriminator: String
        bot: Boolean
        username: String
    }

    type Embeds {
        title: String
        description: String
        type: String
    }

    type News {
        id: String
        title: String
        description: String
        channelID: String
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
        channelID: String
        description: String
    }
    type DeleteNewsRespone {
        id: String
    }

    type Query {
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
            let timestamp = new Date().toJSON();
            let newsCollection = await db.collection("news");

            let newEmbed = new MessageEmbed();
            newEmbed.setTitle(args.news.title);
            newEmbed.setDescription(args.news.description);

            let webhookResult = await new Discord().sendMessage(
                [newEmbed],
                args.news.channelID
            );

            await newsCollection.add({
                description: args.news.description,
                message: webhookResult.toJSON(),
                title: args.news.title,
                timestamp: timestamp,
            } as News);

            return {
                description: args.news.description,
                channelID: args.news.channelID,
                channel: args.news.webhookResult,
                title: args.news.title,
                timestamp: timestamp,
            };
        },
        deleteNews: async (parent: any, args: any) => {
            let NewsCollection = await db.collection("news").doc(args.id);
            let result = (await (await NewsCollection.get()).data()) as News;

            try {
                await new Discord().deleteMessage(
                    result.message?.id!,
                    result.message?.channelId!
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
