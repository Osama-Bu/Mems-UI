<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.deviceId')" prop="cdId">
              <el-input v-model.number="form.cdId" :placeholder="$t('deviceInfo.addAndEdit.tip1')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.deviceModel')" prop="modelId">
              <div class="block">
                <el-cascader
                  v-model="selectModelOptionsValue"
                  :options="deviceTypeOptions"
                  :props="cascaderProps"
                  style="width: 100%;"
                  @change="handleTypeChange"
                >

                </el-cascader>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 设备图标选择 -->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('deviceInfo.addAndEdit.deviceIcon')" prop="deviceIcon">
              <!-- 无设备型号时的提示 -->
              <div v-if="!form.modelId" style="color: #999; font-size: 12px; padding: 10px 0;">
                {{ $t('deviceInfo.addAndEdit.tip2') }}
              </div>

              <!-- 有设备型号时显示图标列表（横向排列 + 互斥勾选） -->
              <div v-else>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; padding: 10px 0;">
                  <div
                    v-for="(icon, index) in deviceIconsList"
                    :key="index"
                    style="cursor: pointer;"
                    @click="selectIcon(icon)"
                  >
                    <!-- 勾选状态样式：选中时加蓝色边框，未选中时灰色边框 -->
                    <div :style="{
                      width: '48px',
                      height: '48px',
                      border: form.deviceIcon === icon.deviceIcon ? '2px solid #409EFF' : '1px solid #eee',
                      borderRadius: '4px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }">
                      <img
                        :src="icon.iconImg"
                        :alt="icon.iconName"
                        style="width: 100%; height: 100%; object-fit: contain;"
                      />
                    </div>
                    <!-- 图标名称/编号 -->
                    <div style="font-size: 12px; color: #666; text-align: center; margin-top: 4px;">
                      {{ icon.iconName }}
                    </div>
                  </div>
                </div>

                <!-- 无图标时的提示 -->
                <div v-if="deviceIconsList.length === 0" style="color: #999; font-size: 12px; padding: 10px 0;">
                  该设备型号暂无可用图标
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.deviceName')" prop="deviceName">
              <el-input v-model="form.deviceName" :placeholder="$t('deviceInfo.addAndEdit.tip3')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-hasPermi="['vue:device:belong']">
            <el-form-item :label="$t('deviceInfo.addAndEdit.belong')" prop="deptId">
              <el-select v-model="form.deptId">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.deptName"
                  :value="item.deptId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.startTime')" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss"
                              :placeholder="$t('deviceInfo.addAndEdit.tip8')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.show')" prop="show">
              <el-switch
                v-model="form.show"
                :active-value=true
                :inactive-value=false
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.addAndEdit.ext')" prop="ext">
              <el-input v-model="form.ext" :placeholder="$t('deviceInfo.addAndEdit.tip9')"/>
            </el-form-item>
          </el-col>
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
import { updateDeviceInfo, getDeviceTypeTree } from '@/api/device/device'
import { listDept } from '@/api/system/dept'
import { getModelById } from '@/api/device/model'
import deviceIconConfig from '@/utils/DeviceIconConfig';

export default {
  name: 'GliderUpdate',
  data() {
    return {
      // 设备图标列表（根据型号加载）
      deviceIconsList: [],
      // 全部的设备图标
      deviceIcons:[],

      rules: {
        deviceName: [
          { required: true, message: this.$t('deviceInfo.addAndEdit.tip3'), trigger: 'blur' }
        ],
        cdId: [
          { required: true, message: this.$t('deviceInfo.addAndEdit.tip1'), trigger: 'blur' },
          { type: 'number', min: -2147483648, max: 2147483648, message: this.$t('deviceInfo.addAndEdit.tip10'), trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: this.$t('deviceInfo.addAndEdit.tip11'), trigger: 'change' }
        ]
      },
      form: {
        id: Number,
        cdId: Number,
        deviceName: undefined,
        type: undefined,
        model: undefined,
        deptId: undefined,
        startTime: undefined,
        show: undefined,
        ext: undefined,
        deviceIcon: '', // 选中的图标ID
      },
      updateForm: {
        id: Number,
        cdId: Number,
        deviceName: undefined,
        deviceType: undefined,
        deviceModel: undefined,
        deptId: undefined,
        startTime: undefined,
        show: undefined,
        ext: undefined,

        // 暂未使用
        deviceRef: undefined,
        deviceIcon: undefined,
        imgUrl: undefined,
        status: undefined,
        deactivate: undefined,
        deactivateTime: undefined
      },
      deviceTypeOptions: [],
      selectModelOptionsValue: [],
      cascaderProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },

      title: '',
      open: false,

      deptOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      }
    }
  },
  mounted() {
  },
  created() {
    this.deviceIcons = deviceIconConfig.deviceIcons;
  },
  methods: {
    handleTypeChange(value) {
      this.form.modelId = value[1];
      // 型号变更后加载对应图标
      this.loadDeviceIconsByModelId(this.form.modelId);
    },
    // 根据设备型号ID加载图标列表
    async loadDeviceIconsByModelId(modelId) {
      if (!modelId) {
        this.deviceIconsList = [];
        this.form.deviceIcon = ''; // 清空选中状态
        return;
      }
      try {
        // 调用接口获取该型号对应的图标列表
        const res = await getModelById(modelId);
        if (res.code === 200) {
          this.deviceIconsList = deviceIconConfig.getDeviceIconsByIconType(res.data.iconType);
        } else {
          this.$message.error('调用设备型号接口失败');
          this.deviceIconsList = [];
        }
      } catch (error) {
        console.error('接口异常：', error);
        this.$message.error('调用设备型号接口失败，请重试');
        this.deviceIconsList = [];
      }
    },
    // 选择图标（互斥）
    selectIcon(icon) {
      this.form.deviceIcon = icon.deviceIcon; // 赋值即互斥，每次只能选一个
      // 强制更新视图
      this.$forceUpdate();
    },

    getTypeOptionsValue(modelId) {
      let arr = []
      for (const l1 of this.deviceTypeOptions) {
        if (l1.children) {
          for (const l2 of l1.children) {
            if (l2.id === modelId) {
              arr = [l1.id, l2.id]
              break
            }
          }
        }
      }
      return arr
    },
    init() {
      if (this.$store.getters.permissions.indexOf('system:dept:list') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        //获取部门列表
        listDept(this.queryParams).then((response) => {
          this.deptOptions = []
          for (let item of response.data) {
            let option = {
              deptId: item.deptId,
              deptName: item.deptName
            }
            this.deptOptions.push(option)
          }
        })
      }

      // 获取设备种类和型号
      getDeviceTypeTree().then(res => {
        this.deviceTypeOptions = res.data
        this.selectModelOptionsValue = this.getTypeOptionsValue(this.form.modelId)
        // 加载设备图标
        this.loadDeviceIconsByModelId(this.form.modelId);
      })
    },
    //提交修改表单信息
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.updateForm = {
            id: this.form.id,
            cdId: this.form.cdId,
            deviceName: this.form.deviceName,
            deviceType: this.form.typeId,
            deviceModel: this.form.modelId,
            deptId: this.form.deptId,
            startTime: this.form.startTime,
            show: this.form.show,
            ext: this.form.ext,
            deviceIcon: this.form.deviceIcon // 传递选中的图标
          }
          updateDeviceInfo(this.updateForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.$emit('ok', '')
            }
          })
        }
      })
    },
    //关闭修改页面
    cancel() {
      this.open = false
    }
  }
}
</script>

<style scoped>

</style>
