<template>
  <div
    id="account"
    ref="account"
    class="flex-center account bg"
  >
    <a-tabs
      v-model:activeKey="activeKey"
      centered
      class="rounded-md p-sm"
    >
      <a-tab-pane
        key="login"
        tab="登录"
      >
        <a-form
          ref="LoginForm"
          layout="vertical"
          :model="LoginFormState"
          name="normal_login"
          class="login-form "
          :wrapper-col="{ style: 'width: 320px;min-height:35px' }"
          @finish="Login"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="Rules.login.username"
          >
            <a-input
              v-model:value.trim="LoginFormState.username"
              class="h-10"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            label="密码"
            name="password"
            style="margin-bottom: 5px;"
            :rules="Rules.login.password"
          >
            <a-input-password
              v-model:value.trim="LoginFormState.password"
              class="h-10"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item style="margin-bottom: 5px;">
            <router-link
              class="login-form-forgot float-right"
              to="/"
            >
              返回主页
            </router-link>
          </a-form-item>
          <a-form-item>
            <a-button
              style="height: 35px"
              block
              type="primary"
              html-type="submit"
              class=" login-form-button"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="register"
        tab="注册"
        force-render
      >
        <a-form
          ref="RegisterFrom"
          layout="vertical"
          :model="RegisterFormState"
          name="normal_login"
          class="login-form "
          :wrapper-col="{ style: 'width: 320px;min-height:35px' }"
          @finish="Register"
        >
          <a-form-item
            label="账号"
            name="username"
            :rules="Rules.register.username"
          >
            <a-input
              v-model:value="RegisterFormState.username"
              class="h-10"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            label="密码"
            name="password"
            :rules="Rules.register.password"
          >
            <a-input-password
              v-model:value="RegisterFormState.password"
              class="h-10"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            label="确认密码"
            name="rePassword"
            :rules="rePasswordRules"
          >
            <a-input-password
              v-model:value="RegisterFormState.rePassword"
              class="h-10"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            label="邮箱"
            name="email"
            :rules="Rules.register.email"
          >
            <a-input
              v-model:value="RegisterFormState.email"
              class="h-10"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button
              block
              type="primary"
              html-type="submit"
              class="login-form-button "
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang='ts' setup>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import useAccount from '@/core/account/account';
import Rules from '@/utils/rules/account';

const {
  LoginFormState,
  RegisterFormState,
  activeKey,
  rePasswordRules,
  Register,
  Login,
} = useAccount();
</script>

<style scoped>
.flex-center {
    display: flex;
    justify-content: center
}
</style>
