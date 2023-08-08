import { BaseMessage, BaseRecord, BaseUserItem } from '@/types/channel/request/base';

export interface FileInfoForm {
    fileName: string;
    fileSize: number;
    filePath: string;
}
export interface ReplayItem {
    username: string; // 发送者用户名
    msgID: number; // 唯一消息ID
    type: number; // 重播类型
    userID: number; // 唯一用户ID
}
export interface ReplayMessageForm extends BaseMessage {
    replay?: ReplayItem; // 回复信息
    content?: string; // 回复消息内容
    fileInfo?: FileInfoForm; // 文件信息
}

export interface TextMessage extends BaseMessage {
    content: string;
}

export interface FileMessage extends BaseMessage {
    fileInfo: FileInfoForm;
}

export interface MessageRecordFrom<T extends BaseMessage = BaseMessage> extends BaseRecord {
    message: T;
    user: BaseUserItem
}
