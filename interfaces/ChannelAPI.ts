export interface ChannelAPI {
    id: string
    type: number
    name: string
    position: number
    flags: number
    parent_id?: string
    guild_id: string
    permission_overwrites: PermissionOverwrite[]
    last_message_id?: string
    topic?: string
    last_pin_timestamp?: string
    rate_limit_per_user?: number
    nsfw?: boolean
    bitrate?: number
    user_limit?: number
    rtc_region?: string
  }
  
  export interface PermissionOverwrite {
    id: string
    type: number
    allow: string
    deny: string
  }