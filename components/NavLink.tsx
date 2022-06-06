import styled, { CreateStyled } from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
    href: string;
}

const Navlink: React.FC<Props> = ({ href, children }) => {
    const router = useRouter();

    return (
        <>
            <Link href={href}>
                <div className={router.pathname == href ? "font-semibold" : ""}>
                    {children}
                </div>
            </Link>
        </>
    );
};

export default Navlink;
