<template>
  <div class="app-container">
    <!--      添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.addAndEdit.mail')" prop="username">
              <el-input v-model="form.username" :placeholder="$t('parseMail.addAndEdit.tip1')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.addAndEdit.mailBox')" prop="inboxName">
              <el-input v-model="form.inboxName" :placeholder="$t('parseMail.addAndEdit.tip2')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.addAndEdit.mailServer')" prop="host">
              <el-input v-model="form.host" :placeholder="$t('parseMail.addAndEdit.tip3')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.addAndEdit.access')" prop="password">
              <el-input v-model="form.password" :placeholder="$t('parseMail.addAndEdit.tip4')" show-password/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('parseMail.addAndEdit.protocol')" prop="protocol">
              <el-input v-model="form.protocol" disabled/>
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
    import Treeselect from "@riophae/vue-treeselect";
    import { addMailInfo,updateMailInfo } from '@/api/mail/mail'

    export default {
        name: 'MailAdd',
        components: {
            Treeselect
        },
        data() {
          return {
            rules: {
              username:[
                {required:true ,message: this.$t('parseMail.addAndEdit.rule1'), trigger: 'blur'},
                {
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: this.$t('parseMail.addAndEdit.rule2')
                },
              ],
              inboxName:[
                {required:true ,message: this.$t('parseMail.addAndEdit.rule3'), trigger: 'blur'},
              ],
              host:[
                {required:true ,message: this.$t('parseMail.addAndEdit.rule4'), trigger: 'blur'},
              ],
              password:[
                {required:true ,message: this.$t('parseMail.addAndEdit.rule5'), trigger: 'blur'},
              ],
              protocol:[
                {required:true ,message: this.$t('parseMail.addAndEdit.rule6'), trigger: 'blur'},
              ],
            },
            form: {
              protocol: "imaps",
              status:0,
            },
            title: '',
            open: false,
            flag:false,
            add:true,
            disAble:true
          }
        },
        created() {

        },
        methods: {
            //提交新增或修改的表单信息
            submitForm: function() {
                if(this.flag){
                    this.flag = false
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            if (this.add == false) {
                              this.form.status = this.form.status == '正常' ? 0 : 1;
                                updateMailInfo(this.form).then(response => {
                                    this.msgSuccess('修改成功')
                                    this.open = false
                                    this.$emit('ok', '')
                                })
                            } else {
                                addMailInfo(this.form).then(response => {
                                    this.msgSuccess('新增成功')
                                    this.open = false
                                    this.$emit('ok', '')
                                })
                            }
                        }else{
                            this.flag = true
                        }
                    })
                }
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
