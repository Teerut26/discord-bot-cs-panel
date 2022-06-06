import Navbar from "components/Navbar";
import React from "react";

interface Props {}

const WithNavbar: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default WithNavbar;
