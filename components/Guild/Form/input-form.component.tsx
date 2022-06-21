import { Tabselect } from "interfaces/types/tabselect.type";
import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

interface ImageURL {
    url?: string;
    file?: File;
    uuid?: string;
}

interface Props {
    handleFormChange: (
        id: number,
        isFile: boolean,
        e: React.ChangeEvent<HTMLInputElement>,
        type: Tabselect
    ) => void;
    id: number;
    item: ImageURL;
    deleteINPUT: (item: ImageURL) => void;
}

const InputFormComponent: React.FC<Props> = ({
    handleFormChange,
    id,
    item,
    deleteINPUT,
}) => {
    const [TabSelect, setTabSelect] = useState<Tabselect>("link");
    return (
        <div className="flex items-center border-2 p-2 relative ml-3">
            <div className="text-2xl font-bold px-3 ">{id + 1}</div>
            <div className="flex-1">
                <Tabs
                    onSelect={(v) => setTabSelect(v as Tabselect)}
                    defaultActiveKey="link"
                >
                    <Tab eventKey="link" title="URL">
                        <input
                            key={TabSelect}
                            className="form-control mt-2"
                            type="text"
                            value={item.url}
                            placeholder="Image URL"
                            onChange={(e) =>
                                handleFormChange(id, false, e, TabSelect)
                            }
                        />
                    </Tab>
                    <Tab eventKey="file" title="File">
                        <input
                            key={TabSelect}
                            className="form-control mt-2"
                            type="file"
                            placeholder="Image URL"
                            onChange={async (e) =>
                                handleFormChange(id, true, e, TabSelect)
                            }
                        />
                    </Tab>
                </Tabs>
            </div>
            <div
                onClick={() => deleteINPUT(item)}
                className="absolute top-[5px] right-[5px] select-none cursor-pointer font-extrabold badge text-bg-danger"
            >
                x
            </div>
        </div>
    );
};

export default InputFormComponent;
