<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.reParse.startTime')" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('parseMail.reParse.tip1')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item :label="$t('parseMail.reParse.endTime')" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('parseMail.reParse.tip2')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.reParse.imel')" prop="imel">
              <el-input v-model="form.imel" :placeholder="$t('parseMail.reParse.tip3')"/>
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
    import { reparseMail } from '@/api/mail/mail'

    export default {
        name: 'MailReparse',
        data() {
            return {
                open: false,
                title: '',
                rules: {
                    startTime:[
                        {required:true ,message: this.$t('parseMail.reParse.tip1'), trigger: 'blur'},
                    ],
                    endTime:[
                        {required:true ,message: this.$t('parseMail.reParse.tip2'), trigger: 'blur'},
                    ],
                    imel:[
                        {required:true ,message: this.$t('parseMail.reParse.tip3'), trigger: 'blur'},
                    ],
                },
                form: {
                  startTime:null,
                  endTime:null,
                  imel:null,
                },
            }
        },
        methods: {
            //提交新增或修改的表单信息
            submitForm: function() {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                                reparseMail(this.form).then(response => {
                                    this.msgSuccess('邮箱重解析成功')
                                    this.open = false
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
