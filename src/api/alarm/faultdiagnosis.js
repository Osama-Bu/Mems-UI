import request from '@/utils/request'

// 故障检测
export function getFault(data) {
    return request({
        url: '/monitor/watchAlarmInfo/search',
        method: 'post',
        data: data
    })
}
