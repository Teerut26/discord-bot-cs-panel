import CheckLogin from "@/layouts/CheckLogin";
import WithNavbar from "@/layouts/WithNavbar";
import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { channelID } from "interfaces/channelID";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Container = styled.div`
    max-width: 50rem;
    margin: auto;
`;

interface Props {}

const Webhook: React.FC<Props> = () => {
    const [WebhookForm, setWebhookForm] = useState<channelID | undefined>();
    const [WebhookList, setWebhookList] = useState<channelID[] | undefined>();
    const { data, refetch } = useQuery(gql`
        {
            getWebhook {
                id
                title
                url
                timestamp
            }
        }
    `);
    const [addWebhook] = useMutation(gql`
        mutation ($title: String!, $url: String!) {
            addWebhook(Webhook: { title: $title, url: $url }) {
                title
                url
                timestamp
            }
        }
    `);

    const [deleteWebhook] = useMutation(gql`
        mutation ($id: String!) {
            deleteWebhook(id: $id) {
                id
            }
        }
    `);

    useEffect(() => {
        if (data) {
            setWebhookList(data.getWebhook);
        }
    }, [data]);

    const onSubmit = async (e: React.FormEvent) => {
        const toastId = toast.loading("Loading...");
        e.preventDefault();
        await addWebhook({
            variables: WebhookForm,
        });
        await refetch();
        setWebhookForm({
            title: "",
            url: "",
        });
        toast.success("success", {
            id: toastId,
        });
    };

    const onDelete = async (item: channelID) => {
        const toastId = toast.loading("กำลังลบ | " + item.title);
        await deleteWebhook({
            variables: {
                id: item.id,
            },
        });
        await refetch();
        toast.success("success", {
            id: toastId,
        });
    };

    return (
        <>
            <CheckLogin>
                <WithNavbar>
                    <Container className="p-3 flex flex-col gap-3">
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                >
                                    Title
                                </label>
                                <input
                                    onChange={(e) =>
                                        setWebhookForm(
                                            (pre) =>
                                                ({
                                                    ...pre,
                                                    title: e.target.value,
                                                } as channelID)
                                        )
                                    }
                                    value={WebhookForm?.title}
                                    required
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                >
                                    URL Webhook
                                </label>
                                <input
                                    onChange={(e) =>
                                        setWebhookForm(
                                            (pre) =>
                                                ({
                                                    ...pre,
                                                    url: e.target.value,
                                                } as channelID)
                                        )
                                    }
                                    value={WebhookForm?.url}
                                    required
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary flex w-full"
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="mr-2"
                                />
                                เพิ่ม Webhook
                            </button>
                        </form>
                        <ol className="list-group list-group-numbered">
                            {WebhookList?.map((item, id) => (
                                <li
                                    key={id}
                                    className="list-group-item d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto overflow-hidden">
                                        <div className="fw-bold">
                                            {item.title}
                                        </div>
                                        <div className="truncate">
                                            {item.url}
                                        </div>
                                    </div>
                                    <span
                                        onClick={() => onDelete(item)}
                                        className="badge bg-danger rounded-pill cursor-pointer"
                                    >
                                        ลบ
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </Container>
                </WithNavbar>
            </CheckLogin>
        </>
    );
};

export default Webhook;
