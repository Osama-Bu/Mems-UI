<template>
  <div id="app-container">
    <el-dialog
      :visible.sync="open"
      :title="title"
      width="960px"
      append-to-body
      id="dialog1"
    >
      <el-button
        style="margin-left: 0; margin-bottom: 10px"
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd('add')"
        v-hasPermi="['cmd:task:add']"
        >
        {{ $t('command.taskManage.add.label') }}
      </el-button>

      <el-button
        style="margin-bottom: 10px"
        type="primary"
        plain
        icon="el-icon-s-order"
        size="mini"
        @click="handleHistory()"
        v-hasPermi="['cmd:task:history']"
        >
        {{ $t('command.taskManage.history.label') }}
      </el-button>

      <el-table
        v-loading="loading"
        :data="taskList"
        stripe
        border
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="taskName"
          :label="$t('command.taskManage.table.taskName')"
          align="center"
          width="120px"
        ></el-table-column>
        <el-table-column :label="$t('command.taskManage.table.cmdList')" align="center" width="120px">
          <el-table-column
            prop="cdId"
            :label="$t('command.taskManage.table.deviceId')"
            align="center"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cdId || $t('system.none') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cmdName"
            :label="$t('command.taskManage.table.cmdName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cmdContext"
            :label="$t('command.taskManage.table.cmdContent')"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            class-name="small-padding fixed-width"
            width="90px"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="deleteTimingCmd(scope.row)"
                v-hasPermi="['cmd:task:delCmd']"
                >{{ $t('system.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="isExecute"
          :label="$t('command.taskManage.table.taskStatus')"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="startTime"
          :label="$t('command.taskManage.table.sendTime')"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          :label="$t('system.operate')"
          align="center"
          class-name="small-padding fixed-width"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteTask(scope.row)"
              v-hasPermi="['cmd:task:cancel']"
              >{{ $t('command.taskManage.table.cancelTask') }}</el-button>
          </template>
        </el-table-column>

      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getAllTimingTask()"
      />
    </el-dialog>
    <task-add ref="taskAddModal"></task-add>
    <task-history
      ref="taskHistoryModal"
      :deviceOptions="deviceOptions"
    ></task-history>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import taskAdd from "./addTimingTask";
import taskHistory from "./TimingTaskHistory";
import eventBus from "./EventBus";
import IconSelect from "@/components/IconSelect";
import { getCmds, deleteTaskCmd, cancelTask, getCurrentTimingTaskPages } from "@/api/command/command";
export default {
  name: "TimingTaskManage",
  components: { Treeselect, IconSelect, taskAdd, taskHistory },
  props: {
    deviceId: {
      type: [String, Number, undefined],
      default: undefined
    },
    // 指定类型为Array，默认值为空数组
    deviceOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      item: {},
      cmdList: [],
      // 遮罩层
      loading: false,
      taskList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      flag: false,
      title: "",
      // 表单参数
      form: {},
      // 总条数
      total: 0,
      //搜索字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getCmdList();
  },
  methods: {
    /** 新增按钮操作 */
    handleAdd(type) {
      if (type === "add") {
        this.$refs.taskAddModal.open = true;
        this.$refs.taskAddModal.flag = true;
        this.$refs.taskAddModal.title = this.$t('command.taskManage.add.title');
      }
    },
    /** 打开历史任务 */
    handleHistory() {
      this.$refs.taskHistoryModal.open = true;
      this.$refs.taskHistoryModal.flag = true;
      this.$refs.taskHistoryModal.title = this.$t('command.taskManage.history.title');
    },
    /** 时间戳转化 */
    timestampToTime(timestamp) {
      timestamp = timestamp ? timestamp : null;
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },

    /** 获取所有定时任务 */
    getAllTimingTask() {
      this.taskList = [];
      let data = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      getCurrentTimingTaskPages(data).then((res) => {
        if (res.code === 200) {
          this.total = res.total;
          this.jsonToList(res.rows);
        }
      });
    },
    /** 将json数据转化为列表 */
    jsonToList(jsonTask) {
      for (let item of jsonTask) {
        let taskData = {};
        let execute = "";
        if (item.isExecute === 0) {
          execute = this.$t('command.taskManage.table.status1');
        } else if (item.isExecute === 1) {
          execute = this.$t('command.taskManage.table.status3');
        } else {
          execute = this.$t('command.taskManage.table.status2');
        }
        if (item.cmdList.length > 0) {
          for (let item2 of item.cmdList) {
            taskData = {
              taskName: item.taskName,
              startTime: this.timestampToTime(item.startTime),
              isExecute: execute,
              id: item2.id,
              taskId: item.taskId,
              deviceId: item2.deviceId,
              cmdName: item2.cmdName,
              cmdId: item2.cmdId,
              cmdContext: item2.sendContent,
            };
            for (let device of this.deviceOptions) {
              if (item2.deviceId === device.id) {
                taskData.cdId = device.cdId;
              }
            }
            this.taskList.push(taskData);
          }
        } else {
          taskData = {
            taskName: item.taskName,
            startTime: this.timestampToTime(item.startTime),
            isExecute: execute,
            taskId: item.taskId,
            deviceId: this.$t('system.none'),
            cmdName: this.$t('system.none'),
            cmdId: this.$t('system.none'),
            cmdContext: this.$t('system.none'),
          };
          this.taskList.push(taskData);
        }
      }
    },
    getCmdList() {
      getCmds().then((response) => {
        this.cmdList = response.data;
        this.getAllTimingTask();
      });
    },

    cancel() {
      this.open = false;
      this.reset();
    },
    //单元格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex >= 5) {
        let nameSpan = this.getSpanNumber(this.taskList, "taskId");
        return {
          rowspan: nameSpan[rowIndex], //
          colspan: 1,
        };
      }
    },
    //获取要合并的行数
    getSpanNumber(data, prop) {
      let length = Array.isArray(data) ? data.length : 0;
      if (length > 0) {
        //用于标识位置
        let position = 0;
        //用于对比的数据
        let temp = data[0][prop];
        //要返回的结果
        let result = [1];
        for (let i = 1; i < length; i++) {
          if (data[i][prop] === temp) {
            //标识位置的数据加一
            result[position] += 1;
            //当前位置添0
            result[i] = 0;
          } else {
            //不相同时，修改标识位置，该位置设为1，修改对比值
            position = i;
            result[i] = 1;
            temp = data[i][prop];
          }
        }
        //返回结果
        return result;
      } else {
        return [0];
      }
    },

    /** 表格重置 */
    reset() {},
    /** 取消定时任务 */
    deleteTask(row) {
      this.$confirm("是否确认取消该定时任务", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return cancelTask(row.taskId);
        })
        .then(() => {
          this.getAllTimingTask();
          this.msgSuccess("撤销成功");
        });
    },
    /** 删除定时任务里面的指令 */
    deleteTimingCmd(row) {
      this.$confirm("是否确认删除该条指令", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        if(row.id){
          return deleteTaskCmd(row.id);
        }
      }).then(() => {
          this.getAllTimingTask();
          this.msgSuccess("撤销成功");
      });
    },
  },
  mounted() {
    //当新增任务后，刷新任务相关列表
    eventBus.$on("refreshTimingTask", () => {
      this.getAllTimingTask();
    });
  },
  watch: {

  },
};
</script>

<style scoped>
</style>
