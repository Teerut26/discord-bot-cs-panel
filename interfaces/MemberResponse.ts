export interface MemberResponse {
    guildId: string
    joinedTimestamp: number
    premiumSinceTimestamp: any
    nickname?: string
    pending: boolean
    communicationDisabledUntilTimestamp: any
    userId: string
    avatar: any
    displayName: string
    roles: string[]
    avatarURL: any
    displayAvatarURL: string
}