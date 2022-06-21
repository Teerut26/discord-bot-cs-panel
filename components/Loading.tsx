import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {}

const Loading: React.FC<Props> = () => {
    return (
        <>
            <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                <div className="spinner-border w-[5rem] h-[5rem]" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    );
};

export default Loading;
