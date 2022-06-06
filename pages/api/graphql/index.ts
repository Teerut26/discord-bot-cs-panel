import db from "@/config/firestore";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { gql, ApolloServer } from "apollo-server-micro";
import { News } from "interfaces/news";
import { WebhookURL } from "interfaces/webhookUrl";
import Discord from "modules/Discord";
import { NextApiRequest, NextApiResponse } from "next";

const typeDefs = gql`
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

    type APIMessage {
        timestamp: String
        flags: Int
        webhook_id: String
        edited_timestamp: String
        id: String
        channel_id: String
        pinnned: Boolean
        tts: Boolean
        content: String
        mention_everyone: Boolean
        type: Int
        attachments: [String]
        mention_roles: [String]
        components: [String]
        author: Author
        mentions: [String]
        embeds: [Embeds]
    }

    type News {
        id: String
        title: String
        description: String
        channel: APIMessage
        webhookURL: String
        timestamp: String
    }
    type AddNewsRespone {
        id: String
        title: String
        description: String
        webhookURL: String
        timestamp: String
    }
    input AddNewsInput {
        title: String
        webhookURL: String
        description: String
    }
    type DeleteNewsRespone {
        id: String
    }

    # Webhook

    type Webhook {
        id: String
        title: String
        url: String
        timestamp: String
    }
    type AddWebhookRespone {
        id: String
        title: String
        url: String
        timestamp: String
    }
    input AddWebhookInput {
        title: String
        url: String
    }
    type DeleteWebhookRespone {
        id: String
    }

    type Query {
        getNews: [News]
        getWebhook: [Webhook]
    }

    type Mutation {
        addNews(news: AddNewsInput!): AddNewsRespone
        deleteNews(id: String!): DeleteNewsRespone
        addWebhook(Webhook: AddWebhookInput!): AddWebhookRespone
        deleteWebhook(id: String!): DeleteWebhookRespone
    }
`;

const resolvers = {
    Query: {
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
        getWebhook: async () => {
            let newsCollection = await db.collection("webhook");
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

            let webhookResult = await new Discord().sendMessage(
                args.news.description,
                args.news.title,
                args.news.webhookURL
            );

            await newsCollection.add({
                description: args.news.description,
                webhookURL: args.news.webhookURL,
                channel: webhookResult,
                title: args.news.title,
                timestamp: timestamp,
            } as News);

            return {
                description: args.news.description,
                webhookURL: args.news.webhookURL,
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
                    result.channel?.id as string,
                    result.webhookURL
                );
            } catch (error) {}

            await NewsCollection.delete();

            return {
                id: args.id,
            };
        },
        addWebhook: async (parent: any, args: any) => {
            let timestamp = new Date().toJSON();
            let WebhookCollection = await db.collection("webhook");
            await WebhookCollection.add({
                url: args.Webhook.url,
                title: args.Webhook.title,
                timestamp: timestamp,
            } as WebhookURL);

            return {
                url: args.Webhook.url,
                title: args.Webhook.title,
                timestamp: timestamp,
            };
        },
        deleteWebhook: async (parent: any, args: any) => {
            let WebhookCollection = await db.collection("webhook").doc(args.id);
            await WebhookCollection.delete();

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
