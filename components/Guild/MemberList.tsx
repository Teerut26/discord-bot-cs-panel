import { useQuery } from "@apollo/client";
import { css } from "@emotion/css";
import { faCopy, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import { gql } from "apollo-server-core";
import { MemberResponse } from "interfaces/MemberResponse";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import tw from "twin.macro";
import { useLocalStorage } from "usehooks-ts";
import Loading from "../Loading";

interface Props {
    id: string;
    guildID: string;
}

const MemberList: React.FC<Props> = ({ id, guildID }) => {
    const [MemberList, setMemberList] = useState<
        MemberResponse[] | undefined
    >();
    const [MemberList2, setMemberList2] = useState<
        MemberResponse[] | undefined
    >();

    const [SearchText, setSearchText] = useLocalStorage(
        "guild@seachMembar",
        ""
    );

    const { loading, refetch } = useQuery(
        gql`
            query ($option: MemberResponseInput!) {
                getMember(option: $option) {
                    userId
                    displayName
                    displayAvatarURL
                    roles
                }
            }
        `,
        {
            variables: {
                option: {
                    guildID: guildID,
                },
            },
            onCompleted: (data) => {
                setMemberList(data.getMember);
                setMemberList2(data.getMember);
            },
        }
    );

    const SeachFilter = () => {
        if (SearchText.length === 0) {
            return setMemberList2(MemberList);
        }

        let newData = MemberList?.filter((item) =>
            item.displayName
                .toLocaleLowerCase()
                .match(SearchText.toLocaleLowerCase())
        );

        setMemberList2(newData);
    };

    useMemo(() => {
        SeachFilter();
    }, [SearchText]);

    return (
        <>
            <div>
                {/* Button trigger modal */}
                <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#${id}`}
                >
                    Members
                </button>
                {/* Modal */}
                <div
                    className="modal fade"
                    id={id}
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className={css(tw`max-w-[53rem]`) + " modal-dialog"}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title flex gap-2 items-center"
                                    id="staticBackdropLabel"
                                >
                                    Member ({MemberList?.length})
                                    <div onClick={()=>refetch()} className="btn btn-sm btn-primary">
                                        <FontAwesomeIcon icon={faRefresh} />
                                    </div>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            {!loading ? (
                                <div className="modal-body flex flex-col gap-2">
                                    <TextField
                                        variant="filled"
                                        label="ค้นหา user"
                                        type={"search"}
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                    />
                                    <ul className="list-group">
                                        {MemberList2?.map((item, id) => (
                                            <li
                                                className={
                                                    css(
                                                        tw`flex justify-between items-center gap-2`
                                                    ) + " list-group-item"
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={
                                                            item.displayAvatarURL
                                                        }
                                                        className="w-10 rounded-full"
                                                        alt=""
                                                    />
                                                    <div className="truncate max-w-[11rem]">
                                                        {item.displayName}
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(
                                                            item.userId
                                                        );
                                                        toast.success(
                                                            `คัดลอกสำเร็จ ${item.userId}`
                                                        );
                                                    }}
                                                    className="btn btn-primary "
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCopy}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <Loading />
                            )}

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberList;
