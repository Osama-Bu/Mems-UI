<template>
  <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
    <span v-hasPermi="['vue:msg:belong']">
      <el-tag type="info" style="font-size: 20px ; white-space: pre-wrap;color: black;background-color: white;border: none;">{{ $t('messageInfo.table.operate.belong') }}：{{ this.ParsedForm.belong }}</el-tag>
    </span>
    <el-table :data="msgItemList" stripe border v-loading="loading" style="width: 100%">
      <el-table-column :label="$t('messageInfo.table.operate.order')" type="index" align="center" width="50px"></el-table-column>
      <el-table-column prop="name" :label="$t('messageInfo.table.operate.code')" align="center" width="150px"></el-table-column>
      <el-table-column prop="content" :label="$t('messageInfo.table.operate.name')" align="center" width="150px"></el-table-column>
      <el-table-column prop="description" :label="$t('messageInfo.table.operate.describe')" align="center" width="150px"></el-table-column>
      <el-table-column prop="lengthByte" :label="$t('messageInfo.table.operate.size')" align="center"></el-table-column>
      <el-table-column prop="dataType" :label="$t('messageInfo.table.operate.dataType')" align="center"></el-table-column>
      <el-table-column prop="startByte" :label="$t('messageInfo.table.operate.start')" align="center"></el-table-column>
      <el-table-column prop="orderme" :label="$t('messageInfo.table.operate.exportOrder')" align="center"></el-table-column>
      <el-table-column prop="decimalPlace" :label="$t('messageInfo.table.operate.precision')" align="center"></el-table-column>
      <el-table-column prop="divUnit" :label="$t('messageInfo.table.operate.unit')" align="center"></el-table-column>
      <el-table-column prop="isExport" :label="$t('messageInfo.table.operate.isExport')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isExport?'':'danger'">
            {{ scope.row.isExport ? $t('system.true') : $t('system.false') }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">{{ $t('system.confirm') }}</el-button>
      <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
    </div>
    <MessageModifyDetail ref="MessageModifyDetail" @ok="handleQuery"></MessageModifyDetail>
  </el-dialog>
</template>

<script>
import { listDept, getDept } from "@/api/system/dept";
import { getMessageInfo, getMsgItemsByMsgId } from "@/api/message/message";
import { getMultiple } from "@/api/message/message";
import MessageModifyDetail from "./MessageModifyDetail";
export default {
  name: "MessageSelectDetail",
  components: {
    MessageModifyDetail,
  },
  data() {
    return {
      count: 0,
      belong: undefined,
      msgId: 1,
      msgItemList: [],
      title: "",
      open: false,
      flag: false,
      add: true,
      // 遮罩层
      loading: false,
      ParsedForm: {
        pageNum: -1,
        pageSize: 10,
        name: undefined,
        byteSize: undefined,
        belong: undefined,
        type: 1,
        // id: 0,
      },
    };
  },
  created() {
    this.getList(this.msgId);
  },
  methods: {
    handleQuery(id) {
      this.getList(id);
    },
    getList(id) {
      if (this.flag) {
        if (this.type === 1) {
          this.loading = true;
          this.ParsedForm.belong = "";
          if (
            this.$store.getters.permissions.indexOf("system:dept:query") !== -1 ||
            this.$store.getters.permissions.indexOf("*:*:*") !== -1
          ) {
            let currentLineWidth = 0; // 当前行的字符数
            for (let item of this.ParsedForm.deptId) {
              getDept(Number(item)).then((response) => {
                if (response.data) {
                  let deptName = response.data.deptName;
                  if (this.ParsedForm.belong.trim() === "") {
                    this.ParsedForm.belong = response.data.deptName;
                    currentLineWidth = deptName.length;
                  } else {
                    this.ParsedForm.belong += " " + response.data.deptName;
                    currentLineWidth += 1 + deptName.length;
                  }
                  if (currentLineWidth >= 1050) {
                    this.ParsedForm.belong += "\n"; // 插入换行符
                    currentLineWidth = 0; // 重置当前行宽度
                  }

                }
              });
            }
          }
          this.msgItemList = [];
          getMsgItemsByMsgId(id).then((res) => {
            this.msgItemList = res.data;
            this.loading = false;
          });
        }
        else if (this.type === 0) {
          this.loading = true;
          this.ParsedForm.belong = "";
          if (
            this.$store.getters.permissions.indexOf("system:dept:query") !== -1 ||
            this.$store.getters.permissions.indexOf("*:*:*") !== -1
          ) {
            let count = 0;
            let currentLineWidth = 0;
            for (let item of this.ParsedForm.deptId) {
              getDept(item).then((response) => {
                if (response.data) {
                  if (response.data) {
                    let deptName = response.data.deptName;
                    if (this.ParsedForm.belong.trim() === "") {
                      this.ParsedForm.belong = response.data.deptName;
                      currentLineWidth = deptName.length;
                    } else {
                      this.ParsedForm.belong += " " + response.data.deptName;
                      currentLineWidth += 1 + deptName.length;
                    }
                    if (currentLineWidth >= 1050) {
                      this.ParsedForm.belong += "\n"; // 插入换行符
                      currentLineWidth = 0; // 重置当前行宽度
                    }
                  }
                }
              });
            }
          }
          this.msgItemList = [];
          let deptIdFirst=[];
          deptIdFirst.push(this.ParsedForm.deptId[0]);
          this.ParsedForm.deptId=deptIdFirst;
          getMultiple(this.ParsedForm).then((response) => {
            for (let item of response.rows) {
              if (id == item.id) {
                this.msgItemList = item.msgItemResVOList;
              }
            }
            this.loading = false;
          });
        }
      }
    },
    cancel() {
      this.open = false;
    },
  },
  watch: {
    msgId: function (val) {
      this.getList(val);
    },
  },
};
</script>
<style scoped></style>
