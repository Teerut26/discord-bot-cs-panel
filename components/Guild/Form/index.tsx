import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { News } from "interfaces/news";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import tw from "twin.macro";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import { GuildResponse } from "interfaces/GuildResponse";
import SelectChannel from "@/components/SelectChannel";
import InputFormComponent from "./input-form.component";
import { Tabselect } from "interfaces/types/tabselect.type";
import axios from "axios";

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
    url?: string;
    file?: File;
    uuid?: string;
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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        ChannelSelect!.map(async (channel) => {
            let keyToast = toast.loading(`กำลังส่ง ${channel.name}`);

            try {
                let dataForm = new FormData();
                dataForm.append("channelID", channel.id);
                dataForm.append("title", newsForm.title);
                dataForm.append("description", newsForm.description);
                dataForm.append("guildID", guildID);

                let imageURLs: string[] = [];

                ImageUrlList.map(async (image) => {
                    if (image.file) {
                        dataForm.append("file", image.file);
                    } else if (image.url) {
                        imageURLs.push(image.url);
                    }
                });

                console.log(JSON.stringify(imageURLs));

                dataForm.append('imageURL', JSON.stringify(imageURLs).toString());

                let res = await axios({
                    method: "post",
                    url: "/api/upload",
                    data: dataForm,
                });

                toast.success(`สำเร็จ ${channel.name}`, {
                    id: keyToast,
                });

                console.log(res.data);
            } catch (error: any) {
                toast.error(`ผิดพลาด ${error.message}`, {
                    id: keyToast,
                });
            }
        });
        setTimeout(() => {
            if (onRefresh) return onRefresh();
        }, 1000);
    };

    const Mention = (text: string) => {
        setNewsForm((pre) => ({
            ...pre,
            description: pre.description + text,
        }));
    };

    const handleFormChange = (
        index: number,
        isFile: boolean,
        event: React.ChangeEvent<HTMLInputElement>,
        type: Tabselect
    ) => {
        let fileList = event.target.files;

        let data = [...ImageUrlList];

        if (type === "file") {
            if (!fileList) return;
            data[index].file = fileList[0];
            data[index].url = undefined;
        } else {
            data[index].url = event.target.value;
            data[index].file = undefined;
        }

        setImageUrlList(data);
    };

    const deleteINPUT = (item: ImageURL) => {
        let oldDataWithoutSelf = ImageUrlList.filter(
            (data) => data.uuid !== item.uuid
        );
        setImageUrlList(oldDataWithoutSelf);
    };

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
                            <Badge
                                className="badge text-bg-primary"
                                onClick={async () => {
                                    let result =
                                        await navigator.clipboard.readText();
                                    console.log(result);
                                    Mention(`<@${result}>`);
                                }}
                            >
                                @role
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
                    {ImageUrlList.length > 0 ? (
                        <div className="text-danger font-bold">
                            * ถ้าคุณกดเปลี่ยนชนิดการอัพโหลด Form จะ Reset
                        </div>
                    ) : (
                        ""
                    )}

                    {ImageUrlList.map((item, id) => (
                        <InputFormComponent
                            key={id}
                            handleFormChange={(...agrs) =>
                                handleFormChange(...agrs)
                            }
                            deleteINPUT={deleteINPUT}
                            id={id}
                            item={item}
                        />
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
