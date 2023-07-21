import {
  Account,
  AccountFormAble, User, UserInfo, UserMedalsList,
} from '@/types/account';

import instance, { APiResponse } from '@/apis/index';

/**
 * 注册
 * @param form
 */
const register = async (form: AccountFormAble):APiResponse<null> => instance.post({
  url: 'user/register',
  data: { ...form },
});

/**
 * 登录
 * @param form
 */
const login = async (form: AccountFormAble):APiResponse<Account> => instance.post({
  url: 'user/',
  data: { ...form },
});
/**
 * 获取用户信息
 */
const account = async ():APiResponse<Account> => instance.get(
  { url: 'user/' },
);
/**
 * 更新头像和昵称
 * @param res
 */
const updateInfoApi = async (res:UserInfo):APiResponse<User> => instance.put({ url: 'user/', data: res });
/**
 * 获取勋章
 */
const getMedalsApi = async ():APiResponse<UserMedalsList[]> => instance.get({ url: 'user/medal' });

export {
  account, register, login, updateInfoApi, getMedalsApi,
};
