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
      map_config: {
        center: [29.9875, 122.2986],
        zoom: 9,
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
      // ----- 1. 高德底图 -----
      const baseMap = L.tileLayer(
        "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        {
          attribution: "© 高德地图",
          subdomains: ["1", "2", "3", "4"],
        }
      );

      // ----- 2. 各种水深尝试（可能都不显示）-----
      // EMODnet
      const depthEMODnet = L.tileLayer.wms(
        "https://ows.emodnet-bathymetry.eu/wms",
        {
          layers: "emodnet:mean_atlas_land",
          format: "image/png",
          transparent: true,
          attribution: "© EMODnet",
          opacity: 0.7,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
        }
      );

      // NOAA GEBCO
      const depthNOAA = L.tileLayer.wms(
        "https://maps.ngdc.noaa.gov/mapviewer-support/wms-proxy/?ogc_service=WMS&ogc_version=1.3.0&dataset=GEBCO",
        {
          layers: "GEBCO",
          format: "image/png",
          transparent: true,
          attribution: "© NOAA/GEBCO",
          opacity: 0.6,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
        }
      );

      // openseamap

      // 备选：另一个GEBCO端点（试试）
      const depthGEBCO = L.tileLayer.wms(
        "https://wms.gebco.net/mapserv",
        {
          layers: "gebco_latest",
          format: "image/png",
          transparent: true,
          attribution: "© GEBCO",
          opacity: 0.6,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
        }
      );

      // ----- 3. 模拟等深线（这个肯定能显示！）-----
      // 在舟山海域周围画几条模拟的等深线（水深值：10m, 20m, 50m）
      const mockIsobaths = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { depth: 10 },
            geometry: {
              type: "LineString",
              coordinates: [
                [122.1, 29.8],
                [122.3, 29.9],
                [122.5, 29.8],
                [122.6, 29.6],
                [122.5, 29.4],
                [122.3, 29.3],
                [122.1, 29.4],
                [122.0, 29.6],
                [122.1, 29.8],
              ],
            },
          },
          {
            type: "Feature",
            properties: { depth: 20 },
            geometry: {
              type: "LineString",
              coordinates: [
                [122.3, 30.0],
                [122.6, 30.1],
                [122.9, 29.9],
                [123.0, 29.6],
                [122.8, 29.3],
                [122.5, 29.2],
                [122.2, 29.4],
                [122.1, 29.7],
                [122.3, 30.0],
              ],
            },
          },
          {
            type: "Feature",
            properties: { depth: 50 },
            geometry: {
              type: "LineString",
              coordinates: [
                [122.5, 30.3],
                [122.9, 30.4],
                [123.3, 30.1],
                [123.5, 29.7],
                [123.2, 29.2],
                [122.7, 29.0],
                [122.2, 29.2],
                [121.9, 29.7],
                [122.2, 30.1],
                [122.5, 30.3],
              ],
            },
          },
        ],
      };

      // 用样式函数让不同深度显示不同颜色
      const mockLayer = L.geoJSON(mockIsobaths, {
        style: (feature) => {
          const depth = feature.properties.depth;
          if (depth <= 10) return { color: "blue", weight: 2 };
          if (depth <= 20) return { color: "cyan", weight: 2 };
          return { color: "purple", weight: 2 };
        },
      });

      // ----- 4. 初始化地图 -----
      this.map = L.map("leaflet-map", {
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        layers: [baseMap], // 先不加任何水深，后面手动加
      });

      // 启用交互
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();

      // 添加控件
      L.control.zoom({ position: "topright" }).addTo(this.map);
      L.control.scale({ position: "bottomleft", metric: true }).addTo(this.map);

      // ----- 5. 添加所有图层到切换器（方便测试）-----
      const overlayLayers = {
        "🔷 模拟等深线 (肯定可见)": mockLayer,
        "🌐 EMODnet 水深": depthEMODnet,
        "🇺🇳 NOAA GEBCO": depthNOAA,
        "🌍 GEBCO 官方": depthGEBCO,
      };

      L.control
        .layers(null, overlayLayers, {
          collapsed: false,
          position: "bottomright",
        })
        .addTo(this.map);

      // 默认显示模拟等深线，让你立刻看到效果
      mockLayer.addTo(this.map);

      console.log("地图初始化完成。模拟等深线已显示，请尝试切换其他水深图层。");
    },
  },
  beforeUnmount() {
    if (this.map) this.map.remove();
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
/* 确保没有任何样式遮挡 */
</style>
