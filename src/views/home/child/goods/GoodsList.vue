<template>
  <div class="goods-list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="pageInfo.query"
            clearable
            @clear='this.getGoodsList'
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="this.getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 商品添加按钮区域 -->
        <el-col :span="6">
          <el-button
            type="primary"
            @click="toAddPage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->

      <template>
        <el-table
          :data="goodsList"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            width="60"
          >
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
          >
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            width="120px"
          >
          </el-table-column>

          <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="100px"
          >
          </el-table-column>
          <el-table-column
            prop="add_time"
            label="创建时间"
            width="180px"
          >
            <template slot-scope="scope">
              {{scope.row.add_time|dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120px"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removegoods(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页功能区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pagenum"
          :page-sizes="[8, 10, 50, 200]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script>
import { gainGoodsList, deleteGoods } from 'network/goods.js'
export default {
  //导入相关网络请求方法

  data() {
    return {
      //商品表格绑定对象
      goodsList: [],
      //获取商品数据的页码信息
      pageInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      //总条数
      total: 0,
    }
  },
  created() {
    //获取商品数据
    this.getGoodsList()
  },
  methods: {
    //定义获取商品表格方法
    async getGoodsList() {
      const res = await gainGoodsList(this.pageInfo)
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //改变当前页码和每页显示条数事件
    handleSizeChange(newsize) {
      this.pageInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.pageInfo.pagenum = newpage
      this.getGoodsList()
    },
    //跳转到添加商品页面
    toAddPage() {
      this.$router.push('/addgoods')
    },
    //删除商品
    removegoods(id) {
      deleteGoods(id).then((res) => {
        if (res.meta.status === 200) {
          this.$message.success('删除商品成功')
          this.getGoodsList()
        } else {
          this.$message.error('删除商品失败')
        }
      })
    },
  },
}
</script>

<style>
</style>
