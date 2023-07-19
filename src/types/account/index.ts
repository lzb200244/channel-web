export interface User {
    userID: number,
    avatar: string,
    username: string,

}

export interface Account {
    username: string,
    email: string,
    desc: string,
    userID: number
    avatar: string,
    token?: string
    isModify?:boolean
}

/**
 * 登录与注册接口
 */
export interface AccountFormAble {
    username: string, // 账号
    password: string, // 密码
    email: string, // 邮箱
    rePassword: string // 确认密码
}
export interface userInfo extends User{

    isModify?:boolean
}
export type AccountFormReadonly = Readonly<AccountFormAble>;
