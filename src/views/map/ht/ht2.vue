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
      reset_btn: null,
      map_config: {
        // 舟山海域（水深数据最优）
        center: [29.9875, 122.2986],
        zoom: 10,
        minZoom: 2,
        maxZoom: 18,
      },
      // 图层配置抽离，便于维护
      layerConfig: {
        amap: {
          url: "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          options: {
            attribution: '© 高德地图',
            maxZoom: 18,
            subdomains: ['1', '2', '3', '4'],
            crossOrigin: true,
            tileLoadTimeout: 5000,
            retryOnError: true
          }
        },
        gebco: {
          url: "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
          options: {
            layers: 'gebco_latest',
            format: 'image/png',
            transparent: true,
            attribution: '© GEBCO',
            opacity: 0.7,
            crs: L.CRS.EPSG3857,
            version: '1.3.0',
            styles: 'default',
            timeout: 15000
          }
        },
        depthMark: {
          url: "https://tiles.openseamap.org/depth/{z}/{x}/{y}.png",
          options: {
            maxZoom: 18,
            crossOrigin: true,
            opacity: 0.95,
            tileLoadTimeout: 5000,
            retryOnError: true
          }
        },
        seamark: {
          url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
          options: {
            maxZoom: 18,
            crossOrigin: true,
            opacity: 0.9,
            tileLoadTimeout: 5000
          }
        }
      }
    };
  },
  mounted() {
    // 确保DOM完全渲染后初始化
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    /**
     * 初始化地图核心方法
     */
    initMap() {
      try {
        // 创建基础图层
        const baseMap = L.tileLayer(this.layerConfig.amap.url, this.layerConfig.amap.options);

        // 创建水深相关图层
        const depthLayer = L.tileLayer.wms(this.layerConfig.gebco.url, this.layerConfig.gebco.options);
        const depthNumLayer = L.tileLayer(this.layerConfig.depthMark.url, this.layerConfig.depthMark.options);
        const seamarkLayer = L.tileLayer(this.layerConfig.seamark.url, this.layerConfig.seamark.options);

        // 初始化地图实例（优化交互配置）
        this.map = L.map("leaflet-map", {
          zoomControl: true,
          center: this.map_config.center,
          zoom: this.map_config.zoom,
          minZoom: this.map_config.minZoom,
          maxZoom: this.map_config.maxZoom,
          layers: [baseMap, depthLayer],
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: false,
          inertia: true,
          inertiaDeceleration: 2000,
          maxBoundsViscosity: 0.8
        });

        // 启用所有交互功能
        this.enableMapInteractions();

        // 配置控件
        this.initMapControls(baseMap, depthLayer, depthNumLayer, seamarkLayer);

        // 绑定事件
        this.bindMapEvents();

        console.log("地图初始化成功");
      } catch (error) {
        console.error("地图初始化失败:", error);
        // 降级处理：仅加载基础地图
        this.fallbackToBasicMap();
      }
    },

    /**
     * 启用地图所有交互功能
     */
    enableMapInteractions() {
      if (!this.map) return;

      // 核心缩放功能
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();

      // 拖拽和平移
      this.map.dragging.enable();
      this.map.boxZoom.enable();
      this.map.keyboard.enable();

      // 移动惯性（优化体验）
      this.map.inertia.enable();
    },

    /**
     * 初始化地图控件
     */
    initMapControls(baseMap, depthLayer, depthNumLayer, seamarkLayer) {
      // 移除默认缩放控件
      this.map.removeControl(this.map.zoomControl);
      L.control.zoom({
        position: "topright",
        zIndex: 9999
      }).addTo(this.map);

      const baseLayers = {
        "🗺️ 高德基础地图": baseMap
      };

      const overlayLayers = {
        "🔵 水深等深线+着色（核心）": depthLayer,
        "📏 水深数值标记（补充）": depthNumLayer,
        "🚢 海洋航标标记（辅助）": seamarkLayer
      };

      // 图层控件：第一个参数底图，第二个参数叠加层
      L.control.layers(baseLayers, overlayLayers, {
        position: "bottomright",
        collapsed: false,
        autoZIndex: true
      }).addTo(this.map);

      // 添加比例尺
      L.control.scale({
        position: "bottomleft",
        metric: true,
        imperial: false
      }).addTo(this.map);

      depthLayer.addTo(this.map);  // 主动添加到地图
      depthNumLayer.addTo(this.map); // 数值标记也加上
    },

    /**
     * 绑定地图事件（精简安全）
     */
    bindMapEvents() {
      // 缩放结束事件（安全判断）
      this.map.on("zoomend", (e) => {
        if (this.reset_btn && typeof this.reset_btn.enable === 'function') {
          const isDefaultZoom = this.map.getZoom() === this.map_config.zoom;
          isDefaultZoom ? this.reset_btn.disable() : this.reset_btn.enable();
        }
      });

      // 图层加载错误处理
      this.map.on("tileerror", (e) => {
        console.warn("瓦片加载失败:", e.url);
      });
    },

    /**
     * 降级处理：初始化失败时仅加载基础地图
     */
    fallbackToBasicMap() {
      this.map = L.map("leaflet-map", {
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        zoomControl: true
      });
      L.tileLayer(this.layerConfig.amap.url, this.layerConfig.amap.options).addTo(this.map);
      L.control.zoom({ position: "topright" }).addTo(this.map);
      alert("水深图层加载失败，已切换为基础地图");
    }
  },
  /**
   * 组件销毁时清理资源（防止内存泄漏）
   */
  beforeUnmount() {
    if (this.map) {
      // 移除所有事件监听
      this.map.off();
      // 移除所有图层和控件
      this.map.eachLayer(layer => this.map.removeLayer(layer));
      // 销毁地图实例
      this.map.remove();
      this.map = null;
      this.reset_btn = null;
      console.log("地图资源已清理");
    }
  }
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
  pointer-events: auto;
}

::v-deep(.leaflet-control) {
  z-index: 9999 !important;
  pointer-events: auto !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 4px !important;
}

::v-deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

::v-deep(.leaflet-control-zoom a) {
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 18px !important;
}

::v-deep(.leaflet-tile-container) {
  z-index: 1 !important;
}

::v-deep(.leaflet-overlay-pane) {
  z-index: 2 !important;
  pointer-events: none !important;
}

::v-deep(.leaflet-wms-layer) {
  mix-blend-mode: overlay;
  pointer-events: none !important;
}

::v-deep(.leaflet-projection-epsg3857) {
  padding: 0 !important;
}
</style>
