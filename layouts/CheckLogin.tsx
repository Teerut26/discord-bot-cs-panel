import RequireLogin from "components/Navbar/RequireLogin";
import { useSession } from "next-auth/react";
import React from "react";

interface Props {}


const CheckLogin: React.FC<Props> = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") {
        return <>Loading</>;
    }

    if (status === "unauthenticated") {
        return <RequireLogin />;
    }

    return <>{children}</>;
};

export default CheckLogin;
