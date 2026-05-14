<template>
  <div class="app-container">
    <navbar/>
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          v-show="showSearch"
          :inline="true"
          label-width="85px"
        >
          <el-form-item :label="$t('deviceInfo.search.deviceId')" prop="code">
            <el-input
              v-model="queryParams.cdId"
              :placeholder="$t('deviceInfo.search.tip1')"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('deviceInfo.search.deviceName')" prop="name">
            <el-input
              v-model="queryParams.deviceName"
              :placeholder="$t('deviceInfo.search.tip2')"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('deviceInfo.search.commCode')" prop="imel">
            <el-input
              v-model="queryParams.communicateCode"
              :placeholder="$t('deviceInfo.search.tip3')"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item :label="$t('deviceInfo.search.deviceType')" prop="deviceName">
            <div class="block">
              <el-cascader
                v-model="cascaderValue"
                :options="deviceTypeOptions"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              v-hasPermi="['device:page']"
              @click="handleQuery"
            >{{ $t('system.search') }}
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('system.reset') }}
            </el-button
            >
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
              v-hasPermi="['device:add']"
            >{{ $t('system.add') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['device:update']"
            >{{ $t('system.edit') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['device:delete']"
            >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <!--    隐藏搜索，刷新，显隐列      -->
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>
        <el-table
          v-loading="loading"
          :data="deviceList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column
            :label="$t('deviceInfo.table.deviceId')"
            align="center"
            key="cdId"
            prop="cdId"
            width="80"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.table.deviceName')"
            align="center"
            key="deviceName"
            prop="deviceName"
            width="160"
            v-if="columns[1].visible"
          />

          <el-table-column
            :label="$t('deviceInfo.table.deviceType')"
            align="center"
            key="deviceType"
            prop="deviceType"
            v-if="columns[2].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.deviceType?'':'danger'">
                {{ scope.row.deviceType}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.table.deviceModel')"
            align="center"
            key="deviceModel"
            prop="deviceModel"
            v-if="columns[3].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.deviceModel?'':'danger'">
                {{ scope.row.deviceModel}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column :label="$t('deviceInfo.table.icon')" width="100" align="center" prop="iconType" v-if="columns[4].visible">
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
            :label="$t('deviceInfo.table.commWays')"
            width="200"
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
            :label="$t('deviceInfo.table.startTime')"
            width="180"
            align="center"
            prop="startTime"
            v-if="columns[6].visible"
          >
            <template slot="header">
              <div
                @click="handleStartDateSort"
                style="cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center;"
              >
                <span>{{ $t('deviceInfo.table.startTime') }}</span>
                <i :class="startDateSortIcon" style="margin-left: 5px;"></i>
              </div>
            </template>
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.startTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('deviceInfo.table.deviceStatus')"
            width="100"
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

          <el-table-column
            :label="$t('deviceInfo.table.show')"
            align="center"
            key="show"
            prop="show"
            v-if="columns[8].visible"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.show"
                :active-value="true"
                :inactive-value="false"
                @change="handleStatusChange(scope.row)"
                :disabled="
                  $store.getters.permissions.indexOf('device:update') === -1 &&
                  $store.getters.permissions.indexOf('*:*:*') === -1
                    ? 0 === 0
                    : 0 !== 0
                "
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.table.alarm')"
            align="center"
            v-if="columns[9].visible"
          >
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.alarm"
                @change="updateAlarmStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.table.deactivate')"
            align="center"
            prop="deactivate"
            v-if="columns[10].visible"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.deactivate?'danger':''">
                {{ scope.row.deactivate ? $t('deviceInfo.table.status.deactivate') : $t('deviceInfo.table.status.using') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
            v-if="columns[11].visible &&
              ($store.getters.permissions.indexOf('alarm:info:page') === -1 &&
              $store.getters.permissions.indexOf('alarm:rule:page') === -1 &&
              $store.getters.permissions.indexOf('msg-device:page') === -1 &&
              $store.getters.permissions.indexOf('*:*:*') === -1
                ? 0 !== 0: 0 === 0)
            "
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                v-hasPermi="['msg-device:page']"
                @click="handleMessageBanding(scope.row)"
              >{{ $t('deviceInfo.table.operate.bandingMessage') }}
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                v-hasPermi="['alarm:rule:page']"
                @click="handleCommunicate(scope.row)"
              >{{ $t('deviceInfo.table.operate.commConfig') }}
              </el-button>
              <el-dropdown
                size="mini"
                @command="(command) => handleMore(command, scope.row)"
              >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-d-arrow-right"
                  v-hasPermi="['alarm:rule:page', 'alarm:info:page']"
                >{{ $t('deviceInfo.table.operate.more') }}
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleAlarmRule"
                    icon="el-icon-key"
                    v-hasPermi="['alarm:rule:page']"
                  >{{ $t('deviceInfo.table.operate.bandingAlarm') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="handleAlarmInfo"
                    icon="el-icon-circle-check"
                    v-hasPermi="['alarm:info:page']"
                  >{{ $t('deviceInfo.table.operate.alarmContent') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.table.ext')"
            align="center"
            key="ext"
            prop="ext"
            v-if="columns[12].visible"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 新增页面 -->
    <GliderAdd ref="GliderAddModal" @ok="handleQuery"></GliderAdd>
    <!-- 修改页面 -->
    <GliderUpdate ref="GliderUpdateModal" @ok="handleQuery"></GliderUpdate>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { deleteDeviceInfo, getDeviceInfo, getDeviceInfoAndCommWay, updateDeviceInfo, alarmSwitch, getDeviceTypeTree } from '@/api/device/device'
import GliderAdd from './module/GliderAdd'
import GliderUpdate from './module/GliderUpdate'
import { Navbar } from '@/layout/components'
import deviceIconConfig from '@/utils/DeviceIconConfig';
import deviceCommConfig from '@/utils/DeviceCommConfig';
import deviceStatusConfig from '@/utils/DeviceStatusConfig';

export default {
  name: 'DeviceInfo',
  components: {
    GliderAdd,
    GliderUpdate,
    Navbar
  },
  data() {
    return {

      deviceIcons:[],

      // 下水时间排序状态: null-默认, 'asc'-升序, 'desc'-降序
      startDateSort: null,
      // 存储所有数据用于排序
      allDataList: [],

      deviceTypeOptions: [],
      cascaderValue: [],
      cascaderProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },
      // 搜索字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cdId: undefined,
        deviceName: undefined,
        communicateCode: undefined,
        deviceType: undefined,
        deviceModel: undefined,
        startTime: undefined
      },
      deviceList: [],
      // 列信息
      columns: [
        { key: 0, label: `设备ID`, visible: true },
        { key: 1, label: `设备名称`, visible: true },
        { key: 2, label: `设备种类`, visible: true },
        { key: 3, label: `设备型号`, visible: true },
        { key: 4, label: `使用图标`, visible: true },
        { key: 5, label: `通讯方式`, visible: true },
        { key: 6, label: `下水时间`, visible: true },
        { key: 7, label: `设备状态`, visible: true },
        { key: 8, label: `可见状态`, visible: true },
        { key: 9, label: `是否报警`, visible: true },
        { key: 10, label: `是否停用`, visible: true },
        { key: 11, label: `操作`, visible: true },
        { key: 12, label: `备注`, visible: true }
      ],
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 选中数组
      ids: [],
      //选中数据
      selection: [],
      // 总条数
      total: 0
    }
  },
  computed: {
    // 根据排序状态动态显示图标
    startDateSortIcon() {
      if (this.startDateSort === 'asc') {
        return 'el-icon-top';
      } else if (this.startDateSort === 'desc') {
        return 'el-icon-bottom';
      }
      return 'el-icon-sort';
    },
  },
  async created() {
    // 保证getDeviceTypeOptions接口先执行
    this.loading = true
    // 初始化设备图标
    await this.getDeviceTypeOptions()
    this.getList()
  },

  methods: {

    getDeviceIcon(item){
      return deviceIconConfig.getDeviceIcon(item);
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

    // 级联选择
    handleChange(value) {
      this.queryParams.deviceModel = value[1]
    },

    // 获取设备类型及型号树
    async getDeviceTypeOptions() {
      await getDeviceTypeTree().then(res => {
        this.deviceTypeOptions = res.data
      })
    },

    // 设备状态
    getDeviceStatusType(status) {
      return deviceStatusConfig.getDeviceStatusType(status);
    },
    getDeviceStatusText(status) {
      return deviceStatusConfig.getDeviceStatusText(status);
    },

    //报警开关
    updateAlarmStatus(row) {
      const currentState = row.alarm
      const action = currentState ? '关闭' : '开启'
      this.$confirm(`是否${action}报警？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.alarm = !currentState
        const data = {
          deviceId: row.id,
          alarmSwitch: row.alarm
        }
        alarmSwitch(data).then((res) => {
          this.$message.success(`${action}报警成功！`)
        }).catch((error) => {
          row.alarm = currentState
          this.$message.error(`${action}报警失败：${error.message}`)
        })
      })
    },

    // todo 是否停用
    updateDeactivateStatus(row) {
      // console.log(row)
    },

    // todo 重置表单信息
    reset() {

    },

    // 设备可见状态修改
    handleStatusChange(row) {
      let text = row.show ? '显示' : '隐藏'
      this.$confirm('确认要"' + text + '""' + row.deviceName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return updateDeviceInfo({ id: row.id, show: row.show })
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch((e) => {
        this.msgError(e)
      })
    },

    // 更多操作触发
    handleMore(command, row) {
      switch (command) {
        case 'handleAlarmRule':
          this.handleAlarmRule(row)
          break
        case 'handleAlarmInfo':
          this.handleAlarmInfo(row)
          break
        default:
          break
      }
    },
    //查询设备信息
    handleQuery() {
      // console.log(this.queryParams)
      this.getList()
    },
    // 获取设备列表数据
    getList() {
      this.loading = true
      getDeviceInfoAndCommWay(this.queryParams).then((res) => {
        this.total = res.total
        this.deviceList = []
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
        this.loading = false
      })
    },
    //重置查询
    resetQuery() {
      this.cascaderValue = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        cdId: undefined,
        deviceName: undefined,
        communicateCode: undefined,
        deviceType: undefined,
        deviceModel: undefined,
        startTime: undefined
      };
      this.resetForm('queryForm');
      this.handleQuery();
    },

    /**
     * 新增界面
     *
     * */
    handleAdd() {
      this.$refs.GliderAddModal.form = {
        cdId: undefined,
        deviceName: undefined,
        typeId: undefined,
        modelId: undefined,
        deptId: undefined,
        startTime: undefined,
        show: undefined,
        ext: undefined,

        // 通信方式
        yxCode: undefined,
        bd2Code: undefined,
        bd3Code: undefined,
        ttCode: undefined
      }
      this.$refs.GliderAddModal.title = this.$t('deviceInfo.addAndEdit.addTitle');
      this.$refs.GliderAddModal.open = true
      this.$refs.GliderAddModal.init()
    },

    /**
     * 修改界面
     *
     * */
    handleUpdate(row) {
      let deviceID = row.id || this.ids

      this.$refs.GliderUpdateModal.form = {
        id: Number(deviceID[0]),
        cdId: this.selection[0].cdId,
        deviceName: this.selection[0].deviceName,
        typeId: this.selection[0].typeId,
        modelId: this.selection[0].modelId,
        deptId: this.selection[0].deptId,
        startTime: this.selection[0].startTime,
        show: this.selection[0].show,
        ext: this.selection[0].ext,
        deviceIcon: this.selection[0].deviceIcon
      }
      this.$refs.GliderUpdateModal.open = true
      this.$refs.GliderUpdateModal.title = this.$t('deviceInfo.addAndEdit.editTitle');
      this.$refs.GliderUpdateModal.init()
    },

    // 删除
    handleDelete(row) {
      const deviceId = row.id || this.ids
      this.$confirm('是否确认删除所选设备及其与协议的绑定关系?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteDeviceInfo(deviceId)
      }).then((response) => {
        if (response.code === 200) {
          this.getList()
          this.msgSuccess('删除成功')
        }
      })
    },
    // 多选行
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.selection = selection
    },
    // 绑定协议
    handleMessageBanding(row) {
      this.$router.push({
        path: '/anjiinfo/gliderwithmessage',
        query: {
          deviceId: row.id,
          cdId: row.cdId,
          deviceName: row.deviceName,
          deviceType: row.deviceType,
          deviceModel: row.deviceModel,
          deptId: row.deptId
        }
      })
    },
    handleCommunicate(row){
      this.$router.push({
        path: '/anjiinfo/comm/config',
        query: {
          deviceId: row.id,
          cdId: row.cdId,
          deviceName: row.deviceName,
          deviceType: row.deviceType,
          deviceModel: row.deviceModel,
          deptId: row.deptId
        }
      })
    },
    // 绑定报警规则
    handleAlarmRule(row) {
      this.$router.push({
        path: '/anjiinfo/watch/alarm/rule',
        query: {
          deviceId: row.id,
          cdId: row.cdId,
          deviceName: row.deviceName,
          deviceType: row.deviceType,
          deviceModel: row.deviceModel,
          deptId: row.deptId
        }
      })
    },
    // todo 报警内容
    handleAlarmInfo(row) {
      this.$router.push({
        path: '/anjiinfo/watch/alarm/info',
        query: {
          deviceId: row.id,
          cdId: row.cdId,
          deviceName: row.deviceName,
          deviceType: row.deviceType,
          deviceModel: row.deviceModel,
          deptId: row.deptId
        }
      })
    },

    /**
     * 下水时间排序处理
     * todo 现阶段采用前端排序，后续可替代后端根据参数进行升序降序控制
     * */
    handleStartDateSort() {
      // 切换排序状态: null -> asc -> desc -> null
      if (this.startDateSort === null) {
        this.startDateSort = 'asc';
      } else if (this.startDateSort === 'asc') {
        this.startDateSort = 'desc';
      } else {
        this.startDateSort = null;
      }
      this.sortDeviceList();
    },
    // 对商品列表进行排序
    sortDeviceList() {
      if (this.startDateSort === null) {
        // 恢复原始顺序，重新获取数据
        this.queryParams.pageNum = 1;
        this.getList();
        return;
      }

      // 获取所有数据进行排序
      this.loading = true;
      const allDataParams = {
        ...this.queryParams,
        pageNum: -1 // 获取所有数据
      };

      getDeviceInfoAndCommWay(allDataParams).then((res) => {
        this.allDataList = [];

        // 处理所有数据
        for (let item of res.rows) {
          // 设备类型型号替换
          const deviceType = this.deviceTypeOptions.find(type => type.id === item.deviceType)
          const deviceTypeName = deviceType ? deviceType.label : '未知产品'
          const deviceModel = deviceType.children.find(model => model.id === item.deviceModel)
          const deviceModelName = deviceModel ? deviceModel.label : '未知型号'

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
          this.allDataList.push(device);
        }

        // 排序所有数据
        this.allDataList.sort((a, b) => {
          const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
          const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
          if (this.startDateSort === 'asc') {
            return dateA - dateB; // 升序
          } else {
            return dateB - dateA; // 降序
          }
        });

        // 更新总数和当前页数据
        this.total = this.allDataList.length;
        this.updateCurrentPage();
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    // 更新当前页显示的数据
    updateCurrentPage() {
      const start = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const end = start + this.queryParams.pageSize;
      this.deviceList = this.allDataList.slice(start, end);
    }

  }
}
</script>

<style scoped>
.app-container {
  padding-top: 0;
}

::v-deep .el-select .el-input__inner {
  font-weight: bold !important;
}

.custom-select {
  width: 110px;
}

.tag-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.block-tag {
  margin-bottom: 4px;
  width: fit-content;
}
</style>
