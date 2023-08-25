import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { UserInfo } from '@/types/account';
import { roomID } from '@/types/channel/response/base';

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
    members: number[]
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
    roomID: roomID;
}

export interface RecordItemType {
    type: PushTypeEnum;
    message: BaseMessage;
    roomID: string
}

export interface ReplayItem {
    username: string; // 发送者用户名
    msgID: number; // 唯一消息ID
    type: number; // 重播类型
    userID: number; // 唯一用户ID
    fileInfo?: FileInfo; // 可选文件信息
    content?: string; // 可选重播内容
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
    roomID: roomID;
}

interface ThumbOpt {
    msgID: number; // 唯一消息ID
}

export interface ThumbMessage {
    type: PushTypeEnum;
    message: ThumbOpt;
    roomID: number;
}

export const roomUserInfoMap: Map<UserID, UserInfo> = new Map();

export interface Group {
    id: number; // 群组ID

    createTime: string; // 群组创建时间
    creator: BaseUserItem; // 群组创建者
    name: string; // 群组名称
    desc: string; // 群组描述
    type: number; // 群组类型
    isPublic: boolean; // 是否公开群组
}

export interface Groups {
    private_rooms: Group[];
    group_rooms: Group[];
}
