<template>
  <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
    <el-table
      :data="msgItemList"
      stripe
      border
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column
        :label="$t('messageInfo.table.operate.order')"
        type="index"
        align="center"
        width="50px"
      ></el-table-column>
      <el-table-column
        prop="name"
        :label="$t('messageInfo.table.operate.code')"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="content"
        :label="$t('messageInfo.table.operate.name')"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="description"
        :label="$t('messageInfo.table.operate.describe')"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="lengthByte"
        :label="$t('messageInfo.table.operate.size')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dataType"
        :label="$t('messageInfo.table.operate.dataType')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="startByte"
        :label="$t('messageInfo.table.operate.start')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderme"
        :label="$t('messageInfo.table.operate.exportOrder')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="decimalPlace"
        :label="$t('messageInfo.table.operate.precision')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="divUnit"
        :label="$t('messageInfo.table.operate.unit')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="isExport"
        :label="$t('messageInfo.table.operate.isExport')"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isExport?'':'danger'">
            {{ scope.row.isExport ? $t('system.true') : $t('system.false') }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">{{ $t('system.confirm') }}</el-button>
      <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMsgItemsByMsgId } from '@/api/message/message'

export default {
  name: 'MessageSelectDetail',
  components: {},
  data() {
    return {
      msgItemList: [],
      title: '',
      open: false,
      loading: false
    }
  },
  created() {
  },
  methods: {
    getList(id) {
      this.loading = true;
      this.msgItemList = [];
      // 获取协议项
      getMsgItemsByMsgId(id).then((res) => {
        if (res.code === 200) {
          this.msgItemList = res.data;
        }
        this.loading = false;
      })
    },
    cancel() {
      this.open = false;
    }
  },
  watch: {}
}
</script>
<style scoped>
</style>
