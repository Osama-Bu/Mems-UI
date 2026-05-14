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
      reset_btn: null,
      map_config: {
        // 切换到国内海域（如舟山，更易看到海洋要素）
        center: [29.9875, 122.2986],
        zoom: 12,
        minZoom: 2,
        maxZoom: 18,
      },
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // ========== 1. 基础地图背板（必选，解决无地图问题） ==========
      // 方案1：OpenStreetMap基础地图（全球通用，有完整地形/道路）
      const osmBaseUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      // 方案2：国内高德地图（更适配国内区域，备选）
      const amapBaseUrl = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";

      // ========== 2. 海洋要素叠加层（水深/航标） ==========
      const seaMarkUrl = "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png";
      // 备选海洋水深层（Gebco，更清晰的水深着色）
      // const gebcoSeaUrl = "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?request=GetMap&service=WMS&version=1.3.0&layers=gebco_latest&styles=default&format=image/png&transparent=true&width=256&height=256&crs=EPSG:3857&bbox={bbox}";

      // 创建基础地图图层（背板）
      // const baseMap = L.tileLayer(osmBaseUrl, {
      //   attribution: '© OpenStreetMap contributors',
      //   maxZoom: 19,
      //   subdomains: ['a', 'b', 'c'],
      //   crossOrigin: true
      // });
      const baseMap = L.tileLayer(amapBaseUrl, {
        attribution: '© 高德地图',
        maxZoom: 18,
        subdomains: ['1', '2', '3', '4'], // 高德子域名是数字
        crossOrigin: true
      });

      // 创建海洋要素图层（叠加层）
      const seaLayer = L.tileLayer(seaMarkUrl, {
        attribution: '© OpenSeaMap contributors',
        maxZoom: 18,
        crossOrigin: true,
        opacity: 0.9 // 调整透明度，避免遮挡基础地图
      });

      // 创建水深等深线图层（Gebco，带着色+等深线）
      // const depthLayer = L.tileLayer.wms(gebcoSeaUrl, {
      //   layers: 'gebco_latest',
      //   format: 'image/png',
      //   transparent: true,
      //   attribution: '© GEBCO (General Bathymetric Chart of the Oceans)',
      //   opacity: 0.7 // 叠加在基础地图上，保留地形可见
      // });


      // ========== 3. 初始化地图（先加载基础地图，再叠加海洋层） ==========
      this.map = L.map("leaflet-map", {
        zoomControl: false,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [baseMap] // 先加载基础地图背板
      });

      // 叠加海洋图层（关键：基础地图之上加海洋要素）
      seaLayer.addTo(this.map);
      // depthLayer.addTo(this.map);

      // ========== 控件配置 ==========
      // 缩放控件
      L.control.zoom({ position: "topright" }).addTo(this.map);

      // 图层切换器（可手动切换/关闭海洋层）
      const baseLayers = {
        "基础地图": baseMap
      };
      const overlayLayers = {
        "海洋要素（水深/航标）": seaLayer,
        // "水深等深线+着色": depthLayer,
      };
      L.control.layers(baseLayers, overlayLayers, {
        position: "bottomright",
        collapsed: false // 默认展开，方便调试
      }).addTo(this.map);

      // 缩放监听（保留原有逻辑）
      this.map.on("zoomend", (event) => {
        if (this.reset_btn && this.map.getZoom() !== this.map_config.zoom) {
          this.reset_btn.enable();
        }
      });
    },
  },
};
</script>

<style scoped>
#leaflet-map {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 修复Leaflet默认图标路径问题（可选） */
::v-deep(.leaflet-pane) {
  z-index: 1000 !important;
}
::v-deep(.leaflet-marker-icon) {
  background: none !important;
}
</style>
