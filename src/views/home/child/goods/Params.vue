<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="只允许设置三级分类参数"
        type="warning"
        :closable='false'
        show-icon
        style="margin:20px 0px"
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <el-row style="margin-bottom:20px">
        <span>选择商品分类: </span>
        <el-cascader
          v-model="selectedCate"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
      </el-row>
      <!-- 选项卡区域 -->
      <template>
        <el-tabs
          @tab-click="handleTabClick"
          v-model="activeTabName"
        >
          <!-- 动态参数区域 -->
          <el-tab-pane
            label="动态参数"
            name="many"
          >
            <el-button
              type="primary"
              :disabled='isDisabled'
              @click="addParamsdialogVisible = true"
            >添加参数</el-button>
            <el-table
              :data="manyList"
              border
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 显示属性参数的标签 -->
                  <el-tag
                    type="success"
                    v-for="(item,index) in scope.row.attr_vals"
                    closable
                    @close='removeParamsTag(scope.row,index)'
                    :key="index"
                  >{{item}}</el-tag>
                  <!-- 实现添加新的标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>

                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_name,scope.row.attr_id)"
                  >修改</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-error"
                    @click="removeParams(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性区域 -->
          <el-tab-pane
            label="静态属性"
            name="only"
          >
            <el-button
              type="primary"
              :disabled='isDisabled'
              @click="addParamsdialogVisible = true"
            >添加属性</el-button>
            <el-table
              :data="onlyList"
              border
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    type="success"
                    v-for="(item,index) in scope.row.attr_vals"
                    closable
                    @close='removeParamsTag(scope.row,index)'
                    :key="index"
                  >{{item}}</el-tag>
                  <!-- 实现添加新的标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_name,scope.row.attr_id)"
                  >修改</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-error"
                    @click="removeParams(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
    <!-- 添加属性对话框区域 -->
    <el-dialog
      :title="'添加'+ getParamsType"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close='reseteForm'
    >
      <!-- form表单区域 -->
      <el-form
        :model="addParamsform"
        label-width="80px"
        :rules="ParamsruleForm"
        ref="addParamsFormRef"
      >
        <el-form-item
          :label="getParamsType"
          prop="paramsName"
        >
          <el-input v-model="addParamsform.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框区域 -->
    <el-dialog
      :title="'修改'+ getParamsType"
      :visible.sync="editParamsdialogVisible"
      width="50%"
      @close='reseteEditForm'
    >
      <!-- form表单区域 -->
      <el-form
        :model="editParamsform"
        label-width="80px"
        :rules="ParamsruleForm"
        ref="editParamsFormRef"
      >
        <el-form-item
          :label="getParamsType"
          prop="paramsName"
        >
          <el-input v-model="editParamsform.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmEditParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getParamsList, addParamsList, editParamsList, daleteParams } from 'network/goods.js'
export default {
  name: 'Params',
  data() {
    return {
      //所有商品分类
      cateList: [],
      //选中的商品分类
      selectedCate: [],
      //级联列表的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
      },
      //活动的tab选项名称
      activeTabName: 'many',
      //动态参数和静态属性
      manyList: [],
      onlyList: [],
      //添加属性对话框显示隐藏
      addParamsdialogVisible: false,
      //添加属性表单绑定对象
      addParamsform: {
        paramsName: '',
      },
      //添加属性表单验证规则
      ParamsruleForm: {
        paramsName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
      },
      //修改属性表单绑定对象
      editParamsform: {
        paramsName: '',
        paramsId: '',
      },
      //修改属性对话框的显示隐藏
      editParamsdialogVisible: false,
    }
  },
  // 获取所有分类列表
  created() {
    this.requestCateList()
  },
  methods: {
    //请求分类数据方法
    async requestCateList() {
      const res = await getCateList()
      //console.log(res)
      this.cateList = res.data
    },
    //分类参数改变事件
    async handleChange() {
      //console.log(this.selectedCate)
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
        this.manyList = []
        this.onlyList = []
        return
      }
      this.requestCate()
    },
    //点击tab栏切换触发事件
    handleTabClick() {
      if (this.selectedCate.length === 3) {
        this.requestCate()
      }
    },
    //获取分类参数事件
    async requestCate() {
      const res = await getParamsList(this.getId, this.activeTabName)
      //console.log(res)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []

        //新建标签属性参数的绑定对象
        item.inputValue = ''
        //控制文本框与标签的隐藏切换
        item.inputVisible = false
      })
      if (this.activeTabName === 'many') {
        // console.log(res.data)
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
    },
    //添加参数或属性
    confirmAddParams() {
      this.$refs.addParamsFormRef.validate(async (result) => {
        if (!result) return
        const res = await addParamsList(this.getId, this.addParamsform.paramsName, this.activeTabName)
        this.requestCate()
        this.addParamsdialogVisible = false
        //console.log(result)
      })
    },
    //对话框关闭重置表单
    reseteForm() {
      this.$refs.addParamsFormRef.resetFields()
    },
    //修改属性对话框事件
    showEditDialog(p1, p2) {
      //console.log(p1, p2)
      this.editParamsform.paramsName = p1
      this.editParamsform.paramsId = p2
      this.editParamsdialogVisible = true
    },
    //确认修改属性操作
    confirmEditParams() {
      this.$refs.editParamsFormRef.validate((res) => {
        if (!res) return
        this.editParams(this.editParamsform.paramsId, this.editParamsform.paramsName)
        this.$nextTick(() => {
          this.requestCate()
        })
        this.editParamsdialogVisible = false
        this.requestCate()
      })
    },
    //对话框关闭重置表单事件
    reseteEditForm() {
      this.$refs.editParamsFormRef.resetFields()
    },
    //删除参数操作
    async removeParams(id) {
      const isConfirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (isConfirm === 'confirm') {
        daleteParams(this.getId, id).then((res) => {
          //console.log(res)
          if (res.meta.status === 200) {
            this.$message.success('删除成功')
            this.requestCate()
          } else {
            this.$message.error('删除未成功')
          }
        })
      } else {
        return
      }
    },
    //添加新的属性参数值标签
    handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        row.inputVisible = false
        return
      } else {
        row.attr_vals.push(row.inputValue)
        const value = row.attr_vals.join(',')
        this.editParams(row.attr_id, row.attr_name, value)
        row.inputValue = ''
        row.inputVisible = false
      }
    },
    //显示添加新标签文本框
    showInput(row) {
      row.inputVisible = true
      //这个方法用来获取重新渲染后的dom对象节点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //移除属性标签值
    removeParamsTag(row, index) {
      row.attr_vals.splice(index, 1)
      this.editParams(row.attr_id, row.attr_name, row.attr_vals.join(','))
    },
    //封装修改属性方法
    editParams(id, name, val) {
      editParamsList(this.getId, id, name, this.activeTabName, val).then((res) => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('修改属性值成功')
        } else {
          this.$message.error('修改属性值失败')
        }
      })
    },
  },

  computed: {
    isDisabled() {
      if (this.selectedCate.length !== 3) {
        return true
      } else {
        return false
      }
    },
    //获取分类id
    getId() {
      return this.selectedCate[this.selectedCate.length - 1]
    },
    //获取添加属性类型，动态or静态
    getParamsType() {
      if (this.activeTabName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>

<style scoped>
.el-cascader {
  margin-left: 10px;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
