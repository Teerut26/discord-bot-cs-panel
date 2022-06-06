import Form from "@/components/Guild/Form";
import History from "@/components/Guild/History";
import Loading from "@/components/Loading";
import CheckLogin from "@/layouts/CheckLogin";
import WithNavbar from "@/layouts/WithNavbar";
import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { faRefresh, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { News } from "interfaces/news";
import { AppContext } from "next/app";
import { AppContextType } from "next/dist/shared/lib/utils";
import React, { useMemo, useState } from "react";
import tw from "twin.macro";

interface Props {
    guildID: string | undefined;
}

export async function getServerSideProps(context: any) {
    return {
        props: { guildID: context.params.id as string | undefined }, // will be passed to the page component as props
    };
}

const Guild: React.FC<Props> = ({ guildID }) => {
    const [channels, setChannels] = useState<ChannelAPI[] | undefined>();
    const [NewsList, setNewsList] = useState<News[] | undefined>();

    const { loading, error, data, refetch } = useQuery(
        gql`
            query ($guildID: String!) {
                getChannel(guildID: $guildID) {
                    id
                    name
                }
                getNews {
                    id
                    messageID
                    guildID
                    embeds {
                        title
                        description
                    }
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
            setChannels(data.getChannel);
            setNewsList(data.getNews);
        }
    }, [data]);

    const Title = styled.div`
        ${tw`text-xl font-bold`}
    `;
    const Container = styled.div`
        ${tw`flex flex-col w-full gap-3`}
    `;

    return (
        <CheckLogin>
            <WithNavbar>
                {!loading ? (
                    <>
                        <div className="w-full py-10 px-3">sdfsdf</div>
                        <div className="flex flex-col md:flex-row gap-5 p-3 w-full">
                            <Container>
                                <Title>เพิ่มข่าว</Title>
                                {channels ? (
                                    <Form
                                        onRefresh={() => {
                                            refetch();
                                        }}
                                        channels={channels}
                                        guildID={guildID as string}
                                    />
                                ) : (
                                    ""
                                )}
                            </Container>
                            <Container>
                                <Title className="flex items-center gap-2">
                                    ประวัติการส่ง{" "}
                                    {loading ? (
                                        <FontAwesomeIcon
                                            onClick={() => refetch()}
                                            icon={faSpinner}
                                            spin
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            onClick={() => refetch()}
                                            className="btn btn-sm btn-primary"
                                            icon={faRefresh}
                                        />
                                    )}
                                </Title>
                                <History
                                    onRefresh={() => {
                                        refetch();
                                    }}
                                    newsList={
                                        NewsList?.filter(
                                            (item) => item.guildID === guildID
                                        )!
                                    }
                                />
                            </Container>
                        </div>
                    </>
                ) : (
                    <Loading />
                )}
            </WithNavbar>
        </CheckLogin>
    );
};

export default Guild;
