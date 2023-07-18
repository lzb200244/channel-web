import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';

export interface FileInfo {
    fileName: string;
    fileSize: number;
    filePath: string;
}

interface MessageStatus {
    drop: string;
    likes: number;
    isDrop: boolean;
}
interface BaseMessage {
    type: MessageTypeEnum;
    time: number;
    msgID: number;
    messageStatus: MessageStatus;
    roomID: number;
}

export interface TextMessage extends BaseMessage {
    content: string;
}

export interface ImageMessage extends BaseMessage {
    fileInfo: FileInfo;
}

export type Message = TextMessage | ImageMessage;

export interface ReplayMessage {
    type: MessageTypeEnum;
    time: number;
    msgID: number;
    roomID: number;
    replay: Message|null;
    username:string,
    messageStatus: MessageStatus;
}

export interface BaseUserItem {
    username: string;
    avatar: string;
    userID: number;
    isActive: boolean;
}
export type BaseRecord = {
    type: PushTypeEnum;
    message: ReplayMessage | TextMessage | ImageMessage
    user: BaseUserItem;
};

export interface UserMessage {
    type: PushTypeEnum;
    user: BaseUserItem;
}
export interface RecordItemType{
    type: PushTypeEnum;
    message:BaseMessage

}
