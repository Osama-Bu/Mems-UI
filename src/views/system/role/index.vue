<template>
  <div class="app-container">
    <navbar />
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('systemManage.role.search.roleName')" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.role.search.roleName')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('systemManage.role.search.permission_character')" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.role.search.permission_character')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('system.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('systemManage.role.search.tip1')"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.createTime')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('systemManage.role.search.tip2')"
          :end-placeholder="$t('systemManage.role.search.tip3')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('system.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('system.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >{{ $t('system.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >{{ $t('system.edit') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >{{ $t('system.delete') }}</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="角色编号" prop="roleId" width="120" /> -->
      <el-table-column :label="$t('systemManage.role.table.roleName')" prop="roleName" :show-overflow-tooltip="true" width="180" />
      <el-table-column :label="$t('systemManage.role.table.permission_character')" prop="roleKey" :show-overflow-tooltip="true" width="180" />
      <el-table-column :label="$t('systemManage.role.table.showOrder')" prop="roleSort" width="180" />
      <el-table-column :label="$t('system.status')" align="center" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
            :disabled="$store.getters.permissions.indexOf('system:role:edit')===-1 && $store.getters.permissions.indexOf('*:*:*')===-1 ? 0===0 :0!==0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.createTime')" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.operate')" align="center" class-name="small-padding fixed-width" v-if="$store.getters.permissions.indexOf('system:role:edit')==-1 && $store.getters.permissions.indexOf('system:role:remove')==-1 && $store.getters.permissions.indexOf('*:*:*')==-1 ? 0!=0 :0==0">
        <template slot-scope="scope" v-if="$store.state.user.name.indexOf('admin') !== -1 ? true :scope.row.roleKey.indexOf('admin') === -1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="$store.getters.roles.indexOf(scope.row.roleKey)==-1"
          >{{ $t('system.edit') }}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            v-if="$store.getters.roles.indexOf(scope.row.roleKey)==-1"
          >{{ $t('system.delete') }}</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">{{ $t('system.more') }}</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']">{{ $t('systemManage.role.dataPermission.label') }}</el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                v-hasPermi="['system:role:edit']">{{ $t('systemManage.role.assignUsers.label') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item :label="$t('systemManage.role.addAndEdit.roleName')" prop="roleName">
          <el-input v-model="form.roleName"
                    style="width: 360px"
                    :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.role.addAndEdit.roleName')" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            {{ $t('systemManage.role.addAndEdit.permission_character') }}
          </span>
          <el-input v-model="form.roleKey"
                    style="width: 360px"
                    :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.role.addAndEdit.permission_character')" />
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.addAndEdit.showOrder')" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.addAndEdit.tenant')">
          <el-select v-model="form.tenantName"
                     :placeholder="$t('system.pleaseSelect')+ ' '+ $t('systemManage.role.addAndEdit.tenant')">
            <el-option
              v-for="item in tenantOptions"
              :key="item.id"
              :label="item.tenantName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.status')">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.addAndEdit.menu_permission')">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">
            {{ $t('systemManage.role.addAndEdit.expandOrCollapse') }}
          </el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">
            {{ $t('systemManage.role.addAndEdit.selectAllOrDeselectAll') }}
          </el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">
            {{ $t('systemManage.role.addAndEdit.cascade') }}
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
            style="width: 360px"
          ></el-tree>
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.addAndEdit.remark')">
          <el-input v-model="form.remark" type="textarea"
                    style="width: 360px"
                    :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.role.addAndEdit.remark')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="160px">
        <el-form-item :label="$t('systemManage.role.dataPermission.roleName')">
          <el-input v-model="form.roleName" :disabled="true" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.dataPermission.permission_character')">
          <el-input v-model="form.roleKey" :disabled="true" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.dataPermission.permission_range')">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange" style="width: 240px">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systemManage.role.dataPermission.label')" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">
            {{ $t('systemManage.role.addAndEdit.expandOrCollapse') }}
          </el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">
            {{ $t('systemManage.role.addAndEdit.selectAllOrDeselectAll') }}
          </el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">
            {{ $t('systemManage.role.addAndEdit.cascade') }}
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
            style="width: 240px"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancelDataScope">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, deptTreeSelect } from "@/api/system/role";
import { getUser } from "@/api/system/user";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import {
    Navbar
} from '@/layout/components'

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  components: { Navbar },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: this.$t('systemManage.role.dataPermission.range.all')
        },
        {
          value: "2",
          label: this.$t('systemManage.role.dataPermission.range.custom')
        },
        {
          value: "3",
          label: this.$t('systemManage.role.dataPermission.range.selfOrg')
        },
        {
          value: "4",
          label: this.$t('systemManage.role.dataPermission.range.selfOrgAndOwn')
        },
        {
          value: "5",
          label: this.$t('systemManage.role.dataPermission.range.self')
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      tenantOptions: [],
      // postOptions: [],
      // roleOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          if(this.$store.getters.roles.indexOf("admin")==-1){
            this.roleList = response.rows.filter((row)=>{
              return row.roleKey!="admin"
            });
            this.total = response.total-1;
            this.loading = false;
          }else{
            this.roleList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getDeptTree(roleId) {
      return deptTreeSelect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
        getUser().then(response => {
          if(this.$store.getters.roles.indexOf("admin")!==-1){
            this.tenantOptions = response.tenants;
          }else{
            let index=-1;
            response.roles.forEach(item=>{
              if(this.$store.getters.roles.indexOf(item.roleKey)!==-1){
                index=item.tenantId;
                return;
              }
            })
            this.tenantOptions = response.tenants.filter(item=>{
              return item.id==index;
            });
          }
          this.open = true;
          this.title = this.$t('systemManage.role.addAndEdit.addTitle');
        });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);

      getUser().then(response => {
        if(this.$store.getters.roles.indexOf("admin")!==-1){
          this.tenantOptions = response.tenants;
        }else{
          let index=-1;
          response.roles.forEach(item=>{
            if(this.$store.getters.roles.indexOf(item.roleKey)!==-1){
              index=item.tenantId;
              return;
            }
          })
          this.tenantOptions = response.tenants.filter(item=>{
            return item.id==index;
          });
        }
        getRole(roleId).then(response => {
            this.form = response.data;
            const index = this.tenantOptions.findIndex(item => item.id === this.form.tenantId)
            this.form.tenantName = this.tenantOptions[index].tenantName
            this.$nextTick(() => {
                roleMenu.then(res => {
                    let checkedKeys = res.checkedKeys
                    checkedKeys.forEach((v) => {
                        this.$nextTick(()=>{
                            this.$refs.menu.setChecked(v, true ,false);
                        })
                    })
                });
            });
            this.open = true;
            this.title = this.$t('systemManage.role.addAndEdit.editTitle');
          });
      });
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if(value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const deptTreeSelect = this.getDeptTree(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          deptTreeSelect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = this.$t('systemManage.role.dataPermission.title');
      });
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('是否确认删除所选角色数据项？').then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
