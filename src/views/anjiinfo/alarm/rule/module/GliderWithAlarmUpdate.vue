<template>
  <div class="app-container">
    <!--      添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" width="1400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="250px">

        <el-row v-if="showCustomRow1">
          <el-form-item :label="messageItemName + ' ' + ' ('+$t('deviceInfo.bandingAlarm.addAndEdit.rule.abnormalRange')+')'">
            <el-col :span="6">
              <el-input v-model="min">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.min') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="max">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.max') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="trigger" type="number">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.trigger') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="scopeRuleDescription" type="textarea"
                        :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                        style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row v-if="showCustomRow2">
          <el-form-item :label="messageItemName + ' ' + ' ('+$t('deviceInfo.bandingAlarm.addAndEdit.rule.dataNoChange')+')'">
            <el-col :span="12">
              <el-input v-model="triggerNum" type="number">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.repeat') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="triggerRuleDescription" type="textarea"
                        :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                        style="margin-left: 10px"
              >
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row v-if="showCustomRow3">
          <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.overtimeNoData')">
            <el-col :span="12">
              <el-input v-model="Timeout" type="number">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.overtime') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="timeRuleDescription" type="textarea"
                        :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                        style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row v-if="showCustomRow4">
          <template>
            <el-row>
              <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.selectOrInput')">
                <!-- 切换选择区域或输入经纬度 -->
                <el-button type="default" @click="toggleSelection">
                  {{ useAreaSelection ?
                  $t('deviceInfo.bandingAlarm.addAndEdit.rule.switchCoorInput')
                  :
                  $t('deviceInfo.bandingAlarm.addAndEdit.rule.switchAreaSelect') }}
                </el-button>
              </el-form-item>
            </el-row>

            <el-row v-if="useAreaSelection">
              <!-- 选择区域 -->
              <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.selectArea')">
                <el-col :span="12">
                  <el-select v-model="selectedArea" :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.selectArea')">
                    <el-option v-for="item in areaManage.areaList" :key="item.id" :label="item.name"
                               :value="item.id"
                    ></el-option>
                  </el-select>
                  <p v-if="areaManage.areaList.length === 0">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.noArea') }}</p>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="circleRuleDescription1" type="textarea"
                            :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                            style="margin-left: 10px"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-row>

            <el-row v-else>
              <!-- 输入经纬度 -->
              <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.inputCenterAndRadius')">
                <el-col :span="6">
                  <el-input v-model="longitude" type="number" step="any">
                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.lng') }}：</template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="latitude" type="number" step="any">
                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.lat') }}：</template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="radius" type="number" step="any">
                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.radius') }}：</template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="circleRuleDescription2" type="textarea"
                            :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                            style="margin-left: 10px"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-row>
          </template>
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
import Treeselect from '@riophae/vue-treeselect'
import { UpdateAlarmRule } from '@/api/alarm/alarmrule'
import GliderWithAlarmUpdateDetail from './GliderWithAlarmUpdateDetail'
import { getAllAreaInfo } from '@/api/map/area'

export default {
  name: 'GliderWithAlarmUpdate',
  components: {
    Treeselect,
    GliderWithAlarmUpdateDetail
  },
  data() {
    return {
      useAreaSelection: false, // 用于控制是选择区域还是输入经纬度
      longitude: null, // 经度
      latitude: null, // 纬度
      radius: null, // 半径
      circleRuleDescription1: '',
      circleRuleDescription2: '',
      //围栏
      selectedArea: null,
      areaManage: {
        areaList: []
      },
      showCustomRow1: false, // 控制第一行是否显示
      showCustomRow2: false, // 控制第二行是否显示
      showCustomRow3: false, // 控制第二行是否显示
      showCustomRow4: false, //控制移位规则
      rules: {
        endTime: { required: true, message: '请选择报警结束时间', trigger: 'change' },
        startTime: { required: true, message: '请选择报警开始时间', trigger: 'change' }
      },
      ruleContent: '',
      // 范围规则
      min: null,
      max: null,
      scopeRuleDescription: '',
      trigger: null,
      // 连续几组数据
      triggerNum: null,
      triggerValue: 0,
      triggerRuleDescription: '',
      timeRuleDescription: '',
      Timeout: null,
      form: {},
      messageItemName: '', // 协议项字段
      msgId: 1,
      title: '',
      open: false,
      loading: false,
      id: 1,
      msgQueryParams: {
        gliderId: undefined,
        msgIdList: undefined,
        pageNum: -1,
        pageSize: 10
      },
      fieldQueryParams: {
        pageNum: -1,
        pageSize: 10,
        id: undefined
      },
      options: [],
      optionsMessage: [],
      optionsMessageItem: []
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    //切换
    toggleSelection() {
      this.getAllArea()
      this.useAreaSelection = !this.useAreaSelection
      if (!this.useAreaSelection) {
        // 重置区域选择
        this.selectedArea = null
      } else {
        // 重置经纬度
        this.longitude = null
        this.latitude = null
        this.radius = null
      }
    },

    //围栏数据
    getAllArea() {
      let tempAreaList = []
      let data = {
        pageNum: -1,
        pageSize: 10
      }
      if (
        this.$store.getters.permissions.indexOf('map:area:page') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1
      ) {
        getAllAreaInfo(data).then((res) => {
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
            if (temp.pointList.length === 2) {
              const [center, edge] = temp.pointList
              temp.radius = this.computeDistance(center, edge)
              temp.center = center
              tempAreaList.push(temp)
            }
            //tempAreaList.push(temp);
          }
          this.areaManage.areaList = tempAreaList
        })
      }
    },
    computeDistance(from, to) {
      if (!from || !to) return 0

      function toRad(value) {
        return value * Math.PI / 180
      }

      const R = 6378137 // 地球半径（单位：米）
      const dLat = toRad(to[1] - from[1])
      const dLng = toRad(to[0] - from[0])
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from[1])) * Math.cos(toRad(to[1])) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c // 返回距离（单位：米）
    },
    //提交新增或修改的表单信息
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const queryParam = {
            id: this.id[0]
          }
          // todo 此处逻辑有问题triggerNum 异常值范围规则
          if (this.min !== null && this.max !== null) {
            queryParam.description = this.scopeRuleDescription
            queryParam.ruleContent = encodeURI(`(#${this.messageItemName})>${this.min} and (#${this.messageItemName})<${this.max}`)
            queryParam.triggerNum = 1
          } else if (this.min !== null) {
            // 只有最小值的情况
            queryParam.description = this.scopeRuleDescription
            queryParam.ruleContent = encodeURI(`(#${this.messageItemName})>${this.min}`)
            queryParam.triggerNum = 1
          } else if (this.max !== null) {
            // 只有最大值的情况
            queryParam.description = this.scopeRuleDescription
            queryParam.ruleContent = encodeURI(`(#${this.messageItemName})<${this.max}`)
            queryParam.triggerNum = 1
          }
          // 连续几组不变规则
          if (this.triggerNum !== null) {
            queryParam.description = this.triggerRuleDescription
            queryParam.ruleContent = encodeURI(`(#${this.messageItemName})==(#last_${this.messageItemName})`)
            queryParam.triggerNum = this.triggerNum
          }
          // 超时规则
          if (this.Timeout !== null) {
            queryParam.description = this.timeRuleDescription
            queryParam.ruleContent = encodeURI(`(overTime${this.Timeout}overTime)`)
            queryParam.triggerNum = 1
          }
          //移位规则
          if (this.useAreaSelection === true) {
            if (this.selectedArea !== null) {
              const selectedAreaData = this.areaManage.areaList.find((area) => area.id === this.selectedArea)

              queryParam.description = this.circleRuleDescription1,
                queryParam.ruleContent = encodeURI(`#circle(#GPSX0,#GPSY0,${selectedAreaData.center[0]},${selectedAreaData.center[1]},${selectedAreaData.radius})`),
                queryParam.triggerNum = 1

            }
          }
          if (this.useAreaSelection !== true) {
            if (this.longitude !== null && this.latitude !== null && this.radius !== null) {
              queryParam.description = this.circleRuleDescription2,
                queryParam.ruleContent = encodeURI(`#circle(#GPSX0,#GPSY0,${this.longitude},${this.latitude},${this.radius})`),
                queryParam.triggerNum = 1

            }
          }
          //处理时间格式
          const date = new Date(this.form.startTime)
          const offset = 8 * 60 // 北京时间的时区偏移为 UTC+8
          date.setMinutes(date.getMinutes() + offset) // 添加时区偏移量
          this.form.startTime = date.toISOString().replace('T', ' ').slice(0, -5)
          queryParam.startTime = this.form.startTime

          const date1 = new Date(this.form.endTime)
          date1.setMinutes(date1.getMinutes() + offset) // 添加时区偏移量
          this.form.endTime = date1.toISOString().replace('T', ' ').slice(0, -5)
          queryParam.endTime = this.form.endTime
          // // 添加规则到数组

          UpdateAlarmRule(queryParam).then((res) => {
            if (res.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.$emit('ok', '')
            }
          })
        }
      })
    },
    //关闭新增或修改页面
    cancel() {
      this.open = false
    }
  }
}
</script>
<style scoped>
.inputClass {
  text-align: center;
}

.input-num-class >>> .el-input-number__increase,
.input-num-class >>> .el-input-number__decrease {
  width: 18px;
}

.input-num-class >>> .el-input__inner {
  padding-left: 0;
  padding-right: 18px;
}

.message-info >>> .el-input__inner {
  padding: 0 2px;
}
</style>
