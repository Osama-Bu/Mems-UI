<template>
  <div class="main">
    <div class="navbar">
      <navbar/>
    </div>
    <div class="amap-wrapper">
      <!-- 组件关键代码 -->
      <el-amap
        ref="gaodeMap"
        class="amap-box"
        :vid="'amap-vue'"
        :events="mapEvents"
        :center="center"
        :zoom="zoom"
        :zooms="zooms"
        :expandZoomRange="expandZoomRange"
        @AMAP_READY_EVENT="mapComplete()"
      >
        <!-- 新悬浮框 -->
        <div
          class="info-card-new"
          v-show="infoCardIsShow"
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
              <!--              <tr>-->
              <!--                <td>{{ infoCardData.markerInfo.orgName }}</td>-->
              <!--                <td style="color: #484848">___</td>-->
              <!--                <td>{{ infoCardData.markerInfo.commWays }}</td>-->
              <!--              </tr>-->
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
                  {{ infoCardData.markerInfo.datetime }}
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
                  <el-main>
                    <div>
                      <div style="padding-top: 1px">
                        <el-date-picker
                          v-model="infoCardData.startdate"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="请选择开始时间"
                          style="width: 195px"
                        >
                        </el-date-picker>
                        <el-date-picker
                          v-model="infoCardData.enddate"
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
                          v-hasPermi="['map:device:trail']"
                          @click="showPolyline()"
                          v-if="lazy === false"
                        >显示轨迹
                        </el-button>
                        <el-button
                          type="text"
                          class="button"
                          v-hasPermi="['map:device:trail']"
                          @click="lazyShowPolyline()"
                          v-else
                        >显示轨迹
                        </el-button>
                        <el-button
                          type="text"
                          class="button"
                          v-hasPermi="['map:device:trail']"
                          @click="closePolyline()"
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
                        @click="toDeviceDetailsPage()"
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
                        @click="queryAis()"
                        v-has-permi="['map:aisinfo']"
                      >
                        <div class="info-card-new-icon">
                          <i class="el-icon-edit-outline"></i>
                        </div>
                        <div style="font-size: 10px">AIS信息</div>
                      </el-button>
                    </div>
                  </el-main>
                  <!-- <el-main>
										<div style="text-align:center;">
											<el-button type="text" class="button" style="color: #55aaff;"
												@click="showAutoCruiseMenu()">
												<div class="info-card-new-icon">
													<i class="el-icon-guide"></i>
												</div>
												<div style="font-size: 10px;">自动巡航</div>
											</el-button>
										</div>
									</el-main> -->
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

              <!-- <el-container>
								<el-aside width="47px">
									<div class="info-card-new-icon">
										<i class="el-icon-coordinate"></i>
									</div>
								</el-aside>
								<el-main></el-main>
								<el-main>
									<div style="text-align:center;">

										<div style="text-align:center;">
											<el-button type="text" class="button" style="color: #2d2d2d;"
												@click="enablePicker()">坐标拾取
											</el-button>
										</div>
										<div style="text-align:center;">
											<el-button type="text" class="button" style="color: #2d2d2d;"
												@click="unablePicker()">关闭拾取
											</el-button>
										</div>
									</div>
								</el-main>
								<el-main></el-main>
							</el-container> -->
            </div>
          </el-collapse-transition>
        </div>

        <!-- 新导航规划框 -->
        <div class="info-card-new" v-show="planCardIsShow" style="width: 405px">
          <el-container>
            <el-header class="header1" style="height: 48px">
              <div style="color: #cb9d1d; font-size: 24px">
                <td>导航规划 ID:{{ infoCardData.markerInfo.cdId }}</td>
                <td>
                  <el-button
                    type="primary"
                    plain
                    class="button"
                    @click="showAutoCruiseMenu()"
                    style="margin-left: 30px; padding: 2px"
                  >自动巡航
                  </el-button>
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
                @click="closePlanCard()"
              >X
              </el-button
              >
              <tr>
                <td>当前位置：{{ infoCardData.markerInfo.lr }}</td>
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
                  @click="planConfirm()"
                  v-has-permi="['cmd:send']"
                  style="float: right; margin-right: 0; padding: 2px"
                >发送<br/>指令
                </el-button>
              </div>
            </el-aside>
            <el-container>
              <el-main style="padding: 0">
                <el-table
                  :data="planRoute"
                  style="width: 400px"
                  border
                  max-height="400"
                >
                  <el-table-column type="index" label="顺序"></el-table-column>

                  <el-table-column label="经度" width="130">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.lng"
                        placeholder="请输入经度"
                      ></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="纬度" width="130">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.lat"
                        placeholder="请输入纬度"
                      ></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="50">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteRow(scope.$index, planRoute)
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

        <!-- 新多选框 -->
        <div
          class="info-card-new"
          v-show="multiSelectCardIsShow"
          style="width: 318px"
        >
          <el-container>
            <el-header class="header1" style="height: 48px">
              <div style="color: #cb9d1d">
                <td>设备多选工具</td>
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
                @click="closeMultiSelectCard()"
              >X
              </el-button>
              <tr>
                <td>点击地图上的设备进行选择</td>
              </tr>
            </el-header>
          </el-container>

          <el-container>
            <el-aside width="84px" style="line-height: 0">
              <div style="float: right">
                <el-button
                  type="text"
                  class="button"
                  v-hasPermi="['map:device:trail']"
                  @click="multiRoute.dialogIsShow = true"
                  style="margin-right: 0"
                >
                  <!--                  <div class="info-card-new-icon">-->
                  <!--                     <i class="el-icon-check"></i>-->
                  <!--                  </div>-->
                  显示多轨迹
                </el-button>
                <el-button
                  type="text"
                  class="button"
                  v-hasPermi="['map:device:trail']"
                  @click="multiRoute.routeIsShow = false"
                  style="margin-right: 0"
                >
                  <!--                  <div class="info-card-new-icon">-->
                  <!--                     <i class="el-icon-close"></i> -->
                  <!--                  </div>-->
                  关闭多轨迹
                </el-button>
                <el-button
                  type="text"
                  class="button"
                  @click="multiAutoCruise.isShow = true"
                  style="margin-left: 8px"
                >
                  <!--                  <div class="info-card-new-icon">-->
                  <!--                     <i class="el-icon-close"></i> -->
                  <!--                  </div>-->
                  编队巡航
                </el-button>
              </div>
            </el-aside>
            <el-container>
              <el-main style="padding: 0; line-height: 50px">
                <el-table
                  :data="multiSelectedDevice"
                  style="width: 300px"
                  border
                  max-height="460px"
                  :header-cell-style="{ 'text-align': 'center' }"
                  :cell-style="{ 'text-align': 'center' }"
                >
                  <el-table-column type="index" label="序号" width="">
                  </el-table-column>

                  <el-table-column label="设备ID" width="100" prop="cdId"></el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteRow(scope.$index, multiSelectedDevice)
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

        <!-- 多轨迹显示-日期选择对话框 -->
        <el-dialog
          title="选择查询范围"
          :visible.sync="multiRoute.dialogIsShow"
          width="30%"
        >
          <el-form>
            <el-form-item label="起始时间" label-width="120px">
              <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
              <el-date-picker
                v-model="multiRoute.startdate"
                type="datetime"
                value-format="timestamp"
                placeholder="请选择开始时间"
                style="width: 195px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-date-picker
                v-model="multiRoute.enddate"
                type="datetime"
                value-format="timestamp"
                placeholder="请选择结束时间"
                style="width: 195px"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="multiRoute.dialogIsShow = false"
            >取 消
            </el-button
            >
            <el-button type="primary" @click="showMultiRoute()"
            >确 定
            </el-button
            >
          </div>
        </el-dialog>

        <div class="tools" style="bottom: 295px">
          <el-button
            type="text"
            style="right: 10px; position: absolute"
            @click="show4 = !show4"
          >
            <i
              style="font-size: 30px; color: #c8f4ff; line-height: 0.65"
              class="el-icon-arrow-right"
              v-if="outinTool"
              @click="outinTool = !outinTool"
            ></i>
            <i
              style="font-size: 30px; color: #c8f4ff; line-height: 0.65"
              class="el-icon-arrow-left"
              v-if="!outinTool"
              @click="outinTool = !outinTool"
            ></i>
          </el-button>
        </div>

        <!-- 围栏管理框 -->
        <div
          class="info-card-new"
          v-show="areaManage.isShow"
          style="width: 405px"
        >
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
              >X
              </el-button>
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
                <!-- <el-button type="primary" plain class="button" @click="planConfirm()"
									style="float:right;margin-right:0px;padding: 2px;" >发送<br>指令
								</el-button> -->
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
                  <el-table-column type="index" label="序号"></el-table-column>

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
                <td>{{ this.areaManage.isAdd ? '围栏新增' : '围栏编辑' }}</td>
                <td>
                  <span
                    style="font-size: 14px; margin-left: 10px; color: #cecece"
                  >点击地图以添加区域顶点</span>
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
              >X
              </el-button>
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
                <!--  地图正常显示原型区域-->
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
                  border
                  max-height="400"
                >
                  <el-table-column type="index" label="序号"></el-table-column>

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
                          deleteRow(scope.$index, areaManage.areaForm.pointList)
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

        <!-- 自动巡航功能菜单框 -->
        <!-- <div class="info-card-new" v-show="autoCruise.isShow" style="width: 405px;left:20px;top:28px;box-shadow:-1px 1px 5px #333333;"> -->
        <div
          class="info-card-new"
          v-show="autoCruise.isShow"
          style="width: 405px; box-shadow: -1px 1px 5px #333333"
        >
          <el-container>
            <el-header class="header1" style="height: 40px">
              <div style="color: #cb9d1d; font-size: 24px">
                <td>自动巡航 ID:{{ infoCardData.markerInfo.cdId }}</td>
                <td>
                  <span
                    style="font-size: 14px; margin-left: 10px; color: #cecece"
                  >请选择并设置巡航方案</span
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
                @click="closeAutoCruiseMenu()"
              >X
              </el-button
              >
              <!-- <tr>
								<td>区域名称: </td>
								<td><el-input v-model="areaManage.areaForm.name" placeholder="请输入名称" size="mini" style="width:120px;margin-right:10px;"></el-input></td>
								<td>是否显示: </td>
								<td><el-switch v-model="areaManage.areaForm.visible" active-color="#13ce66"></el-switch></td>
							</tr> -->
            </el-header>
          </el-container>

          <el-container>

            <el-container>
              <el-main style="padding: 0">
                <el-tabs
                  type="border-card"
                  class="auto-cruise"
                  v-model="autoCruise.selectedTab"
                >
                  <el-tab-pane label="边缘巡航"
                  >边缘巡航
                    <el-popover
                      placement="right"
                      trigger="click"
                      style="float: right"
                    >
                      <el-image
                        style="width: 200px; height: 200px"
                        :src="require('@/assets/map/autoCruisePlan1.png')"
                        fit="contain"
                      ></el-image>
                      <el-button slot="reference" type="text">示例</el-button>
                    </el-popover>
                    <el-form ref="form" :model="autoCruise.plan1">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="起始点经纬度" prop="initPoint">
                            <el-input
                              placeholder="经度"
                              v-model="autoCruise.plan1.initPoint.lng"
                              style="width: 120px"
                            />
                            <el-input
                              placeholder="纬度"
                              v-model="autoCruise.plan1.initPoint.lat"
                              style="width: 120px; margin-left: 5px"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="边距(m)" prop="r">
                            <el-input
                              placeholder="边距m"
                              v-model="autoCruise.plan1.edge_length"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="航路点数目" prop="n">
                            <el-input
                              placeholder="1~10"
                              v-model="autoCruise.plan1.n"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- <el-form-item>
												<el-button type="primary" @click="submitForm">确 定</el-button>
												<el-button @click="cancel">取 消</el-button>
											</el-form-item> -->
                    </el-form>
                    <div style="margin-left: 105px">
                      <el-button type="primary" @click="planAutoCruise"
                      >规 划
                      </el-button
                      >
                      <el-button
                        type="primary"
                        @click="submitAutoCruise"
                        v-has-permi="['cmd:send']"
                        style="margin-left: 10px"
                        :disabled="this.autoCruise.planPointList.length === 0"
                      >提 交
                      </el-button>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="中心点巡航"
                  >中心点巡航
                    <el-popover
                      placement="right"
                      trigger="click"
                      style="float: right"
                    >
                      <el-image
                        style="width: 200px; height: 200px"
                        :src="require('@/assets/map/autoCruisePlan2.png')"
                        fit="contain"
                      ></el-image>
                      <el-button slot="reference" type="text">示例</el-button>
                    </el-popover>
                    <el-form ref="form" :model="autoCruise.plan2">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="中心点经纬度" prop="initPoint">
                            <el-input
                              placeholder="经度"
                              v-model="autoCruise.plan2.initPoint.lng"
                              style="width: 120px"
                            />
                            <el-input
                              placeholder="纬度"
                              v-model="autoCruise.plan2.initPoint.lat"
                              style="width: 120px; margin-left: 5px"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="中心距离(m)" prop="r">
                            <el-input
                              placeholder="距离m"
                              v-model="autoCruise.plan2.d"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="航路点数目" prop="n">
                            <el-input
                              placeholder="1~10"
                              v-model="autoCruise.plan2.n"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- <el-form-item>
												<el-button type="primary" @click="submitForm">确 定</el-button>
												<el-button @click="cancel">取 消</el-button>
											</el-form-item> -->
                    </el-form>
                    <div style="margin-left: 105px">
                      <el-button type="primary" @click="planAutoCruise"
                      >规 划
                      </el-button
                      >
                      <el-button
                        type="primary"
                        @click="submitAutoCruise"
                        style="margin-left: 10px"
                        :disabled="this.autoCruise.planPointList.length === 0"
                        v-has-permi="['cmd:send']"
                      >提 交
                      </el-button
                      >
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-main>
            </el-container>
          </el-container>
        </div>

        <!-- 多选设备编队巡航功能菜单框 -->
        <div
          class="info-card-new"
          v-show="multiAutoCruise.isShow"
          style="
            width: 405px;
            left: 20px;
            top: 28px;
            box-shadow: -1px 1px 5px #333333;
          "
        >
          <el-container>
            <el-header class="header1" style="height: 40px">
              <div style="color: #cb9d1d; font-size: 24px">
                <td>编队巡航</td>
                <td>
                  <span
                    style="font-size: 14px; margin-left: 10px; color: #cecece"
                  >请选择并设置巡航方案</span
                  >
                </td>
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
                @click="closeMultiAutoCruiseMenu()"
              >X
              </el-button
              >
              <!-- <tr>
								<td>区域名称: </td>
								<td><el-input v-model="areaManage.areaForm.name" placeholder="请输入名称" size="mini" style="width:120px;margin-right:10px;"></el-input></td>
								<td>是否显示: </td>
								<td><el-switch v-model="areaManage.areaForm.visible" active-color="#13ce66"></el-switch></td>
							</tr> -->
            </el-header>
          </el-container>

          <el-container>
            <el-container>
              <el-main style="padding: 0">
                <el-tabs
                  type="border-card"
                  class="auto-cruise"
                  v-model="multiAutoCruise.selectedTab"
                >
                  <el-tab-pane label="边缘巡航"
                  >边缘巡航
                    <el-popover
                      placement="right"
                      trigger="click"
                      style="float: right"
                    >
                      <el-image
                        style="width: 300px; height: 250px"
                        :src="require('@/assets/map/multiAutoCruise.png')"
                        fit="contain"
                      ></el-image>
                      <el-button slot="reference" type="text">示例</el-button>
                    </el-popover>
                    <el-form
                      ref="form"
                      :model="multiAutoCruise.plan1"
                      label-width="100px"
                    >
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="行数" prop="N">
                            <el-input
                              placeholder="行数"
                              v-model="multiAutoCruise.plan1.N"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="列数" prop="M">
                            <el-input
                              placeholder="列数"
                              v-model="multiAutoCruise.plan1.M"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="横向间距(m)" prop="row_d">
                            <el-input
                              placeholder="间距m"
                              v-model="multiAutoCruise.plan1.row_d"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="纵向间距" prop="col_d">
                            <el-input
                              placeholder="间距m"
                              v-model="multiAutoCruise.plan1.col_d"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="起始点经纬度" prop="initPoint">
                            <el-input
                              placeholder="经度"
                              v-model="multiAutoCruise.plan1.initPoint.lng"
                              style="width: 130px"
                            />
                            <el-input
                              placeholder="纬度"
                              v-model="multiAutoCruise.plan1.initPoint.lat"
                              style="width: 130px; margin-left: 8px"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="各设备边距" prop="edge_length">
                            <el-input
                              placeholder="边距m"
                              v-model="multiAutoCruise.plan1.edge_length"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="各设备航路点" prop="n">
                            <el-input
                              placeholder="1~10"
                              v-model="multiAutoCruise.plan1.n"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- <el-form-item>
										<el-button type="primary" @click="submitForm">确 定</el-button>
										<el-button @click="cancel">取 消</el-button>
									</el-form-item> -->
                    </el-form>
                    <div style="margin-left: 105px">
                      <el-button type="primary" @click="planMultiAutoCruise()"
                      >规 划
                      </el-button
                      >
                      <el-button
                        type="primary"
                        @click="submitMultiAutoCruise()"
                        v-has-permi="['cmd:send']"
                        style="margin-left: 10px"
                        :disabled="
                          this.multiAutoCruise.planPointList.length === 0
                        "
                      >提 交
                      </el-button>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="中心点巡航"
                  >中心点巡航
                    <el-popover
                      placement="right"
                      trigger="click"
                      style="float: right"
                    >
                      <el-image
                        style="width: 300px; height: 250px"
                        :src="require('@/assets/map/multiAutoCruisePlan2.png')"
                        fit="contain"
                      ></el-image>
                      <el-button slot="reference" type="text">示例</el-button>
                    </el-popover>
                    <el-form
                      ref="form"
                      :model="multiAutoCruise.plan2"
                      label-width="100px"
                    >
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="中心点经纬度" prop="initPoint">
                            <el-input
                              placeholder="经度"
                              v-model="multiAutoCruise.plan2.initPoint.lng"
                              style="width: 130px"
                            />
                            <el-input
                              placeholder="纬度"
                              v-model="multiAutoCruise.plan2.initPoint.lat"
                              style="width: 130px; margin-left: 8px"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="中心距离(m)" prop="r">
                            <el-input
                              placeholder="距离m"
                              v-model="multiAutoCruise.plan2.r"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="航路点数目" prop="N">
                            <el-input
                              placeholder="1~10"
                              v-model="multiAutoCruise.plan2.N"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="目标距离(m)" prop="d">
                            <el-input
                              placeholder="距离m"
                              v-model="multiAutoCruise.plan2.d"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="目标点数目" prop="M">
                            <el-input
                              placeholder="1~10"
                              v-model="multiAutoCruise.plan2.M"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <div style="margin-left: 105px">
                      <el-button type="primary" @click="planMultiAutoCruise()"
                      >规 划
                      </el-button
                      >
                      <el-button
                        type="primary"
                        @click="submitMultiAutoCruise()"
                        v-has-permi="['cmd:send']"
                        style="margin-left: 10px"
                        :disabled="
                          this.multiAutoCruise.planPointList.length === 0
                        "
                      >提 交
                      </el-button>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-main>
            </el-container>
          </el-container>
        </div>

        <!-- 地图菜单工具栏 -->
        <div v-show="show4">
          <div class="tools">
            <table>
              <!--
              <tr>
                <el-tooltip content="轨迹懒加载" placement="top">
                  <el-switch v-model="lazy" active-color="#13ce66" inactive-color="#717171">
                  </el-switch>
                </el-tooltip>
              </tr>
              -->
              <tr>
                <el-button
                  type="text"
                  @click="closeAllRoute()"
                  v-if=" polylineIsShow === true || multiRoute.routeIsShow === true "
                >
                  关闭轨迹
                </el-button>
              </tr>
              <tr>
                <el-button
                  type="text"
                  @click="multiSelectDevice()"
                  v-has-permi="['vue:map:device:multi-select']"
                >多选设备
                </el-button>
              </tr>
              <tr>
                <el-button
                  type="text"
                  @click="areaManage.isShow = true"
                  v-has-permi="['map:area:page']"
                >围栏管理
                </el-button>
              </tr>
              <tr>
                <el-button
                  type="text"
                  v-has-permi="['vue:map:range']"
                  @click="distanceMeasure()"
                  v-if="rulerFlag === false"
                >打开测距
                </el-button>
                <el-button
                  type="text"
                  v-has-permi="['vue:map:range']"
                  @click="distanceMeasure()"
                  v-else
                >关闭测距
                </el-button>
                <!-- <el-button type="text">打开测距</el-button> -->
              </tr>
              <tr>
                <el-button
                  type="text"
                  @click="enablePicker()"
                  v-has-permi="['vue:map:pick']"
                  v-if="pickerFlag === false"
                >坐标拾取
                </el-button>
                <el-button
                  type="text"
                  v-has-permi="['vue:map:pick']"
                  @click="unablePicker()"
                  v-else
                >关闭拾取
                </el-button>
              </tr>

              <tr>
                <el-button
                  v-has-permi="['vue:map:label']"
                  type="text"
                  @click="labelSwitch()"
                  v-if="labelIsShow === false"
                >显示标签
                </el-button>
                <el-button
                  v-has-permi="['vue:map:label']"
                  type="text"
                  @click="labelSwitch()"
                  v-else
                >隐藏标签
                </el-button>
                <!--                <el-button type="text">显示标签-->
                <!--								</el-button>-->
              </tr>
              <tr>
                <el-popover
                  placement="left"
                  trigger="click"
                  v-has-permi="['vue:map:switch']"
                >
                  <div>
                    <el-button
                      type="text"
                      @click="routeToGaode()"
                      v-has-permi="['vue:map:gaodemap']"
                    >高德地图
                    </el-button>
                  </div>
                  <div>
                    <el-button
                      type="text"
                      @click="routeToGoogle()"
                      v-has-permi="['vue:map:olmap']"
                    >私有地图
                    </el-button>
                  </div>
                  <div>
                    <el-button
                      type="text"
                      @click="routeToWindy()"
                      v-has-permi="['vue:map:windymap']"
                    >Windy地图
                    </el-button
                    >
                  </div>
                  <el-button type="text" slot="reference">地图切换</el-button>
                </el-popover>
              </tr>
            </table>
          </div>
        </div>
        <!-- 设备坐标点 -->
        <el-amap-marker
          v-for="item in deviceList"
          :icon="getDeviceImg(item)"
          :ref="'device_' + item.id"
          :key="item.id"
          :position="item.lr"
          :title="item.shower"
          :angle="item.angle"
          :offset="item.offset"
          :events="markerEvents1"
          :extData="item"
          :zIndex="item.mark === 'BEACON' ? 99 : 100"
          @click="showInfoCard()"
          :visible="normalDeviceIsShow"
          v-has-permi="['map:device:all']"
        ></el-amap-marker>
        <!-- AIS信息显示 -->
        <el-amap-marker
          v-for="item in Ais_triangle"
          :icon="getTriangleImg(item)"
          :key="item.id"
          :position="item.lr"
          :extData="item"
          :events="markerEvents_Ais"
          :visible="AisInfoShow"
          v-has-permi="['map:aisinfo']"
        ></el-amap-marker>
        <!-- 使用 el-amap-info-window 显示信息 -->
        <el-amap-info-window
          :position="AisinfoWindowPosition"
          :visible="AisinfoWindowVisible"
        >
          <!-- 这里添加你想要显示的信息内容 -->
          <div>
            <p>{{ AisinfoWindowText }}</p>
            <!-- 添加其他信息 -->
          </div>
        </el-amap-info-window>
        <!--  搜索框-定位-在对应图标上边加红圈      -->
        <el-amap-marker
          :icon="imgs.select_glider"
          :position="select_center"
          :angle="0"
          :offset="[-18, -20]"
          zIndex="97"
          :visible="searchBoxIsShow"
        ></el-amap-marker>

        <!--  多选设备-已经被选中的设备加绿框进行标注  -->
        <el-amap-marker
          v-for="item in multiSelectedDevice"
          :icon="imgs.select_green"
          :key="item.id + 2000"
          :position="[item.lng, item.lat]"
          :angle="0"
          :offset="[-18, -20]"
          zIndex="97"
          :visible="multiSelectCardIsShow"
        >
        </el-amap-marker>
        <!-- 测距距离实时显示Label -->
        <el-amap-text
          :text="rulerLabel.text"
          :offset="[75, 25]"
          :position="rulerLabel.position"
          v-if="rulerLabel.isShow"
        ></el-amap-text>

        <!-- label框 -->
        <el-amap-marker
          v-for="item in labelVisibleStatus"
          :label="getDeviceLabel(item)"
          :icon="imgs.labeltm"
          :key="item.id + 1000"
          :position="item.lr"
          zIndex="98"
        ></el-amap-marker>
        <!--  气泡      -->
        <el-amap-marker
          v-for="item in bubble"
          :offset="[-50, -50]"
          :key="item.id + 2000"
          :position="item.lr"
          :extData="item"
          :content="getBubble()"
          zIndex="97"
          cursor="hand"
        >
        </el-amap-marker>
        <!-- 坐标拾取器-->
        <!-- <el-amap-marker v-for="item in picker" :key="item.id" :position="item.lr" :label="item.label"> -->
        <el-amap-marker
          v-for="(item, index) in picker"
          :key="item.id"
          :position="item.lr"
          :label="
            getMarkerLabel(
              '[' + (index+1) + ']' + item.lr[0] + ',' + item.lr[1]
            )
          "
        >
        </el-amap-marker>
        <!-- 路径导航规划里面的坐标拾取,此处key值有警告，暂时没想好怎么写-->
        <el-amap-marker
          v-for="(item, index) in planRoute"
          :extData="item"
          :position="getLngLat(item.lng, item.lat)"
          :label="getMarkerLabel(item.lng + ',' + item.lat)"
          :draggable="true"
          :key="index + 'planMarker'"
          :events="planMarkerEvents"
        >
        </el-amap-marker>
        <!-- 自动巡航的规划点-->
        <el-amap-marker
          v-for="(item, index) in autoCruise.planPointList"
          :key="item.id"
          :position="[item.lng, item.lat]"
          :label="
            getMarkerLabel('[' + (index + 1) + ']' + item.lng + ',' + item.lat)
          "
        ></el-amap-marker>
        <!-- 编队巡航的规划点-->
        <div
          v-for="(markerList, indexi) in multiAutoCruise.planPointList"
          :key="'multiAutoCruiseDiv' + indexi"
        >
          <el-amap-marker
            v-for="(item, indexj) in markerList"
            :key="'multiAutoCruiseMarker' + indexi + indexj"
            :position="[item.lng, item.lat]"
            :icon="
              (parseInt(indexi / multiAutoCruise.MWhenPlan) +
                parseInt(indexi % multiAutoCruise.MWhenPlan)) %
                2 === 0
                ? imgs.blueMarker
                : imgs.yellowMarker
            "
            :label="
              indexj === 0 ? getMarkerLabel(item.lng + ',' + item.lat) : ''
            "
            :title="item.lng + ',' + item.lat"
          ></el-amap-marker>
        </div>
        <!-- 设备以点显示-点标记-->
        <el-amap-marker
          v-for="(item, index) in deviceVisibleStatusWithPointIsShow"
          :content="pointDeviceContent"
          :position="item.lr"
          :title="item.deviceName"
          :angle="item.angle"
          :offset="[-5, -5]"
          :events="markerEvents1"
          :extData="item"
          zIndex="100"
          @click="showInfoCard()"
          :key="index + 'pointDevice'"
        ></el-amap-marker>
        <!-- 显示设备多目标点功能的目标点 -->
        <el-amap-marker
          v-for="(item, index) in nTargetsShowWithIsShow"
          :icon="getDeviceTargetImg(item)"
          :position="item.lr"
          :label="
            getMarkerLabel('目标点(' +(item.source == null ? '' : item.source) +'):[' + item.lr[0] +
                ',' + item.lr[1] + ']')"
          :key="index + 'pointTarget'"
        >
        </el-amap-marker>
        <!-- 显示设备多目标点功能的虚线 -->
        <el-amap-polyline
          v-for="(item, index) in nTargetsShowWithIsShow"
          :path="item.route"
          strokeColor="#2591F5"
          strokeStyle="dashed"
          lineJoin="round"
          strokeWeight="5"
          :key="index + 'pointLineGlider'"
        >
        </el-amap-polyline>

        <!--  路况线路     这个我们没有采用，做了保留，下面那个才是我们使用的 -->
        <el-amap-polyline
          :path="routeInfo"
          strokeColor="#efc133"
          v-if="activeClass.roadConditionClass"
        >
        </el-amap-polyline>

        <!-- 船的路线的绘画 -->
        <el-amap-polyline
          :path="routeInfo1"
          strokeColor="#17D56B"
          :events="routeEvents"
          showDir="true"
          lineJoin="round"
          strokeWeight="7"
          v-if="polylineIsShow"
        >
        </el-amap-polyline>
        <!-- 多轨迹显示-多条船的轨迹 -->
        <el-amap-polyline
          v-for="(item, index) in multiRouteRouteList"
          :path="item"
          :strokeColor="getMultiRouteColor(index)"
          :events="routeEvents"
          showDir="true"
          lineJoin="round"
          strokeWeight="7"
          :key="item.id"
        >
        </el-amap-polyline>

        <!-- 编队巡航-设备连接目标点的线段 -->
        <el-amap-polyline
          v-for="(item, index) in multiAutoCruise.routes"
          :path="item"
          strokeColor="#5CF87A"
          lineJoin="round"
          strokeStyle="dashed"
          strokeWeight="2"
          :key="'multiAutoCruise.routes' + index"
        >
        </el-amap-polyline>

        <!-- 地图电子围栏区域 -->
        <!-- 多边形区域(包含线形) -->
        <el-amap-polygon
          v-for="item in areaManage.areaList.filter(item => item.type === '1')"
          :path="item.pointList"
          :visible="item.visible"
          :key="item.id + 'polygon'"
          strokeColor="#00B400"
          fillOpacity="0"
          strokeWeight="2"
          bubble="true"
        ></el-amap-polygon>

        <!-- 圆形区域 -->
        <el-amap-circle
          v-for="item in areaManage.areaList.filter(item => item.type === '2')"
          :center="getCircleCenter(item)"
          :radius="getCircleRadius(item)"
          :visible="item.visible"
          :key="item.id + 'circle'"
          strokeColor="#00B400"
          fillOpacity="0"
          strokeWeight="2"
          bubble="true"
        ></el-amap-circle>

        <!-- 区域新增或编辑时的多边形 -->
        <el-amap-polygon
          :path="areaManage.areaForm.drawingPath"
          v-if="areaManage.editing"
        ></el-amap-polygon>

        <!-- 路径动画-已经走过的路径 -->
        <!-- <el-amap-polyline :path="passedRoute" strokeColor="#17D56B" :events="routeEvents" showDir="true"
					lineJoin="round" strokeWeight="7" v-if="polylineIsShow">
				</el-amap-polyline> -->

        <!-- 用来做导航规划开发 -->
        <el-amap-polyline
          :path="planRoute"
          strokeColor="#efc133"
          :events="routeEvents"
          showDir="true"
          strokeWeight="5"
          v-if="polylineIsShow"
        >
        </el-amap-polyline>
        <!-- <el-amap-bezier-curve :path="routeInfo1" strokeColor="#44ef06" showDir="true" strokeWeight="10"></el-amap-bezier-curve> -->
        <!-- 路径长度- -->
        <el-amap-text
          :text="routePathLengthText"
          :position="routeFinPosition"
          :offset="[-50, -50]"
          v-if="routeLengthIsShow"
        >
        </el-amap-text>

        <!-- 路径动画-动画中设备点 -->
        <el-amap-marker
          :icon="imgs.labeltm"
          :position="moveMarker.position"
          autoRotation="true"
          :offset="[-18, -20]"
          :events="moveMarkerEvents"
          zIndex="99"
          :visible="polylineIsShow"
        >
        </el-amap-marker>
      </el-amap>
      <!-- 显示左下角经纬度 -->
      <div type="info" class="latinfo">
        <el-row>
          <el-col :span="12"
          ><span
            style="
                font-size: 12px;
                color: #ffffff;
                padding-left: 10px;
                line-height: 14px;
              "
          >
              {{ '经度：' + this.mouseLng }}</span
          ></el-col
          >
          <el-col :span="12"
          ><span style="font-size: 12px; color: #ffffff; line-height: 14px">
              {{ '（' + this.mouseLngDmsInfo + '）' }}</span
          ></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="12"
          ><span
            style="
                font-size: 12px;
                color: #ffffff;
                padding-left: 10px;
                line-height: 14px;
              "
          >
              {{ '纬度：' + this.mouseLat }}</span
          ></el-col
          >
          <el-col :span="12"
          ><span style="font-size: 12px; color: #ffffff; line-height: 14px">
              {{ '（' + this.mouseLatDmsInfo + '）' }}</span
          ></el-col
          >
        </el-row>
      </div>
      <!-- 获取地图页面概要信息 -->
      <el-tag
        type="info"
        class="overinfo"
        color="#00000062"
        v-has-permi="['map:overinfo']"
      >
        <span style="font-size: 12px; color: #ffffff; line-height: 14px"
        >{{ ' 总设备：' + this.overview.sum }}
        </span>
        <span
          style="
            font-size: 12px;
            color: #00ff00;
            padding-left: 10px;
            line-height: 14px;
          "
        >{{ '正常：' + this.overview.normal }}
        </span>
        <span
          style="
            font-size: 12px;
            color: #ff0000;
            padding-left: 10px;
            line-height: 14px;
          "
        >{{ '回传异常：' + this.overview.abnormal }}</span>
      </el-tag>

      <!-- 下拉搜索框 -->
      <div
        style="position: absolute; top: 5px; right: 175px; z-index: 100"
        class="search-box"
      >
        <div style="color: #06f1ef; display: inline">
          <el-select
            ref="searchSelection"
            v-model="searchSelectedID"
            filterable
            placeholder="设备搜索"
            v-has-permi="['map:device:local']"
            style="width: 160px; margin-right: 10px"
            @change="idChanged(searchSelectedID)"
            :default-first-option="true"
            class="idSelect"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.deviceName"
              :value="item.id"
            >
              <span style="float: left">{{ item.cdId }}</span>
              <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
              <span style="color: #8492a6; font-size: 13px">{{ item.deviceName }}</span>
            </el-option>
          </el-select>
          <!-- <el-button type="text" class="query" @click="queryData()">查询</el-button> -->
        </div>
      </div>
    </div>

    <!-- 设备状态浮动窗口 -->
    <el-dialog
      :visible.sync="showDeviceDetail"
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
          v-if="showDeviceDetail"
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
import { getAisInfo, getDeviceAll, getTrail, getLocationByCode, getNTargets, getOverInfo } from '@/api/map/map'
import { getDeviceTypeTree } from '@/api/device/device'
import { Navbar } from '@/layout/components'
import { detailExcel } from '@/api/status/status'
import { getCmds, sendCmd } from '@/api/command/command'
import { addAreaInfo, deleteAreaInfo, getAllAreaInfo, updateAreaInfo } from '@/api/map/area'
import { computeDestinationPoint } from 'geolib'
import { downloadFile } from '@/utils/download';

import deviceIconConfig from '@/utils/DeviceIconConfig';
import deviceCommConfig from '@/utils/DeviceCommConfig';

export default {
  name: 'Gaodemap',
  components: {
    Navbar
  },
  data() {
    let _this = this
    return {

      // 设备状态弹窗
      showDeviceDetail: false,
      iframeLoading: false,
      deviceDetailParams: {
        deviceId: '',
        startDate: '',
        endDate: '',
      },

      showAllCommWays: false,

      //多选设备编队巡航功能-数据区
      multiAutoCruise: {
        isShow: false,
        selectedTab: '0',
        planPointList: [],
        NWhenPlan: null,
        MWhenPlan: null,
        routes: [],
        plan1: {
          N: null,
          M: null,
          row_d: null,
          col_d: null,
          initPoint: {},
          edge_length: null,
          n: null
        },
        plan2: {
          N: null,
          M: null,
          r: null,
          d: null,
          initPoint: {}
        }
      },
      // 自动巡航功能-数据区
      autoCruise: {
        isShow: false,
        selectedTab: '0',
        planPointList: [],
        deviceId: null,
        plan1: {
          initPoint: {},
          edge_length: null,
          n: null
        },
        plan2: {
          initPoint: {},
          d: null,
          n: null
        }
      },

      deviceOptions: [], //存储设备code与物理ID用于指令的发送
      deviceTypeOptions: [],

      //围栏管理-数据区
      areaManage: {
        areaList: [],
        isAdd: true,
        areaForm: {
          id: 0,
          name: '',
          pointList: [], //输入框的经纬度
          drawingPath: [], //用来显示地图上的多边形的经纬度，会监听pointList随时刷新
          visible: true,
          isShow: false,
          IsCircle: false
        },
        isShow: false,
        editing: false
        // IsCircle: false,
      },

      rulerLabel: {
        position: [180, 90],
        text: '',
        isShow: false
      },
      lazy: false, //是否启用懒加载
      routeLengthIsShow: false, //轨迹长度信息是否显示
      //yihui delete
      show3: false,
      show4: true,
      //多轨迹显示-数据区
      multiRoute: {
        colorList: ['#efc133', '#00cc32', '#1a90ff', '#a01aff'],
        dialogIsShow: false,
        routeIsShow: false,
        startdate: '',
        enddate: '',
        routeList: []
      },

      multiSelectedDevice: [], //多选设备-用来存储已经被选中的设备

      multiSelectCardIsShow: false, //多选设备-控制多选功能框的显示

      searchSelectedID: null, //搜索框-被选择的设备ID

      //路径动画-用来存储移动的点标记
      moveMarkerObject: null,
      //路径动画-已经走过的路径
      passedRoute: [],

      //路径动画-点信息
      moveMarker: {
        position: [0, 0]
      },

      //路径动画-点标记事件
      moveMarkerEvents: {
        init(marker) {
          _this.moveMarkerObject = marker
          _this.index = 1
          // marker.on('moving', function(e) {
          //   _this.passedRoute = e.passedPath;
          //   console.log(marker.getPosition(),_this.index++);
          // });
        },
        moving(e) {
          _this.passedRoute = e.passedPath
        },
        movealong(e) {
          _this.index = 1
          let position = new AMap.LngLat(0, 0)
          _this.passedRoute.push(_this.routeInfo1[_this.routeInfo1.length - 1])
          // _this.moveMarkerObject.moveTo([0,0],100);
        }
      },

      //设备以点显示-添加两个用来控制显示的变量
      normalDeviceIsShow: true,
      AisInfoShow: true,
      pointIsShow: false,

      //搜索框-标记点附近的标记框
      searchBoxIsShow: false,

      //设备以点显示-marker的content
      pointDeviceContent: `
					<style>
						.device-point{
							position: absolute;
							top:0;
							left:0;
							width: 10px;
							height: 10px;
							background-color: #13ce66;
							border-radius: 50%;
				    		margin:0 auto;
						}
					</style>
					<div class="device-point"></div>
				`,

      //显示设备目标点-目标点信息
      targetShow: {
        isShow: false,
        label: '',
        lr: [0, 0],
        route: []
      },
      //存储Ais数据
      Ais_triangle: [],
      //多目标点
      nTargetsShow: [],
      // 搜索框
      selectedID: null,
      // 搜索框
      options: [],
      select_center: [0, 0], //搜索框-搜索到设备的坐标

      planRoute: [], //用作导航规划使用

      planCardIsShow: false,
      planFlag: false, //路径规划
      pickerFlag: false, //坐标拾取
      picker: [],

      infoCardData: {
        //悬浮卡片，
        markerInfo: {
          //从cars里面获取的
          lr: [0, 0]
        },
        startdate: '',
        enddate: '',
        downloading: false
      },
      markerEvents_Ais: {
        init(e) {
        },
        click(e) {
          const item = e.target.getExtData() // 获取点击标记的数据
          _this.aisInfoWindow = new AMap.InfoWindow({
            content: `
                            <style>
                                .specific {
                                    color: #ffffff;
                                    font-size: .7vw;
                                    margin-top: .8vw;
                                }
                                .specific-data {
                                    color: rgb(31, 210, 239);
                                    display: inline-block;
                                }
                            </style>
                            <table style="width: 10vw;">
                            <tr class="specific">
                                    <td>MMSI</td>
                                    <td class="specific-data">${item.mmsi}</td>
                                </tr>
                                <tr class="specific">
                                    <td >经度</td>
                                    <td class="specific-data">${item.lr[0]}</td>
                                </tr>
                                <tr class="specific">
                                    <td>纬度</td>
                                    <td class="specific-data">${item.lr[1]}</td>
                                </tr>
                                <tr class="specific">
                                    <td>航向</td>
                                    <td class="specific-data">${item.angle}</td>
                                </tr>
                                <tr class="specific">
                                    <td>航速</td>
                                    <td class="specific-data">${item.speed}</td>
                                </tr>
                                <tr class="specific">
                                    <td>时间</td>
                                    <td class="specific-data">${item.time}</td>
                                </tr>
                            </table>
                        ` // 设置要显示的信息内容
          })
          _this.aisInfoWindow.open(_this.mapData, [item.lr[0], item.lr[1]])
        },
        close() {
          _this.infoWindow.close()
        }
      },
      markerEvents1: {
        click(e) {
          //多选设备-判断多选功能是否打开，打开时执行else，未打开执行正常悬浮框
          if (_this.multiSelectCardIsShow === false) {
            //显示设备目标点-点击设备后进行目标点的获取和显示
            _this.targetShow.route = []
            _this.targetShow.isShow = false
            _this.nTargetsShow = []

            if (
              _this.$store.getters.permissions.indexOf('map:target:multiple') !== -1 ||
              _this.$store.getters.permissions.indexOf('*:*:*') !== -1
            ) {
              // 获取多目标点
              let deviceId = e.target.getExtData().id
              getNTargets(deviceId).then((res) => {
                for (let item of res.rows) {
                  let temp = {
                    lr: [item.longitude, item.latitude],
                    isShow: false,
                    label: {
                      content:
                        '目标点(' +
                        (item.source == null ? '' : item.source) +
                        '):[' +
                        item.longitude +
                        ',' +
                        item.latitude +
                        ']',
                      offset: [-70, -20]
                    },
                    source: item.source,
                    colorCode: item.colorCode,
                    route: []
                  }
                  if (
                    item.longitude != null &&
                    item.latitude != null &&
                    item.longitude !== 0 &&
                    item.latitude !== 0
                  ) {
                    temp.route.push(e.target.getExtData().lr)
                    temp.route.push(temp.lr)
                    temp.isShow = true
                  } else {
                    temp.isShow = false
                  }
                  _this.nTargetsShow.push(temp)
                }
              })
            }

            //单目标点请求接口
            // getTarget(e.target.getExtData().id).then(res => {
            // 	_this.targetShow.lr = [res.data.longitude, res.data.latitude];
            // 	_this.targetShow.label = {
            // 		content: '目标点：[' + res.data.longitude + ',' + res.data.latitude + ']',
            // 		offset: [-45, -20]
            // 	};
            // 	if (res.data.longitude != null && res.data.latitude != null) {
            // 		_this.targetShow.route.push(e.target.getExtData().lr);
            // 		_this.targetShow.route.push(_this.targetShow.lr);
            // 		_this.targetShow.isShow = true;
            // 	} else {
            // 		_this.targetShow.isShow = false;
            // 	}
            // });
            // _this.infoCardData.startdate = new Date().getTime()-7*24*3600*1000

            _this.infoCardData.enddate = new Date().getTime()
            // 获取设备数据链条: infoCardData.markerInfo <- e.target.getExtData() <- deviceList <- 设备列表接口
            _this.infoCardData.markerInfo = e.target.getExtData()
            _this.infoCardData.startdate = new Date(
              _this.infoCardData.markerInfo.startDate
            ).getTime()
            _this.infoCardIsShow = true
          } else {

            //多选设备-当多选功能打开时，执行下面的部分
            let marker = e.target.getExtData()

            let temp = {
              id: marker.id,
              lng: marker.lr[0],
              lat: marker.lr[1],
              cdId: marker.cdId
            }

            let index = _this.multiSelectedDevice.findIndex((currentValue) => {
              return currentValue.id === temp.id
            })
            if (index === -1) {
              _this.multiSelectedDevice.push(temp)
            } else {
              _this.multiSelectedDevice.splice(index, 1)
            }
          }
        }
      },

      planMarkerEvents: {
        dragend(e) {
          e.target.getExtData().lng = e.lnglat.lng
          e.target.getExtData().lat = e.lnglat.lat
          //_this.planRoute.lng=e.lnglat.lng;
          //_this.planRoute.lat=e.lnglat.lat;
        }
      },

      //鼠标移动的纬度
      mouseLat: 23.31,
      // 鼠标移动的经度
      mouseLng: 116.5,

      // 指令发送
      path_str: '',
      count: 0,
      // 指令列表，目前只使用目标点指令
      cmdList: {
        mbd: ''
      },

      // 设备概览
      overview: {
        abnormal: 0, //获取地图界面概要信息-不正常设备
        sum: 0, //获取地图界面概要信息-总设备
        normal: 0 //获取地图界面概要信息-正常设备
      },
      mapRuler: {},
      rulerFlag: false, // 是否打开测距
      labelIsShow: false, //小船旁边的label默认显示
      tempLabelIsShow: false, //设备以点显示-设置另外一个变量用来存储标签的显示状态
      polylineIsShow: false, //默认路径不显示，
      infoCardIsShow: false, //默认卡片不显示，

      updownIcon: true,
      outinTool: true,
      overlay: null,
      isInfo: true,
      selectedTriangle: null,
      AisinfoWindowVisible: false,
      AisinfoWindowPosition: [0, 0],
      AisinfoWindowText: '',
      //地图初始化
      center: [116.5, 23.31],
      zoom: 5,
      keyboardEnable: true, //地图是否可通过键盘控制，默认为true
      rotateEnable: true, // 地图是否可旋转，3D视图默认为true，2D视图默认false
      expandZoomRange: true, //可以放大到20级，开放放大限制
      zooms: [2, 20],
      dragEnable: true, //可否拖拽
      routeEvents: {
        init(polyline) {
          polyline.setOptions({
            showDir: true
          })
        }
      },
      mapEvents: {
        init(map) {
          _this.mapData = map
          map.setMapStyle('amap://styles/5621307fef9cd4435c20c3853f0f94ef')
          // map.addControl(new vueAMap.Scale({
          // 	position: 'RB',
          // }));
          //在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          // AMap.plugin(["AMap.MapType", "AMap.RangingTool"], function() {
          // 	map.addControl(new AMap.MapType({
          // 		showRoad: true,
          // 		defaultType: 1
          // 	}));
          // //测距的ruler
          // 	const ruler1 = new AMap.RangingTool(map); // 初始化插件
          // 	_this.mapRuler = ruler1;
          // });
          // map.addControl(new AMap.MapType({
          // 	showRoad: true,
          // 	defaultType: 1
          // }));
          //这个是左边控制条
          /* map.addControl(new AMap.ControlBar({
            position: {
              left: '-80px',
              top: '50px'
            }
          })); */ //dk,添加工具条，也就是左上角的东西
          // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
          // map.addControl(new AMap.Geolocation());
          //获取当前缩放级别
          // map.on('zoomchange', () => {
          // 	let zoom = map.getZoom() //获取当前地图级别
          // 	_this.getRoute(),
          // 		_this.queryParams.zoom = zoom
          // });
          //测距的ruler
          // const ruler1 = new AMap.RangingTool(map); // 初始化插件
          // _this.mapRuler = ruler1;
          //获取当前经纬度
        },
        mousedown(e) {
          _this.selectBlur()
        },
        click(e) {
          //打开路径规划时进行
          if (_this.planFlag) {
            const temp = {
              lat: e.lnglat.lat,
              lng: e.lnglat.lng
            }

            //不到九的时候执行，大于9个点的时候警告
            if (_this.planRoute.length >= 10) {
              alert('导航规划只允许最多 10 个坐标点')
            } else {
              _this.planRoute.push(temp)
            }
          }

          // 坐标拾取器
          if (_this.pickerFlag) {
            // 生成唯一 ID
            const generateId = () => Date.now() + Math.floor(Math.random() * 1000)

            const temp = {
              id: generateId(),
              lr: [e.lnglat.lng, e.lnglat.lat],
              label: {
                offset: [-45, -20] //暂未使用到
              }
            }
            _this.picker.push(temp)
          }
          // 当围栏管理新增/编辑打开时，进行区域点添加和绘制
          if (_this.areaManage.editing) {
            _this.areaManage.areaForm.pointList.push([
              e.lnglat.lng,
              e.lnglat.lat
            ])
          }
          // console.log('地图点击事件成功');
        },

        // 鼠标移动，坐标移动
        mousemove(e) {
          (_this.mouseLat = e.lnglat.getLat()), (_this.mouseLng = e.lnglat.getLng())
        },

        //设备以点显示-设置地图缩放事件
        zoomchange() {
          let map = _this.mapData
          let zoom = map.getZoom()
          if (zoom <= 4) {
            _this.pointIsShow = true
            _this.normalDeviceIsShow = false
            _this.labelIsShow = false
          } else {
            _this.pointIsShow = false
            _this.normalDeviceIsShow = true
            _this.labelIsShow = _this.tempLabelIsShow
            _this.tempLabelIsShow = _this.labelIsShow
          }
        }
      },

      // 全部设备列表
      deviceList: [],
      // 新消息设备列表
      bubble: [],
      //泊位信息 */
      port: [],
      imgs: {
        blueMarker: require('@/assets/map/target/blue_marker.png'),
        yellowMarker: require('@/assets/map/target/yellow_marker.png'),

        select_glider: require('@/assets/map/select_red.png'),
        select_green: require('@/assets/map/select_green.png'), //多选设备-引入设备被选时的选定标志
        target_msg: require('@/assets/map/target/target_msg.png'),
        target_cmd: require('@/assets/map/target/target_cmd.png'),
        triangle_map: require('@/assets/map/shipYellow.png'),

        labeltm: require('@/assets/map/label_touming.png'), // 用于label显示时隐藏icon
      },

      //标签样式
      activeClass: {
        capacityClass: false,
        transportClass: false,
        roadConditionClass: false,
        shipClass: false,
        trainClass: false,
        layerClass: false,
        shipPortClass: false
      },
      //实际路线信息，未使用
      routeInfo: [],
      //定时刷新
      intervalId: null,

      // 路线信息，使用此个
      routeInfo1: [],
      routePathLengthText: '', //路径长度-显示文本
      routeFinPosition: [0, 0], //路径长度-位置
      routeDistance: 0, //路径长度
      //路障点信息
      routeKeyNode: [],
      queryParams: {
        zoom: 7,
        startLat: 0.0,
        startLng: 0.0,
        endLat: 88.0,
        endLng: 140.0,
        taskNum: ''
      },
      mapData: '',
      storageId: '',
      storageName: '',
      //搜索泊位字段
      queryPortParams: {
        name: undefined,
        portId: undefined
      },
      //图层控件
      layer: '',
      //泊位id
      id: '',
      //仓库信息弹出框
      infoWindow: '',
      //路况信息弹出框
      roadInfoWindow: '',
      storagePointData: {}

    }
  },
  computed: {
    mouseLngDmsInfo() {
      return this.D2Dms(this.mouseLng)
    },
    mouseLatDmsInfo() {
      return this.D2Dms(this.mouseLat)
    },
    // 设备可见状态
    deviceVisibleStatus() {
      return this.deviceList.filter((item) => {
        return item.visible
      })
    },
    // 标签可见状态
    labelVisibleStatus() {
      if (this.labelIsShow) {
        return this.deviceList.filter((item) => {
          return item.visible
        })
      } else {
        return []
      }
    },
    // 点显示时设备可见状态
    deviceVisibleStatusWithPointIsShow() {
      if (this.pointIsShow) {
        return this.deviceList.filter((item) => {
          return item.visible
        })
      } else {
        return []
      }
    },
    // 多目标点显示状态
    nTargetsShowWithIsShow() {
      return this.nTargetsShow.filter((item) => {
        return item.isShow
      })
    },
    // 多轨迹显示
    multiRouteRouteList() {
      if (this.multiRoute !== undefined && this.multiRoute.routeIsShow) {
        return this.multiRoute.routeList
      } else {
        return []
      }
    },
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
  watch: {
    // 监听区域新增/编辑框中的数据变化，随时刷新地图中多边形或圆形的显示
    'areaManage.areaForm.pointList': {
      handler: function() {
        if (
          this.areaManage.areaForm.IsCircle &&
          this.areaManage.areaForm.pointList.length >= 2
        ) {
          const [center, edge] = this.areaManage.areaForm.pointList
          const radius = this.computeDistance(center, edge)
          this.areaManage.areaForm.drawingPath = this.createCircle(
            center,
            radius,
            720
          )
          // this.areaManage.IsCircle = false;
          // var circle = new AMap.Circle({
          // center: [0, 0],
          // radius: 1000, //半径
          // borderWeight: 3,
          // strokeColor: "#FF33FF",
          // strokeOpacity: 1,
          // strokeWeight: 6,
          // strokeOpacity: 0.2,
          // fillOpacity: 0.4,
          // strokeStyle: 'dashed',
          // strokeDasharray: [10, 10],
          // // 线样式还支持 'dashed'
          // fillColor: '#1791fc',
          // zIndex: 50,
          // })

          // circle.setCenter(pointList[0]);
          // this.map.add(circle);
          // // 缩放地图到合适的视野级别
          // this.map.setFitView([ circle ]);
          // this.areaManage.IsCircle=false;
        } else {
          this.areaManage.areaForm.drawingPath = JSON.parse(
            JSON.stringify(this.areaManage.areaForm.pointList)
          )
        }

        // this.areaManage.areaForm.drawingPath = JSON.parse(
        //   JSON.stringify(this.areaManage.areaForm.pointList)
        // );
      }
      // deep:true
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId) // 清除定时器
  },
  mounted() {

  },
  created() {
    this.init()
    this.getCmds()
    this.getAllArea()
    // 设置3分钟定时请求来更新状态变化
    this.intervalId = setInterval(() => {
      this.init()
    }, 3 * 60 * 1000)
  },
  methods: {

    // 获取通信方式名称
    getCommWayName(type){
      return deviceCommConfig.getCommWayName(type);
    },

    // 获取第一种通信方式
    getFirstCommWay(commWays) {
      if (!commWays || commWays.length === 0) return ''
      const firstComm = commWays[0]
      return `${this.getCommWayName(firstComm.communicateType)}: ${firstComm.communicateCode}`
    },

    // 获取圆形中心点
    getCircleCenter(item) {
      if (item.pointList.length === 2) {
        // 两个点的情况：第一个点是圆心
        return item.pointList[0]
      }
      return item.center || [0, 0]
    },

    // 获取圆形半径
    getCircleRadius(item) {
      if (item.pointList.length === 2) {
        // 两个点的情况：计算两点之间的距离作为半径
        const [center, edgePoint] = item.pointList
        return this.calculateDistance(center, edgePoint)
      }
      return item.radius || 0
    },

    // 计算两点之间的距离（米）
    calculateDistance(point1, point2) {
      const R = 6371000 // 地球半径（米）
      const lat1 = point1[1] * Math.PI / 180
      const lat2 = point2[1] * Math.PI / 180
      const deltaLat = (point2[1] - point1[1]) * Math.PI / 180
      const deltaLng = (point2[0] - point1[0]) * Math.PI / 180

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return R * c
    },

    /**
     * 地图切换
     */
    // 高德地图
    routeToGaode() {
      this.$router.push({
        path: '/map/gaodemap'
      })
    },
    // 谷歌地图
    routeToGoogle() {
      this.$router.push({
        path: '/map/olmap'
      })
    },
    // windy地图
    routeToWindy() {
      this.$router.push({
        path: '/map/windymap'
      })
    },

    //编队巡航点击提交按钮，将指令发送给后端
    submitMultiAutoCruise() {
      if (
        this.multiAutoCruise.planPointList.length !==
        this.multiSelectedDevice.length
      ) {
        this.$message({
          message: '所设行列数目不符合被选中设备数目，请重新规划',
          type: 'error'
        })
        return
      }
      if (this.multiAutoCruise.planPointList[0].length > 10) {
        this.$message({
          message: '单设备航路点数目不能超过10，请重新规划',
          type: 'error'
        })
        return
      }
      let deviceIds = this.multiSelectedDevice.map((item) => {
        return Number(item.id)
      })
      deviceIds.sort()
      let cmd = ''
      for (let i = 0; i < this.multiAutoCruise.planPointList.length; i++) {
        cmd = cmd +
          this.sendCmdByPath(deviceIds[i], this.multiAutoCruise.planPointList[i]) +
          (i === this.multiAutoCruise.planPointList.length - 1 ? '' : '\n')
      }
      this.$message({
        message: '编队巡航指令发送成功！' + cmd,
        type: 'success'
      })
      this.multiAutoCruise.planPointList = []
    },
    //编队巡航点击规划按钮，对输入信息进行计算在地图上打点显示
    planMultiAutoCruise() {
      this.multiAutoCruise.planPointList = []
      if (this.multiAutoCruise.selectedTab === '0') {
        let N = Number(this.multiAutoCruise.plan1.N)
        let M = Number(this.multiAutoCruise.plan1.M)
        let row_d = Number(this.multiAutoCruise.plan1.row_d)
        let col_d = Number(this.multiAutoCruise.plan1.col_d)
        let initLng = Number(this.multiAutoCruise.plan1.initPoint.lng)
        let initLat = Number(this.multiAutoCruise.plan1.initPoint.lat)
        let edge_length = Number(this.multiAutoCruise.plan1.edge_length)
        let n = Number(this.multiAutoCruise.plan1.n)
        let subInitPoints = [] //子起始点数组
        for (let i = 0; i < N; i++) {
          //计算出该行首个子起始点
          let tempPoint = this.calc_position(
            initLng,
            initLat,
            Math.PI,
            i * col_d
          )
          for (let j = 0; j < M; j++) {
            //计算子起始点并存到数组中备用
            subInitPoints.push(
              this.calc_position(
                tempPoint.lng,
                tempPoint.lat,
                Math.PI / 2,
                j * row_d
              )
            )
          }
        }
        //根据子起始点计算出每个设备的航路点
        for (let item of subInitPoints) {
          this.multiAutoCruise.planPointList.push(
            this.calc_pointList_byTop(item.lng, item.lat, edge_length, n)
          )
        }
        // console.log(this.multiAutoCruise.planPointList);
        this.multiAutoCruise.NWhenPlan = N
        this.multiAutoCruise.MWhenPlan = M
      } else if (this.multiAutoCruise.selectedTab === '1') {
        let N = Number(this.multiAutoCruise.plan2.N)
        let M = Number(this.multiAutoCruise.plan2.M)
        let r = Number(this.multiAutoCruise.plan2.r)
        let d = Number(this.multiAutoCruise.plan2.d)
        let initLng = Number(this.multiAutoCruise.plan2.initPoint.lng)
        let initLat = Number(this.multiAutoCruise.plan2.initPoint.lat)
        let subInitPoints = [] //子中心点数组
        //计算子中心点
        subInitPoints.push(
          this.calc_pointList_byCenter(initLng, initLat, r, N)
        )
        //根据子中心点计算各个设备目标点
        // console.log(subInitPoints);
        for (let item of subInitPoints[0]) {
          this.multiAutoCruise.planPointList.push(
            this.calc_pointList_byCenter(item.lng, item.lat, d, M)
          )
        }
        this.multiAutoCruise.NWhenPlan = N
        this.multiAutoCruise.MWhenPlan = M
      }

      //后面代码为生成设备连接目标点的线段
      this.multiAutoCruise.routes = []
      let ids = this.multiSelectedDevice.map((item) => {
        return Number(item.id)
      })
      ids.sort()
      for (let [index, item] of ids.entries()) {

        let tempList = []
        for (let item1 of this.deviceList) {
          if (item1.id == item) {
            tempList.push(item1.lr)
          }
        }
        // console.log(this.multiAutoCruise.planPointList);
        if (index < this.multiAutoCruise.planPointList.length) {
          tempList.push([
            this.multiAutoCruise.planPointList[index][0].lng,
            this.multiAutoCruise.planPointList[index][0].lat
          ])
        }
        this.multiAutoCruise.routes.push(tempList)
      }
    },
    //关闭编队巡航悬浮框菜单
    closeMultiAutoCruiseMenu() {
      this.multiAutoCruise = {
        isShow: false,
        selectedTab: '0',
        planPointList: [], //[[{lng,lat},{}],[]]
        NWhenPlan: null,
        MWhenPlan: null,
        routes: [],
        plan1: {
          N: null,
          M: null,
          row_d: null,
          col_d: null,
          initPoint: {},
          edge_length: null,
          n: null
        },
        plan2: {
          N: null,
          M: null,
          r: null,
          d: null,
          initPoint: {}
        }
      }
    },

    //根据提供的文本、偏移量，获取标签显示所需要的格式,若不指定偏移，则自动计算偏移保证始终居中
    getMarkerLabel(text, offX = undefined, offY = undefined) {
      if (offX === undefined || offY === undefined) {
        let n = 0
        for (let i = 0; i < text.length; i++) {
          let ch = text.charCodeAt(i)
          if (ch > 255) {
            // 中文字符集
            n += 2
          } else {
            n++
          }
        }
        offX = -((n * 5) / 2)
        offY = -20
        return {
          content: text,
          offset: [offX, offY]
        }
      } else {
        return {
          content: text,
          offset: [offX, offY]
        }
      }
    },
    // 自动巡航点击提交按钮，将指令发送给后端
    submitAutoCruise() {
      if (this.autoCruise.planPointList.length > 10) {
        this.$message({
          message: '单设备航路点数目不能超过10，请重新规划',
          type: 'error'
        })
        return
      }

      let cmd = this.sendCmdByPath(
        this.autoCruise.deviceId,
        this.autoCruise.planPointList
      )

      this.$message({
        message: '自动巡航指令发送成功！' + cmd,
        type: 'success'
      })
      this.autoCruise.planPointList = []
    },
    //度转弧度
    deg2Rad(deg) {
      return (deg * Math.PI) / 180
    },
    //根据经纬度 方向(弧度) 距离(m)，计算另一点经纬度rad
    calc_position(lng, lat, rad, dis) {
      let EARTH_R = 6371.393 * 1000
      let result_lng =
        lng +
        (dis * Math.sin(rad)) /
        ((EARTH_R * Math.cos(this.deg2Rad(lat)) * 2 * Math.PI) / 360)
      let result_lat =
        lat + (dis * Math.cos(rad)) / ((EARTH_R * 2 * Math.PI) / 360)
      return {
        lng: Number(result_lng.toFixed(6)),
        lat: Number(result_lat.toFixed(6))
      }
    },
    /**
     * @description 通过中心点坐标、距中心距离、航路点数目、计算出其他点的坐标，参数都需要为数值类型
     * @returns 返回一个列表[{lng,lat}]
     */
    calc_pointList_byCenter(lng, lat, d, n) {
      let tempList = []
      for (let i = 0; i < n; i++) {
        tempList.push(this.calc_position(lng, lat, (2 * Math.PI * i) / n, d))
      }
      return tempList
    },
    /**
     * @description 通过顶部起始点坐标、边长、航路点数目、计算出其他点的坐标，参数都需要为数值类型
     * @returns 返回一个列表[{lng,lat}]
     */
    calc_pointList_byTop(lng, lat, edge_length, n) {
      let r = edge_length / (2 * Math.sin(Math.PI / n))
      let c_point = this.calc_position(lng, lat, Math.PI, r)
      return this.calc_pointList_byCenter(c_point.lng, c_point.lat, r, n)
    },
    //自动巡航点击规划按钮，对输入信息进行计算在地图上打点显示
    planAutoCruise() {
      this.autoCruise.planPointList = []
      if (this.autoCruise.selectedTab === '0') {
        let lng = Number(this.autoCruise.plan1.initPoint.lng)
        let lat = Number(this.autoCruise.plan1.initPoint.lat)
        let edge_length = Number(this.autoCruise.plan1.edge_length)
        let n = Number(this.autoCruise.plan1.n)
        this.autoCruise.planPointList = this.calc_pointList_byTop(
          lng,
          lat,
          edge_length,
          n
        )
      } else if (this.autoCruise.selectedTab === '1') {
        let lng = Number(this.autoCruise.plan2.initPoint.lng)
        let lat = Number(this.autoCruise.plan2.initPoint.lat)
        let d = Number(this.autoCruise.plan2.d)
        let n = Number(this.autoCruise.plan2.n)
        this.autoCruise.planPointList = this.calc_pointList_byCenter(
          lng,
          lat,
          d,
          n
        )
      }
    },
    //显示自动巡航菜单
    showAutoCruiseMenu() {
      this.closePlanCard()
      this.closeInfoCard()
      this.autoCruise.deviceId = this.infoCardData.markerInfo.id
      this.autoCruise.isShow = true
    },
    //关闭自动巡航菜单
    closeAutoCruiseMenu() {
      this.autoCruise = {
        isShow: false,
        selectedTab: '0',
        planPointList: [],
        selectedID: null,
        plan1: {
          initPoint: {},
          edge_length: null,
          n: null
        },
        plan2: {
          initPoint: {},
          d: null,
          n: null
        }
      }
    },
    //电子围栏区域删除按钮处理
    handleAreaDelete(areaInfo) {
      this.$confirm('是否确认删除名为' + areaInfo.name + '的区域?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        let req = []
        req.push(areaInfo.id)
        return deleteAreaInfo(req)
      }).then((res) => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getAllArea()
      })
    },
    /**
     * 电子围栏-获取围栏区域数据
     * */
    getAllArea() {
      let tempAreaList = []
      let data = {
        pageNum: -1,
        pageSize: 10
      }
      if (
        this.$store.getters.permissions.indexOf('map:area:page') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1
      ) {
        getAllAreaInfo(data).then((res) => {
          for (let item of res.rows) {
            let temp = {
              id: item.id,
              name: item.name,
              type: item.type,
              status: item.status,
              visible: item.visible,
              pointList: []
            }
            let temppointlist = []
            for (let item1 of item.areaPointResVOS) {
              let temp_area = {
                gpsX: item1.gpsX,
                gpsY: item1.gpsY,
                orderNumber: item1.orderNumber,
                status: item1.status
              }
              temppointlist.push(temp_area)
            }
            temppointlist.sort(function(a, b) {
              return a.orderNumber - b.orderNumber
            })
            for (let item2 of temppointlist) {
              temp.pointList.push([item2.gpsX, item2.gpsY])
            }
            tempAreaList.push(temp)
          }
          this.areaManage.areaList = tempAreaList
        })
      }
    },
    //电子围栏区域编辑按钮处理
    handleAreaUpdate(areaInfo) {
      this.areaManage.areaForm.id = areaInfo.id
      this.areaManage.areaForm.name = areaInfo.name
      this.areaManage.areaForm.visible = areaInfo.visible
      this.areaManage.areaForm.IsCircle = areaInfo.type === '2'
      let tempPointList = []
      if (areaInfo.type === '2') {
        for (let item of areaInfo.pointList) {
          tempPointList.push([item[0], item[1]])
        }
      } else {
        for (let item of areaInfo.pointList) {
          tempPointList.push([item.lng, item.lat])
        }
      }
      this.areaManage.areaForm.pointList = tempPointList
      this.areaManage.isAdd = false
      this.areaManage.editing = true
      this.areaManage.areaForm.isShow = true
    },

    StartDrawingCircle() {
      this.areaManage.areaForm.IsCircle = true
    },

    computeDistance(from, to) {
      if (!from || !to) return 0

      function toRad(value) {
        return (value * Math.PI) / 180
      }

      const R = 6378137 // 地球半径（单位：米）
      const dLat = toRad(to[1] - from[1])
      const dLng = toRad(to[0] - from[0])
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from[1])) *
        Math.cos(toRad(to[1])) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return R * c // 返回距离（单位：米）
    },

    // 创建圆形的路径点
    createCircle(center, radius, points) {
      const path = []
      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points
        const destination = computeDestinationPoint(
          { latitude: center[1], longitude: center[0] },
          radius,
          angle
        )
        path.push([destination.longitude, destination.latitude])
      }
      return path
    },
    // 围栏区域新增/编辑时点击保存提交后的操作
    submitAreaForm() {
      if (this.areaManage.isAdd) {
        // this.areaManage.areaForm.IsCircle
        //区域新增操作时
        let queryParam = {
          name: this.areaManage.areaForm.name,
          visible: this.areaManage.areaForm.visible,
          status: '0',
          type: '1',
          areaPointAddReqVOS: []
        }
        for (let index in this.areaManage.areaForm.pointList) {
          let item = this.areaManage.areaForm.pointList[index]
          queryParam.areaPointAddReqVOS.push({
            gpsX: item[0],
            gpsY: item[1],
            orderNumber: parseInt(index) + 1,
            status: '0'
          })
        }
        if (queryParam.areaPointAddReqVOS.length < 2) {
          this.$message.warning('请至少添加两个围栏点')
          return
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
            message: '电子围栏区域添加成功！',
            type: 'success'
          })
          this.closeAreaForm()
          this.getAllArea()
        })
      } else {
        //区域编辑操作时
        let queryParam = {
          id: this.areaManage.areaForm.id,
          name: this.areaManage.areaForm.name,
          visible: this.areaManage.areaForm.visible,
          status: '0',
          type: '1',
          areaPointUpdateReqVOS: []
        }
        for (let index in this.areaManage.areaForm.pointList) {
          let item = this.areaManage.areaForm.pointList[index]
          queryParam.areaPointUpdateReqVOS.push({
            gpsX: item[0],
            gpsY: item[1],
            orderNumber: parseInt(index) + 1,
            status: '0'
          })
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
            message: '修改成功！',
            type: 'success'
          })
          this.closeAreaForm()
          this.getAllArea()
        })
      }
    },
    //关闭新增/编辑区域框
    closeAreaForm() {
      this.areaManage.areaForm.isShow = false
      this.areaManage.editing = false
    },
    //围栏管理点击新增按钮-设置为新增状态并展示表单
    showAreaAdd() {
      this.areaManage.areaForm = {
        name: '',
        pointList: [],
        drawingPath: [],
        visible: true,
        type: '1'
      }
      this.areaManage.isAdd = true
      this.areaManage.editing = true
      this.areaManage.areaForm.isShow = true
    },
    // 数据导出-下载Excel
    downloadExcel() {
      this.$confirm('是否确认导出设备详情数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.infoCardData.downloading = true
        detailExcel(
          this.infoCardData.markerInfo.id,
          this.infoCardData.startdate,
          this.infoCardData.enddate
        ).then((res) => {
          if (res.code === 200) {
            // 下载文件
            // const url = res.data.url
            // const fileName = url.split('?')[0].split('/').pop() || '设备详情.xlsx'
            // this.$message.success('下载中，请稍候...')
            // downloadFile(url, fileName)

            this.download(res.data.url);
            this.infoCardData.downloading = false
          }
        }).catch((err) => {
          this.infoCardData.downloading = false
          this.$message.error('导出失败：' + (err.msg || '网络出现异常'))
        })
      })
    },
    //地图加载完成之后的处理-添加地图控件
    mapComplete() {
      //图层控制控件-默认卫星图
      try {
        this.$refs.gaodeMap.$$getInstance().addControl(
          new AMap.MapType({
            showRoad: true,
            defaultType: 1
          })
        )
        this.$refs.gaodeMap.$$getInstance().addControl(
          new AMap.ToolBar({
            defaultType: 1,
            locate: false,
            direction: false,
            position: 'RT',
            offset: new AMap.Pixel(18, 100)
          })
        )
        //测距的ruler
        const ruler1 = new AMap.RangingTool(
          this.$refs.gaodeMap.$$getInstance()
        ) // 初始化插件
        this.mapRuler = ruler1
        //地图比例尺
        const scale = new AMap.Scale({
          position: 'LB',
          offset: new AMap.Pixel(5, 96)
        })
        this.$refs.gaodeMap.$$getInstance().addControl(scale)
      } catch (error) {
        //异常处理，如果异常，进入刷新页面重新加载路由
        this.$router.replace({ path: '/refresh' })
      }
    },
    //  获取设备图标
    getDeviceImg(item) {
      return deviceIconConfig.getDeviceIcon(item);
    },
    // ais获取三角图标
    getTriangleImg(item) {
      return this.imgs.triangle_map
    },

    getDeviceTargetImg(item) {
      if (item.source === 'cmd') {
        return this.imgs.target_cmd
      } else if (item.source === 'msg') {
        return this.imgs.target_msg
      }
    },

    closeAllRoute() {
      this.closePolyline()
      this.multiRoute.routeIsShow = false
    },
    selectBlur() {
      this.$refs.searchSelection.blur()
    },
    //多轨迹显示-轨迹多颜色获取
    getMultiRouteColor(index) {
      return this.multiRoute.colorList[
      index % this.multiRoute.colorList.length
        ]
    },
    //多轨迹显示-获取多设备的轨迹并将其显示
    showMultiRoute() {
      this.multiRoute.routeList = []
      for (let item of this.multiSelectedDevice) {
        let prelongitude, prelatitude //getOneShipRoute(item.id, this.multiRoute.startdate, this.multiRoute.enddate)
        getTrail(
          item.id,
          this.multiRoute.startdate,
          this.multiRoute.enddate
        ).then((res) => {
          let tempRoute = []
          prelongitude = res.rows[res.rows.length - 1].longitude
          prelatitude = res.rows[res.rows.length - 1].latitude
          for (let item1 of res.rows.slice().reverse()) {
            if (
              item1.longitude - prelongitude > 5 ||
              item1.longitude - prelongitude < -5
            ) {
              prelongitude = item1.longitude
              prelatitude = item1.latitude
              continue
            }
            if (
              item1.latitude - prelatitude > 5 ||
              item1.latitude - prelatitude < -5
            ) {
              prelongitude = item1.longitude
              prelatitude = item1.latitude
              continue
            }
            let lnglat = [item1.longitude, item1.latitude]
            tempRoute.push(lnglat)
            prelongitude = item1.longitude
            prelatitude = item1.latitude
          }
          this.multiRoute.routeList.push(tempRoute)
        })
      }
      this.multiRoute.routeIsShow = true
      this.multiRoute.dialogIsShow = false
    },
    //多选设备-退出多选设备状态
    closeMultiSelectCard() {
      this.multiSelectCardIsShow = false
      this.multiSelectedDevice = []
    },

    //多选设备-点击多选设备按钮后的处理
    multiSelectDevice() {
      this.multiSelectCardIsShow = true
      this.closeInfoCard()
    },
    //路径动画-开始动画的函数
    startMarkerMove() {
      // this.routeInfo1.push([0,0]);
      // 1949: {longitude: 94.202614, latitude: 5.713392}
      // 1950: {longitude: 94.23575, latitude: 5.726305}
      // 1951: {longitude: 94.26614, latitude: 5.74011}
      // 1952: {longitude: 94.2976, latitude: 5.754115}
      // this.moveMarkerObject.moveAlong([[93.202614,5.713392],[94.23575,5.726305],[94.26614,5.74011],[94.2976,5.754115]], 159040000);
      //this.moveMarkerObject.moveAlong(this.routeInfo1, 159040000); //159040000
    },
    // 设备信息卡片：发送指令，根据设备类型区分跳转界面
    sendCmdPage(infoCardData) {
      this.$router.push({
        path: "/cmdsend",
        query: {
          deviceId: infoCardData.markerInfo.id,
        },
      });
    },
    idChanged(searchSelectedID) {
      //搜索框-内容变化
      const queryParam ={
        deviceId: searchSelectedID
      }
      getLocationByCode(queryParam).then((res) => {
        // 搜索框/更改中心点
        this.mapData.panTo([res.rows[0].gpsX0, res.rows[0].gpsY0])
        // 搜索框-记录中心点-使用红框框住对应图标
        this.select_center = [res.rows[0].gpsX0, res.rows[0].gpsY0]
        this.searchBoxIsShow = true
        setTimeout(() => {
          //延时关闭信息框
          this.searchBoxIsShow = false
        }, 5000)
        this.searchSelectedID = null
        // 自动点击该设备，弹出信息框
        let e = {
          target: this.$refs['device_' + searchSelectedID][0].$$getInstance()
        }
        this.$refs['device_' + searchSelectedID][0]
          .$$getInstance()
          .emit('click', e)
      })
    },

    // 初始化
    async init() {
      await getDeviceTypeTree().then((res) => {
        this.deviceTypeOptions = res.data
      })
      // 获取设备数据链条: infoCardData.markerInfo <- e.target.getExtData() <- deviceList <- 设备列表接口
      // （1）获取设备列表
      if (this.$store.getters.permissions.indexOf('map:device:all') !== -1
        || this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        getDeviceAll().then((res) => {
          if (res.code !== 200) {
            alert('请重新链接')
          } else {
            //此处把后端读取到的数据读入到我们存放设备信息的数组内
            this.deviceList = []
            this.bubble = []
            this.options = []
            this.deviceOptions = []

            for (let item of res.rows) {
              // 如果该设备不可见，那么跳过
              if (item.show === false) continue

              // 设备类型型号替换
              const deviceType = this.deviceTypeOptions.find(type => type.id === item.deviceType)
              const deviceTypeName = deviceType ? deviceType.label : '未知产品'
              const deviceModel = deviceType.children.find(model => model.id === item.deviceModel)
              const deviceModelName = deviceModel ? deviceModel.label : '未知型号'

              const temp = {
                id: item.id,
                lr: [
                  Number(item.gpsX0).toFixed(6) == null || item.gpsX0 == null
                    ? 0 : Number(item.gpsX0).toFixed(6),
                  (Number(item.gpsX0).toFixed(6) === 0 &&
                    Number(item.gpsY0).toFixed(6) === 0) ||
                  item.gpsY0 == null ? 90 : Number(item.gpsY0).toFixed(6)
                ],
                cdId: item.cdId,
                longitude: item.gpsX0,
                latitude: item.gpsY0,
                deviceName: item.deviceName,
                angle: item.heading == null ? 0 : item.heading, // 顺时针方向
                mark: item.mark,
                orgId: item.deptId,
                orgName: item.createBy,
                offset: [-18, -20],
                isError: item.isError,
                lngDegrees: this.D2Dms(item.gpsX0),
                latDegrees: this.D2Dms(item.gpsY0),
                sendDate: item.sendDate,
                datetime: item.sendDate ? item.sendDate.substring(0, 10) + ' ' + item.sendDate.substring(11, 19) : '',
                startDate: item.startTime,
                endDate: item.endDate, //结束时间为空？
                visible: item.show == null ? true : item.show,
                shower: item.deviceName + ' 速度: ' + item.speed_ave + 'm/s\n pich: ' + item.pitch + ' roll: ' + item.roll,
                deviceType: item.deviceType,
                deviceTypeName: deviceTypeName,
                deviceModel: item.deviceModel,
                deviceModelName: deviceModelName,
                commWays: item.deviceCommunicateResVOS,
                deviceIcon: item.deviceIcon,
                iconType: item.iconType
              }
              this.deviceList.push(temp)

              if (item.isNewMsg) {
                const temp2 = {
                  id: item.id,
                  lr: [item.gpsX0, item.gpsY0]
                }
                this.bubble.push(temp2)
              }

              //用于发送导航规划的指令
              const temp4 = {
                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName
              }
              this.deviceOptions.push(temp4)

              //搜索框
              const temp3 = {
                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName,
                lngDegrees: item.gpsX0,
                latDegrees: item.gpsY0
              }
              this.options.push(temp3)
            }
            setTimeout(() => {
              this.bubble = []
            }, 7000)
          }
        })
      }
      // （2）获取地图页面概要信息
      if (
        this.$store.getters.permissions.indexOf('map:overinfo') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1
      ) {
        getOverInfo().then((res) => {
          if (res.code !== 200) {
            alert('请重新链接')
          } else {
            this.overview.abnormal = (res.rows[0].abnormalGliderNum)
            this.overview.sum = (res.rows[0].sumGliderNum)
            this.overview.normal = (res.rows[0].normalGliderNum)
          }
        })
      }
    },

    D2Dms(d_data = 0) {
      let degree = parseInt(d_data)
      let min = Number(Math.abs(d_data - degree) * 60).toFixed(5)
      return degree + '°' + min + '′'
    },
    // 跳转"设备详情"页
    toDeviceDetailsPage() {
      // 设置参数
      this.deviceDetailParams = {
        deviceId: this.infoCardData.markerInfo.id,
        startDate: this.infoCardData.startdate,
        endDate: this.infoCardData.enddate,
      };
      // 显示加载状态
      this.iframeLoading = true;
      // 显示弹窗
      this.showDeviceDetail = true;
    },
    /**
     * 关闭设备状态浮动窗口
     */
    closeDeviceDetail() {
      this.showDeviceDetail = false;
      this.iframeLoading = false;
    },

    /**
     * iframe 加载完成
     */
    onIframeLoad() {
      this.iframeLoading = false;
    },
    // 后端发送指令，目标点
    sendCmdByPath(deviceId, pointList) {
      // 通过事件总线发送消息
      let path_str = ''
      let count = 0
      for (let key in pointList) {
        //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
        count++
        // 路径参数拼接
        path_str = path_str +
          Number(pointList[key].lng).toFixed(4) +
          ',' +
          Number(pointList[key].lat).toFixed(4) +
          ','
      }
      // 指令拼接
      for (let item of this.deviceOptions) {
        if (deviceId === item.id) {
          path_str =
            '$P,' + item.cdId + ',' + count + ',' + path_str + '*'
        }
      }

      let queryParam = [{
        cmdId: this.cmdList['mbd'], // 导航规划即目标点指令
        content: path_str,
        deviceId: deviceId,
        cmdType: '0'  //基础指令
      }]

      // 发送指令
      sendCmd(queryParam).then((res) => {
        if (res.code !== 200) {
          this.$message.error('指令发送失败')
        }
      })
      return path_str
    },
    // 获取所有指令
    getCmds() {
      if (this.$store.getters.permissions.indexOf('cmd:all') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1) {
        getCmds().then((res) => {
          for (let i in res.data) {
            //获取指令名和指令id的对应关系
            this.cmdList[res.data[i]['code']] = res.data[i]['id']
          }
        })
      }
    },

    getLngLat(lng, lat) {
      return [lng, lat]
    },
    // 路径导航规划里点击“确认”按钮后
    planConfirm() {
      let cmd = this.sendCmdByPath(
        this.infoCardData.markerInfo.id,
        this.planRoute
      )
      this.$message({
        message: '导航规划指令发送成功！' + cmd,
        type: 'success'
      })
      this.closePlanCard()
    },

    // 删除表格中的某条，导航规划/电子围栏/多选设备等共用
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    //关闭卡片按钮（路径规划)
    closePlanCard() {
      this.planFlag = false //让路径规划的坐标拾取关闭
      this.planRoute = []
      this.infoCardIsShow = true
      this.planCardIsShow = false
    },
    // 获取AIS数据
    queryAis() {
      this.Ais_triangle = []
      getAisInfo(parseInt(this.infoCardData.markerInfo.id))
        .then((res) => {
          for (let item1 in res) {
            if (res.hasOwnProperty(item1)) {
              let item0 = {
                lr: [res[item1].aisLongitude, res[item1].aisLatitude],
                angle: res[item1].aisHeading,
                mmsi: res[item1].mmsi,
                speed: res[item1].aisSpeed,
                time: res[item1].aisTime
              }
              this.Ais_triangle.push(item0)
            }
          }
        }).catch(() => {
        // 处理错误
      })
      this.AisInfoShow = true
    },

    // 打开导航规划
    enablePlan() {
      //打开路径导航规划卡片
      this.planFlag = true //让路径规划坐标拾取器开启
      this.infoCardIsShow = false
      this.planCardIsShow = true
      this.unablePicker() //同时关闭坐标拾取功能

      this.mapRuler.turnOff() //关闭测距
    },
    // 关闭导航规划
    unablePlan() {
      this.infoCardIsShow = true
      this.planCardIsShow = false
    },
    // 开启坐标拾取
    enablePicker() {
      this.pickerFlag = true
      this.mapRuler.turnOff() //关闭测距
    },
    // 关闭坐标拾取
    unablePicker() {
      this.pickerFlag = false
      this.picker = []
    },
    // 测距
    distanceMeasure() {
      // 若已打开，则关闭测距
      if (this.rulerFlag) {
        this.mapRuler.turnOff()
        AMap.event.removeListener(this.mapRulerMoveEvent)
        AMap.event.removeListener(this.mapRulerEndEvent)
        AMap.event.removeListener(this.mapRulerCancelEvent)
        AMap.event.removeListener(this.mapRulerAddnodeEvent)
        this.rulerLabel.isShow = false
      } else {  // 若未打开，则打开测距
        this.mapRuler.turnOn()
        this.rulerLabel.isShow = true
        this.mapRulerCancelEvent = AMap.event.addListener(
          this.mapRuler,
          'cancel',
          (e) => {
            this.rulerLabel.isShow = false
            this.rulerLabel.text = ''
          }
        )
        this.mapRulerEndEvent = AMap.event.addListener(
          this.mapRuler,
          'end',
          (e) => {
            this.rulerLabel.isShow = false
            this.rulerLabel.text = ''
          }
        )
        this.mapRulerAddnodeEvent = AMap.event.addListener(
          this.mapRuler,
          'addnode',
          (e) => {
            this.rulerLabel.isShow = true
          }
        )
        this.mapRulerMoveEvent = AMap.event.addListener(
          this.mapRuler,
          'move',
          (e) => {
            this.rulerLabel.isShow = true
            this.rulerLabel.position = [e.position.lng, e.position.lat]
            this.rulerLabel.text =
              '总长:' + Number(e.distance / 1000).toFixed(2) + '公里'
          }
        )
      }
      this.rulerFlag = !this.rulerFlag
    },
    // 显示/隐藏标签
    labelSwitch() {
      this.tempLabelIsShow = !this.labelIsShow //设备以点显示-增加本行代码用来临时存储标签的开关状态
      this.labelIsShow = !this.labelIsShow
    },
    // 显示轨迹
    showPolyline() {
      let prelongitude, prelatitude
      getTrail(
        this.infoCardData.markerInfo.id,
        this.infoCardData.startdate,
        this.infoCardData.enddate
      ).then((res) => {
        this.routeInfo1 = []
        prelongitude = res.rows[res.rows.length - 1].longitude
        prelatitude = res.rows[res.rows.length - 1].latitude
        for (let item of res.rows.slice().reverse()) {
          if (item.longitude - prelongitude > 5 ||
            item.longitude - prelongitude < -5) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if (item.latitude - prelatitude > 5 ||
            item.latitude - prelatitude < -5) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if ((item.longitude !== 0 && item.latitude !== 0) ||
            (item.longitude !== 0 && item.latitude !== 90)) {
            //把[0,0]处坐标舍去，00,0.0,0,0
            let temp = [item.longitude, item.latitude]
            this.routeInfo1.push(temp)
            prelongitude = item.longitude
            prelatitude = item.latitude
          }
        }
        this.polylineIsShow = true
        this.routeLengthIsShow = true

        this.setRouteLength() //路径长度-调用-异步问题

        //this.startMarkerMove(); //路径动画-调用路径动画函数，动画开始
      })

      // this.polylineIsShow = true;
    },
    // 显示轨迹，懒加载方式，暂未启用
    async lazyShowPolyline() {
      this.passedRoute = []
      this.routeInfo1 = []
      this.polylineIsShow = true
      let flag = false //是否已经找到有数据的区间
      let startDate = this.infoCardData.startdate
      let endDate = this.infoCardData.enddate
      if (
        this.infoCardData.enddate - this.infoCardData.startdate >
        1000 * 60 * 60 * 24
      ) {
        startDate = this.infoCardData.startdate
        endDate =
          startDate +
          Math.trunc(
            (this.infoCardData.enddate - this.infoCardData.startdate) / 10
          )
      }

      while (startDate < endDate) {
        // 调用设备轨迹接口
        await getTrail(
          this.infoCardData.markerInfo.id,
          startDate,
          endDate
        ).then((res) => {
          if (res.rows.length > 0) flag = true
          for (let item of res.rows.slice().reverse()) {
            let temp = [item.longitude, item.latitude]
            this.routeInfo1.push(temp)
          }
          // this.setRouteLength(); //路径长度-调用-异步问题
          // this.startMarkerMove(); //路径动画-调用路径动画函数，动画开始
        })
        startDate = endDate
        endDate =
          endDate +
          Math.trunc(
            (this.infoCardData.enddate - this.infoCardData.startdate) / 10
          )
        if (endDate > this.infoCardData.enddate) {
          endDate = this.infoCardData.enddate
        }
      }
      this.setRouteLength()
      this.routeLengthIsShow = true
    },
    // 初始化
    initialize(e) {
      this.overlay = e.overlay
      this.infoWindow = e.infoWindow
    },
    // 路径长度
    setRouteLength() {
      const distance = Math.round(
        AMap.GeometryUtil.distanceOfLine(this.routeInfo1)
      )
      this.routePathLengthText = '折线长' + distance / 1000 + '千米'
      this.routeFinPosition = this.routeInfo1[this.routeInfo1.length - 1]
      this.routeDistance = distance //给这个值定义，其他地方使用
    },
    // 关闭轨迹
    closePolyline() {
      this.polylineIsShow = false
      this.routeLengthIsShow = false
    },
    // 信息框显示
    showInfoCard() {
      this.infoCardIsShow = true
    },
    // 信息框关闭
    closeInfoCard() {
      this.infoCardIsShow = false
      this.targetShow.isShow = false //显示设备目标点-关闭目标点显示
      for (let i = 0; i < this.nTargetsShow.length; i++) {
        this.nTargetsShow[i].isShow = false
      }
    },
    // 关闭
    close() {
      this.infoWindow.close()
    },
    edit() {
      // console.log("编辑按钮测试");
    },
    del() {
      // console.log("删除按钮测试");
    },

    // 气泡显示
    getBubble() {
      return `
				<style>
				.wave {
				    position: absolute;
					top:0px;
					left:0px;
				    width: 100px;
				    height: 100px;
				    text-align: center;
				}
				.circle{
				    width: 100%;
				    height: 100%;
				    position: absolute;
					top:0px;
					left:0px;
				    border-radius: 50%;
				    opacity: 0;
				    background: #77ACF8 ;
				    animation: circle-opacity 2s 3; //infinite
				}

				@keyframes circle-opacity{
				    from {
				        opacity: 1;
				        transform: scale(0.25);
				    }
				    to {
				        opacity: 0;
				        transform: scale(0.5);
				    }
				}
				</style>

				     <div class="wave">
				         <div class="circle"></div>
				         <div >
				             <span style={{fontSize:"20px",}}></span>
				         </div>
				     </div>

				`
    },
    // 显示设备在/离线信息，旁边显示的备注
    getDeviceLabel(item) {
      return {
        content: `
                    <style>
                      .label-content-online {
                        color: rgb(0, 255, 127);
                        width: 5vw;
						            height: 1.5vw;
                        font-size: .5vw;
                        display: flex;
                        justify-content: space-around;
                        background-color: rgb(18, 34, 59);
                        // border: 1px solid blue;
                      }
                      .label-content-offline {
                        color: rgb(255, 0, 0);
                        width: 5vw;
						            height: 1.5vw;
                        font-size: .5vw;
                        display: flex;
                        justify-content: space-around;
                        background-color: rgb(18, 34, 59);
                        // border: 1px solid rgb(31, 210, 239);
                      }
                    </style>
                    <div class="${
          item.isError === true
            ? 'label-content-offline'
            : 'label-content-online'
        }">
                        <p style="border-right: 1px solid #989090;">${
          item.deviceName === 'null' ? '未命名' : item.deviceName
        }</p>
                        <p style="color:#ffffff;">${
          item.isError === true ? '异常' : '正常'
        }</p>
                    </div>`,
        offset: [25, -15]
      }
    }
  }
}
</script>


<style lang="css" scoped>
.amap-info-sharp {
  bottom: -1px;
  left: 48.5%;
  position: absolute;
  color: #fff;
  z-index: -1;
}

#del-div {
  position: absolute;
  right: 20px;
  top: 20px;
  transform: scale(1.2);
}
</style>

<style scoped>
@media screen and (max-width: 1280px) {
  .amap-info-sharp {
    bottom: -1px;
    left: 48.5%;
    position: absolute;
    color: #fff;
    z-index: -1;
  }

  #del-div {
    position: absolute;
    right: 20px;
    top: 20px;
    transform: scale(1.2);
  }

  .toolbar {
    margin-top: -90px !important;
  }

  .today-module {
    top: 120px !important;
  }
}

.amap-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
}

.topTab {
  position: absolute;
  width: 100%;
}

.transport-btn {
  width: 100px;
  height: 40px;
  background-image: url("../../../assets/map/bt-normal.png");
  color: #ffffff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.btn-active {
  background-image: url("../../../assets/map/bt-pressed.png");
}

.search-option >>> .el-input__inner {
  background-color: #0f3360;
  border-color: #132230;
}

.search-option {
  width: 240px;
}

.info-card-content-bg {
  background: #023379;
}

.info-card >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0.35);
  color: #ffffff;
}

.search-box >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0.35);
  color: #ffffff;
}

/* 多选设备-修改表格样式-start*/
.info-card >>> .el-table {
  background-color: #00000036;
  color: #ffffff;
}

.info-card >>> .el-table tr {
  background-color: #0000;
}

.info-card >>> .el-table .el-table__header-wrapper th {
  background-color: #00000000;
  color: #ffffff;
}

.info-card >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #00000036;
}

.info-card >>> .el-table__body-wrapper::-webkit-scrollbar {
  width: 16px;
}

.info-card >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
}

.info-card >>> .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

/* 多选设备-修改表格样式-end*/

/* 新悬浮框 */
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
  margin-bottom: 0px;
  padding: 0px 0px;
}

.el-main {
  background-color: #f0eff4;
  color: #7c7c7c;
  text-align: left;
  line-height: 30px;
  padding: 1px;
}

body > .el-container {
  margin-bottom: 0px;
}

.navbar {
  position: absolute;
  width: calc(100% - 35px);
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 60px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 60px;
}

.info-card-new {
  z-index: 1;
  position: absolute;
  top: 1px;
  left: 1px;
  width: 325px;
}

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

.info-card-new-text {
  color: #2d2d2d;
  font-size: 18px;
}

.info-card-new-icon {
  font-size: 25px;
  text-align: center;
}

.el-button + .el-button {
  margin-left: 0px;
}

/* 新悬浮框 */

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

/* .main>>>.amap-marker-label {
    padding: 0px;
    background-color: transparent;
    border: 0px solid transparent;
  } */
.main >>> .amap-marker-label {
  padding: 0px;
  background-color: rgb(18, 34, 59);
  color: white;
}

/* 比例尺样式修改 */
.amap-wrapper >>> .amap-scale-text {
  color: white;
  text-shadow: 1px 1px black;
}

.main >>> .amap-zoom-labels {
  display: none !important;
}

.info-card {
  z-index: 1;
  position: absolute;
  top: 70px;
  left: 70px;
}

.cejubutton {
  z-index: 2;
  position: absolute;
  bottom: 50px;
  right: 0px;
  margin-right: 1rem;
}

.labelshow {
  z-index: 2;
  position: absolute;
  bottom: 10px;
  right: 0px;
  margin-right: 1rem;
}

/* 多选设备-按钮的样式 */
.multi-selectc-button {
  z-index: 2;
  position: absolute;
  bottom: 90px;
  right: 0px;
  margin-right: 1rem;
}

.latinfo {
  width: 240px;
  z-index: 2;
  position: absolute;
  bottom: 25px;
  left: 3px;
  margin-right: 1rem;
  border: 1px solid rgb(255, 255, 255);
  background-color: #00000036;
  border-radius: 4px;
}

.info-card .el-button {
  color: #06f1ef;
}

/* 获取地图页面概要信息 */
.overinfo {
  width: 240px;
  z-index: 2;
  position: absolute;
  bottom: 66px;
  left: 3px;
  margin-right: 1rem;
}

.auto-cruise .el-input {
  width: 80px;
}

/* 设备状态弹窗样式 */
::v-deep .glider-detail-dialog {
  border-radius: 8px;
}

::v-deep .glider-detail-dialog .el-dialog__header {
  color: white;
  padding: 15px 20px;
}

.dialog-title-custom {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

::v-deep .glider-detail-dialog .el-dialog__title {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

::v-deep .glider-detail-dialog .el-dialog__headerbtn .el-dialog__close {
  color: white;
  font-size: 20px;
}

::v-deep .glider-detail-dialog .el-dialog__body {
  padding: 0;
  background-color: #f5f5f5;
}

</style>

/* 下方为全局样式区*谨慎使用* */
<style>
.el-popover {
  min-width: 60px;
}

.amap-info-content {
  background-color: #12223b;
}

.amap-icon img {
  max-height: 35px !important;
  max-width: 35px !important;
}

/* 设备以点显示-解决遮挡bug */
.amap-marker-content {
  white-space: nowrap !important;
}

@media screen and (max-width: 1670px) {
  .amap-marker-label > div {
    width: auto;
    padding: 0 4px;
  }

  .search-option {
    width: 100%;
  }

  .big-box > p > img {
    width: 35px;
    height: 35px;
  }

  .label-content-offline {
    font-size: 6px !important;
  }

  .label-content-offline > p {
    padding-right: 0 !important;
  }

  .label-content-online {
    font-size: 6px !important;
  }

  .label-content-online > p {
    padding-right: 0 !important;
  }

  .today-module {
    top: 106px !important;
  }
}

@media screen and (max-width: 1280px) {
  .amap-marker-label > div {
    width: auto;
    padding: 0 4px;
  }

  .stack-module {
    bottom: -73px !important;
  }

  .search-option {
    width: 100%;
  }

  .big-box > p > img {
    width: 25px;
    height: 25px;
  }

  .label-content-offline {
    font-size: 6px !important;
  }

  .label-content-offline > p {
    padding-right: 0 !important;
  }

  .label-content-online {
    font-size: 6px !important;
  }

  .label-content-online > p {
    padding-right: 0 !important;
  }
}

.glider-detail-dialog .el-dialog__body {
  padding: 0;
  overflow: hidden;
  height: auto;
}

.glider-detail-dialog .el-dialog__header {
  background-color: #1e1f25;
  color: #fff;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}
</style>

