<template>
  <div class="app-container">
    <!--      添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="1300px" append-to-body>
      <el-steps :active="2" align-center style="margin-bottom: 20px; display: flex; justify-content: center"
                space="300px"
      >
        <el-step :title="$t('deviceInfo.bandingAlarm.addAndEdit.step1')"
                 :description="$t('deviceInfo.bandingAlarm.addAndEdit.status3')"></el-step>
        <el-step :title="$t('deviceInfo.bandingAlarm.addAndEdit.step2')"
                 :description="$t('deviceInfo.bandingAlarm.addAndEdit.status1')"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="250px">
        <el-row>
          <el-form-item :label="messageItemName + ' '+ '('+ $t('deviceInfo.bandingAlarm.addAndEdit.rule.abnormalRange') +')'">
            <el-col :span="6">
              <el-input v-model="min" type="number" step="any">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.min') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="max" type="number" step="any">
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
                        :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')" style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="messageItemName + ' ' + '('+$t('deviceInfo.bandingAlarm.addAndEdit.rule.dataNoChange')+')'">
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

        <template>
          <el-row>
            <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.selectOrInput')">
              <el-button type="default" @click="toggleSelection">
                {{ useAreaSelection ?
                $t('deviceInfo.bandingAlarm.addAndEdit.rule.switchCoorInput')
                :
                $t('deviceInfo.bandingAlarm.addAndEdit.rule.switchAreaSelect') }}
              </el-button>
            </el-form-item>
          </el-row>

          <el-row v-if="useAreaSelection">
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

        <el-row>
          <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.overtimeNoData')">
            <el-col :span="8">
              <el-input v-model="Timeout" type="number">
                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.overtime') }}：</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="timeRuleDescription" type="textarea"
                        :placeholder="$t('deviceInfo.alarmContent.addAndEdit.rule.tips')" style="margin-left: 10px">
              </el-input>
            </el-col>
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
import Treeselect from '@riophae/vue-treeselect'
import { AddAlarmRule } from '@/api/alarm/alarmrule'
import { getAllAreaInfo } from '@/api/map/area'

export default {
  name: 'GliderWithAlarmAddDetail',
  components: {
    Treeselect
  },
  data() {
    return {
      useAreaSelection: false, // 用于控制是选择区域还是输入经纬度
      rules: {},
      // 范围规则
      min: null,
      max: null,
      scopeRuleDescription: '',
      // 连续几组数据
      triggerNum: null,
      trigger: null,
      triggerValue: 0,
      triggerRuleDescription: '',
      timeRuleDescription: '',
      Timeout: null,
      startTime: null,
      endTime: null,
      form: {},
      title: '',
      open: false,
      msgId: 10,
      messageItemName: '', // 协议项字段
      messageItemContent: '',// 协议项中文名
      longitude: null, // 经度
      latitude: null, // 纬度
      radius: null, // 半径
      circleRuleDescription1: '',
      circleRuleDescription2: '',
      //围栏
      selectedArea: null,
      areaManage: {
        areaList: []
      }
    }
  },
  mounted() {

  },
  created() {
    this.getAllArea()
    this.startTime = new Date().getTime()
    // 默认三天
    this.endTime = new Date().getTime() + 3 * 24 * 3600 * 1000
  },
  methods: {
    //切换
    toggleSelection() {
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
      let queryParam = {
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
              isCircle: item.type === '2', //圆形是2
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
            // 只保留圆形区域
            if (temp.isCircle) {
              const [center, edge] = temp.pointList
              temp.radius = this.computeDistance(center, edge)
              temp.center = center
              tempAreaList.push(temp)
            }
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
    // 时间格式化函数
    formatDateToISO(date) {
      const offset = 8 * 60 // UTC+8
      const adjustedDate = new Date(date)
      adjustedDate.setMinutes(adjustedDate.getMinutes() + offset)
      return adjustedDate.toISOString().replace('T', ' ').slice(0, -5)
    },

    // 生成规则函数
    generateRule(description, content, triggerNum) {
      return { description, ruleContent: encodeURI(content), triggerNum }
    },
    generateRule1(description, content, triggerNum) {
      return { description, ruleContent: encodeURI(content), triggerNum }
    },

    // 提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) return

        // 验证规则
        const errors = this.validateRules()
        if (errors.length > 0) {
          this.msgError(errors.join('\n'))
          return
        }

        // 构建规则列表
        const ruleItemList = this.buildRules()
        if (!ruleItemList.length) {
          this.msgError('请至少填写一条完整的规则！')
          return
        }

        // 时间格式化
        this.startTime = this.formatDateToISO(this.startTime)
        this.endTime = this.formatDateToISO(this.endTime)

        // 请求数据
        const requestData = {
          deviceId: this.form.deviceId,
          msgId: this.msgId,
          startTime: this.startTime,
          endTime: this.endTime,
          ruleItemList
        }

        // 提交规则
        AddAlarmRule(requestData)
          .then(() => {
            this.msgSuccess('新增成功')
            this.resetForm()
          }).catch(() => this.msgError('提交失败'))
      })
    },
    validateRules() {
      const errors = []

      // (1) 异常值范围规则
      if (this.min || this.max || this.trigger || this.scopeRuleDescription) {
        if (!this.min && !this.max) {
          errors.push('异常值范围：最小值和最大值必须至少填写一个！')
        }
        if (!this.trigger) {
          errors.push('异常值范围：触发次数必填！')
        }
        if (!this.scopeRuleDescription) {
          errors.push('异常值范围：规则描述必填！')
        }
      }

      // (2) 连续几组数据不变规则
      if (this.triggerNum || this.triggerRuleDescription) {
        if (!this.triggerNum) {
          errors.push('连续几组数据不变：重复次数必填！')
        }
        if (!this.triggerRuleDescription) {
          errors.push('连续几组数据不变：规则描述必填！')
        }
      }

      // (3) 区域规则（改为非必填）
      if (this.useAreaSelection || this.longitude || this.latitude || this.radius || this.circleRuleDescription1 || this.circleRuleDescription2) {
        if (this.useAreaSelection) {
          if (!this.selectedArea) {
            errors.push('区域规则：选择已有区域时，必须选择一个区域！')
          }
        } else {
          if (!this.longitude || !this.latitude || !this.radius) {
            errors.push('区域规则：输入经纬度时，经纬度和半径必须全部填写！')
          }
        }
        if (!this.circleRuleDescription1 && !this.circleRuleDescription2) {
          errors.push('区域规则：规则描述必填！')
        }
      }

      // (4) 超时规则
      if (this.Timeout || this.timeRuleDescription) {
        if (!this.Timeout) {
          errors.push('超时规则：超时时间必填！')
        }
        if (!this.timeRuleDescription) {
          errors.push('超时规则：规则描述必填！')
        }
      }

      return errors
    },
    buildRules() {
      const ruleItemList = []

      // (1) 异常值范围规则
      if (this.min || this.max) {
        if (this.min && this.max) {
          ruleItemList.push(this.generateRule1(this.scopeRuleDescription,
            `(#${this.messageItemName}) > ${this.min} and (#${this.messageItemName}) < ${this.max}`,
            this.trigger))
        } else if (this.min) {
          ruleItemList.push(this.generateRule1(this.scopeRuleDescription,
            `(#${this.messageItemName}) > ${this.min}`,
            this.trigger))
        } else if (this.max) {
          ruleItemList.push(this.generateRule1(this.scopeRuleDescription,
            `(#${this.messageItemName}) < ${this.max}`,
            this.trigger))
        }
      }

      // (2) 连续几组数据不变规则
      if (this.triggerNum) {
        ruleItemList.push(this.generateRule(
          this.triggerRuleDescription,
          `(#${this.messageItemName})==(#last_${this.messageItemName})`,
          this.triggerNum
        ))
      }

      // (3) 区域规则（仅在填写时添加）
      if (this.useAreaSelection && this.selectedArea) {
        const selectedAreaData = this.areaManage.areaList.find(area => area.id === this.selectedArea)
        ruleItemList.push(this.generateRule(
          this.circleRuleDescription1,
          `#circle(#GPSX0,#GPSY0,${selectedAreaData.center[0]},${selectedAreaData.center[1]},${selectedAreaData.radius})`,
          1
        ))
      } else if (this.longitude && this.latitude && this.radius) {
        ruleItemList.push(this.generateRule(
          this.circleRuleDescription2,
          `#circle(#GPSX0,#GPSY0,${this.longitude},${this.latitude},${this.radius})`,
          1
        ))
      }

      // (4) 超时规则
      if (this.Timeout) {
        ruleItemList.push(this.generateRule(
          this.timeRuleDescription,
          `(overTime${this.Timeout}overTime)`,
          1
        ))
      }
      return ruleItemList
    },

    // 表单重置函数
    resetForm() {
      this.open = false
      this.$emit('ok', '')
      this.startTime = new Date().getTime()
      this.endTime = new Date().getTime() + 3 * 24 * 3600 * 1000
      this.longitude = null
      this.latitude = null
      this.radius = null
      this.circleRuleDescription1 = null
      this.circleRuleDescription2 = null
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


