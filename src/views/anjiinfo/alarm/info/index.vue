<template>
  <div class="app-container">
    <navbar />
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-page-header @back="goBack" />
      </el-col>
      <!--报警数据-->
      <el-col :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.deviceName')}}：{{ deviceForm.deviceName }}</el-tag>
          </el-col>
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.deviceId')}}：{{ deviceForm.cdId }}</el-tag>
          </el-col>
          <el-col :span="2.5" v-hasPermi="['system:dept:query']">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.belong')}}：{{ deviceForm.deptName }}</el-tag>
          </el-col>
        </el-row>

        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="120px">
          <el-form-item :label="$t('deviceInfo.alarmContent.deal')" prop="dealed">
            <el-select
              v-model="queryParams.dealed"
              :placeholder="$t('deviceInfo.alarmContent.tip1')"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="item in propertyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('deviceInfo.alarmContent.alarmTime')">
            <el-date-picker v-model="queryParams.alarmTimeStart" type="datetime"
                            :placeholder="$t('deviceInfo.alarmContent.tip2')"
                            :clearable="true"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="queryParams.alarmTimeEnd" type="datetime"
                            :placeholder="$t('deviceInfo.alarmContent.tip3')"
                            :clearable="true"></el-date-picker>
          </el-form-item>

          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
            {{ $t('system.search') }}
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
            {{ $t('system.reset') }}
          </el-button>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="alarmInfoList" @selection-change="handleSelectionChange"
                  style="width: 100%" border>

          <el-table-column type="selection" width="70" align="center" />

          <el-table-column
            :label="$t('deviceInfo.alarmContent.alarmInfo')"
            align="center" key="alarmInfo" prop="alarmInfo"
            v-if="columns[0].visible" />

          <el-table-column
            :label="$t('deviceInfo.alarmContent.alarmTime')"
            align="center" key="alarmTime" prop="alarmTime"
            v-if="columns[1].visible" />

          <el-table-column
            :label="$t('deviceInfo.alarmContent.deal')"
            align="center" key="dealed" prop="dealed" v-if="columns[2].visible">
            <template slot-scope="scope">
              <el-tag :type="scope.row.dealed? 'success':'danger'">
                {{ scope.row.dealed?
                $t('deviceInfo.alarmContent.deal_yes')
                :
                $t('deviceInfo.alarmContent.deal_no') }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('deviceInfo.alarmContent.dealTime')"
            align="center" key="dealTime" prop="dealTime" v-if="columns[3].visible" >
          </el-table-column>

          <el-table-column
            :label="$t('deviceInfo.alarmContent.option')"
            align="center" key="opinion" prop="opinion" v-if="columns[4].visible">
          </el-table-column>

          <el-table-column :label="$t('system.operate')" align=center class-name="small-padding fixed-width" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-paperclip"
                         @click="handleSingleAlarm(scope.row)">{{ $t('deviceInfo.alarmContent.handle') }}</el-button>
            </template>
          </el-table-column>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 处理报警页面-->
    <AlarmDealed ref="AlarmDealedModal" @ok="handleQuery"></AlarmDealed>
  </div>
</template>


<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getAlarmInfo } from "@/api/alarm/alarminfo";
import { Navbar } from "@/layout/components";
import AlarmDealed from "./module/AlarmDealed";
import { listDept, getDept } from "@/api/system/dept";

export default {
  name: "AlarmInfo",
  components: {
      Navbar,
      AlarmDealed,
  },
  data() {
    return {
      //搜索字段
      propertyOptions: [
        {
          value: true,
          label: '已处理'
        },
        {
          value: false,
          label: '未处理'
        }
      ],
      //设备所属组织
      deviceForm: {
        deviceName: undefined,
        cdId: undefined,
        deptName: undefined,
        deviceId: undefined
      },
      // 操作列显示隐藏
      operation: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        deviceId: undefined,
        dealed: undefined,
        alarmTimeEnd: undefined,
        alarmTimeStart: undefined,
      },
      // 报警信息列表
      alarmInfoList: [],
      // 列信息
      columns: [
          { key: 0, label: `报警信息`, visible: true },
          { key: 1, label: `报警时间`, visible: true },
          { key: 2, label: `是否处理`, visible: true },
          { key: 3, label: `处理时间`, visible: true },
          { key: 4, label: `报警意见`, visible: true },
      ],
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 选中数组
      ids: [],
      //选中数据
      selection: [],
      // 总条数
      total: 0,
    };
  },
  mounted() {
    this.queryParams.pageNum = 1;
    this.queryParams.deviceId = Number(this.$route.query.deviceId);
    this.deptId = this.$route.query.deptId;
    this.deviceForm.deviceName = this.$route.query.deviceName
    this.deviceForm.cdId = this.$route.query.cdId
    this.deviceForm.deviceId = Number(this.$route.query.deviceId)
    this.getList();
  },
  created() {

  },
  methods: {
    formatDate(dateObj) {
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return "";
      }
      const year = dateObj.getFullYear(); // 年（4位）
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月（注意：月份从0开始，需+1）
      const day = dateObj.getDate().toString().padStart(2, '0'); // 日
      const hours = dateObj.getHours().toString().padStart(2, '0'); // 时
      const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // 分
      const seconds = dateObj.getSeconds().toString().padStart(2, '0'); // 秒

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    //查询报警代码信息
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.queryParams.alarmTimeStart = this.formatDate(this.queryParams.alarmTimeStart);
      this.queryParams.alarmTimeEnd = this.formatDate(this.queryParams.alarmTimeEnd);
      this.getList();
    },
    //重置查询
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //处理报警信息
    handleSingleAlarm(row) {
      this.$refs.AlarmDealedModal.id = row.id
      this.$refs.AlarmDealedModal.open = true
      this.$refs.AlarmDealedModal.flag = true
      this.$refs.AlarmDealedModal.title = this.$t('deviceInfo.alarmContent.handleAlarm.title');
      this.$refs.AlarmDealedModal.add = false
    },
    goBack() {
      this.$router.go(-1)
    },
    //获取数据
    getList() {
      this.loading = true;
      if(this.$store.getters.permissions.indexOf('system:dept:query') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*')!==-1){
          getDept(this.deptId).then((res) => {
            this.deviceForm.deptName = res.data.deptName
          });
      }

      getAlarmInfo(this.queryParams).then((res) => {
        this.total = res.total;
        this.alarmInfoList = [];
        for (let item of res.rows) {
          let alarmTimeTemp = null;
          let dealTimeTemp = null;
          if (item.alarmTime !== null) {
            const alarmTimeArr = item.alarmTime.split("T", 2);
            alarmTimeTemp = alarmTimeArr[0] + " " + alarmTimeArr[1];
          }
          if (item.dealTime !== null) {
            const dealTimeArr = item.dealTime.split("T", 2);
            dealTimeTemp = dealTimeArr[0] + " " + dealTimeArr[1];
          }

          let temp = {
            id: item.id,
            deviceId: item.deviceId,
            alarmInfo: item.alarmInfo,
            alarmTime: alarmTimeTemp,
            dealed: item.dealed,
            dealTime: dealTimeTemp,
            opinion: item.opinion,
            deptId: item.deptId,
          };
          this.alarmInfoList.push(temp);
        }
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selection = selection;
    },
  },
}
</script>

