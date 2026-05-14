<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body id="dialog2">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item :label="$t('command.customCmd.addAndEdit.cmdName')" prop="cmdName">
            <el-input v-model="form.cmdName" :placeholder="$t('command.customCmd.addAndEdit.tip1')" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.customCmd.addAndEdit.describe')" prop="represent">
            <el-input v-model="form.represent" :placeholder="$t('command.customCmd.addAndEdit.tip2')" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.customCmd.addAndEdit.cmdType')" prop="cmdtype">
            <el-input v-model="form.cmdtype" :placeholder="$t('command.customCmd.addAndEdit.tip3')" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.customCmd.addAndEdit.operateCode')" prop="cmdcode">
            <el-input v-model="form.cmdcode" :placeholder="$t('command.customCmd.addAndEdit.tip4')" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.customCmd.addAndEdit.paramNum')" prop="pramNum">
            <el-input-number v-model="form.pramNum" controls-position="right" :min="1" />
          </el-form-item>
        </el-col>
      </el-row>

      <div style="width: 100%; text-align: center; ">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-form>
  </el-dialog>

</template>

<script>
import eventBus from '../../EventBus'
import {getUserProfile} from '@/api/system/user'
import {addCmd,setCmd} from '@/api/command/command'

export default {
  name: "cmdAdd.vue",
  components: {},
  data(){
    return{
      Options:[],
      open: false,
      userID:0,
      cmdId:0,
      form: {
        cmdName:'',
        represent:'',
        cmdtype:'',
        cmdcode:'',
        pramNum:1,
      },
      rules:{
        cmdName: [
          { required: true, trigger: "blur", message: this.$t('command.customCmd.addAndEdit.rule1') }
        ],
        cmdtype: [
          { required: true, trigger: "blur", message: this.$t('command.customCmd.addAndEdit.rule2') }
        ],
        cmdcode: [
          { required: true, trigger: "blur", message: this.$t('command.customCmd.addAndEdit.rule3') }
        ],
        pramNum: [
          { required: true, trigger: "blur", message: this.$t('command.customCmd.addAndEdit.rule4') }
        ],
      },
      title: '',
      flag: false
    }
  },
  created() {
    this.getUserID()
  },
  methods:{
    submitForm: function() {
      if(this.flag){
        this.flag = false
        this.$refs["form"].validate(valid => {
          if (valid) {
            const datalist=[]
            const data={
              "id":0,
              "name":this.form.cmdName,
              "description":this.form.represent,
              "type":this.form.cmdtype,
              "operation":this.form.cmdcode,
              "paramNum":this.form.pramNum,
              "userId":this.userID,
            }
            datalist.push(data)
            if (this.title===this.$t('command.customCmd.addAndEdit.addTitle')){
              addCmd(datalist).then(res => {
                eventBus.$emit('refreshTable',1)
                if (res.code === 200) {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                }
              });
            }else if (this.title===this.$t('command.customCmd.addAndEdit.editTitle')){
              data["time"]=""
              data.id=this.cmdId
              setCmd(data).then(res => {
                eventBus.$emit('refreshTable',1)
                if (res.code === 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                }
              });
            }
            this.cancel()
          }else{
            this.flag = true
          }
        });
      }
    },
    getUserID(){
      getUserProfile().then(res => {
        if (res.code !== 200) {
          alert("请重新链接");
        } else {
          this.userID = res.data.userId
        }
      });
    },
    cancel() {
      this.open = false;
    },
  }
}

</script>

<style scoped>

</style>
