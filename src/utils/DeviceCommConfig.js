import i18n from '@/lang/index';

/**
 *  通信方式
 *  */
const commWayOptions = [
  { value: '1', label: i18n.t('otherConfig.commWayConfig.yx'), color: '#409EFF' },   // 蓝色
  { value: '2', label: i18n.t('otherConfig.commWayConfig.bd2'), color: '#67C23A' },   // 绿色
  { value: '3', label: i18n.t('otherConfig.commWayConfig.bd3'), color: '#E6A23C' },   // 橙色
  { value: '4', label: i18n.t('otherConfig.commWayConfig.tt'), color: '#F56C6C' }    // 红色
];

// 获取通信方式名称
function getCommWayName(type) {
  const wayOption = commWayOptions.find(option => option.value === type)
  return wayOption ? wayOption.label : i18n.t('otherConfig.commWayConfig.unknown')
}

// 处理通信方式数据的方法
function getTypeName(row) {
  const wayOption = this.commWayOptions.find(option => option.value === row.communicateType)
  return wayOption ? wayOption.label : i18n.t('otherConfig.commWayConfig.unknown')
}

function getTypeColor(row) {
  const wayOption = this.commWayOptions.find(option => option.value === row.communicateType)
  return wayOption ? wayOption.color : ''
}

// 导出所有需要的配置和方法
export default {
  commWayOptions,
  getCommWayName,
  getTypeName,
  getTypeColor
};
