import { BaseMessage, BaseRecord } from '@/types/channel/request/base';

export interface RecallRecordItem extends BaseMessage{
    msgID:number
}

export interface RecallRecord extends BaseRecord {
    message: RecallRecordItem;
}
