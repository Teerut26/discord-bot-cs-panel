import { gql, useMutation } from "@apollo/client";
import { Warning } from "@mui/icons-material";
import { Button, styled, TextareaAutosize, TextField } from "@mui/material";
import { ChannelAPI } from "interfaces/ChannelAPI";
import { News } from "interfaces/news";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import SelectChannel from "../SelectChannel";

const Description = styled("textarea")``;

interface Props {
    channels: ChannelAPI[];
    guildID: string;
    onRefresh?: () => void;
}

const Form: React.FC<Props> = ({ channels, guildID, onRefresh }) => {
    const [SelectChannelKey, setSelectChannelKey] = useState(0);
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
                <Description
                    onChange={(e) =>
                        setNewsForm((pre) => ({
                            ...pre,
                            description: e.target.value,
                        }))
                    }
                    value={newsForm.description}
                    className="form-control"
                    placeholder="รายละเอียด"
                    style={{ height: 100 }}
                    defaultValue={""}
                />
                <div className="flex flex-col gap-3">
                    {/* <button
                        onClick={() => {
                            setChannelSelect(channels);
                            setSelectChannelKey((pre) => pre + 1);
                        }}
                        className="flex gap-2 btn btn-danger"
                    >
                       <Warning fontSize="15" /> Broadcast
                    </button> */}
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
