/**
 # @Time : 2023/1/31 18:20
 # @Site : https://www.codeminer.cn
 """
 file-name:account
 ex:account.vue
 """
 */
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccountFormReadonly } from '@/types/account';
import { register, login } from '@/apis/account/';
import { setToken } from '@/utils/cookies';

import useAccountStore from '@/store/account';

export default () => {
  const router = useRouter();
  const user = useAccountStore();
  const LoginFormState = reactive<Pick<AccountFormReadonly, 'password' | 'username'>>({
    username: '',
    password: '',
  });
  const RegisterFormState = reactive<AccountFormReadonly>({
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
  const Login = async (forms: AccountFormReadonly): Promise<void> => {
    const res = await login(forms);

    setToken('jwt-token', res.data.token);

    user.setUser(res.data);
    message.success('登入成功');
    const next = router.currentRoute.value.query.next as string ?? '/';
    await router.push(next);
  };
  /**
   * 注册
   */
  const Register = async (forms: AccountFormReadonly) => {
    const res = await register(forms);
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
