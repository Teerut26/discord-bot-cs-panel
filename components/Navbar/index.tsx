import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import styled from "@emotion/styled";
import Navlink from "../NavLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faDashboard, faRocket } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const Title = styled.a`
    font-weight: bold;
`;
const LogoutButton = styled.button`
    font-weight: bold;
`;

interface Props {}

const Navbar: React.FC<Props> = () => {
    const route = useRouter()
    const { status } = useSession();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <Title onClick={()=>route.push("/")} className="navbar-brand" href="#">
                        Discord Bot CS Panel
                    </Title>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Navlink href="/">
                                    <a
                                        className="nav-link active flex"
                                        aria-current="page"
                                        href="/"
                                    >
                                        <FontAwesomeIcon icon={faDashboard} />{" "}
                                        Dashboard
                                    </a>
                                </Navlink>
                            </li>
                            
                            <li className="nav-item">
                                <Navlink href="/webhook">
                                    <a
                                        className="nav-link active flex"
                                        aria-current="page"
                                        href="/webhook"
                                    >
                                        <FontAwesomeIcon icon={faRocket} />{" "}
                                        Webhook
                                    </a>
                                </Navlink>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            {status === "authenticated" ? (
                                <LogoutButton
                                    onClick={() => signOut()}
                                    className="btn btn-outline-danger"
                                >
                                    Logout
                                </LogoutButton>
                            ) : (
                                ""
                            )}
                        </form>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
