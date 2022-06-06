import WithNavbar from "layouts/WithNavbar";
import React, { useEffect, useMemo, useState } from "react";
import CheckLogin from "layouts/CheckLogin";
import { gql, useQuery } from "@apollo/client";
import { OAuth2Guild } from "discord.js";
import { guildAPI } from "interfaces/guildAPI";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faShield, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const Card = styled.div`
    label: Card;
    ${tw`max-w-xl w-full sm:w-[15rem] md:w-[17rem] duration-100 cursor-pointer`}
    :hover{
        transform: scale(1.01, 1.01);
    }
`;

const Stat = styled.div`
    label: Stat;
    ${tw`flex gap-2 items-center`};
`;

const Index: React.FC = () => {
    const route = useRouter()
    const [Guilds, setGuilds] = useState<guildAPI[] | undefined>();

    const { data, refetch, loading } = useQuery(gql`
        {
            getGuild {
                id
                name
                memberCount
                iconURL
                roles
            }
        }
    `);

    useMemo(() => {
        if (data) {
            setGuilds(data.getGuild);
        }
    }, [data]);

    return (
        <>
            <CheckLogin>
                <WithNavbar>
                    <div className="flex flex-wrap justify-center gap-3 p-3 ">
                        {!loading ? (
                            Guilds?.map((guild, id) => (
                                <Card onClick={()=>route.push(`/guild/${guild.id}`)} className="card">
                                    <img
                                        src={
                                            guild.iconURL
                                                ? guild.iconURL
                                                : "/avatar.png"
                                        }
                                        className="card-img-top "
                                        alt={guild.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {guild.name}
                                        </h5>
                                        <div className="flex gap-2">
                                            <Stat
                                                title="member count"
                                                className="badge text-bg-primary"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                                {guild.memberCount}
                                            </Stat>
                                            <Stat
                                                title="roles"
                                                className="badge text-bg-primary"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faShield}
                                                />
                                                {guild.roles.length}
                                            </Stat>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                            </div>
                        )}
                    </div>
                </WithNavbar>
            </CheckLogin>
        </>
    );
};

export default Index;
