export interface User {
    userID: number
}
export interface Account {
    username: string,
    email: string,
    name: string,
    desc:string,
    userID: number | string,
    avatar: string,
    token?: string
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

export interface IAccount {
    username: string,
    email: string,
    name: string,
    desc:string,
    userID: number | string,
    avatar: string,
    token?: string
}

export type AccountFormReadonly = Readonly<AccountFormAble>;
