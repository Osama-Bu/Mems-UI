<template>
  <div class="app-container">
    <navbar/>
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          v-show="showSearch"
          :inline="true"
          label-width="120px"
        >
          <el-form-item :label="$t('messageInfo.search.msgName')" prop="name">
            <el-input
              v-model="queryParams.name"
              :placeholder="$t('messageInfo.search.tip1')"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('messageInfo.search.byteSize')" prop="byteSize">
            <el-input
              v-model="queryParams.byteSize"
              :placeholder="$t('messageInfo.search.tip2')"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item :label="$t('messageInfo.search.parse')" prop="parsed">
            <el-select
              v-model="queryParams.parsed"
              :placeholder="$t('messageInfo.search.tip3')"
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
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >{{ $t('system.search') }}
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >{{ $t('system.reset') }}
            </el-button>
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
              v-hasPermi="['msg:add']"
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
              v-hasPermi="['msg:update']"
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
              v-hasPermi="['msg:delete']"
            >{{ $t('system.delete') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              @click="exportExcel"
              size="mini"
              v-hasPermi="['msg:export']"
            >{{ $t('messageInfo.button.export') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              @click="toggleProtocolType"
              size="mini"
              v-hasPermi="['msg:page:multiple']"
            >
              {{ protocolType === 'normal' ? $t('messageInfo.button.common') : $t('messageInfo.button.multiBelong') }}
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
          :data="messageList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="70" align="center"/>
          <el-table-column
            :label="$t('messageInfo.table.msgName')"
            align="center"
            key="name"
            prop="name"
            width="180"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('messageInfo.table.msgVersion')"
            align="center"
            key="version"
            prop="version"
            v-if="columns[1].visible"
          />
          <el-table-column
            :label="$t('messageInfo.table.isParse')"
            align="center"
            key="parsed"
            prop="parsed"
            v-if="columns[2].visible"
          />
          <el-table-column
            :label="$t('messageInfo.table.byteSize')"
            align="center"
            key="byteSize"
            prop="byteSize"
            v-if="columns[3].visible"
          />
          <el-table-column
            :label="$t('messageInfo.table.msgStatus')"
            align="center"
            key="status"
            prop="status"
            v-if="columns[4].visible"
          >
            <template slot-scope="scope">
              <div slot="reference">
                <el-tag size="medium">
                  {{ scope.row.status === '0' ? $t('system.statusNormal') : $t('system.statusStop') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('messageInfo.table.isCopyMsg')"
            align="center"
            key="copied"
            prop="copied"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>
                  {{ $t('messageInfo.repeat.start') }}:{{
                    scope.row.copied === true ? scope.row.copiedStartByte : $t('messageInfo.repeat.none')
                  }}
                </p>
                <p>
                  {{ $t('messageInfo.repeat.size') }}:{{
                    scope.row.copied === true ? scope.row.copiedByteLen : $t('messageInfo.repeat.none')
                  }}
                </p>
                <p>
                  {{ $t('messageInfo.repeat.count') }}:{{
                    scope.row.copied === true ? scope.row.copiedTimes : $t('messageInfo.repeat.none')
                  }}
                </p>
                <div slot="reference">
                  <el-tag size="medium">
                    {{ scope.row.copied === true ? $t('system.true') : $t('system.false') }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            class-name="small-padding fixed-width"
            v-if="operation && columns[7].visible"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleSelect(scope.row)"
              >{{ $t('messageInfo.table.operate.detail') }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('messageInfo.table.banding.label')"
            align="center"
            class-name="small-padding fixed-width"
            v-if="operation && columns[6].visible"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                v-hasPermi="['msg-device:device:page']"
                @click="handleDeviceBanding(scope.row)"
              >{{ $t('messageInfo.table.banding.detail') }}
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
    <!--    新增页面-->
    <MessageAdd ref="MessageAddModal" @ok="handleQuery"></MessageAdd>
    <!--    查看详情-->
    <MessageSelectDetail ref="MessageSelectDetail"></MessageSelectDetail>
    <MessageGliderDetail ref="MessageGliderDetail"></MessageGliderDetail>
    <!--    修改页面-->
    <MessageModify ref="MessageModify" @ok="handleQuery"></MessageModify>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMessageInfo, deleteMessageInfo, updateMessageInfo, getMultiple, getMsgItemsByMsgId } from '@/api/message/message'
import MessageAdd from './module/MessageAdd'
import { Navbar } from '@/layout/components'
import MessageModify from './module/MessageModify'
import MessageSelectDetail from './module/MessageSelectDetail'
import MessageGliderDetail from '@/views/anjiinfo/message/info/module/MessageGliderDetail.vue'
import XLSXS from 'xlsx-style'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

export default {
  name: 'MessageInfo',
  components: {
    Navbar,
    MessageAdd,
    MessageSelectDetail,
    MessageGliderDetail,
    MessageModify
  },
  data() {
    return {
      // 操作列显示隐藏
      operation: true,
      //搜索字段
      propertyOptions: [
        {
          value: 1,
          label: this.$t('messageInfo.search.isParse')
        },
        {
          value: 0,
          label: this.$t('messageInfo.search.notParse')
        }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        byteSize: undefined,
        status: undefined,
        parsed: undefined
      },
      messageList: [
        {
          id: 1,
          belong: '',
          name: '【协议B-1】75字节',
          version: '1.0',
          parsed: '否',
          byteSize: 276,
          status: '正常',
          copied: '否'
        }
      ],
      // 协议项信息
      messageItemList: [],
      // 列信息
      columns: [
        { key: 0, label: `协议名称`, visible: true },
        { key: 1, label: `协议版本`, visible: true },
        { key: 2, label: `已解析`, visible: true },
        { key: 3, label: `协议长度`, visible: true },
        { key: 4, label: `协议状态`, visible: true },
        { key: 5, label: `是否为重复报文`, visible: true },
        { key: 6, label: `绑定设备ID`, visible: true },
        { key: 7, label: `操作`, visible: true }
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
      belongToMsgIdList: [],
      //选中数据
      selection: [],
      // 存储导出excel的名称
      fileName: '',
      // 总条数
      total: 0,
      // 是否查询
      isQuery: false,
      //协议切换类型
      protocolType: 'normal'
    }
  },
  mounted() {

    if (this.$store.getters.permissions.indexOf('msg:detail') !== -1 ||
      this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
      this.operation = true
    } else {
      this.operation = false
    }
    if (
      this.$store.getters.permissions.indexOf('msg-device:device:page') !== -1 ||
      this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
      this.columns[6].visible = true
    } else {
      this.columns[6].visible = false
    }
  },
  created() {
    this.queryParams.pageNum = 1
    this.queryParams.pageSize = 10
    this.isQuery = false
    this.getList()
  },
  methods: {
    //协议切换按钮
    toggleProtocolType() {
      this.queryParams.pageNum = 1
      this.protocolType = this.protocolType === 'normal' ? 'multi' : 'normal'
      if (this.protocolType === 'normal') {
        this.getList()
      } else {
        this.getmultist()
      }
    },
    // 计算单元格列宽函数
    getCellWidth(value) {
      // 判断是否为null或undefined
      if (value == null) {
        return 10
      } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        // 中文的长度
        const chineseLength = value.match(/[\u4e00-\u9fa5]/g).length
        // 其他不是中文的长度
        const otherLength = value.length - chineseLength
        return chineseLength * 2.1 + otherLength * 1.1
      } else {
        return value.toString().length * 1.1
      }
    },

    // 一键导出所有选中文件的Excel
    async exportExcel() {
      if (this.ids.length === 0) {
        this.$message.error('请选中协议后再导出');
        return;
      }

      this.loading = true;
      try {
        // 并行获取所有协议详情
        const exportPromises = this.ids.map(async (id) => {
          const message = this.messageList.find(msg => msg.id === id);
          if (!message) {
            console.warn(`未找到ID为 ${id} 的协议`);
            return null;
          }

          try {
            const msgItemList = await this.getMsgItem(id);
            return {
              id: message.id,
              name: message.name,
              msgItemList
            };
          } catch (error) {
            console.error(`获取协议详情失败 ID: ${id}`, error);
            return null;
          }
        });

        const messageAndItemList = (await Promise.all(exportPromises)).filter(item => item !== null);

        if (messageAndItemList.length === 0) {
          this.$message.error('没有可导出的有效数据');
          return;
        }

        // 批量导出所有选中的文件
        for (const item of messageAndItemList) {
          this.messageItemList = item.msgItemList;
          this.fileName = item.name;
          await this.exportToExcel();
        }

        this.$message.success(`成功导出 ${messageAndItemList.length} 个文件`);

      } catch (error) {
        console.error('导出过程发生错误:', error);
        this.$message.error('导出失败，请重试');
      } finally {
        this.loading = false;
      }
    },

    // 获取消息项详情
    async getMsgItem(id) {
      const res = await getMsgItemsByMsgId(id);
      if (res.code !== 200) {
        throw new Error('获取数据失败，请重新链接');
      }
      return res.data;
    },

    // 导出Excel
    exportToExcel() {
      const fields = [
        { key: 'name', header: '英文名' },
        { key: 'content', header: '中文名' },
        { key: 'description', header: '描述' },
        { key: 'lengthByte', header: '协议长度' },
        { key: 'dataType', header: '数据类型' },
        { key: 'startByte', header: '起始位置' },
        { key: 'orderme', header: '导出顺序' },
        { key: 'decimalPlace', header: '精度' },
        { key: 'divUnit', header: '单位' },
        { key: 'isExport', header: '是否导出' }
      ];

      // 计算列宽（优化性能）
      const colWidths = this.calculateColumnWidths(this.messageItemList, fields);

      // 准备数据
      const header = fields.map(field => field.header);
      const filteredData = this.messageItemList.map(item =>
        fields.reduce((acc, field) => {
          if (item.hasOwnProperty(field.key)) {
            acc[field.header] = item[field.key];
          }
          return acc;
        }, {})
      );

      // 创建工作表和工作簿
      const ws = XLSX.utils.json_to_sheet(filteredData, { header });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '协议项');

      // 设置样式和列宽
      this.applyWorksheetStyles(ws, colWidths);

      // 导出文件
      const fileName = `${this.fileName}.xlsx`;

      // 导出Excel, 注意这里用到的是XLSXS对象
      let wbout = XLSXS.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      })
      FileSaver.saveAs(
        new Blob([this.$options.methods.s2ab(wbout)], {
          type: 'application/octet-stream'
        }),
        fileName
      )
    },

    // 计算列宽
    calculateColumnWidths(messageItemList, fields) {
      // 只计算需要自适应宽度的列
      const autoWidthFields = ['name', 'content', 'description'];
      const widths = {};

      autoWidthFields.forEach(fieldKey => {
        const maxWidth = messageItemList.reduce((max, item) => {
          const value = item[fieldKey] || '';
          const width = this.getCellWidth(String(value));
          return Math.max(max, width);
        }, 0);
        widths[fieldKey] = maxWidth * 10; // 转换为像素宽度
      });

      return widths;
    },

    // 应用工作表样式
    applyWorksheetStyles(ws, colWidths) {
      // 设置列宽
      ws['!cols'] = [
        { wpx: colWidths.name || 100 },
        { wpx: colWidths.content || 100 },
        { wpx: colWidths.description || 100 }
        // 其他列使用默认宽度
      ];

      // 设置单元格样式
      Object.keys(ws).forEach(key => {
        if (!key.includes('!')) {
          ws[key].s = {
            font: {
              name: '宋体',
              sz: 12
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true
            }
          };
        }
      });
    },
    // 导出excel工具函数
    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    },
    //重置表单信息
    reset(MessageID, parsed) {
      this.$refs.MessageAddModal.form = {
        id: MessageID,
        name: undefined,
        version: '1.0',
        byteSize: undefined,
        parsed: parsed,
        status: undefined
      }
      this.$refs.MessageAddModal.resetForm('form')
    },
    //查询协议代码信息
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.isQuery = true
      if (this.protocolType === 'normal') {
        this.getList()
      } else if (this.protocolType === 'multi') {
        this.getmultist()
      }
    },

    //重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    //添加处理
    handleAdd(row) {
      this.reset(0, 0)
      this.$refs.MessageAddModal.flag = true
      this.$refs.MessageAddModal.title = this.$t('messageInfo.addAndEdit.add')
      this.$refs.MessageAddModal.open = true
      this.$refs.MessageAddModal.add = true
      this.$refs.MessageAddModal.initForm()
      this.$refs.MessageAddModal.init()
    },

    //查看详情
    handleSelect(row) {
      if (this.protocolType === 'normal') {
        this.$refs.MessageSelectDetail.type = 1
      } else if (this.protocolType === 'multi') {
        this.$refs.MessageSelectDetail.type = 0
      }
      this.$refs.MessageSelectDetail.flag = true
      this.$refs.MessageSelectDetail.title = row.name
      this.$refs.MessageSelectDetail.ParsedForm.name = row.name
      this.$refs.MessageSelectDetail.ParsedForm.deptId = row.deptId
      this.$refs.MessageSelectDetail.open = true
      this.$refs.MessageSelectDetail.add = true
      this.$refs.MessageSelectDetail.getList(row.id)
    },

    // 查看设备绑定情况
    handleDeviceBanding(row) {
      this.$refs.MessageGliderDetail.getDeptName(row.deptId[0])
      this.$refs.MessageGliderDetail.getList(row.id)
      this.$refs.MessageGliderDetail.init()
      this.$refs.MessageGliderDetail.title = row.name
      this.$refs.MessageGliderDetail.open = true
    },
    //修改处理
    handleUpdate() {
      let messageID = this.ids[0]
      if (this.selection[0].version === '0.0') {
        this.$message({
          message: '该协议不支持修改',
          type: 'warning'
        })
      } else {
        this.$refs.MessageModify.form = {
          id: messageID,
          name: this.selection[0].name,
          deptId: this.selection[0].deptId[0],
          version: this.selection[0].version,
          byteSize: Number(this.selection[0].byteSize),
          parsed: this.selection[0].parsed === this.$t('system.false') ? 0 : 1,
          copied: this.selection[0].copied,
          copiedStartByte: this.selection[0].copiedStartByte,
          copiedByteLen: this.selection[0].copiedByteLen,
          copiedTimes: this.selection[0].copiedTimes,
          status: this.selection[0].status
        }
        this.$refs.MessageModify.msgId = messageID
        this.$refs.MessageModify.open = true
        this.$refs.MessageModify.flag = true
        this.$refs.MessageModify.title = this.$t('messageInfo.addAndEdit.edit')
        this.$refs.MessageModify.add = false
        this.$refs.MessageModify.init()
        // })
      }
    },

    //删除处理
    handleDelete(row) {
      const msgId = row.id || this.belongToMsgIdList
      this.$confirm('是否确认删除所选数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          for (let item of msgId) {
            return deleteMessageInfo(item)
          }
        })
        .then(() => {
          this.queryParams.pageNum = 1
          this.getList()
          this.msgSuccess('删除成功')
          this.$emit('ok', '')
        })
    },
    //获取数据
    getList() {
      this.loading = true
      if (this.isQuery) {
        if (this.queryParams.name === '') {
          this.queryParams.name = undefined
        }
        if (this.queryParams.byteSize === '') {
          this.queryParams.byteSize = undefined
        }
        if (this.queryParams.status === '') {
          this.queryParams.status = undefined
        }
        if (this.queryParams.parsed === '') {
          this.queryParams.parsed = undefined
        }
        getMessageInfo(this.queryParams).then((res) => {
          this.total = res.total
          this.messageList = []

          for (let item of res.rows) {
            let temp = {
              id: item.id,
              deptId: item.deptId,
              name: item.name,
              version: item.version,
              parsed: item.parsed ? this.$t('system.true') : this.$t('system.false'),
              byteSize: item.byteSize ? item.byteSize : this.$t('system.none'),
              // 状态（0正常 1停用）
              status: item.status,
              copied: item.copied,
              copiedStartByte: item.copiedStartByte,
              copiedByteLen: item.copiedByteLen,
              copiedTimes: item.copiedTimes,
              belongToMsgIdList: item.belongToMsgIdList
            }
            this.messageList.push(temp)
          }
          // }
          this.loading = false
          this.isQuery = false
        })
      } else {
        getMessageInfo(this.queryParams).then((res) => {
          this.total = res.total
          this.messageList = []

          for (let item of res.rows) {
            let temp = {
              id: item.id,
              deptId: item.deptId,
              name: item.name,
              version: item.version,
              parsed: item.parsed ? this.$t('system.true') : this.$t('system.false'),
              byteSize: item.byteSize ? item.byteSize : this.$t('system.none'),
              // 状态（0正常 1停用）
              status: item.status,
              copied: item.copied,
              copiedStartByte: item.copiedStartByte,
              copiedByteLen: item.copiedByteLen,
              copiedTimes: item.copiedTimes,
              belongToMsgIdList: item.belongToMsgIdList
            }
            this.messageList.push(temp)
          }
          this.loading = false
        })
      }
    },
    //多所属协议
    getmultist() {
      this.loading = true
      if (this.isQuery) {
        if (this.queryParams.name === '') {
          this.queryParams.name = undefined
        }
        if (this.queryParams.byteSize === '') {
          this.queryParams.byteSize = undefined
        }
        if (this.queryParams.status === '') {
          this.queryParams.status = undefined
        }
        if (this.queryParams.parsed === '') {
          this.queryParams.parsed = undefined
        }
        getMultiple(this.queryParams).then((res) => {
          this.total = res.total
          this.messageList = []

          for (let item of res.rows) {
            let temp = {
              id: item.id,
              deptId: item.deptId,
              name: item.name,
              version: item.version,
              parsed: item.parsed ? this.$t('system.true') : this.$t('system.false'),
              byteSize: item.byteSize ? item.byteSize : this.$t('system.none'),
              // 状态（0正常 1停用）
              status: item.status,
              copied: item.copied,
              copiedStartByte: item.copiedStartByte,
              copiedByteLen: item.copiedByteLen,
              copiedTimes: item.copiedTimes,
              belongToMsgIdList: item.belongToMsgIdList
            }
            this.messageList.push(temp)
          }
          // }
          this.loading = false
          this.isQuery = false
        })
      } else {
        getMultiple(this.queryParams).then((res) => {
          this.total = res.total
          this.messageList = []

          for (let item of res.rows) {
            let temp = {
              id: item.id,
              deptId: item.deptId,
              name: item.name,
              version: item.version,
              parsed: item.parsed ? this.$t('system.true') : this.$t('system.false'),
              byteSize: item.byteSize ? item.byteSize : this.$t('system.none'),
              // 状态（0正常 1停用）
              status: item.status,
              copied: item.copied,
              copiedStartByte: item.copiedStartByte,
              copiedByteLen: item.copiedByteLen,
              copiedTimes: item.copiedTimes,
              belongToMsgIdList: item.belongToMsgIdList
            }
            this.messageList.push(temp)
          }
          this.loading = false
        })
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.belongToMsgIdList = selection.map((item) => item.belongToMsgIdList)
      this.names = selection.map((item) => item.name)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.selection = selection
    }
  }
}
</script>

<style scoped>
.app-container {
  padding-top: 0;
}
</style>
