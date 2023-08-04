import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { UserInfo } from '@/types/account';

export type LikeStatus = 0 | 1 | 2;

export interface FileInfo {
    fileName: string;
    fileSize: number;
    filePath: string;
}

type UserID = number;

export interface MessageStatus {
    drop: string;
    likes: number;
    isDrop: boolean;
    isLike: LikeStatus;
}

export interface BaseMessage {
    type: MessageTypeEnum;
    time: number;
    msgID: number;
    messageStatus: MessageStatus;
}

export interface TextMessage extends BaseMessage {
    content: string;
}

export interface ImageMessage extends BaseMessage {
    fileInfo: FileInfo;
}

export interface BaseUserItem {
    username: string;
    avatar: string;
    userID: number;
    isActive: boolean;
}

export interface UserMessage {
    type: PushTypeEnum;
    user: UserInfo;
}

export interface RecordItemType {
    type: PushTypeEnum;
    message: BaseMessage;
}

export interface ReplayItem {
    username: string;
    time: number;
    msgID: number;
    type: number;
    userID: number;
    fileInfo?: FileInfo;
    content?: string;
}

export interface ReplayMessage extends BaseMessage {
    replay?: ReplayItem;
    content?: string;
    fileInfo?: FileInfo;
}

export interface BaseRecord<T extends BaseMessage = BaseMessage> {
    type: PushTypeEnum;
    message: T;
    user: {
        userID: UserID;
    };
    roomID: string;
}

export interface ThumbOpt {
    msgID: number;
    isLike: LikeStatus;
}

export interface ThumbMessage {
    type: PushTypeEnum;
    message: ThumbOpt;
    roomID: string;
}

export const roomUserInfoMap: Map<UserID, UserInfo> = new Map();

export interface Group {
    id: number;
    createTime: string;
    creator: BaseUserItem;
    name: string;
    desc: string;
    isPublic: boolean;
}
