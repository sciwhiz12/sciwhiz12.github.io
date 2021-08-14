declare type Snowflake = string
declare type UserName  = string
declare type RoleName  = string

interface QuoteData {
    users  : [UserName: User]
    roles  : [RoleName: Role]
    quotes : (Quote|null)[]
}

declare class User {
    id            : Snowflake
    username      : UserName
    discriminator : number
    nickname      : string
    avatar        : string
    tag          ?: string
    roles         : RoleName[]
}

declare class Role {
    color : string
    name  : string
    css  ?: string
}

declare class Quote {
    user       : UserName
    text       : string
    side_text ?: string
    nsfw      ?: boolean
}
