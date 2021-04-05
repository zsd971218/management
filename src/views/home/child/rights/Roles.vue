<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button
        type="primary"
        @click="addRoleDialog=true"
      >添加角色</el-button>
      <!-- 用户权限表格 -->
      <template>
        <el-table
          :data="role"
          border
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 权限扩展视图 -->
              <el-row
                v-for="(item1, index1) in scope.row.children"
                :key="item1.id"
                :class="['flex', 'bor-bm', index1 === 0 ? 'bor-top' : '']"
              >
                <el-col :span="6">
                  <el-tag
                    closable
                    @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row
                    v-for="(item2, index2) in item1.children"
                    :key="item2.id"
                    :class="[
                      'flex',
                      index2 === item1.children.length - 1 ? '' : 'bor-bm',
                    ]"
                  >
                    <el-col :span="12">
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="12">
                      <el-row
                        v-for="(item3, index3) in item2.children"
                        :key="item3.id"
                        :class="['mar']"
                      >
                        <el-tag
                          type="warning"
                          closable
                          @close="deleteRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
          ></el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="300px"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeRole(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="small"
                @click="showRightsDialog(scope.row)"
              >分配权限</el-button>

            </template>

          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 分配权限对话框 -->
    <template>
      <el-dialog
        title="选择权限"
        :visible.sync="isShowRightsDialog"
        width="50%"
        @close="emptyDefault"
      >
        <template>
          <el-tree
            :data="rightsList"
            :props="treeProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultCheck"
            ref="tree"
            default-expand-all
          ></el-tree>
        </template>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="isShowRightsDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="modifyRigths"
          >确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addRoleDialog"
      width="50%"
    >
      <span>添加角色</span>
      <!-- 添加角色表单 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="increaseRole"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesData, removeRight, getAllRights, editRights, addRole, deleteRole } from 'network/rights.js'
export default {
  name: 'Role',
  data() {
    return {
      //储存角色数组
      role: [],
      //储存所有权限列表
      rightsList: [],
      isShowRightsDialog: false,
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defaultCheck: [],
      //角色Id
      roleId: '',
      //添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加角色对话框
      addRoleDialog: false,
      //添加角色表单验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    //获取角色列表
    this.getRole()
    //this.assignRights()
  },
  methods: {
    async getRole() {
      const res = await getRolesData()
      console.log(res)
      this.role = res.data
    },
    async deleteRightById(pm1, pm2) {
      const isConfirm = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).catch((err) => err)
      // console.log(isConfirm)
      if (isConfirm === 'confirm') {
        removeRight(pm1, pm2).then((res) => {
          if (res.meta.status === 200) {
            //console.log(res)
            this.$message.success('删除权限成功')
            pm1.children = res.data
          } else {
            this.$message.error('删除权限失败')
          }
        })
      }
    },
    //获取所有权限
    async assignRights() {
      const res = await getAllRights()
      //console.log(res)
      this.rightsList = res.data
    },
    //显示选择权限对话框
    async showRightsDialog(node) {
      this.roleId = node.id
      await this.assignRights()
      this.getNode(node, this.defaultCheck)
      //console.log(this.defaultCheck)
      this.isShowRightsDialog = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defaultCheck)
      })
    },
    //定义递归函数获取所有节点
    getNode(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.getNode(item, arr)
        })
      }
      // console.log(arr)
    },
    //清空defaultList 防止产生默认选中bug
    emptyDefault() {
      this.defaultCheck = []
    },
    //发送修改权限请求
    async modifyRigths() {
      const half = this.$refs.tree.getHalfCheckedKeys()
      const check = this.$refs.tree.getCheckedKeys()
      half.push.apply(half, check)
      //console.log(half)
      const str = half.join(',')
      //console.log(str)
      const res = await editRights(this.roleId, str)
      //console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('修改权限成功')
        this.getRole()
        this.isShowRightsDialog = false
      } else {
        this.$message.error('修改权限失败')
      }
    },
    //添加角色
    increaseRole() {
      this.$refs.addRoleFormRef.validate(async (res) => {
        if (!res) return false
        const result = await addRole(this.addRoleForm)
        if (result.meta.status === 201) {
          this.$message.success('添加角色成功')
          this.getRole()
          this.addRoleDialog = false
        } else {
          this.$message.error('添加角色失败')
        }
      })
    },
    //删除角色
    removeRole(id) {
      this.$confirm('此操作将永久删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRole(id).then((res) => {
            if (res.meta.status === 200) {
              this.$message.success('删除角色成功')
              this.getRole()
            } else {
              this.$message.error('删除角色失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style scoped>
.bor-bm {
  border-bottom: 1px solid #eee;
}
.bor-top {
  border-top: 1px solid #eee;
}
.mar {
  margin: 10px 0px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
