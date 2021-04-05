<template>
  <div class="login">
    <div class="login-box">
      <div class="logo"><img
          src="~assets/img/logo/logo.png"
          alt=""
        /></div>
      <div class="content">
        <el-form
          ref="form"
          :model="loginForm"
          :rules="formRules"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="iconfont icon-user"
              type="text"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="iconfont icon-3702mima"
              v-model="loginForm.password"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row class="btn">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetForm"
          >重置</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getLoginInfo } from 'network/login.js'
export default {
  name: 'Login',
  data() {
    return {
      //表单项目input
      loginForm: {
        username: '',
        password: '',
      },
      //表单验证
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //重置表单
    resetForm() {
      this.$refs.form.resetFields()
    },
    //点击登录事件
    login() {
      this.$refs.form.validate((isOk) => {
        if (isOk) {
          getLoginInfo(this.loginForm).then((res) => {
            console.log(res)
            if (res.meta.status === 200) {
              window.sessionStorage.setItem('token', res.data.token)
              this.$message.success('登录成功！')
              this.$router.push('/home')
            } else {
              this.$message.error('用户名或者密码错误')
            }
          })
        } else {
          return
        }
      })
    },
  },
}
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 400px;
  width: 600px;
  background-color: #fff;
  border-radius: 20px;
}
.logo {
  position: absolute;
  left: 50%;
  top: 0px;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}
.logo img {
  width: 100%;
  border-radius: 50px;
}
.content {
  margin-top: 100px;
  padding: 0px 80px;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
