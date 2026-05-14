<template>
  <div>
    <el-col :span="2" :xs="24">
      <el-row :gutter="10" class="mb8" style="margin-top: 10px;">
        <el-col :span="1.5" style="float: right;">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:user:add']"
          >{{ $t('deviceManage.button.addModel') }}</el-button>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="22" :xs="24">
      <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" :data="deviceModelList">
        <el-table-column :label="$t('deviceManage.table.deviceModel')" width="290" align="center" key="modelName" prop="modelName" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.modelName?'':'danger'">
              {{ scope.row.modelName}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('deviceManage.table.canDel')" width="330" align="center" prop="canDel">
          <template slot-scope="scope">
            <el-tag :type="scope.row.canDel? 'success':'danger'">
              {{ scope.row.canDel?$t('system.true'):$t('system.false') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('deviceManage.table.createTime')" width="250" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('deviceManage.table.createBy')" align="center" prop="createBy">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('deviceManage.table.useIcon')" width="400" align="center" prop="iconType">
          <template slot-scope="scope">
            <div
              v-if="scope.row.iconType"
              style="display: flex;
             gap: 6px;
             align-items: center;
             flex-wrap: wrap;
             justify-content: center;
             height: 100%;
             padding: 4px 0;"
            >
            <div
              v-for="(imgItem, index) in getIconImgsByType(scope.row.iconType)"
              :key="index"
              style="text-align: center;"
            >
              <img
                :src="imgItem.iconImg"
                :alt="`${imgItem.deviceIcon}`"
                style="width: 36px;
                 height: 36px;
                 object-fit: contain;
                 border: 1px solid #eee;
                 padding: 1px;"
              />
            </div>
          </div>
          <div v-else style="color: #999; font-size: 12px;">No Icon</div>
        </template>
        </el-table-column>

        <el-table-column
          :label="$t('system.operate')"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope" >
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
    </el-col>
    <!-- 添加或修改设备型号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-form-item :label="$t('deviceManage.addAndEdit.deviceModel')" prop="modelName">
              <el-input v-model="form.modelName" :placeholder="$t('deviceManage.addAndEdit.tip1')" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 设备图标类型下拉框 -->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('deviceManage.addAndEdit.iconType')" prop="iconType">
              <!-- 下拉选择框 -->
              <el-select
                v-model="form.iconType"
                clearable
                style="width: 300px; margin-bottom: 10px;"
              >
                <el-option
                  v-for="item in deviceIconName"
                  :key="item.iconType"
                  :label="item.iconTypeName"
                  :value="item.iconType"
                />
              </el-select>

              <!-- 该类型下的所有图片横向排列 -->
              <div v-if="form.iconType" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <div
                  v-for="(imgItem, index) in getIconImgsByType(form.iconType)"
                  :key="index"
                  style="text-align: center;"
                >
                  <!-- 图片展示 -->
                  <img
                    :src="imgItem.iconImg"
                    :alt="`${imgItem.deviceIcon}`"
                    style="width: 50px; height: 50px; object-fit: contain; border: 1px solid #eee; padding: 2px;"
                  />
                </div>
              </div>

              <!-- 未选择时的提示 -->
              <div v-else style="color: #999; font-size: 12px;">
                请先选择设备图标类型
              </div>
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

<script>
import { listByTypeId, getModelById, addDeviceModel, updateDeviceModel, delDeviceModel } from  "@/api/device/model";
import deviceIconConfig from '@/utils/DeviceIconConfig';

export default {
  name: "deviceModel",
  props: ['selectedTypeId'],
  data(){
    return {

      canDelDict:[
        { value: true, label: this.$t('system.true') },
        { value: false, label: this.$t('system.false') },
      ],
      deviceIconName:[],

      // 遮罩层
      loading: true,
      // 设备型号表格数据
      deviceModelList: null,
      deviceTypeId: 0,
      deviceModelId: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modelName: [
          { required: true, message: this.$t('deviceManage.addAndEdit.rule2'), trigger: "blur" },
          { min: 2, max: 20, message: this.$t('deviceManage.addAndEdit.rule3'), trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.deviceTypeId = this.selectedTypeId;
    this.deviceIconName = deviceIconConfig.deviceIconName;
    this.getList();
  },

  methods: {

    // 返回该iconType下的所有图片
    getIconImgsByType(iconType) {
      // 筛选出所有匹配当前iconType的图片项
      return deviceIconConfig.getIconImgsByType(iconType);
    },

    // 根据选中的iconType匹配对应的图片路径
    getIconImgByType(iconType) {
      return deviceIconConfig.getIconImgByType(iconType);
    },

    getList() {
      this.loading = true;
      listByTypeId(this.deviceTypeId).then(res => {
          this.deviceModelList = res.data;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        modelName: undefined,
        typeId: this.deviceTypeId,
        iconType: '1',
        canDel: true,
      };
      this.resetForm("form");
    },

    /** 新增 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t('deviceManage.addAndEdit.addModel');
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const modelId = row.id;
      getModelById(modelId).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = this.$t('deviceManage.addAndEdit.editModel');
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
                `警告：请确认是否配置该设备型号为不可删除？若是则该设备种类将不可被修改或删除，若想修改或删除请联系系统管理员！`
              );
              if (!isConfirm) {
                return;
              }
            }
            updateDeviceModel(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if(!this.form.canDel){
              // 确认对话框
              const isConfirm = await this.$modal.confirm(
                `警告：请确认是否配置该设备型号为不可删除？若是则该设备种类将不可被修改或删除，若想修改或删除请联系系统管理员！`
              );
              if (!isConfirm) {
                return;
              }
            }
            addDeviceModel(this.form).then(res => {
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
      const modelId = row.id;
      this.$modal.confirm('是否确认删除设备型号编号为"' + modelId + '"的数据项？').then(function() {
        return delDeviceModel(modelId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

  }
};

</script>

<style >
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
</style>
