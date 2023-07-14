import { AccountFormAble } from '@src/types/account';

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

export {
  account, register, login,
};
