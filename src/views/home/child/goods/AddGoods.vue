<template>
  <div class="add-goods">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示消息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :active="activeIndex-0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 -->
      <!-- form表单区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position='top'
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave='tagchange'
          @tab-click='tabchange'
        >
          <el-tab-pane
            label="基本信息"
            name='0'
          >
            <el-form-item
              prop="goods_name"
              label="商品名称"
            >
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              prop="goods_price"
              label="商品价格"
            >
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item
              prop="goods_weight"
              label="商品重量"
            >
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item
              prop="goods_number"
              label="商品数量"
            >
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="选择分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCateList"
                :props="goodsCateProp"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 动态参数选择区域  -->
          <el-tab-pane
            label="商品参数"
            name='1'
          >

            <el-form-item
              :label="item.attr_name"
              v-for="item in dynamicParams"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 静态属性区域 -->
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name='2'
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in staticProperty"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name='3'
          >
            <!-- 上传图片区域 -->
            <el-upload
              :action="upload"
              list-type="picture"
              :headers='headers'
              :on-success='uploadSuccess'
              :on-remove='removepic'
              :on-preview='preview'
            >

              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>

          </el-tab-pane>
          <!-- 预览图片的dialog对话框 -->
          <el-dialog
            title="图片预览"
            :visible.sync="previewImgDialogVisible"
            width="50%"
            @click="closePreview"
          >
            <img
              :src="previewRoute"
              alt=""
              class="previewImg"
            >
          </el-dialog>
          <el-tab-pane
            label="商品内容"
            name='4'
          >
            <!-- 商品内容编辑区域 -->
            <template>
              <!-- Two-way Data-Binding -->
              <quill-editor
                ref="myQuillEditor"
                v-model="addGoodsForm.goods_introduce"
              />
            </template>
            <!-- 确认添加添加商品按钮 -->
            <el-button
              type="primary"
              @click="addGood"
              class="mar"
            >
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
//导入富文本编辑器
import { getCateList, getParamsList, addGoods } from 'network/goods.js'
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条绑定的进度值
      activeIndex: '0',
      //添加商品form表单绑定的对象
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        //图片上传成功的服务器储存路径
        uploadRoute: [],
        goods_introduce: '',
        //级联选择器选中项
        goods_cat: [],
      },
      //添加商品form表单的验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 4 到 6个字符' },
        ],
        goods_price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入数量', trigger: 'blur' }],
      },
      //所有商品分类列表
      goodsCateList: [],
      //级联选择器配置项
      goodsCateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
      },
      //动态参数数组
      dynamicParams: [],
      //静态属性数组
      staticProperty: [],
      //图片上传地址
      upload: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传网络请求的请求头加上token
      headers: {
        authorization: window.sessionStorage.getItem('token'),
      },
      //储存预览图片的url地址
      previewRoute: '',
      //预览图片对话框的显示隐藏
      previewImgDialogVisible: false,
    }
  },
  created() {
    this.gainCateList()
  },
  methods: {
    //获取所有商品分类列表
    async gainCateList() {
      const res = await getCateList()
      //console.log(res)
      this.goodsCateList = res.data
    },
    //当级联选择器选中项发生变化时监听事件
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    //当标签页切换的时候
    tagchange(to, from) {
      if (from === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    //切换标签页监听事件获取动态参数
    async tabchange() {
      if (this.activeIndex === '1') {
        const res = await getParamsList(this.getCate, 'many')
        //console.log(res)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length ? item.attr_vals.split(',') : []
        })
        this.dynamicParams = res.data
      } else if (this.activeIndex === '2') {
        //获取静态属性
        const res = await getParamsList(this.getCate, 'only')
        //console.log(res.data)
        this.staticProperty = res.data
      }
    },
    //图片上传成功时的钩子函数
    uploadSuccess(res) {
      //console.log(res)
      const picInfo = {
        pic: res.data.tmp_path,
      }
      this.addGoodsForm.uploadRoute.push(picInfo)
    },
    //监听移除图片时事件
    removepic(res) {
      //console.log(res)
      const route = res.response.data.tmp_path
      const index = this.addGoodsForm.uploadRoute.findIndex((item) => {
        item.pic = route
      })
      this.addGoodsForm.uploadRoute.splice(index, 1)
      //console.log(this.addGoodsForm)
    },
    //预览图片时事件
    preview(res) {
      //console.log(res)
      const route = res.response.data.url
      //console.log(route)
      this.previewRoute = route
      this.previewImgDialogVisible = true
    },
    //关闭图片预览
    closePreview() {
      return false
    },
    //确认添加商品事件
    addGood() {
      //console.log(this.addGoodsForm)
      const form = _.cloneDeep(this.addGoodsForm)
      form.goods_cat = form.goods_cat.join(',')
      form.goods_price = parseInt(form.goods_price)
      form.goods_weight = parseInt(form.goods_weight)
      form.goods_number = parseInt(form.goods_number)
      console.log(form)
      //console.log(this.dynamicParams)
      //console.log(this.staticProperty)
      //将动态参数和静态属性添加到表单中
      form.attrs = []
      this.dynamicParams.forEach((item) => {
        const obj = { attr_id: '', attr_value: '' }
        obj.attr_id = item.attr_id
        obj.attr_value = item.attr_vals.join(',')
        form.attrs.push(obj)
      })
      this.staticProperty.forEach((item) => {
        const obj = { attr_id: '', attr_value: '' }
        obj.attr_id = item.attr_id
        obj.attr_value = item.attr_vals
        form.attrs.push(obj)
      })
      console.log(form)
      this.$refs.addFormRef.validate(async (res) => {
        if (!res) {
          this.$message.error('信息填写有误或者不完整')
          return
        } else {
          const res = await addGoods(form)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('创建商品失败')
          } else {
            this.$message.success('创建商品成功')
            this.$router.push('/goods')
          }
        }
      })
    },
  },
  computed: {
    //获取选择的商品三级分类
    getCate() {
      return this.addGoodsForm.goods_cat[2]
    },
  },
}
</script>

<style scoped>
.el-tabs--left {
  margin-top: 20px;
}
.el-steps {
  margin: 20px 0px;
}
.el-checkbox {
  margin: 5px !important;
}
.previewImg {
  width: 100%;
}
.mar {
  margin-top: 20px;
}
</style>
