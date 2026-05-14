<template>
<!--  todo 设备搜索、设备目标点、设备概览框-->
  <div class="main">
    <div class="navbar">
      <navbar />
    </div>

    <div id="windy"></div>

    <!-- 下拉搜索框 -->
    <div
      style="position: absolute; top: 5px; right: 175px; z-index: 2"
      class="search-box"
    >
      <div style="color: #06f1ef; display: inline">
        <el-select
          ref="searchSelection"
          v-model="searchSelectedID"
          filterable
          placeholder="设备搜索"
          style="width: 160px; margin-right: 10px"
          @change="idChanged(searchSelectedID)"
          :default-first-option="true"
          class="idSelect"
          v-has-permi="['map:device:local']"
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.id"
            :label="item.deviceName"
            :value="item.id"
          >
            <span style="float: left">{{ item.cdId }}</span>
            <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
            <span style="color: #8492a6; font-size: 13px">{{ item.deviceName }}</span>
          </el-option>
        </el-select>

      </div>
    </div>

    <!-- 获取地图页面概要信息 -->
    <el-tag
      type="info"
      class="overInfo"
      color="#00000062"
      v-has-permi="['map:overinfo']"
      style="font-size: 40px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 280px;
      height: 32px;"
    >
      <span style="font-size: 13px; color: #ffffff; line-height: 14px">{{ ' 总设备：' + this.overview.sum }}</span>
      <span style="
          font-size: 13px;
          color: #00ff00;
          padding-left: 1px;
          line-height: 14px;
        ">{{ ' 正常：' + this.overview.normal }}</span>
      <span style="
          font-size: 13px;
          color: #ff0000;
          padding-left: 1px;
          line-height: 14px;
        ">{{ ' 回传异常：' + this.overview.abnormal }}</span>
    </el-tag>

    <!-- 鼠标坐标显示容器-->
    <div
      id="mouse-position"
      style="
        position: absolute;
        bottom: 60px;
        left: 3px;
        width: 280px;
        z-index: 999;
        background: rgba(255,255,255,0.4);
        padding: 5px;
        font-size: 12px;
        border-radius: 4px;
      "
    ></div>

    <!-- 设备信息弹窗 -->
    <div
      class="info-card-new"
      v-show="shopPopup"
      v-has-permi="['map:target:single']"
    >
      <el-container>
        <el-header class="header1" style="height: 90px">
          <div style="color: #cb9d1d; font-size: 24px; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 12px;">
              <span>{{ infoCardData.markerInfo.deviceName }}</span>
              <span style="font-weight: normal; font-size: 18px; color: #e8c470;">{{ infoCardData.markerInfo.orgName }}</span>
            </div>
            <div style="display: flex; margin-bottom: 4px; gap: 12px; font-size: 18px; color: #e8c470; align-items: center;">
              <span>{{ infoCardData.markerInfo.deviceTypeName }}</span>
              <span>{{ infoCardData.markerInfo.deviceModelName }}</span>
            </div>
            <div style="display: flex; gap: 12px; font-size: 18px; color: darkgray; align-items: center;">
              <el-popover
                v-if="infoCardData.markerInfo.commWays && infoCardData.markerInfo.commWays.length > 0"
                placement="right"
                width="200"
                trigger="click"
              >
                <template #reference>
                      <span style="cursor: pointer;">
                        {{ getFirstCommWay(infoCardData.markerInfo.commWays) }}
                        <span
                          v-if="infoCardData.markerInfo.commWays.length > 1"
                          style="margin-left: 4px; color: white;"
                        >
                          (+{{ infoCardData.markerInfo.commWays.length - 1 }})
                        </span>
                      </span>
                </template>
                <div>
                  <div
                    v-for="(comm, index) in infoCardData.markerInfo.commWays"
                    :key="index"
                    style="padding: 4px 0; border-bottom: 1px solid #f0f0f0;"
                  >
                    {{ getCommWayName(comm.communicateType) }}: {{ comm.communicateCode }}
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
          <el-button
            type="text"
            style="
                  float: right;
                  padding: 0;
                  position: absolute;
                  right: 2px;
                  top: 2px;
                  width: 24px;
                  height: 24px;
                  font-size: 16px;
                "
            @click="closeInfoCard"
          >
            <i class="el-icon-close"></i>
          </el-button>
        </el-header>
      </el-container>

      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-map-location"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >经度
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.lr[0] }}
            </div>
          </el-main>
          <el-main
          >纬度
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.lr[1] }}
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-discover"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >经度（度分）
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.lngDegrees }}
            </div>
          </el-main>
          <el-main
          >纬度（度分）
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.latDegrees }}
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-watch"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >当前位置时间
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.sendDate }}
            </div>
          </el-main>
        </el-container>
      </el-container>

      <el-container>
        <el-header
          style="display: flex; height: 40px"
          class="header2"
          v-has-permi="['vue:map:control']"
        >操控
          <el-button
          type="text"
          style="right: 10px; position: absolute"
          @click="show3 = !show3"
          >
            <i
              style="font-size: 30px; color: #c8f4ff; line-height: 0.65"
              class="el-icon-arrow-down"
              v-if="updownIcon"
              @click="updownIcon = !updownIcon"
            ></i>
            <i
              style="font-size: 30px; color: #c8f4ff; line-height: 0.65"
              class="el-icon-arrow-up"
              v-if="!updownIcon"
              @click="updownIcon = !updownIcon"
            ></i>
          </el-button>
        </el-header>
      </el-container>

      <el-collapse-transition>
        <div v-show="show3">
          <el-container>
            <el-aside width="47px">
              <div class="info-card-new-icon" style="padding: 8px 8px">
                <i class="el-icon-date"></i>
              </div>
            </el-aside>
            <el-container>
              <el-main class="date-range-main">
                <div>
                  <div style="padding-top: 1px">
                    <el-date-picker
                      v-model="infoCardData.startDate"
                      type="datetime"
                      value-format="timestamp"
                      placeholder="请选择开始时间"
                      style="width: 195px"
                    >
                    </el-date-picker>
                    <el-date-picker
                      v-model="infoCardData.endDate"
                      type="datetime"
                      value-format="timestamp"
                      placeholder="请选择结束时间"
                      style="width: 195px"
                    >
                    </el-date-picker>
                  </div>
                </div>
              </el-main>
              <el-main>
                <div>
                  <div>
                    <el-button
                      type="text"
                      class="button"
                      @click="showPolyline"
                      v-has-permi="['map:device:trail']"
                      >显示轨迹
                    </el-button>
                    <el-button
                      type="text"
                      class="button"
                      @click="closePolyline()"
                      v-has-permi="['map:device:trail']"
                      >关闭轨迹
                    </el-button>
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-container>

          <el-container>
            <el-aside width="47px">
              <div class="info-card-new-icon">
                <i class="el-icon-set-up"></i>
              </div>
            </el-aside>
            <el-container>
              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="sendCmdPage(infoCardData)"
                    v-has-permi="['vue:map:view:cmd']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-position"></i>
                    </div>
                    <div style="font-size: 10px">发送指令</div>
                  </el-button>
                </div>
              </el-main>
              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="openDeviceDetail()"
                    v-has-permi="['vue:map:view:detail']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-data-analysis"></i>
                    </div>
                    <div style="font-size: 10px">设备状态</div>
                  </el-button>
                </div>
              </el-main>
              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="ol_queryAIS()"
                    v-has-permi="['map:aisinfo']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-data-analysis"></i>
                    </div>
                    <div style="font-size: 10px">AIS信息</div>
                  </el-button>
                </div>
              </el-main>

              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="ol_queryAIS_1()"
                    v-has-permi="['map:aisinfo']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-data-analysis"></i>
                    </div>
                    <div style="font-size: 10px">船讯网AIS</div>
                  </el-button>
                </div>
              </el-main>

              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="enablePlan()"
                    v-has-permi="['vue:map:navigate']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div style="font-size: 10px">导航规划</div>
                  </el-button>
                </div>
              </el-main>
              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="downloadExcel()"
                    v-has-permi="['chart:excel:export']"
                  >
                    <div class="info-card-new-icon">
                      <i
                        class="el-icon-loading"
                        v-if="infoCardData.downloading"
                      ></i>
                      <i class="el-icon-document" v-else></i>
                    </div>
                    <div style="font-size: 10px">数据导出</div>
                  </el-button>
                </div>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 地图菜单工具栏 -->
    <div v-show="true">
      <div class="tools">
        <table>
          <tr>
            <el-button
              type="text"
              @click="areaManage.isShow = true"
              v-has-permi="['map:area:page']"
            >围栏管理</el-button>
          </tr>
          <tr>
            <el-button
              type="text"
              @click="distanceMeasure()"
              v-if="!rulerFlag"
              v-has-permi="['vue:map:range']"
            >打开测距</el-button>
            <el-button
              type="text"
              @click="distanceMeasure()"
              v-else
              v-has-permi="['vue:map:range']"
            >关闭测距</el-button>
          </tr>
          <tr>
            <el-button
              type="text"
              @click="labelSwitch()"
              v-if="!labelIsShow"
              v-has-permi="['vue:map:label']"
            >显示标签</el-button>
            <el-button
              type="text"
              @click="labelSwitch()"
              v-else
              v-has-permi="['vue:map:label']"
            >隐藏标签</el-button>
          </tr>
          <tr>
            <el-popover placement="left" trigger="click">
              <div>
                <el-button
                  type="text"
                  @click="routeToGaode()"
                  v-has-permi="['vue:map:gaodemap']"
                  >高德地图</el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="routeToGoogle()"
                  v-has-permi="['vue:map:olmap']"
                  >私有地图</el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="routeToWindy()"
                  v-has-permi="['vue:map:windymap']"
                  >Windy地图</el-button>
              </div>
              <el-button
                type="text"
                slot="reference"
                v-has-permi="['vue:map:switch']"
                >地图切换</el-button>
            </el-popover>
          </tr>
        </table>
      </div>
    </div>

    <!-- 围栏管理框 -->
    <div class="info-card-new" v-show="areaManage.isShow" style="width: 405px">
      <el-container>
        <el-header class="header1" style="height: 56px">
          <div style="color: #cb9d1d">
            <td>电子围栏管理</td>
          </div>
          <el-button
            type="text"
            style="
              float: right;
              padding: 0;
              position: absolute;
              right: 2px;
              top: 2px;
            "
            @click="areaManage.isShow = false"
          >X</el-button>
          <tr>
            <td>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="showAreaAdd()"
                v-hasPermi="['map:area:add']"
              >新增
              </el-button>
            </td>
          </tr>
        </el-header>
      </el-container>

      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-s-grid"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main style="padding: 0">
            <el-table
              :data="areaManage.areaList"
              style="width: 400px"
              border
              max-height="400"
            >
              <el-table-column type="index" label="序号"> </el-table-column>

              <el-table-column label="区域名" width="130" prop="name">
              </el-table-column>

              <el-table-column label="是否显示" width="75">
                <template slot-scope="scope">
                  <span v-if="scope.row.visible">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="100"
                v-if="
                  $store.getters.permissions.indexOf('map:area:update') === -1 &&
                  $store.getters.permissions.indexOf('map:area:delete') === -1 &&
                  $store.getters.permissions.indexOf('*:*:*') === -1
                    ? 0 !== 0
                    : 0 === 0
                "
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="handleAreaUpdate(scope.row)"
                    type="text"
                    size="small"
                    v-hasPermi="['map:area:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    @click.native.prevent="handleAreaDelete(scope.row)"
                    type="text"
                    size="small"
                    v-hasPermi="['map:area:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <!-- 围栏管理框 -->

    <!-- 围栏新增/编辑框 -->
    <div
      class="info-card-new"
      v-show="areaManage.areaForm.isShow"
      style="
        width: 405px;
        left: 20px;
        top: 25px;
        box-shadow: -1px 1px 5px #333333;
      "
    >
      <el-container>
        <el-header class="header1" style="height: 56px">
          <div style="color: #cb9d1d">
            <td>{{ this.areaManage.isAdd ? "围栏新增" : "围栏编辑" }}</td>
            <td>
              <span style="font-size: 14px; margin-left: 10px; color: #cecece"
              >点击地图以添加区域顶点</span
              >
            </td>
          </div>
          <el-button
            type="text"
            style="
              float: right;
              padding: 0px;
              position: absolute;
              right: 2px;
              top: 2px;
            "
            @click="closeAreaForm()"
          >X</el-button
          >
          <tr>
            <td>区域名称:</td>
            <td>
              <el-input
                v-model="areaManage.areaForm.name"
                placeholder="请输入名称"
                size="mini"
                style="width: 120px; margin-right: 10px"
              ></el-input>
            </td>
            <td>是否显示:</td>
            <td>
              <el-switch
                v-model="areaManage.areaForm.visible"
                active-color="#13ce66"
              ></el-switch>
            </td>
          </tr>
        </el-header>
      </el-container>

      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-map-location"></i>
            <el-button
              type="primary"
              plain
              class="button"
              @click="submitAreaForm()"
              style="float: right; margin-right: 5px; padding: 2px"
            >保存
            </el-button>
            <el-button
              type="primary"
              plain
              class="button"
              @click="StartDrawingCircle()"
              style="float: right; margin-right: 5px; padding: 2px"
            >圆形
            </el-button>
          </div>
        </el-aside>
        <el-container>
          <el-main style="padding: 0">
            <el-table
              :data="areaManage.areaForm.pointList"
              style="width: 400px"
              max-height="400"
            >
              <el-table-column type="index" label="序号"> </el-table-column>

              <el-table-column label="经度" width="130">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[0]"
                    placeholder="请输入经度"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="纬度" width="130">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[1]"
                    placeholder="请输入纬度"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="
                      deletePointRow(
                        scope.$index,
                        areaManage.areaForm.pointList
                      )
                    "
                    type="text"
                    size="small"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <!-- 围栏新增/编辑框 -->

    <!-- 设备状态浮动窗口 -->
    <el-dialog
      :visible.sync="showGliderDetail"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="glider-detail-dialog"
      @close="closeDeviceDetail"
    >
      <div slot="title" class="dialog-title-custom">
        <span>设备状态</span>
      </div>
      <div style="height: 75vh; overflow: hidden;">
        <iframe
          v-if="showGliderDetail"
          ref="gliderIframe"
          :src="deviceDetailUrl"
          frameborder="0"
          style="width: 100%; height: 100%; border: none; display: block;"
          @load="onIframeLoad"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'
import { getDeviceTypeTree } from '@/api/device/device'
import { getDeviceAll, getTrail, getOverInfo, getNTargets, getSpeedById } from '@/api/map/map'
import { detailExcel } from '@/api/status/status'
import { parseTime } from '@/utils/ruoyi'
import 'leaflet-rotatedmarker' // 导入旋转插件
import { addAreaInfo, deleteAreaInfo, getAllAreaInfo, updateAreaInfo } from '@/api/map/area'
import { computeDestinationPoint } from 'geolib'
import deviceIconConfig from '@/utils/DeviceIconConfig'
import deviceCommConfig from '@/utils/DeviceCommConfig';

export default {
  name: "WindyMap",
  components: {
    Navbar,
  },
  data() {
    return {
      windyAPI: null, // Windy API 实例
      map: {}, // Windy 地图对象
      deviceList: [], // 存储设备信息
      deviceTypeOptions: [],
      searchSelectedID: null, //搜索框-被选择的设备ID
      // 设备定位
      devicePositionList: [],
      // 搜索框内容列表
      deviceOptions: [
        {
          value: '1'
        }
      ],
      //地图界面设备概要信息
      overview: {
        abnormal: 0, // 不正常设备
        sum: 0, // 总设备
        normal: 0,  // 正常设备
        disable: 0  //停用设备
      },

      // 设备目标点
      speed: 0,
      targetLayerList: [], // 存储目标点标记图层
      TargetPolylineLayerList: [], // 存储目标点连线图层
      targetMarkerGroup: L.layerGroup(), // 目标点标记分组（统一管理）
      targetPolylineGroup: L.layerGroup(), // 目标点连线分组（统一管理）
      newMsgLayerGroup: L.layerGroup(), // 新消息提示图层分组（统一管理）


      trackPolyline: null, // 用于存储轨迹的 Polyline
      shopPopup: false, // 控制设备信息弹窗显示
      show3: false, // 控制操控面板展开
      updownIcon: true, // 控制箭头方向
      labelIsShow: false, // 控制标签显示
      rulerFlag: false, // 控制测距功能
      // 测距功能数据区
      measure: {
        polylines: [], // 存储测距线段
        markers: [], // 存储测距标记
        tooltips: [], // 存储测距提示框
        isDrawing: false, // 是否正在绘制
        currentPoints: [], // 当前绘制的点
        tempMarker: null, // 临时标记
      },
      labelMarkers: [], // 存储标签标记
      infoCardData: {
        //悬浮卡片
        markerInfo: {
          lr: ["", ""]  // 不可删除，删除会导致windy加载失败
        },
        startDate: "",
        endDate: "",
        nowdate: "", //数据更新日期
        downloading: false, //数据导出下载状态
      },
      markers: [], // 存储地图上的标记
      // 日期选择器配置
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      },
      // 添加图标资源
      imgs: {
        selected_device: require('@/assets/map/select_red.png'),
        planDotImg: require('@/assets/map/planMarker.png'),
        target_cmd: require('@/assets/map/target/target_cmd.png'),
        target_msg: require('@/assets/map/target/target_msg.png'),
      },
      // 设备状态弹窗
      showGliderDetail: false,
      iframeLoading: false,
      deviceDetailParams: {
        deviceId: '',
        startDate: '',
        endDate: '',
      },
      //围栏管理-数据区
      areaManage: {
        areaList: [],
        isAdd: true,
        areaForm: {
          id: 0,
          name: "",
          pointList: [], //输入框的经纬度
          drawingPath: [], //用来显示地图上的多边形的经纬度，会监听pointList随时刷新
          visible: true,
          isShow: false,
        },
        isShow: false,
        editing: false,
        IsCircle: false,
      },
      polygonLayer: null, //电子围栏多边形显示图层
      drawLayer: null, //编辑/增加时显示的图层
      areaPolygons: [], // 存储围栏多边形对象
      drawPolygon: null, // 编辑/新增时的临时多边形
    };
  },
  computed: {
    // 生成设备详情页面的完整 URL
    deviceDetailUrl() {
      const params = new URLSearchParams({
        deviceId: this.deviceDetailParams.deviceId,
        startDate: this.deviceDetailParams.startDate,
        endDate: this.deviceDetailParams.endDate,
        hideNavbar: 'true',
      });
      // 使用绝对路径，从根路径开始
      return `/gliderdetail?${params.toString()}`;
    }
  },

  mounted() {
    // 动态加载脚本
    this.loadScripts().then(() => {
      this.initWindyMap(); // 初始化Windy地图
    }).catch(error => {
      console.error('加载脚本失败:', error);
      this.$message.error('加载地图资源失败，请刷新页面重试');
    });

    // 设置定时刷新
    this.intervalId = setInterval(() => {
      this.init();
    }, 3 * 60 * 1000); // 3分钟刷新一次
  },

  beforeDestroy() {
    clearInterval(this.intervalId); // 清除定时器
    // 清理测距资源
    if (this.rulerFlag) {
      this.clearMeasure();
    }
    // 清理标签资源
    if (this.labelIsShow) {
      this.closeAllLabels();
    }
  },

  methods: {

    /**
     * 显示设备目标点
     * */
    async loadDeviceTargetPoint() {
      try {
        const queryParam = {
          id: this.infoCardData.markerInfo.id,
          startTimeStamp: new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
          endTimeStamp: new Date().getTime()
        }
        this.speed = await getSpeedById(queryParam);
        const res = await getNTargets(this.infoCardData.markerInfo.id);

        // 清空旧图层
        this.clearTargetLayers();
        this.targetLayerList = [];
        this.TargetPolylineLayerList = [];

        for (let item of res.rows) {
          const coordinate_leaflet = [item.latitude, item.longitude];
          const coordinate_openLayer = [item.longitude, item.latitude];
          const deviceLngLat = this.infoCardData.markerInfo.lr; // 设备原始坐标 [lng,lat]
          const deviceLatLng = [deviceLngLat[1], deviceLngLat[0]]; // 转为 Leaflet [lat,lng]

          if (item.longitude != null && item.latitude != null) {
            // 创建目标点标记（msg/cmd 不同样式）
            let targetMarker;
            if (item.source === 'msg') {
              targetMarker = this.showTargetMsg(coordinate_leaflet, this.infoCardData.markerInfo.id);
              this.targetLayerList.push(targetMarker);
            } else if (item.source === 'cmd') {
              targetMarker = this.showTargetCmd(coordinate_leaflet, this.infoCardData.markerInfo.id);
              this.targetLayerList.push(targetMarker);
            }

            // 创建设备到目标点的连线
            const targetPolyline_leaflet = [deviceLatLng, coordinate_leaflet]; // Leaflet 坐标数组 [起点, 终点]
            const targetPolyline_openLayer = [deviceLngLat, coordinate_openLayer]; // OpenLayer 坐标数组 [起点, 终点]
            // 计算距离和预计时间
            const distance = this.getDistanceFromLatLonInKm(targetPolyline_openLayer);
            const time = Math.round(distance / this.speed);
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            const formattedTime = `${hours}小时 ${minutes}分钟 ${seconds}秒`;

            // 创建连线
            let targetPolyline;
            if (item.source === 'msg') {
              targetPolyline = this.showTargetMsgPolyline(targetPolyline_leaflet);
              this.TargetPolylineLayerList.push(targetPolyline);
            } else if (item.source === 'cmd') {
              targetPolyline = this.showTargetCmdPolyline(targetPolyline_leaflet);
              this.TargetPolylineLayerList.push(targetPolyline);
            }

            // 创建目标点标签（显示预计时间）
            this.showTargetLabel(
              coordinate_leaflet,
              this.infoCardData.markerInfo.id,
              item.source,
              formattedTime
            );
          }
        }

        // 将图层添加到地图
        this.targetMarkerGroup.addTo(this.map);
        this.targetPolylineGroup.addTo(this.map);
      } catch (error) {
        console.error('请求失败:', error);
      }
    },

    // ========== 创建 msg 类型目标点标记 ==========
    showTargetMsg(coordinate, deviceId) {
      // 自定义 msg 类型图标（替换 OpenLayers 的 style）
      const msgIcon = L.icon({
        iconUrl: this.imgs.target_msg, // 图标
        iconSize: [20, 30], // 图标尺寸
        iconAnchor: [10, 15], // 图标锚点（中心点）
        zIndexOffset: 100, // 层级
      });

      // 创建 Marker 并添加到分组
      const marker = L.marker(coordinate, { icon: msgIcon, id: deviceId });
      this.targetMarkerGroup.addLayer(marker);
      return marker;
    },

    // ========== 创建 cmd 类型目标点标记 ==========
    showTargetCmd(coordinate, deviceId) {
      const cmdIcon = L.icon({
        iconUrl: this.imgs.target_cmd, // 图标
        iconSize: [20, 30],
        iconAnchor: [10, 15],
        zIndexOffset: 100,
      });

      const marker = L.marker(coordinate, { icon: cmdIcon, id: deviceId });
      this.targetMarkerGroup.addLayer(marker);
      return marker;
    },

    // ========== 创建 msg 类型目标点连线 ==========
    showTargetMsgPolyline(polylineCoords) {
      // 自定义 msg 连线样式
      const polyline = L.polyline(polylineCoords, {
        color: '#1890ff', // 蓝色
        weight: 1, // 线宽
        opacity: 0.8,
        dashArray: '5,5', // 虚线（可选）
      });
      this.targetPolylineGroup.addLayer(polyline);
      return polyline;
    },

    // ========== 创建 cmd 类型目标点连线 ==========
    showTargetCmdPolyline(polylineCoords) {
      const polyline = L.polyline(polylineCoords, {
        color: '#f5222d', // 红色
        weight: 1,
        opacity: 0.8,
        dashArray: '5,5',
      });
      this.targetPolylineGroup.addLayer(polyline);
      return polyline;
    },

    // ========== 创建目标点标签（显示预计时间） ==========
    showTargetLabel(coordinate, deviceId, source, formattedTime) {
      const coordinate_openLayer = [coordinate[1],coordinate[0]];
      // 自定义标签样式
      const labelIcon = L.divIcon({
        className: 'target-label',
        html: `
          <div style="
            width: 182px;
            border: 1px solid #0000ff;
            padding: 5px;
            background-color: #12223b;
          ">
            <div style="
              color: white;
              border-radius: 1px;
              text-align: center;
              font-size: 12px;
              white-space: nowrap;
            ">
              目标点(${source}):[${coordinate_openLayer}]<br/>预计需要:${formattedTime}
            </div>
          </div>
        `,
        iconSize: [190, 30],
        iconAnchor: [95, 68],
      });

      // 创建标签 Marker（无图标，仅显示文字）
      const labelMarker = L.marker(coordinate, {
        icon: labelIcon,
        id: deviceId,
        zIndexOffset: 101 // 层级高于标记
      });
      this.targetMarkerGroup.addLayer(labelMarker);
      return labelMarker;
    },

    // ========== 清空目标点图层（避免重复） ==========
    clearTargetLayers() {
      // 移除地图上的旧图层
      if (this.map.hasLayer(this.targetMarkerGroup)) {
        this.map.removeLayer(this.targetMarkerGroup);
      }
      if (this.map.hasLayer(this.targetPolylineGroup)) {
        this.map.removeLayer(this.targetPolylineGroup);
      }
      // 重置分组
      this.targetMarkerGroup = L.layerGroup();
      this.targetPolylineGroup = L.layerGroup();
    },

    // ========== 复用距离计算方法 ==========
    getDistanceFromLatLonInKm(coords) {
      const R = 6371 // 地球半径，单位为公里
      const point1 = coords[0]
      const point2 = coords[1]
      const dLat = this.deg2rad(point2[1] - point1[1])
      const dLon = this.deg2rad(point2[0] - point1[0])
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(point1[1])) *
        Math.cos(this.deg2rad(point2[1])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      // 距离，单位为米
      return R * c * 1000
    },

    deg2rad(deg) {
      return deg * (Math.PI/180);
    },

    /**
     * 定位设备
     */
    idChanged(searchSelectedID) {
      // 先清空旧的定位图层（避免重复）
      this.closePositionDeviceBorder();

      const devicePositionList = this.devicePositionList;
      devicePositionList.forEach((item) => {
        if (item.id === searchSelectedID) {
          // 提取经纬度（注意：Leaflet 是 [纬度, 经度]，OpenLayers 是 [经度, 纬度]，需反转）
          const lng = item.lr[0]; // 经度
          const lat = item.lr[1]; // 纬度

          // 显示定位图标框选
          this.positionDeviceBorder([lat, lng]); // 反转经纬度顺序

          // 延时3秒关闭框选
          setTimeout(() => {
            this.closePositionDeviceBorder();
          }, 3000);

          // 地图定位到该设备（Leaflet 方法）
          this.map.setView([lat, lng], 10); // 第二个参数是缩放级别，可按需调整

          // 显示设备框
          this.showDeviceInfo(item.value)
        }
      });
      this.searchSelectedID = null;
    },

    /**
     * 定位设备的框选
     * @param {Array} item - [lat, lng] 纬度在前，经度在后
     */
    positionDeviceBorder(item) {
      // 1. 创建图层组（替代 OpenLayers 的 VectorLayer）
      this.PositionLayer = L.layerGroup();

      // 2. 创建定位 Marker（替代 OpenLayers 的 Feature/Point）
      const positionMarker = L.marker(item, {
        // 设置自定义图标（替代 OpenLayers 的 Icon 样式）
        icon: L.icon({
          iconUrl: this.imgs.selected_device, // 你的图标路径
          iconSize: [36, 40], // 图标尺寸（对应 scale:0.6 的原尺寸）
          iconAnchor: [18, 20] // 图标锚点（对应 offset: [-18,-20]）
        }),
        zIndexOffset: 97 // 层级（替代 zIndex:97）
      });

      // 3. 添加 Marker 到图层组，再添加到地图
      this.PositionLayer.addLayer(positionMarker);
      this.PositionLayer.addTo(this.map);
    },

    /**
     * 关闭定位框选
     */
    closePositionDeviceBorder() {
      // 检查图层是否存在，存在则移除
      if (this.PositionLayer && this.map.hasLayer(this.PositionLayer)) {
        this.map.removeLayer(this.PositionLayer);
        this.PositionLayer = null; // 清空引用
      }
    },

    // 获取通信方式名称
    getCommWayName(type) {
      return deviceCommConfig.getCommWayName(type);
    },

    // 获取第一种通信方式
    getFirstCommWay(commWays) {
      if (!commWays || commWays.length === 0) return ''
      const firstComm = commWays[0]
      return `${this.getCommWayName(firstComm.communicateType)}: ${firstComm.communicateCode}`
    },

    /**
     * 动态加载所需脚本
     */
    loadScripts() {
      return new Promise((resolve, reject) => {
        return this.loadScript('https://api.windy.com/assets/map-forecast/libBoot.js')
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 加载 JS 脚本
     */
    loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    /**
     * 初始化 Windy 地图
     */
    initWindyMap() {
      const options = {
        // key: "X8KhBL0sWJWEC03iAjRZwXAn8KPRTtia", // Windy免费版 API 密钥
        key: "OrtNq1rCqWLUcci6tUpEEm17gPoH7uru",//专业版API
        lat: 23.31,
        lon: 120.5,
        zoom: 6,
        verbose: false ,// 禁用详细日志
        graticule: false,
      };

      // 确保 windyInit 函数存在
      if (typeof windyInit !== 'function') {
        console.error('Windy API 未正确加载');
        return;
      }

      windyInit(options, (windyAPI) => {
        console.log('Windy API 初始化成功');
        this.windyAPI = windyAPI;
        const { picker, utils, broadcast, store } = windyAPI;

        // 获取 Leaflet 地图实例
        this.map = windyAPI.map;

        /**
         日期格式转换
         **/
        const D2Dms = (d_data) => {
          let degree = parseInt(d_data)
          let min = Number(Math.abs(d_data - degree) * 60).toFixed(5)
          return degree + '°' + min + '′'
        };

        // 监听鼠标移动事件，实时更新坐标
        this.map.on('mousemove', (e) => {
          const mousePositionEl = document.getElementById('mouse-position');
          if (!mousePositionEl) return;

          const lng = e.latlng.lng;
          const lat = e.latlng.lat;
          const lngDms = D2Dms(lng);
          const latDms = D2Dms(lat);

          mousePositionEl.innerHTML = `
            <table border="0" width="220" style="table-layout:fixed;">
              <colgroup>
                <col style="width: 120px;">
                <col style="width: 120px;">
              </colgroup>
              <tr>
                <td>经度：${lng.toFixed(6)}</td>
                <td>（${lngDms}）</td>
              </tr>
              <tr>
                <td>纬度：${lat.toFixed(6)}</td>
                <td>（${latDms}）</td>
              </tr>
            </table>
          `;
        });

        // 鼠标离开地图时显示占位符
        this.map.on('mouseout', () => {
          const mousePositionEl = document.getElementById('mouse-position');
          if (!mousePositionEl) return;
          mousePositionEl.innerHTML = `
            <table border="0" width="220" style="table-layout:fixed; ">
              <colgroup>
                <col style="width: 120px;">
                <col style="width: 120px;">
              </colgroup>
              <tr>
                <td>经度：0.00</td>
                <td>（0°0.00′）</td>
              </tr>
              <tr>
                <td>纬度：0.00</td>
                <td>（0°0.00′）</td>
              </tr>
            </table>
          `;
        });

        store.set('overlay', 'currents');//设置初始默认图层为洋流图层
        //设置显示的图层，风、温度、气压、海浪相关图层包括洋流
        //可以设置的图层['satellite', 'wind', 'gust', 'gustAccu', 'rain', 'rainAccu', 'snowAccu',
        // 'snowcover', 'ptype', 'temp', 'dewpoint', 'rh', 'deg0', 'clouds', 'hclouds', 'mclouds',
        // 'lclouds', 'fog', 'cape', 'ccl', 'waves', 'swell1', 'swell2', 'swell3', 'wwaves',
        // 'currents', 'currentsTide', 'no2', 'pm2p5', 'aod550', 'gtco3', 'tcso2', 'go3', 'cosc',
        // 'dustsm', 'fires', 'pressure']
        store.set('favOverlays',['wind', 'gust', 'gustAccu', 'temp', 'waves', 'swell1', 'swell2', 'swell3', 'wwaves', 'currents', 'currentsTide', 'pressure'],{ forceChange: true });

        this.map.setMinZoom(2);  // 设置最小缩放级别
        this.map.setMaxZoom(18); // 设置最大缩放级别

        // 先获取设备数据，再在地图上显示
        this.init();
        // 加载围栏数据
        this.getAllArea();
        // 添加地图点击事件，模拟OpenLayers的singleclick行为
        this.map.on('click', (e) => {
          // 如果围栏编辑模式打开，由专门的处理器处理，不执行其他操作
          if (this.areaManage.editing) {
            return;
          }

          // 如果测距功能打开，不执行地图原有的点击操作
          if (this.rulerFlag) {
            return;
          }

          // 检查是否点击到了轨迹点
          let isTrackPointClicked = false;

          if (this.trackPointsLayer) {
            // 获取点击位置的像素坐标
            const clickPoint = e.latlng;

            // 遍历所有轨迹点，检查是否点击到了轨迹点
            this.trackPointsLayer.eachLayer((layer) => {
              if (isTrackPointClicked || !layer.getLatLng) return;

              // 计算点击位置与轨迹点的距离
              const distance = clickPoint.distanceTo(layer.getLatLng());

              // 如果距离小于阈值，认为点击到了轨迹点
              if (distance < 1000) { // 像素的点击容差
                const point = {
                  lon: layer.getLatLng().lng,
                  lat: layer.getLatLng().lat,
                  id: layer.id || '',
                  sendDate: layer.sendDate || ''
                };

                // 显示轨迹点信息
                this.showRouteTooltip(e.originalEvent.clientX, e.originalEvent.clientY, point);
                isTrackPointClicked = true;
              }
            });
          }
          // 如果没有点击到轨迹点，则使用Windy官方的picker显示气象数据
          if (!isTrackPointClicked) {
            const { lat, lng } = e.latlng;
            // 使用Windy的picker获取气象数据并显示
            picker.open({ lat, lon: lng });
          }

        });
        // 添加地图加载完成事件监听
        this.map.on('load', () => {
          console.log('Windy 地图加载完成');
          if (this.deviceList && this.deviceList.length > 0) {
            this.addDeviceToMap();
          }
          // 加载围栏数据
          this.getAllArea();
        });
        // 添加地图缩放事件监听，是否显示轨迹点
        this.map.on('zoomend', () => {
          if (!this.isTrackActive) {
            return;
          }

          const zoom = this.map.getZoom();
          if (zoom < 10) {
            this.hideTrackPoints();
          } else {
            this.showTrackPoints();
          }
        });
      });
    },

    /**
     * 获取所有设备信息
     */
    async init() {
      await getDeviceTypeTree().then((res) => {
        this.deviceTypeOptions = res.data
      })

      if (this.$store.getters.permissions.indexOf("map:device:all") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1) {
        getDeviceAll().then((res) => {
          if (res.code !== 200) {
            alert("请重新链接");
          } else {
            //此处把后端读取到的数据读入到我们存放设备信息的数组deviceList内
            this.deviceList = [];
            this.deviceOptions = [];
            for (let item of res.rows) {
              //如果该设备点被隐藏，那么跳过
              if (item.show === false) continue;

              // 设备类型型号替换
              const deviceType = this.deviceTypeOptions.find(type => type.id === item.deviceType)
              const deviceTypeName = deviceType ? deviceType.label : '未知产品'
              const deviceModel = deviceType.children.find(model => model.id === item.deviceModel)
              const deviceModelName = deviceModel ? deviceModel.label : '未知型号'

              const temp = {
                lr: [
                  Number(item.gpsX0).toFixed(6) == null || item.gpsX0 == null
                    ? 0 : Number(item.gpsX0).toFixed(6),
                  (Number(item.gpsX0).toFixed(6) === 0 &&
                    Number(item.gpsY0).toFixed(6) === 0) ||
                  item.gpsY0 == null ? 90 : Number(item.gpsY0).toFixed(6)
                ],
                longitude: item.gpsX0,
                latitude: item.gpsY0,
                angle: item.heading == null ? 0 : item.heading,
                orgId: item.deptId,
                orgName: item.createBy,
                offset: [-18, -20],
                isError: item.isError,
                lngDegrees: this.D2Dms(item.gpsX0),
                latDegrees: this.D2Dms(item.gpsY0),
                sendDate: item.sendDate,
                startDate: item.startTime,
                visible: item.show == null ? true : item.show,
                shower: item.deviceName + ' 速度: ' + (item.speed_ave !== null && item.speed_ave !== undefined ?
                  item.speed_ave.toFixed(2) : 'null') + 'm/s\n pich: ' + item.pitch + ' roll: ' + item.roll,

                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName,
                deviceType: item.deviceType,
                deviceTypeName: deviceTypeName,
                deviceModel: item.deviceModel,
                deviceModelName: deviceModelName,
                commWays: item.deviceCommunicateResVOS,
                deviceIcon: item.deviceIcon,
                iconType: item.iconType
              };
              this.deviceList.push(temp);

              //搜索框
              const temp3 = {
                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName,
                lngDegrees: item.gpsX0,
                latDegrees: item.gpsY0
              };
              // 加入搜索框内容列表
              this.deviceOptions.push(temp3);

              if (item.isNewMsg) {
                const temp2 = {
                  id: item.id,
                  lr: [
                    Number(item.gpsX0).toFixed(6) == null || item.gpsX0 == null
                      ? 0
                      : Number(item.gpsX0).toFixed(6),
                    (Number(item.gpsX0).toFixed(6) === 0 &&
                      Number(item.gpsY0).toFixed(6) === 0) ||
                    item.gpsY0 == null
                      ? 90
                      : Number(item.gpsY0).toFixed(6)
                  ]
                };
                // 替换 OpenLayers 的 mapAddOverlay → 调用 Leaflet 版本
                this.mapAddOverlay(temp2);
              }
            }
          }
          this.addDeviceToMap();

          // 提示闪烁7秒后移除（保留原有逻辑）
          setTimeout(() => {
            this.mapRemoveOverlays();
          }, 7000);

        });
      }
      //获取地图页面概要信息--请求函数
      let _this = this
      getOverInfo().then((res) => {
        if (res.code !== 200) {
          alert('请重新链接')
        } else {
          _this.overview.abnormal = res.rows[0].abnormalGliderNum
          _this.overview.sum = res.rows[0].sumGliderNum
          _this.overview.normal = res.rows[0].normalGliderNum
          _this.overview.disable = res.rows[0].disableGliderNum
        }
      })
    },

    /**
     * 添加新消息提示（Leaflet/Windy 版本，替换 OpenLayers Overlay）
     * @param {Object} item - 设备信息 {id, lr: [lng, lat]}
     *
     */
    mapAddOverlay(item) {
      // 坐标转换：OpenLayers
      const lng = Number(item.lr[0]);
      const lat = Number(item.lr[1]);
      const latLng = [lat, lng];

      // 创建 DOM
      const overlayDom = this.createDiv();

      // 创建 divIcon
      const newMsgIcon = L.divIcon({
        className: '', // 清空所有类名
        html: overlayDom.outerHTML,
        iconSize: [100, 100],
        iconAnchor: [25, 25], // 锚点居中，确保在坐标点正中心
        popupAnchor: [0, 0],
      });

      // 强制创建并添加 Marker
      const newMsgMarker = L.marker(latLng, {
        id: item.id,
        icon: newMsgIcon,
        zIndexOffset: 999999, // 层级拉满到最高
      });

      // 直接添加到地图
      newMsgMarker.addTo(this.map);

      // 同时添加到分组（保留原有逻辑）
      this.newMsgLayerGroup.addLayer(newMsgMarker);
      if (!this.map.hasLayer(this.newMsgLayerGroup)) {
        this.newMsgLayerGroup.addTo(this.map);
      }
    },

    /**
     * 删除所有新消息提示（Leaflet/Windy 版本）
     */
    mapRemoveOverlays() {
      // 清空图层分组
      this.newMsgLayerGroup.clearLayers();
      // 从地图移除分组（如需彻底清理）
      // this.map.removeLayer(this.newMsgLayerGroup);
    },

    /**
     * 创建闪烁提示的 DOM 元素（带波纹闪烁效果）
     */
    createDiv() {
      const elementDiv = document.createElement('div')
      elementDiv.style.cssText = `
        pointer-events: none;
        position: relative;
        width: 50px;
        height: 50px;
        z-index: 999999 !important;
      `;

      // 创建中心圆点（常亮部分）
      const centerDot = document.createElement('div');
      centerDot.style.cssText = `
        width: 12px;
        height: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #3b82f6 !important;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        z-index: 1000000;
      `;

      // 创建波纹容器
      const waveContainer = document.createElement('div');
      waveContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
      `;

      // 创建多个波纹（实现多层波纹效果）
      for (let i = 0; i < 2; i++) {
        const wave = document.createElement('div');
        wave.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.7);
          animation: wavePulse 3.5s ease-out ${i * 0.6}s infinite;
          pointer-events: none;
        `;
        waveContainer.appendChild(wave);
      }

      // 添加动画样式到 head
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes wavePulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(6);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      // 组装 DOM
      // elementDiv.appendChild(centerDot);
      elementDiv.appendChild(waveContainer);

      return elementDiv;
    },

    /**
     * 在地图上显示设备
     */
    addDeviceToMap() {
      if (!this.map || typeof this.map.addLayer !== 'function') {
        console.error('地图未初始化，无法添加设备标记');
        return;
      }

      if (!this.deviceList || this.deviceList.length === 0) {
        console.warn('没有设备数据可显示');
        return;
      }

      // 清除之前的标记
      if (this.markers && this.markers.length > 0) {
        this.markers.forEach(marker => {
          if (marker) {
            try {
              this.map.removeLayer(marker);
            } catch (e) {
              console.error('移除标记失败:', e);
            }
          }
        });
        this.markers = [];
      }

      // 确保 L (Leaflet) 对象存在
      if (typeof L === 'undefined') {
        console.error('Leaflet 库未加载');
        return;
      }

      // 遍历设备数据，添加标记
      this.deviceList.forEach((device, index) => {
        try {
          // 确保经纬度有效
          const lat = parseFloat(device.lr[1]);
          const lon = parseFloat(device.lr[0]);

          if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
            console.warn(`设备 ${device.material} 的坐标无效:`, lat, lon);
            return;
          }

          // 根据设备类型和状态选择图标
          let iconUrl = deviceIconConfig.getDeviceIcon(device);

          // 创建自定义图标
          const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
            className: device.isError ? 'error-icon' : '' // 添加错误状态样式类
          });

          // 添加标记到地图
          const marker = L.marker([lat, lon], {
            icon: customIcon,
            rotationAngle: device.angle % 360,
            zIndexOffset: device.deviceType !== 1 ? 98 : 99
          });

          // 创建悬停提示框，模拟 olmap 的 shower 功能
          const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            className: 'device-tooltip',
            offset: [0, -20]
          });

          // 设置提示框内容
          tooltip.setContent(device.shower || `${device.material} - 速度: ${device.speed || '0'} m/s`);

          // 绑定悬停事件
          marker.bindTooltip(tooltip);

          // 添加到地图
          marker.addTo(this.map);

          // 存储标记
          this.markers.push(marker);

          // 将设备打点信息保存，用于设备搜索
          const devicePosition = {
            id: device.id,
            lr: [lon, lat],
            value: device
          };
          this.devicePositionList.push(devicePosition);

          // 点击标记时显示设备信息
          marker.on('click', () => {
            this.showDeviceInfo(device);
          });
        } catch (error) {
          console.error(`添加设备 ${device.material} 标记失败:`, error);
        }


      });
    },

    /**
     * 显示设备信息
     */
    showDeviceInfo(device) {
      this.infoCardData.markerInfo = device;
      this.infoCardData.startDate = new Date(
        device.startDate
      ).getTime();
      this.infoCardData.endDate = new Date().getTime();
      this.shopPopup = true;

      // 设备目标框
      this.loadDeviceTargetPoint();
    },

    /**
     * 关闭信息卡片
     */
    closeInfoCard() {
      this.shopPopup = false;
      this.closePolyline();

      // 清空设备目标框
      this.clearTargetLayers();
    },

    /**
     * 显示设备轨迹
     */
    showPolyline() {
      this.isTrackActive = true;
      let prelongitude, prelatitude;

      const deviceId = this.getDeviceIdByInfo();
      if (!deviceId) {
        this.$modal.msgError("无法获取设备ID！");
        return;
      }

      if (!this.infoCardData.startDate || !this.infoCardData.endDate) {
        this.$modal.msgError("请选择起始日期和结束日期！");
        return;
      }

      // 获取设备轨迹数据
      getTrail(deviceId, this.infoCardData.startDate, this.infoCardData.endDate).then((res) => {
        if (res.code !== 200 || res.rows.length === 0) {
          this.$modal.msgError("没有轨迹数据！");
          return;
        }

        // 清除之前的轨迹
        if (this.trackPolyline) {
          this.map.removeLayer(this.trackPolyline);
          this.trackPolyline = null;
        }

        // 处理轨迹数据，过滤异常点
        this.routeInfo1 = [];
        prelongitude = res.rows[res.rows.length - 1].longitude;
        prelatitude = res.rows[res.rows.length - 1].latitude;

        const trailStartPoint = res.rows[res.rows.length - 1];

        // 检查设备位置与轨迹起始点的差异
        const device = this.deviceList.find(car => car.id === deviceId);
        if (device) {
          // 如果设备位置与轨迹起始点位置不一致，更新设备位置
          if (
            Math.abs(device.lr[0] - trailStartPoint.longitude) > 0.00001 ||
            Math.abs(device.lr[1] - trailStartPoint.latitude) > 0.00001
          ) {
            device.lr[0] = trailStartPoint.longitude;
            device.lr[1] = trailStartPoint.latitude;

            // 如果有标记，更新标记位置
            if (this.markers && this.markers.length > 0) {
              const deviceMarker = this.markers.find(marker =>
                marker.getLatLng().lat === device.lr[1] &&
                marker.getLatLng().lng === device.lr[0]
              );
              if (deviceMarker) {
                deviceMarker.setLatLng([trailStartPoint.latitude, trailStartPoint.longitude]);
              }
            }
          }
        }

        // 处理轨迹点，过滤异常数据
        for (let item of res.rows.slice().reverse()) {
          // 过滤经度变化过大的点
          if (
            item.longitude - prelongitude > 5 ||
            item.longitude - prelongitude < -5
          ) {
            prelongitude = item.longitude;
            prelatitude = item.latitude;
            continue;
          }

          // 过滤纬度变化过大的点
          if (
            item.latitude - prelatitude > 5 ||
            item.latitude - prelatitude < -5
          ) {
            prelongitude = item.longitude;
            prelatitude = item.latitude;
            continue;
          }

          // 过滤无效坐标点
          if (
            (item.longitude != 0 && item.latitude != 0) ||
            (item.longitude != 0 && item.latitude != 90)
          ) {
            let temp = {
              lon: item.longitude,
              lat: item.latitude,
              time: item.sendDate,
              id: deviceId
            };

            this.routeInfo1.push(temp);
            prelongitude = item.longitude;
            prelatitude = item.latitude;
          }
        }

        // 创建轨迹线路
        const routePoints = this.routeInfo1.map(point => [point.lat, point.lon]);

        // 使用Leaflet创建轨迹线
        this.trackPolyline = L.polyline(routePoints, {
          color: "#459c50",
          weight: 9,
          opacity: 0.8,
          smoothFactor: 1
        }).addTo(this.map);
        // 创建箭头渲染层
        this.arrowLayer = L.canvas({ padding: 0.5 });
        this.map.addLayer(this.arrowLayer);

        // 创建箭头渲染器
        this.arrowRenderer = L.polyline(routePoints, {
          color: 'white',
          weight: 1,
          opacity: 0,
          renderer: this.arrowLayer,
          interactive: false
        }).addTo(this.map);

        // 添加自定义渲染函数
        this.arrowLayer.on('update', this.drawArrows.bind(this));

        // 触发初始渲染
        this.map.fire('moveend');
        // 添加箭头装饰器
        // this.trackArrows = L.polylineDecorator(this.trackPolyline, {
        //   patterns: [
        //     {
        //       offset: '10%',
        //       repeat: 50, // 每100像素重复一次
        //       symbol: L.Symbol.arrowHead({
        //         pixelSize: 8,  // 箭头大小
        //         polygon: false, // 使用线条而非多边形
        //         pathOptions: {
        //           stroke: true,
        //           color: '#ffffff', // 白色箭头
        //           weight: 1        // 箭头线宽
        //         }
        //       })
        //     }
        //   ]
        // }).addTo(this.map);

        // 调整地图视图到轨迹范围
        if (routePoints.length > 0) {
          this.map.fitBounds(this.trackPolyline.getBounds());
        }

        // 如果地图缩放级别足够大，显示轨迹点
        const zoom = this.map.getZoom();
        if (zoom >= 10) {
          this.showTrackPoints();
        }
      });
    },
    /**
     * 绘制箭头
     */
    drawArrows() {
      if (!this.arrowRenderer || !this.arrowLayer) return;

      const ctx = this.arrowLayer._ctx;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const points = this.arrowRenderer.getLatLngs();
      if (points.length < 2) return;

      // 每隔一定距离绘制一个箭头
      const arrowSpacing = 50; // 像素距离

      for (let i = 1; i < points.length; i++) {
        const p1 = this.map.latLngToLayerPoint(points[i-1]);
        const p2 = this.map.latLngToLayerPoint(points[i]);

        // 计算段长度
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);

        // 计算段上的箭头数量
        const arrowCount = Math.floor(segmentLength / arrowSpacing);

        if (arrowCount > 0) {
          // 计算单位向量
          const unitX = dx / segmentLength;
          const unitY = dy / segmentLength;

          // 绘制箭头
          for (let j = 1; j <= arrowCount; j++) {
            const ratio = j / (arrowCount + 1);
            const arrowX = p1.x + dx * ratio;
            const arrowY = p1.y + dy * ratio;

            // 绘制箭头
            this.drawArrow(ctx, arrowX, arrowY, unitX, unitY);
          }
        }
      }
    },

    /**
     * 绘制单个箭头
     */
    drawArrow(ctx, x, y, dirX, dirY) {
      const arrowSize = 5; // 增大箭头尺寸

      // 计算箭头角度
      const angle = Math.atan2(dirY, dirX);

      // 保存当前状态
      ctx.save();

      // 移动到箭头位置
      ctx.translate(x, y);
      ctx.rotate(angle);

      // 绘制类似"》"的箭头
      ctx.beginPath();

      // 绘制"》"形状的第一笔
      ctx.moveTo(-arrowSize, -arrowSize/1.5);
      ctx.lineTo(0, 0);

      // 绘制"》"形状的第二笔
      ctx.moveTo(0, 0);
      ctx.lineTo(-arrowSize, arrowSize/1.5);

      // 设置样式
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.stroke();

      // 恢复状态
      ctx.restore();
    },
    /**
     * 关闭轨迹
     */
    closePolyline() {
      if (this.trackPolyline) {
        this.map.removeLayer(this.trackPolyline);
        this.trackPolyline = null;
      }
      // 移除箭头渲染器
      if (this.arrowRenderer) {
        this.map.removeLayer(this.arrowRenderer);
        this.arrowRenderer = null;
      }

      // 移除箭头图层
      if (this.arrowLayer) {
        this.map.removeLayer(this.arrowLayer);
        this.arrowLayer = null;
      }
      // if (this.trackArrows) {
      //   this.map.removeLayer(this.trackArrows);
      //   this.trackArrows = null;
      // }
      this.hideTrackPoints();
      this.isTrackActive = false;
    },

    /**
     * 显示轨迹点
     */
    showTrackPoints() {
      if (!this.trackPointsLayer) {
        // 确保不会重复添加
        this.trackPointsLayer = L.layerGroup();

        // 为每个轨迹点创建标记
        this.routeInfo1.forEach(point => {
          const trackPoint = L.circleMarker([point.lat, point.lon], {
            radius: 4,
            fillColor: 'blue',
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            interactive: true, // 确保点可交互
            bubblingMouseEvents: false // 防止事件冒泡
          });
          // 存储设备ID和时间信息，与olmap保持一致
          trackPoint.id = point.id;
          trackPoint.sendDate = point.time;
          this.trackPointsLayer.addLayer(trackPoint);
        });

        this.map.addLayer(this.trackPointsLayer);
      }
    },

    /**
     * 隐藏轨迹点
     */
    hideTrackPoints() {
      if (this.trackPointsLayer) {
        this.map.removeLayer(this.trackPointsLayer);
        this.trackPointsLayer = null;
      }
    },

    /**
     * 显示轨迹点提示框
     */
    showRouteTooltip(x, y, nearestPoint) {
      // 如果已有提示框，先移除
      if (this.currentTooltip) {
        this.currentTooltip.remove();
      }

      // 创建提示框元素
      const tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.border = "1px solid black";
      tooltip.style.padding = "5px";
      tooltip.style.borderRadius = "3px";
      tooltip.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
      tooltip.style.zIndex = "1000";

      // 动态显示点的信息
      tooltip.innerHTML = `
        <div>
          <div>${parseTime(nearestPoint.sendDate) || '未知'} - ${nearestPoint.id}</div>
          <div>经度: ${nearestPoint.lon}, 纬度: ${nearestPoint.lat}</div>
        </div>
      `;

      // 定位提示框
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;

      // 添加到页面
      document.body.appendChild(tooltip);

      // 保存当前显示的提示框
      this.currentTooltip = tooltip;

      // 自动关闭弹窗
      setTimeout(() => {
        if (tooltip && tooltip.parentNode) {
          tooltip.remove();
        }
      }, 3000);
    },

    /**
     * 根据当前显示的设备信息获取设备ID
     */
    getDeviceIdByInfo() {
      const device = this.deviceList.find(
        (item) =>
          item.material === this.infoCardData.markerInfo.material &&
          item.lr[0] === this.infoCardData.markerInfo.lr[0] &&
          item.lr[1] === this.infoCardData.markerInfo.lr[1]
      );
      return device ? device.id : null;
    },

    /**
     * 绘制轨迹
     */
    drawPolyline(routeInfo) {
      if (this.trackPolyline) {
        this.map.removeLayer(this.trackPolyline);
        this.trackPolyline = null;
      }

      // 创建 Polyline 并添加到地图上
      this.trackPolyline = L.polyline(routeInfo, {
        data() {
          return {
            trackPolyline: null,
            trackPointsLayer: null,
            routeInfo1: [],
            isTrackActive: false,
          };
        },
        color: "blue",
        weight: 3,
        opacity: 0.7,
      }).addTo(this.map);

      // 调整地图视图到轨迹范围
      this.map.fitBounds(this.trackPolyline.getBounds());
    },

    /**
     * 关闭轨迹
     */


    /**
     * 将十进制度数转换为度分秒格式 (与olmap保持一致)
     */
    D2Dms(d_data = 0) {
      if (d_data === null || d_data === undefined) {
        return "";
      }

      let degree = parseInt(d_data);
      let min = Number(Math.abs(d_data - degree) * 60).toFixed(5);
      return degree + "°" + min + "′";
    },

    /**
     * 路由切换
     */
    routeToGaode() {
      this.$router.push("/map/gaodemap");
    },
    routeToGoogle() {
      this.$router.push("/map/olmap");
    },
    routeToWindy() {
      this.$router.push("/map/windymap");
    },

    /**
     * 发送指令
     */
    sendCmdPage(infoCardData) {
      this.$router.push({
        path: "/cmdsend",
        query: {
          deviceId: infoCardData.markerInfo.id,
        },
      });
      // 判断是滑翔机还是信标机
    },

    /**
     * 打开设备状态浮动窗口
     */
    openDeviceDetail() {
      // 设置参数
      this.deviceDetailParams = {
        deviceId: this.infoCardData.markerInfo.id,
        startDate: this.infoCardData.startDate,
        endDate: this.infoCardData.endDate,
      };
      // 显示加载状态
      this.iframeLoading = true;
      // 显示弹窗
      this.showGliderDetail = true;
    },

    /**
     * 关闭设备状态浮动窗口
     */
    closeDeviceDetail() {
      this.showGliderDetail = false;
      this.iframeLoading = false;
    },

    /**
     * iframe 加载完成
     */
    onIframeLoad() {
      this.iframeLoading = false;
    },

    /**
     * 在新标签页打开设备详情
     */
    openInNewTab() {
      const url = this.deviceDetailUrl;
      window.open(url, '_blank');
    },

    /**
     * 查询AIS信息
     */
    ol_queryAIS() {
      this.$modal.msgWarning("AIS信息功能需要在私有地图中使用");
    },

    /**
     * 查询船讯网AIS信息
     */
    ol_queryAIS_1() {
      this.$modal.msgWarning("船讯网AIS信息功能需要在私有地图中使用");
    },

    /**
     * 导航规划
     */
    enablePlan() {
      this.$modal.msgWarning("导航规划功能需要在私有地图中使用");
    },

    /**
     * 数据导出-下载Excel
     */
    downloadExcel() {
      this.$confirm("是否确认导出设备详情数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.infoCardData.downloading = true;
          return detailExcel(
            this.infoCardData.markerInfo.id,
            this.infoCardData.startDate,
            this.infoCardData.endDate
          );
        })
        .then((res) => {
          this.download(res.data.url);
          this.infoCardData.downloading = false;
        })
        .catch(() => {
          this.infoCardData.downloading = false;
        });
    },

    /**
     * 下载文件
     */
    download(url) {
      window.location.href = url;
    },

    /**
     * 标签显示开关
     */
    labelSwitch() {
      this.labelIsShow = !this.labelIsShow;
      if (this.labelIsShow) {
        this.showAllLabels();
      } else {
        this.closeAllLabels();
      }
    },

    /**
     * 显示所有设备标签
     */
    showAllLabels() {
      if (!this.map || !this.deviceList || this.deviceList.length === 0) {
        return;
      }

      // 清除旧标签
      this.closeAllLabels();

      // 为每个设备添加标签
      this.deviceList.forEach((device) => {
        try {
          const lat = parseFloat(device.lr[1]);
          const lon = parseFloat(device.lr[0]);

          if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
            return;
          }

          // 处理设备状态标签信息
          const stateText = device.isError ? "异常" : "正常";
          const labelText = `${device.deviceName}|${stateText}`;

          // 创建标签HTML元素
          // 动态计算标签宽度来实现水平居中
          const tempDiv = document.createElement('div');
          tempDiv.className = 'label-content';
          tempDiv.style.position = 'absolute';
          tempDiv.style.visibility = 'hidden';
          tempDiv.textContent = labelText;
          document.body.appendChild(tempDiv);
          const labelWidth = tempDiv.offsetWidth;
          document.body.removeChild(tempDiv);

          const labelDiv = L.divIcon({
            className: 'device-label',
            html: `<div class="label-content ${device.isError ? 'error' : 'normal'}">${labelText}</div>`,
            iconAnchor: [labelWidth / 2, 45]  // 水平居中
          });

          // 创建标签标记
          const labelMarker = L.marker([lat, lon], {
            icon: labelDiv,
            interactive: false,
            zIndexOffset: 50
          });

          labelMarker.addTo(this.map);
          this.labelMarkers.push(labelMarker);
        } catch (error) {
          console.error(`添加设备 ${device.deviceName} 标签失败:`, error);
        }
      });
    },

    /**
     * 关闭所有标签
     */
    closeAllLabels() {
      this.labelMarkers.forEach(marker => {
        if (marker && this.map) {
          try {
            this.map.removeLayer(marker);
          } catch (e) {
            console.error('移除标签失败:', e);
          }
        }
      });
      this.labelMarkers = [];
    },

    /**
     * 测距功能开关
     */
    distanceMeasure() {
      if (this.rulerFlag) {
        // 关闭测距
        this.rulerFlag = false;
        this.clearMeasure();
        this.map.off('click', this.measureClickHandler);
        this.map.off('mousemove', this.measureMoveHandler);
        this.map.off('dblclick', this.measureDblClickHandler);
        // 恢复地图的默认光标
        this.map.getContainer().style.cursor = '';
        // 重新启用双击缩放
        this.map.doubleClickZoom.enable();
      } else {
        // 打开测距
        this.rulerFlag = true;
        this.measure.isDrawing = false;
        this.measure.currentPoints = [];

        // 设置光标为十字
        this.map.getContainer().style.cursor = 'crosshair';

        // 绑定点击事件
        this.measureClickHandler = (e) => this.handleMeasureClick(e);
        this.measureMoveHandler = (e) => this.handleMeasureMove(e);
        this.measureDblClickHandler = (e) => {
          // 阻止默认行为和事件传播
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          this.finishMeasure();
        };

        // 禁用地图的双击缩放
        this.map.doubleClickZoom.disable();

        this.map.on('click', this.measureClickHandler);
        this.map.on('mousemove', this.measureMoveHandler);
        this.map.on('dblclick', this.measureDblClickHandler);
      }
    },

    /**
     * 处理测距点击事件
     */
    handleMeasureClick(e) {
      const { lat, lng } = e.latlng;

      if (!this.measure.isDrawing) {
        // 开始新的测量
        this.measure.isDrawing = true;
        this.measure.currentPoints = [[lat, lng]];
      } else {
        // 添加新点
        this.measure.currentPoints.push([lat, lng]);
      }
    },

    /**
     * 处理测距鼠标移动事件
     */
    handleMeasureMove(e) {
      if (!this.measure.isDrawing || this.measure.currentPoints.length === 0) {
        return;
      }

      // 移除临时线段、标记和圆点
      if (this.measure.tempPolyline) {
        this.map.removeLayer(this.measure.tempPolyline);
      }
      if (this.measure.tempTooltip) {
        this.map.removeLayer(this.measure.tempTooltip);
      }
      if (this.measure.tempMarker) {
        this.map.removeLayer(this.measure.tempMarker);
      }

      const { lat, lng } = e.latlng;
      const tempPoints = [...this.measure.currentPoints, [lat, lng]];

      // 绘制临时线段
      this.measure.tempPolyline = L.polyline(tempPoints, {
        color: 'rgba(255, 255, 255, 0.5)',
        weight: 4,
        dashArray: '10, 10'
      }).addTo(this.map);

      // 创建跟随鼠标的透明圆点
      this.measure.tempMarker = L.circleMarker([lat, lng], {
        radius: 5,
        color: 'rgba(255, 255, 255, 0.5)',
        fillColor: 'rgba(255, 255, 255, 0.5)',
        fillOpacity: 0.5,
        weight: 2
      }).addTo(this.map);

      // 计算并显示临时距离
      const distance = this.calculateTotalDistance(tempPoints);
      const distanceText = this.formatDistance(distance);

      // 创建临时提示框
      this.measure.tempTooltip = L.tooltip({
        permanent: true,
        direction: 'top',
        className: 'measure-tooltip-temp'
      })
        .setLatLng([lat, lng])
        .setContent(distanceText)
        .addTo(this.map);
    },

    /**
     * 结束测量
     */
    finishMeasure() {
      if (this.measure.currentPoints.length > 1) {
        // 移除临时元素
        if (this.measure.tempPolyline) {
          this.map.removeLayer(this.measure.tempPolyline);
          this.measure.tempPolyline = null;
        }
        if (this.measure.tempTooltip) {
          this.map.removeLayer(this.measure.tempTooltip);
          this.measure.tempTooltip = null;
        }
        if (this.measure.tempMarker) {
          this.map.removeLayer(this.measure.tempMarker);
          this.measure.tempMarker = null;
        }

        // 绘制最终的黄色线段
        const polyline = L.polyline(this.measure.currentPoints, {
          color: '#ffcc33',
          weight: 4
        }).addTo(this.map);

        this.measure.polylines.push(polyline);

        // 计算并显示总距离
        const distance = this.calculateTotalDistance(this.measure.currentPoints);
        const distanceText = this.formatDistance(distance);

        // 在最后一个点显示总距离标签
        const lastPoint = this.measure.currentPoints[this.measure.currentPoints.length - 1];
        const tooltip = L.tooltip({
          permanent: true,
          direction: 'top',
          className: 'measure-tooltip',
          offset: [0, -15]
        })
          .setLatLng(lastPoint)
          .setContent(distanceText)
          .addTo(this.map);

        this.measure.tooltips.push(tooltip);
      }

      this.measure.isDrawing = false;
      this.measure.currentPoints = [];
    },

    /**
     * 计算总距离（米）
     */
    calculateTotalDistance(points) {
      if (points.length < 2) return 0;

      let totalDistance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const from = L.latLng(points[i]);
        const to = L.latLng(points[i + 1]);
        totalDistance += from.distanceTo(to);
      }

      return totalDistance;
    },

    /**
     * 格式化距离显示
     */
    formatDistance(distance) {
      if (distance > 1000) {
        return '总长:' + Math.round((distance / 1000) * 100) / 100 + ' km';
      } else {
        return '总长:' + Math.round(distance * 100) / 100 + ' m';
      }
    },

    /**
     * 清除所有测距元素
     */
    clearMeasure() {
      // 清除线段
      this.measure.polylines.forEach(polyline => {
        if (polyline && this.map) {
          this.map.removeLayer(polyline);
        }
      });
      this.measure.polylines = [];

      // 清除标记
      this.measure.markers.forEach(marker => {
        if (marker && this.map) {
          this.map.removeLayer(marker);
        }
      });
      this.measure.markers = [];

      // 清除提示框
      this.measure.tooltips.forEach(tooltip => {
        if (tooltip && this.map) {
          this.map.removeLayer(tooltip);
        }
      });
      this.measure.tooltips = [];

      // 清除临时元素
      if (this.measure.tempPolyline) {
        this.map.removeLayer(this.measure.tempPolyline);
        this.measure.tempPolyline = null;
      }
      if (this.measure.tempTooltip) {
        this.map.removeLayer(this.measure.tempTooltip);
        this.measure.tempTooltip = null;
      }
      if (this.measure.tempMarker) {
        this.map.removeLayer(this.measure.tempMarker);
        this.measure.tempMarker = null;
      }

      this.measure.isDrawing = false;
      this.measure.currentPoints = [];
    },

    // ==================== 围栏管理相关方法 ====================

    /**
     * 电子围栏管理-获取或刷新已被添加的围栏区域
     */
    getAllArea() {
      let tempAreaList = [];
      let data = {
        pageNum: -1,
        pageSize: 10,
      };
      if (this.$store.getters.permissions.indexOf("map:area:page") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1) {
        getAllAreaInfo(data).then((res) => {
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              name: item.name,
              type: item.type,
              status: item.status,
              visible: item.visible,
              pointList: []
            };
            let tempPointList = [];
            for (let item1 of item.areaPointResVOS) {
              let temp_area = {
                gpsX: item1.gpsX,
                gpsY: item1.gpsY,
                orderNumber: item1.orderNumber,
                status: item1.status,
              };
              tempPointList.push(temp_area);
            }
            tempPointList.sort(function (a, b) {
              return a.orderNumber - b.orderNumber;
            });
            for (let item2 of tempPointList) {
              temp.pointList.push([item2.gpsX, item2.gpsY]);
            }
            tempAreaList.push(temp);
          }
          this.areaManage.areaList = tempAreaList;
        });
      }
    },

    /**
     * 围栏管理点击新增按钮-设置为新增状态并展示表单
     */
    showAreaAdd() {
      this.areaManage.areaForm = {
        name: "",
        pointList: [],
        drawingPath: [],
        visible: true,
        isShow: true,
      };
      this.areaManage.isAdd = true;
      this.areaManage.editing = true;
      this.areaManage.areaForm.isShow = true;

      // 添加地图点击事件监听
      this.addAreaClickListener();
    },

    /**
     * 电子围栏区域编辑按钮处理
     */
    handleAreaUpdate(areaInfo) {
      this.areaManage.areaForm.id = areaInfo.id;
      this.areaManage.areaForm.name = areaInfo.name;
      this.areaManage.areaForm.visible = areaInfo.visible;
      this.areaManage.areaForm.IsCircle = areaInfo.type === '2';

      let tempPointList = [];
      for (let item of areaInfo.pointList) {
        tempPointList.push([item[0], item[1]]);
      }
      this.areaManage.areaForm.pointList = tempPointList;

      this.areaManage.isAdd = false;
      this.areaManage.editing = true;
      this.areaManage.areaForm.isShow = true;

      // 显示编辑中的围栏
      this.updateDrawingPolygon();

      // 添加地图点击事件监听
      this.addAreaClickListener();
    },

    /**
     * 电子围栏区域删除按钮处理
     */
    handleAreaDelete(areaInfo) {
      this.$confirm("是否确认删除名为" + areaInfo.name + "的区域?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          let req = [];
          req.push(areaInfo.id);
          return deleteAreaInfo(req);
        })
        .then((res) => {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.getAllArea();
        });
    },

    /**
     * 关闭新增/编辑区域框
     */
    closeAreaForm() {
      this.areaManage.areaForm.isShow = false;
      this.areaManage.editing = false;

      // 清除绘制中的多边形
      if (this.drawPolygon) {
        this.map.removeLayer(this.drawPolygon);
        this.drawPolygon = null;
      }

      // 移除地图点击事件监听
      this.removeAreaClickListener();
    },

    /**
     * 开始绘制圆形围栏
     */
    StartDrawingCircle() {
      this.areaManage.areaForm.IsCircle = true;
    },

    /**
     * 区域新增/编辑时点击保存提交后的操作
     */
    submitAreaForm() {
      if (!this.areaManage.areaForm.name) {
        this.$message({
          message: "请输入区域名称！",
          type: "warning",
        });
        return;
      }

      if (this.areaManage.areaForm.pointList.length < 2) {
        this.$message({
          message: "请至少添加两个围栏点！",
          type: "warning",
        });
        return;
      }

      if (this.areaManage.isAdd) {
        // 区域新增操作
        let queryParam = {
          name: this.areaManage.areaForm.name,
          visible: this.areaManage.areaForm.visible,
          status: "0",
          type: '1',
          areaPointAddReqVOS: [],
        };

        for (let index in this.areaManage.areaForm.pointList) {
          let item = this.areaManage.areaForm.pointList[index];
          queryParam.areaPointAddReqVOS.push({
            gpsX: item[0],
            gpsY: item[1],
            orderNumber: parseInt(index) + 1,
            status: "0",
          });
        }

        // 若是圆形
        if (this.areaManage.areaForm.IsCircle) {
          queryParam.type = '2'
          // 只保留前两个点
          if (queryParam.areaPointAddReqVOS.length > 2) {
            queryParam.areaPointAddReqVOS = queryParam.areaPointAddReqVOS.slice(0, 2)
          }
        }

        addAreaInfo(queryParam).then((res) => {
          this.$message({
            message: "电子围栏区域添加成功！",
            type: "success",
          });
          this.closeAreaForm();
          this.getAllArea();
        });
      } else {
        // 区域编辑操作
        let queryParam = {
          id: this.areaManage.areaForm.id,
          name: this.areaManage.areaForm.name,
          visible: this.areaManage.areaForm.visible,
          status: '0',
          type: '1',
          areaPointUpdateReqVOS: []
        };

        for (let index in this.areaManage.areaForm.pointList) {
          let item = this.areaManage.areaForm.pointList[index];
          queryParam.areaPointUpdateReqVOS.push({
            gpsX: item[0],
            gpsY: item[1],
            orderNumber: parseInt(index) + 1,
            status: "0",
          });
        }
        // 若是圆形
        if (this.areaManage.areaForm.IsCircle) {
          queryParam.type = '2'
          // 只保留前两个点
          if (queryParam.areaPointUpdateReqVOS.length > 2) {
            queryParam.areaPointUpdateReqVOS = queryParam.areaPointUpdateReqVOS.slice(0, 2)
          }
        }

        updateAreaInfo(queryParam).then((res) => {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.closeAreaForm();
          this.getAllArea();
        });
      }
    },

    /**
     * 删除表格中的点
     */
    deletePointRow(index, rows) {
      rows.splice(index, 1);
      this.updateDrawingPolygon();
    },

    /**
     * 添加地图点击事件监听（用于围栏编辑）
     */
    addAreaClickListener() {
      if (!this.areaClickHandler) {
        this.areaClickHandler = (e) => {
          if (!this.areaManage.editing) return;

          const { lat, lng } = e.latlng;

          if (this.areaManage.areaForm.IsCircle) {
            // 圆形围栏模式
            if (this.areaManage.areaForm.pointList.length < 2) {
              this.areaManage.areaForm.pointList.push([lng, lat]);
            }
          } else {
            // 多边形模式
            this.areaManage.areaForm.pointList.push([lng, lat]);
          }

          this.updateDrawingPolygon();
        };

        this.map.on('click', this.areaClickHandler);
      }
    },

    /**
     * 移除地图点击事件监听
     */
    removeAreaClickListener() {
      if (this.areaClickHandler) {
        this.map.off('click', this.areaClickHandler);
        this.areaClickHandler = null;
      }
    },

    /**
     * 更新绘制中的多边形
     */
    updateDrawingPolygon() {
      // 清除旧的绘制多边形
      if (this.drawPolygon) {
        this.map.removeLayer(this.drawPolygon);
        this.drawPolygon = null;
      }

      if (this.areaManage.areaForm.pointList.length === 0) {
        return;
      }

      let coordinates;

      if (this.areaManage.areaForm.pointList.length === 2 && this.areaManage.areaForm.IsCircle) {
        // 圆形围栏（有且仅有2个点）
        const [center, edge] = this.areaManage.areaForm.pointList;
        const radius = this.computeDistance(center, edge);
        coordinates = this.createCircle(center, radius, 720);
        this.areaManage.areaForm.drawingPath = coordinates;
      } else {
        // 多边形围栏
        coordinates = this.areaManage.areaForm.pointList.map(point => [point[1], point[0]]);
      }

      // 创建多边形
      this.drawPolygon = L.polygon(coordinates, {
        color: 'rgba(0,180,0,0.8)',
        fillColor: 'rgba(230,150,10,0.8)',
        fillOpacity: 0.5,
        weight: 2
      }).addTo(this.map);
    },

    /**
     * 计算圆形围栏半径
     */
    computeDistance(from, to) {
      if (!from || !to) return 0;

      function toRad(value) {
        return (value * Math.PI) / 180;
      }
      const R = 6378137; // 地球半径（单位：米）
      const dLat = toRad(to[1] - from[1]);
      const dLng = toRad(to[0] - from[0]);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from[1])) *
        Math.cos(toRad(to[1])) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 返回距离（单位：米）
    },

    /**
     * 创建圆形的路径点
     */
    createCircle(center, radius, points) {
      const path = [];
      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const destination = computeDestinationPoint(
          { latitude: center[1], longitude: center[0] },
          radius,
          angle
        );
        path.push([destination.latitude, destination.longitude]);
      }
      path.push(path[0]);
      return path;
    },

    /**
     * 渲染所有围栏到地图上
     */
    renderAllAreas() {
      // 确保地图已初始化
      if (!this.map || !this.map.addLayer) {
        return;
      }

      // 清除所有旧的围栏
      this.areaPolygons.forEach(polygon => {
        if (polygon) {
          this.map.removeLayer(polygon);
        }
      });
      this.areaPolygons = [];

      // 渲染新的围栏
      for (let area of this.areaManage.areaList) {
        if (area.visible) {
          let coordinates;

          if (area.type === '2') { // 圆形
            // 圆形围栏
            const [center, edge] = area.pointList;
            const radius = this.computeDistance(center, edge);
            coordinates = this.createCircle(center, radius, 720);
          } else if (area.type === '1') { // 多边形
            // 多边形围栏
            coordinates = area.pointList.map(point => [point[1], point[0]]);
          }

          const polygon = L.polygon(coordinates, {
            color: 'rgba(0,180,0,0.8)',
            fillColor: 'rgba(255,0,0,0)',
            fillOpacity: 0,
            weight: 2
          }).addTo(this.map);

          this.areaPolygons.push(polygon);
        }
      }
    },
  },
  watch: {
    // 监听围栏列表变化，自动渲染到地图
    'areaManage.areaList': {
      handler: function(newVal, oldVal) {
        this.renderAllAreas();
      },
      deep: true,
    },
  },
};
</script>

<style>
.glider-detail-dialog .el-dialog__body {
  padding: 0;
  overflow: hidden;
  height: auto;
}

.glider-detail-dialog .el-dialog__header {
  color: #fff;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}

/* 设备标签样式 - 必须在全局样式中，因为 Leaflet 动态创建的元素不在 Vue scoped 作用域内 */
.device-label {
  background: transparent !important;
  border: none !important;
}

.label-content {
  background-color: #12223b !important;
  color: white !important;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  font-family: "黑体", "SimHei", sans-serif;
  font-weight: normal;
  white-space: nowrap;
  text-align: center;
  border: 1px solid #0000ff;
  display: inline-block;
}

.label-content.normal {
  color: #00ff7f !important;
}

.label-content.error {
  color: #ff0000 !important;
}

</style>



<style scoped>

.main {
  height: 100%;
  width: 100%;
}
.navbar {
  position: absolute;
  width: calc(100% - 35px);
}

#windy {
  width: 100%;
  height: calc(100vh);
}

/* 添加以下CSS规则，覆盖Leaflet默认的鼠标样式 */
::v-deep .leaflet-grab {
  cursor: default !important;
}

::v-deep .leaflet-container {
  cursor: default !important;
}

::v-deep .leaflet-interactive {
  cursor: default !important;
}
.tools {
  z-index: 2;
  position: absolute;
  bottom: 2px;
  right: 2px;
  border: 1px solid rgb(255, 255, 255);
  background-color: #00000036;
  border-radius: 4px;
  text-align: center;
}

.tools table tr {
  height: 30px;
}

/* 新的信息卡片样式 */
.info-card-new {
  z-index: 1;
  position: absolute;
  top: 1px;
  left: 1px;
  width: 325px;
}

/* 新增的Element UI容器样式 */
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #ffffff;
  text-align: left;
  line-height: 24px;
}

.el-aside {
  background-color: #dddddd;
  color: #333;
  text-align: left;
  line-height: 60px;
  margin-bottom: 0;
  padding: 0 0;
}

.el-main {
  background-color: #f0eff4;
  color: #7c7c7c;
  text-align: left;
  line-height: 30px;
  padding: 1px;
}

body > .el-container {
  margin-bottom: 0;
}

.search-box >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0.35);
  color: #ffffff;
}

/* 信息卡片图标样式 */
.info-card-new-icon {
  font-size: 23px;
  text-align: center;
}

.info-card-new-text {
  color: #2d2d2d;
  font-size: 18px;
}

/* 头部样式 */
.header1 {
  background-color: #484848;
  color: #cecece;
}

.header2 {
  background-color: #177abb;
  color: #c8f4ff;
  font-size: 18px;
  line-height: 40px;
  left: 40px;
}

/* 按钮样式 */
.button {
  color: #0078d7;
  /*font-weight: bold;*/
  /*margin: 0 10px;*/
  margin-left: 0;
}

.button:hover {
  color: #006abc;
}

/* 添加设备提示框样式 */
::v-deep .device-tooltip {
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #444;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

::v-deep .error-icon {
  filter: hue-rotate(140deg); /* 为错误状态的图标添加视觉区分 */
}

.overInfo {
  width: 240px;
  z-index: 2;
  position: absolute;
  bottom: 110px;
  left: 3px;
  margin-right: 1rem;
}

</style>
