import { BaseRecord } from '@/types/channel/request/base';

export interface ThumbItem {
    msgID: number;
    isLike: 0 | 1 | 2;
}

export interface ThumbType extends BaseRecord {
    message: ThumbItem;
}
