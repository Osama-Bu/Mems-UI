<template>
  <div class="app-container">
    <navbar/>
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
          <el-form-item :label="$t('deviceManage.search.typeName')" prop="typeName">
            <el-input
              v-model="queryParams.typeName"
              :placeholder="$t('deviceManage.search.tip1')"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item :label="$t('deviceManage.search.createTime')">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="$t('deviceManage.search.startTime')"
              :end-placeholder="$t('deviceManage.search.endTime')"
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
            >{{ $t('deviceManage.button.addType') }}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="deviceTypeList" @selection-change="handleSelectionChange" @expand-change="handleExpandChange" stripe>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column :label="$t('deviceManage.table.deviceType')" width="500" align="center" key="typeName" prop="typeName" v-if="columns[1].visible" :show-overflow-tooltip="true" >
          </el-table-column>
          <el-table-column :label="$t('deviceManage.table.canDel')" width="120" align="center" prop="canDel" v-if="columns[2].visible"  >
            <template slot-scope="scope">
              <el-tag :type="scope.row.canDel? 'success':'danger'">
                {{ scope.row.canDel?$t('system.true'):$t('system.false') }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column :label="$t('deviceManage.table.createTime')" width="460" align="center" prop="createTime" v-if="columns[7].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('deviceManage.table.createBy')" align="center" prop="createBy" v-if="columns[7].visible">
            <template slot-scope="scope">
              <span>{{ scope.row.createBy }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="deviceType"
            :label="$t('deviceManage.table.includeModel')"
            type="expand"
            align="center"
            width="220"
          >
            <template slot-scope="props" style="left: 500px">
              <device-model ref="childRef" :selectedTypeId="selectedId" :deviceAllIcons="deviceIcons"></device-model>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('system.operate')"
            align="center"
            width="240"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                :disabled="!scope.row.canDel"
              >{{ $t('system.edit') }}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                :disabled="!scope.row.canDel"
              >{{ $t('system.delete') }}</el-button>
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

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-form-item :label="$t('deviceManage.search.typeName')" prop="typeName">
              <el-input v-model="form.typeName" :placeholder="$t('deviceManage.search.tip1')" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item :label="$t('deviceManage.table.canDel')">
            <el-radio-group v-model="form.canDel">
              <el-radio
                v-for="dict in canDelDict"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

import { pageDeviceType, getTypeById, addDeviceType, updateDeviceType, delDeviceType } from  "@/api/device/type";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import deviceModel from "./model/deviceModel";
import { Navbar } from '@/layout/components';

export default {
  name: "deviceType",
  components: {
    deviceModel,
    Navbar
  },
  data() {
    return {

      canDelDict:[
        { value: true, label: this.$t('system.true') },
        { value: false, label: this.$t('system.false') },
      ],
      deviceIcons:[],

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
      // 设备种类表格数据
      deviceTypeList: null,
      // 选中设备种类id
      selectedId: 0,
      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeName: undefined,
        canDel: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `产品编号`, visible: true },
        { key: 1, label: `产品名称`, visible: true },
        { key: 2, label: `配置id`, visible: true },
        { key: 3, label: `所属公司`, visible: true },
        { key: 4, label: `图片`, visible: true },
        { key: 5, label: `产品介绍`, visible: true },
        { key: 6, label: `状态`, visible: true },
        { key: 7, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: this.$t('deviceManage.addAndEdit.rule1'), trigger: "blur" },
          { min: 2, max: 20, message: this.$t('deviceManage.addAndEdit.rule3'), trigger: 'blur' }
        ]
      }
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {

    handleExpandChange(row, expandedRows) {
      this.selectedId = Number(row.id);
    },

    /** 查询设备列表 */
    getList() {
      this.loading = true;
      // 增加时间搜索范围
      this.addTimeRange();
      pageDeviceType(this.queryParams).then(res => {
          this.deviceTypeList = res.rows;
          this.total = res.total;
          this.loading = false;
        }
      );
    },

    addTimeRange(){
      let timeRange = Array.isArray(this.dateRange) ? this.dateRange : [];
      if(timeRange[0]!==undefined){
        this.queryParams.startTime = timeRange[0] +"T00:00:00";
      }
      if(timeRange[1]!==undefined){
        this.queryParams.endTime = timeRange[1]+ "T23:59:59";
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        typeName: undefined,
        canDel: true,
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
      this.queryParams.startTime = undefined;
      this.queryParams.endTime = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t('deviceManage.addAndEdit.addType');
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const typeId = row.id || this.ids;
      getTypeById(typeId).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = this.$t('deviceManage.addAndEdit.editType');
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            if(!this.form.canDel){
              // 确认对话框
              const isConfirm = await this.$modal.confirm(
                `警告：请确认是否配置该设备种类为不可删除？若是则该设备种类将不可被修改或删除，若想修改或删除请联系系统管理员！`
              );
              if (!isConfirm) {
                return;
              }
            }
            updateDeviceType(this.form).then(res =>{
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
            });
          } else {
            if(!this.form.canDel){
              // 确认对话框
              const isConfirm = await this.$modal.confirm(
                `警告：请确认是否配置该设备种类为不可删除？若是则该设备种类将不可被修改或删除，若想修改或删除请联系系统管理员！`
              );
              if (!isConfirm) {
                return;
              }
            }
            addDeviceType(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      try {
        // 确定要删除的设备ID数组
        const typeId = row.id;
        if (!typeId) {
          this.$modal.msgWarning("请选择要删除的选项");
          return;
        }

        // 确认对话框
        const isConfirm = await this.$modal.confirm(
          `是否确认删除编号为"${typeId}"的数据项？`
        );
        if (!isConfirm) return;

        // 执行批量删除
        delDeviceType(typeId).then(res => {
          if(res.code === 200){
            // 刷新列表并提示
            this.$modal.msgSuccess("删除成功");
            this.getList();
          }
        });
      } catch (error) {
        console.error("删除操作失败:", error);
        this.$modal.msgError("删除过程中发生错误");
      }
    }
  }
};
</script>

<style>

.custom-tooltip {
  max-width: 300px !important;
  background: #333 !important;
  color: #fff !important;
}
.truncate-text {
  display: inline-block;
  max-width: 400px;  /* 单元格内显示的最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.demo-table-expand {
  background-color: #FFFFE0;
  font-size: 0;
}
.el-form-item-1 {
  margin-left: 20px;
  margin-right: 0;
  margin-bottom: 0;
  width: 96%;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
</style>
