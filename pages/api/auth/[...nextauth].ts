import db from "@/config/firestore";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
    // Configure one or more authentication
    secret: process.env.SECRET,
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            profile: async (profile) => {
                let userAccessCollection = await db
                    .collection("userAccess")
                    .where("id", "==", profile.id)
                    .get();
                if (userAccessCollection.size === 0) {
                    return null;
                }
                return profile;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
