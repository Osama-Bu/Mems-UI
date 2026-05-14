<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-steps
        :active="1"
        align-center
        style="margin-bottom: 20px"
        space="300px"
      >
        <el-step :title="$t('messageInfo.addAndEdit.editStep1')"
                 :description="$t('messageInfo.addAndEdit.status1')"></el-step>
        <el-step :title="$t('messageInfo.addAndEdit.editStep1')"
                 :description="$t('messageInfo.addAndEdit.status2')"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('messageInfo.addAndEdit.msgName')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('messageInfo.addAndEdit.tip1')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageInfo.addAndEdit.msgVersion')" prop="version">
              <el-input
                v-model="form.version"
                placeholder="1.0"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('messageInfo.addAndEdit.isParse')" prop="parsed">
              <el-select v-model="form.parsed">
                <el-option
                  v-for="item in ParsedOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageInfo.addAndEdit.byteSize')" prop="byteSize">
              <el-input
                v-model.number="form.byteSize"
                :placeholder="$t('messageInfo.addAndEdit.tip3')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('messageInfo.addAndEdit.msgStatus')" prop="status">
              <el-select v-model="form.status">
                <el-option
                  v-for="item in StatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-hasPermi="['vue:msg:belong']">
            <el-form-item :label="$t('messageInfo.addAndEdit.belong')" prop="deptId">
              <el-select v-model="form.deptId">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.deptName"
                  :value="item.deptId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleModify">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>

    <MessageModifyDetail
      ref="MessageModifyDetail"
      :key="key"
      @ok="handleOk"
    ></MessageModifyDetail>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { listDept, getDept } from "@/api/system/dept";
import MessageModifyDetail from "./MessageModifyDetail";

export default {
  name: "MessageModify",
  components: {
    Treeselect,
    MessageModifyDetail,
  },
  data() {
    return {
      key: 1,
      msgId: "",
      // 是否已经解析未处理的option
      ParsedOptions: [
        {
          value: 1,
          label: this.$t('messageInfo.search.isParse'),
        },
        {
          value: 0,
          label: this.$t('messageInfo.search.notParse'),
        },
      ],
      StatusOptions: [
        {
          value: "0",
          label: this.$t('system.statusNormal'),
        },
        {
          value: "1",
          label: this.$t('system.statusStop'),
        },
      ],
      rules: {
        name: [
          { required: true, message: this.$t('messageInfo.addAndEdit.tip1'), trigger: "blur" }
        ],
        version: [
          { required: true, message: "协议版本默认1.0", trigger: "blur" },
        ],
        parsed: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        byteSize: [
          {
            required: true,
            message: this.$t('messageInfo.addAndEdit.tip3'),
            trigger: "blur",
          },
          { type: "number", message: "必须为数值" },
        ],
        status: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
      },
      form: {
        name: "",
        version: "",
        parsed: "",
        byteSize: "",
        status: "",
      },
      title: "",
      open: false,
      flag: false,
      add: true,
      deptOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
      },
    };
  },
  created() {
    if (this.add) {
      this.form.parsed = 0;
      this.form.status = "0";
    }
  },
  methods: {
    init() {
      if (
        this.$store.getters.permissions.indexOf("system:dept:list") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1
      ) {
        //获取部门列表
        listDept(this.queryParams).then((response) => {
          this.deptOptions = [];
          for (let item of response.data) {
            let option = {
              deptId: item.deptId,
              deptName: item.deptName,
            };
            this.deptOptions.push(option);
          }
        });
      }
    },
    //修改处理
    handleModify() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.MessageModifyDetail.flag = true;
          this.$refs.MessageModifyDetail.title = this.$t('messageInfo.addAndEdit.item.editTitle') + "-" + this.form.name;
          this.open = false;
          this.$refs.MessageModifyDetail.open = true;
          this.$refs.MessageModifyDetail.add = true;
          this.$refs.MessageModifyDetail.messageInfo = {
            id: this.form.id,
            name: this.form.name,
            deptId: this.form.deptId,
            version: this.form.version,
            parsed: this.form.parsed === 1 ? true : false,
            byteSize: this.form.byteSize,
            status: this.form.status,
            copied: false,
            copiedStartByte: 0,
            copiedByteLen: 0,
            copiedTimes: 0,
          };
          this.$refs.MessageModifyDetail.init();
        } else {
          return false;
        }
      });
    },

    //关闭新增或修改页面
    cancel() {
      this.open = false;
    },
    handleOk() {
      this.$emit("ok", "");
    },
  },
};
</script>

<style scoped>
</style>
