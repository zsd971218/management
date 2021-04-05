<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-input
        placeholder="请输入内容"
        v-model="orderValue"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <!-- 订单列表区域 -->
      <el-table :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="220px"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
        ></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.pay_status==='0' "
              type="danger"
            > 未付款</el-tag>
            <el-tag
              v-else
              type="success"
            > 已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          width="180px"
        >
          <template slot-scope="scope">
            {{scope.row.update_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditOrderDialog(scope.row.order_id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-location"
              size="mini"
              @click="editAddress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑地址对话框 -->
      <el-dialog
        title="编辑地址"
        :visible.sync="addressdialogVisible"
        width="50%"
        @close='resetForm'
      >
        <el-form
          :model="addressForm"
          :rules="addressFormrules"
          ref="addressForm"
          label-width="100px"
        >
          <el-form-item
            label="选择地址"
            prop="address"
          >
            <el-cascader
              v-model="addressForm.address"
              :options="citydata"
              :props="addressprops"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="detailAddress"
          >
            <el-input v-model="addressForm.detailAddress"></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addressdialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addressdialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog
      title="修改订单状态"
      :visible.sync="editOrderVisiable"
      width="50%"
      @close='resetEditForm'
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderForm"
        label-width="100px"
      >
        <el-form-item
          label="是否发货"
          prop="is_send"
        >
          <el-radio-group v-model="editOrderForm.is_send">
            <el-radio label="未发货"></el-radio>
            <el-radio label="已发货"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否付款"
          prop="pay_status"
        >
          <el-radio-group v-model.number="editOrderForm.pay_status">
            <el-radio label="未付款"></el-radio>
            <el-radio label="已付款"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editOrderVisiable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editOrder"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { gainOrdersList, modifyOrder } from 'network/order.js'
import citydata from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      //订单列表查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //要修改的订单号
      orderNumber: '',
      //修改的订单信息绑定表单
      editOrderForm: {
        is_send: '',
        pay_status: '',
        order_price: 200,
      },
      //修改订单对应的表单数据验证规则
      editOrderFormRules: {
        is_send: [{ required: true, message: '请选择是否付款', trigger: 'change' }],
        pay_status: [{ required: true, message: '请选择是否付款', trigger: 'change' }],
      },
      //修改订单对话框显示隐藏
      editOrderVisiable: false,
      //搜索订单绑定值
      orderValue: '',
      //储存所有订单列表
      orderList: [],
      //总页数
      total: 0,
      //省市区列表数据
      citydata,
      //控制修改地址对话框显示隐藏
      addressdialogVisible: false,
      //修改地址对应的表单数据
      addressForm: {
        address: [],
        detailAddress: '',
      },
      //修改地址对应的表单数据验证规则
      addressFormrules: {
        address: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },
      //级联选择器配置项
      addressprops: {
        expandTrigger: 'hover',
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //查询订单数据列表
    async getOrderList() {
      const res = await gainOrdersList(this.queryInfo)
      console.log(res)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    //改变页码值和每页显示条数值得事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    //点击编辑地址按钮时间监听
    editAddress() {
      this.addressdialogVisible = true
    },
    //选择地址事件监听
    handleChange() {},
    //重置地址表单
    resetForm() {
      this.$refs.addressForm.resetFields()
    },
    //重置修改订单对话框的表单
    resetEditForm() {
      this.$refs.editOrderForm.resetFields()
    },
    //显示修改订单对话框
    showEditOrderDialog(id) {
      this.orderNumber = id
      this.editOrderVisiable = true
    },
    //修改订单
    editOrder() {
      //console.log(this.editOrderForm)
      this.$refs.editOrderForm.validate((result) => {
        if (result) {
          console.log(this.editOrderForm)
          if (this.editOrderForm.is_send === '未发货') {
            this.editOrderForm.is_send = 0
          } else {
            this.editOrderForm.is_send = 1
          }
          if (this.editOrderForm.pay_status === '未付款') {
            this.editOrderForm.pay_status = '0'
          } else {
            this.editOrderForm.pay_status = '1'
          }
          //console.log(this.editOrderForm)
          modifyOrder(this.orderNumber, this.editOrderForm).then((res) => {
            if (res.meta.status === 201) {
              this.$message.success('修改订单状态成功')
              this.getOrderList()
              this.editOrderVisiable = false
            } else {
              this.$message.console.error('修改订单状态失败')
            }
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.el-input {
  width: 50% !important;
}
</style>>

