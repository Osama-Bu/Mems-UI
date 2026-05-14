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
          <right-toolbar
            :showSearch.sync="showSearch"
            :search="false"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="commWayList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column
            :label="$t('deviceInfo.commConfig.order')"
            align="center"
            key="number"
            prop="number"
            width="100"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('deviceInfo.commConfig.commWays')"
            align="center"
            key="communicateType"
            prop="communicateType"
            v-if="columns[1].visible"
          >
            <template slot-scope="scope">
              <el-tag
                :style="{ color: getTypeColor(scope.row), borderColor: getTypeColor(scope.row) }"
              >
                {{ getTypeName(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('deviceInfo.commConfig.commCode')"
            align="center"
            key="communicateCode"
            prop="communicateCode"
            v-if="columns[2].visible"
          >
            <template slot-scope="scope">
              <el-tag
                :style="{ color: getTypeColor(scope.row), borderColor: getTypeColor(scope.row) }"
              >
                {{ scope.row.communicateCode }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.operate')"
            align="center"
            width="240"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >{{ $t('system.edit') }}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                :disabled="commWayList.length <= 1"
              >{{ $t('system.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('deviceInfo.commConfig.commWays')" prop="communicateType">
              <el-select v-model="form.communicateType" :placeholder="$t('deviceInfo.commConfig.addAndEdit.tip1')" :disabled = "editDialog">
                <el-option
                  v-for="item in commWayShowOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item :label="$t('deviceInfo.commConfig.commCode')" prop="communicateCode">
              <el-input v-model="form.communicateCode" :placeholder="$t('deviceInfo.commConfig.addAndEdit.tip2')" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { addCommWay, updateCommWay, deleteCommWay, getCommWaysByDeviceId } from '@/api/device/communicate'
import { Navbar } from '@/layout/components'
import { getDept } from '@/api/system/dept'
import deviceCommConfig from '@/utils/DeviceCommConfig';

export default {
  name: 'CommConfig',
  components: {
    Navbar
  },
  data() {
    return {
      editDialog: false,
      title: '',
      open: false,
      form:{
        id: undefined,
        communicateType: undefined,
        communicateCode: undefined,
        deviceId: undefined,
      },
      // 表单校验
      rules: {
        communicateType: [
          { required: true, message: this.$t('deviceInfo.commConfig.addAndEdit.rule1'), trigger: "blur" }
        ],
        communicateCode: [
          { required: true, message: this.$t('deviceInfo.commConfig.addAndEdit.rule2'), trigger: "blur" },
          { min: 2, max: 20, message: this.$t('deviceInfo.commConfig.addAndEdit.rule3'), trigger: 'blur' }
        ]
      },

      // 修改和新增框使用这个option
      commWayShowOptions: [],

      deptId: undefined,
      // 操作列显示隐藏
      operation: true,
      deviceForm: {
        deviceName: undefined,
        cdId: undefined,
        deptName: undefined,
        deviceId: undefined
      },

      commWayList: [],
      // 列信息
      columns: [
        { key: 0, label: `序号`, visible: true },
        { key: 1, label: `通信方式`, visible: true },
        { key: 2, label: `通信号码`, visible: true },
      ],
      // 遮罩层
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
    this.deptId = this.$route.query.deptId
    this.deviceForm.deviceName = this.$route.query.deviceName
    this.deviceForm.cdId = this.$route.query.cdId
    this.deviceForm.deviceId = Number(this.$route.query.deviceId)
    this.getList()
  },
  methods: {
    // 处理通信方式数据的方法
    getTypeName(row) {
      return deviceCommConfig.getTypeName(row);
    },

    getTypeColor(row) {
      return deviceCommConfig.getTypeColor(row);
    },

    //查询协议信息
    handleQuery() {
      this.getList()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        typeName: undefined,
        canDel: true,
      };
      this.resetForm("form");
    },

    // 新增
    handleAdd() {
      this.commWayShowOptions = this.getNewCommWayOptions();
      this.editDialog = false;
      this.reset();
      this.open = true;
      this.title = this.$t('deviceInfo.commConfig.addAndEdit.addTitle');
    },

    getNewCommWayOptions(){
      const existCodes = new Set(
        this.commWayList.map(item => item.communicateType)
      );
      return deviceCommConfig.commWayOptions.filter(
        item => !existCodes.has(item.value)
      );
    },

    // 修改
    handleUpdate(row) {
      this.commWayShowOptions = deviceCommConfig.commWayOptions;
      this.editDialog = true;
      this.reset();
      this.form = {
        id: row.id,
        communicateType: row.communicateType,
        communicateCode: row.communicateCode,
      }
      this.open = true;
      this.title = this.$t('deviceInfo.commConfig.addAndEdit.editTitle');
    },

    // 删除
    handleDelete(row) {
      let String = '是否确认删除所选【' + this.getTypeName(row) + '】通信方式?'
      this.$confirm(String, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteCommWay(row.id);
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },

    //提交新增表单信息
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCommWay(this.form).then(res =>{
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.deviceId = this.deviceForm.deviceId;
            addCommWay(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      })
    },
    //关闭新增页面
    cancel() {
      this.open = false;
      // 重置
      this.resetForm("form");
    },

    //获取数据
    getList() {
      this.loading = true
      if (this.$store.getters.permissions.indexOf('system:dept:query') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        getDept(this.deptId).then((res) => {
          this.deviceForm.deptName = res.data.deptName
        })
      }
      getCommWaysByDeviceId(this.deviceForm.deviceId).then((res) => {
        if(res.code === 200){
          this.commWayList = []
          let index = 1;
          for (let item of res.data) {
            let temp = {
              id: item.id,
              communicateCode: item.communicateCode,
              communicateType: item.communicateType,
              number: index++
            }
            this.commWayList.push(temp);
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
