import { NextApiRequest } from "next";

export interface FileUploadRequest extends NextApiRequest {
    files: File1;
}

interface File1 {
    [key: string]: any;
}

export interface FileBody {
    name: string;
    data: Buffer;
    size: number;
    encoding: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
}