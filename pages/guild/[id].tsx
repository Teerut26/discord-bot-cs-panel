import Form from "@/components/Guild/Form";
import History from "@/components/Guild/History";
import Loading from "@/components/Loading";
import CheckLogin from "@/layouts/CheckLogin";
import WithNavbar from "@/layouts/WithNavbar";
import { gql, useQuery } from "@apollo/client";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
    faRefresh,
    faServer,
    faShieldAlt,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { GuildResponse } from "interfaces/GuildResponse";
import { News } from "interfaces/news";
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
    const [guildInfo, setGuildInfo] = useState<GuildResponse | undefined>();

    const { loading, error, data, refetch } = useQuery(
        gql`
            query ($guildID: String!) {
                getChannel(guildID: $guildID) {
                    id
                    name
                }
                getGuildInfo(guildID: $guildID) {
                    id
                    name
                    icon
                    region
                    description
                    roles {
                        name
                        id
                    }
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
            setGuildInfo(data.getGuildInfo);
            setNewsList(data.getNews);
        }
    }, [data]);

    const Title = styled.div`
        ${tw`text-xl items-center flex gap-2 font-bold`}
    `;
    const Container = styled.div`
        ${tw`flex flex-col w-full gap-3`}
    `;

    return (
        <CheckLogin>
            <WithNavbar>
                {!loading ? (
                    <>
                        <div
                            className={css(
                                tw`w-full flex flex-col md:flex-row items-center justify-center gap-3 py-5 px-3 `
                            )}
                        >
                            <img
                                src={
                                    guildInfo?.icon
                                        ? `https://cdn.discordapp.com/icons/${guildInfo?.id}/${guildInfo?.icon}.webp?size=512`
                                        : "/avatar.png"
                                }
                                alt=""
                                className={css(
                                    tw`max-w-[10rem] duration-150 md:max-w-[8rem]`
                                )}
                            />
                            <div className="flex flex-col">
                                <Title>
                                    <FontAwesomeIcon icon={faDiscord} />
                                    {guildInfo?.name}
                                </Title>
                                <Title>
                                    <FontAwesomeIcon icon={faServer} />
                                    {guildInfo?.region}
                                </Title>
                                <Title>
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                    {guildInfo?.roles.length}
                                </Title>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-5 p-3 w-full">
                            <Container>
                                <Title>เพิ่มข่าว</Title>
                                {channels ? (
                                    <Form
                                        guildInfo={guildInfo!}
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
