import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Warning } from "@mui/icons-material";
import { Button, TextareaAutosize, TextField } from "@mui/material";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { News } from "interfaces/news";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import tw from "twin.macro";
import { useLocalStorage } from "usehooks-ts";
import SelectChannel from "../SelectChannel";
import { v4 as uuidv4 } from "uuid";
import { GuildResponse } from "interfaces/GuildResponse";

const Description = styled.textarea``;
const Badge = styled.div`
    ${tw`cursor-pointer select-none`}
    :hover {
        opacity: 90%;
    }
`;

interface Props {
    channels: ChannelAPI[];
    guildInfo: GuildResponse;
    guildID: string;
    onRefresh?: () => void;
}

interface ImageURL {
    url: string;
    uuid: string;
}

const Form: React.FC<Props> = ({ channels, guildID, onRefresh, guildInfo }) => {
    const [SelectChannelKey, setSelectChannelKey] = useState(0);
    const [ImageUrlList, setImageUrlList] = useState<ImageURL[]>([]);
    const [newsForm, setNewsForm] = useLocalStorage<News>(
        `newsForm@${guildID}`,
        {
            title: "",
            description: "",
        }
    );

    const [ChannelSelect, setChannelSelect] = useLocalStorage<
        ChannelAPI[] | undefined
    >(`channelSelect@${guildID}`, []);

    const [ShowRolesOption, setShowRolesOption] = useState<boolean>(false);

    const [addNews] = useMutation(gql`
        mutation ($addNews: AddNewsInput!) {
            addNews(news: $addNews) {
                title
                description
                timestamp
            }
        }
    `);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !ChannelSelect ||
            newsForm.title.length === 0 ||
            newsForm.description.length === 0
        ) {
            return toast.error("กรอกข้อมูลไม่ครบ");
        }

        ChannelSelect.map(async (channel) => {
            let keyToast = toast.loading(`กำลังส่ง ${channel.name}`);
            await addNews({
                variables: {
                    addNews: {
                        title: newsForm.title,
                        guildID: guildID,
                        channelID: channel.id,
                        description: newsForm.description,
                    },
                },
            });
            toast.success(`สำเร็จ ${channel.name}`, {
                id: keyToast,
            });
        });
        setTimeout(() => {
            if (onRefresh) return onRefresh();
        }, 1000);
        setNewsForm({
            title: "",
            description: "",
        });
    };

    const Mention = (text: string) => {
        setNewsForm((pre) => ({
            ...pre,
            description: pre.description + text,
        }));
    };

    const handleFormChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let data = [...ImageUrlList];
        data[index].url = event.target.value;
        setImageUrlList(data);
    };

    const deleteINPUT = (item: ImageURL) => {
        let oldDataWithoutSelf = ImageUrlList.filter(
            (data) => data.uuid !== item.uuid
        );
        setImageUrlList(oldDataWithoutSelf);
    };

    useMemo(() => {
        if (newsForm.description.match(/@$/gm)) {
            setShowRolesOption(true);
        } else {
            setShowRolesOption(false);
        }
    }, [newsForm]);

    return (
        <>
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
                <TextField
                    onChange={(e) =>
                        setNewsForm((pre) => ({
                            ...pre,
                            title: e.target.value,
                        }))
                    }
                    value={newsForm.title}
                    sx={{ width: "100%" }}
                    label="ชื่อเรื่อง"
                    variant="outlined"
                />
                <div className="flex flex-col gap-2 relative">
                    {ShowRolesOption && (
                        <div className="absolute bottom-[8.5rem] py-2 z-50 rounded-xl bg-white shadow-md border-2 right-0 left-0">
                            {guildInfo.roles.map((role, id) => (
                                <div
                                    onClick={() => {
                                        console.log(role);
                                        let newData =
                                            newsForm.description.replace(
                                                /@$/gm,
                                                `<@&${role.id}>`
                                            );
                                        setNewsForm((pre) => ({
                                            ...pre,
                                            description: newData,
                                        }));
                                    }}
                                    className="cursor-pointer px-2 hover:bg-gray-300"
                                    key={id}
                                >
                                    {role.name}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <div className={css(tw`flex gap-2`)}>
                            <Badge
                                onClick={() => Mention("@everyone")}
                                className="badge text-bg-primary"
                            >
                                @everyone
                            </Badge>
                            <Badge
                                className="badge text-bg-primary"
                                onClick={async () => {
                                    let result =
                                        await navigator.clipboard.readText();
                                    console.log(result);
                                    Mention(`<@${result}>`);
                                }}
                            >
                                @user
                            </Badge>
                        </div>
                        <div className={css(tw`flex gap-2`)}>
                            <Badge
                                onClick={() =>
                                    setNewsForm((pre) => ({
                                        ...pre,
                                        description: "",
                                    }))
                                }
                                className="badge text-bg-danger"
                            >
                                clear
                            </Badge>
                        </div>
                    </div>
                    <Description
                        onChange={(e) => {
                            setNewsForm((pre) => ({
                                ...pre,
                                description: e.target.value,
                            }));
                        }}
                        value={newsForm.description}
                        className="form-control"
                        placeholder="รายละเอียด"
                        style={{ height: 100 }}
                        defaultValue={""}
                    />
                    <div className={css(tw`flex gap-2`)}>
                        <Badge
                            onClick={() =>
                                setImageUrlList((pre) => [
                                    ...pre,
                                    {
                                        url: "",
                                        uuid: uuidv4(),
                                    },
                                ])
                            }
                            className="badge text-bg-primary"
                        >
                            <FontAwesomeIcon icon={faPlus} /> เพิ่มรูปภาพ
                        </Badge>
                    </div>
                    {ImageUrlList.map((item, id) => (
                        <div className={css(tw`flex gap-2`)}>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Image URL"
                                onChange={(e) => handleFormChange(id, e)}
                            />
                            <div
                                onClick={() => deleteINPUT(item)}
                                className="btn btn-danger"
                            >
                                ลบ
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <SelectChannel
                        key={SelectChannelKey}
                        channels={channels}
                        onSelect={(v) => setChannelSelect(v)}
                        defaultValue={ChannelSelect!}
                    />
                </div>
                <Button
                    type="submit"
                    sx={{
                        p: 2,
                        borderRadius: 3,
                    }}
                    variant="contained"
                >
                    Send
                </Button>
            </form>
        </>
    );
};

export default Form;
