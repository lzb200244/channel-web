import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';

export interface BaseMessage {
    type: MessageTypeEnum;
}

export interface BaseUserItem {
    userID: number;
}

export interface BaseRecord {
    type: PushTypeEnum;
    roomID: number;
}
