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
      emodnetContour: null,
      noaaContour: null,
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
      // 1. 基础底图（OSM）
      const osmBase = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      });

      // ===== 等深线图层 1：NOAA GEBCO 等深线（推荐默认）=====
      this.noaaContour = L.tileLayer.wms(
        "https://maps.ngdc.noaa.gov/mapviewer-support/wms-proxy/?ogc_service=WMS&ogc_version=1.3.0&dataset=GEBCO_2019_Contours",
        {
          layers: "GEBCO_2019_Contours",      // 正确图层名
          format: "image/png",
          transparent: true,
          attribution: "© NOAA/GEBCO",
          opacity: 0.8,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,                 // 确保与地图坐标系一致
          styles: "",                           // 使用默认样式
        }
      );

      // ===== 等深线图层 2：EMODnet 10米间隔等深线（备选）=====
      this.emodnetContour = L.tileLayer.wms(
        "https://ows.emodnet-bathymetry.eu/wms",
        {
          layers: "emodnet:contours_10m",
          format: "image/png",
          transparent: true,
          attribution: "© EMODnet Bathymetry",
          opacity: 0.9,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
          styles: "contours_black",
        }
      );

      // 2. 初始化地图（默认开启 NOAA 等深线）
      this.map = L.map("leaflet-map", {
        zoomControl: false,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [osmBase, this.noaaContour],    // 默认 NOAA
        fadeAnimation: true,
        zoomAnimation: true,
        inertia: true,
      });

      // 3. 启用交互
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();

      // 4. 缩放控件
      L.control.zoom({ position: "topright" }).addTo(this.map);

      // 5. 复位按钮
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

      // 6. 图层切换器（两个等深线可选）
      L.control.layers(
        { "OSM底图": osmBase },
        {
          "⚫ NOAA GEBCO 等深线": this.noaaContour,
          "🔵 EMODnet 等深线 (10m间隔)": this.emodnetContour,
        },
        { position: "bottomright", collapsed: false }
      ).addTo(this.map);

      // 7. 比例尺
      L.control.scale({
        position: "bottomleft",
        metric: true,
        imperial: false,
      }).addTo(this.map);

      // 8. 错误监听（仅打印，不影响使用）
      this.noaaContour.on("tileerror", (e) => {
        console.warn("NOAA等深线瓦片加载失败，可能该区域无数据");
      });
      this.emodnetContour.on("tileerror", (e) => {
        console.warn("EMODnet等深线瓦片加载失败，可能该区域无数据");
      });

      console.log("地图初始化完成，默认启用 NOAA 等深线");
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
      this.noaaContour = null;
      this.emodnetContour = null;
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

::v-deep(.leaflet-overlay-pane) {
  pointer-events: none;
}
</style>
