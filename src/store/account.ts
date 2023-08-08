import { defineStore, acceptHMRUpdate } from 'pinia';

import { Account, UserInfo, UserMedalsList } from '@/types/account';
import {
  getAccountAsync, getUserJoinRoomsAsync, getMedalsAsync, updateInfoAsync,
} from '@/apis/account';
import { Group } from '@/types/channel';

const useAccountStore = defineStore(
  'account', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      user: {} as Account,
      isAdmin: true,
      // 用户
      medals: [] as UserMedalsList[],
      rooms: []as Group[],

    }),
    getters: {
      channelUser: (state) => ({
        userID: state.user.userID,
        username: state.user.username,
        avatar: state.user.avatar,
        isActive: Object.keys(state.user).length !== 0,
      }),
      /**
       * 获取用勋章
       */
      getMedals: (state) => state.medals,
    },
    actions: {
      // 删除用户
      removeUser() {
        this.user = {} as Account;
      },
      // 请求用户
      async asyncUser() {
        const res = await getAccountAsync();
        if (!res) return;
        this.setUser(res.data);
      },
      //   b保存用户
      setUser(user: Account) {
        this.user = user;
      },
      async updateUser(userinfo: UserInfo) {
        await updateInfoAsync(userinfo);
        Object.assign(this.user, userinfo); // 更新用户
      },
      /**
       * 获取勋章
       */
      async asyncGetMedals() {
        if (this.medals.length !== 0) {
          return;
        }
        const res = await getMedalsAsync();
        res.data.forEach((item) => {
          if (this.user.medals.includes(item.id)) {
            item.acquire = true;
          }
        });
        this.medals = res.data;
      },
      async asyncGetUserJoinRooms() {
        const res = await getUserJoinRoomsAsync();
        this.rooms = res.data;
      },
      joinRoom(room :Group) {
        this.rooms.push(room);
      },
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
export default useAccountStore;
