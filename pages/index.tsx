import WithNavbar from "layouts/WithNavbar";
import React from "react";
import CheckLogin from "layouts/CheckLogin";

const Index: React.FC = () => {
    return (
        <>
            <CheckLogin>
                <WithNavbar>dfg</WithNavbar>
            </CheckLogin>
        </>
    );
};

export default Index;
