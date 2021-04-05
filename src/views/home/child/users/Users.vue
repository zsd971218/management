<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索功能 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="netInfo.query"
            clearable
            @clear="getUserData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button
            type="primary"
            @click="dialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <template>
        <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%"
          @close="dialogClose"
        >
          <el-form
            ref="formRef"
            :model="addUserForm"
            :rules="addUserRules"
          >
            <!-- 用户名 -->
            <el-form-item
              label="用户名"
              prop="username"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="addUserForm.username"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="密码"
              prop="password"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="password"
                v-model="addUserForm.password"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="邮箱"
              prop="email"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="addUserForm.email"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="手机"
              prop="mobile"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="addUserForm.mobile"
              ></el-input>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addUser"
            >确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="modifyDialogVisible"
          width="50%"
          @close="resetDialog"
        >
          <el-form
            ref="editFormRef"
            :model="editUserForm"
            :rules="editUserRules"
          >
            <el-form-item
              label="用户名"
              prop="username"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="editUserForm.username"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              prop="email"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="editUserForm.email"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="mobile"
              label-width="80px"
            >
              <el-input
                prefix-icon="iconfont icon-user"
                type="text"
                v-model="editUserForm.mobile"
              ></el-input>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="modifyDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="editUser"
            >确 定</el-button>
          </span>
        </el-dialog>
        <!-- 用户列表 -->
        <el-table
          :data="userList"
          border
          style="width: 100%"
        >
          <el-table-column type="index"> </el-table-column>
          <el-table-column
            prop="username"
            label="姓名 "
          > </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话 "
          > </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱 "
            width="180px"
          > </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色 "
          > </el-table-column>
          <el-table-column label="状态 ">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeState(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="modifyUser(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeUser(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="small"
                  @click="showEditRoleDialog(scope.row)"
                ></el-button>
              </el-tooltip>
              <!-- 分配权限对话框 -->
              <el-dialog
                title="分配角色"
                :visible.sync="editRoleDialog"
                width="30%"
              >
                <div>当前用户：{{editRole.username}}</div>
                <div class="mar">当前角色：{{editRole.role_name}}</div>
                <div>请选择角色：<template>
                    <el-select
                      v-model="checkedRole"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </template></div>
                <span
                  slot="footer"
                  class="dialog-footer"
                >
                  <el-button @click="editRoleDialog = false, checkedRole='' ">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="updataRole"
                  >确 定</el-button>
                </span>
              </el-dialog>

            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="netInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUser, modifyState, addUser, queryUser, alterUser, deleteUser, getRolesList, setRole } from 'network/home.js'
export default {
  name: 'HomeUser',
  data() {
    //自定义校验规则
    var emailRules = (rule, value, cb) => {
      const email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
      if (email.test(value)) {
        return cb()
      } else {
        cb(new Error('邮箱格式有误'))
      }
    }
    var mobileRules = (rule, value, cb) => {
      const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (mobile.test(value)) {
        return cb()
      } else {
        cb(new Error('手机号格式有误'))
      }
    }
    return {
      userList: [],
      netInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 添加用户对话框显示隐藏
      dialogVisible: false,
      //修改用户对话框显示隐藏
      modifyDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //查询并修改用户信息
      editUserForm: {},
      editUserRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: emailRules, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: mobileRules, trigger: 'blur' },
        ],
      },
      //分配角色对话框显示隐藏
      editRoleDialog: false,
      //所有角色列表
      rolesList: [],
      //储存要分配角色的用户id等信息
      editRole: {},
      //储存选择的新角色ID
      checkedRole: '',
      //添加用户信息验证
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: emailRules, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: mobileRules, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    //请求数据
    this.getUserData()
  },
  methods: {
    //请求用户列表数据
    getUserData() {
      getUser(this.netInfo).then((res) => {
        //console.log(res)
        this.total = res.data.total
        this.userList = res.data.users
      })
    },
    //改变每页条数
    handleCurrentChange(newPage) {
      this.netInfo.pagenum = newPage
      this.getUserData()
    },
    //改变页码
    handleSizeChange(newSize) {
      this.netInfo.pagesize = newSize
      this.getUserData()
    },
    //改变用户状态
    changeState(msg) {
      modifyState(msg).then((res) => {
        //console.log(res)
        if (res.meta.status !== 200) {
          msg.mg_state = !msg.mg_state
          this.$message.error('设置状态失败')
        } else {
          this.$message.success('设置状态成功')
        }
      })
    },
    //对话框关闭触发事件
    dialogClose() {
      this.$refs.formRef.resetFields()
    },
    resetDialog() {
      this.$refs.editFormRef.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.formRef.validate((res) => {
        //console.log(res)
        //console.log(this.addUserForm)
        if (!res) return
        addUser(this.addUserForm).then((result) => {
          //console.log(result)
          if (result.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            this.getUserData()
            this.dialogVisible = false
          }
        })
      })
    },
    //查询用户信息并保存
    async modifyUser(id) {
      let res = await queryUser(id)
      // console.log(res)
      this.editUserForm = res.data
      this.modifyDialogVisible = true
    },
    //修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async (res) => {
        if (!res) return
        const result = await alterUser(this.editUserForm)
        if (result.meta.status !== 200) {
          this.$message.error('修改失败')
          console.log(result)
        } else {
          //提示信息
          this.$message.success('修改成功')
          //更新视图
          this.getUserData()
          //关闭对话框
          this.modifyDialogVisible = false
        }
      })
    },
    //删除用户操作
    removeUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then((res) => {
          //console.log(res)
          deleteUser(id).then((result) => {
            //console.log(result)
            if (result.meta.status !== 200) {
              this.$message.error('删除失败')
            } else {
              this.$message.success('删除成功')
              this.getUserData()
            }
          })
        })
        .catch((res) => {
          console.log(res)
        })
    },
    //分配角色操作
    async showEditRoleDialog(role) {
      //获取所有角色列表
      const res = await getRolesList()
      //储存角色列表
      //console.log(res)
      this.rolesList = res.data
      this.editRole = role
      this.editRoleDialog = true
    },
    //点击确定更新角色
    async updataRole() {
      if (this.checkedRole === '') {
        this.$message.error('请选择角色')
      } else {
        //console.log(this.editRole.id, this.checkedRole)
        const res = await setRole(this.editRole.id, this.checkedRole)
        //console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('设置角色成功')
          this.editRoleDialog = false
          this.getUserData()
          this.checkedRole = ''
        } else {
          this.$message.error('设置角色失败')
        }
      }
    },
  },
}
</script>

<style scoped>
.mar {
  margin: 20px 0px;
}
</style>
