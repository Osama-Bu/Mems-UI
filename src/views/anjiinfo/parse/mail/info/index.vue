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
          label-width="120px"
        >
          <el-form-item :label="$t('parseMail.search.mailServer')" prop="host">
            <el-input
              v-model="queryParams.host"
              :placeholder="$t('parseMail.search.tip1')"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('parseMail.search.mailBox')" prop="inboxName">
            <el-input
              v-model="queryParams.inboxName"
              :placeholder="$t('parseMail.search.tip2')"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('parseMail.search.mail')" prop="username">
            <el-input
              v-model="queryParams.username"
              :placeholder="$t('parseMail.search.tip3')"
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
              v-hasPermi="['mailbox:page']"
              @click="handleQuery"
              >{{ $t('system.search') }}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >{{ $t('system.reset') }}</el-button
            >
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
              v-hasPermi="['mailbox:add']"
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
              v-hasPermi="['mailbox:add']"
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
              v-hasPermi="['mailbox:delete']"
              >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh-right"
              size="mini"
              @click="handleReparse"
              v-hasPermi="['mailbox:reparse']"
              >{{ $t('parseMail.button.reParse') }}
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
          :data="mailList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center" />

          <el-table-column
            :label="$t('parseMail.table.mail')"
            align="center"
            key="username"
            prop="username"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('parseMail.table.mailBox')"
            align="center"
            key="inboxName"
            prop="inboxName"
            v-if="columns[1].visible"
          />
          <el-table-column
            :label="$t('parseMail.table.mailServer')"
            align="center"
            key="host"
            prop="host"
            v-if="columns[2].visible"
          />
          <el-table-column
            :label="$t('parseMail.table.protocol')"
            align="center"
            key="protocol"
            prop="protocol"
            v-if="columns[3].visible"
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
    <!--   新增页面    -->
    <MailAdd ref="MailAddModal" @ok="handleQuery"></MailAdd>
    <MailReparse ref="MailReparse"></MailReparse>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getMailInfoCDWithNMsg, deleteMailInfo } from "@/api/mail/mail";
import MailAdd from "./module/MailAdd";
import MailReparse from "./module/MailReparse";
import { Navbar } from "@/layout/components";

export default {
  name: "MailInfo",
  components: {
    MailAdd,
    Navbar,
    MailReparse
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
      mailList: [
        {
          id: 0,
          host: "host",
          inboxName: "inboxName",
          password: "string",
          protocol: "string",
          status: "string",
          username: "string",
        },
        {
          id: 1,
          host: "host",
          inboxName: "inboxName",
          password: "string",
          protocol: "string",
          status: "string",
          username: "string",
        },
      ],
      // 列信息
      columns: [
        { key: 0, label: `邮箱号`, visible: true },
        { key: 1, label: `收件箱名称`, visible: true },
        { key: 2, label: `邮箱服务器`, visible: true },
        { key: 3, label: `协议`, visible: true },
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
      this.$refs.MailAddModal.form = {
        id: undefined,
        host: undefined,
        inboxName: undefined,
        password: undefined,
        protocol: "imaps",
        status: 0,
        username: undefined,
      };
      this.$refs.MailAddModal.flag = true;
      this.$refs.MailAddModal.title = this.$t('parseMail.addAndEdit.add');
      this.$refs.MailAddModal.open = true;
      this.$refs.MailAddModal.add = true;
      this.$refs.MailAddModal.disAble = false;
    },
    //修改处理
    handleUpdate(row) {
      let GliderID = row.id || this.ids;
      this.$refs.MailAddModal.form = {
        id: this.selection[0].id,
        host: this.selection[0].host,
        inboxName: this.selection[0].inboxName,
        password: this.selection[0].password,
        protocol: this.selection[0].protocol,
        status: this.selection[0].status,
        username: this.selection[0].username,
      };
      this.$refs.MailAddModal.open = true;
      this.$refs.MailAddModal.flag = true;
      this.$refs.MailAddModal.title = this.$t('parseMail.addAndEdit.edit');
      this.$refs.MailAddModal.add = false;
      this.$refs.MailAddModal.disAble = true;
    },
    //删除处理
    handleDelete(row) {
      const MailIds = row.id || this.ids;
      let DeleteIds = [];
      this.selection.forEach((item) => {
        DeleteIds.push(item.id);
      });
      this.$confirm("是否确认删除所选邮箱数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteMailInfo(DeleteIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //邮箱重解析
    handleReparse(row) {
      this.$refs.MailReparse.title = this.$t('parseMail.reParse.title');
      this.$refs.MailReparse.open = true;
    },
    //获取数据
    getList() {
      this.loading = true;
      if (this.isQuery) {
        if(this.queryParams.host===""){
          this.queryParams.host=undefined
        }
        if(this.queryParams.inboxName===""){
          this.queryParams.inboxName=undefined
        }
        if(this.queryParams.username===""){
          this.queryParams.username=undefined
        }
        getMailInfoCDWithNMsg(this.queryParams).then((res) => {
          this.mailList = [];
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              host: item.host,
              inboxName: item.inboxName,
              password: item.password,
              protocol: item.protocol,
              status: item.status == 0 ? "正常" : "停用",
              username: item.username,
            };
            this.mailList.push(temp);
          }
          this.loading = false;
          this.isQuery = false;
        });
      } else {
        getMailInfoCDWithNMsg(this.queryParams).then((res) => {
          this.mailList = [];
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              host: item.host,
              inboxName: item.inboxName,
              password: item.password,
              protocol: item.protocol,
              status: item.status == 0 ? "正常" : "停用",
              username: item.username,
            };
            this.mailList.push(temp);
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
  },
};
</script>

<style scoped>
.app-container {
  padding-top: 0;
}
</style>
