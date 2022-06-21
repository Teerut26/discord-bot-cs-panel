import { NextApiRequest, NextApiResponse } from "next";

export default function catchErrorsFrom(handler: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        return handler(req, res).catch((error: any) => {
            console.error(error);
            return res.status(500).json({
                message: error.message || error,
                data: null,
            });
        });
    };
}
