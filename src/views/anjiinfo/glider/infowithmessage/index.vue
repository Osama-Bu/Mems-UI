<template>
  <div class="app-container">
    <navbar/>
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-page-header @back="goBack"/>
      </el-col>
      <el-col :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px"
            >{{$t('deviceInfo.form.deviceName')}}：{{ deviceForm.deviceName }}
            </el-tag>
          </el-col>
          <el-col :span="2.5">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.deviceId')}}：{{ deviceForm.cdId }}</el-tag>
          </el-col>
          <el-col :span="2.5" v-hasPermi="['system:dept:query']">
            <el-tag type="info" style="font-size: 20px">{{$t('deviceInfo.form.belong')}}：{{ deviceForm.deptName }}</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['msg-device:add']"
            >{{ $t('system.add') }}
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
              v-hasPermi="['msg-device:delete']"
            >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            :search="false"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="messageList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.msgName')"
            align="center"
            key="name"
            prop="name"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.byteSize')"
            align="center"
            key="bytesize"
            prop="bytesize"
            v-if="columns[1].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.isParse')"
            align="center"
            key="parsed"
            prop="parsed"
            v-if="columns[2].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.msgVersion')"
            align="center"
            key="version"
            prop="version"
            v-if="columns[3].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.isCopyMsg')"
            align="center"
            key="copied"
            prop="copied"
            width="150"
            v-if="columns[4].visible"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ $t('messageInfo.repeat.start') }}:{{ scope.row.copied === true ?
                  scope.row.copiedStartByte : $t('messageInfo.repeat.none') }}</p>
                <p>{{ $t('messageInfo.repeat.size') }}:{{ scope.row.copied === true ?
                  scope.row.copiedByteLen : $t('messageInfo.repeat.none') }}</p>
                <p>{{ $t('messageInfo.repeat.count') }}:{{ scope.row.copied === true ?
                  scope.row.copiedTimes : $t('messageInfo.repeat.none') }}</p>
                <div slot="reference">
                  <el-tag size="medium">
                    {{ scope.row.copied === true ? $t('system.true') : $t('system.false') }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.bandingMessage.operate.label')"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            v-if="columns[5].visible && operation"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleSelect(scope.row)"
              >{{ $t('deviceInfo.bandingMessage.operate.detail') }}
              </el-button>
            </template>
          </el-table-column>
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
    <!-- 新增页面 -->
    <GliderWithMessageAdd
      ref="GliderWithMessageAddModal"
      @ok="handleQuery"
    ></GliderWithMessageAdd>
    <!-- 查看协议详情 -->
    <MessageSelectDetail ref="MessageSelectDetail"></MessageSelectDetail>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { deleteDeviceInfoWithMessage, getDeviceInfoWithMessage } from '@/api/device/device'
import { Navbar } from '@/layout/components'
import GliderWithMessageAdd from './module/GliderWithMessageAdd'
import MessageSelectDetail from './module/MessageSelectDetail'
import { getDept } from '@/api/system/dept'

export default {
  name: 'GliderWithMessage',
  components: {
    MessageSelectDetail,
    GliderWithMessageAdd,
    Navbar
  },
  data() {
    return {
      deptId: undefined,
      // 操作列显示隐藏
      operation: true,
      deviceForm: {
        deviceName: undefined,
        cdId: undefined,
        deptName: undefined,
        deviceId: undefined
      },
      //搜索字段
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: undefined
      },
      messageList: [],
      // 列信息
      columns: [
        { key: 0, label: `协议名称`, visible: true },
        { key: 1, label: `字节长度`, visible: true },
        { key: 2, label: `已解析`, visible: true },
        { key: 3, label: `协议版本`, visible: true },
        { key: 4, label: `是否为重复协议`, visible: true },
        { key: 5, label: `操作`, visible: true }
      ],
      // 遮罩层
      // loading: true,
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 选中数组
      ids: [],
      //选中数据
      selection: [],
      // 总条数
      total: 0
    }
  },
  mounted() {
    this.operation = this.$store.getters.permissions.indexOf('msg:detail') !== -1 ||
      this.$store.getters.permissions.indexOf('*:*:*') !== -1
  },
  created() {
    this.queryParams.pageNum = 1
    this.queryParams.deviceId = Number(this.$route.query.deviceId)
    this.deptId = this.$route.query.deptId
    this.deviceForm.deviceName = this.$route.query.deviceName
    this.deviceForm.cdId = this.$route.query.cdId
    this.deviceForm.deviceId = Number(this.$route.query.deviceId)
    this.getList()
  },
  methods: {
    //查询协议信息
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    // 新增绑定
    handleAdd() {
      this.$refs.GliderWithMessageAddModal.form = {
        deviceId: this.deviceForm.deviceId,
        main: 0
      }
      this.$refs.GliderWithMessageAddModal.title = '【' + this.deviceForm.deviceName + '】'
        + this.$t('deviceInfo.bandingMessage.addBanding.title');
      this.$refs.GliderWithMessageAddModal.open = true
    },
    // 删除绑定
    handleDelete(row) {
      let queryParam = {
        msgIdList: row.id || this.ids,
        deviceId: this.deviceForm.deviceId
      }
      let String = '是否确认删除所选【' + this.deviceForm.deviceName + '】绑定协议?'
      this.$confirm(String, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteDeviceInfoWithMessage(queryParam)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    //获取数据
    getList() {
      this.loading = true
      if (this.$store.getters.permissions.indexOf('system:dept:query') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        getDept(this.deptId).then((response) => {
          this.deviceForm.deptName = response.data.deptName
        })
      }
      // 查询该设备绑定的协议列表
      getDeviceInfoWithMessage(this.queryParams).then((res) => {
        this.total = res.total
        this.messageList = []
        if (res.rows !== null) {
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              bytesize: item.bytesize,
              copied: item.copied,
              copiedByteLen: item.copiedByteLen,
              copiedStartByte: item.copiedStartByte,
              copiedTimes: item.copiedTimes,
              createBy: item.createBy,
              createTime: item.createTime,
              delFlag: item.delFlag,
              deptId: item.deptId,
              name: item.name,
              parsed: item.parsed ? this.$t('system.true') : this.$t('system.false'),
              status: item.status,
              tenantId: item.tenantId,
              updateBy: item.updateBy,
              updateTime: item.updateTime,
              userId: item.userId,
              version: item.version
            }
            this.messageList.push(temp)
          }
        }
        this.loading = false
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.selection = selection
    },
    // 查看详情
    handleSelect(row) {
      this.$refs.MessageSelectDetail.title = row.name
      this.$refs.MessageSelectDetail.open = true
      this.$refs.MessageSelectDetail.getList(row.id)
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.app-container {
  padding-top: 0;
}
</style>
