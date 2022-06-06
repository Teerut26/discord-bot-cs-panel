import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {}

const LoginWithDiscord = styled.button`
    label: LoginWithDiscord;
    background-color: #5865f2 !important;
    border-width: 0;
    color: white;
    display: flex;
    align-items: center;
    padding: 20px;
    font-size: 1.2rem;
    gap: 0.5rem !important;
    :hover {
        color: white;
        background-color: #414dd4 !important;
    }
    :focus {
        color: white;
    }
`;

const Login: React.FC<Props> = () => {
    const [Loading, setLoading] = useState<boolean>(false);
    const route = useRouter();
    const { status } = useSession();

    const onSignIn = async () => {
        setLoading((pre) => !pre);
        signIn("discord", { redirect: false });
    };

    useEffect(() => {
        if (status === "authenticated") {
            route.push("/");
        }
    }, [status]);

    return (
        <>
            <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <LoginWithDiscord
                        onClick={() => onSignIn()}
                        className="font-bold btn"
                    >
                        {Loading ? (
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                size="lg"
                                spin
                            />
                        ) : (
                            <FontAwesomeIcon icon={faDiscord} size="lg" />
                        )}
                        Login With Discord
                    </LoginWithDiscord>
                </div>
            </div>
        </>
    );
};

export default Login;
