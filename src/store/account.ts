import { defineStore, acceptHMRUpdate } from 'pinia';

import { Account } from '@src/types/account';
import { account } from '@/apis/account';

const useAccountStore = defineStore(
  'account', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      user: {} as Account,
      isAdmin: true,
    }),
    actions: {
      // 删除用户
      removeUser() {
        this.user = {} as Account;
      },
      // 请求用户
      async asyncUser() {
        const res = await account();
        if (!res) return;
        this.setUser(res.data);
      },
      //   b保存用户
      setUser(user: Account) {
        this.user = user;
      },
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
export default useAccountStore;
