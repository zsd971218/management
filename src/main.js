import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入相关插件
import 'plugins/util.js'
//导入全局过滤器
import 'common/filter.js'
//导入elemtntui组件
import './plugins/element.js'
//导入全局css和字体图标
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
