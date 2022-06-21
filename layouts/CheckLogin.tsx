import RequireLogin from "components/Navbar/RequireLogin";
import { useSession } from "next-auth/react";
import React from "react";

interface Props {}

const CheckLogin: React.FC<Props> = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                <div className="spinner-border w-[4rem] h-[4rem]" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <RequireLogin />;
    }

    return <>{children}</>;
};

export default CheckLogin;
