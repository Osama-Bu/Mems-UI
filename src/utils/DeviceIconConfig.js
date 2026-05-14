import i18n from '@/lang/index';
/**
 *  设备icon配置
 *
 *  */
const deviceIconOptions = [
  { iconType: '1', deviceIcon: '1', url: 'glider/SV1/SV1_blue.png' },
  { iconType: '1', deviceIcon: '2', url: 'glider/SV1/SV1_cyan.png' },
  { iconType: '1', deviceIcon: '3', url: 'glider/SV1/SV1_green.png' },
  { iconType: '1', deviceIcon: '4', url: 'glider/SV1/SV1_orange.png' },
  { iconType: '1', deviceIcon: '5', url: 'glider/SV1/SV1_pink.png' },
  { iconType: '1', deviceIcon: '6', url: 'glider/SV1/SV1_purple.png' },
  { iconType: '1', deviceIcon: '7', url: 'glider/SV1/SV1_red.png' },
  { iconType: '1', deviceIcon: '8', url: 'glider/SV1/SV1_yellow.png' },

  { iconType: '2', deviceIcon: '1', url: 'glider/SV2/SV2_blue.png' },
  { iconType: '2', deviceIcon: '2', url: 'glider/SV2/SV2_cyan.png' },
  { iconType: '2', deviceIcon: '3', url: 'glider/SV2/SV2_green.png' },
  { iconType: '2', deviceIcon: '4', url: 'glider/SV2/SV2_orange.png' },
  { iconType: '2', deviceIcon: '5', url: 'glider/SV2/SV2_pink.png' },
  { iconType: '2', deviceIcon: '6', url: 'glider/SV2/SV2_purple.png' },
  { iconType: '2', deviceIcon: '7', url: 'glider/SV2/SV2_red.png' },
  { iconType: '2', deviceIcon: '8', url: 'glider/SV2/SV2_yellow.png' },

  { iconType: '3', deviceIcon: '1', url: 'glider/SV3/SV3_blue.png' },
  { iconType: '3', deviceIcon: '2', url: 'glider/SV3/SV3_cyan.png' },
  { iconType: '3', deviceIcon: '3', url: 'glider/SV3/SV3_green.png' },
  { iconType: '3', deviceIcon: '4', url: 'glider/SV3/SV3_orange.png' },
  { iconType: '3', deviceIcon: '5', url: 'glider/SV3/SV3_pink.png' },
  { iconType: '3', deviceIcon: '6', url: 'glider/SV3/SV3_purple.png' },
  { iconType: '3', deviceIcon: '7', url: 'glider/SV3/SV3_red.png' },
  { iconType: '3', deviceIcon: '8', url: 'glider/SV3/SV3_yellow.png' },

  { iconType: '4', deviceIcon: '1', url: 'beacon/beacon_blue.png' },
  { iconType: '4', deviceIcon: '2', url: 'beacon/beacon_cyan.png' },
  { iconType: '4', deviceIcon: '3', url: 'beacon/beacon_green.png' },
  { iconType: '4', deviceIcon: '4', url: 'beacon/beacon_orange.png' },
  { iconType: '4', deviceIcon: '5', url: 'beacon/beacon_pink.png' },
  { iconType: '4', deviceIcon: '6', url: 'beacon/beacon_purple.png' },
  { iconType: '4', deviceIcon: '7', url: 'beacon/beacon_red.png' },
  { iconType: '4', deviceIcon: '8', url: 'beacon/beacon_yellow.png' },

  { iconType: '5', deviceIcon: '1', url: 'buoy/buoy_blue.png' },
  { iconType: '5', deviceIcon: '2', url: 'buoy/buoy_cyan.png' },
  { iconType: '5', deviceIcon: '3', url: 'buoy/buoy_green.png' },
  { iconType: '5', deviceIcon: '4', url: 'buoy/buoy_orange.png' },
  { iconType: '5', deviceIcon: '5', url: 'buoy/buoy_pink.png' },
  { iconType: '5', deviceIcon: '6', url: 'buoy/buoy_purple.png' },
  { iconType: '5', deviceIcon: '7', url: 'buoy/buoy_red.png' },
  { iconType: '5', deviceIcon: '8', url: 'buoy/buoy_yellow.png' },
];

// 设备图标名称配置
const deviceIconName = [
  { iconType: '1', iconTypeName: i18n.t('otherConfig.iconConfig.gliderSv1') },
  { iconType: '2', iconTypeName: i18n.t('otherConfig.iconConfig.gliderSv2') },
  { iconType: '3', iconTypeName: i18n.t('otherConfig.iconConfig.gliderSv3') },
  { iconType: '4', iconTypeName: i18n.t('otherConfig.iconConfig.beaconDefault') },
  { iconType: '5', iconTypeName: i18n.t('otherConfig.iconConfig.buoyDefault') },
];

// 初始化设备图标数据（转换URL为require引入）
let deviceIcons = [];
function initDeviceIcons() {
  deviceIcons = deviceIconOptions.map(item => {
    // 提取拼接半动态路径
    const url = item.url;
    return {
      iconType: item.iconType,
      deviceIcon: item.deviceIcon,
      // 将url转换为require引入的图片资源
      iconImg: require(`@/assets/icons/${url}`)
    };
  });
}

// 初始化图标数据（确保在使用前执行）
initDeviceIcons();

// 返回该iconType下的所有图片
function getIconImgsByType(iconType) {
  // 筛选出所有匹配当前iconType的图片项
  return deviceIcons.filter(item => item.iconType === iconType) || [];
}

// 根据选中的iconType匹配对应的图片路径
function getIconImgByType(iconType) {
  const matchedIcon = deviceIcons.find(item => item.iconType === iconType);
  return matchedIcon ? matchedIcon.iconImg : '';
}

// 根据设备类型选取第一个图标
function getIconByIconType(iconType) {
  const icon = deviceIcons.find(item => item.iconType === iconType);
  if (icon) {
    return icon.iconImg;
  } else {
    return deviceIcons[0].iconImg;
  }
}

// 根据iconType和deviceIcon获取具体图标
function getDeviceIcon(item) {
  const matchedItem = deviceIcons.find(icon => {
    return icon.iconType === item.iconType && icon.deviceIcon === item.deviceIcon;
  });
  // 找到则返回iconImg
  if (matchedItem) {
    return matchedItem.iconImg;
  } else {
    // 返回默认图标
    // return require('@/assets/icons/default.png');
    return deviceIcons[0].iconImg;
  }
}

function getDeviceIconsByIconType(iconType){
  const allIcons = this.deviceIcons.filter(item => item.iconType === iconType);
  if(allIcons){
    return allIcons;
  }else {
    return null;
  }
}

// 导出所有需要的配置和方法
export default {
  deviceIconOptions,
  deviceIconName,
  deviceIcons,
  getIconImgsByType,
  getIconImgByType,
  getIconByIconType,
  getDeviceIcon,
  getDeviceIconsByIconType
};
