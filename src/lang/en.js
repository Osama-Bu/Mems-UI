/**
 * 普通文本使用方式： {{ $t('login.title') }}
 * 标签内使用方式：  :placeholder="$t('login.password')"
 * js内使用方式     this.$t('login.user.password.not.match')
 * */
export default {
  system:{
    title: 'Global Shore-based Monitoring System',
    title2: 'Marine Equipment Monitoring System',
    title_flux: 'Carbon flux monitoring platform monitoring system',
    title_glider: 'Wave glider monitoring system',
    home_page: 'Home',

    lng: 'longitude',
    lat: 'latitude',

    lng1: 'lng',
    lat1: 'lat',

    status: 'Status',

    normal: 'normal',
    abnormal: 'abnormal',

    true: 'true',
    false: 'false',

    add: 'add',
    edit: 'edit',
    delete: 'delete',
    back: 'back',

    operate: 'Operate',
    more: 'More',

    createTime: 'Create Time',

    order: 'No.',

    cancel: 'cancel',
    confirm: 'confirm',
    pleaseEnter: 'Enter',
    pleaseSelect: 'Select',

    search: 'search',
    reset: 'reset',

    statusNormal: 'Normal',
    statusStop: 'Deactivated',

    success: 'Success',
    fail: 'Fail',
    none: 'None',

    time: {
      year: 'year',
      month: 'month',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second'
    },
    week:{
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday',
    },
    meter: 'meter'
  },

  login: {
    title: 'User login',
    logIn: 'Login in',
    loggingIn: 'Logging in...',
    username: 'Username',
    password: 'Password',
    code: 'Code',
    rememberMe: 'Remember Me',
    forgetPwd: 'Forgot password? Click here',
    rule_username: 'Please enter your account number',
    rule_password: 'Please enter your password',
    rule_code: 'Please enter the verification code',
  },

  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  navbar:{
    userCenter: 'Personal Center',
    layout: 'Layout Settings',
    logout: 'Logout',
    logoutTipsContent: 'Are you sure to log out and exit the system?',
    logoutTipsTitle: 'Tips',
  },
  rightToolBar:{
    showSearch: 'Show Search',
    hiddenSearch: 'Hidden Search',
    refresh: 'Refresh',
    hiddenColumns: 'Hidden Columns',
  },
  promptBox:{
    warning: 'warning',
  },
  prompt:{

  },

  // 三种地图共有
  map:{
    card:{
      lng: 'Longitude',
      lat: 'Latitude',
      lng2: 'Longitude(deg, min)',
      lat2: 'Latitude(deg, min)',
      current: 'Current location and time',
      operate: 'Control',
      track: {
        open: 'Show track',
        close: 'Close track',
      },
      command: 'CmdSend',
      command_title: 'Command Send',
      deviceStatus: 'DevStatus',
      deviceStatus_title: 'Device Status',
      aisInfo: 'AISInfo',
      proxyAis: 'ProxyAIS',
      navigation: 'Nav',
      export: 'Export',
    },
    navigation:{
      title: 'Navigation',
      location: 'Current Location',
      send: 'send',
      cmd: 'cmd',
      order: 'No.',
      lng: 'longitude',
      lat: 'latitude',
      operate: 'operate',
      remove: 'remove',
      autoCruise:{
        label: 'AutoCruise',
        title: 'AutoCruise',
        tips: 'Select & set cruise plan',
        cruise1:{
          label: 'Edge Cruising',
          title: 'Edge Cruising',
          illustrate: 'illustrate',
          startPoint:{
            label: 'StartPoint',
            lng: 'longitude',
            lat: 'latitude',
          },
          margin: 'Margin(m)',
          tip1: 'm',
          waypoints: 'Device Waypoints',
          tip2: '1~10',
        },
        cruise2:{
          label: 'Central-point Cruising',
          title: 'Central-point Cruising',
          illustrate: 'illustrate',
          centerPoint:{
            label: 'CentralPoint',
            lng: 'longitude',
            lat: 'latitude',
          },
          centerDistance: 'Center distance',
          tip1: 'm',
          pointCount: 'Number of waypoints',
          tip2: '1~10'
        },
        cruise: 'cruise',
        submit: 'submit',
      }
    },
    overview:{
      total: 'Total',
      normal: 'Normal',
      abnormal: 'Abnormal',
    },
    sort:{
      tips: 'Device Search',
    },
    mapSwitch:{
      label: 'Map Switching',
      gaodeMap:'GaoDeMap',
      olmap:'GoogleMap',
      windyMap:'WindyMap',
      seaMap:'SeaMap',
    },
    deviceMultiSelect:{
      label: 'Multi-choice device',
      title: 'Multi-device selection tool',
      tips: 'Select device on map',
      order: 'No.',
      deviceId: 'ID',
      operate: 'Operate',
      remove: 'remove',
      noData: 'No Data',
      multiTrack:{
        open: 'Multi-track',
        title: 'Select query range',
        startTime: 'StartTime',
        endTime: 'EndTime',
        tip1: 'Please select the start time',
        tip2: 'Please select the end time',
        close: 'Close track',
      },
      formationCruise:{
        label: 'Cruise',
        title: 'Cruise',
        tips: 'Select & set cruise plan',
        cruise1:{
          label: 'Edge Cruising',
          title: 'Edge Cruising',
          illustrate: 'illustrate',
          rows: 'rows',
          columns: 'columns',
          horizontalSpacing: 'hSpacing',
          tip1: 'm',
          verticalSpacing: 'vSpacing',
          tip2: 'm',
          startPoint:{
            label: 'StartPoint location',
            lng: 'longitude',
            lat: 'latitude',
          },
          margin: 'Device margin',
          tip3: 'm',
          waypoints: 'Device Waypoints',
          tip4: '1~10',
        },
        cruise2:{
          label: 'Central-point Cruising',
          title: 'Central-point Cruising',
          illustrate: 'illustrate',
          centerPoint:{
            label: 'Central-point location',
            lng: 'longitude',
            lat: 'latitude',
          },
          centerDistance: 'Center distance',
          tip1: 'm',
          pointCount: 'number of waypoints',
          tip2: '1~10',
          targetDistance: 'Target distance',
          tip3: 'm',
          targetCount: 'number of target points',
          tip4: '1~10',
        },
        cruise: 'cruise',
        submit: 'submit',
      }
    },
    areaManage:{
      label: 'Fence management',
      title: 'Electronic fence management',
      add: 'add',
      order: 'No.',
      areaName: 'AreaName',
      show: 'show',
      operate: 'operate',
      true: 'true',
      false: 'false',
      edit: 'edit',
      delete: 'delete',
      handle:{
        add: 'fence adding',
        edit: 'fence editing',
        tips: 'Click map to add area vertex',
        areaName: 'AreaName',
        tip1: 'Enter name',
        show: 'show',
        save: 'save',
        circle: 'circle',
        order: 'No.',
        lng: 'longitude',
        lat: 'latitude',
        operate: 'operate',
        remove: 'remove'
      }
    },
    distanceMeasure:{
      open: 'Turn on rangefinder',
      close: 'Turn off rangefinder',
    },
    coordinatePick:{
      open: 'Coordinate Pickup',
      close: 'Disable pickup',
    },
    deviceLabel:{
      display: 'Display label',
      hidden: 'Hidden label',
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
      deviceId: 'Device ID',
      tip1: 'Please enter Device ID',
      deviceName: 'DevName',
      tip2: 'Please enter Device Name',
      commCode: 'CommCode',
      tip3: 'Please enter Comm Code',
      deviceType: 'DevType',
    },
    table:{
      deviceId: 'Device ID',
      deviceName: 'Device Name',
      deviceType: 'Device Category',
      deviceModel: 'Device Model',
      icon: 'Used Icon',
      commWays: 'Communication Way',
      startTime: 'Start Time',
      deviceStatus: 'Status',
      show: 'Visibility',
      alarm: 'Alarm',
      deactivate: 'Deactivation',
      operate: {
        bandingMessage: 'Bind Protocol',
        commConfig: 'Communication Config',
        more: 'More',
        bandingAlarm: 'Bind Alarm',
        alarmContent: 'Alarm Content',
      },
      ext: 'Remarks',
      status:{
        normal: 'normal',
        offline: 'offline',
        fault: 'fault',
        using: 'using',
        deactivate: 'deactivated'
      }
    },
    form:{
      deviceName: 'Device Name',
      deviceId: 'Device ID',
      belong: 'Belongs To',
    },
    bandingMessage:{
      msgName: 'Protocol Name',
      byteSize: 'Byte Length',
      isParse: 'Parsed',
      msgVersion: 'Protocol Version',
      isCopyMsg: 'Duplicate Protocol',
      operate:{
        label: 'Operation',
        detail: 'View Details'
      },
      addBanding:{
        title: 'Add binding relationship',
        bandingMsg: 'Bind Protocol',
        tips: 'Please select the protocol',
        mainMsg: 'Main Protocol',
        byteSize: 'ByteSize',
      }
    },
    commConfig:{
      order: 'No.',
      commWays: 'Communication Ways',
      commCode: 'Communication Code',
      addAndEdit:{
        addTitle: 'Add communication way',
        editTitle: 'Edit communication way',
        tip1: 'Please select',
        tip2: 'Please enter communication code',
        rule1: 'Communication way cannot be empty',
        rule2: 'Communication code cannot be empty',
        rule3: 'Length must be between 2 and 20',
      }
    },
    bandingAlarm:{
      description: 'Alarm Rule Description',
      ruleDetail: 'Rule Details',
      addAndEdit:{
        addTitle: 'Add Alarm Rule',
        editTitle: 'Edit Alarm Rule',
        step1: 'Select Protocol Item',
        step2: 'Set Alarm Rule',
        status1: 'In Progress',
        status2: 'Unfinished',
        status3: 'Completed',
        msg: 'Protocol',
        tip1: 'Please select',
        msgItem: 'Protocol Item',
        rule:{
          tips: 'Please enter rule description',
          abnormalRange: 'Abnormal Value Range',
          min: 'Min Value',
          max: 'Max Value',
          trigger: 'Trigger Times',
          dataNoChange: 'Consecutive unchanged data groups',
          repeat: 'Repeat Times',
          selectOrInput: 'Select area or enter lng/lat',
          switchAreaSelect: 'Switch to Area Select',
          lng: 'Longitude',
          lat: 'Latitude',
          radius: 'Radius',
          switchCoorInput: 'Switch to Lng/Lat Input',
          selectArea: 'Select Existing Area',
          noArea: 'No Area Data',
          inputCenterAndRadius: 'Enter center & radius manually',
          overtimeNoData: 'No data returned for X minutes',
          overtime: 'Timeout Duration',
          centerAndRadius: 'Center & radius manually',
        }
      }
    },
    alarmContent: {
      alarmInfo: 'Alarm Info',
      alarmTime: 'Alarm Time',
      deal: 'Handled Status',
      dealTime: 'Handling Time',
      option: 'Alarm Opinion',
      deal_no: 'Unhandled',
      deal_yes: 'Handled',
      tip1: 'Please choose Handled Status',
      tip2: 'Select start time',
      tip3: 'Select end time',
      handle: 'handle',
      handleAlarm:{
        title: 'Handle alarm information',
        option: 'Alarm option',
        tips: 'Please enter alarm option'
      }
    },
    addAndEdit:{
      addTitle: 'Add Device',
      editTitle: 'Edit Device',
      deviceId: 'Device ID',
      deviceModel: 'Model',
      deviceIcon: 'Icon',
      deviceName: 'Name',
      belong: 'Belong',
      yx: 'Iridium code',
      bd2: 'BD-Ⅱ code',
      bd3: 'BD-Ⅲ code',
      tt: 'Tiant code',
      startTime: 'Start Time',
      show: 'Visibility',
      ext: 'Remarks',
      tip1: 'Enter custom device ID',
      tip2: 'Select model first to load icon',
      tip3: 'Enter device name',
      tip4: 'Enter Iridium code',
      tip5: 'Enter BD-Ⅱ code',
      tip6: 'Enter BD-Ⅲ code',
      tip7: 'Enter Tiantong code',
      tip8: 'Select time',
      tip9: 'Enter remarks',
      tip10: 'Custom ID must be integer',
      tip11: 'Select device model',
      tip12: 'Select affiliation',
      tip13: 'Add at least one communication method',
    }
  },
  alarmAccount:{
    contact: 'Contact',
    tips: 'Enter alarm email or phone',
    person: 'Alarm Owner',
    addAndEdit:{
      add: 'Add Alarm Contact',
      edit: 'Edit Alarm Contact',
      contactWay: 'Contact Way',
      mail: 'Email',
      phone: 'Phone',
      alarmMail: 'Alarm Email',
      tip1: 'Enter alarm email',
      alarmPhone: 'Alarm Phone',
      tip2: 'Enter alarm phone',
      rule1: 'Enter exception notification email',
      rule2: 'Enter valid email',
      rule3: 'Enter exception notification phone',
      rule4: 'Enter valid phone',
    }
  },
  messageInfo:{
    search:{
      msgName: 'Protocol Name',
      tip1: 'Enter Protocol Name',
      byteSize: 'Byte Length',
      tip2: 'Enter Byte Length',
      parse: 'Parsed',
      tip3: 'Please Select Parse Status',
      isParse: 'Parsed',
      notParse: 'UnParsed',
    },
    button:{
      export: 'Export to Excel',
      common: 'Common Protocol',
      multiBelong: 'Multi-Belong Protocol',
    },
    table:{
      msgName: 'Protocol Name',
      msgVersion: 'Protocol Version',
      isParse: 'Parsed',
      byteSize: 'Byte Length',
      msgStatus: 'Status',
      isCopyMsg: 'Duplicate Protocol',
      operate:{
        detail: 'View Details',
        belong: 'Belong',
        order: 'No.',
        code: 'Code',
        name: 'Name',
        describe: 'Description',
        size: 'Size',
        dataType: 'Data Type',
        start: 'Start Position',
        exportOrder: 'Export Order',
        precision: 'Precision',
        unit: 'Unit',
        isExport: 'ExportOrNot',
      },
      banding:{
        label: 'Bind Device ID',
        detail: 'View Details',
        belong: 'Belong',
        order: 'Order',
        deviceId: 'Device ID',
        deviceName: 'Device Name',
        deviceType: 'Device Type & Model',
      }
    },
    repeat:{
      start: 'Repeat the starting position',
      size: 'Repeat data length',
      count: 'Number of repetitions',
      none: 'None'
    },
    addAndEdit:{
      add: 'Add Protocol',
      edit: 'Edit Protocol Info',
      addStep1: 'Fill Protocol Info',
      addStep2: 'Fill Protocol Items',
      editStep1: 'Edit Protocol Info',
      editStep2: 'Edit Protocol Items',
      status1: 'In Progress',
      status2: 'Unfinished',
      status3: 'Completed',
      msgName: 'Name',
      msgVersion: 'Version',
      isParse: 'Parsed',
      notParse: 'Unparsed',
      byteSize: 'ByteSize',
      msgStatus: 'Status',
      belong: 'Belongs To',
      tip1: 'Enter Protocol Name',
      tip2: 'Enter Protocol Length',
      tip3: 'Enter byte length of mail attachment',
      versionOption: '0.0 (Multiple affiliations allowed)',
      item: {
        addTitle: 'Add Protocol Items',
        editTitle: 'Edit Protocol Items',
        model: 'Template',
        repeat: 'Repeat Message',
        start: 'Start Position',
        size: 'Data Length',
        count: 'Count',
        tips: '(Drag to adjust parse order)',
        add: 'Add Item at First Row',
        parseModel: 'Parse Template',
        selectFile: 'Select File',
        notSelect: 'No File Selected',
        export: 'Export to Excel',
        table:{
          order: 'No.',
          code: 'Code',
          name: 'Name',
          describe: 'Description',
          size: 'Length',
          dataType: 'Data Type',
          tip1: 'Please select the data type',
          start: 'Start Position',
          exportOrder: 'Export Order',
          precision: 'Precision',
          unit: 'Unit',
          isExport: 'Exportable',
        },
        operate:{
          add: 'Add Item',
          delete: 'Delete Item',
        }
      }
    }
  },
  parseMail:{
    search:{
      mailServer: 'Mail Server',
      tip1: 'Enter mail server',
      mailBox: 'Inbox Name',
      tip2: 'Enter inbox name',
      mail: 'Email Address',
      tip3: 'Enter email address',
    },
    button: {
      reParse: 'Re-parse Email'
    },
    table: {
      mail: 'Email Address',
      mailBox: 'Inbox Name',
      mailServer: 'Mail Server',
      protocol: 'Protocol'
    },
    addAndEdit: {
      add: 'Add Email',
      edit: 'Edit Email',
      mail: 'Email Address',
      tip1: 'Enter email address',
      mailBox: 'Inbox Name',
      tip2: 'Enter inbox name',
      mailServer: 'Mail Server',
      tip3: 'Enter mail server',
      access: 'Authorization',
      tip4: 'Enter authorization code',
      protocol: 'Protocol',
      rule1: 'Enter email address',
      rule2: 'Enter valid email address',
      rule3: 'Enter inbox name',
      rule4: 'Enter mail server',
      rule5: 'Enter authorization code',
      rule6: 'Enter device protocol',
    },
    reParse: {
      title: 'Re-parse Email',
      startTime: 'Start Time',
      tip1: 'Enter start time',
      endTime: 'End Time',
      tip2: 'Enter end time',
      imel: 'Iridium No.',
      tip3: 'Enter Iridium code',
    }
  },
  parseBeidou:{
    search:{
      ip: 'IP',
      tip1: 'Enter IP',
      port: 'Port',
      tip2: 'Enter port number',
      mail: 'Notification Email',
      tip3: 'Enter notification email',
    },
    table: {
      ip: 'IP',
      port: 'Port',
      mail: 'Exception Notification Email',
      receiveWay: 'Receive Way',
      messageInfo: 'Message Info',
      interval: 'Message Interval',
      status: 'Status'
    },
    addAndEdit: {
      add: 'Add Beidou Info',
      edit: 'Edit Beidou Info',
      ip: 'IP',
      tip1: 'Enter IP',
      port: 'Port',
      tip2: 'Enter port number',
      mail: 'Email',
      tip3: 'Enter exception notification email',
      loginInfo: 'Login Info',
      tip4: 'Enter login information',
      receiveWay: 'Receive Way',
      tip5: 'Select receive way',
      messageInfo: 'Message Info',
      tip6: 'Enter Message Info',
      interval: 'Interval (min)',
      tip7: 'Enter message interval (min)',
      status: 'Status',
      rule1: 'Enter valid email address',
      rule2: 'Message interval must be integer',
    }
  },
  deviceManage:{
    search:{
      typeName: 'Type Name',
      tip1: 'Enter device type name',
      createTime: 'Create Time',
      startTime: 'Start Time',
      endTime: 'End Time',
    },
    button: {
      addType: 'Add Type',
      addModel: 'Add Model',
    },
    table:{
      deviceType: 'Device Type',
      deviceModel: 'Device Model',
      canDel: 'Deletable',
      createTime: 'Create Time',
      createBy: 'Created By',
      includeModel: 'Sub Models',
      useIcon: 'Use Icon',
    },
    addAndEdit:{
      addType: 'Add Device Type',
      editType: 'Edit Device Type',
      addModel: 'Add Device Model',
      editModel: 'Edit Device Model',
      iconType: 'Icon Type',
      deviceModel: 'Device Model',
      tip1: 'Enter device model name',
      rule1: 'Device type name cannot be empty',
      rule2: 'Device model name cannot be empty',
      rule3: 'Length must be between 2 and 20',
    }
  },
  command:{
    top: {
      deviceId: 'Device ID',
      customCmd: 'Custom Command',
      taskManage: 'Task Management',
      globalCmd: 'Global Command',
    },
    updateCmd: 'Update Cmd',
    send: 'Send',
    sensorConfig:{
      label: 'Sensor Config',
      p1_up: 'Sensor P1 Power On',
      p1_down: 'Sensor P1 Power Off',
      p2_up: 'Beidou P2 Power On',
      p2_down: 'Beidou P2 Power Off',
      p3_up: 'Nav P3 Power On',
      p3_down: 'Nav P3 Power Off',
      power1_up: 'Port Power1 On',
      power1_down: 'Port Power1 Off',
      power2_up: 'Port Power2 On',
      power2_down: 'Port Power2 Off',
      power3_up: 'Port Power3 On',
      power3_down: 'Port Power3 Off',
      power4_up: 'Port Power4 On',
      power4_down: 'Port Power4 Off',
      power5_up: 'Port Power5 On',
      power5_down: 'Port Power5 Off',
    },
    navigateConfig:{
      label: 'Navigate Config',
      fixed_heading: 'Fixed Heading',
      value: 'Value',
      default_status: 'Default Status',
      integer: 'Integer',
      fixed_rudder_angle: 'Fixed Rudder Angle',
      anchoring_radius: 'Anchoring Radius',
      error_circle_radius: 'Error Circle Radius',
      rotation_distance: 'Rotation & Distance',
      clock: 'Clockwise',
      antiClock: 'Anticlockwise',
      tail_rudder_error: 'Tail Rudder Offset',
      interval_beacon: 'Beacon Interval',
    },
    commConfig: {
      label: 'Communication Config',
      interval_9602: 'Iridium 9602 Interval',
      interval_bd: 'Beidou Interval',
    },
    systemConfig: {
      label: 'System Config',
      restart: 'System Restart',
      storage_start: 'Start Storage',
      storage_end: 'Stop Storage',
      power_up: 'Slave Power Enable',
      power_down: 'Slave Power Off'
    },
    cmdConfirm: {
      label: 'Command Confirm',
      table: {
        cmdName: 'Command Name',
        cmdContent: 'Command Content'
      },
      multiSend:{
        label: 'Multi-device Send',
        title: 'Send to Multi Devices',
        deviceId: 'Device ID'
      },
      taskSend: {
        label: 'Scheduled Send',
        title: 'Select Scheduled Task',
        taskName: 'Task Name'
      },
      execute: 'Execute Now'
    },
    cmdHistory:{
      label: 'Command History',
      button: {
        all: 'All Command History',
        current: 'Current Command History',
      },
      table: {
        date: 'Date',
        deviceId: 'Device ID',
        cmdType: 'Cmd Type',
        basicCmd: 'Basic',
        customCmd: 'Custom',
        cmdName: 'Cmd Name',
        cmdContent: 'Cmd Content',
        status: 'Status',
        sendAgain: 'Resend'
      }
    },
    customCmd: {
      table:{
        order: 'No.',
        cmdName: 'Cmd Name',
        cmdType: 'Cmd Type',
        operateCode: 'Op Code',
        param: 'Params',
        tip1: 'Description',
        tip2: 'Create Time',
        tip3: 'Created By',
      },
      addAndEdit:{
        add: 'Add Command',
        addTitle: 'Add Command',
        editTitle: 'Edit Command',
        cmdName: 'Command Name',
        describe: 'Description',
        cmdType: 'Command Type',
        operateCode: 'Op Code',
        paramNum: 'Param Count',
        tip1: 'Enter command name',
        tip2: 'Enter description',
        tip3: 'Enter command type',
        tip4: 'Enter op code',
        rule1: 'Command name cannot be empty',
        rule2: 'Command type cannot be empty',
        rule3: 'Op code cannot be empty',
        rule4: 'Param count cannot be empty',
      }
    },
    taskManage: {
      add:{
        label: 'Add Task',
        title: 'Add Scheduled Task',
        taskName: 'Task Name',
        taskType: 'Task Type',
        schedule: 'Scheduled',
        recur: 'Recurring',
        interval: 'Send Interval',
        sendTime: 'Send Time',
        tip1: 'Enter task name',
        tip2: 'Enter send interval',
        tip3: 'Select send time',
        rule1: 'Task name cannot be empty',
      },
      table:{
        taskName: 'Task Name',
        cmdList: 'Command List',
        deviceId: 'Device ID',
        cmdName: 'Command Name',
        cmdContent: 'Command Content',
        taskStatus: 'Task Status',
        status1: 'Running',
        status2: 'Cancelled',
        status3: 'Completed',
        sendTime: 'Send Time',
        cancelTask: 'Cancel Task'
      },
      history: {
        label: 'Task History',
        title: 'Task History',
        taskName: 'Task Name',
        cmdList: 'Command List',
        deviceId: 'Device ID',
        cmdName: 'Command Name',
        cmdContent: 'Command Content',
        taskStatus: 'Task Status',
        status1: 'Running',
        status2: 'Cancelled',
        status3: 'Completed',
        sendTime: 'Send Time',
      },
      globalCmd: {
        cmdName: 'Command Name',
        cmdType: 'Command Type',
        param: 'Params',
      }
    }
  },
  deviceDetails:{
    top: {
      deviceId: 'Device ID',
      tip1: 'Select start time',
      tip2: 'Select end time',
      tip3: 'Select information to query',
      query: 'Query',
      export: 'Export Excel',
      moreDraw: 'More Charts',
      imageReturn: 'Image Return',
      report: 'Sea Trial Report',
      bd3Image: 'BD-3 Chart',
      lofar: 'Lofar Gram',
      powerCheck: 'Power Check Chart',
    },
    chart: {
      navigate_status:{
        title: 'Navigation Status',
        avg_heading_diff: 'Avg Heading Difference',
        heading_diff_cep80: 'Heading Difference CEP80',
        expect_heading: 'Expected Heading',
        tractor_heading: 'Tractor Heading',
        ship_heading: 'Ship Heading',
      },
      power_status:{
        title: 'Power Status',
        avg_apparent_speed: 'Avg Apparent Speed',
        avg_effect_speed: 'Avg Effective Speed',
        avg_wave_height_1_3: 'Avg 1/3 Wave Height',
        apparent_speed: 'Apparent Speed',
        effect_speed: 'Effective Speed',
        wave_height_1_3: '1/3 Wave Height',
      },
      endurance_status:{
        title: 'Endurance Status',
        ground_range: 'Ground Range',
        effect_track_range: 'Effective Track Range',
      },
      drag_status:{
        title: 'Towing Status',
        avg_pitch: 'Avg Pitch',
        avg_roll: 'Avg Roll',
        pitch_probability: 'Pitch -10±5° Probability',
        pitch: 'Pitch',
        roll: 'Roll',
      },
      ship_status:{
        title: 'Buoy Vessel Status',
        avg_pitch: 'Avg Pitch',
        avg_roll: 'Avg Roll',
        pitch: 'Pitch',
        roll: 'Roll',
      },
      energy_status:{
        title: 'Voltage Status',
        current_voltage: 'Current Voltage',
        voltage: 'Voltage',
      },
      propeller_status:{
        title: 'Propeller Speed',
        current_speed: 'Current Speed',
        speed: 'Propeller Speed',
      },
      humidity_status:{
        title: 'Humidity Status',
        current_humidity: 'Current Humidity',
        humidity: 'Humidity',
      },
      twist_status:{
        title: 'Twist Cycles',
        current_twist_angle: 'Current Twist Angle',
        current_twist_number: 'Current Twist Cycles',
        twist_angle: 'Twist Angle',
      }
    },
    moreDraw: {
      top: {
        deviceId: 'Device ID',
        tip1: 'Select start time',
        tip2: 'Select end time',
        msg: 'Protocol',
        msgItem: 'Protocol Item',
      },
      value: 'Value'
    },
    imageReturn: {
      top: {
        deviceId: 'Device ID',
        tip1: 'Select start time',
        tip2: 'Select end time',
        query: 'Query',
      },
    },
    report: {
      top: {
        deviceId: 'Device ID',
        tip1: 'Select start time',
        tip2: 'Select end time',
      },
    },
  },
  faultDetect:{
    top: {
      deviceId: 'Device ID',
      returnInterval: 'Return Interval',
      faultDetect: 'Fault Detection',
      tip1: 'Select Start Time',
      tip2: 'Select End Time'
    },
    status: {
      normal: 'normal',
      abnormal: 'abnormal',
      invalid: 'invalid'
    },
    chart:{
      title: 'Fault Detection Module',
      tip1: 'Select information to query',
      tip2: 'Diagnosing, please wait ..',
    },
    pose_detection: {
      label: 'Pose Detection',
      tractor_pitch: 'Tractor Pitch',
      tractor_roll: 'Tractor Roll',
      ship_pitch: 'Ship Pitch',
      ship_roll: 'Ship Roll',
    },
    armored_cable: {
      label: 'Armored Cable',
      twist_number: 'Twist Cycles',
      communication: 'Master-slave Communication',
    },
    navi_system: {
      label: 'Navigation System',
      speed: 'Speed',
      position: 'Positioning',
      heading_deviation: 'Heading Deviation',
      rudder_deviation: 'Rudder Tracking Deviation',
      expect_steer: 'Expected Steering',
    },
    control_system: {
      label: 'Control System',
      voltage: 'Voltage',
      data_callback: 'Data Return',
      cabin_humidity: 'Cabin Humidity',
      charge_voltage_diff: 'Charging Voltage Difference',
    },
    comm_system:{
      label: 'Communication System',
      iridium_comm: 'Iridium Communication Success Rate',
      beacon_comm: 'Beacon Communication Success Rate',
      bd3_comm: 'BD-3 Communication Success Rate',
      tt_comm: 'Tiantong Communication Success Rate',
    },
    load_system:{
      label: 'Load System',
      weather_station_wind_speed: 'Anemometer Wind Speed',
      effective_wave_height: 'Effective Wave Height',
      water_temperature: 'Water Temperature',
      drag_pitch: 'Towed Body Pitch',
      drag_roll: 'Towed Body Roll',
    }
  },
  systemManage:{
    user:{
      search:{
        tip1: 'Enter organization name',
        username: 'Username',
        phone: 'Phone',
        tip2: 'Enter username',
        tip3: 'Enter phone number',
        tip4: 'User Status',
        tip5: 'Start Date',
        tip6: 'End Date',
      },
      table: {
        username: 'Username',
        nickname: 'User Nickname',
        organization: 'Organization',
        phone: 'Phone',
        more: 'More',
      },
      addAndEdit: {
        addTitle: 'Add User',
        editTitle: 'Edit User',
        nickname: 'Nickname',
        organization: 'Organization',
        phone: 'Phone',
        email: 'Email',
        username: 'Username',
        password: 'Password',
        sex: 'Gender',
        role: 'Role',
        tenant: 'Tenant',
        homeLogo: 'Home Logo'
      },
      resetPwd: {
        label: 'Reset Password',
        title: 'Prompt',
        tip1: 'Enter',
        tip2: 'New Password',
        tip3: 'The password length must be between 5 and 20 characters',
      },
      form:{
        basicInfo: 'Basic Info',
        nickname: 'User Nickname',
        loginAccount: 'Login Account',
        submit: 'Submit',
        back: 'Back'
      },
      assignRoles:{
        label: 'Assign Roles',
        roleInfo: 'Role Info',
        order: 'No.',
        roleId: 'Role ID',
        roleName: 'Role Name',
        permission_character: 'Permission Character',
      },
      associatedDevice:{
        label: 'User Associated Devices',
        deviceInfo: 'Device Info',
        deviceId: 'Device ID',
        deviceName: 'Device Name',
        deviceType: 'Device Type',
        deviceModel: 'Device Model',
        icon: 'Used Icon',
        commWay: 'Communication Mode',
        createTime: 'Launch Time',
        deviceStatus: 'Device Status'
      }
    },
    role: {
      search: {
        roleName: 'Role Name',
        permission_character: 'Permission Character',
        tip1: 'Role Status',
        tip2: 'Start Date',
        tip3: 'End Date',
      },
      table: {
        roleName: 'Role Name',
        permission_character: 'Permission Character',
        showOrder: 'Display Order',
      },
      addAndEdit:{
        addTitle: 'Add Role',
        editTitle: 'Edit Role',
        roleName: 'Role Name',
        permission_character: 'Permission Character',
        showOrder: 'Display Order',
        tenant: 'Tenant',
        menu_permission: 'Menu Permission',
        expandOrCollapse: 'Expand / Collapse',
        selectAllOrDeselectAll: 'Select All / Unselect All',
        cascade: 'Parent-Child Cascade',
        remark: 'Remark'
      },
      dataPermission:{
        label: 'Data Permission',
        title: 'Assign Data Permission',
        roleName: 'Role Name',
        permission_character: 'Permission Character',
        permission_range: 'Permission Scope',
        range:{
          all: 'All Data Permission',
          custom: 'Custom Data Permission',
          selfOrg: 'Current Organization Data Permission',
          selfOrgAndOwn: 'Current Organization & Subordinate Data Permission',
          self: 'Only Self Own Data Permission'
        }
      },
      assignUsers:{
        label: 'Assign Users',
        search: {
          username: 'Username',
          phone: 'Phone Number'
        },
        button: {
          add: 'Add User',
          deleteBatch: 'Batch Revoke Authorization',
          close: 'Close',
          delete: 'Revoke Authorization'
        },
        table:{
          username: 'Username',
          nickname: 'Nickname',
          email: 'Email',
          phone: 'Phone Number',
        },
        addUser:{
          title: 'Select User'
        }
      }
    },
    menu: {
      search:{
        menuName: 'Menu Name',
        menuStatus: 'Menu Status'
      },
      button:{
        expandOrCollapse: 'Expand / Collapse',
      },
      table:{
        menuName: 'Menu Name',
        icon: 'Icon',
        order: 'Order',
        permission_identifier: 'Permission Identifier',
        component_path: 'Component Path',
      },
      addAndEdit:{
        addTitle: 'Add Menu',
        parentMenu: 'Parent Menu',
        mainMenu: 'Main category',
        menuType: 'Menu Type',
        list: 'Directory',
        menu: 'Menu',
        button: 'Button',
        menuIcon: 'Menu Icon',
        tip: 'Click to select icon',
        menuName: 'Menu Name',
        displayOrder: 'Display Order',
        outerLink: 'External Link',
        routeUrl: 'Route Path',
        displayStatus: 'Display Status',
        menuStatus: 'Menu Status',
        component_path: 'Component Path',
        permission_identifier: 'Permission Identifier',
        routeParam: 'Route Params',
        cacheStatus: 'Cache Status',
        cache: 'Cache',
        noCache: 'NoCache'
      }
    },
    tenant: {
      tenantName: 'Tenant Name',
      remark: 'Remark',
      addTitle: 'Add Tenant Info',
      editTitle: 'Edit Tenant Info'
    },
    organization:{
      search:{
        orgName: 'Organization Name',
        orgStatus: 'Organization Status',
      },
      button:{
        expandOrCollapse: 'Expand / Collapse',
      },
      table: {
        orgName: 'Organization Name',
        order: 'Order',
        manager: 'Manager',
        phone: 'Contact Phone',
        email: 'Email',
      },
      addAndEdit: {
        parentOrg: 'Parent Organization',
        orgName: 'Organization Name',
        order: 'Display Order',
        manager: 'Manager',
        phone: 'Contact Phone',
        email: 'Email',
        orgStatus: 'Organization Status',
        rule1: 'Parent organization cannot be empty',
        rule2: 'Organization name cannot be empty',
        rule3: 'Display order cannot be empty',
        rule4: 'Please enter a valid email address',
        rule5: 'Please enter a valid phone number',
      }
    },
    dict:{
      search: {
        dictName: 'Dict Name',
        dictType: 'Dict Type',
        dictStatus: 'Dict Status',
        tip1: 'Start Date',
        tip2: 'End Date'
      },
      button:{
        refresh: 'Refresh Cache'
      },
      table:{
        dictId: 'Dict ID',
        dictName: 'Dict Name',
        dictType: 'Dict Type',
        remark: 'Remark'
      },
      addAndEdit:{
        addTitle: 'Add Dict Type',
        editTitle: 'Edit Dict Type',
      },
      data:{
        search:{
          dictName: 'Dict Name',
          dictTag: 'Dict Tag',
          dataStatus: 'Data Status',
        },
        button:{
          close: 'Close'
        },
        table:{
          dictId: 'Dict Code',
          dictTag: 'Dict Tag',
          dictKeyValue: 'Dict Value',
          dictOrder: 'Dict Order',
          remark: 'Remark',
        },
        addAndEdit:{
          dictType: 'Dict Type',
          dataTag: 'Data Tag',
          dataKeyValue: 'Data Value',
          styleCss: 'Style CSS',
          order: 'Display Order',
          displayType: 'Display Style',
          remark: 'Remark'
        }
      }
    }
  },
  systemMonitor:{

  },

  otherConfig:{
    // 通讯配置等其他的配置翻译
    commWayConfig:{
      yx: 'Iridium',
      bd2: 'BDⅡ',
      bd3: 'BDⅢ',
      tt: 'TianTong',
      unknown: 'unknown'
    },
    iconConfig:{
      gliderSv1: 'Wave glider SV1 icon',
      gliderSv2: 'Wave glider SV2 icon',
      gliderSv3: 'Wave glider SV3 icon',
      beaconDefault: 'Default beacon icon',
      buoyDefault: 'Default buoy icon',
    },
    commandConfig:{
      sensor_enable: 'Sensor P1 Power On',
      sensor_unable: 'Sensor P1 Power Off',
      beidou_enable: 'Beidou P2 Power On',
      beidou_unable: 'Beidou P2 Power Off',
      navigation_enable: 'Nav P3 Power On',
      navigation_unable: 'Nav P3 Power Off',
      port_1_enable: 'Port Power1 On',
      port_1_unable: 'Port Power1 Off',
      port_2_enable: 'Port Power2 On',
      port_2_unable: 'Port Power2 Off',
      port_3_enable: 'Port Power3 On',
      port_3_unable: 'Port Power3 Off',
      port_4_enable: 'Port Power4 On',
      port_4_unable: 'Port Power4 Off',
      port_5_enable: 'Port Power5 On',
      port_5_unable: 'Port Power5 Off',

      mbd: 'Target Point',
      p: 'Rudder P',
      i: 'Rudder I',
      d: 'Rudder D',
      beaconTime:'Beacon Interval',
      angle_fd: 'Anchor Forward Dist & Param',
      angle_range: 'Anchor Radius',
      angle_pram: 'Anchor Param',
      pid_transfer: 'PID Control Transfer',

      fix_heading: 'Fixed Heading',
      fix_angle: 'Fixed Rudder Angle',
      deviation: 'Servo Installation Offset',
      radius: 'Error Circle Radius',
      revise_heading: 'Revised Rudder Angle',

      ir9602_interval: 'Iridium 9602 Interval',
      beidou_interval: 'Beidou Interval',

      electric_enable: 'Slave Power Enable',
      electric_unable: 'Slave Power Off',
      storage_enable: 'Start Storage',
      storage_unable: 'Stop Storage',
      soft_ware_reset: 'System Restart',
    }
  }

}
