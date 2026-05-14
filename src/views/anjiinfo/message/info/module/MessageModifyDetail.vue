<template>
  <div class="app-container message">
    <!-- 修改协议项配置对话框-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :before-close="cancel"
      width="1250px"
      append-to-body
    >
      <el-steps
        :active="2"
        align-center
        style="margin-bottom: 20px; display: flex; justify-content: center"
        space="300px"
      >
        <el-step :title="$t('messageInfo.addAndEdit.editStep1')" :description="$t('messageInfo.addAndEdit.status3')"></el-step>
        <el-step :title="$t('messageInfo.addAndEdit.editStep2')" :description="$t('messageInfo.addAndEdit.status1')"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('messageInfo.addAndEdit.item.model')">
          <el-select
            v-model="templateId"
            :disabled="templateFlag"
            filterable
            @change="idChanged()"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-checkbox
            v-model="messageInfo.copied"
            :disabled="templateFlag"
            style="margin-left: 20px"
          >{{ $t('messageInfo.addAndEdit.item.repeat') }}
          </el-checkbox
          >
          <span class="message-info" style="margin-left: 20px"
          >{{ $t('messageInfo.addAndEdit.item.start') }}:<el-input
            :disabled="!messageInfo.copied"
            v-model="messageInfo.copiedStartByte"
            style="width: 50px"
          /></span>
          <span class="message-info" style="margin-left: 20px"
          >{{ $t('messageInfo.addAndEdit.item.size') }}:<el-input
            :disabled="!messageInfo.copied"
            v-model="messageInfo.copiedByteLen"
            style="width: 50px"
          /></span>
          <span class="message-info" style="margin-left: 20px"
          >{{ $t('messageInfo.addAndEdit.item.count') }}:<el-input
            :disabled="!messageInfo.copied"
            v-model="messageInfo.copiedTimes"
            style="width: 50px"
          /></span>

          <div style="float: right">
            <span>{{ $t('messageInfo.addAndEdit.item.tips') }}</span>
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit"
              :disabled="templateFlag"
              @click="addRow(-1)"
            >{{ $t('messageInfo.addAndEdit.item.add') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="message-modify">
        <label for="excelUpload">{{ $t('messageInfo.addAndEdit.item.parseModel') }}：</label>
        <input id="excelUpload" type="file" @change="handleFileUpload" accept=".xlsx,.xls"/>
        <el-button type="success" @click="exportToExcel">{{ $t('messageInfo.addAndEdit.item.export') }}</el-button>
        <el-table
          :data="protocolList"
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          v-loading="loading"
          style="width: 100%"
          :key="randomKey"
        >
          <el-table-column
            :label="$t('messageInfo.addAndEdit.item.table.order')"
            type="index"
            align="center"
            width="50px"
          >
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.code')" align="center" width="100px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                　
                <el-input
                  v-model="scope.row.name"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.name')" align="center" width="100px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                　
                <el-input
                  v-model="scope.row.content"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.describe')" align="center" width="150px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                　
                <el-input
                  v-model="scope.row.description"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.size')" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                <el-input
                  v-model="scope.row.lengthByte"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.dataType')" align="center" width="110px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                <el-select
                  v-model="scope.row.dataType"
                  filterable
                  :placeholder="$t('messageInfo.addAndEdit.item.table.tip1')"
                >
                  <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value + scope.$index"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.start')" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                <el-input
                  v-model="scope.row.startByte"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.exportOrder')" align="center" width="100px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                <el-input-number
                  v-model="scope.row.orderme"
                  controls-position="right"
                  class="input-num-class"
                ></el-input-number>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.precision')" align="center" width="100px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                　
                <el-input
                  v-model="scope.row.decimalPlace"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.unit')" align="center" width="100px">
            <template slot-scope="scope">
              <el-row type="flex" justify="center" align="middle">
                　
                <el-input
                  v-model="scope.row.divUnit"
                  class="inputClass"
                ></el-input>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :label="$t('messageInfo.addAndEdit.item.table.isExport')" align="center" width="100px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isExport"
                :active-value="true"
                :inactive-value="false"
                @change="handleIsExportChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            class-name="small-padding fixed-width"
            width="140px"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="addRow(scope.$index)"
                >{{ $t('messageInfo.addAndEdit.item.operate.add') }}
                </el-button
                >
              </div>
              <div>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.$index, protocolList)"
                >{{ $t('messageInfo.addAndEdit.item.operate.delete') }}
                </el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import XLSXS from 'xlsx-style'
import FileSaver from 'file-saver'
import {
  addMessageInfo,
  updateMessageInfo,
  getMessageInfo,
  deleteMessageInfo,
  getMessageDataType,
  getMsgItemsByMsgId
} from '@/api/message/message'
import Sortable from 'sortablejs'
import * as XLSX from 'xlsx'

export default {
  name: 'MessageModifyDetail',
  components: {
    Treeselect
  },
  data() {
    return {
      msgId: '',
      templateId: '',
      protocolList: [],
      options: [],
      dataTypeOptions: [],
      rules: {
        name: [{ required: true, message: '请输入协议名称', trigger: 'blur' }],
        version: [
          { required: true, message: '请输入协议版本', trigger: 'blur' }
        ]
      },
      form: {},
      messageInfo: {
        copied: false,
        copiedStartByte: 0,
        copiedByteLen: 0,
        copiedTimes: 0,
        status: '0'
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        byteSize: undefined
      },
      params: {
        pageNum: -1,
        pageSize: 10,
        name: undefined,
        id: undefined
      },
      title: '',
      open: false,
      flag: false,
      // 遮罩层
      loading: false,
      randomKey: '',
      //不触发拖拽
      dropFlag: false,
      templateFlag: true
    }
  },
  created() {
    this.init()
  },
  methods: {
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
    exportToExcel() {
      // 定义字段和对应的标题
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
      ]

      //存储每一列最大宽度
      let length = [0, 0, 0]

      // 遍历每一列的每一行获取每一列最大宽度
      for (let j = 0; j < this.protocolList.length; j++) {

        if (this.$options.methods.getCellWidth(this.protocolList[j].name) > length[0]) {
          length[0] = this.$options.methods.getCellWidth(this.protocolList[j].name)
        }
        if (this.$options.methods.getCellWidth(this.protocolList[j].content) > length[1]) {
          length[1] = this.$options.methods.getCellWidth(this.protocolList[j].content)
        }
        if (this.$options.methods.getCellWidth(this.protocolList[j].description) > length[2]) {
          length[2] = this.$options.methods.getCellWidth(this.protocolList[j].description)
        }
      }
      // 创建一个包含标题的数组
      const header = fields.map(field => field.header)

      // 筛选字段
      const filteredData = this.protocolList.map(item => {
        return fields.reduce((acc, field) => {
          if (item.hasOwnProperty(field.key)) {
            acc[field.header] = item[field.key]
          }
          return acc
        }, {})
      })

      // 将筛选后的数据转换为工作表，并设置列标题
      const ws = XLSX.utils.json_to_sheet(filteredData, { header })

      // 创建新的工作簿并追加工作表
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '协议项')

      // 定义文件名
      const fileName = this.messageInfo.name + '.xlsx'

      //设置最大宽度
      ws['!cols'] = [{
        wpx: length[0] * 10
      }, {
        wpx: length[1] * 10
      }, {
        wpx: length[2] * 10
      }]

      Object.keys(ws).forEach((key) => {//这里遍历单元格给单元格对象设置属性,s为控制样式的属性
        if (key.indexOf('!') < 0) {
          ws[key].s = {
            font: {
              name: '宋体',
              sz: 12
            },
            alignment: {//对齐方式
              horizontal: 'center',//水平居中
              vertical: 'center',//竖直居中
              wrapText: true//自动换行
            }
          }
        }
      })

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

    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      this.loading = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (jsonData.length === 0) {
            throw new Error('Excel 文件为空或格式不正确');
          }

          this.protocolList = this.parseExcelData(jsonData);
        } catch (error) {
          console.error('读取或解析 Excel 文件时出错:', error);
          alert('读取或解析文件时出错，请检查文件格式和内容。');
        } finally {
          this.loading = false;
        }
      }
      reader.readAsArrayBuffer(file);
    },

    // 解析Excel数据
    parseExcelData(data) {
      // 假设第一行为表头
      const headers = data[0]
      const rows = data.slice(1)
      // 列名映射：英文列名到中文列名
      const fieldMap = {
        'name': '英文名',
        'content': '中文名',
        'description': '描述',
        'lengthByte': '协议长度',
        'dataType': '数据类型',
        'startByte': '起始位置',
        'orderme': '导出顺序',
        'decimalPlace': '精度',
        'divUnit': '单位',
        'isExport': '是否导出'
      }
      // 生成中文表头的字段映射
      const fieldMapReversed = Object.fromEntries(
        Object.entries(fieldMap).map(([key, value]) => [value, key])
      );

      // 验证表头
      const validHeaders = Object.keys(fieldMapReversed);
      const isValidHeader = headers.every(header => validHeaders.includes(header));

      if (!isValidHeader) {
        throw new Error('Excel 文件的表头不符合预期');
      }

      return rows.map(row => {
        let protocolItem = {};
        headers.forEach((header, index) => {
          const fieldName = fieldMapReversed[header];
          if (fieldName) {
            protocolItem[fieldName] = row[index];
          }
        })
        return protocolItem;
      })
    },
    init() {
      if (this.flag) {
        this.loading = true
        this.protocolList = [] //清空列表
        this.templateId = ''
        this.params.pageNum = -1

        // 获取协议模板列表
        getMessageInfo(this.params).then((res) => {
          if (res.code !== 200) {
            alert('请重新链接')
          } else {
            this.options = []
            for (let item of res.rows) {
              const temp = {
                value: item.id,
                name: item.name
              }
              this.options.push(temp)
            }
          }
        })
        // 获取协议项
        getMsgItemsByMsgId(this.messageInfo.id).then((res) => {
          if (res.code !== 200) {
            alert('请重新链接')
          } else {
            this.protocolList = res.data
            this.templateId = this.messageInfo.id
            this.templateFlag = false
            this.dropFlag = true
          }
          this.loading = false
        })
        this.flag = false

        //获取数据类型
        getMessageDataType('msg_data_type').then((response) => {
          this.dataTypeOptions = []
          for (let item of response.data) {
            let option = {
              value: item.dictCode,
              name: item.dictLabel
            }
            this.dataTypeOptions.push(option)
          }
        })
      }
    },
    //提交修改表单信息
    submitForm: function() {
      const data = []
      for (let [index, msg] of this.protocolList.entries()) {
        const item = {
          name: msg.name,
          content: msg.content,
          description: msg.description,
          lengthByte: msg.lengthByte,
          dataType: msg.dataType,
          startByte: msg.startByte,
          orderme: msg.orderme,
          decimalPlace: msg.decimalPlace,
          divUnit: msg.divUnit,
          isExport: msg.isExport,
          status: msg.status
        }
        data.push(item)
      }
      // 加入协议项列表
      this.messageInfo.msgItemReqVOS = data

      updateMessageInfo(this.messageInfo).then((response) => {
        if (response.code !== 200) {
          alert('请重新链接')
        } else {
          this.open = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('ok', '')
        }
      })
      this.templateFlag = true
      //fileInput是文件输入框
      const fileInput = document.getElementById('excelUpload')
      fileInput.value = ''
    },

    // 协议项是否导出修改
    handleIsExportChange(row) {
      let text = row.isExport === true ? '导出' : '不导出'
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.msgSuccess(text + '成功');
        }).catch((e) => {
          console.error(e);
        })
    },

    // 下拉列表值变化时更新table数据
    idChanged() {
      this.loading = true;
      this.protocolList = []; //清空列表
      // 获取协议项
      getMsgItemsByMsgId(this.templateId).then((res) => {
        if (res.code !== 200) {
          alert('请重新链接');
        } else {
          this.protocolList = res.data;
          this.dropFlag = true;
        }
        this.loading = false;
      });
    },

    //关闭新增或修改页面
    cancel() {
      this.open = false;
      this.templateFlag = true;
      //fileInput是文件输入框
      const fileInput = document.getElementById('excelUpload');
      fileInput.value = '';
    },
    //增加行
    addRow(index) {
      const list = {
        name: '',
        description: '',
        content: '',
        orderme: index + 2
      };
      this.protocolList.splice(index + 1, 0, list);
    },
    //表格删除行
    deleteRow(index, rows) {
      if (rows.length > 1) {
        //若删除的行是表格的仅存的最后一行,则不能删除
        rows.splice(index, 1);
      }
    },
    // 拖拽初始化方法
    rowDrop() {
      const tbody = document.querySelector(
        '.message-modify .el-table__body-wrapper tbody'
      )
      const _this = this
      Sortable.create(tbody, {
        // handle: '.fields-move',
        animation: 150,
        onEnd({ oldIndex, newIndex }) {
          let currRow = _this.protocolList.splice(oldIndex, 1)[0]
          _this.protocolList.splice(newIndex, 0, currRow)
          _this.randomKey = Math.random() + new Date().getTime()
          // _this.$forceUpdate()
        }
      })
    }
  },
  watch: {
    /**
     * 监听表格数据变化，重新渲染拖拽事件
     */
    protocolList: {
      handler(val) {
        if (this.dropFlag) {
          this.$nextTick(() => {
            // 绑定拖拽事件
            this.rowDrop()
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.inputClass {
  text-align: center;
}

.input-num-class >>> .el-input-number__increase,
.input-num-class >>> .el-input-number__decrease {
  width: 18px;
}

.input-num-class >>> .el-input__inner {
  padding-left: 0px;
  padding-right: 18px;
}

.message-info >>> .el-input__inner {
  padding: 0 2px;
}
</style>
