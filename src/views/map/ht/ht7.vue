<template>
  <div class="map-container">
    <div id="leaflet-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MarineDepthMap",
  data() {
    return {
      map: null,
      contourLayer: null,
      resetBtn: null,
      map_config: {
        center: [29.9875, 122.2986],
        zoom: 8,
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
      // 1. 基础底图（OSM，高缩放级别清晰）
      const osmBase = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      });

      // ===== 核心修改：使用 EMODnet 等深线 WMS =====
      this.contourLayer = L.tileLayer.wms(
        "https://ows.emodnet-bathymetry.eu/wms",
        {
          layers: "emodnet:contours",        // 等深线图层
          format: "image/png",
          transparent: true,
          attribution: "© EMODnet Bathymetry",
          opacity: 0.9,                       // 提高透明度，让底图可见
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
          styles: "contour_default",           // 使用默认等深线样式
          // 可选：自定义线宽和颜色（通过 SLD 或样式，但默认已足够）
        }
      );

      // 2. 初始化地图
      this.map = L.map("leaflet-map", {
        zoomControl: false,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [osmBase, this.contourLayer], // 同时添加底图和等深线
        fadeAnimation: true,
        zoomAnimation: true,
        inertia: true,
      });

      // 3. 启用交互
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();

      // 4. 缩放控件（右上）
      L.control.zoom({ position: "topright" }).addTo(this.map);

      // 5. 复位按钮（右上）
      this.resetBtn = L.control({ position: "topright" });
      this.resetBtn.onAdd = () => {
        const btn = L.DomUtil.create("button", "reset-button");
        btn.innerHTML = "⏎ 复位";
        btn.title = "回到舟山海域";
        btn.style.cssText = `
          width: 60px; height: 40px; margin-left: 10px;
          background: white; border: 2px solid rgba(0,0,0,0.2);
          border-radius: 4px; cursor: pointer; font-size: 14px;
          font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        L.DomEvent.on(btn, "click", () => {
          this.map.setView(this.map_config.center, this.map_config.zoom);
        });
        return btn;
      };
      this.resetBtn.addTo(this.map);

      // 6. 图层切换器（方便对比）
      L.control.layers(
        { "OSM底图": osmBase },
        { "🗺️ 等深线 (EMODnet)": this.contourLayer },
        { position: "bottomright", collapsed: false }
      ).addTo(this.map);

      // 7. 比例尺
      L.control.scale({
        position: "bottomleft",
        metric: true,
        imperial: false,
      }).addTo(this.map);

      // 8. 错误监听
      this.contourLayer.on("tileerror", (e) => {
        console.warn("等深线瓦片加载失败:", e.url);
      });

      console.log("地图初始化完成，现在应该能看到清晰的等深线");
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
      this.contourLayer = null;
    }
  },
};
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

#leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto !important;
}

::v-deep(.leaflet-control) {
  z-index: 9999 !important;
  pointer-events: auto !important;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

::v-deep(.leaflet-control-zoom a) {
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  cursor: pointer;
}

::v-deep(.reset-button:hover) {
  background: #f0f0f0;
}

/* 确保等深线图层不拦截鼠标事件 */
::v-deep(.leaflet-overlay-pane) {
  pointer-events: none;
}
</style>
