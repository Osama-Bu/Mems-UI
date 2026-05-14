<template>

  <div class="home">
    <div class="navbar">
      <navbar/>
    </div>
    <!--  olmap -->
    <div id="zhmap" class="zhmap"></div>

    <!-- AIS新悬浮框 -->
    <div
      class="info-card-new"
      v-show="shopPopupAIS"
      style="width: 430px"
      v-has-permi="['map:target:single']"
    >
      <el-container>
        <el-header class="header1" style="height: 58px">
          <div style="color: #cb9d1d; font-size: 17px">
            <td>
              {{ infoCardData.markerInfo.ShipID }}
              {{ infoCardData.markerInfo.shiptype }}
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
            @click="closeInfoCard"
          >X</el-button>
          <tr>
            <td>{{ 'name:' + infoCardData.markerInfo.name }}</td>
            <td style="color: #484848">___</td>
            <td>{{ 'mmsi:' + infoCardData.markerInfo.mmsi }}</td>
          </tr>
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
            <i class="el-icon-position"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >船首向
            <div class="info-card-new-text" style="font-size: 16px">
              {{ infoCardData.markerInfo.hdg + ' 度' }}
            </div>
          </el-main>
          <el-main
          >船迹向
            <div class="info-card-new-text" style="font-size: 16px">
              {{ infoCardData.markerInfo.cog + ' 度' }}
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-ship"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >船速
            <div
              class="info-card-new-text"
              style="font-size: 16px; margin-right: 34px"
            >
              {{ infoCardData.markerInfo.sog + ' 节' }}
            </div>
          </el-main>
          <el-main
          >船向状态
            <div class="info-card-new-text" style="font-size: 16px">
              {{ infoCardData.markerInfo.navistat + ' ' }}
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
          >预到时间
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.eta_std }}
            </div>
          </el-main>
          <el-main
          >更新时间
            <div class="info-card-new-text">
              {{ parseTime(infoCardData.markerInfo.lasttime) }}
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon">
            <i class="el-icon-s-promotion"></i>
          </div>
        </el-aside>
        <el-container>
          <el-main
          >目的地
            <div class="info-card-new-text" style="font-size: 16px">
              {{ infoCardData.markerInfo.dest_std }}
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 新悬浮框 -->
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
              <span style="font-weight: normal; font-size: 18px; color: #e8c470;">{{infoCardData.markerInfo.orgName }}</span>
            </div>
            <div
              style="display: flex; margin-bottom: 4px; gap: 12px; font-size: 18px; color: #e8c470; align-items: center;"
            >
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
          >{{ $t('map.card.lng') }}
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.lr[0] }}
            </div>
          </el-main>
          <el-main
          >{{ $t('map.card.lat') }}
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
          >{{ $t('map.card.lng2') }}
            <div class="info-card-new-text">
              {{ infoCardData.markerInfo.lngDegrees }}
            </div>
          </el-main>
          <el-main
          >{{ $t('map.card.lat2') }}
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
          >{{ $t('map.card.current') }}
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
        >{{ $t('map.card.operate') }}
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
                      @click="showPolyline"
                      v-has-permi="['map:device:trail']"
                    >{{ $t('map.card.track.open') }}
                    </el-button>
                    <el-button
                      type="text"
                      class="button"
                      @click="closePolyline()"
                      v-has-permi="['map:device:trail']"
                    >{{ $t('map.card.track.close') }}
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
                    @click="openCmdPage()"
                    v-has-permi="['vue:map:view:cmd']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-position"></i>
                    </div>
                    <div style="font-size: 10px">{{ $t('map.card.command') }}</div>
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
                    <div style="font-size: 10px">{{ $t('map.card.deviceStatus') }}</div>
                  </el-button>
                </div>
              </el-main>
              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="queryAIS()"
                    v-has-permi="['map:aisinfo']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-data-analysis"></i>
                    </div>
                    <div style="font-size: 10px">{{ $t('map.card.aisInfo') }}</div>
                  </el-button>
                </div>
              </el-main>

              <el-main>
                <div style="text-align: center">
                  <el-button
                    type="text"
                    class="button"
                    style="color: #55aaff"
                    @click="queryAIS_shipxy()"
                    v-has-permi="['map:aisinfo']"
                  >
                    <div class="info-card-new-icon">
                      <i class="el-icon-data-analysis"></i>
                    </div>
                    <div style="font-size: 10px">{{ $t('map.card.proxyAis') }}</div>
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
                    <div style="font-size: 10px">{{ $t('map.card.navigation') }}</div>
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
                    <div style="font-size: 10px">{{ $t('map.card.export') }}</div>
                  </el-button>
                </div>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 新导航规划框 -->
    <div class="info-card-new" v-show="planCardIsShow" style="width: 405px">
      <el-container>
        <el-header class="header1" style="height: 56px">
          <div style="color: #cb9d1d">
            <td>{{ $t('map.navigation.title') }}</td>
            <td>{{ infoCardData.markerInfo.deviceName }}</td>
            <td>
              <el-button
                type="primary"
                plain
                class="button"
                @click="showAutoCruiseMenu()"
                style="margin-left: 30px; padding: 2px"
              >{{ $t('map.navigation.autoCruise.label') }}
              </el-button>
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
            @click="closePlanCard()"
          >X
          </el-button>
          <tr>
            <td>{{ $t('map.navigation.location') }}：{{ infoCardData.markerInfo.lr }}</td>
          </tr>
        </el-header>
      </el-container>

      <el-container>
        <el-aside width="47px">
          <div class="info-card-new-icon" style="text-align: center;">
            <i class="el-icon-map-location"></i>
            <el-button
              type="primary"
              plain
              class="button"
              @click="planConfirm()"
              v-has-permi="['cmd:send']"
              style="margin: 0 auto; padding: 2px;"
            >{{ $t('map.navigation.send') }}<br/>{{ $t('map.navigation.cmd') }}
            </el-button>
          </div>
        </el-aside>
        <el-container>
          <el-main style="padding: 0">
            <el-table
              :data="planRoute"
              style="width: 460px"
              border
              max-height="400"
            >
              <el-table-column type="index" :label="$t('map.navigation.order')"></el-table-column>

              <el-table-column :label="$t('map.navigation.lng')" width="125">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.lng"
                    :placeholder="$t('map.navigation.lng')"
                    @input="lngOrlatChange(scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column :label="$t('map.navigation.lat')" width="125">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.lat"
                    :placeholder="$t('map.navigation.lat')"
                    @input="lngOrlatChange(scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column :label="$t('map.navigation.operate')" width="70">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, planRoute)"
                    type="text"
                    size="small"
                  >
                    {{$t('map.navigation.remove')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 围栏管理框 -->
    <div class="info-card-new" v-show="areaManage.isShow" style="width: 405px">
      <el-container>
        <el-header class="header1" style="height: 56px">
          <div style="color: #cb9d1d">
            <td> {{ $t('map.areaManage.title') }}</td>
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
              >{{ $t('map.areaManage.add') }}
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
              <el-table-column type="index" :label="$t('map.areaManage.order')"></el-table-column>

              <el-table-column :label="$t('map.areaManage.areaName')" width="130" prop="name">
              </el-table-column>

              <el-table-column :label="$t('map.areaManage.show')" width="75">
                <template slot-scope="scope">
                  <span v-if="scope.row.visible">{{$t('map.areaManage.true')}}</span>
                  <span v-else>{{$t('map.areaManage.false')}}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('map.areaManage.operate')"
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
                    {{$t('map.areaManage.edit')}}
                  </el-button>
                  <el-button
                    @click.native.prevent="handleAreaDelete(scope.row)"
                    type="text"
                    size="small"
                    v-hasPermi="['map:area:delete']"
                  >
                    {{$t('map.areaManage.delete')}}
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
            <td>{{ this.areaManage.isAdd ? this.$t('map.areaManage.handle.add') : this.$t('map.areaManage.handle.edit') }}</td>
            <td>
              <span style="font-size: 14px; margin-left: 10px; color: #cecece">{{ $t('map.areaManage.handle.tips') }}</span>
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
            @click="closeAreaForm()"
          >X
          </el-button>
          <tr>
            <td>{{ $t('map.areaManage.handle.areaName') }}:</td>
            <td>
              <el-input
                v-model="areaManage.areaForm.name"
                :placeholder="$t('map.areaManage.handle.tip1')"
                size="mini"
                style="width: 120px; margin-right: 10px"
              ></el-input>
            </td>
            <td>{{ $t('map.areaManage.handle.show') }}:</td>
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
          <div class="info-card-new-icon" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <i class="el-icon-map-location"></i>
            <el-button
              type="primary"
              plain
              class="button"
              @click="submitAreaForm()"
              style="float: right; margin: 5px; padding: 2px"
            >{{ $t('map.areaManage.handle.save') }}
            </el-button>
            <el-button
              type="primary"
              plain
              class="button"
              @click="StartDrawingCircle()"
              style="float: right; margin: 5px; padding: 2px"
            >{{ $t('map.areaManage.handle.circle') }}
            </el-button>
          </div>
        </el-aside>
        <el-container>
          <el-main style="padding: 0">
            <el-table
              :data="areaManage.areaForm.pointList"
              style="width: 460px"
              max-height="400"
            >
              <el-table-column type="index" :label="$t('map.areaManage.handle.order')"></el-table-column>

              <el-table-column :label="$t('map.areaManage.handle.lng')" width="125">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[0]"
                    :placeholder="$t('map.areaManage.handle.lng')"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column :label="$t('map.areaManage.handle.lat')" width="125">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[1]"
                    :placeholder="$t('map.areaManage.handle.lat')"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column :label="$t('map.areaManage.handle.operate')" width="70">
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
                    {{$t('map.areaManage.handle.remove')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 自动巡航功能菜单框 -->
    <div
      class="info-card-new"
      v-show="autoCruise.isShow"
      style="width: 405px; box-shadow: -1px 1px 5px #333333"
    >
      <el-container>
        <el-header class="header1" style="height: 40px">
          <div style="color: #cb9d1d; font-size: 24px">
            <td>{{$t('map.navigation.autoCruise.title')}} ID:{{ infoCardData.markerInfo.cdId }}</td>
            <td>
              <span
                style="font-size: 14px; margin-left: 10px; color: #cecece"
              >{{$t('map.navigation.autoCruise.tips')}}</span>
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
            @click="closeAutoCruiseMenu()"
          >X
          </el-button>
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
              <el-tab-pane :label="$t('map.navigation.autoCruise.cruise1.label')"
              >{{$t('map.navigation.autoCruise.cruise1.title')}}
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
                  <el-button slot="reference" type="text">{{$t('map.navigation.autoCruise.cruise1.illustrate')}}</el-button>
                </el-popover>
                <el-form ref="form" :model="autoCruise.plan1">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise1.startPoint.label')" prop="initPoint">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise1.startPoint.lng')"
                          v-model="autoCruise.plan1.initPoint.lng"
                          style="width: 120px"
                        />
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise1.startPoint.lat')"
                          v-model="autoCruise.plan1.initPoint.lat"
                          style="width: 120px; margin-left: 5px"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise1.margin')" prop="r">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise1.tip1')"
                          v-model="autoCruise.plan1.edge_length"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise1.waypoints')" prop="n">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise1.tip2')"
                          v-model="autoCruise.plan1.n"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="margin-left: 105px">
                  <el-button type="primary" @click="planAutoCruise">{{$t('map.navigation.autoCruise.cruise')}}</el-button>
                  <el-button
                    type="primary"
                    @click="submitAutoCruise"
                    v-has-permi="['cmd:send']"
                    style="margin-left: 10px"
                    :disabled="this.autoCruise.planPointList.length === 0"
                  >{{$t('map.navigation.autoCruise.submit')}}
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('map.navigation.autoCruise.cruise2.label')"
              >{{$t('map.navigation.autoCruise.cruise2.title')}}
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
                  <el-button slot="reference" type="text">{{$t('map.navigation.autoCruise.cruise2.illustrate')}}</el-button>
                </el-popover>
                <el-form ref="form" :model="autoCruise.plan2">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise2.centerPoint.label')" prop="initPoint">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise2.centerPoint.lng')"
                          v-model="autoCruise.plan2.initPoint.lng"
                          style="width: 120px"
                        />
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise2.centerPoint.lat')"
                          v-model="autoCruise.plan2.initPoint.lat"
                          style="width: 120px; margin-left: 5px"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise2.centerDistance')" prop="r">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise2.tip1')"
                          v-model="autoCruise.plan2.d"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.navigation.autoCruise.cruise2.pointCount')" prop="n">
                        <el-input
                          :placeholder="$t('map.navigation.autoCruise.cruise2.tip2')"
                          v-model="autoCruise.plan2.n"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="margin-left: 105px">
                  <el-button type="primary" @click="planAutoCruise"
                  >{{$t('map.navigation.autoCruise.cruise')}}
                  </el-button>
                  <el-button
                    type="primary"
                    @click="submitAutoCruise"
                    style="margin-left: 10px"
                    :disabled="this.autoCruise.planPointList.length === 0"
                    v-has-permi="['cmd:send']"
                  >{{$t('map.navigation.autoCruise.submit')}}
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 设备多选 -->
    <div
      class="info-card-new"
      v-show="multiSelectCardIsShow"
      style="width: 318px"
    >
      <el-container>
        <el-header class="header1" style="height: 48px">
          <div style="color: #cb9d1d">
            <td>{{ $t('map.deviceMultiSelect.title') }}</td>
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
            <td>{{ $t('map.deviceMultiSelect.tips') }}</td>
          </tr>
        </el-header>
      </el-container>

      <el-container>
        <el-aside width="84px">
          <div style="text-align: center; width: 100%;">
            <el-button
              type="text"
              class="button"
              style="margin-right: 0;"
              @click="multiRoute.dialogIsShow = true"
              v-has-permi="['map:device:trail']"
            >
              <div class="info-card-new-icon">
                <i class="el-icon-check"></i>
              </div>
              {{ $t('map.deviceMultiSelect.multiTrack.open') }}
            </el-button>
            <el-button
              type="text"
              class="button"
              style="margin: 0"
              @click="closeMultiRoute"
              v-has-permi="['map:device:trail']"
            >
              <div class="info-card-new-icon">
                <i class="el-icon-close"></i>
              </div>
              {{ $t('map.deviceMultiSelect.multiTrack.close') }}
            </el-button>
            <el-button
              type="text"
              class="button"
              @click="multiAutoCruise.isShow = true"
              style="margin: 0"
            >
              <div class="info-card-new-icon">
              </div>
              {{ $t('map.deviceMultiSelect.formationCruise.label') }}
            </el-button>
          </div>
        </el-aside>
        <el-container>
          <el-main style="padding: 0; line-height: 66px">
            <el-table
              :data="multiSelectedDeviceList"
              style="width: 260px"
              border
              max-height="460px"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column type="index" :label="this.$t('map.deviceMultiSelect.order')" width="">
              </el-table-column>

              <el-table-column :label="this.$t('map.deviceMultiSelect.deviceId')" width="100" prop="cdId">
              </el-table-column>

              <el-table-column :label="this.$t('map.deviceMultiSelect.operate')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="
                      deleteRowOfMultiSelect(scope.$index, multiSelectedDeviceList)
                    "
                    type="text"
                    size="small"
                  >
                    {{ $t('map.deviceMultiSelect.remove') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
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
            <td>{{ $t('map.deviceMultiSelect.formationCruise.title') }}</td>
            <td>
              <span
                style="font-size: 14px; margin-left: 10px; color: #cecece"
              >{{ $t('map.deviceMultiSelect.formationCruise.tips') }}</span
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
            @click="closeMultiAutoCruiseMenu()"
          >X
          </el-button
          >
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
              <el-tab-pane :label="$t('map.deviceMultiSelect.formationCruise.cruise1.label')"
              >{{ $t('map.deviceMultiSelect.formationCruise.cruise1.title') }}
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
                  <el-button slot="reference" type="text">{{ $t('map.deviceMultiSelect.formationCruise.cruise1.illustrate') }}</el-button>
                </el-popover>
                <el-form
                  ref="form"
                  :model="multiAutoCruise.plan1"
                  label-width="100px"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.rows')" prop="N">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.rows')"
                          v-model="multiAutoCruise.plan1.N"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.columns')" prop="M">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.columns')"
                          v-model="multiAutoCruise.plan1.M"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.horizontalSpacing')" prop="row_d">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.tip1')"
                          v-model="multiAutoCruise.plan1.row_d"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.verticalSpacing')" prop="col_d">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.tip1')"
                          v-model="multiAutoCruise.plan1.col_d"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.startPoint.label')" prop="initPoint">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.startPoint.lng')"
                          v-model="multiAutoCruise.plan1.initPoint.lng"
                          style="width: 130px"
                        />
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.startPoint.lat')"
                          v-model="multiAutoCruise.plan1.initPoint.lat"
                          style="width: 130px; margin-left: 8px"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.margin')" prop="edge_length">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.tip3')"
                          v-model="multiAutoCruise.plan1.edge_length"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise1.waypoints')" prop="n">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise1.tip4')"
                          v-model="multiAutoCruise.plan1.n"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="margin-left: 105px">
                  <el-button type="primary" @click="planMultiAutoCruise()">{{ $t('map.deviceMultiSelect.formationCruise.cruise') }}</el-button>
                  <el-button
                    type="primary"
                    @click="submitMultiAutoCruise()"
                    v-has-permi="['cmd:send']"
                    style="margin-left: 10px"
                    :disabled="
                      this.multiAutoCruise.planPointList.length === 0
                    "
                  >{{ $t('map.deviceMultiSelect.formationCruise.submit') }}
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('map.deviceMultiSelect.formationCruise.cruise2.label')"
              >{{ $t('map.deviceMultiSelect.formationCruise.cruise2.title') }}
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
                  <el-button slot="reference" type="text">{{ $t('map.deviceMultiSelect.formationCruise.cruise2.illustrate') }}</el-button>
                </el-popover>
                <el-form
                  ref="form"
                  :model="multiAutoCruise.plan2"
                  label-width="100px"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise2.centerPoint.label')" prop="initPoint">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.centerPoint.lng')"
                          v-model="multiAutoCruise.plan2.initPoint.lng"
                          style="width: 130px"
                        />
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.centerPoint.lat')"
                          v-model="multiAutoCruise.plan2.initPoint.lat"
                          style="width: 130px; margin-left: 8px"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise2.centerDistance')" prop="r">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.tip1')"
                          v-model="multiAutoCruise.plan2.r"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise2.pointCount')" prop="N">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.tip2')"
                          v-model="multiAutoCruise.plan2.N"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise2.targetDistance')" prop="d">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.tip3')"
                          v-model="multiAutoCruise.plan2.d"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('map.deviceMultiSelect.formationCruise.cruise2.targetCount')" prop="M">
                        <el-input
                          :placeholder="$t('map.deviceMultiSelect.formationCruise.cruise2.tip4')"
                          v-model="multiAutoCruise.plan2.M"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="margin-left: 105px">
                  <el-button type="primary" @click="planMultiAutoCruise()"
                  >{{ $t('map.deviceMultiSelect.formationCruise.cruise') }}
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
                  >{{ $t('map.deviceMultiSelect.formationCruise.submit') }}
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 新多选框 -->
    <div v-show="true">
      <div class="tools">
        <table>
          <!-- <tr>
            <el-button type="text">AIS</el-button>
            <el-tooltip
              content="AIS设备显隐开关"
              placement="top"
              key="AISShow"
              prop="AISShow"
              v-has-permi="['vue:map:ais']"
            >
              <el-switch
                v-model="AISShow"
                active-color="#13ce66"
                inactive-color="#717171"
                :active-value="true"
                :inactive-value="false"
                @change="handleAISShowChange()"
                style="width: 33px"
              >
              </el-switch>
            </el-tooltip>
          </tr> -->
          <!-- <tr>
          <el-button type="text" @click="closeAllRoute()"
            v-if="polylineIsShow==true||multiRoute.routeIsShow==true">
            关闭轨迹</el-button>
        </tr> -->
          <tr>
            <el-button
              type="text"
              @click="multiSelectGlider()"
              v-has-permi="['vue:map:device:multi-select']"
            >
              {{ $t('map.deviceMultiSelect.label') }}
            </el-button>
          </tr>
          <tr>
            <el-button
              type="text"
              @click="areaManage.isShow = true"
              v-has-permi="['map:area:page']"
            >{{ $t('map.areaManage.label') }}
            </el-button>
          </tr>
          <tr>
            <el-button
              type="text"
              @click="distanceMeasure()"
              v-if="rulerFlag === false"
              v-has-permi="['vue:map:range']"
            >{{ $t('map.distanceMeasure.open') }}
            </el-button>
            <el-button
              type="text"
              @click="distanceMeasure()"
              v-else
              v-has-permi="['vue:map:range']"
            >{{ $t('map.distanceMeasure.close') }}
            </el-button>
          </tr>
          <tr>
            <el-button type="text" @click="enablePicker()" v-if="!pickerFlag">{{ $t('map.coordinatePick.open') }}</el-button>
            <el-button type="text" @click="unablePicker()" v-else>{{ $t('map.coordinatePick.close') }}</el-button>
          </tr>

          <tr>
            <el-button
              type="text"
              @click="labelSwitch()"
              v-if="labelIsShow === false"
              v-has-permi="['vue:map:label']"
            >{{ $t('map.deviceLabel.display') }}
            </el-button>
            <el-button
              type="text"
              @click="labelSwitch()"
              v-else
              v-has-permi="['vue:map:label']"
            >{{ $t('map.deviceLabel.hidden') }}
            </el-button>
          </tr>

          <tr>
            <el-popover placement="left" trigger="click">
              <div>
                <el-button
                  type="text"
                  @click="routeToGaode()"
                  v-has-permi="['vue:map:gaodemap']"
                >{{ $t('map.mapSwitch.gaodeMap') }}
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="routeToGoogle()"
                  v-has-permi="['vue:map:olmap']"
                >{{ $t('map.mapSwitch.olmap') }}
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="routeToWindy()"
                  v-has-permi="['vue:map:windymap']"
                >{{ $t('map.mapSwitch.windyMap') }}
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="routeToHt()"
                >{{ $t('map.mapSwitch.seaMap') }}
                </el-button>
              </div>
              <el-button
                type="text"
                slot="reference"
                v-has-permi="['vue:map:switch']"
              >{{ $t('map.mapSwitch.label') }}
              </el-button>
            </el-popover>
          </tr>
        </table>
      </div>
    </div>

    <!-- 多轨迹显示-日期选择对话框 -->
    <el-dialog
      :title="$t('map.deviceMultiSelect.multiTrack.title')"
      :visible.sync="multiRoute.dialogIsShow"
      width="30%"
    >
      <el-form>
        <el-form-item :label="$t('map.deviceMultiSelect.multiTrack.startTime')" label-width="120px">
          <el-date-picker
            v-model="multiRoute.startdate"
            type="datetime"
            value-format="timestamp"
            :placeholder="$t('map.deviceMultiSelect.multiTrack.tip1')"
            style="width: 195px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('map.deviceMultiSelect.multiTrack.endTime')" label-width="120px">
          <el-date-picker
            v-model="multiRoute.enddate"
            type="datetime"
            value-format="timestamp"
            :placeholder="$t('map.deviceMultiSelect.multiTrack.tip2')"
            style="width: 195px"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="multiRoute.dialogIsShow = false">{{ $t('system.cancel') }}</el-button>
        <el-button type="primary" @click="showMultiRoute()">{{ $t('system.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 显示左下角经纬度 -->
    <div type="info" class="latinfo" id="mouse-position"
         style="width: 280px; height: 48px;font-size: 13px;padding: 12px 18px;display: flex;align-items: center;gap: 8px;"
    >
      <!-- <span id="mouse-position" ></span> -->
    </div>

    <!-- 获取地图页面概要信息 -->
    <el-tag
      type="info"
      class="overinfo"
      color="#00000062"
      v-has-permi="['map:overinfo']"
      style="font-size: 40px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 280px;
      height: 32px;;"
    >
      <span style="font-size: 13px; color: #ffffff; line-height: 14px">{{ this.$t('map.overview.total')+'：' + this.overview.sum }}</span>
      <span style="
          font-size: 13px;
          color: #00ff00;
          padding-left: 1px;
          line-height: 14px;
        ">{{ this.$t('map.overview.normal')+'：' + this.overview.normal }}</span>
      <span style="
          font-size: 13px;
          color: #ff0000;
          padding-left: 1px;
          line-height: 14px;
        ">{{ this.$t('map.overview.abnormal')+ '：' + this.overview.abnormal }}</span>
<!--      <span style="-->
<!--            font-size: 13px;-->
<!--            color: #FFFF00;-->
<!--            padding-left: 1px;-->
<!--            line-height: 14px;-->
<!--          ">{{ ' 已停用：' + this.overview.disable }}</span>-->
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
          :placeholder="this.$t('map.sort.tips')"
          style="width: 160px; margin-right: 10px"
          @change="idChanged(searchSelectedID)"
          :default-first-option="true"
          class="idSelect"
          v-has-permi="['map:device:local']"
        >
          <el-option
            v-for="item in options"
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
        <span>{{ $t('map.card.deviceStatus_title') }}</span>
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

    <!-- 指令窗口浮动窗口 -->
    <el-dialog
      :visible.sync="showCmdPage"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="glider-detail-dialog"
      @close="closeCmdPage"
    >
      <div slot="title" class="dialog-title-custom">
        <span>{{ $t('map.card.command_title') }}</span>
      </div>
      <div style="height: 75vh; overflow: hidden;">
        <iframe
          v-if="showCmdPage"
          ref="gliderIframe"
          :src="cmdPageUrl"
          frameborder="0"
          style="width: 100%; height: 100%; border: none; display: block;"
          @load="onIframeLoad"
        ></iframe>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import NavigationLine from '@/utils/NavigationLine';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import MousePosition from 'ol/control/MousePosition';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import 'ol/ol.css';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Collection, Feature, Map, View } from 'ol';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { Draw, Translate } from 'ol/interaction';
import { Navbar } from '@/layout/components';
import Circle from 'ol/style/Circle';
import { getDeviceTypeTree } from '@/api/device/device'
import { getAisInfo, getAisTrail, getDeviceAll, getAreaShipInfo, getTrail, getNTargets, getOverInfo, getSpeedById } from '@/api/map/map';
import { detailExcel } from '@/api/status/status';
import { getCmds, sendCmd } from '@/api/command/command';
import { addAreaInfo, deleteAreaInfo, getAllAreaInfo, updateAreaInfo } from '@/api/map/area';
import { getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { computeDestinationPoint } from 'geolib';
import deviceIconConfig from '@/utils/DeviceIconConfig';
import deviceCommConfig from '@/utils/DeviceCommConfig';

export default {
  name: 'index',
  data() {
    return {
      // 设备状态弹窗
      showDeviceDetail: false,
      showCmdPage: false,
      iframeLoading: false,
      deviceDetailParams: {
        deviceId: '',
        startDate: '',
        endDate: '',
      },

      isTrackActive: false,
      //速度框数据
      speedDate: {
        id: undefined,
        startTimeStamp: 0,
        endTimeStamp: 0
      },
      // 测距功能数据区
      measure: {
        helpTooltipElement: null,
        feature: null,
        helpTooltip: null,
        draw: null,
        measureTooltipElement: null,
        measureTooltip: null,
        listener: null,
        mapMouseMove: null,
        drawLayers: [],
        drawElements: []
      },
      Ais_triangle_1: [
        {
          lr: [0, 0],
          MMSI_id: '',
          angle: '',
          speed: '',
          time: ''
        } // 可以添加更多的 AIS 三角形对象
      ],
      rulerFlag: false,

      lastRequestTime: 0,
      throttleDelay: 500, // 对函数重复请求时间限制

      //路径生成器对象
      pathCreator: null,

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
          isShow: false
        },
        isShow: false,
        editing: false,
        IsCircle: false
      },
      labelIsShow: false,
      show3: false,
      AISShow: true,
      planRoute: [], //用作导航规划使用
      shopPopup: false, //默认卡片不显示，
      shopPopupAIS: false, //默认卡片不显示，
      planFlag: false, //路径规划
      clickHandler: null, // 存储点击事件回调（用于后续移除事件监听）
      pickerFlag: false, //坐标拾取
      markerList: [], // 存储所有标记实例，用于后续管理（如清空）
      picker: [],
      planCardIsShow: false, //导航悬浮窗默认不显示
      updownIcon: true,
      mapRuler: {}, //测距的ruler
      PolylineLayer: {},
      map: {},

      // 设备点相关变量
      pointFeatureList: [],
      pointLayer: {},
      pointFeature: {},
      pointStyle: {},

      // AIS相关变量
      AISFeatureList: [],
      AISLayer: {},
      AISFeature: {},
      AISStyle: {},

      // 设备标签相关变量
      labelLayer: {},
      labelFeature: {},
      labelStyle: {},

      // 目标点相关变量
      // 将每个目标点的Layer对象存储在这个List中（msg和cmd的）  关闭悬浮框时全remove了
      targetLayerList: [],
      targetLayer: {},
      targetcmdLayer: {},
      targetmsgLayer: {},
      targetcmdFeature: {},
      targetmsgFeature: {},
      targetFeature: {},
      targetStyle: {},
      // 将每个指向目标点轨迹的Layer对象存储在这个List中（msg和cmd的）  关闭悬浮框时全remove了
      TargetPolylineLayerList: [],
      TargetPolylineLayer: {},
      TargetcmdPolylineLayer: {},
      TargetmsgPolylineLayer: {},
      TargetlabelFeature: {},
      TargetlabelStyle: {},
      //设备运行速度 求到达目标点的时间需要用
      speed: 0,

      // 设备定位
      PositionLayer: {},

      PlanMarkerLayer: {},
      planMarkerFeature: {},
      planMarkerPointIndex: 0,

      deviceList: [],
      deviceTypeOptions: [],

      ship: [],

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
      // 添加编队巡航点图层变量
      multiPlanPointsLayer: null,
      // 添加编队巡航连接线图层变量
      multiAutoCruiseRoutesLayer: null,

      //自动巡航功能-数据区
      autoCruise: {
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
      },
      autoPlanPointsLayer: null,

      deviceOptions: [], //存储设备code与物理ID用于指令的发送

      multiSelectedDeviceList: [], //多选设备-用来存储已经被选中的设备
      multiSelectCardIsShow: false, //多选设备-控制多选功能框的显示
      multiSelectLayer: {}, //多选设备-设备框图层
      multiSelectFeature: {}, //多选设备-设备框元素
      multiSelectBorderIndex: 0,
      //多轨迹显示-数据区
      multiRoute: {
        colorList: ['#efc133', '#00cc32', '#1a90ff', '#a01aff'],
        dialogIsShow: false,
        routeIsShow: false,
        startdate: '',
        enddate: '',
        routeList: []
      },
      MultiPolylineLayer: [],

      //搜索框
      selectedID: null,
      searchSelectedID: null, //搜索框-被选择的设备ID
      // 搜索框内容列表
      options: [
        {
          value: '1'
        }
      ],
      imgs: {
        planDotImg: require('@/assets/map/planMarker.png'),
        target_cmd: require('@/assets/map/target/target_cmd.png'),
        target_msg: require('@/assets/map/target/target_msg.png'),

        select_glider: require('@/assets/map/select_red.png'),
        select_green: require('@/assets/map/select_green.png') //多选设备-引入设备被选时的选定标志
      },

      popup: null,

      //地图界面设备概要信息
      overview: {
        abnormal: 0, // 不正常设备
        sum: 0, // 总设备
        normal: 0,  // 正常设备
        disable: 0  //停用设备
      },

      //鼠标移动的纬度
      mouseLat: 23.31,
      // 鼠标移动的经度
      mouseLng: 116.5,

      infoCardData: {
        //悬浮卡片，
        markerInfo: {
          //从deviceList里面获取的
          lr: [0, 0]
        },
        startdate: '',
        enddate: '',
        nowdate: '', //数据更新日期
        downloading: false
      },
      // 定时刷新
      intervalId: null,
      cmdList: {}, // 指令名转化成指令代码

      planMarkerEvents: {
        dragend(e) {
          e.target.getExtData().lng = e.lnglat.lng
          e.target.getExtData().lat = e.lnglat.lat

        }
      },
      polygonLayer: null, //电子围栏多边形显示图层
      drawLayer: null, //编辑/增加时显示的图层
      polygonstyles: [
        new Style({
          stroke: new Stroke({
            color: 'rgba(0,180,0,0.8)',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(255,0,0,0)'
          })
        })
      ],
      drawstyles: [
        new Style({
          stroke: new Stroke({
            color: 'rgba(0,180,0,0.8)',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(230,150,10,0.8)'
          })
        })
      ],
      drawgeojsonObject: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[]]
            }
          }
        ]
      },
      polygongeojsonObject: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[]]
            }
          }
        ]
      }
    }
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
    },
    // 指令界面
    cmdPageUrl() {
      const params = new URLSearchParams({
        deviceId: this.infoCardData.markerInfo.id,
        hideNavbar: 'true',
      });
      // 使用绝对路径，从根路径开始
      return `/cmdsend?${params.toString()}`;
    }
  },
  components: {
    Navbar
  },

  watch: {
    'infoCardData.markerInfo.id': {
      immediate: true, // 在组件创建时立即执行一次
      handler(newId) {
        if (newId) {
          this.fetchTargetData(newId)
        }
      }
    },
    //监听区域新增/编辑框中的数据变化，随时刷新地图中多边形的显示
    'areaManage.areaForm.pointList': {
      handler: function(item1, item2) {
        this.map.removeLayer(this.drawLayer) //删除图层

        // that.drawgeojsonObject.features[0].geometry.coordinates[0] = item1;
        if (this.areaManage.areaForm.IsCircle && this.areaManage.areaForm.pointList.length >= 2) {
          const [center, edge] = this.areaManage.areaForm.pointList
          const radius = this.computeDistance(center, edge)
          this.areaManage.areaForm.drawingPath = this.createCircle(
            center,
            radius,
            720
          )
          this.drawgeojsonObject.features[0].geometry.coordinates[0] =
            this.areaManage.areaForm.drawingPath
        } else {
            this.drawgeojsonObject.features[0].geometry.coordinates[0] = item1
        }

        this.drawLayer = new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(this.drawgeojsonObject)
          }),
          style: this.drawstyles
        })
        this.map.addLayer(this.drawLayer) //添加图层
        const mapProjection = this.map.getView().getProjection().getCode()
      },
      deep: true
    },
    // 电子围栏编辑
    'areaManage.editing': {
      handler: function(item1, item2) {
        if (item1 === false && item2 === true) {
          //也就是取消编辑
          this.map.removeLayer(this.drawLayer) //删除图层
          this.areaManage.areaForm.pointList = [] //清空pointlist
        }
      },
      deep: true,
      immediate: true //立即执行
    },
    // 电子围栏显示
    'areaManage.areaList': {
      handler: function(item1, item2) {
        this.map.removeLayer(this.polygonLayer) //删除图层
        const areas = []
        for (let item of item1) {
          if (item.visible) {
            if (item.type === '2') {  // 圆形
              const [center, edge] = item.pointList
              const radius = this.computeDistance(center, edge)
              item.drawingPath = this.createCircle(center, radius, 720)
              areas.push(item.drawingPath)
            } else if (item.type === '1') { // 多边形
              if (item.pointList.length === 1) continue
              areas.push(item.pointList)
            }
          }
        }
        this.polygongeojsonObject.features[0].geometry.coordinates = areas;

        (this.polygonLayer = new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(this.polygongeojsonObject)
          }),
          style: this.polygonstyles
        })),
          this.map.addLayer(this.polygonLayer) //添加图层
      }
      // deep:true,
      // immediate:true, //立即执行
    }
  },

  mounted() {

    this.init();
    // 离线模式
    this.initMapGoogleOffline();

    // 在线模式
    // this.initMapGoogleOnline();

    // 电子海图：易海航
    // this.initMapHtOnline();

    if (
      this.$store.getters.permissions.indexOf('cmd:all') !== -1 ||
      this.$store.getters.permissions.indexOf('*:*:*') !== -1
    ) {
      this.getCmdList()
    }
    this.pathCreator = new NavigationLine({ datas: [] }, this.map)
  },
  beforeDestroy() {
    clearInterval(this.intervalId) // 清除定时器
  },
  created() {
    this.getAllArea()
    this.intervalId = setInterval(() => {
      this.init()
    }, 3 * 60 * 1000) //3分钟
  },
  methods: {

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

    // 显示轨迹点
    showTrackPoints() {
      if (!this.trackPointsLayer) {
        // 确保不会重复添加
        const trackPointStyle = new Style({
          image: new Circle({
            radius: 4, // 圆点大小
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 2 })
          })
        })

        this.trackPointsLayer = new VectorLayer({
          source: new VectorSource({
            features: this.routeInfo1.map((coord) => {
              const pointFeature = new Feature({
                geometry: new Point([coord.lon, coord.lat]),
                id: coord.id, // 设备 ID
                sendDate: coord.time // 时间信息
              })
              pointFeature.setStyle(trackPointStyle)
              return pointFeature
            })
          })
        })

        this.map.addLayer(this.trackPointsLayer) // 添加轨迹点图层到地图
      }
    },

    // 隐藏轨迹点
    hideTrackPoints() {
      if (this.trackPointsLayer) {
        this.map.removeLayer(this.trackPointsLayer) // 移除轨迹点图层
        this.trackPointsLayer = null // 将图层变量设置为 null，防止重复移除
        this.map.render() // 强制重新渲染地图
      } else {
        //console.log("trackPointsLayer 未定义或已被移除");
      }
    },
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
    routeToWindy() {
      this.$router.push('/map/windymap')
    },

    routeToHt() {
      this.$router.push('/map/seamap')
    },
    /**
     初始化设备信息并打点至地图（搜索框、新消息提示）
     **/
    async init() {
      await getDeviceTypeTree().then((res) => {
        this.deviceTypeOptions = res.data
      })

      if (
        this.$store.getters.permissions.indexOf('map:device:all') !== -1 ||
        this.$store.getters.permissions.indexOf('*:*:*') !== -1
      ) {
        getDeviceAll().then((res) => {
          if (res.code !== 200) {
            alert('请重新链接')
          } else {
            //  此处把后端读取到的数据读入到我们存放设备信息的数组deviceList内
            this.deviceList = []
            this.options = []
            this.deviceOptions = []
            for (let item of res.rows) {
              //如果该设备不可见，那么跳过
              if (item.show === false) continue

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
                shower: item.deviceName + ' Speed: ' + (item.speed_ave !== null && item.speed_ave !== undefined ?
                  item.speed_ave.toFixed(2) : 'null') + 'm/s\n Pich: ' + item.pitch + ' Roll: ' + item.roll,

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
              }
              this.deviceList.push(temp)

              //搜索框
              const temp3 = {
                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName,
                lngDegrees: item.gpsX0,
                latDegrees: item.gpsY0
              }
              // 加入搜索框内容列表
              this.options.push(temp3)

              // 在地图中加入添加设备图标
              this.addDeviceToMap(temp)

              // pointFeature
              this.pointFeatureList.push(this.pointFeature)

              //用于发送导航规划的指令
              const temp4 = {
                id: item.id,
                cdId: item.cdId,
                deviceName: item.deviceName
              }
              this.deviceOptions.push(temp4)

              // 新消息提示
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
                }
                this.mapAddOverlay(temp2)
              }

            }
            // 提示闪烁7秒
            setTimeout(() => {
              this.mapRemoveOverlays()
            }, 7000)
          }
        })
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
     初始化地图（谷歌地图）
     **/
    initMapGoogleOffline() {
      /**
       * 水晶注 标准TMS 84 瓦片
       */
        //1.计算每层分辨率 0-20
      let this_ = this
      let resolution = []
      for (let i = 0; i <= 20; i++) {
        //256 瓦片宽度
        resolution[i] = ((180.0 / 256.0)) / Math.pow(2, i)
      }

      let layerTms = new TileLayer({
        source: new XYZ({
          tileUrlFunction: function(tileCoord) {
            let z = tileCoord[0] - 1
            let x = tileCoord[1]
            let y = Math.pow(2, z) - tileCoord[2] - 1
            return (
              'https://www.cloud.hydrovotech.com/tms/map/' +
              z +
              '/' +
              x +
              '/' +
              y +
              '.png'
            )
          },
          projection: 'EPSG:4326',
          wrapX: !0
        }),
        zIndex: 0,
        visible: true
      })
      let layerTms2 = new TileLayer({
        source: new XYZ({
          tileUrlFunction: function(tileCoord) {
            let z = tileCoord[0] - 1
            let x = tileCoord[1]
            let y = Math.pow(2, z) - tileCoord[2] - 1
            // 地图服务器url
            return (
              'https://www.cloud.hydrovotech.com/tms/mapi/' +
              z +
              '/' +
              x +
              '/' +
              y +
              '.png'
            )
          },
          projection: 'EPSG:4326',
          wrapX: !0
        }),
        zIndex: 1,
        visible: true
      })
      this.polygonLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.polygongeojsonObject)
        }),
        style: this.polygonstyles
      })

      this.map = new Map({
        view: new View({
          center: [120.5, 23.31],
          zoom: 6,
          minZoom: 2,
          // 以下注释掉可以无限放大图片
          //maxZoom: 14,
          projection: 'EPSG:4326'
        }),
        target: 'zhmap',
        projection: 'EPSG:4326',
        layers: [layerTms, layerTms2, this.polygonLayer],

        //加载控件到地图容器中
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })
      //监听地图的缩放
      this.map.on('moveend', function(e) {
        const zoom = this_.map.getView().getZoom() //获取当前地图的缩放级别
        // 控制轨迹点显示
        if (this_.isTrackActive) {
          if (zoom < 4) {
            this_.hideTrackPoints() // 缩小时隐藏轨迹点
          } else {
            this_.showTrackPoints() // 放大到一定程度时显示轨迹点
          }
        }

        if (zoom < 4) {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let PointStyle = undefined
            if (
              this_.pointFeatureList[i].values_.mark &&
              this_.pointFeatureList[i].values_.mark.includes('BEACON')
            ) {
              PointStyle = new Style({
                // 设置图片效果
                image: new Icon({
                  src: require('@/assets/map/point/beacon.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            } else {
              PointStyle = new Style({
                // 设置图片效果
                image: new Icon({
                  src: require('@/assets/map/point/glider.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            }
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        } else {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let img = deviceIconConfig.getDeviceIcon(this_.deviceList[i])
            let PointStyle = new Style({
              // 设置图片效果
              image: new Icon({
                src: img,
                rotation: this_.deviceList[i].angle * Math.PI / 180,  // OpenLayers 的rotation接收的是弧度值，角度转弧度：弧度 = 角度 * Math.PI / 180
                scale: 0.6
              }),
              zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
            })
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        }
        this.pathCreator = new NavigationLine({ datas: [] }, this_.map)
      })

      // 创建比例尺控件
      const scaleLineControl = new ScaleLine({
        units: 'metric', // 设置比例尺单位为米制
        className: 'ol-scale-line' // 可选，指定 CSS 类名来定制样式
      })
      //设置比例尺的样式
      // var scaleLineElement = document.querySelector('.ol-scale-line');
      // scaleLineElement.style.color = 'red'; // 设置为红色

      // 将比例尺控件添加到地图
      this.map.addControl(scaleLineControl)

      this.mousemove()
      this.singleclick()
      this.pointerdrag()

      // 鼠标获取坐标，左下角经纬度
      const mousePositionControl = new MousePosition({
        coordinateFormat: (coordinate) => {
          let lngDms = this.D2Dms(coordinate[0])
          let latDms = this.D2Dms(coordinate[1])
          return `<table border="0" width="220" style="table-layout:fixed;">
                  <colgroup>
                    <col style="width: 120px;">
                    <col style="width: 120px;">
                  </colgroup>
                    <tr>
                      <td> ${this.$t('system.lng1')}：${coordinate[0].toFixed(6)}</td>
                      <td>（${lngDms}）</td>
                    </tr>
                    <tr>
                      <td>${this.$t('system.lat1')}：${coordinate[1].toFixed(6)}</td>
                      <td>（${latDms}）</td>
                    </tr>
                  </table>`
        },
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        placeholder: `<table border="0" width="220" style="table-layout:fixed; ">
                    <colgroup>
                      <col style="width: 120px;">
                      <col style="width: 120px;">
                    </colgroup>
                      <tr>
                        <td>${this.$t('system.lng1')}：0.00</td>
                        <td>（0°0.00′）</td>
                      </tr>
                      <tr>
                        <td>${this.$t('system.lat1')}：0.00</td>
                        <td>（0°0.00′）</td>
                      </tr>
                    </table>`
      })
      this.map.addControl(mousePositionControl)
    },

    /**
     * 易航海 电子海图
     * */
    initMapHtOnline() {
      let this_ = this
      // 易航海海图：EPSG:4326 经纬度直投（官方标准）
      // 中国近海海图
      let chinaSeaLayer = new TileLayer({
        source: new XYZ({
          url: 'https://seamap.ehanghai.cn/ehhht/{z}/{y}/{x}.png?appKey=b01945a3e93f4f8fa2eea8abd0842586',
          projection: 'EPSG:3857',
          crossOrigin: 'anonymous'
        }),
        zIndex: -1,
        visible: true
      });

      // 远海/全球海图
      let globalSeaLayer = new TileLayer({
        source: new XYZ({
          url: 'https://seamap.ehanghai.cn/ehhqqt/{z}/{y}/{x}.png?appKey=b01945a3e93f4f8fa2eea8abd0842586',
          projection: 'EPSG:3857',
          crossOrigin: 'anonymous'
        }),
        zIndex: -2,
        visible: true
      });

      this.polygonLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.polygongeojsonObject)
        }),
        style: this.polygonstyles
      })

      this.map = new Map({
        view: new View({
          center: [120.5, 23.31],
          zoom: 6,
          minZoom: 2,
          maxZoom: 16,
          projection: 'EPSG:4326'
        }),
        target: 'zhmap',
        // ======= 同时加载两个海图 =======
        layers: [globalSeaLayer, chinaSeaLayer, this.polygonLayer],
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })

      this.map.on('moveend', function(e) {
        const zoom = this_.map.getView().getZoom()
        if (this_.isTrackActive) {
          if (zoom < 4) {
            this_.hideTrackPoints()
          } else {
            this_.showTrackPoints()
          }
        }

        if (zoom < 4) {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let PointStyle = undefined
            if (
              this_.pointFeatureList[i].values_.mark &&
              this_.pointFeatureList[i].values_.mark.includes('BEACON')
            ) {
              PointStyle = new Style({
                image: new Icon({
                  src: require('@/assets/map/point/beacon.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            } else {
              PointStyle = new Style({
                image: new Icon({
                  src: require('@/assets/map/point/glider.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            }
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        } else {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let img = deviceIconConfig.getDeviceIcon(this_.deviceList[i])
            let PointStyle = new Style({
              image: new Icon({
                src: img,
                rotation: this_.deviceList[i].angle * Math.PI / 180,
                scale: 0.6
              }),
              zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
            })
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        }
        this.pathCreator = new NavigationLine({ datas: [] }, this_.map)
      })

      const scaleLineControl = new ScaleLine({
        units: 'metric',
        className: 'ol-scale-line'
      })
      this.map.addControl(scaleLineControl)

      this.mousemove()
      this.singleclick()
      this.pointerdrag()

      const mousePositionControl = new MousePosition({
        coordinateFormat: (coordinate) => {
          let lngDms = this.D2Dms(coordinate[0])
          let latDms = this.D2Dms(coordinate[1])
          return `<table border="0" width="220" style="table-layout:fixed;">
          <colgroup>
            <col style="width: 120px;">
            <col style="width: 120px;">
          </colgroup>
            <tr>
              <td> ${this.$t('system.lng1')}：${coordinate[0].toFixed(6)}</td>
              <td>（${lngDms}）</td>
            </tr>
            <tr>
              <td>${this.$t('system.lat1')}：${coordinate[1].toFixed(6)}</td>
              <td>（${latDms}）</td>
            </tr>
          </table>`
        },
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        placeholder: `<table border="0" width="220" style="table-layout:fixed; ">
            <colgroup>
              <col style="width: 120px;">
              <col style="width: 120px;">
            </colgroup>
              <tr>
                <td>${this.$t('system.lng1')}：0.00</td>
                <td>（0°0.00′）</td>
              </tr>
              <tr>
                <td>${this.$t('system.lat1')}：0.00</td>
                <td>（0°0.00′）</td>
              </tr>
            </table>`
      })
      this.map.addControl(mousePositionControl)
    },


    /**
     *
     * 谷歌在线地图
     * */
    initMapGoogleOnline() {
      let this_ = this
      let resolution = []
      for (let i = 0; i <= 20; i++) {
        resolution[i] = ((180.0 / 256.0)) / Math.pow(2, i)
      }

      let googleLayer = new TileLayer({
        source: new XYZ({
          // url: 'https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',  // 道路图
          // url: 'https://mt1.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', // 纯卫星图
          url: 'https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', // 混合模式
          projection: 'EPSG:3857'  // 谷歌用的是3857投影
        }),
        zIndex: 0,
        visible: true
      });

      this.polygonLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.polygongeojsonObject)
        }),
        style: this.polygonstyles
      })

      this.map = new Map({
        view: new View({
          center: [120.5, 23.31],
          zoom: 6,
          minZoom: 2,
          // 以下注释掉可以无限放大图片
          //maxZoom: 14,
          projection: 'EPSG:4326'
        }),
        target: 'zhmap',
        projection: 'EPSG:4326',
        layers: [googleLayer, this.polygonLayer],

        //加载控件到地图容器中
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })
      //监听地图的缩放
      this.map.on('moveend', function(e) {
        const zoom = this_.map.getView().getZoom() //获取当前地图的缩放级别
        // 控制轨迹点显示
        if (this_.isTrackActive) {
          if (zoom < 4) {
            this_.hideTrackPoints() // 缩小时隐藏轨迹点
          } else {
            this_.showTrackPoints() // 放大到一定程度时显示轨迹点
          }
        }

        if (zoom < 4) {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let PointStyle = undefined
            if (
              this_.pointFeatureList[i].values_.mark &&
              this_.pointFeatureList[i].values_.mark.includes('BEACON')
            ) {
              PointStyle = new Style({
                // 设置图片效果
                image: new Icon({
                  src: require('@/assets/map/point/beacon.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            } else {
              PointStyle = new Style({
                // 设置图片效果
                image: new Icon({
                  src: require('@/assets/map/point/glider.png'),
                  scale: 1
                }),
                zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
              })
            }
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        } else {
          for (let i = 0; i < this_.deviceList.length; i++) {
            let img = deviceIconConfig.getDeviceIcon(this_.deviceList[i])
            let PointStyle = new Style({
              // 设置图片效果
              image: new Icon({
                src: img,
                rotation: this_.deviceList[i].angle * Math.PI / 180,  // OpenLayers 的rotation接收的是弧度值，角度转弧度：弧度 = 角度 * Math.PI / 180
                scale: 0.6
              }),
              zIndex: this_.deviceList[i].mark === 'BEACON' ? 98 : 99
            })
            this_.pointFeatureList[i].setStyle(PointStyle)
          }
        }
        this.pathCreator = new NavigationLine({ datas: [] }, this_.map)
      })

      // 创建比例尺控件
      const scaleLineControl = new ScaleLine({
        units: 'metric', // 设置比例尺单位为米制
        className: 'ol-scale-line' // 可选，指定 CSS 类名来定制样式
      })
      //设置比例尺的样式
      // var scaleLineElement = document.querySelector('.ol-scale-line');
      // scaleLineElement.style.color = 'red'; // 设置为红色

      // 将比例尺控件添加到地图
      this.map.addControl(scaleLineControl)

      this.mousemove()
      this.singleclick()
      this.pointerdrag()

      // 鼠标获取坐标，左下角经纬度
      const mousePositionControl = new MousePosition({
        coordinateFormat: (coordinate) => {
          let lngDms = this.D2Dms(coordinate[0])
          let latDms = this.D2Dms(coordinate[1])
          return `<table border="0" width="220" style="table-layout:fixed;">
                  <colgroup>
                    <col style="width: 120px;">
                    <col style="width: 120px;">
                  </colgroup>
                    <tr>
                      <td> ${this.$t('system.lng1')}：${coordinate[0].toFixed(6)}</td>
                      <td>（${lngDms}）</td>
                    </tr>
                    <tr>
                      <td>${this.$t('system.lat1')}：${coordinate[1].toFixed(6)}</td>
                      <td>（${latDms}）</td>
                    </tr>
                  </table>`
        },
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        placeholder: `<table border="0" width="220" style="table-layout:fixed; ">
                    <colgroup>
                      <col style="width: 120px;">
                      <col style="width: 120px;">
                    </colgroup>
                      <tr>
                        <td>${this.$t('system.lng1')}：0.00</td>
                        <td>（0°0.00′）</td>
                      </tr>
                      <tr>
                        <td>${this.$t('system.lat1')}：0.00</td>
                        <td>（0°0.00′）</td>
                      </tr>
                    </table>`
      })
      this.map.addControl(mousePositionControl)
    },
    /**
     船讯网数据预处理
     **/
    getShipType(item) {
      if (item == 50) {
        return '引航船'
      } else if (item == 51) {
        return '搜救船'
      } else if (item == 52) {
        return '拖轮'
      } else if (item == 53) {
        return '港口供应船'
      } else if (item == 54) {
        return '载有防污染装置和设备的船舶'
      } else if (item == 55) {
        return '执法艇'
      } else if (item == 56) {
        return '备用-用于当地船舶的任务分配'
      } else if (item == 57) {
        return '备用-用于当地船舶的任务分配'
      } else if (item == 58) {
        return '医疗船（如 1949 年日内瓦公约及附加条款所规定'
      } else if (item == 59) {
        return '符合 18 号决议（Mob-83）的船舶'
      } else if (item == 30) {
        return '捕捞'
      } else if (item == 31) {
        return '拖引'
      } else if (item == 32) {
        return '拖引并且船长>200m 或船宽>25'
      } else if (item == 33) {
        return '疏浚或水下作业'
      } else if (item == 34) {
        return '潜水作业'
      } else if (item == 35) {
        return '参与军事行动'
      } else if (item == 36) {
        return '帆船航行'
      } else if (item == 37) {
        return '娱乐船'
      } else if (item >= 20 && item <= 29) {
        return '地效应船'
      } else if (item >= 40 && item <= 49) {
        return '高速船'
      } else if (item >= 60 && item <= 69) {
        return '客船'
      } else if (item >= 70 && item <= 79) {
        return '货船'
      } else if (item >= 80 && item <= 89) {
        return '油轮'
      } else if (item >= 90 && item <= 99) {
        return '其他类型的船舶'
      } else if (item == 100) {
        return '集装箱'
      }
    },
    getNaviStat(item) {
      if (item == 0) {
        return '在航（主机推动）'
      } else if (item == 1) {
        return '锚泊'
      } else if (item == 2) {
        return '失控'
      } else if (item == 3) {
        return '操纵受限'
      } else if (item == 4) {
        return '吃水受限'
      } else if (item == 5) {
        return '靠泊'
      } else if (item == 6) {
        return '搁浅'
      } else if (item == 7) {
        return '捕捞作业'
      } else if (item == 8) {
        return '靠帆船提供动力'
      } else if (item == 9) {
        return '为将来 HSC 航行状态修正保留'
      } else if (item == 10) {
        return '为将来 WIG 航行状态修正保留'
      } else if (item <= 14 && item >= 11) {
        return '为将来使用保留'
      }
    },
    /**
     初始化船讯网信息并打点至地图1
     **/
    initShip() {
      getAreaShipInfo().then((res) => {
        this.ship = []
        for (let item of res.data) {
          let tempLat = item.lat / 1000000
          let tempLon = item.lon / 1000000
          const temp = {
            gliderType: 'AIS',
            ShipID: item.ShipID,
            mmsi: item.mmsi,
            From: item.From,
            callsign: item.callsign,
            dest: item.dest,
            dest_std: item.dest_std,
            destcode: item.destcode,
            draught: item.draught,
            eta: item.eta,
            eta_std: item.eta_std,
            imo: item.imo,
            lasttime: item.lasttime,
            left: item.left,
            length: item.length,
            name: item.name,
            navistat: this.getNaviStat(item.navistat),
            shiptype: this.getShipType(item.shiptype),
            trail: item.trail,
            width: item.width,
            lat: item.lat / 1000000,
            lon: item.lon / 1000000,
            rot: item.rot / 100, // 度
            sog: (item.sog / 1000 / 0.51444).toFixed(6), // 节
            hdg: item.hdg / 100, // 度
            cog: item.cog / 100, // 度
            lr: [
              Number(tempLon).toFixed(6) == null || tempLon == null
                ? 0
                : Number(tempLon).toFixed(6),
              (Number(tempLon).toFixed(6) === 0 &&
                Number(tempLat).toFixed(6) === 0) ||
              tempLat == null
                ? 90
                : Number(tempLat).toFixed(6)
            ],
            lngDegrees: this.D2Dms(tempLon),
            latDegrees: this.D2Dms(tempLat)
          }
          this.ship.push(temp)
          this.addShip(temp)
        }
      })
    },
    /**
     初始化船讯网信息并打点至地图2
     **/
    addShip(item) {
      let coordinate = item.lr
      if (Object.keys(this.pointLayer).length == 0) {
        // 创建图层
        this.pointLayer = new VectorLayer({
          source: new VectorSource(),
          zIndex: 50
        })
        // 图层添加到地图上
        this.map.addLayer(this.pointLayer)
      }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.pointFeature = new Feature({
        geometry: new Point(coordinate)
      })
      //为feature添加设备点信息
      this.pointFeature.setProperties(item)
      // 设置要素的图标
      this.pointStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: require('@/assets/map/shipYellow.png'),
          rotation: item.hdg * Math.PI / 180,
          scale: 0.4
        }),
        zIndex: item.iconType === '4' ? 98 : 99
      })
      this.pointFeature.setStyle(this.pointStyle)
      //设置要素的ID
      this.pointFeature.setId(item.id)
      // 要素添加到地图图层上
      this.pointLayer.getSource().addFeature(this.pointFeature)
    },

    /**
     拖拽
     **/
    pointerdrag() {
      // 拖拽
      let this_ = this
      this.map.on('pointerdrag', (e) => {
        let coordinates = e.coordinate
        let feature = this.map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        )
        if (feature) {
          if (feature.get('featureName') === 'PlanMarker') {
            //点击在坐标点上
            // 直接修改点位位置
            this.planRoute.forEach(function(pr) {
              if (pr.index === feature.id_) {
                pr.lng = e.coordinate[0].toFixed(6)
                pr.lat = e.coordinate[1].toFixed(6)
              }
            })
            feature.setGeometry(new Point(e.coordinate))
          }
        }
      })
    },
    /**
     创建div的函数
     **/
    createDiv() {
      // 创建一个div元素
      const elementDiv = document.createElement('div')
      elementDiv.className = 'my-map-overlay'
      elementDiv.innerHTML = `

                        <div class="wave" >
                        <div class="circle"></div>
                        <div >
                            <span style={{fontSize:"20px",}}></span>
                        </div>
                    </div>

                            `
      // 设置div元素的cid属性
      //elementDiv.setAttribute("myid", id);
      return elementDiv
    },
    /**
     添加Overlays,新消息提示
     **/
    mapAddOverlay(item) {
      const newBubble = new Overlay({
        id: item.id,
        // 设置位置为当前节点的坐标
        position: [item.lr[0], item.lr[1]],
        // 设置覆盖层与位置之间的匹配方式
        //positioning: "bottom-left",
        // 偏移量  默认值是 [0, 0] 正值分别向右和向下偏移
        offset: [-50, -50],
        // 覆盖层元素
        element: this.createDiv(),
        // 事件传播到地图视点的时候是否应该停止
        stopEvent: false
      })
      this.map.addOverlay(newBubble)
    },
    /**
     删除Overlays,取消新消息提示
     **/
    mapRemoveOverlays() {
      this.map.getOverlays().clear()
    },
    /**
     日期格式转换
     **/
    D2Dms(d_data = 0) {
      let degree = parseInt(d_data)
      let min = Number(Math.abs(d_data - degree) * 60).toFixed(5)
      return degree + '°' + min + '′'
    },

    pointermove() {
      this.map.on('pointermove', (e) => {
        if (this.openMap.hasFeatureAtPixel(e.pixel)) {
          this.map.getViewport().style.cursor = 'pointer'
        } else {
          this.map.getViewport().style.cursor = 'inherit'
        }
      })
    },

    showDeviceInfo(shower, coordinate) {
      if (!shower || !coordinate) {
        // 如果不存在设备信息，则不执行任何操作
        return
      }
      let deviceInfoElement = document.createElement('div')
      // 创建用于显示设备 ID 的 HTML 元素
      deviceInfoElement.className = 'device-info'
      deviceInfoElement.textContent = shower
      // 将元素添加到地图的容器中
      this.map.getTargetElement().appendChild(deviceInfoElement)

      // 设置元素的位置
      let pixel = this.map.getPixelFromCoordinate(coordinate)
      deviceInfoElement.style.left = pixel[0] + 20 + 'px'
      deviceInfoElement.style.top = pixel[1] - 40 + 'px'
    },
    clearDeviceInfo() {
      let deviceInfoElements = document.querySelectorAll('.device-info')
      deviceInfoElements.forEach((element) => {
        element.parentNode.removeChild(element)
      })
    },
    mousemove() {
      this.map.on('pointermove', (e) => {
        this.clearDeviceInfo()
        let coordinates = e.coordinate
        // 判断是否点击在点上
        let feature = this.map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        )
        if (feature && this.rulerFlag === false) {
          if (!this.isFeatureOnMultiPolylineLayer(feature)) {

            let shower = feature.get('shower')
            let deviceId = feature.id_
            this.showDeviceInfo(shower, coordinates)
          }
        }
      })
    },
    isFeatureOnMultiPolylineLayer(feature) {
      // 遍历 MultiPolylineLayer 数组
      for (let layer of this.MultiPolylineLayer) {
        // 获取当前图层的所有要素
        let features = layer.getSource().getFeatures()
        // 检查悬停的要素是否在当前图层中
        if (features.includes(feature)) {
          return true // 悬停要素在轨迹图层上
        }
      }
      return false // 悬停要素不在轨迹图层上
    },
    /**
     * 地图点击事件
     **/
    singleclick() {
      // 修改后的单击事件逻辑
      this.map.on('singleclick', (event) => {
        let isTrackPointClicked = false
        // 先检查是否点击的是轨迹点
        this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
          // 如果已经处理过轨迹点，直接返回，避免重复处理
          if (isTrackPointClicked) {
            return
          }
          // 点击设备时不显示轨迹点提示框，cdId作为判断设备和轨迹点的区别，轨迹点无cdId
          if(feature && feature.get('cdId')){
            return
          }
          if (feature && feature.get('id') && feature.get('sendDate')) {
            const id = feature.get('id') // 获取设备 ID
            const sendDate = feature.get('sendDate') // 获取时间信息
            const coordinates = feature.getGeometry().getCoordinates() // 获取坐标
            // 显示提示框
            const nearestPoint = {
              lon: coordinates[0],
              lat: coordinates[1],
              id: id,
              sendDate: sendDate
            }
            // 获取点击位置的像素坐标用于显示提示框
            const x = event.pixel[0]
            const y = event.pixel[1]
            this.showRouteTooltip(x, y, nearestPoint) // 显示轨迹点提示框
            isTrackPointClicked = true // 标记为已处理轨迹点点击
          }
        })

        // 如果没有点击轨迹点，不进行任何提示
        if (!isTrackPointClicked) {
          // 如果没有点击轨迹点，则继续处理轨迹线逻辑
        }
      })
      // 点击
      this.map.on('singleclick', (e) => {
        this.clearDeviceInfo()
        let coordinates = e.coordinate
        // 判断是否点击在点上
        let feature = this.map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        )
        // 电子围栏编辑
        if (this.areaManage.editing) {
          //如果是正在编辑
          this.areaManage.areaForm.pointList.push([
            e.coordinate[0].toFixed(6),
            e.coordinate[1].toFixed(6)
          ])
        }
        if (this.rulerFlag === false && this.planFlag === true) {
          //没有点击在船上且测距功能没有打开
          //打开路径规划时进行
          let temp = {
            lng: e.coordinate[0].toFixed(6),
            lat: e.coordinate[1].toFixed(6),
            index: this.planMarkerPointIndex
          }
          //不到九的时候执行，大于125个点的时候警告
          if (this.planRoute.length === 125) {
            alert('导航规划只允许最多 125 个坐标点')
          } else {
            this.planMarkerAddPoints(e)
            this.planRoute.push(temp)
          }
        } else if (feature && this.rulerFlag === false) {
          //点击在船上且测距功能没有打开
          //打开多选设备时进行
          if (this.multiSelectCardIsShow) {
            let temp = {
              lng: e.coordinate[0].toFixed(6),
              lat: e.coordinate[1].toFixed(6),
              index: this.multiSelectBorderIndex,
              id: feature.values_.id,
              cdId: feature.values_.cdId
            }
            let index = this.multiSelectedDeviceList.findIndex((currentValue) => {
              return currentValue.id === temp.id
            })
            if (index === -1) {
              this.multiSelectAddGliderBorder(feature.values_.lr)
              this.multiSelectedDeviceList.push(temp)
            } else {
              this.multiSelectRemoveOneOfBorder(index)
              this.multiSelectedDeviceList.splice(index, 1)
            }
          } else {
            this.showPopup(feature)
            this.closeTarget()
            this.closePositionDeviceBorder()
          }
        }
      })
    },
    /**
     * 定位设备
     */
    idChanged(searchSelectedID) {
      this.closeTarget(); //移除原先目标点
      let features = this.pointLayer.getSource().getFeatures() //获取所有的Feature
      if (this.multiSelectCardIsShow) {
        features.forEach((item) => {
          if (item.values_.id === searchSelectedID) {
            let temp = {
              lng: item.values_.longitude.toFixed(6),
              lat: item.values_.latitude.toFixed(6),
              index: this.multiSelectBorderIndex,
              id: item.id_
            }
            let index = this.multiSelectedDeviceList.findIndex((currentValue) => {
              return currentValue.id === temp.id
            })
            if (index === -1) {
              this.multiSelectAddGliderBorder(item.values_.lr)
              this.multiSelectedDeviceList.push(temp)
            } else {
              this.multiSelectRemoveOneOfBorder(index)
              this.multiSelectedDeviceList.splice(index, 1)
            }
          }
        })
      } else {
        features.forEach((item) => {
          if (item.values_.id === searchSelectedID) {
            this.showPopup(item)
            this.closePositionDeviceBorder()
            this.positionDeviceBorder(item.values_.lr)
            setTimeout(() => {
              //延时3秒关闭框选
              this.closePositionDeviceBorder()
            }, 3000)
            this.map
              .getView()
              .setCenter([item.values_.lr[0], item.values_.lr[1]])
          }
        })
      }
      this.searchSelectedID = null
    },
    /**
     * 定位设备的框选
     */
    positionDeviceBorder(item) {
      let coordinate = [item[0], item[1]]
      // 创建图层
      this.PositionLayer = new VectorLayer({
        source: new VectorSource()
      })
      // 图层添加到地图上
      this.map.addLayer(this.PositionLayer)

      // 创建feature要素，一个feature就是一个点坐标信息
      const feature = new Feature({
        geometry: new Point(coordinate)
      })
      //为feature添加设备点信息
      //feature.setProperties(item);
      // 设置要素的图标
      feature.setStyle(
        new Style({
          // 设置图片效果
          image: new Icon({
            src: this.imgs.select_glider,
            scale: 0.6
          }),
          zIndex: '97',
          offset: '[-18,-20]'
        })
      )
      //设置要素的名称属性
      //feature.set("featureName","PlanMarker");
      //设置要素的ID
      // feature.setId(this.multiSelectBorderIndex);
      // this.multiSelectBorderIndex += 1;
      // 要素添加到地图图层上
      this.PositionLayer.getSource().addFeature(feature)
      // 设置文字信息
      // this.addText(coordinate);
    },
    /**
     * 关闭定位框选
     */
    closePositionDeviceBorder() {
      this.map.removeLayer(this.PositionLayer)
    },
    /**
     * 轨迹点悬浮窗（未使用）
     */
    showRouteTooltip1(x, y, nearestPoint) {
      // 如果已有提示框，先移除
      if (this.currentTooltip) {
        this.currentTooltip.remove()
      }

      // 创建提示框元素
      const tooltip = document.createElement('div')
      tooltip.style.position = 'absolute'
      tooltip.style.backgroundColor = 'yellow'
      tooltip.style.border = '1px solid black'
      tooltip.style.padding = '5px'
      tooltip.style.borderRadius = '3px'
      tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)'
      // 动态显示最近点的经纬度
      // 动态显示最近点的经纬度
      //tooltip.innerText = ` ${nearestPoint.time}  ${nearestPoint.id} 经度: ${nearestPoint.lon}, 纬度: ${nearestPoint.lat}` ;
      tooltip.innerHTML = `
        <div>
          <div>${nearestPoint.sendDate} - ${nearestPoint.id}</div>
          <div>经度: ${nearestPoint.lon}, 纬度: ${nearestPoint.lat}</div>
        </div>
      `
      // 定位提示框
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`

      // 添加到页面
      document.body.appendChild(tooltip)

      // 保存当前显示的提示框
      this.currentTooltip = tooltip

      // 自动关闭弹窗
      setTimeout(() => {
        tooltip.remove()
      }, 3000)
    },
    /**
     * 轨迹点悬浮窗（使用中）
     */
    showRouteTooltip(x, y, nearestPoint) {
      // 如果已有提示框，先移除
      if (this.currentTooltip) {
        this.currentTooltip.remove()
      }
      // 创建提示框元素
      const tooltip = document.createElement('div')
      tooltip.style.position = 'absolute'
      tooltip.style.backgroundColor = 'white'
      tooltip.style.border = '1px solid black'
      tooltip.style.padding = '5px'
      tooltip.style.borderRadius = '3px'
      tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)'
      // 动态显示最近点的经纬度
      tooltip.innerHTML = `
        <div>
          <div>${nearestPoint.sendDate}</div>
          <div>经度: ${nearestPoint.lon}, 纬度: ${nearestPoint.lat}</div>
        </div>
      `
      // 定位提示框
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`

      // 添加到页面
      document.body.appendChild(tooltip)

      // 保存当前显示的提示框
      this.currentTooltip = tooltip

      // 自动关闭弹窗
      setTimeout(() => {
        tooltip.remove()
      }, 3000)
    },
    // 计算点击点到线段所在直线的最小距离
    getDistanceToSegment(clickCoord, lineStart, lineEnd) {
      // 计算 t 值，用于判断最近点
      const t = this.calculateT(clickCoord, lineStart, lineEnd)

      // 计算线段的投影点
      const nearestPoint = {
        lon: lineStart.lon + t * (lineEnd.lon - lineStart.lon),
        lat: lineStart.lat + t * (lineEnd.lat - lineStart.lat)
      }

      // 返回点击点到最近点的距离
      return {
        distance: this.calculateDistance(clickCoord, [
          nearestPoint.lon,
          nearestPoint.lat
        ]),
        nearestPoint // 仍然包含投影点的坐标
      }
    },

    // 查找最近的轨迹点
    findNearestPoint(clickCoord, coordinates) {
      let minDistance = Infinity
      let nearestSegmentPoint = null
      let nearestPoint = null

      // 遍历所有线段，找到最近的线段
      for (let i = 0; i < coordinates.length - 1; i++) {
        const lineStart = coordinates[i]
        const lineEnd = coordinates[i + 1]
        // 计算 t 值，判断投影点是否在线段上
        const t = this.calculateT(clickCoord, lineStart, lineEnd)

        // 确保投影点在当前线段上 (t 值在 [0, 1] 之间)
        if (t >= 0 && t <= 1) {
          // 计算点击点到当前线段的最短距离
          const { distance, nearestPoint: segmentNearestPoint } =
            this.getDistanceToSegment(clickCoord, lineStart, lineEnd)

          // 如果找到更近的线段，更新最近距离和点
          if (distance < minDistance) {
            minDistance = distance
            // 计算点击点到两个端点的距离
            const distanceToStart = this.calculateDistance(clickCoord, [
              lineStart.lon,
              lineStart.lat
            ])
            const distanceToEnd = this.calculateDistance(clickCoord, [
              lineEnd.lon,
              lineEnd.lat
            ])

            // 选择离点击点更近的端点
            if (distanceToStart < distanceToEnd) {
              nearestPoint = {
                lon: lineStart.lon,
                lat: lineStart.lat,
                id: lineStart.id, // 设备 ID
                sendDate: lineStart.time // 端点的时间
              }
            } else {
              nearestPoint = {
                lon: lineEnd.lon,
                lat: lineEnd.lat,
                id: lineEnd.id, // 设备 ID
                sendDate: lineEnd.time // 端点的时间
              }
            }
          }
        }
      }

      return nearestPoint // 返回最近的轨迹点
    },

    // 计算 t 值，用于判断最近点的位置
    calculateT(point, p1, p2) {
      const px = point[0],
        py = point[1]
      const x1 = p1.lon,
        y1 = p1.lat
      const x2 = p2.lon,
        y2 = p2.lat

      const numerator = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)
      const denominator = (x2 - x1) ** 2 + (y2 - y1) ** 2

      return denominator === 0 ? 0 : numerator / denominator // 防止除以零
    },

    // 计算两点之间的距离（简单欧几里得距离）
    calculateDistance(coord1, coord2) {
      let dx = coord1[0] - coord2[0]
      let dy = coord1[1] - coord2[1]
      return Math.sqrt(dx * dx + dy * dy)
    },

    async showPopup(item, event) {
      // 检查是否是路线点击
      if (item.isRoute) {
        return
      }
      if (item.values_.gliderType === 'AIS') {
        this.shopPopup = false
        this.shopPopupAIS = true
        this.infoCardData.markerInfo = item.getProperties() // 获取 ship 的数据
      }else if (item.values_.gliderType === 'glider'){
        this.shopPopupAIS = false
        this.shopPopup = true
        this.infoCardData.enddate = new Date().getTime()
        this.infoCardData.markerInfo = item.getProperties() // 获取 deviceList 的数据
        this.infoCardData.startdate = new Date(
          this.infoCardData.markerInfo.startDate
        ).getTime()
      }

      if (item.id_) {
        this.shopPopup = true
        this.infoCardData.enddate = new Date().getTime()
        this.infoCardData.markerInfo = item.getProperties() // 获取 deviceList 的数据
        this.infoCardData.startdate = new Date(
          this.infoCardData.markerInfo.startDate
        ).getTime()

        this.speedDate.deviceId = this.infoCardData.markerInfo.id
        this.speedDate.endTimeStamp = new Date().getTime()
        this.speedDate.startTimeStamp =
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000

        // 请求数据
        await this.fetchTargetData()
      } else {
        //console.warn("item.id is undefined, skipping execution.");
      }
    },

    async fetchTargetData() {
      if (this.infoCardData.markerInfo && this.infoCardData.markerInfo.id) {
        if (
          this.$store.getters.permissions.indexOf('map:target:multiple') !== -1
          || this.$store.getters.permissions.indexOf('*:*:*') !== -1
        ) {
          const currentTime = Date.now()
          if (currentTime - this.lastRequestTime > this.throttleDelay) {
            this.lastRequestTime = currentTime

            try {
              this.speed = await getSpeedById(this.speedDate)
              const res = await getNTargets(
                this.infoCardData.markerInfo.id
              )
              this.targetLayerList = []
              this.TargetPolylineLayerList = []

              for (let item of res.rows) {
                let coordinate = [item.longitude, item.latitude]

                if (item.longitude != null && item.latitude != null) {
                  if (item.source === 'msg') {
                    this.showTargetMsg(
                      coordinate,
                      this.infoCardData.markerInfo.id
                    )
                    this.targetLayerList.push(this.targetmsgLayer)
                  } else if (item.source === 'cmd') {
                    this.showTargetcmd(
                      coordinate,
                      this.infoCardData.markerInfo.id
                    )
                    this.targetLayerList.push(this.targetcmdLayer)
                  }

                  let TargetPolyline = [
                    this.infoCardData.markerInfo.lr,
                    coordinate
                  ]
                  const distance = this.getDistanceFromLatLonInKm(TargetPolyline)
                  const time = Math.round(distance / this.speed)
                  const hours = Math.floor(time / 3600)
                  const minutes = Math.floor((time % 3600) / 60)
                  const seconds = time % 60

                  const formattedTime = `${hours}小时 ${minutes}分钟 ${seconds}秒`
                  if (item.source === 'msg') {
                    this.showTargetMsgPolyline(TargetPolyline)
                    this.TargetPolylineLayerList.push(
                      this.TargetmsgPolylineLayer
                    )
                  } else if (item.source === 'cmd') {
                    this.showTargetcmdPolyline(TargetPolyline)
                    this.TargetPolylineLayerList.push(
                      this.TargetcmdPolylineLayer
                    )
                  }
                  this.showTargetLabel(
                    coordinate,
                    this.infoCardData.markerInfo.id,
                    item.source,
                    this.targetLayerList[this.targetLayerList.length - 1],
                    formattedTime
                  )
                }
              }
            } catch (error) {
              console.error('请求失败:', error)
            }
          }
        } else {
          console.warn('请求体缺失，无法发送请求')
        }
      }
    },

    // 设备与目标点之间的距离
    getDistanceFromLatLonInKm(TargetPolyline) {
      const R = 6371 // 地球半径，单位为公里
      const point1 = TargetPolyline[0]
      const point2 = TargetPolyline[1]
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
      return deg * (Math.PI / 180)
    },
    /**
     * AIS设备显隐
     * */
    handleAISShowChange() {
      let this_ = this
      if (!this.AISShow) {
        let features = this.pointLayer.getSource().getFeatures() //获取所有的Feature
        features.forEach(function(item) {
          if (item.values_.gliderType == 'AIS') {
            this_.pointLayer.getSource().removeFeature(item)
          }
        })
      } else {
        this.ship.forEach(function(item) {
          this_.addShip(item)
        })
      }
    },
    /**
     * 显示设备目标点  msg
     */
    showTargetMsg(coordinate, id) {
      // 创建图层
      this.targetmsgLayer = new VectorLayer({
        source: new VectorSource(),
        zIndex: 51
      })
      // 图层添加到地图上
      this.map.addLayer(this.targetmsgLayer)
      // }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.targetmsgFeature = new Feature({
        geometry: new Point(coordinate)
      })

      // 设置要素的图标
      this.targetStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: this.imgs.target_msg,
          offset: [-0, -33],
          offsetOrigin: 'bottom-right',
          scale: 1,
          size: [19, 66]
        })
      })
      this.targetmsgFeature.setStyle(this.targetStyle)
      // 要素添加到地图图层上
      this.targetmsgLayer.getSource().addFeature(this.targetmsgFeature)
    },
    /**
     * 显示设备目标点  cmd
     */
    showTargetcmd(coordinate, id) {
      // 创建图层
      this.targetcmdLayer = new VectorLayer({
        source: new VectorSource(),
        zIndex: 51
      })
      // 图层添加到地图上
      this.map.addLayer(this.targetcmdLayer)
      // }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.targetcmdFeature = new Feature({
        geometry: new Point(coordinate)
      })

      // 设置要素的图标
      this.targetStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: this.imgs.target_cmd,
          offset: [-0, -33],
          offsetOrigin: 'bottom-right',
          scale: 1,
          size: [19, 66]
        })
      })
      this.targetcmdFeature.setStyle(this.targetStyle)
      // 要素添加到地图图层上
      this.targetcmdLayer.getSource().addFeature(this.targetcmdFeature)
    },

    /**
     *  显示目标点标签
     */
    showTargetLabel(coordinate, id, source, layer, formattedTime) {
      this.TargetlabelFeature = new Feature({
        geometry: new Point(coordinate)
      })
      this.TargetlabelFeature.set('deviceId', id)
      this.TargetlabelFeature.set('isTargetLabel', true)

      this.TargetlabelStyle = new Style({
        text: new Text({
          font: 'normal 12px 黑体',
          // // 对其方式
          textAlign: 'center',
          // 基准线
          textBaseline: 'middle',
          offsetY: -45,
          offsetX: 0,
          backgroundFill: new Stroke({
            color: '#12223b'
          }),
          // 文本填充样式
          fill: new Fill({
            color: 'white'
          }),
          // 描边样式
          backgroundStroke: new Stroke({
            color: '#0000ff'
          }),
          padding: [5, 5, 5, 5],
          text:
            '目标点(' +
            source +
            '):' +
            '[' +
            coordinate +
            ']\n' +
            '预计需要：' +
            formattedTime
        }),
        zIndex: 1
      })
      this.TargetlabelFeature.setStyle(this.TargetlabelStyle)
      layer.getSource().addFeature(this.TargetlabelFeature)
    },
    /**
     *  关闭目标点、轨迹、标签  循环删除Layer对象List
     */
    closeTarget() {
      for (let i = 0; i < this.targetLayerList.length; i++) {
        this.map.removeLayer(this.targetLayerList[i])
        this.map.removeLayer(this.TargetPolylineLayerList[i])
      }
    },
    /**
     *  显示目标点轨迹  cmd
     */
    showTargetcmdPolyline(TargetPolyline) {
      // 将层添加进地图
      var TargetPolylineFeature = new Feature({
        geometry: new LineString(TargetPolyline)
      })
      var vectorSource = new VectorSource({
        features: [TargetPolylineFeature]
      })
      this.TargetcmdPolylineLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            lineDash: [6, 8],
            color: '#2591F5',
            width: 5
          })
        })
      })
      this.map.addLayer(this.TargetcmdPolylineLayer)
    },
    /**
     *  显示目标点轨迹  msg
     */
    showTargetMsgPolyline(TargetPolyline) {
      // 将层添加进地图
      var TargetPolylineFeature = new Feature({
        geometry: new LineString(TargetPolyline)
      })
      var vectorSource = new VectorSource({
        features: [TargetPolylineFeature]
      })
      this.TargetmsgPolylineLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            lineDash: [6, 8],
            color: '#2591F5',
            width: 5
          })
        })
      })
      this.map.addLayer(this.TargetmsgPolylineLayer)
    },

    /**
     * 显示设备目标点（一个） 目前停用
     */
    showTarget(coordinate, id) {
      // if (Object.keys(this.targetLayer).length == 0) {
      // 创建图层
      this.targetLayer = new VectorLayer({
        source: new VectorSource()
      })
      // 图层添加到地图上
      this.map.addLayer(this.targetLayer)
      // }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.targetFeature = new Feature({
        geometry: new Point(coordinate)
      })
      //为feature添加设备点信息
      this.targetFeature.set('deviceId', id)
      this.targetFeature.set('isTarget', true)

      // 设置要素的图标
      this.targetStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: this.imgs.planDotImg,
          offset: [-30, -60],
          offsetOrigin: 'bottom-right',
          //src: img,
          //rotation:item.angle,
          // anchor: [0.5, 0.5],
          scale: 0.5,
          size: [100, 120]
        })
      })
      this.targetFeature.setStyle(this.targetStyle)
      // 要素添加到地图图层上
      // this.pointLayer.getSource().addFeatures([feature]);
      this.targetLayer.getSource().addFeature(this.targetFeature)
    },
    /**
     *  显示目标点轨迹  目前停用
     */
    showTargetPolyline(TargetPolyline) {
      // 将层添加进地图
      var TargetPolylineFeature = new Feature({
        geometry: new LineString(TargetPolyline)
      })
      var vectorSource = new VectorSource({
        features: [TargetPolylineFeature]
      })
      this.TargetPolylineLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            lineDash: [6, 8],
            color: '#2591F5',
            width: 5
          })
        })
      })
      this.map.addLayer(this.TargetPolylineLayer)
    },

    /**
     * 根据经纬度坐标添加设备
     */
    addDeviceToMap(item) {
      // 获取设备图标
      let img = deviceIconConfig.getDeviceIcon(item)

      let coordinate = item.lr
      item.islable = false
      item.isTarget = false
      if (Object.keys(this.pointLayer).length === 0) {
        // 创建图层
        this.pointLayer = new VectorLayer({
          source: new VectorSource(),
          zIndex: 50
        })
        // 图层添加到地图上
        this.map.addLayer(this.pointLayer)
      }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.pointFeature = new Feature({
        geometry: new Point(coordinate),
        shower: item.shower
      })

      //为feature添加设备点信息
      this.pointFeature.setProperties(item)
      // 设置要素的图标
      this.pointStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: img,
          rotation: item.angle * Math.PI / 180,
          // anchor: [0.5, 0.5],
          scale: 0.6
        }),
        zIndex: item.iconType === '4' ? 98 : 99
      })
      this.pointFeature.setStyle(this.pointStyle)
      //设置要素的ID
      this.pointFeature.setId(item.id)
      // 要素添加到地图图层上
      // this.pointLayer.getSource().addFeatures([feature]);
      this.pointLayer.getSource().addFeature(this.pointFeature)
      // 设置文字信息
      // this.addText(coordinate);
    },
    /**
     *  设备标签显示开关
     */
    labelSwitch() {
      this.labelIsShow = !this.labelIsShow
      if (this.labelIsShow) {
        for (let item of this.deviceList) {
          this.showLabel(item)
        }
      } else {
        this.closeLabel()
      }
    },
    /**
     *  设备标签显示
     */
    showLabel(item) {
      // 处理设备状态标签信息
      let stateText = item.isError ? '异常' : '正常'
      let coordinate = item.lr
      item.islable = true
      item.isTarget = false

      this.labelFeature = new Feature({
        geometry: new Point(coordinate)
      })
      this.labelFeature.setProperties(item)
      this.labelStyle = new Style({
        text: new Text({
          font: 'normal 12px 黑体',
          // // 对其方式
          textAlign: 'center',
          // 基准线
          textBaseline: 'middle',
          offsetY: -35,
          offsetX: 0,
          backgroundFill: new Stroke({
            color: '#12223b'
          }),
          // 文本填充样式
          fill: new Fill({
            color: item.isError ? '#ff0000' : '#00ff7f'
          }),
          // 描边样式
          backgroundStroke: new Stroke({
            color: '#0000ff'
          }),
          padding: [5, 5, 5, 5],
          text: item.deviceName + '|' + stateText
        }),
        zIndex: 50
      })
      this.labelFeature.setStyle(this.labelStyle)
      this.pointLayer.getSource().addFeature(this.labelFeature)
    },
    /**
     *  关闭设备标签
     */
    closeLabel() {
      let this_ = this
      let features = this.pointLayer.getSource().getFeatures() //获取所有的Feature
      features.forEach(function(item) {
        if (item.values_.islable) {
          this_.pointLayer.getSource().removeFeature(item)
        }
      })
    },
    /**
     * 设备多选框初始化
     */
    multiSelectGlider() {
      this.multiSelectCardIsShow = true
      if (this.shopPopup || this.shopPopupAIS) {
        this.closeInfoCard()
      }
    },
    /**
     * 设备多选添加设备框
     * */
    multiSelectAddGliderBorder(item) {
      let coordinate = [item[0], item[1]]
      if (Object.keys(this.multiSelectLayer).length === 0) {
        // 创建图层
        this.multiSelectLayer = new VectorLayer({
          source: new VectorSource()
        })
        // 图层添加到地图上
        this.map.addLayer(this.multiSelectLayer)
      }
      // 创建feature要素，一个feature就是一个点坐标信息
      const feature = new Feature({
        geometry: new Point(coordinate)
      })
      //为feature添加设备点信息
      //feature.setProperties(item);
      // 设置要素的图标
      feature.setStyle(
        new Style({
          // 设置图片效果
          image: new Icon({
            src: this.imgs.select_green,
            scale: 0.6
          }),
          zIndex: '97',
          offset: '[-18,-20]'
        })
      )
      //设置要素的名称属性
      //feature.set("featureName","PlanMarker");
      //设置要素的ID
      feature.setId(this.multiSelectBorderIndex)
      this.multiSelectBorderIndex += 1
      // 要素添加到地图图层上
      this.multiSelectLayer.getSource().addFeature(feature)
      // 设置文字信息
      // this.addText(coordinate);
    },
    /**
     * 多选设备删除某个设备的边框
     */
    multiSelectRemoveOneOfBorder(index) {
      let this_ = this
      let features = this.multiSelectLayer.getSource().getFeatures() //获取所有的Feature
      features.forEach(function(item) {
        if (item.id_ === this_.multiSelectedDeviceList[index].index) {
          this_.multiSelectLayer.getSource().removeFeature(item)
        }
      })
    },
    /**
     * 清空多选设备打点图层
     * */
    cleanMultiSelectLayer() {
      this.map.removeLayer(this.multiSelectLayer)
      this.multiSelectLayer = {}
      this.multiSelectBorderIndex = 0
    },
    /**
     * 设备多轨迹显示
     * */
    showMultiRoute() {

      // 随机生成轨迹颜色
      const generateBrightColor = () => {
        const h = Math.floor(Math.random() * 360) // Random hue component (0-360)
        const s = 80 + Math.floor(Math.random() * 21) // Slightly random saturation (80-100)
        const l = 50 + Math.floor(Math.random() * 21) // Slightly random lightness (50-70)
        return `hsl(${h}, ${s}%, ${l}%)` // Construct HSL color string
      }

      // 在显示新轨迹前，清除旧的轨迹层
      this.closeMultiRoute()

      this.multiRoute.routeList = []
      this.MultiPolylineLayer = []
      // this.pathCreator.removeAll();
      for (let item of this.multiSelectedDeviceList) {
        let prelongitude, prelatitude
        getTrail(
          item.id,
          this.multiRoute.startdate,
          this.multiRoute.enddate
        ).then((res) => {
          // 随机生成轨迹颜色
          const color = generateBrightColor()
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

          // 将层添加进地图
          const wireFeature = new Feature({
            geometry: new LineString(tempRoute)
          })
          const vectorSource = new VectorSource({
            features: [wireFeature]
          })
          this.MultiPolylineLayer[item.index] = new VectorLayer({
            source: vectorSource,
            style: new Style({
              stroke: new Stroke({
                color: color,
                width: 6
              })
            })
          })
          this.map.addLayer(this.MultiPolylineLayer[item.index]);
        })
      }
      this.multiRoute.routeIsShow = true
      this.multiRoute.dialogIsShow = false
    },
    /**
     * 关闭设备多轨迹显示
     * */
    closeMultiRoute() {
      let i
      for (i = 0; i < this.MultiPolylineLayer.length; i++) {
        this.map.removeLayer(this.MultiPolylineLayer[i])
      }
      // this.pathCreator.removeAll();
    },
    /**
     * 导航规划中的坐标打点
     */
    planMarkerAddPoints(item) {
      let coordinate = [
        item.coordinate[0].toFixed(6),
        item.coordinate[1].toFixed(6)
      ]
      if (Object.keys(this.PlanMarkerLayer).length === 0) {
        // 创建图层
        this.PlanMarkerLayer = new VectorLayer({
          source: new VectorSource()
        })
        // 图层添加到地图上
        this.map.addLayer(this.PlanMarkerLayer)
      }
      // 创建feature要素，一个feature就是一个点坐标信息
      const feature = new Feature({
        geometry: new Point(coordinate)
      })
      //为feature添加设备点信息
      feature.setProperties(item)
      // 设置要素的图标
      feature.setStyle(
        new Style({
          // 设置图片效果
          image: new Icon({
            src: this.imgs.planDotImg,
            offset: [-30, -60],
            offsetOrigin: 'bottom-right',
            scale: 0.5,
            size: [100, 140]
          }),
          text: new Text({
            text: `[${this.planMarkerPointIndex+1}]`,
            // 文本位置
            offsetY: -36,
            // offsetX: -15, // 向左微调，居中显示
            // 文本样式配置
            font: '12px Microsoft YaHei, Arial, sans-serif', // 字体和大小
            fill: new Fill({ color: '#333' }), // 文本颜色
            stroke: new Stroke({ color: '#fff', width: 2 }), // 文本描边
            textAlign: 'center', // 居中对齐
            textBaseline: 'middle' // 垂直居中
          }),
          zIndex: '100'
        })
      )
      //设置要素的名称属性
      feature.set('featureName', 'PlanMarker')
      //设置要素的ID
      feature.setId(this.planMarkerPointIndex)
      this.planMarkerPointIndex += 1
      // 要素添加到地图图层上
      this.PlanMarkerLayer.getSource().addFeature(feature)
      // 增加可移动点位元素
      let iconTranslate = new Translate({
        features: new Collection([feature])
      })
      this.map.addInteraction(iconTranslate)
    },
    /**
     * 导航规划删除某个打点的坐标点
     */
    planMarkerRemoveOneOfPoints(index) {
      //let coordinate = [lng, lat];
      let this_ = this;
      //let layer = this.map.getLayers().item(5);  //获取第三个图层 为导航打点图层
      //let layer = this.map.getLayers(this.PlanMarkerLayer);
      //let feature = layer.getSource().getFeaturesAtCoordinate(coordinate);
      let features = this.PlanMarkerLayer.getSource().getFeatures() //获取所有的Feature
      features.forEach(function(item) {
        if (item.id_ === this_.planRoute[index].index) {
          this_.PlanMarkerLayer.getSource().removeFeature(item)
        }
      })
    },
    /**
     * 清空导航打点图层
     * */
    cleanPlanMarkerLayer() {
      this.map.removeLayer(this.PlanMarkerLayer)
      this.PlanMarkerLayer = {}
      this.planMarkerPointIndex = 0
    },
    lngOrlatChange(index) {
      let this_ = this
      let features = this.PlanMarkerLayer.getSource().getFeatures() //获取所有的Feature
      features.forEach(function(item) {
        if (item.id_ === this_.planRoute[index].index) {
          let coordinate = [
            this_.planRoute[index].lng,
            this_.planRoute[index].lat
          ]
          item.setGeometry(new Point(coordinate))
        }
      })
    },
    /**
     * 路径导航规划里点击“确认”按钮后
     * */
    planConfirm() {
      let path_str = this.sendCmdByPath(this.infoCardData.markerInfo.id, this.planRoute);
      this.$message({
        message: '导航规划指令发送成功！' + path_str,
        type: 'success'
      })
      this.closePlanCard()
    },

    /**
     * 测距
     * */
    distanceMeasure() {
      if (this.rulerFlag) {
        this.rulerFlag = !this.rulerFlag
        for (let i = 0; i < this.measure.drawLayers.length; i++) {
          this.map.removeLayer(this.measure.drawLayers[i])
        }
        for (let i = 0; i < this.measure.drawElements.length; i++) {
          this.map.removeOverlay(this.measure.drawElements[i])
        }
        // this.map.getOverlays().clear()
        this.measure.drawLayers = []
        this.measure.drawElements = []
        this.map.removeInteraction(this.measure.draw)
        unByKey(this.measure.mapMouseMove)
      } else {
        this.rulerFlag = !this.rulerFlag
        let source = new VectorSource() // 首先创建一个数据源，用来放置绘制过程中和绘制结束后的线段
        const layer = new VectorLayer({
          // 添加一个图层，用来放置数据源，样式自己随便设置就可以了
          source: source,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 4
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33'
              })
            })
          })
        })
        this.createHelpTooltip() // 创建那个helpTooltipElement方法
        this.createMeasureTooltip()
        this.map.addLayer(layer) // 把图层添加到地图
        this.measure.drawLayers.push(layer)
        this.measure.mapMouseMove = this.map.on('pointermove', (ev) => {
          // 给地图添加一个鼠标移动事件
          let helpMsg = '点击开始测量'
          if (this.measure.feature) {
            helpMsg = '双击结束测量'
          }
          this.measure.helpTooltipElement.innerHTML = helpMsg
          this.measure.helpTooltip.setPosition(ev.coordinate) // 设置位置跟着鼠标走
          this.measure.helpTooltipElement.classList.remove('hidden') // 让他显示出来
        })

        this.map.getViewport().addEventListener('mouseout', () => {
          this.measure.helpTooltipElement.classList.add('hidden')
        })

        this.measure.draw = new Draw({
          source, // 这个数据源就是我们最开始的那个数据源，这是简写，实际上是 source:source,
          type: 'LineString', // 绘制线
          style: new Style({
            // 绘制完成之前线的样式，需要的话自己可以修改成自己想要的样子
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 0.5)',
              lineDash: [10, 10],
              width: 4
            }),
            image: new CircleStyle({
              radius: 5,
              stroke: new Stroke({
                color: 'rgba(255, 255, 255, 0.7)'
              }),
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              })
            })
          })
        })
        this.map.addInteraction(this.measure.draw) // draw 绑定到地图上面去

        // 开始坚挺绘制
        this.measure.draw.on('drawstart', (evt) => {
          this.measure.feature = evt.feature

          let tooltipCoord = evt.coordinate
          this.measure.listener = this.measure.feature
            .getGeometry()
            .on('change', (evt) => {
              const geom = evt.target
              let output = formatLength(geom)
              tooltipCoord = geom.getLastCoordinate()
              this.measure.measureTooltipElement.innerHTML = output
              this.measure.measureTooltip.setPosition(tooltipCoord)
            })
        })

        // 双击绘制完成
        this.measure.draw.on('drawend', () => {
          this.measure.measureTooltipElement.className =
            'ol-tooltip ol-tooltip-static'
          this.measure.measureTooltip.setOffset([0, -7])
          this.measure.feature = null
          this.measure.measureTooltipElement = null
          this.createMeasureTooltip()
          unByKey(this.measure.listener)
        })

        // 格式化长度
        const formatLength = function(line) {
          var length = getLength(line, { projection: 'EPSG:4326' })
          let output
          if (length > 100) {
            output = '总长:' + Math.round((length / 1000) * 100) / 100 + ' km'
          } else {
            output = '总长:' + Math.round(length * 100) / 100 + ' m'
          }
          return output
        }

      }
    },
    createMeasureTooltip() {
      if (this.measure.measureTooltipElement) {
        this.measure.measureTooltipElement.parentNode.removeChild(
          this.measure.measureTooltipElement
        )
      }
      this.measure.measureTooltipElement = document.createElement('div')
      this.measure.measureTooltipElement.className =
        'ol-tooltip ol-tooltip-measure'
      this.measure.measureTooltip = new Overlay({
        element: this.measure.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false
      })
      this.measure.drawElements.push(this.measure.measureTooltip)
      this.map.addOverlay(this.measure.measureTooltip)
    },
    createHelpTooltip() {
      if (this.measure.helpTooltipElement) {
        this.measure.helpTooltipElement.parentNode.removeChild(
          this.measure.helpTooltipElement
        )
      }
      this.measure.helpTooltipElement = document.createElement('div')
      this.measure.helpTooltipElement.className = 'ol-tooltip hidden'
      this.measure.helpTooltip = new Overlay({
        element: this.measure.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      })
      this.map.addOverlay(this.measure.helpTooltip)
    },

    /**
     * 获取指令名和指令id的对应关系
     * */
    getCmdList() {
      getCmds().then((res) => {
        let i
        for (i in res.data) {
          this.cmdList[res.data[i]['code']] = res.data[i]['id']
        }
      })
    },

    addText(coordinate) {
      let elPopup = this.$refs.popup
      this.popup = new Overlay({
        positioning: 'bottom-center',
        stopEvent: false,
        position: coordinate, //设置位置
        element: elPopup,
        offset: [0, 0] //设置偏移
      })
      this.map.addOverlay(this.popup)
    },
    // 显示单轨迹
    showPolyline() {
      this.isTrackActive = true
      let prelongitude, prelatitude

      getTrail(
        this.infoCardData.markerInfo.id,
        this.infoCardData.startdate,
        this.infoCardData.enddate
      ).then((res) => {
        this.routeInfo1 = []
        prelongitude = res.rows[res.rows.length - 1].longitude
        prelatitude = res.rows[res.rows.length - 1].latitude

        const trailStartPoint = res.rows[res.rows.length - 1]
        // 检查设备位置与轨迹起始点的差异
        const device = this.deviceList.find(
          (car) => car.id === this.infoCardData.markerInfo.id
        )

        if (device) {
          // 如果设备位置与轨迹起始点位置不一致，更新设备位置
          if (
            Math.abs(device.longitude - trailStartPoint.longitude) > 0.00001 ||
            Math.abs(device.latitude - trailStartPoint.latitude) > 0.00001
          ) {
            device.longitude = trailStartPoint.longitude
            device.latitude = trailStartPoint.latitude
          }
        }
        for (let item of res.rows.slice().reverse()) {
          // if(item.longitude!=120.67153&&item.latitude!=36.3429)
          if (
            item.longitude - prelongitude > 5 ||
            item.longitude - prelongitude < -5
          ) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if (
            item.latitude - prelatitude > 5 ||
            item.latitude - prelatitude < -5
          ) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if (
            (item.longitude != 0 && item.latitude != 0) ||
            (item.longitude != 0 && item.latitude != 90)
          ) {
            //把[0,0]处坐标舍去，00,0.0,0,0
            let temp = {
              lon: item.longitude,
              lat: item.latitude,
              time: item.sendDate,
              id: this.infoCardData.markerInfo.id
            }

            this.routeInfo1.push(temp)
            prelongitude = item.longitude
            prelatitude = item.latitude
          }
        }

        this.pathCreator.removeAll()

        this.pathCreator.addPaths([this.routeInfo1])
        this.pathCreator.olMap.on('singleclick', (event) => {
          // 获取点击的像素坐标
          const pixel = this.pathCreator.olMap.getEventPixel(
            event.originalEvent
          )

          // 检查点击的对象是否为路线（olLayer_line 是你绘制的路线图层）
          this.pathCreator.olMap.forEachFeatureAtPixel(
            pixel,
            (feature, layer) => {
              if (layer === this.pathCreator.olLayer_line) {
                let item = {
                  isRoute: true
                  // 其他需要传递的信息
                }
                this.showPopup(item, event)
              }
            }
          )
        })
      })
      // 这里是判断当前啊要不要显示轨迹点
      const zoom = this.map.getView().getZoom()
      if (zoom >= 10) {
        this.showTrackPoints() // 如果缩放级别允许，直接显示轨迹点
      }
    },

    // 关闭单轨迹
    closePolyline() {
      this.map.removeLayer(this.PolylineLayer)
      this.pathCreator.removeAll()
      this.hideTrackPoints()
      this.isTrackActive = false
    },
    /**
     * 发送指令
     * */
    sendCmdPage(infoCardData) {
      this.$router.push({
        path: "/cmdsend",
        query: {
          deviceId: infoCardData.markerInfo.id,
        },
      });
      // 判断是滑翔机还是信标机
    },
    //数据导出-下载Excel
    downloadExcel() {
      this.$confirm('是否确认导出设备详情数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.infoCardData.downloading = true
          return detailExcel(
            this.infoCardData.markerInfo.id,
            this.infoCardData.startdate,
            this.infoCardData.enddate
          )
        }).then((res) => {
          if (res.code === 200) {
            // 下载文件
            // const url = res.data.url
            // const fileName = url.split('?')[0].split('/').pop() || '设备详情.xlsx'
            // this.$message.success('下载中，请稍候...')
            // downloadFile(url, fileName)

            this.download(res.data.url);
            this.infoCardData.downloading = false
          }
        }).catch(() => {
          this.infoCardData.downloading = false
        })
    },
    /**
     * 跳转设备状态界面
     */
    openDeviceDetail() {
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
     * 打开指令界面浮动窗口
     */
    openCmdPage() {
      // 设置参数
      this.deviceDetailParams = {
        deviceId: this.infoCardData.markerInfo.id,
      };
      // 显示加载状态
      this.iframeLoading = true;
      // 显示弹窗
      this.showCmdPage = true;
    },
    /**
     * 关闭指令界面浮动窗口
     */
    closeCmdPage() {
      this.showCmdPage = false;
      this.iframeLoading = false;
    },

    /**
     * iframe 加载完成
     */
    onIframeLoad() {
      this.iframeLoading = false;
    },

    queryAIS() {
      this.Ais_triangle_1 = []

      getAisInfo(parseInt(this.infoCardData.markerInfo.id)).then((res) => {
        if(res.data.length===0){
          console.log("此设备无Ais数据")
        }
        for (let aisInfo of res.data) {
          let item = {
            lr: [aisInfo.aisLongitude, aisInfo.aisLatitude],
            angle: aisInfo.aisHeading,
            MMSI_id: aisInfo.mmsi,
            speed: aisInfo.aisSpeed,
            time: aisInfo.aisTime,
            shower:
              ' MMSI_id: ' +
              aisInfo.mmsi +
              '\nSpeed: ' +
              (aisInfo.aisSpeed !== null &&
              aisInfo.aisSpeed !== undefined
                ? aisInfo.aisSpeed.toFixed(2)
                : 'null') +
              'm/s\n time: ' +
              aisInfo.aisTime +
              '\n angle: ' +
              aisInfo.aisHeading
          }
          this.Ais_triangle_1.push(item);
          this.addAIS(item);
          this.addAISTrail(item);
        }
      }).catch(() => {
        // 处理错误
      })
    },
    queryAIS_shipxy() {
      // todo
      console.log("queryAIS_shipxy()")
      // this.Ais_triangle_1 = []
      // let mmsi = 430526773
      // ShipxyAPI.seachShipService(_map, 'my_seach_ship_box', {
      //   itemClickCallBack: function(mmsi) {
      //     _map.shipsService.locationShip(mmsi, true)
      //   }
      // })
      this.$modal.msgWarning("船讯网AIS信息功能暂未开放！");

    },
    addAISTrail(item) {
      let prelongitude, prelatitude;
      getAisTrail(
        this.infoCardData.enddate,
        this.infoCardData.markerInfo.id,
        item.MMSI_id,
        this.infoCardData.startdate
      ).then((res) => {
        this.routeInfo1 = []
        prelongitude = res.rows[res.rows.length - 1].longitude
        prelatitude = res.rows[res.rows.length - 1].latitude
        for (let item of res.rows.slice().reverse()) {
          if (
            item.longitude - prelongitude > 5 ||
            item.longitude - prelongitude < -5
          ) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if (
            item.latitude - prelatitude > 5 ||
            item.latitude - prelatitude < -5
          ) {
            prelongitude = item.longitude
            prelatitude = item.latitude
            continue
          }
          if (
            (item.longitude !== 0 && item.latitude !== 0) ||
            (item.longitude !== 0 && item.latitude !== 90)
          ) {
            //把[0,0]处坐标舍去，00,0.0,0,0
            let temp = { lon: item.longitude, lat: item.latitude }
            this.routeInfo1.push(temp)
            prelongitude = item.longitude
            prelatitude = item.latitude
          }
        }
        this.pathCreator.removeAll()
        this.pathCreator.addPaths([this.routeInfo1])
      })
    },

    addAIS(item) {
      let coordinate = item.lr
      if (Object.keys(this.AISLayer).length === 0) {
        // 创建图层
        this.AISLayer = new VectorLayer({
          source: new VectorSource(),
          zIndex: 50
        })
        // 图层添加到地图上
        this.map.addLayer(this.AISLayer)
      }
      // 创建feature要素，一个feature就是一个点坐标信息
      this.AISFeature = new Feature({
        geometry: new Point(coordinate),
        shower: item.shower
      })
      //为feature添加设备点信息
      this.AISFeature.setProperties(item)
      // 设置要素的图标
      this.AISStyle = new Style({
        // 设置图片效果
        image: new Icon({
          src: require('@/assets/map/shipYellow.png'),
          rotation: item.angle * Math.PI / 180,
          scale: 0.4
        }),
        zIndex: 99
      })
      this.AISFeature.setStyle(this.AISStyle)
      //设置要素的ID
      this.AISFeature.setId(item.id)
      // 要素添加到地图图层上
      this.AISLayer.getSource().addFeature(this.AISFeature)
    },

    //根据提供的文本、偏移量，获取标签显示所需要的格式,若不指定偏移，则自动计算偏移保证始终居中
    getMarkerLabel(text, offX = undefined, offY = undefined) {
      if (offX == undefined || offY == undefined) {
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

    //往后端发送指令的地方
    sendCmdByPath(deviceId, pointList) {
      let deviceCdId = undefined;
      // 指令拼接
      for (let item of this.deviceOptions) {
        if (deviceId === item.id) {
          deviceCdId = item.cdId;
        }
      }
      // 通过事件总线发送消息
      let path_str = ''
      let count = 0
      for (let key in pointList) {
        count++
        path_str =
          path_str +
          Number(pointList[key].lng).toFixed(4) +
          ',' +
          Number(pointList[key].lat).toFixed(4) +
          ','
      }
      path_str =
        '$P,' +
        deviceCdId +
        ',' +
        count +
        ',' +
        path_str +
        '*';

      let cmd_list = [
        {
          cmdId: this.cmdList['mbd'],
          cmdType: '0', //基础指令
          content: path_str,
          deviceId: deviceId,
        }
      ]
      sendCmd(cmd_list)
      return path_str
    },
    //编队巡航点击提交按钮，将指令发送给后端
    submitMultiAutoCruise() {
      if (this.multiAutoCruise.planPointList.length !== this.multiSelectedDeviceList.length) {
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
      let deviceIds = this.multiSelectedDeviceList.map((item) => {
        return item.id;
      })
      deviceIds.sort();
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
        this.multiAutoCruise.NWhenPlan = N
        this.multiAutoCruise.MWhenPlan = M
      } else if (this.multiAutoCruise.selectedTab == '1') {
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
      let ids = this.multiSelectedDeviceList.map((item) => {
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
        if (index < this.multiAutoCruise.planPointList.length) {
          tempList.push([
            this.multiAutoCruise.planPointList[index][0].lng,
            this.multiAutoCruise.planPointList[index][0].lat
          ])
        }
        this.multiAutoCruise.routes.push(tempList)
      }
      this.addMultiPlanPoints()
    },

    // 添加编队巡航规划点到地图
    addMultiPlanPoints() {
      // 如果已有编队规划点图层，先移除
      if (this.multiPlanPointsLayer) {
        this.map.removeLayer(this.multiPlanPointsLayer)
      }

      // 创建所有编队规划点的要素
      const features = []

      // 遍历每个设备的规划点列表
      this.multiAutoCruise.planPointList.forEach((markerList, indexi) => {
        // 为每个设备的规划点创建要素
        markerList.forEach((item, indexj) => {
          const feature = new Feature({
            geometry: new Point([item.lng, item.lat]),
            index: indexj + 1,
            deviceIndex: indexi + 1,
            info: `[${indexi + 1}-${indexj + 1}]${item.lng},${item.lat}`
          })

          // 设置样式 - 根据设备索引交替使用不同颜色
          const isEven = (Math.floor(indexi / this.multiAutoCruise.MWhenPlan) +
            (indexi % this.multiAutoCruise.MWhenPlan)) % 2 === 0

          feature.setStyle(new Style({
            image: new Icon({
              src: require(isEven ? '@/assets/map/target/blue_marker.png' : '@/assets/map/target/yellow_marker.png'),
              scale: 0.8
            }),
            // 只为每个设备的第一个点添加标签
            text: indexj === 0 ? new Text({
              text: `${item.lng},${item.lat}`,
              offsetY: -15,
              fill: new Fill({
                color: '#fff'
              }),
              stroke: new Stroke({
                color: '#000',
                width: 2
              })
            }) : null
          }))

          features.push(feature)
        })
      })

      // 创建图层并添加到地图
      this.multiPlanPointsLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        })
      })

      this.map.addLayer(this.multiPlanPointsLayer)

      // 添加连接线
      this.addMultiAutoCruiseRoutes()
    },

    // 添加编队巡航连接线段
    addMultiAutoCruiseRoutes() {
      // 如果已有连接线图层，先移除
      if (this.multiAutoCruiseRoutesLayer) {
        this.map.removeLayer(this.multiAutoCruiseRoutesLayer)
      }

      // 创建线段要素集合
      const features = this.multiAutoCruise.routes.map((route, index) => {
        // 创建线段几何
        const lineString = new LineString(route)

        // 创建要素
        const feature = new Feature({
          geometry: lineString,
          index: index
        })

        // 设置样式
        feature.setStyle(new Style({
          stroke: new Stroke({
            color: '#5CF87A',
            width: 2,
            lineDash: [6, 6] // 虚线样式
          })
        }))

        return feature
      })

      // 创建图层并添加到地图
      this.multiAutoCruiseRoutesLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        })
      })

      this.map.addLayer(this.multiAutoCruiseRoutesLayer)
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
      if (this.multiPlanPointsLayer) {
        this.map.removeLayer(this.multiPlanPointsLayer)
        this.multiPlanPointsLayer = null
      }
      if (this.multiAutoCruiseRoutesLayer) {
        this.map.removeLayer(this.multiAutoCruiseRoutesLayer)
        this.multiAutoCruiseRoutesLayer = null
      }
    },

    //自动巡航点击提交按钮，将指令发送给后端
    submitAutoCruise() {
      if (this.autoCruise.planPointList.length > 10) {
        this.$message({
          message: '单设备航路点数目不能超过10，请重新规划',
          type: 'error'
        })
        return;
      }
      let cmd_str = this.sendCmdByPath(this.autoCruise.selectedID, this.autoCruise.planPointList);
      this.$message({
        message: '自动巡航指令发送成功！' + cmd_str,
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
      if (this.autoCruise.selectedTab == '0') {
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
      } else if (this.autoCruise.selectedTab == '1') {
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
      this.addPlanPoints()
    },
    // 添加自动巡航规划点到地图
    addPlanPoints() {
      // 如果已有规划点图层，先移除
      if (this.autoPlanPointsLayer) {
        this.map.removeLayer(this.autoPlanPointsLayer)
      }

      // 创建规划点要素集合
      const features = this.autoCruise.planPointList.map((item, index) => {
        const feature = new Feature({
          geometry: new Point([item.lng, item.lat]),
          index: index + 1,
          info: `[${index + 1}]${item.lng},${item.lat}`
        })

        // 设置样式
        feature.setStyle(new Style({
          image: new Icon({
            src: require('@/assets/map/planMarker.png'),
            scale: 0.8
          }),
          text: new Text({
            text: `[${index + 1}]${item.lng},${item.lat}`,
            offsetY: -15,
            fill: new Fill({
              color: '#fff'
            }),
            stroke: new Stroke({
              color: '#000',
              width: 2
            })
          })
        }))

        return feature
      })

      // 创建图层并添加到地图
      this.autoPlanPointsLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        })
      })

      this.map.addLayer(this.autoPlanPointsLayer)
    },

    //显示自动巡航菜单
    showAutoCruiseMenu() {
      this.closePlanCard()
      this.closeInfoCard()
      this.autoCruise.selectedID = this.infoCardData.markerInfo.id
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
      if (this.autoPlanPointsLayer) {
        this.map.removeLayer(this.autoPlanPointsLayer)
        this.autoPlanPointsLayer = null
      }
    },

    closeInfoCard() {
      this.closeTarget()
      this.closePositionDeviceBorder()
      this.shopPopup = false
      this.shopPopupAIS = false

      //this.targetShow.isShow = false; //显示设备目标点-关闭目标点显示
    },
    closePlanCard() {
      //关闭卡片按钮（路径规划
      this.planFlag = false //让路径规划的坐标拾取关闭
      this.planRoute = []
      this.shopPopup = true
      this.planCardIsShow = false
      this.cleanPlanMarkerLayer()
    },
    closeMultiSelectCard() {
      //关闭卡片按钮（多选设备
      this.multiSelectedDeviceList = []
      //this.shopPopup = true;
      this.multiSelectCardIsShow = false
      this.cleanMultiSelectLayer()
    },
    //悬浮窗导航规划点击函数
    enablePlan() {
      //打开路径导航规划卡片00
      this.planFlag = true //让路径规划坐标拾取器开启
      this.shopPopup = false //让悬浮窗关闭
      this.shopPopupAIS = false
      this.planCardIsShow = true //
      if(this.pickerFlag){
        this.unablePicker() //关闭坐标拾取功能
      }

      //this.mapRuler.turnOff(); //关闭测距
    },

    /**
     * 开启坐标拾取
     */
    enablePicker() {
      this.pickerFlag = true;
      this.picker = []; // 清空之前的拾取数据

      // 创建VectorSource用于存储标记点
      this.pickerSource = new VectorSource();

      // 创建VectorLayer并添加到地图
      this.vectorLayer = new VectorLayer({
        source: this.pickerSource,
        style: this.createPickerStyle.bind(this) // 绑定this上下文
      });

      this.map.addLayer(this.vectorLayer);

      // 定义点击事件处理函数
      this.clickHandler = (evt) => {
        const coordinate = evt.coordinate;
        const [lon, lat] = coordinate.map((num) => num.toFixed(6));
        const index = this.picker.length + 1;

        // 保存坐标数据
        this.picker.push({
          index: index,
          lon: lon,
          lat: lat,
          coordinate: coordinate.slice() // 保存原始坐标副本
        });

        // 创建要素并添加到VectorSource
        const feature = new Feature({
          geometry: new Point(coordinate),
          index: index,
          lon: lon,
          lat: lat
        });

        this.pickerSource.addFeature(feature);
      };

      // 绑定点击事件
      this.map.on('click', this.clickHandler);
    },

    // 样式函数（单独定义便于维护）
    createPickerStyle(feature) {
      const index = feature.get('index');
      const lon = feature.get('lon');
      const lat = feature.get('lat');

      return [
        // 图标样式
        new Style({
          image: new Icon({
            src: require('@/assets/map/planMarker.png'),
            scale: 0.6,
            anchor: [0.5, 1], // 图标底部中心点对齐坐标位置
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction'
          })
        }),
        // 文本样式
        new Style({
          text: new Text({
            text: `[${index}] 经度：${lon}，纬度：${lat}`,
            offsetY: -45, // 文字在图标上方
            font: '12px Microsoft YaHei, Arial, sans-serif',
            fill: new Fill({ color: '#ffffff' }),
            backgroundFill: new Fill({ color: 'rgba(0, 0, 0, 0.7)' }),
            padding: [4, 8, 4, 8],
            overflow: true,
            textAlign: 'center'
          })
        })
      ];
    },

    /**
     * 关闭坐标拾取
     */
    unablePicker() {
      this.pickerFlag = false;

      // 移除点击事件监听
      if (this.clickHandler && this.map) {
        this.map.un('click', this.clickHandler);
        this.clickHandler = null;
      }

      // 清理VectorLayer相关资源
      if (this.vectorLayer) {
        // 清空要素
        if (this.pickerSource) {
          this.pickerSource.clear();
        }

        // 移除图层
        this.map.removeLayer(this.vectorLayer);

        // 释放引用
        this.vectorLayer.dispose && this.vectorLayer.dispose();
        this.vectorLayer = null;
        this.pickerSource = null;
      }

      // 清空数据
      this.picker = [];
    },

    // Vue组件销毁时自动清理
    beforeDestroy() {
      if (this.pickerFlag) {
        this.unablePicker();
      }
    },

    //导航规划里面表格，索引的自增
    deleteRow(index, rows) {
      this.planMarkerRemoveOneOfPoints(index) //删除地图上的坐标打点
      rows.splice(index, 1)
    },
    //多选设备里面表格，索引的自增
    deleteRowOfMultiSelect(index, rows) {
      this.multiSelectRemoveOneOfBorder(index) //删除地图上的设备框
      rows.splice(index, 1)
    },
    getLngLat(lng, lat) {
      //导航规划拾取坐标点 坐标
      return [lng, lat]
    },
    getPlanLabel(lng, lat) {
      return {
        content: lng + ',' + lat,
        offset: [-45, -20]
      }
    },
    //电子围栏区域删除按钮处理
    handleAreaDelete(areaInfo) {
      this.$confirm('是否确认删除名为' + areaInfo.name + '的区域?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          let req = []
          req.push(areaInfo.id)
          return deleteAreaInfo(req)
          // return DeleteAreaInfo(areaInfo.id)
        })
        .then((res) => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getAllArea()
        })
    },
    //电子围栏管理-获取或刷新已被添加的围栏区域
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
            let tempPointList = []
            for (let item1 of item.areaPointResVOS) {
              let temp_area = {
                gpsX: item1.gpsX,
                gpsY: item1.gpsY,
                orderNumber: item1.orderNumber,
                status: item1.status
              }
              tempPointList.push(temp_area)
            }
            tempPointList.sort(function(a, b) {
              return a.orderNumber - b.orderNumber
            })
            for (let item2 of tempPointList) {
              temp.pointList.push([item2.gpsX, item2.gpsY])
            }
            tempAreaList.push(temp)
          }
          this.areaManage.areaList = tempAreaList
        })
      }
    },
    // 电子围栏编辑按钮
    handleAreaUpdate(areaInfo) {

      this.areaManage.areaForm.id = areaInfo.id
      this.areaManage.areaForm.name = areaInfo.name
      this.areaManage.areaForm.visible = areaInfo.visible
      this.areaManage.areaForm.IsCircle = areaInfo.type === '2'
      let tempPointList = []
      for (let item of areaInfo.pointList) {
        tempPointList.push([item[0], item[1]])
      }
      this.areaManage.areaForm.pointList = tempPointList
      this.areaManage.isAdd = false
      this.areaManage.editing = true
      this.areaManage.areaForm.isShow = true

      this.drawgeojsonObject.features[0].geometry.coordinates[0] =
        tempPointList

      this.drawLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.drawgeojsonObject)
        }),
        style: this.drawstyles
      })

      this.map.addLayer(this.drawLayer) //添加图层
    },

    StartDrawingCircle() {
      this.areaManage.areaForm.IsCircle = true
    },
    //计算圆形围栏半径
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
      path.push(path[0])
      return path
    },

    // 电子围栏新增/编辑保存提交
    submitAreaForm() {
      if (this.areaManage.isAdd) {
        //区域新增操作
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
        //区域编辑操作
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

      this.drawLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(this.drawgeojsonObject)
        }),
        style: this.drawstyles
      })

      this.map.addLayer(this.drawLayer) //添加图层
    },
    deletePointRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style scoped>
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

.search-box >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0.35);
  color: #ffffff;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 60px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 60px;
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

.el-button + .el-button {
  margin-left: 0;
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

.navbar {
  position: absolute;
  width: calc(100% - 35px);
}

.zhmap {
  /*height: calc(100vh - 100px);*/
  /*width: 100%;*/
  width: 100vw;
  height: 100vh;
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

.info-card-new {
  z-index: 1;
  position: absolute;
  top: 1px;
  left: 1px;
  width: 325px;
}

.info-card-new-icon {
  font-size: 25px;
  text-align: center;
}

.info-card-new-text {
  color: #2d2d2d;
  font-size: 18px;
}

.popup {
  display: inline-block;
  width: 325px;
  background-color: white;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(177, 177, 177);
}

.info {
  font-size: 14px;
  text-align: left;
}

.home >>> ul {
  padding-left: 0;
}

.latinfo {
  width: 240px;
  z-index: 2;
  position: absolute;
  bottom: 8px;
  left: 3px;
  margin-right: 1rem;
  border: 1px solid rgb(255, 255, 255);
  background-color: #00000036;
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  padding-left: 8px;
}

.overinfo {
  width: 240px;
  z-index: 2;
  position: absolute;
  bottom: 54px;
  left: 3px;
  margin-right: 1rem;
}

.home >>> .hidden {
  display: none;
}

.home >>> .ol-tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}

.home >>> .ol-tooltip-measure {
  opacity: 1;
  font-weight: bold;
}

.home >>> .ol-tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

.home >>> .ol-tooltip-measure:before,
.home >>> .ol-tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

.home >>> .ol-tooltip-static:before {
  border-top-color: #ffcc33;
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

<style>
.el-popover {
  min-width: 60px;
}

/* 比例尺样式 */
.ol-scale-line {
  position: absolute;
  bottom: 85px; /* 调整比例尺距离顶部的距离 */
  left: 5px; /* 调整比例尺距离右侧的距离 */
  z-index: 100; /* 设置比例尺的层级，以确保它在上方显示 */
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
  /* font-size: 100px; */
}


.wave {
  position: absolute;
  z-index: -1;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  text-align: center;
}

.circle {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 50%;
  opacity: 0;
  background: #77acf8;
  animation: circle-opacity 2s 3;
}

.device-info {
  position: absolute;
  background-color: #ffffff; /* 设备信息背景颜色 */
  border: 1px solid #000000; /* 设备信息边框 */
  padding: 5px; /* 设备信息内边距 */
  font-family: Arial, sans-serif; /* 设备信息字体 */
  font-size: 12px; /* 设备信息字体大小 */
  z-index: 999; /* 确保设备信息位于其他元素之上 */
  /* 可以根据需要添加其他样式，如文本颜色、阴影等 */
}

@keyframes circle-opacity {
  from {
    opacity: 0.8;
    transform: scale(0.2);
  }
  to {
    opacity: 0;
    transform: scale(0.4);
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
