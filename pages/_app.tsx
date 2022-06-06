import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { wrapper } from "../store";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Toaster } from "react-hot-toast";

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            <SessionProvider>
                <ApolloProvider client={client}>
                    <Toaster position="bottom-right" reverseOrder={false} />
                    <Component {...pageProps} />
                </ApolloProvider>
            </SessionProvider>
        </>
    );
};

export default wrapper.withRedux(MyApp);
