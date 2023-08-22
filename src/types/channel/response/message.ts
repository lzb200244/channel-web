import { BaseMessage, BaseRecord, BaseUserItem } from '@/types/channel/response/base';
import { PushType } from '@/types/channel/modules/push';

export interface FileInfo {
    fileName: string;
    fileSize: number;
    filePath: string;
}

export interface MessageStatus {
    drop: string;
    likes: number;
    isDrop: boolean;
    members: number[];
}

export interface ReplayItem extends BaseMessage {
    username: string; // 发送者用户名
    msgID: number; // 回复的信息id
    userID: number; // 回复用户ID
    fileInfo?: FileInfo; // 可选文件信息
    content?: string; // 可选重播内容
}

export interface MessageItem extends BaseMessage {
    time: number
    msgID: number
    messageStatus: MessageStatus

}

export interface ReplayMessage extends MessageItem {
    replay?: ReplayItem;
    content?: string;
    fileInfo?: FileInfo;
}

export interface MessageRecord<T extends BaseMessage = BaseMessage> extends BaseRecord {
    message: T;
    user: BaseUserItem
}

export interface roomMembers{
    online: PushType[],
    offline: PushType[],
}
