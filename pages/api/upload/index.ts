import Upload from "controllers/upload.controller";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import nc from "next-connect";
import fileUpload from "express-fileupload";
import { FileUploadRequest } from "interfaces/file-upload-request.interface";

const handler = nc<FileUploadRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    .use(fileUpload())
    .post(async (req, res) => {
        let token = await getToken({
            req,
            secret: process.env.SECRET!,
        });

        if (!token) {
            return res.status(404).send("ต้องเข้าสู่ระบบก่อน");
        }
        return Upload(req, res);
    });

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
