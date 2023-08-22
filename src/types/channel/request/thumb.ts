import { BaseRecord } from '@/types/channel/request/base';

export interface ThumbItem {
    msgID: number;
}

export interface ThumbType extends BaseRecord {
    message: ThumbItem;
}
