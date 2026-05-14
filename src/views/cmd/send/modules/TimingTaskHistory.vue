<template>
  <div id="app-container">
    <el-dialog
      :visible.sync="open"
      :title="title"
      width="950px"
      append-to-body
      id="dialog1"
    >
      <el-table
        v-loading="loading"
        :data="taskList"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          prop="taskName"
          :label="$t('command.taskManage.history.taskName')"
          align="center"
          width="150px"
        ></el-table-column>
        <el-table-column :label="$t('command.taskManage.history.cmdList')" align="center">
          <el-table-column
            prop="cdId"
            :label="$t('command.taskManage.history.deviceId')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cdId || $t('system.none') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cmdName"
            :label="$t('command.taskManage.history.cmdName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cmdContext"
            :label="$t('command.taskManage.history.cmdContent')"
            align="center"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          prop="isExecute"
          :label="$t('command.taskManage.history.taskStatus')"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="startTime"
          :label="$t('command.taskManage.history.sendTime')"
          align="center"
          width="100px"
        ></el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getAllTimingTaskHistory"
      />
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getCmds, getTimingTaskHistoryPages, } from "@/api/command/command";

export default {
  name: "TimingTaskHistory",
  props: {
    deviceOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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

    /** 获取所有定时任务历史 */
    getAllTimingTaskHistory() {
      this.loading = true
      this.taskList = []; //清空指令列表
      let data = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      getTimingTaskHistoryPages(data).then((res) => {
        if (res.code === 200) {
          this.total = res.total;
          this.jsonToList(res.rows);
          this.loading = false
        }
      });
    },
    /** 将json数据转化为树形结构 */
    jsonToList(jsonTask) {
      for (let item of jsonTask) {
        let taskData = {};
        let execute = "";
        if (item.isExecute === 0) {
          execute = this.$t('command.taskManage.history.status1');
        } else if (item.isExecute === 1) {
          execute = this.$t('command.taskManage.history.status3');
        } else {
          execute = this.$t('command.taskManage.history.status2');
        }

        if (item.cmdList.length > 0) {
          let childrenList = [];
          for (let i = 1; i < item.cmdList.length; i++) {
            let children = {
              taskName: "指令" + (i + 1),
              startTime: this.timestampToTime(item.startTime),
              isExecute: execute,
              id: item.cmdList[i].id,
              taskId: item.taskId,
              deviceId: item.cmdList[i].deviceId,
              cmdName: item.cmdList[i].cmdName,
              cmdId: item.cmdList[i].cmdId,
              cmdContext: item.cmdList[i].sendContent,
            };
            for (let device of this.deviceOptions) {
              if (item.cmdList[i].deviceId === device.id) {
                children.cdId = device.cdId;
              }
            }
            childrenList.push(children);
          }
          taskData = {
            taskName: item.taskName,
            startTime: this.timestampToTime(item.startTime),
            isExecute: execute,
            id: item.cmdList[0].id,
            taskId: item.taskId,
            deviceId: item.cmdList[0].deviceId,
            cmdName: item.cmdList[0].cmdName,
            cmdId: item.cmdList[0].cmdId,
            cmdContext: item.cmdList[0].sendContent,
            children: childrenList,
          };
          for (let device of this.deviceOptions) {
            if (item.cmdList[0].deviceId === device.id) {
              taskData.cdId = device.cdId;
            }
          }
          this.taskList.push(taskData);
        } else {
          taskData = {
            taskName: item.taskName,
            startTime: this.timestampToTime(item.startTime),
            isExecute: execute,
            id: -item.taskId, //因为必须要一个id才能正常使用，但是这种没有指令的任务时不会有id那，那就直接-taskid，这样也不会重复
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
    //所有指令信息
    getCmdList() {
      getCmds().then((res) => {
        this.cmdList = res.data;
        this.getAllTimingTaskHistory();
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //单元格合并
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex==0 ||columnIndex>=5) {//合并第1列和5列之后的单元，
    //     //合并相同任务id的单元格
    //     let nameSpan = this.getSpanNumber(this.taskList, "taskId");
    //     return {
    //       rowspan: nameSpan[rowIndex],//
    //       colspan: 1,
    //     };
    //
    //   }
    // },
    //获取要合并的行数
    // getSpanNumber(data, prop) {
    //   //data要处理的数组，prop要合并的属性，比如name
    //
    //   //数组的长度，有时候后台可能返回个null而不是[]
    //   let length = Array.isArray(data) ? data.length : 0;
    //   if (length > 0) {
    //     //用于标识位置
    //     let position = 0;
    //     //用于对比的数据
    //     let temp = data[0][prop];
    //     //要返回的结果
    //     let result = [1];
    //     //假设数据是AABCC，我们的目标就是返回20120
    //     for (let i = 1; i < length; i++) {
    //       if (data[i][prop] == temp) {
    //         //标识位置的数据加一
    //         result[position] += 1;
    //         //当前位置添0
    //         result[i] = 0;
    //       } else {
    //         //不相同时，修改标识位置，该位置设为1，修改对比值
    //         position = i;
    //         result[i] = 1;
    //         temp = data[i][prop];
    //       }
    //     }
    //     //返回结果
    //     return result;
    //   } else {
    //     return [0];
    //   }
    // },

    /** 表格重置 */
    reset() {

    },
  },
};
</script>

<style scoped>
</style>
