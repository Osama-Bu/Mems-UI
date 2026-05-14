<template>
    <div class="app-container">
        <!--      添加或修改参数配置对话框-->
        <el-dialog :title="title" :visible.sync="open" width="1400px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="250px">
                <el-row v-if="showCustomRow1">
                    <el-form-item :label="messageItemName + ' ' + ' ('+$t('deviceInfo.bandingAlarm.addAndEdit.rule.abnormalRange')+')'">
                        <el-col :span="6">
                            <el-input v-model="min" type="number" step="any" :readonly="open">
                                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.min') }}：</template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="max" type="number" step="any" :readonly="open">
                                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.max') }}：</template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="trigger" type="number"  :readonly="open">
                                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.trigger') }}：</template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="scopeRuleDescription" type="textarea"
                                      :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                                style="margin-left: 10px" :readonly="open">
                            </el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row v-if="showCustomRow4">
                    <el-row>
                        <!-- 输入经纬度 -->
                        <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.centerAndRadius')">
                            <el-col :span="6">
                                <el-input v-model="longitude" type="number" step="any">
                                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.lng') }}：</template>
                                </el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="latitude" type="number" step="any">
                                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.lat') }}：</template>
                                </el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="radius" type="number" step="any">
                                    <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.radius') }}：</template>
                                </el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="circleRuleDescription2" type="textarea"
                                          :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                                    style="margin-left: 10px"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-row>
                </el-row>
                <el-row v-if="showCustomRow2">
                    <el-form-item :label="messageItemName + ' ' + ' ('+$t('deviceInfo.bandingAlarm.addAndEdit.rule.dataNoChange')+')'">
                        <el-col :span="12">
                            <el-input v-model="triggerNum" type="number" :readonly="open">
                                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.repeat') }}：</template>
                            </el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="triggerRuleDescription" type="textarea"
                                      :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                                style="margin-left: 10px" :readonly="open">
                            </el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row v-if="showCustomRow3">
                    <el-form-item :label="$t('deviceInfo.bandingAlarm.addAndEdit.rule.overtimeNoData')">
                        <el-col :span="12">
                            <el-input v-model="Timeout" type="number" :readonly="open">
                                <template slot="prepend">{{ $t('deviceInfo.bandingAlarm.addAndEdit.rule.overtime') }}：</template>
                            </el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="timeRuleDescription" type="textarea"
                                      :placeholder="$t('deviceInfo.bandingAlarm.addAndEdit.rule.tips')"
                                style="margin-left: 10px" :readonly="open">
                            </el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import {
    UpdateAlarmRule
} from "@/api/alarm/alarmrule";
import {
  getDeviceInfo, getDeviceInfoWithMessage,
} from "@/api/device/device"
import {
    getMessageInfo,
} from "@/api/message/message"
export default {
    name: 'GliderWithAlarmrule',
    components: {
        Treeselect,

    },
    data() {
        return {
            showCustomRow1: false, // 控制第一行是否显示
            showCustomRow2: false, // 控制第二行是否显示
            showCustomRow3: false, // 控制第二行是否显示
            showCustomRow4: false, // 控制第二行是否显示
            rules: {},
            text: "123",
            ruleContent: "",
            // 范围规则
            min: null,
            max: null,
            scopeRuleDescription: "",
            // 连续几组数据
            triggerNum: null,
            triggerValue: 0,
            triggerRuleDescription: "",
            timeRuleDescription: "",
            circleRuleDescription2:"",
            circleRuleDescription:"",
            Timeout: null,
            trigger:null,
            messageItemName: "", // 协议项字段
            messageItemContent: "", // 协议项中文名
            msgId: 1,
            form: {},
            title: '',
            open: false,
            loading: false,
            paragam: {},
            id: 1,
            gliderId: 1,
            selectedMessage: 1,
            selectedMessageItem: 1,
            selectedMessageItem_name: "",
            selectedMessageItem_content: "",
            msgQueryParams: {
                gliderId: undefined,
                msgIdList: undefined,
                pageNum: -1,
                pageSize: 10,
            },
            fieldQueryParams: {
                pageNum: -1,
                pageSize: 10,
                id: undefined,
            },
            options: [{
                value: 0,
            }, {
                value: 3,
            }],
            optionsMessage: [{
                value: 0,
            }, {
                value: 3,
            }],
            optionsMessageItem: [{
                value: 0,
            }, {
                value: 4,
            }],
        }
    },
    created() {
        let data2 = {
            pageNum: -1,
            pageSize: 0,
        }
        this.min=null;
    },
    mounted() {

    },
    methods: {

        //提交新增或修改的表单信息
        submitForm: function () {
            this.open = false;
        },
        //关闭新增或修改页面
        cancel() {
            this.open = false;
        },
    },
}
</script>
<style scoped>
.inputClass {
    text-align: center;
}

.input-num-class>>>.el-input-number__increase,
.input-num-class>>>.el-input-number__decrease {
    width: 18px;
}

.input-num-class>>>.el-input__inner {
    padding-left: 0px;
    padding-right: 18px;
}

.messge-info>>>.el-input__inner {
    padding: 0 2px;
}</style>
