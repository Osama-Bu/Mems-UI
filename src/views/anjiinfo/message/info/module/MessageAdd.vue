<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-steps
        :active="1"
        align-center
        style="margin-bottom: 20px"
        space="300px"
      >
        <el-step :title="$t('messageInfo.addAndEdit.addStep1')"
                 :description="$t('messageInfo.addAndEdit.status1')">
        </el-step>
        <el-step :title="$t('messageInfo.addAndEdit.addStep2')"
                 :description="$t('messageInfo.addAndEdit.status2')">
        </el-step>
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
              <el-select
                v-model="form.version"
                filterable
                allow-create
                default-first-option
                placeholder="1.0"
              >
                <el-option
                  v-for="item in VersionOptions"
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
              <el-select
                v-model="form.deptId"
                multiple
                collapse-tags
                v-if="form.version === '0.0'"
              >
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.deptName"
                  :value="item.deptId"
                >
                </el-option>
              </el-select>
              <el-select v-model="form.deptId" v-else>
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
        <el-button type="primary" @click="handleAdd">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!--    新增协议项页面-->
    <MessageAddDetail ref="MessageAddDetail" @ok="handleOk"></MessageAddDetail>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import { listDept } from "@/api/system/dept";
import MessageAddDetail from "./MessageAddDetail";

export default {
  name: "MessageAdd",
  components: {
    Treeselect,
    MessageAddDetail,
  },
  data() {
    return {
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
      VersionOptions: [{ value: "0.0", label: "0.0(所属可多选)" }],
      form: {
        name: "",
        version: "",
        parsed: "",
        byteSize: "",
        status: "",
      },
      rules: {
        name: [{ required: true, message: this.$t('messageInfo.addAndEdit.tip1'), trigger: "blur" }],
        version: [
          { required: true, message: "协议版本默认1.0", trigger: "blur" },
        ],
        parsed: [{ required: true, message: "请选择", trigger: "blur" }],
        byteSize: [
          {
            required: true,
            message: this.$t('messageInfo.addAndEdit.tip3'),
            trigger: "blur",
          },
          { type: "number", message: "必须为数值" },
        ],
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
  },
  methods: {
    initForm() {
      // 重置表单
      this.form = {
        name: "",
        version: "1.0",
        parsed: 0,
        byteSize: "",
        status: "0",
        deptId: ""
      };
    },
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
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.MessageAddDetail.flag = true;
          this.$refs.MessageAddDetail.title = this.$t('messageInfo.addAndEdit.item.addTitle') + "-" + this.form.name;
          this.$refs.MessageAddDetail.open = true;
          this.$refs.MessageAddDetail.add = true;
          if (!Array.isArray(this.form.deptId)) {
            this.form.deptId = [this.form.deptId];
          }
          this.$refs.MessageAddDetail.messageInfo = {
            name: this.form.name,
            deptId: this.form.deptId,
            version: this.form.version,
            parsed: this.form.parsed == 1 ? true : false,
            byteSize: this.form.byteSize,
            status: this.form.status,
            copied: false,
            copiedStartByte: 0,
            copiedByteLen: 0,
            copiedTimes: 0,
          };
          this.open = false;
          this.$refs.MessageAddDetail.init();
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
