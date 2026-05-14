<template>
  <div class="app-container">
    <navbar />
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          v-show="showSearch"
          :inline="true"
          label-width="40px"
        >
          <el-form-item
            :label="$t('alarmAccount.contact')"
            prop="mailAddress"
            label-width="100px"
          >
            <el-input
              v-model="queryParams.mailAddress"
              :placeholder="$t('alarmAccount.tips')"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              v-hasPermi="['alarm:mailbox:page']"
              @click="handleQuery"
              >{{ $t('system.search') }}</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >{{ $t('system.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['alarm:mailbox:add']"
              >{{ $t('system.add') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['alarm:mailbox:update']"
              >{{ $t('system.edit') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['alarm:mailbox:delete']"
              >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="goodsList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            :label="$t('alarmAccount.contact')"
            align="center"
            prop="mailAddress"
            v-if="columns[0].visible"
          />
        <el-table-column
            :label="$t('alarmAccount.person')"
            align="center"
            prop="createBy"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!--新增页面-->
    <AlarmMailAdd ref="AlarmMailAddModal" @ok="handleQuery"></AlarmMailAdd>
    <!--修改页面-->
    <AlarmMailUpdate
      ref="AlarmMailUpdateModal"
      @ok="handleQuery"
    ></AlarmMailUpdate>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  DeleteAlarmEmail,
  getAlarmEmail,
  UpdateAlarmEmail,
} from "@/api/alarm/alarmemail";
import { Navbar } from "@/layout/components";
import AlarmMailAdd from "./module/AlarmMailAdd";
import AlarmMailUpdate from "./module/AlarmMailUpdate";

export default {
  name: "AlarmEmailInfo",
  components: {
    AlarmMailAdd,
    AlarmMailUpdate,
    Navbar,
  },
  data() {
    return {
      //搜索字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        host: undefined,
        inboxName: undefined,
        username: undefined,
      },
      goodsList: [],
      // 列信息
      columns: [
        { key: 0, label: `报警联系信息`, visible: true },

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
      // 是否查询
      isQuery: false,
    };
  },
  created() {
    this.queryParams.pageNum = 1;
    this.getList();
  },
  methods: {
    //查询协议代码信息
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.isQuery = true;
      this.getList();
    },
    //重置查询
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //添加处理
    handleAdd(row) {
      this.$refs.AlarmMailAddModal.form = {
        id: 0,
        mailAddress: undefined,
        status: 0,
      };
      this.$refs.AlarmMailAddModal.title = this.$t('alarmAccount.addAndEdit.add');
      this.$refs.AlarmMailAddModal.open = true;
    },
    //修改处理
    handleUpdate(row) {
      this.$refs.AlarmMailUpdateModal.form = {
        id: this.selection[0].id,
        delFlag: this.selection[0].delFlag,
        mailAddress: this.selection[0].mailAddress,
        status: String(this.selection[0].status),
        phone: this.selection[0].mailAddress,
      };
      this.$refs.AlarmMailUpdateModal.open = true;
      this.$refs.AlarmMailUpdateModal.title = this.$t('alarmAccount.addAndEdit.edit');

    },
    //删除处理
    handleDelete(row) {
      const MailIds = row.id || this.ids;
      let DeleteIds = [];
      this.selection.forEach((item) => {
        DeleteIds.push(item.id);
      });
      this.$confirm("是否确认删除所选报警联系信息?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return DeleteAlarmEmail(DeleteIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //获取数据
    getList() {
      this.loading = true;
      if (this.isQuery) {
        if (this.queryParams.mailAddress === "") {
          this.queryParams.mailAddress = undefined;
        }
        getAlarmEmail(this.queryParams).then((res) => {
          this.total = res.total;
          this.goodsList = [];
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              mailAddress: item.mailAddress,
              delFlag: item.delFlag,
              createTime: item.createTime,
              createBy: item.createBy,
              deptId: item.deptId,
              tenantId: item.tenantId,
              updateBy: item.updateBy,
              updateTime: item.updateTime,
              userId: item.userId,
              status: Number(item.status),
            };
            this.goodsList.push(temp);
          }
          this.loading = false;
          this.isQuery = false;
        });
      } else {
        getAlarmEmail(this.queryParams).then((res) => {
          this.total = res.total;
          this.goodsList = [];
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              mailAddress: item.mailAddress,
              delFlag: item.delFlag,
              createTime: item.createTime,
              createBy: item.createBy,
              deptId: item.deptId,
              tenantId: item.tenantId,
              updateBy: item.updateBy,
              updateTime: item.updateTime,
              userId: item.userId,
              status: Number(item.status),
            };
            this.goodsList.push(temp);
          }
          this.loading = false;
        });
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selection = selection;
    },
    handleStatusChange(row) {
      let text = row.status === 0 ? "使用" : "停用";
      this.$confirm("确认要" + text + row.mailAddress + "吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return UpdateAlarmEmail({ id: row.id, status: row.status });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
          // this.handleQuery()
        })
        .catch(() => {
          this.handleQuery();
        });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding-top: 0;
}
</style>
