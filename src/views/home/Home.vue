<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img
          src="~assets/img/logo/logo.png"
          alt=""
        />
        <span class="title">电商后台管理系统</span>
      </div>
      <el-row>
        <!-- 退出按钮 -->
        <el-button
          type="info"
          size="small"
          @click="loginOut"
        > 退出 </el-button>
      </el-row>
    </el-header>
    <el-container class="container">
      <!-- 侧边栏区域 -->
      <el-aside :width="isFold ? '64px' : '200px'">
        <div
          class="fold"
          @click="fold"
        >|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          :collapse="isFold"
          :collapse-transition="false"
          router
          unique-opened
          :default-active="active"
        >
          <el-submenu
            :index="item.path + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="item.path + ''"
              v-for="item in item.children"
              :key="item.id"
              @click="showActive(item.path + '')"
            >
              <i class="el-icon-document"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenu } from 'network/home.js'
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      //侧边栏折叠
      isFold: false,
      //侧边栏高亮显示
      active: '',
    }
  },
  created() {
    // 获取菜单栏数据
    getMenu().then((res) => {
      //console.log(res)
      this.menuList = res.data
      //console.log(this.menuList)
      this.active = window.sessionStorage.active
    })
  },
  methods: {
    //退出功能
    loginOut() {
      //console.log('---')
      window.sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    //侧边栏是否折叠
    fold() {
      this.isFold = !this.isFold
    },
    //高亮显示
    showActive(item) {
      window.sessionStorage.setItem('active', item)
      this.active = item
    },
  },
}
</script>

<style  scoped>
.el-container {
  height: 100%;
}
/* 头部 */
.el-header {
  background-color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  height: 100%;
  display: flex;
  align-items: center;
}
.header-left img {
  height: 100%;
  border-radius: 30px;
}
.container {
  height: calc(100% - 60px);
}
.title {
  padding: 10px 0px 0px 20px;
  font-size: 20px;
  color: #fff;
}
/* 侧边栏 */
.el-aside {
  background-color: rgb(84, 92, 100);
}
.fold {
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu {
  border-width: 0px;
}
.iconfont {
  margin-right: 10px;
}
</style>
