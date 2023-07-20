import { AccountFormAble, userInfo } from '@/types/account';

import instance from '@/apis/index';

/**
 * 注册
 * @param form
 */
const register = async (form: AccountFormAble) => instance.post({
  url: 'user/register',
  data: { ...form },
});

/**
 * 登录
 * @param form
 */
const login = async (form: AccountFormAble) => instance.post({
  url: 'user/',
  data: { ...form },
});
/**
 * 获取用户信息
 */
const account = async () => instance.get(
  { url: 'user/' },
);
/**
 * 更新头像和昵称
 * @param res
 */
const updateInfoApi = async (res:userInfo) => instance.put({ url: 'user/', data: res });
/**
 * 获取勋章
 */
const getMedalsApi = async () => instance.get({ url: 'user/medal' });

export {
  account, register, login, updateInfoApi, getMedalsApi,
};
