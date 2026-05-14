<template>
  <div class="app-container">
    <navbar />
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="40px">
          <el-form-item :label="$t('parseBeidou.search.ip')" prop="host"  >
            <el-input
              v-model="queryParams.host"
              :placeholder="$t('parseBeidou.search.tip1')"
              clearable
              size="small"
              style="width: 220px;"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('parseBeidou.search.port')" prop="port" label-width="80px">
            <el-input
              v-model="queryParams.port"
              :placeholder="$t('parseBeidou.search.tip2')"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('parseBeidou.search.mail')" prop="mailbox" label-width="160px">
            <el-input
              v-model="queryParams.mailbox"
              :placeholder="$t('parseBeidou.search.tip3')"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['beidou:page']"
                       @click="handleQuery">{{ $t('system.search') }}</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('system.reset') }}</el-button>
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
              v-hasPermi="['beidou:add']"
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
              v-hasPermi="['beidou:update']"
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
              v-hasPermi="['beidou:delete']"
            >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="bdList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column :label="$t('parseBeidou.table.ip')" align="center"  prop="host"  v-if="columns[0].visible"/>
          <el-table-column :label="$t('parseBeidou.table.port')" align="center"  prop="port" v-if="columns[1].visible"/>
          <el-table-column :label="$t('parseBeidou.table.mail')" align="center" prop="mailbox" v-if="columns[2].visible"/>
          <el-table-column :label="$t('parseBeidou.table.receiveWay')" align="center"  prop="way"  v-if="columns[3].visible"/>
          <el-table-column :label="$t('parseBeidou.table.messageInfo')" align="center" key="message" prop="message" v-if="columns[4].visible"/>
          <el-table-column :label="$t('parseBeidou.table.interval')" align="center" prop="timeCount"  v-if="columns[5].visible"/>
          <el-table-column :label="$t('parseBeidou.table.status')" align="center" prop="status" v-if="columns[6].visible">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value='0'
                :inactive-value='1'
                @change="handleStatusChange(scope.row)"
                :disabled="$store.getters.permissions.indexOf('yixing:mail:beidou:editbeidou')===-1 && $store.getters.permissions.indexOf('*:*:*')===-1 ? 0===0 :0!==0"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!--新增页面-->
    <BeidouAdd ref="BeidouAddModal" @ok="handleQuery"></BeidouAdd>
    <!--修改页面-->
    <BeidouUpdate ref="BeidouUpdateModal" @ok="handleQuery"></BeidouUpdate>
  </div>
</template>

<script>
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { getBeidouInfoCDWithNMsg, deleteBeidouInfo, updateBeidouInfo } from '@/api/mail/beidou'
    import BeidouAdd from "./module/BeidouAdd";
    import BeidouUpdate from "./module/BeidouUpdate";
    import { Navbar } from '@/layout/components'

    export default {
        name: 'BeidouInfo',
        components: {
            BeidouAdd,
            BeidouUpdate,
            Navbar
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
                bdList: [],
                // 列信息
                columns: [
                    { key: 0, label: `IP`, visible: true },
                    { key: 1, label: `端口`, visible: true },
                    { key: 2, label: `异常通知邮箱`, visible: true },
                    { key: 3, label: `接收方式`, visible: true },
                    { key: 4, label: `消息信息`, visible: true },
                    { key: 5, label: `消息间隔`, visible: true },
                    { key: 6, label: `状态`, visible: true }
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
                selection:[],
                // 总条数
                total: 0,
                // 是否查询
                isQuery:false,
            }
        },
        created() {
            this.queryParams.pageNum = 1
            this.getList();
        },
        methods: {

            //查询协议代码信息
            handleQuery() {
                this.queryParams.pageNum = 1
                this.queryParams.pageSize = 10
                this.isQuery = true
                this.getList()
            },
            //重置查询
            resetQuery() {
                this.resetForm('queryForm')
                this.handleQuery()
            },
            //添加处理
            handleAdd(row) {
                this.$refs.BeidouAddModal.form = {
                    id: undefined,
                    host: undefined,
                    password: undefined,
                    status: 0,
                    mailbox: undefined,
                    message: undefined,
                    port: undefined,
                    timeCount: undefined,
                    way: undefined,
                }
                this.$refs.BeidouAddModal.title = this.$t('parseBeidou.addAndEdit.add');
                this.$refs.BeidouAddModal.open = true
            },
            //修改处理
            handleUpdate(row) {
                let GliderID = row.id || this.ids
                this.$refs.BeidouUpdateModal.form = {
                    id: this.selection[0].id,
                    host: this.selection[0].host,
                    password: this.selection[0].password,
                    status: this.selection[0].status,
                    mailbox: this.selection[0].mailbox,
                    message: this.selection[0].message,
                    port: this.selection[0].port,
                    timeCount: Number(this.selection[0].timeCount.slice(0, -2)),
                    way: this.selection[0].way === 'ascii' ? 1:2,
                }
                this.$refs.BeidouUpdateModal.open = true
                this.$refs.BeidouUpdateModal.title = this.$t('parseBeidou.addAndEdit.edit');
            },
            //删除处理
            handleDelete(row) {
                const MailIds = row.id || this.ids
                let DeleteIds = [];
                this.selection.forEach(item=>{
                    DeleteIds.push(item.id);
                })
                this.$confirm('是否确认删除所选北斗设备?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    return deleteBeidouInfo(DeleteIds)
                }).then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
            },
            //获取数据
            getList() {
                this.loading = true;
                if(this.isQuery){
                  if(this.queryParams.host===""){
                    this.queryParams.host=undefined
                  }
                  if(this.queryParams.port===""){
                    this.queryParams.port=undefined
                  }
                  if(this.queryParams.mailbox===""){
                    this.queryParams.mailbox=undefined
                  }
                    getBeidouInfoCDWithNMsg(this.queryParams)
                        .then(res=>{
                            this.bdList=[];
                            for(let item of res.rows) {
                                let temp = {
                                    id: item.id,
                                    host: item.host,
                                    mailbox: item.mailbox,
                                    message: item.message,
                                    port: item.port,
                                    timeCount: item.timeCount + '分钟',
                                    way: item.way === 1?'ascii':'hex',
                                    password: item.password,
                                    status: Number(item.status),
                                };
                                this.bdList.push(temp);
                            }
                            this.loading = false
                            this.isQuery = false
                        })
                }
                else {
                    getBeidouInfoCDWithNMsg(this.queryParams).then(res => {
                        this.bdList = [];
                        for (let item of res.rows) {
                            let temp = {
                                id: item.id,
                                host: item.host,
                                mailbox: item.mailbox,
                                message: item.message,
                                port: item.port,
                                timeCount: item.timeCount + '分钟',
                                way: item.way===1?'ascii':'hex',
                                password: item.password,
                                status: Number(item.status),
                            };
                            this.bdList.push(temp);
                        }
                        this.loading = false;
                    });
                }
            },
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
                this.selection=selection;
            },
            handleStatusChange(row) {
                let text = row.status == 0 ? "使用" : "停用";
                this.$confirm('确认要' + text  + row.host + '吗?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return updateBeidouInfo({id: row.id, status: row.status});
                }).then(() => {
                    this.msgSuccess(text + "成功");
                    // this.handleQuery()
                }).catch(() => {
                    this.handleQuery()
                });
            }
        }
    }
</script>

<style scoped>
  .app-container{
    padding-top: 0%;
  }
</style>
