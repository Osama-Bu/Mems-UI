<template>
  <div class="app-container">
    <navbar />
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            :placeholder="$t('systemManage.user.search.tip1')"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 10px;width: 240px;"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item :label="$t('systemManage.user.search.username')" prop="userName">
            <el-input
              v-model="queryParams.userName"
              :placeholder="$t('systemManage.user.search.tip2')"
              clearable
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('systemManage.user.search.phone')" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              :placeholder="$t('systemManage.user.search.tip3')"
              clearable
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('system.status')" prop="status">
            <el-select
              v-model="queryParams.status"
              :placeholder="$t('systemManage.user.search.tip4')"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('system.createTime')" >
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="$t('systemManage.user.search.tip5')"
              :end-placeholder="$t('systemManage.user.search.tip6')"
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
              v-hasPermi="['system:user:add']"
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
              v-hasPermi="['system:user:edit']"
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
              v-hasPermi="['system:user:remove']"
            >{{ $t('system.delete') }}</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <!-- <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" /> -->
          <el-table-column :label="$t('systemManage.user.table.username')" align="center" key="userName" prop="userName" v-if="columns[0].visible" :show-overflow-tooltip="true" />
          <el-table-column :label="$t('systemManage.user.table.nickname')" align="center" key="nickName" prop="nickName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column :label="$t('systemManage.user.table.organization')" align="center" key="deptName" prop="dept.deptName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column :label="$t('systemManage.user.table.phone')" align="center" key="phonenumber" prop="phonenumber" v-if="columns[3].visible" width="120" />
          <el-table-column :label="$t('system.status')" align="center" key="status" v-if="columns[4].visible">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                :disabled="statusdisable"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.createTime')" align="center" prop="createTime" v-if="columns[5].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            v-if="columns[6].visible"
          >
            <template slot-scope="scope" v-if="$store.state.user.name.indexOf('admin')!==-1?($store.state.user.name === 'admin' ? scope.row.userId !== 1 :$store.state.user.name!==scope.row.userName):($store.state.user.name==scope.row.userName?$store.state.user.name!==scope.row.userName : scope.row.userName.indexOf('admin')==-1)">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >{{ $t('system.edit') }}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >{{ $t('system.delete') }}</el-button>
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit','device:user-device:page']">
                <el-button size="mini" type="text" icon="el-icon-d-arrow-right" v-hasPermi="['system:user:resetPwd','system:user:edit:role','device:user-device:page']">
                  {{ $t('systemManage.user.table.more') }}</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                    v-hasPermi="['system:user:resetPwd']">
                    {{ $t('systemManage.user.resetPwd.label') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit:role']">
                    {{ $t('systemManage.user.assignRoles.label') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="handleUserDevices"
                    icon="el-icon-ship"
                    v-hasPermi="['device:user-device:page']"
                    >{{ $t('systemManage.user.associatedDevice.label') }}</el-dropdown-item>
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.nickname')" prop="nickName">
              <el-input v-model="form.nickName"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.nickname')"
                        maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.organization')" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true"
                          :placeholder="$t('system.pleaseSelect')+ ' '+ $t('systemManage.user.addAndEdit.organization')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.phone')" prop="phonenumber">
              <el-input v-model="form.phonenumber"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.phone')"
                        maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.email')" prop="email">
              <el-input v-model="form.email"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.email')"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" :label="$t('systemManage.user.addAndEdit.username')" prop="userName">
              <el-input v-model="form.userName"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.username')"
                        maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" :label="$t('systemManage.user.addAndEdit.password')" prop="password">
              <el-input v-model="form.password"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.password')"
                        type="password" maxlength="20" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.sex')">
              <el-select v-model="form.sex"
                         :placeholder="$t('system.pleaseSelect')+ ' '+ $t('systemManage.user.addAndEdit.sex')">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.user.addAndEdit.role')">
              <el-select v-model="form.roleIds" multiple
                         :placeholder="$t('system.pleaseSelect')+ ' '+ $t('systemManage.user.addAndEdit.role')">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" v-if="$store.state.user.name === 'admin'">
            <el-form-item :label="$t('systemManage.user.addAndEdit.tenant')">
              <el-select v-model="form.tenantId"
                         :placeholder="$t('system.pleaseSelect')+ ' '+ $t('systemManage.user.addAndEdit.tenant')">
                <el-option
                  v-for="item in tenantOptions"
                  :key="item.id"
                  :label="item.tenantName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('systemManage.user.addAndEdit.homeLogo')"
                          v-if="$store.state.user.name === 'admin'||$store.state.user.name === 'hzadmin'">
              <el-input v-model="form.remark" type="textarea"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.user.addAndEdit.homeLogo')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
    Navbar
} from '@/layout/components'

export default {
  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect,Navbar },
  data() {
    return {
      // 状态权限显示隐藏
      statusdisable: false,
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      //租户选项
      tenantOptions:[],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        // { key: 0, label: `用户编号`, visible: true },
        { key: 0, label: `用户名称`, visible: true },
        { key: 1, label: `用户昵称`, visible: true },
        { key: 2, label: `组织`, visible: true },
        { key: 3, label: `手机号码`, visible: true },
        { key: 4, label: `状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
        { key: 6, label: `操作`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          },
          { required: true, message: "邮箱地址不能为空", trigger: "blur" }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
      if(this.$store.getters.permissions.indexOf('system:user:edit') == -1 &&
          this.$store.getters.permissions.indexOf('system:user:remove') == -1 &&
          this.$store.getters.permissions.indexOf('system:user:resetPwd') == -1 &&
          this.$store.getters.permissions.indexOf('system:user:edit') == -1 &&
          this.$store.getters.permissions.indexOf('*:*:*') ==-1){
          this.columns[6].visible = false
      } else {
          this.columns[6].visible = true
      }
      if(this.$store.getters.permissions.indexOf('system:user:edit') !== -1 || this.$store.getters.permissions.indexOf('*:*:*')!==-1){
          this.statusdisable = false
      } else {
          this.statusdisable = true
      }
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          if(this.$store.getters.permissions.indexOf('*:*:*') ==-1){
              this.userList = this.userList.filter(function(item){
                  return item.userName !== 'admin'
              })
          }
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function() {
        return changeUserStatus(row.userId, row.status);
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
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
        tenantId:undefined
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
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        case "handleUserDevices":
          this.handleUserDevices(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.tenantOptions = response.tenants;
        this.open = true;
        this.title = this.$t('systemManage.user.addAndEdit.addTitle');
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.tenantOptions = response.tenants;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.$set(this.form, "tenantId", response.tenantId);
        this.open = true;
        this.title = this.$t('systemManage.user.addAndEdit.editTitle');
        this.form.password = "";
        this.form.remark = decodeURI(response.data.remark)
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt(this.$t('systemManage.user.resetPwd.tip1')
        +' " ' + row.userName + ' " '
        +this.$t('systemManage.user.resetPwd.tip2'),
        this.$t('systemManage.user.resetPwd.title'), {
        confirmButtonText: this.$t('system.confirm'),
        cancelButtonText: this.$t('system.cancel'),
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: this.$t('systemManage.user.resetPwd.tip3')
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(res => {
            this.$modal.msgSuccess("修改成功");
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    handleUserDevices(row){
      this.$router.push({
        path: "/system/userdevices",
        query: {
          deptId: row.deptId,
          userId: row.userId,
        },
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.form.remark = encodeURI(this.form.remark)
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否确认删除所选用户？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
