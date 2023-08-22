// 定义基本的用户信息
interface User {
    userID: number;
    avatar: string;
    username: string;
}
interface Medals {
    id:number,
    title:string
}
// 登录返回的信息
export interface Account extends User {
    email: string;
    desc: string;
    // isModify?: boolean;
    medals: Medals[];
    token?: string;
}

// 请求的用户信息
export interface UserInfo extends Account {
    isActive?: boolean;
}

// 登录与注册接口
export interface AccountFormAble {
    username: string;
    password: string;
    email: string;
    rePassword: string;
}

// 用户勋章
export interface UserMedalsList {
    id: number;
    acquire: boolean;
    desc: string;
    path: string;
    title: string;
    create_time: string;
}
