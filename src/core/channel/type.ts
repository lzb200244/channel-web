import { IAccount } from '@src/core/account/type';
/**
 * 操作类型：撤回，删除，点赞，回复，@
 */

/**
 * 消息类型
 */
export enum MessageTypeEnum {
    // 下线推送
    LEVEL_PUSH = 1,
    // 上线推送
    ONLINE_PUSH,
    // 消息推送
    MESSAGE_PUSH,
    Delete,
    WithDraw,
    Thumb,
    Replay,
    Mention,
}

export interface MessageItem {
    // 内容
    content: string
    // 发送时间
    time: number
    type: number
    id: number
}

/**
 * 消息体
 */
export interface Message {
    // 消息类型
    type: MessageTypeEnum
    message: MessageItem
    // 发送者信息
    user: IAccount
}

export type PushMessageItem = Pick<IAccount, | 'name' | 'userID' | 'avatar'>;

export interface PushMessage {
    type: MessageTypeEnum
    message: PushMessageItem
}

export interface OptMessageItem {
    optUser: string;
    optUserID: number;
    optID:number
    msg?:string

}

export interface OptMessage {
    type: MessageTypeEnum
    message: OptMessageItem
}
