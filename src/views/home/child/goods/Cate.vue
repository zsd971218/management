<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button
        type="primary"
        @click="showAddCateDialog"
      >添加分类</el-button>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
      >
        <!-- 设置分类表单 -->
        <el-form
          :model="addCateInfo"
          label-width="80px"
          :rules="addCateRules"
          ref="addCateRef"
        >
          <el-form-item
            label="分类名称"
            prop="cat_name"
          >
            <el-input v-model="addCateInfo.cat_name"></el-input>
          </el-form-item>
          <!-- 分类级联选择器 -->
          <el-form-item label="父级分类">
            <el-cascader
              v-model="parentCateId"
              :options="allCateList"
              :props="cascaderProps"
              @change="handleChange"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmAddCate"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 树形分类列表 -->
      <zk-table
        class="mar"
        ref="table"
        index-text=""
        :data="totalList"
        :columns="columns"
        :selectionType='false'
        :expand-type='false'
        show-index
        border
      >
        <template
          slot="isOk"
          slot-scope="scope"
        >
          <i
            class="el-icon-error"
            style='color:red'
            v-if="scope.row.cat_deleted"
          ></i>
          <i
            class="el-icon-success"
            style='color:lightgreen'
            v-else
          ></i>
        </template>
        <template
          slot="level"
          slot-scope="scope"
        >
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level===1"
          >二级</el-tag>
          <el-tag
            type="warning"
            v-else
          >三级</el-tag>
        </template>
        <template
          slot="opertion"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >编辑</el-button>
          <el-button
            icon="el-icon-error"
            size="mini"
            type="danger"
            @click="removeCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 6, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getCateList, addCateNode, deleteCate } from 'network/goods.js'
export default {
  name: 'Cate',
  data() {
    return {
      //所有分类列表
      totalList: [],
      //查询信息参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 6,
      },
      //总条数
      total: 0,
      //商品分类表格的列定义
      columns: [
        {
          label: '商品分类',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level',
        },
        {
          label: '排序',
          type: 'template',
          template: 'opertion',
        },
      ],
      //控制添加分类对话框显示隐藏
      addCateDialogVisible: false,
      //储存添加分类的表单信息
      addCateInfo: {
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      },
      //储存用户新增分类的父级分类
      parentCateId: [],
      //储存所有分类列表的数组
      allCateList: [],
      //储存级联列表的配置选项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        emitPath: true,
        checkStrictly: true,
      },
      //添加分类信息验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    //创建后立即请求分类数据
    this.askCateList()
  },
  methods: {
    //请求分类数据
    askCateList() {
      getCateList(this.queryInfo).then((res) => {
        console.log(res)
        this.totalList = res.data.result
        this.total = res.data.total
      })
    },
    //分页功能 改变每页条数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.askCateList()
    },
    //改变页码
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.askCateList()
    },
    //显示添加分类对话框
    async showAddCateDialog() {
      //发送请求数据获取全部商品分类
      const res = await getCateList({ type: 2 })
      //console.log(res)
      this.allCateList = res.data
      this.addCateDialogVisible = true
    },
    //选择级联列表的数据时储存起来
    handleChange(item) {
      this.parentCateId = item
      //console.log(item)
    },
    //确定添加节点事件
    confirmAddCate() {
      this.$refs.addCateRef.validate((res) => {
        if (res) {
          if (this.parentCateId.length === 0) {
            this.addCateInfo.cat_pid = '0'
            this.addCateInfo.cat_level = '0'
            addCateNode(this.addCateInfo).then((res) => {
              //console.log(res)
              if (res.meta.status === 201) {
                this.$message.success('添加分类成功')
                this.addCateDialogVisible = false
                this.askCateList()
              } else {
                this.$message.error('添加分类失败')
              }
            })
          } else {
            this.addCateInfo.cat_level = this.parentCateId.length
            this.addCateInfo.cat_pid = this.parentCateId[this.parentCateId.length - 1]
            addCateNode(this.addCateInfo).then((res) => {
              console.log(res)
              if (res.meta.status === 201) {
                this.$message.success('添加分类成功')
                this.addCateDialogVisible = false
                this.askCateList()
              } else {
                this.$message.error('添加分类失败')
              }
            })
          }
        } else {
          this.$message.error('信息选择有误')
        }
      })
    },
    //删除分类
    async removeCate(id) {
      const isConfirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (isConfirm === 'confirm') {
        deleteCate(id).then((res) => {
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success('删除成功')
            this.askCateList()
          } else {
            this.$message.error('删除未成功')
          }
        })
      } else {
        return
      }
    },
  },
}
</script>

<style scoped>
.mar {
  margin: 20px 0px;
}
</style>>

