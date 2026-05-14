<template>
  <el-dialog :title="title" :visible.sync="open" width="1050px" append-to-body>
    <span v-hasPermi="['vue:msg:belong']">
      <el-tag type="info" style="font-size: 20px; white-space: pre-wrap;color: black;background-color: white;border: none;">
        {{ $t('messageInfo.table.banding.belong') }}：{{ this.deptName }}
      </el-tag>
    </span>
    <el-table :data="msgList" stripe border v-loading="loading" style="width: 100%">
      <el-table-column :label="$t('messageInfo.table.banding.order')" type="index" align="center" width="80px"></el-table-column>
      <el-table-column prop="cdId" :label="$t('messageInfo.table.banding.deviceId')" align="center"></el-table-column>
      <el-table-column prop="deviceName" :label="$t('messageInfo.table.banding.deviceName')" align="center"></el-table-column>
      <el-table-column prop="model" :label="$t('messageInfo.table.banding.deviceType')" align="center" width="300px">
        <template slot-scope="scope">
          <el-tag type="">
            {{ getTypeAndModel(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptId" :label="$t('messageInfo.table.banding.belong')" align="center" width="200px" :formatter="deptFormatter"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getDept, listDept } from "@/api/system/dept";
import { getDeviceBanding } from "@/api/message/message";
import { getDeviceTypeTree } from '@/api/device/device'
import MessageModifyDetail from "./MessageModifyDetail";

export default {
  name: "MessageGliderDetail",
  components: {
    MessageModifyDetail,
  },
  data() {
    return {
      deptName: undefined,
      deptOptions: [],
      name: "",
      title: "",
      open: false,
      // 遮罩层
      loading: false,
      msgList: [],
      msgIdList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msgIdList: undefined
      },
      deviceTypeOptions: []
    };
  },
  async created() {
    await this.getDeviceTypeOptions();
  },
  methods: {
    // 获取设备类型及型号树
    async getDeviceTypeOptions() {
      await getDeviceTypeTree().then(response => {
        this.deviceTypeOptions = response.data;
      })
    },

    getTypeAndModel(row) {
      // 设备类型型号替换
      const deviceType = this.deviceTypeOptions.find(type => type.id === row.deviceType)
      const deviceTypeName = deviceType ? deviceType.label : '未知产品'
      const deviceModel = deviceType.children.find(model => model.id === row.deviceModel)
      const deviceModelName = deviceModel ? deviceModel.label : '未知型号'
      return deviceTypeName + "/" +deviceModelName;
    },

    deptFormatter(row, column, cellValue) {
      const dept = this.deptOptions.find(item => item.deptId === cellValue);
      return dept ? dept.deptName : cellValue;
    },

    init(){
      //获取部门列表
      if (this.$store.getters.permissions.indexOf('system:dept:list') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        listDept(this.queryParams).then((response) => {
          this.deptOptions = []
          for (let item of response.data) {
            let option = {
              deptId: item.deptId,
              deptName: item.deptName
            }
            this.deptOptions.push(option);
          }
        })
      }
    },
    getDeptName(deptId){
      if (this.$store.getters.permissions.indexOf("system:dept:query") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1) {
        getDept(Number(deptId)).then((response) => {
          if(response.data){
            this.deptName = response.data.deptName;
          }
        });
      }
    },
    getList(msgId) {
      this.loading = true;
      this.msgList = [];
      this.queryParams.msgIdList = [];
      this.queryParams.msgIdList.push(msgId);
      getDeviceBanding(this.queryParams).then((response) => {
          const rows = response.rows;
          if (Array.isArray(rows)) {
            for (let item of rows) {
              this.msgList.push(item);
            }
          } else {}
          this.loading = false;
        }).catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    cancel() {
      this.open = false;
    },
  }
};
</script>
<style scoped>

</style>
