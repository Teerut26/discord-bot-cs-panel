import { css } from "@emotion/css";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import tw from "twin.macro";
import { useLocalStorage } from "usehooks-ts";

interface Props {
    id: string;
    roles: RoleInterface[];
}

export interface RoleInterface {
    name: string;
    id: string;
}

const RoleList: React.FC<Props> = ({ id, roles }) => {
    const [RoleList, setRoleList] = useState<RoleInterface[]>(roles);
    const [RoleList2, setRoleList2] = useState<RoleInterface[]>(roles);

    const [SearchText, setSearchText] = useLocalStorage(
        "guild@seachMembar",
        ""
    );

    const SeachFilter = () => {
        if (SearchText.length === 0) {
            return setRoleList2(RoleList);
        }

        let newData = RoleList?.filter((item) =>
            item.name.toLocaleLowerCase().match(SearchText.toLocaleLowerCase())
        );

        setRoleList2(newData);
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
                    Roles
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
                                    className="modal-title"
                                    id="staticBackdropLabel"
                                >
                                    Roles ({RoleList?.length})
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>

                            <div className="modal-body flex flex-col gap-2">
                                <TextField
                                    variant="filled"
                                    label="ค้นหา role"
                                    type={"search"}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                />
                                <ul className="list-group">
                                    {RoleList2?.map((item, id) => (
                                        <li
                                            className={
                                                css(
                                                    tw`flex justify-between items-center gap-2`
                                                ) + " list-group-item"
                                            }
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="truncate max-w-[11rem]">
                                                    {item.name}
                                                </div>
                                            </div>
                                            <div
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(
                                                        item.id
                                                    );
                                                    toast.success(
                                                        `คัดลอกสำเร็จ ${item.id}`
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

export default RoleList;
