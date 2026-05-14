<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.bandingMessage.addBanding.bandingMsg')" prop="msgId">
              <el-select v-model="form.msgId" :placeholder="$t('deviceInfo.bandingMessage.addBanding.tips')" @change="handleChange()">
                <el-option
                  v-for="item in messageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.bandingMessage.addBanding.mainMsg')" prop="main">
              <el-select v-model="form.main" :placeholder="$t('deviceInfo.bandingMessage.addBanding.tips')">
                <el-option
                  v-for="item in mainOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('deviceInfo.bandingMessage.addBanding.byteSize')" prop="bytesize">
              <el-input v-model="form.bytesize" :disabled="true" :placeholder="$t('deviceInfo.bandingMessage.addBanding.tips')"/>
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
import Treeselect from '@riophae/vue-treeselect'
import { addDeviceInfoWithMessage } from '@/api/device/device'
import { getMessageInfo } from '@/api/message/message'

export default {
  name: 'GliderWithMessageAdd',
  components: {
    Treeselect
  },
  data() {
    return {
      rules: {
        msgId: [
          { required: true, message: '请选择绑定协议', trigger: 'blur' }
        ],
        main: [
          { required: true, message: '请选择是否为主协议', trigger: 'blur' }
        ]
      },
      form: {
        deviceId: undefined,
        msgId: undefined,
        main: undefined,
        bytesize: undefined,
      },
      title: '',
      open: false,
      mainOptions: [
        { label: this.$t('system.true'), value: 1 },
        { label: this.$t('system.false'), value: 0 }
      ],
      messageOptions: []
    }
  },
  created() {
    // 获取绑定协议选项的list
    let queryParam = {
      pageNum: -1,
      pageSize: 10
    }
    if (this.$store.getters.permissions.indexOf('msg:page') !== -1
      || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
      getMessageInfo(queryParam).then(res => {
        if (res.code !== 200) {

        } else {
          this.messageOptions = []
          for (let item of res.rows) {
            const temp = {
              value: item.id,
              label: item.name,
              bytesize: item.byteSize
            }
            this.messageOptions.push(temp)
          }
        }
      })
    }
  },
  methods: {
    //提交新增或修改的表单信息
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addDeviceInfoWithMessage(this.form).then((res) => {
            if(res.code===200){
              this.msgSuccess('新增绑定成功');
              this.open = false;
              this.$emit('ok', '');
            }
          })
        }
      })
    },
    handleChange() {
      let Obj = this.messageOptions.find(item => item.value === this.form.msgId)
      this.form.bytesize = Obj.bytesize
    },
    cancel() {
      this.open = false
    }
  }
}
</script>

<style scoped>

</style>
