import { gql, useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { News } from "interfaces/news";
import React from "react";
import toast from "react-hot-toast";
import RootTable from "../Table";

interface Props {
    newsList: News[];
    onRefresh?: () => void;
}

const History: React.FC<Props> = ({ newsList, onRefresh }) => {
    const [deleteNews] = useMutation(gql`
        mutation ($id: String!) {
            deleteNews(id: $id) {
                id
            }
        }
    `);
    return (
        <>
            <RootTable
                columns={[
                    {
                        Header: "Action",
                        accessor: (data: any) => (
                            <Button
                                onClick={async () => {
                                    let keyDelete = toast.loading(
                                        `กำลังลบ ${data.embeds[0]?.title}`
                                    );
                                    await deleteNews({
                                        variables: {
                                            id: data.id,
                                        },
                                    });
                                    toast.success(
                                        `กำลังลบ ${data.embeds[0]?.title}`,
                                        {
                                            id: keyDelete,
                                        }
                                    );
                                    if (onRefresh) return onRefresh();
                                }}
                                variant="contained"
                                color="error"
                            >
                                ลบ
                            </Button>
                        ),
                    },
                    {
                        Header: "ชื่อเรื่อง",
                        accessor: (data: any) => data.embeds[0]?.title,
                    },
                    {
                        Header: "รายละเอียด",
                        accessor: (data: any) => data.embeds[0]?.description,
                    },
                ]}
                data={newsList}
                title={""}
            />
        </>
    );
};

export default History;
