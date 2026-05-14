<template>
  <div className="map-container">
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
      map_config: {
        center: [29.9875, 122.2986], // 舟山海域
        zoom: 10,
        minZoom: 2,
        maxZoom: 18,
      },
    };
  },
  mounted() {
    this.$nextTick(() => this.initMap());
  },
  methods: {
    initMap() {
      // 1. 基础底图（高德，国内稳定）
      const amap = L.tileLayer(
        "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        {
          attribution: "© 高德地图",
          subdomains: ["1", "2", "3", "4"],
          maxZoom: 18,
        }
      );

      // 2. ESRI 海洋底图（核心：等深线+水深着色）
      const oceanBase = L.tileLayer(
        "https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© ESRI",
          maxZoom: 10,
          opacity: 0.9,
        }
      );

      // 3. ESRI 海洋标注（航标、港口、水深文字）
      const oceanRef = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© ESRI",
          maxZoom: 10,
          opacity: 1,
        }
      );

      // 4. 初始化地图（默认加载所有图层）
      this.map = L.map("leaflet-map", {
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        layers: [amap, oceanBase, oceanRef],
        zoomControl: true,
      });

      // 5. 图层切换控件
      L.control.layers(
        { "高德底图": amap },
        {
          "🌊 海洋底图（等深线）": oceanBase,
          "🚢 海洋标注（航标/水深）": oceanRef,
        },
        { position: "bottomright", collapsed: false }
      ).addTo(this.map);

      L.control.zoom({ position: "topright" }).addTo(this.map);
    },
  },
  beforeUnmount() {
    this.map?.remove();
  },
};
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

#leaflet-map {
  width: 100%;
  height: 100%;
}

/* 避免海洋图层拦截鼠标 */
::v-deep(.leaflet-overlay-pane) {
  pointer-events: none !important;
}
</style>
