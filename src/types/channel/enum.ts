/**
 * 操作类型：撤回，删除，点赞，回复，@
 */
export enum PushTypeEnum {
    MESSAGE_PUSH = 1,
    ONLINE_PUSH = 2,
    LEVEL_PUSH = 3,
    RECALL_PUSH = 4,
    UPLOAD_FILE_PUSH = 5,
    THUMB_PUSH = 6,
    REPLAY_PUSH = 7,
}

/**
 * MSG 消息，FILE文件，IMAGE图片，VIDEO音频/视频
 */
export enum MessageTypeEnum {
    /**
     * 文本
     */
    TEXT = 1,
    /**
     * 文件类型
     */
    FILE = 2,
    /**
     * 图片类型
     */
    IMAGE = 3,
    /**
     * 音频类型
     */
    VIDEO = 4,
    /**
     * 回复类型
     */
    REPLAY = 5,
    /**
     * 撤回
     */
    RECALL
}
