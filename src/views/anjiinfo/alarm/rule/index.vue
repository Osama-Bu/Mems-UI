<template>
  <div class="app-container">
    <navbar/>
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-page-header @back="goBack"/>
      </el-col>
      <el-col :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.deviceName')}}：{{ deviceForm.deviceName }}</el-tag>
          </el-col>
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.deviceId')}}：{{ deviceForm.cdId }}</el-tag>
          </el-col>
          <el-col :span="2.5" v-hasPermi="['system:dept:query']">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.belong')}}：{{ deviceForm.deptName }}</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['alarm:rule:add']"
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
              v-hasPermi="['alarm:rule:update']"
            >{{ $t('system.edit') }}</el-button>

          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                       @click="handleDelete" v-hasPermi="['alarm:rule:delete']"
            >{{ $t('system.delete') }}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" :search="false" @queryTable="getList"
                         :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="ruleList" @selection-change="handleSelectionChange"
                  style="width: 100%" border>
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column :label="$t('deviceInfo.bandingAlarm.description')" align="center" key="description" prop="description"
                           v-if="columns[0].visible"/>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            v-if="columns[3].visible && ($store.getters.permissions.indexOf('alarm:info:page')===-1
            && $store.getters.permissions.indexOf('*:*:*')===-1 ? 0!==0 :0===0)">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                v-hasPermi="['alarm:info:page']"
                @click="handleAlarmInfoSelect(scope.row)"
              >{{ $t('deviceInfo.bandingAlarm.ruleDetail') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 新增报警页面 -->
    <GliderWithAlarmAdd ref="GliderWithAlarmAddModal" @ok="handleQuery"></GliderWithAlarmAdd>
    <!-- 修改报警页面-->
    <GliderWithAlarmUpdate ref="GliderWithAlarmUpdateModal" @ok="handleQuery"></GliderWithAlarmUpdate>
    <!-- 查看报警内容-->
    <GliderWithAlarmrule ref="GliderWithAlarmruleModal" @ok="handleQuery"></GliderWithAlarmrule>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { DeleteAlarmRule, getAlarmRule } from '@/api/alarm/alarmrule'
import { Navbar } from '@/layout/components'
import GliderWithAlarmAdd from './module/GliderWithAlarmAdd'
import GliderWithAlarmUpdate from './module/GliderWithAlarmUpdate'
import GliderWithAlarmrule from './module/GliderWithAlarmrule'
import { getDept } from '@/api/system/dept'
import { getAllAreaInfo } from '@/api/map/area'

export default {
  name: 'AlarmRule',
  components: {
    GliderWithAlarmAdd,
    GliderWithAlarmUpdate,
    GliderWithAlarmrule,
    Navbar
  },
  data() {
    return {
      //设备所属组织
      deviceForm: {
        deviceName: undefined,
        cdId: undefined,
        deptName: undefined,
        deviceId: undefined
      },
      deptId: undefined,
      //移位需要的围栏数据
      areaManage: { areaList: [] },
      //搜索字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        msgId: undefined,
        endTime: undefined,
        deviceId: undefined,
        startTime: undefined
      },
      // 报警规则列表
      ruleList: [],
      // 列信息
      columns: [
        { key: 0, label: `报警规则描述`, visible: true },
        { key: 1, label: `开始时间`, visible: true },
        { key: 2, label: `结束时间`, visible: true },
        { key: 3, label: `操作`, visible: true }
      ],
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 选中数组
      ids: [],
      //选中数据
      selection: [],
      // 总条数
      total: 0
    }
  },
  mounted() {
    this.queryParams.pageNum = 1
    this.queryParams.deviceId = Number(this.$route.query.deviceId)
    this.deptId = this.$route.query.deptId
    this.deviceForm.deviceName = this.$route.query.deviceName
    this.deviceForm.cdId = this.$route.query.cdId
    this.deviceForm.deviceId = Number(this.$route.query.deviceId)
    this.getList()
    this.getAllArea()
  },
  created() {

  },
  methods: {
    //查询协议代码信息
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    //电子围栏管理-获取或刷新已被添加的围栏区域
    getAllArea() {
      let tempAreaList = []
      const queryParam = {
        pageNum: -1,
        pageSize: 10
      }
      if (
        this.$store.getters.permissions.indexOf('map:area:page') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1
      ) {
        getAllAreaInfo(queryParam).then((res) => {
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              name: item.name,
              status: item.status,
              visible: item.visible,
              pointList: []
            }
            let tempPointList = []
            for (let item1 of item.areaPointResVOS) {
              let temp_area = {
                gpsX: item1.gpsX,
                gpsY: item1.gpsY,
                orderNumber: item1.orderNumber,
                status: item1.status
              }
              tempPointList.push(temp_area)
            }
            tempPointList.sort(function(a, b) {
              return a.orderNumber - b.orderNumber
            })
            for (let item2 of tempPointList) {
              temp.pointList.push([item2.gpsX, item2.gpsY])
            }
            tempAreaList.push(temp)
          }
          this.areaManage.areaList = tempAreaList
        })
      }
    },
    //添加处理
    handleAdd(row) {
      this.$refs.GliderWithAlarmAddModal.form = {
        deviceId: this.deviceForm.deviceId,
        msgId: row.id
      }
      this.$refs.GliderWithAlarmAddModal.deviceId = this.deviceForm.deviceId
      this.$refs.GliderWithAlarmAddModal.deviceName = this.deviceForm.deviceName
      this.$refs.GliderWithAlarmAddModal.title = this.$t('deviceInfo.bandingAlarm.addAndEdit.addTitle');
      this.$refs.GliderWithAlarmAddModal.init()
      this.$refs.GliderWithAlarmAddModal.open = true
    },
    handleUpdate() {
      const ruleContent = this.selection[0].ruleContent
      const match = ruleContent.match(/\(#([^)]+)\)/)
      if (match) {
        this.$refs.GliderWithAlarmUpdateModal.messageItemName = match[1]
      } else {
        this.$refs.GliderWithAlarmUpdateModal.messageItemName = null
      }

      this.$refs.GliderWithAlarmUpdateModal.showCustomRow1 = false
      this.$refs.GliderWithAlarmUpdateModal.showCustomRow2 = false
      this.$refs.GliderWithAlarmUpdateModal.showCustomRow3 = false
      this.$refs.GliderWithAlarmUpdateModal.showCustomRow4 = false
      this.$refs.GliderWithAlarmUpdateModal.min = null
      this.$refs.GliderWithAlarmUpdateModal.max = null
      this.$refs.GliderWithAlarmUpdateModal.id = this.ids
      this.$refs.GliderWithAlarmUpdateModal.msgId = this.selection[0].msgId

      if (ruleContent && ruleContent.includes('overTime')) {
        this.$refs.GliderWithAlarmUpdateModal.showCustomRow3 = true
        const match = /\d+/.exec(ruleContent)
        this.$refs.GliderWithAlarmUpdateModal.Timeout = match[0]
        this.$refs.GliderWithAlarmUpdateModal.timeRuleDescription = this.selection[0].description
      } else {
        if (ruleContent.includes(')==(#last_')) {
          this.$refs.GliderWithAlarmUpdateModal.showCustomRow2 = true
          this.$refs.GliderWithAlarmUpdateModal.triggerNum = this.selection[0].triggerNum
          this.$refs.GliderWithAlarmUpdateModal.triggerRuleDescription = this.selection[0].description
        } else if (ruleContent.includes('#circle')) {
          const match = ruleContent.match(/#circle\(#GPSX0,#GPSY0,([\d.-]+),([\d.-]+),([\d.-]+)\)/)
          this.$refs.GliderWithAlarmUpdateModal.showCustomRow4 = true
          this.$refs.GliderWithAlarmUpdateModal.triggerNum = this.selection[0].triggerNum
          this.$refs.GliderWithAlarmUpdateModal.longitude = parseFloat(match[1])
          this.$refs.GliderWithAlarmUpdateModal.latitude = parseFloat(match[2])
          this.$refs.GliderWithAlarmUpdateModal.radius = parseFloat(match[3])
          this.$refs.GliderWithAlarmUpdateModal.circleRuleDescription2 = this.selection[0].description
        } else {
          this.$refs.GliderWithAlarmUpdateModal.showCustomRow1 = true
          this.$refs.GliderWithAlarmUpdateModal.trigger = this.selection[0].triggerNum
          this.$refs.GliderWithAlarmUpdateModal.scopeRuleDescription = this.selection[0].description
          const onlyMinMatches = ruleContent.match(/(#\w+)?\s*>\s*(-?\d+)/)
          if (onlyMinMatches) {
            this.$refs.GliderWithAlarmUpdateModal.min = parseInt(onlyMinMatches[2], 10)
          }
          const onlyMaxMatches = ruleContent.match(/(#\w+)?\s*<\s*(-?\d+)/)
          if (onlyMaxMatches) {
            this.$refs.GliderWithAlarmUpdateModal.max = parseInt(onlyMaxMatches[2], 10)
          }
        }
      }
      this.$refs.GliderWithAlarmUpdateModal.ruleContent = this.selection[0].ruleContent
      this.$refs.GliderWithAlarmUpdateModal.description = this.selection[0].description

      let startDateTemp = null
      let endDateTemp = null

      if (this.selection[0].startTime !== null) {
        const startDate1 = this.selection[0].startTime
        const date1 = new Date(startDate1.replace(/-/g, '/')) //开始时间
        startDateTemp = date1.getTime()
      }

      if (this.selection[0].endTime !== null) {
        const endDate1 = this.selection[0].endTime
        const date2 = new Date(endDate1.replace(/-/g, '/'))
        endDateTemp = date2.getTime()
      }
      this.$refs.GliderWithAlarmUpdateModal.form = {
        deviceId: this.deviceForm.deviceId,
        startTime: startDateTemp,
        endTime: endDateTemp,
        id: this.ids,
        selectedMessage: this.selectedMessage,
        selectedMessageItem: this.selectedMessageItem
      }
      this.$refs.GliderWithAlarmUpdateModal.title = this.$t('deviceInfo.bandingAlarm.addAndEdit.editTitle');
      this.$refs.GliderWithAlarmUpdateModal.open = true
    },
    //删除处理
    handleDelete(row) {
      const msgItemId = row.id || this.ids
      let String =
        '是否确认删除所选报警规则?'
      this.$confirm(String, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
          return DeleteAlarmRule(msgItemId)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    //获取数据
    getList() {
      this.loading = true
      if (this.$store.getters.permissions.indexOf('system:dept:query') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        getDept(this.deptId).then((response) => {
          this.deviceForm.deptName = response.data.deptName
        })
      }
      getAlarmRule(this.queryParams).then((res) => {
        this.total = res.total
        this.ruleList = []
        if (res.rows !== null) {
          for (let item of res.rows) {
            let startTimeTemp = null
            let endTimeTemp = null
            if (item.startTime !== null) {
              const startTimeArr = item.startTime.split('T', 2)
              startTimeTemp = startTimeArr[0] + ' ' + startTimeArr[1]
            }
            if (item.endTime !== null) {
              const endTimeArr = item.endTime.split('T', 2)
              endTimeTemp = endTimeArr[0] + ' ' + endTimeArr[1]
            }
            let temp = {
              id: item.id,
              msgId: item.msgId,
              ruleContent: item.ruleContent,
              startTime: startTimeTemp,
              endTime: endTimeTemp,
              description: item.description,
              triggerNum: item.triggerNum,
              cntNum: item.cntNum,
              createBy: item.createBy,
              delFlag: item.delFlag,
              deptId: item.deptId,
              status: item.status,
              tenantId: item.tenantId,
              userId: item.userId,
              updateBy: item.updateBy
            }
            this.ruleList.push(temp)
          }
        }
        this.loading = false
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.selection = selection
    },
    goBack() {
      this.$router.go(-1)
    },
    handleAlarmInfoSelect(row) {
      const ruleContent = row.ruleContent
      const match = ruleContent.match(/\(#([^)]+)\)/)
      if (match) {
        this.$refs.GliderWithAlarmruleModal.messageItemName = match[1]
      } else {
        this.$refs.GliderWithAlarmruleModal.messageItemName = null
      }

      // Resetting custom rows and min/max values
      this.$refs.GliderWithAlarmruleModal.showCustomRow1 = false
      this.$refs.GliderWithAlarmruleModal.showCustomRow2 = false
      this.$refs.GliderWithAlarmruleModal.showCustomRow3 = false
      this.$refs.GliderWithAlarmruleModal.showCustomRow4 = false
      this.$refs.GliderWithAlarmruleModal.min = null
      this.$refs.GliderWithAlarmruleModal.max = null

      // Setting form data
      this.$refs.GliderWithAlarmruleModal.form = {
        deviceId: this.queryParams.deviceId,
        id: this.ids,
        selectedMessage: this.selectedMessage,
        selectedMessageItem: this.selectedMessageItem
      }

      // Handling overTime condition
      if (ruleContent && ruleContent.includes('overTime')) {
        this.$refs.GliderWithAlarmruleModal.showCustomRow3 = true
        const match = /\d+/.exec(ruleContent)
        this.$refs.GliderWithAlarmruleModal.Timeout = match[0]
        this.$refs.GliderWithAlarmruleModal.timeRuleDescription = row.description
      } else {
        // Handling other rule conditions
        if (ruleContent.includes(')==(#last_')) {
          this.$refs.GliderWithAlarmruleModal.showCustomRow2 = true
          this.$refs.GliderWithAlarmruleModal.triggerNum = row.triggerNum
          this.$refs.GliderWithAlarmruleModal.triggerRuleDescription = row.description
        } else if (ruleContent.includes('#circle')) {
          const match = ruleContent.match(/#circle\(#GPSX0,#GPSY0,([\d.-]+),([\d.-]+),([\d.-]+)\)/)
          this.$refs.GliderWithAlarmruleModal.showCustomRow4 = true
          this.$refs.GliderWithAlarmruleModal.triggerNum = row.triggerNum
          this.$refs.GliderWithAlarmruleModal.longitude = parseFloat(match[1])
          this.$refs.GliderWithAlarmruleModal.latitude = parseFloat(match[2])
          this.$refs.GliderWithAlarmruleModal.radius = parseFloat(match[3])
          this.$refs.GliderWithAlarmruleModal.circleRuleDescription2 = row.description
        } else {
          // Handling min/max conditions
          this.$refs.GliderWithAlarmruleModal.showCustomRow1 = true
          this.$refs.GliderWithAlarmruleModal.trigger = row.triggerNum
          this.$refs.GliderWithAlarmruleModal.scopeRuleDescription = row.description

          // Handling min value (supporting decimal values)
          const decodedRuleContent = ruleContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<')
          const onlyMinMatches = decodedRuleContent.match(/(#\w+)?\s*>\s*(-?\d+(\.\d+)?)/)  // Matching decimal numbers
          if (onlyMinMatches) {
            this.$refs.GliderWithAlarmruleModal.min = parseFloat(onlyMinMatches[2])

          }

          // Handling max value (supporting decimal values)
          const onlyMaxMatches = decodedRuleContent.match(/(#\w+)?\s*<\s*(-?\d+(\.\d+)?)/)  // Matching decimal numbers
          if (onlyMaxMatches) {
            this.$refs.GliderWithAlarmruleModal.max = parseFloat(onlyMaxMatches[2])
          }
        }
      }

      // Setting rule content, description and other modal details
      this.$refs.GliderWithAlarmruleModal.ruleContent = row.ruleContent
      this.$refs.GliderWithAlarmruleModal.description = row.description
      this.$refs.GliderWithAlarmruleModal.deviceId = this.queryParams.deviceId
      this.$refs.GliderWithAlarmruleModal.title = this.$t('deviceInfo.bandingAlarm.ruleDetail');
      this.$refs.GliderWithAlarmruleModal.open = true
    }

  }
}
</script>

<style scoped>
.app-container {
  padding-top: 0;
}
</style>
