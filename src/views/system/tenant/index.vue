<template>
  <div class="app-container">
    <navbar />
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="120px">
          <!-- <el-form-item label="租户ID" prop="id">
            <el-input
              v-model="queryParams.id"
              placeholder="请输入租户ID"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item :label="$t('systemManage.tenant.tenantName')" prop="tenantName">
            <el-input
              v-model="queryParams.tenantName"
              :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.tenant.tenantName')"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
            <el-form-item :label="$t('systemManage.tenant.remark')" prop="remark">
              <el-input
                v-model="queryParams.remark"
                :placeholder="$t('system.pleaseEnter')+ ' '+ $t('systemManage.tenant.remark')"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('system.search') }}</el-button>
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
              v-hasPermi="['system:node:add']"
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
              v-hasPermi="['system:node:edit']"
            >{{ $t('system.edit') }}
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="goodsList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center"/>
          <!-- <el-table-column label="租户ID" align="center" key="id" prop="id" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"
          /> -->
          <el-table-column :label="$t('systemManage.tenant.tenantName')" align="center" key="tenantName" prop="tenantName"  v-if="columns[2].visible"/>
          <el-table-column :label="$t('systemManage.tenant.remark')" align="center" key="remark" prop="remark"  v-if="columns[3].visible"/>
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

    <!--  新增页面  -->
    <TenantAdd ref="TenantAddModal" @ok="handleQuery"></TenantAdd>
    <!--  修改页面  -->
    <TenantUpdate ref="TenantUpdateModal" @ok="handleQuery"></TenantUpdate>

  </div>
</template>

<script>
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { getTenantInfo } from '@/api/tenant/tenant'
    import { Navbar } from '@/layout/components'
    import TenantAdd from "./module/TenantAdd";
    import TenantUpdate from "./module/TenantUpdate";

    export default {
        name: 'index',
        components: {
            Navbar,
            TenantAdd,
            TenantUpdate
        },
        data() {
            return {
                //搜索字段
                queryParams: {
                    pageNum: -1,
                    pageSize: 10,
                    id: undefined,
                    tenantName: undefined,
                    remark:undefined
                },
                goodsList: [],
                // 列信息
                columns: [
                    { key: 0, label: ``, visible: true },
                    { key: 1, label: `租户ID`, visible: true },
                    { key: 2, label: `租户名称`, visible: true },
                    { key: 3, label: `备注`, visible: true },
                ],
                // 遮罩层
                // loading: true,
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
            this.queryParams.pageNum = -1
            this.isQuery = false
            this.getList();
        },
        methods: {
            //重置表单信息
            reset(form) {
                this.$refs.TenantAddModal.form = form
                this.$refs.TenantAddModal.resetForm("form");
            },
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
                let form = {
                    // id: 0,
                    tenantName: undefined,
                    remark: undefined,
                }
                this.$refs.TenantAddModal.form = form
                this.$refs.TenantAddModal.title = this.$t('systemManage.tenant.addTitle');
                this.$refs.TenantAddModal.open = true
            },
            //修改处理
            handleUpdate() {
                let form = {
                    id: this.selection[0].id,
                    tenantName: this.selection[0].tenantName,
                    remark: this.selection[0].remark,
                }
                this.$refs.TenantUpdateModal.form = form
                this.$refs.TenantUpdateModal.title = this.$t('systemManage.tenant.editTitle');
                this.$refs.TenantUpdateModal.open = true
            },
            //获取数据
            getList() {
                this.loading = true;
                if(this.isQuery){
                    getTenantInfo(this.queryParams).then(res => {
                        this.total = res.total;
                        this.goodsList = [];

                        for (let item of res.rows) {
                            let temp = {
                                id: item.id,
                                tenantName: item.tenantName,
                                remark: item.remark
                            }
                            this.goodsList.push(temp)
                        }

                        this.loading = false;
                        this.isQuery = false
                    });
                }
                else {
                    const data = {
                        pageNum: -1,
                        pageSize: 10
                    }

                    getTenantInfo(data).then(res => {
                        this.total = res.total;
                        this.goodsList = [];

                        for (let item of res.rows) {
                            let temp = {
                                id: item.id,
                                tenantName: item.tenantName,
                                remark: item.remark
                            }
                            this.goodsList.push(temp)
                        }

                            this.loading = false;
                        });
                }
            },
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
                this.selection= selection;
            },
        }
    }
</script>

<style scoped>
  .app-container{
    padding-top: 0%;
  }
</style>
