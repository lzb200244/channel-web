/**
 * 操作类型：撤回，删除，点赞，回复，@
 */
export enum MessageTypeEnum {
    LEVEL_PUSH = 1,
    ONLINE_PUSH,
    MESSAGE_PUSH,
    DROP_PUSH,
    THUMB_PUSH,
    REPLAY_PUSH,
    MENTION_PUSH,
}

/**
 * MSG 消息，FILE文件，IMAGE图片，VIDEO音频/视频
 */
export enum MessageContentEnum {
    MSG = 1,
    FILE,
    IMAGE,
    VIDEO,
}
