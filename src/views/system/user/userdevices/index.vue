<template>
  <div class="app-container">
    <h4 class="form-header h4">{{ $t('systemManage.user.form.basicInfo') }}</h4>
    <el-form ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('systemManage.user.form.nickname')" prop="nickName">
            <el-input v-model="form.nickName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('systemManage.user.form.loginAccount')" prop="userName">
            <el-input  v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">{{ $t('systemManage.user.associatedDevice.deviceInfo') }}</h4>
        <el-table
          v-loading="loading"
          :data="deviceList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            :label="$t('systemManage.user.associatedDevice.deviceId')"
            align="center"
            key="cdId"
            prop="cdId"
            width="100"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('systemManage.user.associatedDevice.deviceName')"
            align="center"
            key="deviceName"
            prop="deviceName"
            width="240"
            v-if="columns[1].visible"
          />

          <el-table-column
            :label="$t('systemManage.user.associatedDevice.deviceType')"
            align="center"
            key="deviceType"
            prop="deviceType"
            width="180"
            v-if="columns[2].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.deviceType?'':'danger'">
                {{ scope.row.deviceType}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('systemManage.user.associatedDevice.deviceModel')"
            align="center"
            key="deviceModel"
            prop="deviceModel"
            width="180"
            v-if="columns[3].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.deviceModel?'':'danger'">
                {{ scope.row.deviceModel}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('systemManage.user.associatedDevice.icon')"
            width="120" align="center" prop="iconType" v-if="columns[4].visible">
            <template slot-scope="scope">
              <img
                :src="getDeviceIcon(scope.row)"
                alt="设备图标"
                style="width: 40px; height: 40px; object-fit: contain;"
                v-if="getDeviceIcon(scope.row)"
              />
              <span v-else>无图标</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('systemManage.user.associatedDevice.commWay')"
            align="center"
            prop="commWays"
            v-if="columns[5].visible"
          >
            <template #default="scope">
              <div class="tag-container">
                <el-tag
                  v-for="(way, index) in scope.row.commWays"
                  :key="index"
                  class="block-tag"
                  :style="{ color: way.color, borderColor: way.color }"
                >
                  {{ way.label }}：{{ way.code }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('systemManage.user.associatedDevice.createTime')"
            width="200"
            align="center"
            prop="startTime"
            v-if="columns[6].visible"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.startTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('systemManage.user.associatedDevice.deviceStatus')"
            width="200"
            align="center"
            prop="status"
            v-if="columns[7].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="getDeviceStatusType(scope.row.status)">
                {{ getDeviceStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="close()">{{ $t('systemManage.user.form.back') }}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getAuthRole } from "@/api/system/user";
import { getUserDevices, getDeviceTypeTree } from "@/api/device/device";
import deviceIconConfig from '@/utils/DeviceIconConfig';
import deviceCommConfig from '@/utils/DeviceCommConfig';
import deviceStatusConfig from '@/utils/DeviceStatusConfig';

export default {
  name: "UserDevices",
  data() {
    return {
      deviceTypeOptions: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 选中数组
      ids: [],
      //选中数据
      selection: [],
       // 遮罩层
      loading: true,
      // 分页信息
      total: 1,
      pageNum: 1,
      pageSize: 10,
      deviceList:[],
      // 用户信息
      form: {},
      // 列信息
      columns: [
        { key: 0, label: `自定义编号`, visible: true },
        { key: 1, label: `物理ID`, visible: true },
        { key: 2, label: `设备名称`, visible: true },
        { key: 3, label: `下水时间`, visible: true },
        { key: 4, label: `结束时间`, visible: true },
        { key: 5, label: `铱星号`, visible: true },
        { key: 6, label: `北斗号`, visible: true },
        { key: 7, label: `设备型号`, visible: true },
      ],
      //查询字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  async created() {
    const userId =this.$route.query.userId
    getAuthRole(userId).then((response) => {
      this.form = response.user;
    });
    // 初始化设备图标
    await this.getDeviceTypeOptions()
    this.getList();
  },
  methods: {

    // 获取设备类型及型号树
    async getDeviceTypeOptions() {
      await getDeviceTypeTree().then(res => {
        this.deviceTypeOptions = res.data
      })
    },
    // 处理通信方式数据的方法
    processCommWays(item) {
      if (!item.deviceCommunicateResVOS || !Array.isArray(item.deviceCommunicateResVOS)) {
        return []
      }

      return item.deviceCommunicateResVOS.map(comm => {
        // 查找对应的通信方式标签
        const wayOption = deviceCommConfig.commWayOptions.find(option => option.value === comm.communicateType)
        const label = wayOption ? wayOption.label : 'unknown'

        return {
          label: label,
          code: comm.communicateCode,
          type: comm.communicateType,
          color: wayOption ? wayOption.color : 'info'
        }
      })
    },

    // 设备状态
    getDeviceStatusType(status) {
      return deviceStatusConfig.getDeviceStatusType(status);
    },
    getDeviceStatusText(status) {
      return deviceStatusConfig.getDeviceStatusText(status);
    },

    getDeviceIcon(item){
      return deviceIconConfig.getDeviceIcon(item);
    },

    /** 关闭按钮 */
    close() {
      const obj = { path: "/system/user" };
      this.$tab.closeOpenPage(obj);
    },

    //获取数据
    getList() {
      this.loading = true;
      this.deviceList = [];
      let params = {
          "pageNum": this.queryParams.pageNum,
          "pageSize": this.queryParams.pageSize,
          "deptId": this.$route.query.deptId,
      }
      getUserDevices(params).then((res) => {
        console.log(res)
        for (let item of res.rows) {
          // 设备类型型号替换
          const deviceType = this.deviceTypeOptions.find(type => type.id === item.deviceType)
          const deviceTypeName = deviceType ? deviceType.label : 'unknown'
          const deviceModel = deviceType.children.find(model => model.id === item.deviceModel)
          const deviceModelName = deviceModel ? deviceModel.label : 'unknown'

          let device = {
            id: item.id,
            cdId: item.cdId,
            deviceName: item.deviceName,
            deviceType: deviceTypeName,
            deviceModel: deviceModelName,
            deviceRef: item.deviceRef,
            deviceIcon: item.deviceIcon,
            imgUrl: item.imgUrl,
            startTime: item.startTime,
            status: item.status,
            alarm: item.alarm,
            show: item.show,
            deactivate: item.deactivate,
            deactivateTime: item.deactivateTime,
            ext: item.ext,
            commWays: this.processCommWays(item),
            typeId: item.deviceType,
            modelId: item.deviceModel,
            deptId: item.deptId,
            iconType: item.iconType //设备图标种类
          }
          this.deviceList.push(device)
        }
        this.total = res.total
        this.loading = false;
      });
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selection = selection;
    },
  },
};
</script>
