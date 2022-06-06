import Form from "@/components/Guild/Form";
import CheckLogin from "@/layouts/CheckLogin";
import WithNavbar from "@/layouts/WithNavbar";
import { gql, useQuery } from "@apollo/client";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { AppContext } from "next/app";
import { AppContextType } from "next/dist/shared/lib/utils";
import React, { useMemo, useState } from "react";

interface Props {
    guildID: string | undefined;
}

export async function getServerSideProps(context: any) {
    return {
        props: { guildID: context.params.id as string | undefined }, // will be passed to the page component as props
    };
}

const Guild: React.FC<Props> = ({ guildID }) => {
    const [channels, setChannels] = useState<ChannelAPI[] | undefined>()
    const { loading, error, data } = useQuery(
        gql`
            query ($guildID: String!) {
                getChannel(guildID: $guildID) {
                    id
                    name
                }
            }
        `,
        {
            variables: {
                guildID: guildID,
            },
        }
    );

    useMemo(() => {
        if (data) {
            setChannels(data.getChannel)
        }
    }, [data])

    return (
        <CheckLogin>
            <WithNavbar>
                <div className="flex gap-5 p-3 w-full max-w-xl mx-auto">
                    {channels ? <Form channels={channels} guildID={guildID as string}  /> : ""}
                    
                </div>
            </WithNavbar>
        </CheckLogin>
    );
};

export default Guild;
