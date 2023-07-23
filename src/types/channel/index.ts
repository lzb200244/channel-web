import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';

export type likeStatus=0|1|2
export interface FileInfo {
    fileName: string;
    fileSize: number;
    filePath: string;
}
interface MessageStatus {
    drop: string;
    likes: number;
    isDrop: boolean;

    isLike:likeStatus ; // 0未操作,1点赞，2踩
}
interface BaseMessage {
    type: MessageTypeEnum; // 消息类型,文本,图片,文件,音频
    time: number; // 时间戳
    msgID: number; // 消息表示
    messageStatus: MessageStatus; // 消息状态
    roomID: number | string; // 房间id
}

export interface TextMessage extends BaseMessage {
    content: string;
}

export interface ImageMessage extends BaseMessage {
    fileInfo: FileInfo;
}

/**
 * 针对消息与用户
 */
export interface BaseUserItem {
    username: string;
    avatar: string;
    userID: number;
    isActive: boolean;
}

export interface UserMessage {
    type: PushTypeEnum;
    user: BaseUserItem;
}
export interface RecordItemType{
    type: PushTypeEnum;
    message:BaseMessage

}

export interface ReplayItem {
    username: string, // 回复人的名称
    time:number,
    msgID:number
    type:number
    userID:number
    fileInfo?:FileInfo
    content?:string
}
// 回复类型
export interface ReplayMessage extends BaseMessage {
    replay?: ReplayItem; // 回复对象
    content?:string,
    fileInfo?:FileInfo
}

// 回复文件类型

export interface BaseRecord<T extends BaseMessage=BaseMessage> {
    type: PushTypeEnum; // 推送类型
    message: T; // 消息类型
    user: BaseUserItem; // 用户信息
}

// 点赞
export interface ThumbOpt{
    msgID:number, // 消息id
    isLike:likeStatus // 状态
}
export interface ThumbMessage {
    type: PushTypeEnum; // 推送类型
    message: ThumbOpt; // 消息类型
}
