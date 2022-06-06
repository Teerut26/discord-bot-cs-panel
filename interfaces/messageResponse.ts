export interface messageResponse {
    messageID?: string;
    id?: string;
    type: number;
    content: string;
    channel_id: string;
    author: Author;
    attachments: any[];
    embeds: Embed[];
    mentions: any[];
    mention_roles: any[];
    pinned: boolean;
    mention_everyone: boolean;
    tts: boolean;
    timestamp: string;
    edited_timestamp: any;
    flags: number;
    components: any[];
    referenced_message: any;
}

export interface Author {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration: any;
    discriminator: string;
    public_flags: number;
    bot: boolean;
}

export interface Embed {
    type: string;
    title: string;
    description: string;
}
