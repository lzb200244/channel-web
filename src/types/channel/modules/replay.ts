import { PushTypeEnum } from '@/types/channel/enum';
import {
  BaseUserItem, ReplayMessage,
} from '@/types/channel';

export type ReplayType = {
    type: PushTypeEnum;
    message: ReplayMessage ;
    user: BaseUserItem;
};
