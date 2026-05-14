import i18n from '@/lang/index';

/**
 *  设备状态
 *  status 状态（0-正常，1-离线，2-故障）
 *  dark加深：info-灰，success-绿，warning-黄，danger-红，空-蓝
 *  */
const deviceStatusDict = [
  { value: '0', label: i18n.t('deviceInfo.table.status.normal'), type: 'success' },
  { value: '1', label: i18n.t('deviceInfo.table.status.offline'), type: 'info' },
  { value: '2', label: i18n.t('deviceInfo.table.status.fault'), type: 'danger' }
];

// 设备状态
function  getDeviceStatusType(status) {
  const item = deviceStatusDict.find(item => item.value === status)
  return item ? item.type : status // 未匹配到时显示原始值
}

function  getDeviceStatusText(status) {
  const item = deviceStatusDict.find(item => item.value === status)
  return item ? item.label : status // 未匹配到时显示原始值
}

// 导出所有需要的配置和方法
export default {
  deviceStatusDict,
  getDeviceStatusType,
  getDeviceStatusText
};
