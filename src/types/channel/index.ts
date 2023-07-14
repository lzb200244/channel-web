import { Account } from '@src/types/account';
import { MessageContentEnum, MessageTypeEnum } from '@src/types/channel/enum';

export interface MessageStatus {
    dislikeCount: number;
    likeCount: number;
    userIsLike: boolean;
    isDrop: boolean
}

export interface MessageItemType {
    content: string;
    msgID?: number;
    messageStatus?: MessageStatus;
    time: number;
    type: MessageContentEnum;
}

export interface MessageType {
    user: Account;
    message: MessageItemType;
    type: MessageTypeEnum;
}

export type PushMessageItem = Pick<Account, | 'name' | 'userID' | 'avatar'>;

export interface PushMessage {
    type: MessageTypeEnum
    message: PushMessageItem
}
