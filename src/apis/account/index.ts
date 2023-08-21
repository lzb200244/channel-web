import {
  Account,
  AccountFormAble, UserInfo, UserMedalsList,
} from '@/types/account';

import instance, { APiResponse } from '@/apis/index';
import { Groups } from '@/types/channel';

/**
 * 注册
 * @param form
 */
const registerAsync = async (form: AccountFormAble): APiResponse<null> => instance.post({
  url: 'user/register',
  data: form,
  isAuth: false,
});

/**
 * 登录
 * @param form
 */
const loginAsync = async (form: AccountFormAble): APiResponse<Account> => instance.post({
  url: 'user/login',
  data: form,
  isAuth: false,
});
/**
 * 获取用户信息
 */
const getAccountAsync = async (): APiResponse<Account> => instance.get(
  {
    url: 'user/profile',
    isAuth: false,
  },
);
/**
 * 更新头像和昵称
 * @param res
 */
const updateInfoAsync = async (res: UserInfo): APiResponse<UserInfo> => instance.put(
  { url: 'user/profile', data: res, isAuth: true });

/**
 * 获取勋章
 */
const getMedalsAsync = async (): APiResponse<UserMedalsList[]> => instance.get({
  url: 'user/medal', isAuth: true,
});
/**
 * 用户加入的群聊
 */
const getUserJoinRoomsAsync = (): APiResponse<Groups> => instance.get({
  url: 'user/join', isAuth: false,
});
export {
  getAccountAsync,
  registerAsync,
  loginAsync,
  updateInfoAsync,
  getMedalsAsync,
  getUserJoinRoomsAsync,
};
