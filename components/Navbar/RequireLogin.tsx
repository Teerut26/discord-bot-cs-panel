import Link from "next/link";
import React from "react";

interface Props {}

const RequireLogin: React.FC<Props> = () => {
    
    return (
        <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
                <div className="font-bold text-2xl">ต้องเข้าสู่ระบบก่อน</div>
                <Link href={"/login"}>
                    <a href="/login">
                        <div className="btn btn-primary">เข้าสู่ระบบ</div>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default RequireLogin;
