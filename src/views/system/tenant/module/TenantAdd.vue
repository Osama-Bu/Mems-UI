<template>
  <div class="app-container">
    <!--添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.tenant.tenantName')" prop="tenantName">
              <el-input v-model="form.tenantName"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.tenant.tenantName')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('systemManage.tenant.remark')" prop="remark">
              <el-input v-model="form.remark"
                        :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.tenant.remark')"/>
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
    import { AddTenantInfo } from '@/api/tenant/tenant'

    export default {
        name: 'TenantAdd',
        components: {
        },
        data() {
            return {
                rules: {
                    tenantName:[
                        {required:true ,message: '请输入租户名称', trigger: 'blur'},
                    ],
                    remark:[
                        {required:true ,message: '请输入备注', trigger: 'blur'},
                    ],
                },
                form: {
                },
                title: '',
                open: false,
                goodsCodeOptions: [],
            }
        },
        created() {
        },
        methods: {
            //提交新增或修改的表单信息
            submitForm: function() {
                this.$refs['form'].validate(valid => {
                    AddTenantInfo(this.form).then(res =>{
                        this.msgSuccess('新增成功')
                        this.open = false
                        this.handleOk()
                    })
                })
            },

            //关闭新增或修改页面
            cancel() {
                this.open = false
            },
            handleOk(){
                this.$emit('ok', '');
            }
        }
    }
</script>

<style scoped>

</style>
