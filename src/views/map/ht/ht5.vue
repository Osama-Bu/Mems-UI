<template>
  <div class="map-container">
    <div id="leaflet-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MarineMap",
  data() {
    return {
      map: null,
      map_config: {
        center: [29.9875, 122.2986], // 舟山海域
        zoom: 12,
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

      // 2. ESRI 全球海洋底图（含等深线、海洋要素，国内可访问）
      const oceanBase = L.tileLayer(
        "https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© ESRI",
          maxZoom: 10, // 该图层最高10级，10级以上自动切回基础底图
          opacity: 0.9,
        }
      );

      // 3. ESRI 海洋标注（航标、港口、水深文字，国内可访问）
      const oceanRef = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© ESRI",
          maxZoom: 10,
          opacity: 1,
        }
      );

      // 4. 初始化地图
      this.map = L.map("leaflet-map", {
        zoomControl: true,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [oceanBase, oceanRef], // 默认加载所有图层
      });

      // 5. 交互与控件
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      L.control.zoom({ position: "topright" }).addTo(this.map);

      // 6. 图层切换
      L.control.layers(
        {
          "🌊 海洋底图（等深线）": oceanBase,
          "🚢 海洋标注（航标/水深）": oceanRef,
        },
        { position: "bottomright", collapsed: false }
      ).addTo(this.map);

      console.log("ESRI 海洋地图加载完成");
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
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
/* 确保海洋图层不拦截鼠标事件 */
::v-deep(.leaflet-overlay-pane) {
  pointer-events: none !important;
}
</style>
