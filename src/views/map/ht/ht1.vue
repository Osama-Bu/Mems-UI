<template>
  <div>
    <div id="leaflet-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // 必须导入样式

export default {
  data() {
    return {
      map: null,
      reset_btn: null, // 初始化为空，避免未定义
      map_config: {
        center: [29.9875, 122.2986],
        zoom: 10,
        minZoom: 2,
        maxZoom: 18,
      },
    };
  },
  mounted() {
    // 确保DOM完全加载后初始化地图，避免缩放控件绑定异常
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    initMap() {
      // ========== 1. 高德基础地图（修复瓦片加载策略） ==========
      const amapBaseUrl = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
      const baseMap = L.tileLayer(amapBaseUrl, {
        attribution: '© 高德地图',
        maxZoom: 18,
        subdomains: ['1', '2', '3', '4'],
        crossOrigin: true,
        // 修复：瓦片加载超时和重试策略，避免阻塞缩放
        tileLoadTimeout: 5000,
        retryOnError: true
      });

      // ========== 2. 水深图层（保留清晰深度显示） ==========
      const gebcoSeaUrl = "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv";
      const depthMarkUrl = "https://tiles.openseamap.org/depth/{z}/{x}/{y}.png";

      // 修复：WMS图层加载优化，避免阻塞地图交互
      const depthLayer = L.tileLayer.wms(gebcoSeaUrl, {
        layers: 'gebco_latest',
        format: 'image/png',
        transparent: true,
        attribution: '© GEBCO 全球水深数据',
        opacity: 0.8,
        crs: L.CRS.EPSG3857, // 明确坐标系
        timeout: 10000
      });

      const depthNumLayer = L.tileLayer(depthMarkUrl, {
        maxZoom: 18,
        crossOrigin: true,
        opacity: 0.95,
        tileLoadTimeout: 5000,
        retryOnError: true
      });

      // ========== 3. 初始化地图（核心修复缩放相关配置） ==========
      this.map = L.map("leaflet-map", {
        zoomControl: true, // 修复：先启用默认缩放控件，避免自定义控件冲突
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [baseMap, depthLayer],
        // 修复：优化交互性能
        fadeAnimation: false, // 禁用动画减少卡顿
        zoomAnimation: false,
        markerZoomAnimation: false,
        inertia: false, // 禁用惯性，避免缩放冲突
      });

      // ========== 4. 强制启用缩放控制 ==========
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();


      // ========== 4. 缩放控件修复（避免层级冲突） ==========
      // 移除默认缩放控件，重新添加自定义位置的控件（解决冲突）
      this.map.removeControl(this.map.zoomControl);
      L.control.zoom({
        position: "topright",
        // 新增：明确控件层级，避免被遮挡
        zIndex: 9999
      }).addTo(this.map);

      // ========== 5. 图层切换器（修复层级） ==========
      const baseLayers = { "高德基础地图": baseMap };
      const overlayLayers = {
        "水深等深线+着色（核心）": depthLayer,
        "水深数值标记（补充）": depthNumLayer,
        "海洋航标标记（无水深）": L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          maxZoom: 18,
          crossOrigin: true,
          opacity: 0.9,
          tileLoadTimeout: 5000
        })
      };

      L.control.layers(baseLayers, overlayLayers, {
        position: "bottomright",
        collapsed: false,
        zIndex: 9999 // 控件层级高于地图，避免遮挡
      }).addTo(this.map);

      // ========== 6. 修复缩放监听事件（核心bug） ==========
      this.map.on("zoomend", (event) => {
        // 修复：先判断reset_btn是否存在，避免未定义变量导致事件阻塞
        if (this.reset_btn && typeof this.reset_btn.enable === 'function') {
          if (this.map.getZoom() !== this.map_config.zoom) {
            this.reset_btn.enable();
          } else {
            // 补充：缩放回默认级别时禁用按钮，避免逻辑异常
            this.reset_btn.disable();
          }
        }
      });

      // ========== 7. 修复滚轮缩放（强制启用，解决偶发失效） ==========
      this.map.scrollWheelZoom.enable();
      // 修复：触摸设备缩放（可选，适配多端）
      if (this.map.touchZoom) {
        this.map.touchZoom.enable();
      }
    },
  },
  // 新增：组件销毁时清理地图实例，避免内存泄漏导致的交互异常
  beforeUnmount() {
    if (this.map) {
      // 移除所有事件监听
      this.map.off("zoomend");
      // 销毁地图实例
      this.map.remove();
      this.map = null;
    }
  }
};
</script>

<style scoped>
#leaflet-map {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* 修复：确保地图容器可交互 */
  pointer-events: auto;
}

/* 核心修复：图层层级和交互优先级，解决缩放被遮挡 */
::v-deep(.leaflet-control) {
  z-index: 9999 !important; /* 控件层级最高，避免被图层遮挡 */
  pointer-events: auto !important; /* 确保控件可点击/缩放 */
}
::v-deep(.leaflet-tile-container) {
  z-index: 1 !important;
}
::v-deep(.leaflet-overlay-pane) {
  z-index: 2 !important;
  pointer-events: none !important; /* 图层不拦截鼠标缩放事件 */
}
::v-deep(.leaflet-marker-icon) {
  background: none !important;
}
::v-deep(.leaflet-wms-layer) {
  mix-blend-mode: overlay;
  pointer-events: none !important; /* 水深图层不拦截缩放事件 */
}
</style>
