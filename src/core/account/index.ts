/**
 # @Time : 2023/1/31 18:20
 # @Site : https://www.codeminer.cn
 """
 file-name:getAccountAsync
 ex:getAccountAsync.vue
 """
 */
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccountFormAble } from '@/types/account';
import { registerAsync, loginAsync } from '@/apis/account/';
import { setToken } from '@/utils/cookies';
  /**
   * Generate a random date
   */


import useAccountStore from '@/store/account';

export default () => {
  const router = useRouter();
  const user = useAccountStore();
  const LoginFormState = reactive<Pick<AccountFormAble, 'password' | 'username'>>({
    username: '',
    password: '',
  });
  const RegisterFormState = reactive<AccountFormAble>({
    ...LoginFormState,
    email: '',
    rePassword: '',
  });
  const activeKey = ref<string>('login');
  /**
   * 确认密码校验
   */
  const rePasswordRules = {
    type: 'string',
    asyncValidator: (rule: string, value: string): Promise<string | null> =>
      // 确认密码校验
      new Promise((resolve, reject) => {
        if (RegisterFormState.password !== value) {
          reject(new Error('两次密码不一致'));
        } else {
          resolve('success');
        }
      }),

  };

  /**
   * 登录
   * @param forms
   */
  const Login = async (forms: AccountFormAble): Promise<void> => {
    const res = await loginAsync(forms);

    setToken('access_token', res.data.token as string);

    user.setUser(res.data);
    message.success('登入成功');
    const next = router.currentRoute.value.query.next as string ?? '/';
    await router.push(next);
  };
  /**
   * 注册
   */
  const Register = async (forms: AccountFormAble) => {
    const res = await registerAsync(forms);
    if (res.code === 1203) return;
    message.info('注册成功');
  //   用户更新头像和昵称
  };
  return {
    LoginFormState,
    RegisterFormState,
    activeKey,
    rePasswordRules,
    Register,
    Login,

  };
};
/**
 * 干了什么
 */
