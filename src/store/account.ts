import { defineStore, acceptHMRUpdate } from 'pinia';

import { Account, userInfo } from '@/types/account';
import { account, updateInfoApi } from '@/apis/account';

const useAccountStore = defineStore(
  'account', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      user: {} as Account,
      isAdmin: true,
    }),
    getters: {
      channelUser: (state) => ({
        userID: state.user.userID,
        username: state.user.username,
        avatar: state.user.avatar,
        isActive: Object.keys(state.user).length !== 0,
      }),
    },
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
      async updateUser(userinfo:userInfo) {
        await updateInfoApi(userinfo);
        Object.assign(this.user, userinfo); // 更新用户
      },
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
export default useAccountStore;
