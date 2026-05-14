<template>
  <div>
    <div id="leaflet-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  data() {
    return {
      map: null,
      reset_btn: null,
      map_config: {
        center: [29.9875, 122.2986],
        zoom: 10,
        minZoom: 2,
        maxZoom: 18,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    initMap() {
      // 高德底图（保持不变）
      const amapBaseUrl = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
      const baseMap = L.tileLayer(amapBaseUrl, {
        attribution: '© 高德地图',
        maxZoom: 18,
        subdomains: ['1', '2', '3', '4'],
        crossOrigin: true,
        tileLoadTimeout: 5000,
        retryOnError: true
      });

      // ===== 关键修复：使用 NOAA 的 GEBCO 代理 =====
      const gebcoSeaUrl = "https://maps.ngdc.noaa.gov/mapviewer-support/wms-proxy/?ogc_service=WMS&ogc_version=1.3.0&dataset=GEBCO";

      const depthLayer = L.tileLayer.wms(gebcoSeaUrl, {
        layers: 'GEBCO',              // 图层名改为 GEBCO
        format: 'image/png',
        transparent: true,
        attribution: '© NOAA/GEBCO',
        opacity: 0.7,                  // 稍微降低透明度，便于观察
        crs: L.CRS.EPSG3857,            // 明确指定坐标系
        version: '1.3.0',
        styles: '',                     // 清空样式，使用默认
        timeout: 15000
      });

      // OpenSeaMap 水深数值（原样保留）
      const depthMarkUrl = "https://tiles.openseamap.org/depth/{z}/{x}/{y}.png";
      const depthNumLayer = L.tileLayer(depthMarkUrl, {
        maxZoom: 18,
        crossOrigin: true,
        opacity: 0.95,
        tileLoadTimeout: 5000,
        retryOnError: true
      });

      // 初始化地图
      this.map = L.map("leaflet-map", {
        zoomControl: true,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [baseMap, depthLayer], // 默认添加水深图层
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        inertia: true,
      });

      // 启用交互
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();
      if (this.map.touchZoom) this.map.touchZoom.enable();

      // 自定义缩放控件（右上角）
      this.map.removeControl(this.map.zoomControl);
      L.control.zoom({
        position: "topright",
        zIndex: 9999
      }).addTo(this.map);

      // 图层切换器（右下角）
      const baseLayers = { "高德基础地图": baseMap };
      const overlayLayers = {
        "🌊 水深等深线 (NOAA)": depthLayer,
        "🔢 水深数值标记": depthNumLayer,
        "🚢 海洋航标标记": L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          maxZoom: 18,
          crossOrigin: true,
          opacity: 0.9,
          tileLoadTimeout: 5000
        })
      };

      L.control.layers(baseLayers, overlayLayers, {
        position: "bottomright",
        collapsed: false,
        zIndex: 9999
      }).addTo(this.map);

      // ===== 可选：添加比例尺（方便观察） =====
      L.control.scale({
        position: "bottomleft",
        metric: true,
        imperial: false
      }).addTo(this.map);

      // 缩放事件（保持不变）
      this.map.on("zoomend", (event) => {
        if (this.reset_btn && typeof this.reset_btn.enable === 'function') {
          if (this.map.getZoom() !== this.map_config.zoom) {
            this.reset_btn.enable();
          } else {
            this.reset_btn.disable();
          }
        }
      });

      // 监听瓦片错误（便于调试）
      this.map.on("tileerror", (e) => {
        console.warn("瓦片加载失败:", e.url);
      });

      console.log("地图初始化完成，水深图层已添加");
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.off("zoomend");
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
  pointer-events: auto;
}

/* 简化样式，避免干扰控件显示 */
::v-deep(.leaflet-control) {
  z-index: 9999 !important;
  pointer-events: auto !important;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 2px;
}

::v-deep(.leaflet-control-zoom a) {
  width: 30px;
  height: 30px;
  line-height: 30px;
}

::v-deep(.leaflet-overlay-pane) {
  pointer-events: none; /* 保证图层不拦截鼠标事件 */
}

::v-deep(.leaflet-wms-layer) {
  mix-blend-mode: overlay; /* 保留混合模式，让等深线更明显 */
}
</style>
