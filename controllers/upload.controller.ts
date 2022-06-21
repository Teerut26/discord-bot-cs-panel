import db from "@/config/firestore";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import {
    FileBody,
    FileUploadRequest,
} from "interfaces/file-upload-request.interface";
import { Token } from "interfaces/token.interface";
import catchErrorsFrom from "libs/_utils/errors";
import Discord from "modules/Discord";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { Readable } from "stream";

const Upload = async (req: FileUploadRequest, res: NextApiResponse) => {
    let token = (await getToken({
        req,
        secret: process.env.SECRET!,
    })) as Token;

    const { title, description, channelID, imageURL } = req.body;

    if (!channelID) {
        throw new Error("ข้อมูลไม่ครบ");
    }

    let image_list: MessageAttachment[] = [];

    try {
        if (!req.files.file.length) {
            let item = req.files.file as FileBody;
            const stream = Readable.from(item.data);
            const attachment = new MessageAttachment(stream, `${item.md5}.png`);
            image_list.push(attachment);
        } else if (req.files.file.length) {
            req.files.file.slice(0, 5).map((item: FileBody) => {
                const stream = Readable.from(item.data);
                const attachment = new MessageAttachment(
                    stream,
                    `${item.md5}.png`
                );
                image_list.push(attachment);
            });
        }
    } catch (error) {}

    let newEmbed = new MessageEmbed();
    try {
        newEmbed.setTitle(title);
        newEmbed.setDescription(description);
    } catch (error) {}

    let resMessage: Message<boolean> | undefined = undefined;

    let user = await new Discord().getUserInfo(token.sub);

    if (!newEmbed.title) {
        resMessage = await new Discord().sendMessage(
            [],
            image_list,
            imageURL ? JSON.parse(imageURL) : [],
            channelID,
            user
        );
    } else {
        resMessage = await new Discord().sendMessage(
            [newEmbed],
            image_list,
            imageURL ? JSON.parse(imageURL) : [],
            channelID,
            user
        );
    }
    let NewsCollection = db.collection("news");

    await NewsCollection.add({
        messageID: resMessage.id,
        author: JSON.parse(JSON.stringify(user)),
        channelID: resMessage.channelId,
        guildID: resMessage.guildId,
        embeds: JSON.parse(JSON.stringify(resMessage.embeds)),
        attachments: JSON.parse(JSON.stringify(resMessage.attachments)),
        timestamp: new Date().toJSON(),
    });

    res.send({
        status: "success",
        message: "ส่งข้อมูลสำเร็จ",
    });
};

export default catchErrorsFrom(Upload);
