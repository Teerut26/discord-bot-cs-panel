export interface messageResponse {
    channelId: string
    guildId: string
    id: string
    createdTimestamp: number
    type: string
    system: boolean
    content: string
    authorId: string
    pinned: boolean
    tts: boolean
    nonce: any
    embeds: Embed[]
    components: any[]
    attachments: any[]
    stickers: any[]
    editedTimestamp: any
    webhookId: any
    groupActivityApplicationId: any
    applicationId: any
    activity: any
    flags: number
    reference: any
    interaction: any
    cleanContent: string
  }
  
  export interface Embed {
    type: string
    title: string
    description: string
    url: any
    color: any
    timestamp: any
    fields: any[]
    thumbnail: any
    image: any
    video: any
    author: any
    provider: any
    footer: any
  }
  