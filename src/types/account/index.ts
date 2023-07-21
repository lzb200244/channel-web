export interface User {
    userID: number,
    avatar: string,
    username: string,
}

/**
 * 登录返回的信息
 */
export interface Account {
    userID: number
    username: string,
    email: string,
    desc: string,
    avatar: string,
    isModify:boolean // 是否看一下进行修改信息
    medals: number[] // 获得的勋章
    token?: string
}

/**
 * 请求的用户信息
 */
export interface UserInfo {
    username: string;
    email: string;
    userID: number;
    desc: string;
    avatar: string;
    isModify: boolean;
    medals: number[];
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

/**
 * 用户勋章
 */
export interface UserMedalsList{
    // x勋章表示
    id:number
    // 是否获得
    acquire:boolean,
    desc :string,
    path:string,
    title:string
    // 获得时间
    create_time:string
}
