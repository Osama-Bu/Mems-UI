<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.ip')" prop="host">
              <el-input v-model="form.host" :placeholder="$t('parseBeidou.addAndEdit.tip1')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.port')" prop="port">
              <el-input v-model="form.port" :placeholder="$t('parseBeidou.addAndEdit.tip2')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.mail')" prop="mailbox">
              <el-input v-model="form.mailbox" :placeholder="$t('parseBeidou.addAndEdit.tip3')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.loginInfo')" prop="password">
              <el-input v-model="form.password" :placeholder="$t('parseBeidou.addAndEdit.tip4')" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.messageInfo')" prop="message">
              <el-input v-model="form.message"  :placeholder="$t('parseBeidou.addAndEdit.tip6')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.interval')" prop="timeCount">
              <el-input v-model.number="form.timeCount" :placeholder="$t('parseBeidou.addAndEdit.tip7')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item :label="$t('parseBeidou.addAndEdit.receiveWay')" prop="way">
            <el-select v-model="form.way" :placeholder="$t('parseBeidou.addAndEdit.tip5')">
              <el-option
                v-for="item in WayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseBeidou.addAndEdit.status')" prop="status">
              <el-switch
                v-model="form.status"
                :active-value=0
                :inactive-value=1
              ></el-switch>
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
    import { updateBeidouInfo } from '@/api/mail/beidou'
    export default {
        name: 'BeidouUpdate',
        data() {
            return {
                rules: {
                  host:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip1'), trigger: 'blur'},
                  ],
                  port:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip2'), trigger: 'blur'},
                  ],
                  password:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip3'), trigger: 'blur'},
                  ],
                  mailbox:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip4'), trigger: 'blur'},
                    {
                      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: this.$t('parseBeidou.addAndEdit.rule1')
                    }
                  ],
                  message:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip6'), trigger: 'blur'},
                  ],
                  timeCount:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip7'), trigger: 'blur'},
                    {type:'number',min: -2147483648, max: 2147483648, message: this.$t('parseBeidou.addAndEdit.rule2'), trigger: 'blur'},
                  ],
                  way:[
                    {required:true ,message: this.$t('parseBeidou.addAndEdit.tip5'), trigger: 'blur'},
                  ]
                },
                form: {},
                title: '',
                open: false,
                WayOptions: [{
                    value: 1,
                    label: 'ascii'
                }, {
                    value: 2,
                    label: 'hex'
                }],
            }
        },
        methods: {
            //提交新增表单信息
            submitForm: function() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.form.status = this.form.status.toString()
                        updateBeidouInfo(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.$emit('ok', '')
                        })
                    }
                })
            },
            //关闭新增或修改页面
            cancel() {
                this.open = false
            },
        }
    }
</script>

<style scoped>

</style>
