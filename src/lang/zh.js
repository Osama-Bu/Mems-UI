/**
 * 普通文本使用方式： {{ $t('login.title') }}
 * 标签内使用方式：  :placeholder="$t('login.password')"
 * js内使用方式     this.$t('login.user.password.not.match')
 * */
export default {
  system:{
    title: '全球岸基监控系统',
    title2: '海洋装备岸基监控系统',
    title_flux: '碳通量监测平台岸基监控系统',
    title_glider: '波浪滑翔机岸基监控系统',
    home_page: '首页',

    lng: '经度',
    lat: '纬度',

    lng1: '经度',
    lat1: '纬度',

    status: '状态',

    normal: '正常',
    abnormal: '异常',

    true: '是',
    false: '否',

    add: '新增',
    edit: '修改',
    delete: '删除',
    back: '返回',

    operate: '操作',
    more: '更多',

    createTime: '创建时间',

    order: '序号',

    cancel: '取消',
    confirm: '确定',
    pleaseEnter: '请输入',
    pleaseSelect: '请选择',

    search: '搜索',
    reset: '重置',

    statusNormal: '正常',
    statusStop: '停用',

    success: '成功',
    fail: '失败',
    none: '无',

    time: {
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分钟',
      second: '秒'
    },
    week:{
      Monday: '周一',
      Tuesday: '周二',
      Wednesday: '周三',
      Thursday: '周四',
      Friday: '周五',
      Saturday: '周六',
      Sunday: '周日',
    },
    meter: '米'
  },
  // 登录界面
  login: {
    title: '用户登录',
    logIn: '登录',
    loggingIn: '登录中...',
    username: '账号',
    password: '密码',
    code: '验证码',
    rememberMe: '记住密码',
    forgetPwd: '忘记密码？点击这里',
    rule_username: '请输入您的账号',
    rule_password: '请输入您的密码',
    rule_code: '请输入验证码',
  },

  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  navbar:{
    userCenter: '个人中心',
    layout: '布局设置',
    logout: '退出登录',
    logoutTipsContent: '确定注销并退出系统吗？',
    logoutTipsTitle: '提示',
  },
  rightToolBar:{
    showSearch: '显示搜索',
    hiddenSearch: '隐藏搜索',
    refresh: '刷新',
    hiddenColumns: '显隐列',
  },
  promptBox:{
    warning: '警告',
  },
  prompt:{

  },

  // 三种地图共有
  map:{
    card:{
      lng: '经度',
      lat: '纬度',
      lng2: '经度（度分）',
      lat2: '纬度（度分）',
      current: '当前位置时间',
      operate: '操控',
      track: {
        open: '显示轨迹',
        close: '关闭轨迹',
      },
      command: '发送指令',
      command_title: '指令发送',
      deviceStatus: '设备状态',
      deviceStatus_title: '设备状态',
      aisInfo: 'AIS信息',
      proxyAis: '船讯网AIS',
      navigation: '导航规划',
      export: '数据导出',
    },
    navigation:{
      title: '导航规划',
      location: '当前位置',
      send: '发送',
      cmd: '指令',
      order: '序号',
      lng: '经度',
      lat: '纬度',
      operate: '操作',
      remove: '移除',
      autoCruise:{
        label: '自动巡航',
        title: '自动巡航',
        tips: '请选择并设置巡航方案',
        cruise1:{
          label: '边缘巡航',
          title: '边缘巡航',
          illustrate: '示例',
          startPoint:{
            label: '起始点经纬度',
            lng: '经度',
            lat: '纬度',
          },
          margin: '边距(m)',
          tip1: '边距m',
          waypoints: '航路点数目',
          tip2: '1~10',
        },
        cruise2:{
          label: '中心点巡航',
          title: '中心点巡航',
          illustrate: '示例',
          centerPoint:{
            label: '中心点经纬度',
            lng: '经度',
            lat: '纬度',
          },
          centerDistance: '中心距离(m)',
          tip1: '距离m',
          pointCount: '航路点数目',
          tip2: '1~10'
        },
        cruise: '规划',
        submit: '提交',
      }
    },
    overview:{
      total: '总设备',
      normal: '正常',
      abnormal: '回传异常',
    },
    sort:{
      tips: '设备搜索',
    },
    mapSwitch:{
      label: '地图切换',
      gaodeMap:'高德地图',
      olmap:'私有地图',
      windyMap:'Windy地图',
      seaMap:'电子海图',
    },
    deviceMultiSelect:{
      label: '多选设备',
      title: '设备多选工具',
      tips: '点击地图上的设备进行选择',
      order: '序号',
      deviceId: '设备ID',
      operate: '操作',
      remove: '移除',
      noData: '暂无数据',
      multiTrack:{
        open: '显示多轨迹',
        title: '选择查询范围',
        startTime: '起始时间',
        endTime: '结束时间',
        tip1: '请选择开始时间',
        tip2: '请选择结束时间',
        close: '关闭多轨迹',
      },
      formationCruise:{
        label: '编队巡航',
        title: '编队巡航',
        tips: '请选择并设置巡航方案',
        cruise1:{
          label: '边缘巡航',
          title: '边缘巡航',
          illustrate: '示例',
          rows: '行数',
          columns: '列数',
          horizontalSpacing: '横向间距(m)',
          tip1: '间距m',
          verticalSpacing: '纵向间距(m)',
          tip2: '间距m',
          startPoint:{
            label: '起始点经纬度',
            lng: '经度',
            lat: '纬度',
          },
          margin: '各设备边距',
          tip3: '边距m',
          waypoints: '各设备航路点',
          tip4: '1~10',
        },
        cruise2:{
          label: '中心点巡航',
          title: '中心点巡航',
          illustrate: '示例',
          centerPoint:{
            label: '中心点经纬度',
            lng: '经度',
            lat: '纬度',
          },
          centerDistance: '中心距离(m)',
          tip1: '距离m',
          pointCount: '航路点数目',
          tip2: '1~10',
          targetDistance: '目标距离(m)',
          tip3: '距离m',
          targetCount: '目标点数目',
          tip4: '1~10',
        },
        cruise: '规划',
        submit: '提交',
      }
    },
    areaManage:{
      label: '围栏管理',
      title: '电子围栏管理',
      add: '新增',
      order: '序号',
      areaName: '区域名',
      show: '是否显示',
      operate: '操作',
      true: '是',
      false: '否',
      edit: '编辑',
      delete: '删除',
      handle:{
        add: '围栏新增',
        edit: '围栏编辑',
        tips: '点击地图以添加区域顶点',
        areaName: '区域名称',
        tip1: '请输入名称',
        show: '是否显示',
        save: '保存',
        circle: '圆形',
        order: '序号',
        lng: '经度',
        lat: '纬度',
        operate: '操作',
        remove: '移除'
      }
    },
    distanceMeasure:{
      open: '打开测距',
      close: '关闭测距',
    },
    coordinatePick:{
      open: '坐标拾取',
      close: '关闭拾取',
    },
    deviceLabel:{
      display: '显示标签',
      hidden: '隐藏标签',
    }
  },
  olmap: {

  },
  gaodeMap:{

  },
  windyMap:{

  },

  deviceInfo:{
    search:{
      deviceId: '设备ID',
      tip1: '请输入设备ID',
      deviceName: '设备名称',
      tip2: '请输入设备名称',
      commCode: '通信号码',
      tip3: '请输入通信号码',
      deviceType: '设备类型',
    },
    table:{
      deviceId: '设备ID',
      deviceName: '设备名称',
      deviceType: '设备种类',
      deviceModel: '设备型号',
      icon: '使用图标',
      commWays: '通信方式',
      startTime: '下水时间',
      deviceStatus: '设备状态',
      show: '可见状态',
      alarm: '是否报警',
      deactivate: '是否停用',
      operate: {
        bandingMessage: '绑定协议',
        commConfig: '通信配置',
        more: '更多',
        bandingAlarm: '绑定报警',
        alarmContent: '报警内容',
      },
      ext: '备注',
      status:{
        normal: '正常',
        offline: '离线',
        fault: '故障',
        using: '使用中',
        deactivate: '已停用'
      }
    },
    form:{
      deviceName: '设备名称',
      deviceId: '设备ID',
      belong: '所属',
    },
    bandingMessage:{
      msgName: '协议名称',
      byteSize: '字节长度',
      isParse: '已解析',
      msgVersion: '协议版本',
      isCopyMsg: '是否为重复协议',
      operate:{
        label: '操作',
        detail: '查看详情'
      },
      addBanding:{
        title: '新增绑定关系',
        bandingMsg: '绑定协议',
        tips: '请选择协议',
        mainMsg: '是否为主协议',
        byteSize: '字节长度',
      }
    },
    commConfig:{
      order: '序号',
      commWays: '通信方式',
      commCode: '通信号码',
      addAndEdit:{
        addTitle: '新增通信方式',
        editTitle: '修改通信方式',
        tip1: '请选择',
        tip2: '请输入通信号码',
        rule1: '通信方式不能为空',
        rule2: '通信号码不能为空',
        rule3: '长度必须介于 2 和 20 之间',
      }
    },
    bandingAlarm:{
      description: '报警规则描述',
      ruleDetail: '规则详情',
      addAndEdit:{
        addTitle: '新增报警规则',
        editTitle: '修改报警规则',
        step1: '选择协议项',
        step2: '制定报警规则',
        status1: '进行中',
        status2: '未完成',
        status3: '已完成',
        msg: '协议',
        tip1: '请选择',
        msgItem: '协议项',
        rule:{
          tips: '请填写规则描述',
          abnormalRange: '异常值范围',
          min: '最小值',
          max: '最大值',
          trigger: '触发次数',
          dataNoChange: '连续几组数据不变',
          repeat: '重复次数',
          selectOrInput: '选择已有区域或输入经纬度',
          switchAreaSelect: '切换到区域选择',
          lng: '经度',
          lat: '纬度',
          radius: '半径',
          switchCoorInput: '切换到经纬度输入',
          selectArea: '选择已有区域',
          noArea: '无区域数据',
          inputCenterAndRadius: '手动输入中心点及半径',
          overtimeNoData: '超出多少分钟无数据回传',
          overtime: '超时时间',
          centerAndRadius: '中心点及半径',
        }
      }
    },
    alarmContent: {
      alarmInfo: '报警信息',
      alarmTime: '报警时间',
      deal: '是否处理',
      dealTime: '处理时间',
      option: '报警意见',
      deal_no: '未处理',
      deal_yes: '已处理',
      tip1: '请选择是否处理',
      tip2: '选择开始时间',
      tip3: '选择结束时间',
      handle: '处理',
      handleAlarm:{
        title: '处理报警信息',
        option: '报警意见',
        tips: '请输入报警意见'
      }
    },
    addAndEdit:{
      addTitle: '新增设备',
      editTitle: '修改设备',
      deviceId: '设备ID',
      deviceModel: '设备型号',
      deviceIcon: '设备图标',
      deviceName: '设备名称',
      belong: '所属单位',
      yx: '铱星号码',
      bd2: '北二号码',
      bd3: '北三号码',
      tt: '天通号码',
      startTime: '下水时间',
      show: '可见状态',
      ext: '备注',
      tip1: '请输入自定义设备ID',
      tip2: '请先选择设备型号，自动加载对应图标',
      tip3: '请输入设备名称',
      tip4: '请输入设备铱星号码',
      tip5: '请输入设备北二号码',
      tip6: '请输入设备北三号码',
      tip7: '请输入设备天通号码',
      tip8: '请选择时间',
      tip9: '请输入备注',
      tip10: '自定义设备ID需为数字整数',
      tip11: '请选择设备型号',
      tip12: '请选择设备所属单位',
      tip13: '设备至少添加一种通讯方式',
    }
  },
  alarmAccount:{
    contact: '报警联系信息',
    tips: '请输入报警邮箱号或者手机号',
    person: '报警所属人',
    addAndEdit:{
      add: '新增报警联系信息',
      edit: '修改报警联系信息',
      contactWay: '联系方式',
      mail: '邮箱',
      phone: '电话',
      alarmMail: '报警邮箱',
      tip1: '请输入报警邮箱',
      alarmPhone: '报警电话',
      tip2: '请输入报警电话',
      rule1: '请输入异常通知邮箱地址',
      rule2: '请输入正确的邮箱地址',
      rule3: '请输入异常通知手机号码',
      rule4: '请输入正确的手机号码',
    }
  },
  messageInfo:{
    search:{
      msgName: '协议名称',
      tip1: '请输入协议名称',
      byteSize: '协议长度',
      tip2: '请输入协议长度',
      parse: '解析',
      tip3: '请选择是否解析',
      isParse: '已解析',
      notParse: '未解析',
    },
    button:{
      export: '导出为Excel',
      common: '普通协议',
      multiBelong: '多所属协议',
    },
    table:{
      msgName: '协议名称',
      msgVersion: '协议版本',
      isParse: '已解析',
      byteSize: '字节长度',
      msgStatus: '协议状态',
      isCopyMsg: '重复报文',
      operate:{
        detail: '查看详情',
        belong: '所属',
        order: '解析顺序',
        code: '英文名',
        name: '中文名',
        describe: '描述',
        size: '长度',
        dataType: '数据类型',
        start: '起始位置',
        exportOrder: '导出顺序',
        precision: '精度',
        unit: '单位',
        isExport: '是否导出',
      },
      banding:{
        label: '绑定设备ID',
        detail: '查看详情',
        belong: '所属单位',
        order: '顺序',
        deviceId: '设备ID',
        deviceName: '设备名称',
        deviceType: '设备种类及型号',
      }
    },
    repeat:{
      start: '重复协议起始位置',
      size: '重复数据长度',
      count: '重复次数',
      none: '无'
    },
    addAndEdit:{
      add: '新增协议',
      edit: '修改协议信息',
      addStep1: '填写协议信息',
      addStep2: '填写协议项',
      editStep1: '修改协议信息',
      editStep2: '修改协议项',
      status1: '进行中',
      status2: '未完成',
      status3: '已完成',
      msgName: '协议名称',
      msgVersion: '协议版本',
      isParse: '已解析',
      notParse: '未解析',
      byteSize: '字节长度',
      msgStatus: '协议状态',
      belong: '所属',
      tip1: '请输入协议名称',
      tip2: '请输入协议长度',
      tip3: '请输入邮件附件真实字节长度',
      versionOption: '0.0（所属可多选）',
      item: {
        addTitle: '新增协议项',
        editTitle: '修改协议项',
        model: '协议模板',
        repeat: '重复报文',
        start: '重复协议起始位置',
        size: '重复数据长度',
        count: '重复次数',
        tips: '（上下拖动调整*协议解析*顺序）',
        add: '首行新增协议项',
        parseModel: '解析模板',
        selectFile: '选择文件',
        notSelect: '未选择文件',
        export: '导出为Excel',
        table:{
          order: '解析顺序',
          code: '英文名',
          name: '中文名',
          describe: '描述',
          size: '协议长度',
          dataType: '数据类型',
          tip1: '请选择数据类型',
          start: '起始位置',
          exportOrder: '导出顺序',
          precision: '精度',
          unit: '单位',
          isExport: '是否导出',
        },
        operate:{
          add: '新增协议项',
          delete: '删除协议项',
        }
      }
    }
  },
  parseMail:{
    search:{
      mailServer: '邮箱服务器',
      tip1: '请输入邮箱服务器',
      mailBox: '收件箱名称',
      tip2: '请输入收件箱名称',
      mail: '邮箱号',
      tip3: '请输入邮箱号',
    },
    button: {
      reParse: '邮箱重解析'
    },
    table: {
      mail: '邮箱号',
      mailBox: '收件箱名称',
      mailServer: '邮箱服务器',
      protocol: '协议'
    },
    addAndEdit: {
      add: '新增邮箱',
      edit: '修改邮箱',
      mail: '邮箱号',
      tip1: '请输入邮箱号',
      mailBox: '收件箱名称',
      tip2: '请输入收件箱名称',
      mailServer: '邮箱服务器',
      tip3: '请输入邮箱服务器',
      access: '授权码',
      tip4: '请输入授权码',
      protocol: '协议',
      rule1: '请输入邮箱号',
      rule2: '请输入正确的邮箱地址',
      rule3: '请输入收件箱名称',
      rule4: '请输入邮箱服务器',
      rule5: '请输入授权码',
      rule6: '请输入设备协议',
    },
    reParse: {
      title: '邮箱重新解析',
      startTime: '开始时间',
      tip1: '请选择开始时间',
      endTime: '结束时间',
      tip2: '请选择结束时间',
      imel: '铱星号码',
      tip3: '请输入铱星号',
    }
  },
  parseBeidou:{
    search:{
      ip: 'IP',
      tip1: '请输入IP',
      port: '端口',
      tip2: '请输入端口号',
      mail: '异常通知邮箱',
      tip3: '请输入异常通知邮箱',
    },
    table: {
      ip: 'IP',
      port: '端口',
      mail: '异常通知邮箱',
      receiveWay: '接收方式',
      messageInfo: '消息信息',
      interval: '消息间隔',
      status: '状态'
    },
    addAndEdit: {
      add: '新增北斗信息',
      edit: '修改北斗信息',
      ip: 'IP',
      tip1: '请输入IP',
      port: '端口',
      tip2: '请输入IP',
      mail: '异常通知邮箱',
      tip3: '请输入IP',
      loginInfo: '登录信息',
      tip4: '请输入登录所需信息',
      receiveWay: '接收方式',
      tip5: '请选择接收方式',
      messageInfo: '消息信息',
      tip6: '请输入消息信息',
      interval: '消息间隔(分钟)',
      tip7: '请输入消息间隔(分钟)',
      status: '状态',
      rule1: '请输入正确的邮箱地址',
      rule2: '消息间隔需为数字整数',
    }
  },
  deviceManage:{
    search:{
      typeName: '种类名称',
      tip1: '请输入设备种类名称',
      createTime: '创建时间',
      startTime: '开始时间',
      endTime: '结束时间',
    },
    button: {
      addType: '新增种类',
      addModel: '新增型号',
    },
    table:{
      deviceType: '设备种类',
      deviceModel: '设备型号',
      canDel: '能否删除',
      createTime: '创建时间',
      createBy: '创建人',
      includeModel: '下属型号',
      useIcon: '使用图标',
    },
    addAndEdit:{
      addType: '新增设备种类',
      editType: '修改设备种类',
      addModel: '新增设备型号',
      editModel: '修改设备型号',
      iconType: '图标类型',
      deviceModel: '设备型号',
      tip1: '请输入设备型号',
      rule1: '设备种类名称不能为空',
      rule2: '设备型号不能为空',
      rule3: '长度必须介于 2 和 20 之间',
    }
  },
  command:{
    top: {
      deviceId: '设备ID',
      customCmd: '自定义指令',
      taskManage: '定时任务管理',
      globalCmd: '全局指令',
    },
    updateCmd: '更新指令',
    send: '发送',
    sensorConfig:{
      label: '传感器配置',
      p1_up: '传感器系统P1上电',
      p1_down: '传感器系统P1断电',
      p2_up: '北斗P2上电',
      p2_down: '北斗P2断电',
      p3_up: '导航P3上电',
      p3_down: '导航P3断电',
      power1_up: '端口Power1上电',
      power1_down: '端口Power1断电',
      power2_up: '端口Power2上电',
      power2_down: '端口Power2断电',
      power3_up: '端口Power3上电',
      power3_down: '端口Power3断电',
      power4_up: '端口Power4上电',
      power4_down: '端口Power4断电',
      power5_up: '端口Power5上电',
      power5_down: '端口Power5断电',
    },
    navigateConfig:{
      label: '导航配置',
      fixed_heading: '固定航向',
      value: '取值',
      default_status: '默认状态',
      integer: '整数',
      fixed_rudder_angle: '固定舵角',
      anchoring_radius: '锚定半径',
      error_circle_radius: '误差圆半径',
      rotation_distance: '锚泊正反转及距离',
      clock: '顺时针',
      antiClock: '逆时针',
      tail_rudder_error: '尾舵安装误差',
      interval_beacon: '信标机回传间隔',
    },
    commConfig: {
      label: '通讯配置',
      interval_9602: '铱星9602回传间隔',
      interval_bd: '北斗通信间隔',
    },
    systemConfig: {
      label: '系统配置',
      restart: '系统重启',
      storage_start: '存储开始',
      storage_end: '存储结束',
      power_up: '下位机电源使能',
      power_down: '下位机电源关闭'
    },
    cmdConfirm: {
      label: '指令确认',
      table: {
        cmdName: '指令名称',
        cmdContent: '指令内容'
      },
      multiSend:{
        label: '多设备发送',
        title: '多设备指令发送',
        deviceId: '设备ID'
      },
      taskSend: {
        label: '定时发送',
        title: '定时任务设置',
        taskName: '任务名'
      },
      execute: '立即执行'
    },
    cmdHistory:{
      label: '历史指令',
      button: {
        all: '所有设备历史指令',
        current: '当前设备历史指令',
      },
      table: {
        date: '日期',
        deviceId: '设备ID',
        cmdType: '指令类型',
        basicCmd: '基础',
        customCmd: '自定义',
        cmdName: '指令名称',
        cmdContent: '指令内容',
        status: '状态',
        sendAgain: '再次发送'
      }
    },
    customCmd: {
      table:{
        order: '序号',
        cmdName: '指令名称',
        cmdType: '指令类型',
        operateCode: '操作码',
        param: '参数',
        tip1: '描述',
        tip2: '创建时间',
        tip3: '创建人',
      },
      addAndEdit:{
        add: '新增指令',
        addTitle: '添加指令',
        editTitle: '修改指令',
        cmdName: '指令名',
        describe: '描述',
        cmdType: '指令类型',
        operateCode: '操作码',
        paramNum: '参数个数',
        tip1: '请输入指令名称',
        tip2: '请输入相关描述',
        tip3: '请输入指令类型',
        tip4: '请输入操作码',
        rule1: '指令名不能为空',
        rule2: '指令类型不能为空',
        rule3: '操作符不能为空',
        rule4: '参数个数不能为空',
      }
    },
    taskManage: {
      add:{
        label: '新增任务',
        title: '添加定时任务',
        taskName: '任务名称',
        taskType: '任务类型',
        schedule: '定时任务',
        recur: '循环任务',
        interval: '发送间隔',
        sendTime: '发送时间',
        tip1: '请输入任务名称',
        tip2: '请输入发送间隔',
        tip3: '请选择发送时间',
        rule1: '任务名不能为空',
      },
      table:{
        taskName: '任务名称',
        cmdList: '指令列表',
        deviceId: '设备ID',
        cmdName: '指令名称',
        cmdContent: '指令内容',
        taskStatus: '任务状态',
        status1: '正在执行',
        status2: '已取消',
        status3: '已完成',
        sendTime: '发送时间',
        cancelTask: '取消任务'
      },
      history: {
        label: '历史任务',
        title: '历史任务',
        taskName: '任务名称',
        cmdList: '指令列表',
        deviceId: '设备ID',
        cmdName: '指令名称',
        cmdContent: '指令内容',
        taskStatus: '任务状态',
        status1: '正在执行',
        status2: '已取消',
        status3: '已完成',
        sendTime: '发送时间',
      },
      globalCmd: {
        cmdName: '指令名称',
        cmdType: '指令类型',
        param: '参数',
      }
    }
  },
  deviceDetails:{
    top: {
      deviceId: '设备ID',
      tip1: '请选择开始时间',
      tip2: '请选择结束时间',
      tip3: '请选择信息进行查询',
      query: '查询',
      export: 'Excel导出',
      moreDraw: '更多出图',
      imageReturn: '图像回传',
      report: '海试报告',
      bd3Image: '北三出图',
      lofar: 'Lofar图',
      powerCheck: '能量检测图',
    },
    chart: {
      navigate_status:{
        title: '导航状态',
        avg_heading_diff: '平均航向差',
        heading_diff_cep80: '航向偏差CEP80',
        expect_heading: '期望航向',
        tractor_heading: '牵引机航向',
        ship_heading: '母船航向',
      },
      power_status:{
        title: '动力状态',
        avg_apparent_speed: '平均表观速度',
        avg_effect_speed: '平均有效速度',
        avg_wave_height_1_3: '平均1/3波高',
        apparent_speed: '表观速度',
        effect_speed: '有效速度',
        wave_height_1_3: '1/3波高',
      },
      endurance_status:{
        title: '续航状态',
        ground_range: '对地航程',
        effect_track_range: '有效轨迹航程',
      },
      drag_status:{
        title: '牵引状态',
        avg_pitch: '平均俯仰',
        avg_roll: '平均横滚',
        pitch_probability: '俯仰-10±5°概率',
        pitch: '俯仰',
        roll: '横滚',
      },
      ship_status:{
        title: '浮船状态',
        avg_pitch: '平均俯仰',
        avg_roll: '平均横滚',
        pitch: '俯仰',
        roll: '横滚',
      },
      energy_status:{
        title: '电压状态',
        current_voltage: '当前电压',
        voltage: '电压',
      },
      propeller_status:{
        title: '螺旋桨转速',
        current_speed: '当前转速',
        speed: '螺旋桨转速',
      },
      humidity_status:{
        title: '湿度状态',
        current_humidity: '当前湿度',
        humidity: '湿度',
      },
      twist_status:{
        title: '扭转圈数',
        current_twist_angle: '当前扭转角度',
        current_twist_number: '当前扭转圈数',
        twist_angle: '扭转角度',
      }
    },
    moreDraw: {
      top: {
        deviceId: '设备ID',
        tip1: '请选择开始时间',
        tip2: '请选择结束时间',
        msg: '协议',
        msgItem: '协议项',
      },
      value: '值'
    },
    imageReturn: {
      top: {
        deviceId: '设备ID',
        tip1: '请选择开始时间',
        tip2: '请选择结束时间',
        query: '查询',
      },
    },
    report: {
      top: {
        deviceId: '设备ID',
        tip1: '请选择开始时间',
        tip2: '请选择结束时间',
      },
    },
  },
  faultDetect:{
    top: {
      deviceId: '设备ID',
      returnInterval: '回传间隔',
      faultDetect: '故障诊断',
      tip1: '请选择开始时间',
      tip2: '请选择结束时间'
    },
    status: {
      normal: '正常',
      abnormal: '报警',
      invalid: '无效'
    },
    chart:{
      title: '故障诊断模块',
      tip1: '请选择信息进行查询',
      tip2: '正在诊断，请稍后...'
    },
    pose_detection: {
      label: '姿态检测',
      tractor_pitch: '牵引机俯仰',
      tractor_roll: '牵引机横滚',
      ship_pitch: '母船俯仰',
      ship_roll: '母船横滚',
    },
    armored_cable: {
      label: '铠装缆',
      twist_number: '扭转圈数',
      communication: '上下位机通信',
    },
    navi_system: {
      label: '导航系统',
      speed: '速度',
      position: '定位',
      heading_deviation: '航向偏差',
      rudder_deviation: '尾舵跟踪偏差',
      expect_steer: '期望打舵',
    },
    control_system: {
      label: '控制系统',
      voltage: '电压',
      data_callback: '数据回传',
      cabin_humidity: '舱内湿度',
      charge_voltage_diff: '充电电压差',
    },
    comm_system:{
      label: '通信系统',
      iridium_comm: '铱星通信成功率',
      beacon_comm: '信标通信成功率',
      bd3_comm: '北三通信成功率',
      tt_comm: '天通通信成功率',
    },
    load_system:{
      label: '载荷系统',
      weather_station_wind_speed: '气象站风速',
      effective_wave_height: '有效波高',
      water_temperature: '水温',
      drag_pitch: '拖体俯仰',
      drag_roll: '拖体横滚',
    }
  },
  systemManage:{
    user:{
      search:{
        tip1: '请输入组织名称',
        username: '用户名称',
        phone: '手机号码',
        tip2: '请输入用户名称',
        tip3: '请输入手机号码',
        tip4: '用户状态',
        tip5: '开始日期',
        tip6: '结束日期',
      },
      table: {
        username: '用户名称',
        nickname: '用户昵称',
        organization: '组织',
        phone: '手机号码',
        more: '更多',
      },
      addAndEdit: {
        addTitle: '添加用户',
        editTitle: '修改用户',
        nickname: '用户昵称',
        organization: '归属组织',
        phone: '手机号码',
        email: '邮箱',
        username: '用户名称',
        password: '用户密码',
        sex: '用户性别',
        role: '角色',
        tenant: '租户',
        homeLogo: '主页标志',
      },
      resetPwd: {
        label: '重置密码',
        title: '提示',
        tip1: '请输入',
        tip2: '新密码',
        tip3: '用户密码长度必须介于 5 和 20 之间',
      },
      form:{
        basicInfo: '基本信息',
        nickname: '用户昵称',
        loginAccount: '登录账号',
        submit: '提交',
        back: '返回'
      },
      assignRoles:{
        label: '分配角色',
        roleInfo: '角色信息',
        order: '序号',
        roleId: '角色编号',
        roleName: '角色名称',
        permission_character: '权限字符',
      },
      associatedDevice:{
        label: '用户所属设备',
        deviceInfo: '设备信息',
        deviceId: '设备ID',
        deviceName: '设备名称',
        deviceType: '设备种类',
        deviceModel: '设备型号',
        icon: '使用图标',
        commWay: '通讯方式',
        createTime: '下水时间',
        deviceStatus: '设备状态'
      }
    },
    role: {
      search: {
        roleName: '角色名称',
        permission_character: '权限字符',
        tip1: '角色状态',
        tip2: '开始日期',
        tip3: '结束日期',
      },
      table: {
        roleName: '角色名称',
        permission_character: '权限字符',
        showOrder: '显示顺序',
      },
      addAndEdit:{
        addTitle: '添加角色',
        editTitle: '修改角色',
        roleName: '角色名称',
        permission_character: '权限字符',
        showOrder: '显示顺序',
        tenant: '租户',
        menu_permission: '',
        expandOrCollapse: '展开/折叠',
        selectAllOrDeselectAll: '全选/全不选',
        cascade: '父子联动',
        remark: '备注'
      },
      dataPermission:{
        label: '数据权限',
        title: '分配数据权限',
        roleName: '角色名称',
        permission_character: '权限字符',
        permission_range: '权限范围',
        range:{
          all: '全部数据权限',
          custom: '自定数据权限',
          selfOrg: '本组织数据权限',
          selfOrgAndOwn: '本组织及以下数据权限',
          self: '仅本人数据权限'
        }
      },
      assignUsers:{
        label: '分配用户',
        search: {
          username: '用户名称',
          phone: '手机号码'
        },
        button: {
          add: '添加用户',
          deleteBatch: '批量取消授权',
          close: '关闭',
          delete: '取消授权'
        },
        table:{
          username: '用户名称',
          nickname: '用户昵称',
          email: '邮箱',
          phone: '手机号码',
        },
        addUser:{
          title: '选择用户'
        }
      }
    },
    menu: {
      search:{
        menuName: '菜单名称',
        menuStatus: '菜单状态'
      },
      button:{
        expandOrCollapse: '展开/折叠',
      },
      table:{
        menuName: '菜单名称',
        icon: '图标',
        order: '排序',
        permission_identifier: '权限标识',
        component_path: '组件路径',
      },
      addAndEdit:{
        addTitle: '添加菜单',
        parentMenu: '上级菜单',
        mainMenu: '主类目',
        menuType: '菜单类型',
        list: '目录',
        menu: '菜单',
        button: '按钮',
        menuIcon: '菜单图标',
        tip: '点击选择图标',
        menuName: '菜单名称',
        displayOrder: '显示排序',
        outerLink: '是否外链',
        routeUrl: '路由地址',
        displayStatus: '显示状态',
        menuStatus: '菜单状态',
        component_path: '组件路径',
        permission_identifier: '权限标识',
        routeParam: '路由参数',
        cacheStatus: '是否缓存',
        cache: '缓存',
        noCache: '不缓存'
      }
    },
    tenant: {
      tenantName: '租户名称',
      remark: '备注',
      addTitle: '新增租户信息',
      editTitle: '修改租户信息'
    },
    organization:{
      search:{
        orgName: '组织名称',
        orgStatus: '组织状态',
      },
      button:{
        expandOrCollapse: '展开/折叠',
      },
      table: {
        orgName: '组织名称',
        order: '排序',
        manager: '负责人',
        phone: '联系电话',
        email: '邮箱',
      },
      addAndEdit: {
        parentOrg: '上级组织',
        orgName: '组织名称',
        order: '显示排序',
        manager: '负责人',
        phone: '联系电话',
        email: '邮箱',
        orgStatus: '组织状态',
        rule1: '上级组织不能为空',
        rule2: '组织名称不能为空',
        rule3: '显示排序不能为空',
        rule4: '请输入正确的邮箱地址',
        rule5: '请输入正确的手机号码',
      }
    },
    dict:{
      search: {
        dictName: '字典名称',
        dictType: '字典类型',
        dictStatus: '字典状态',
        tip1: '开始日期',
        tip2: '结束日期'
      },
      button:{
        refresh: '刷新缓存'
      },
      table:{
        dictId: '字典编号',
        dictName: '字典名称',
        dictType: '字典类型',
        remark: '备注'
      },
      addAndEdit:{
        addTitle: '添加字典类型',
        editTitle: '修改字典类型',
      },
      data:{
        search:{
          dictName: '字典名称',
          dictTag: '字典标签',
          dataStatus: '数据状态',
        },
        button:{
          close: '关闭'
        },
        table:{
          dictId: '字典编码',
          dictTag: '字典标签',
          dictKeyValue: '字典键值',
          dictOrder: '字典排序',
          remark: '备注',
        },
        addAndEdit:{
          dictType: '字典类型',
          dataTag: '数据标签',
          dataKeyValue: '数据键值',
          styleCss: '样式属性',
          order: '显示排序',
          displayType: '回显样式',
          remark: '备注'
        }
      }
    }
  },
  systemMonitor:{

  },

  otherConfig:{
    // 通讯配置等其他的配置翻译
    commWayConfig:{
      yx: '铱星',
      bd2: '北二',
      bd3: '北三',
      tt: '天通',
      unknown: '未知'
    },
    iconConfig:{
      gliderSv1: '波浪滑翔机SV1型图标',
      gliderSv2: '波浪滑翔机SV2型图标',
      gliderSv3: '波浪滑翔机SV3型图标',
      beaconDefault: '信标机默认型图标',
      buoyDefault: '浮标默认型图标',
    },
    commandConfig:{
      sensor_enable: '传感器系统P1上电',
      sensor_unable: '传感器系统P1断电',
      beidou_enable: '北斗P2上电',
      beidou_unable: '北斗P2断电',
      navigation_enable: '导航P3上电',
      navigation_unable: '导航P3断电',
      port_1_enable: '端口Power1上电',
      port_1_unable: '端口Power1断电',
      port_2_enable: '端口Power2上电',
      port_2_unable: '端口Power2断电',
      port_3_enable: '端口Power3上电',
      port_3_unable: '端口Power3断电',
      port_4_enable: '端口Power4上电',
      port_4_unable: '端口Power4断电',
      port_5_enable: '端口Power5上电',
      port_5_unable: '端口Power5断电',

      mbd: '目标点',
      p: '尾舵控制参数P',
      i: '尾舵控制参数I',
      d: '尾舵控制参数D',
      beaconTime:'信标机回传时间',
      angle_fd: '锚定前向距离及参数',
      angle_range: '锚定半径',
      angle_pram: '锚定参数',
      pid_transfer: 'PID控制转换',

      fix_heading: '固定航向',
      fix_angle: '固定舵角',
      deviation: '舵机安装误差',
      radius: '误差圆半径',
      revise_heading: '修正舵角',

      ir9602_interval: '铱星9602回传间隔',
      beidou_interval: '北斗通信间隔',

      electric_enable: '下位机电源使能',
      electric_unable: '下位机电源关闭',
      storage_enable: '存储使能',
      storage_unable: '存储结束',
      soft_ware_reset: '系统重启',
    }
  }

}
