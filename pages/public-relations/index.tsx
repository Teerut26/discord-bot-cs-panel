import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RootTable from "components/Table";
import { News } from "interfaces/news";
import { WebhookURL } from "interfaces/webhookUrl";
import CheckLogin from "layouts/CheckLogin";
import WithNavbar from "layouts/WithNavbar";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Column, Row } from "react-table";

interface Props {}

const TitleForm = styled.div`
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const PublicRelations: React.FC<Props> = () => {
    const [News, setNews] = useState<News[] | undefined>();
    const [News2, setNews2] = useState<News[] | undefined>();
    const [NewsForm, setNewsForm] = useState<News>({
        description: "",
        title: "",
        webhookURL: "",
    });
    const [WebhookList, setWebhookList] = useState<WebhookURL[] | undefined>();
    const { data, refetch } = useQuery(gql`
        {
            getNews {
                id
                title
                webhookURL
                description
                timestamp
            }
            getWebhook {
                id
                title
                url
                timestamp
            }
        }
    `);

    const [addNews] = useMutation(gql`
        mutation ($addNews: AddNewsInput!) {
            addNews(news: $addNews) {
                title
                description
                timestamp
                webhookURL
            }
        }
    `);

    const [deleteNews] = useMutation(gql`
        mutation ($id: String!) {
            deleteNews(id: $id) {
                id
            }
        }
    `);

    useEffect(() => {
        if (data) {
            setNews(data.getNews);
            setNews2(data.getNews);
            setWebhookList(data.getWebhook);
        }
    }, [data]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (NewsForm.webhookURL === "all") {
            WebhookList?.map(async (webhook) => {
                const toastId = toast.loading(
                    `กำลังส่ง channel: ${webhook.title}`
                );
                await addNews({
                    variables: {
                        addNews: { ...NewsForm, webhookURL: webhook.url },
                    },
                });
                toast.success(`ส่งสำเร็จ channel: ${webhook.title}`, {
                    id: toastId,
                });
            });
            setTimeout(async () => {
                await refetch();
            }, 1500);
            return setNewsForm({
                description: "",
                title: "",
                webhookURL: "all",
            });
        }

        if (
            NewsForm.webhookURL.length === 0 ||
            NewsForm.title.length === 0 ||
            NewsForm.description.length === 0
        ) {
            return toast.error("กรอกข้อมูลไม่ครบ");
        }
        const toastId = toast.loading("Loading...");
        await addNews({
            variables: {
                addNews: { ...NewsForm },
            },
        });
        await refetch();
        setNewsForm({
            description: "",
            title: "",
            webhookURL: NewsForm.webhookURL,
        });
        return toast.success("success", {
            id: toastId,
        });
    };

    const onDelete = async (item: News) => {
        const toastId = toast.loading("กำลังลบ | " + item.title);
        await deleteNews({
            variables: {
                id: item.id,
            },
        });
        setTimeout(async () => {
            await refetch();
        }, 1000);

        toast.success("success", {
            id: toastId,
        });
    };

    const columns: Column[] = [
        {
            Header: "ชื่อเรื่อง",
            accessor: (data: any) => data.title,
        },
        {
            Header: "รายละเอียด",
            accessor: (data: any) => data.description,
        },
        {
            Header: "วันที่",
            accessor: (data: any) => (
                <>{new Date(data.timestamp).toLocaleString()}</>
            ),
        },
        {
            Header: "Action",
            accessor: (data: any) => (
                <button
                    onClick={() => onDelete(data)}
                    className="btn btn-sm btn-danger"
                >
                    ลบ
                </button>
            ),
        },
    ];

    const SelectFilter = () => {
        if (NewsForm.webhookURL === "all") {
            return setNews2(News);
        }
        let result = News?.filter(
            (news) => news.webhookURL === NewsForm.webhookURL
        );
        setNews2(result);
    };

    useMemo(() => {
        SelectFilter()
    }, [NewsForm]);

    

    return (
        <CheckLogin>
            <WithNavbar>
                <div className="flex flex-col gap-3 md:flex-row p-3">
                    <form onSubmit={onSubmit} className="md:w-1/2 w-full">
                        <TitleForm>ชื่อเรื่อง</TitleForm>
                        <div className="mb-3">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                ชื่อเรื่อง
                            </label>
                            <input
                                onChange={(e) =>
                                    setNewsForm(
                                        (pre) =>
                                            ({
                                                ...pre,
                                                title: e.target.value,
                                            } as News)
                                    )
                                }
                                value={NewsForm?.title}
                                required
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                รายละเอียด
                            </label>
                            <textarea
                                required
                                onChange={(e) =>
                                    setNewsForm(
                                        (pre) =>
                                            ({
                                                ...pre,
                                                description: e.target.value,
                                            } as News)
                                    )
                                }
                                value={NewsForm?.description}
                                className="form-control"
                                cols={30}
                                rows={10}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                เลือก channel
                            </label>
                            <select
                                className="form-select"
                                required
                                value={
                                    NewsForm.webhookURL.length < 1
                                        ? "null"
                                        : NewsForm.webhookURL
                                }
                                onChange={(e) => {
                                    if (e.target.value !== "null") {
                                        setNewsForm(
                                            (pre) =>
                                                ({
                                                    ...pre,
                                                    webhookURL: e.target.value,
                                                } as News)
                                        );
                                    }
                                }}
                            >
                                <option disabled value={"null"}>
                                    เลือก channel
                                </option>
                                <option selected value={"all"}>
                                    ทั้งหมด
                                </option>
                                {WebhookList?.map((webhook, id) => (
                                    <option key={id} value={webhook.url}>
                                        {webhook.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex w-full">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className="md:w-1/2 w-full ">
                        <TitleForm className="flex gap-2 items-center ">
                            ประวัติการประชาสัมพันธ์
                            <FontAwesomeIcon
                                className="btn btn-primary"
                                onClick={async () => {
                                    setNews2(undefined);
                                    let data = await refetch();
                                    setNews(data.data.getNews);
                                    setNews2(data.data.getNews);
                                    SelectFilter()
                                }}
                                icon={faRefresh}
                            />
                        </TitleForm>
                        <RootTable
                            columns={columns}
                            data={News2}
                            title={""}
                            sortBy={[{ id: "วันที่", desc: false }]}
                        />
                    </div>
                </div>
            </WithNavbar>
        </CheckLogin>
    );
};

export default PublicRelations;
