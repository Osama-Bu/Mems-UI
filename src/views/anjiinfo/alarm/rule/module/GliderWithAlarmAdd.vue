<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="720px" append-to-body>
      <el-steps
        :active="1"
        align-center
        style="margin-bottom: 20px"
        space="300px"
      >
        <el-step :title="$t('deviceInfo.bandingAlarm.addAndEdit.step1')"
                 :description="$t('deviceInfo.bandingAlarm.addAndEdit.status1')">

        </el-step>
        <el-step :title="$t('deviceInfo.bandingAlarm.addAndEdit.step2')"
                 :description="$t('deviceInfo.bandingAlarm.addAndEdit.status2')">

        </el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.msg')">
              <el-select
                v-model="selectedMessage"
                filterable
                :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.tip1')"
                style="width:200px;"
                @change="handleMessageChange(null)"
                class="idSelect"
              >
                <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ }}</span>
                  <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
                  <span style=" color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.msgItem')">
              <el-select
                v-model="selectedMessageItem"
                filterable
                :placeholder="selectedMessageItem + ''"
                style="width:200px;"
                @change="filedChanged(null)"
                class="idSelect"
              >
                <el-option v-for="item in messageItemOptions" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
                  <span style=" color: #8492a6; font-size: 13px">{{ item.content }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 制定报警规则页面 -->
    <GliderWithAlarmAddDetail ref="GliderWithAlarmAddDetailModal" @ok="handleOk"></GliderWithAlarmAddDetail>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import { getDeviceInfoWithMessage } from '@/api/device/device'
import { getMsgItemsByMsgId } from '@/api/message/message'
import GliderWithAlarmAddDetail from './GliderWithAlarmAddDetail'

export default {
  name: 'GliderWithAlarmAdd',
  components: {
    Treeselect,
    GliderWithAlarmAddDetail
  },
  data() {
    return {
      rules: {},
      form: {},
      title: '',
      open: false,
      loading: false,
      deviceId: 1,
      deviceName: '',
      selectedMessage: 1,
      selectedMessageItem: 1,
      selectedMessageItem_name: '',
      selectedMessageItem_content: '',
      msgQueryParams: {
        deviceId: undefined,
        pageNum: -1,
        pageSize: 10
      },
      fieldQueryParams: {
        pageNum: -1,
        pageSize: 10,
        id: undefined
      },
      messageOptions: [],
      messageItemOptions: []
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    init() {
      this.msgQueryParams.deviceId = this.deviceId
      getDeviceInfoWithMessage(this.msgQueryParams).then(res => {
        if (res.code !== 200) {
          alert('请重新链接')
        } else {
          this.messageOptions = []
          for (let item of res.rows) {
            const temp = {
              id: item.id,
              name: item.name
            }
            this.messageOptions.push(temp)
          }
          if (this.messageOptions) {
            this.selectedMessage = this.messageOptions[0].id
          }
          this.handleMessageChange(this.selectedMessage)
        }
      })
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$refs.GliderWithAlarmAddDetailModal.min = null
          this.$refs.GliderWithAlarmAddDetailModal.max = null
          this.$refs.GliderWithAlarmAddDetailModal.triggerNum = null
          this.$refs.GliderWithAlarmAddDetailModal.trigger = null
          this.$refs.GliderWithAlarmAddDetailModal.Timeout = null
          this.$refs.GliderWithAlarmAddDetailModal.triggerRuleDescription = ''
          this.$refs.GliderWithAlarmAddDetailModal.timeRuleDescription = ''
          this.$refs.GliderWithAlarmAddDetailModal.scopeRuleDescription = ''

          this.$refs.GliderWithAlarmAddDetailModal.open = true
          this.$refs.GliderWithAlarmAddDetailModal.title = this.$t('deviceInfo.bandingAlarm.addAndEdit.addTitle');
          this.$refs.GliderWithAlarmAddDetailModal.messageItemName = this.selectedMessageItem_name
          this.$refs.GliderWithAlarmAddDetailModal.messageItemContent = this.selectedMessageItem_content

          this.$refs.GliderWithAlarmAddDetailModal.msgId = this.selectedMessage
          this.$refs.GliderWithAlarmAddDetailModal.form = {
            deviceId: this.deviceId,
            msgId: this.selectedMessage,
            startTime: undefined,
            endTime: undefined,
            ruleItemList: []
          }
          this.open = false
        } else {
          return false
        }
      })
    },
    filedChanged(item) {
      // 获取选中的选项
      const selectedOption = this.messageItemOptions.find(option => option.id === this.selectedMessageItem)
      if (selectedOption) {
        this.selectedMessageItem_name = selectedOption.name
        this.selectedMessageItem_content = selectedOption.content
      }
    },
    handleMessageChange(item) {
      getMsgItemsByMsgId(this.selectedMessage).then(res => {
        if (res.code !== 200) {
          alert('请重新链接')
        } else {
          this.messageItemOptions = []
          for (let item of res.data) {
            const temp = {
              id: item.id,
              name: item.name,
              content: item.content
            }
            this.messageItemOptions.push(temp)
          }
          if (this.messageItemOptions) {
            this.selectedMessageItem = this.messageItemOptions[0].id
            this.selectedMessageItem_name = this.messageItemOptions[0].name
          }
        }
      })
    },
    //关闭新增或修改页面
    cancel() {
      this.open = false
    },
    handleOk() {
      this.$emit('ok', '')
    }
  }
}
</script>

<style scoped></style>
