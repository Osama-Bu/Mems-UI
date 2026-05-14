/**
 * 下载文件工具函数
 * @param {string} url - 文件URL（预签名URL或直链）
 * @param {string} [filename] - 自定义文件名（可选）
 */
export const downloadFile = (url, filename) => {
  if (!url) {
    console.error('下载失败：URL为空');
    return false;
  }

  try {
    // 如果提供了自定义文件名，直接使用
    // 否则从URL中提取文件名
    let downloadFilename = filename;

    if (!downloadFilename) {
      // 从URL中提取原始文件名（处理预签名URL）
      const urlWithoutQuery = url.split('?')[0];
      const originalFilename = urlWithoutQuery.split('/').pop();
      // 解码可能被编码的中文文件名
      downloadFilename = decodeURIComponent(originalFilename) || 'download';
    }

    // 创建隐藏的a标签
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none';

    // 添加到DOM并触发点击
    document.body.appendChild(link);
    link.click();

    // 清理DOM
    setTimeout(() => {
      document.body.removeChild(link);
      // 释放URL对象（如果使用了URL.createObjectURL）
      if (link.href.startsWith('blob:')) {
        URL.revokeObjectURL(link.href);
      }
    }, 100);

    return true;
  } catch (error) {
    console.error('文件下载失败：', error);
    return false;
  }
};

/**
 * 下载Blob数据
 * @param {Blob} blob - Blob数据
 * @param {string} filename - 文件名
 */
export const downloadBlob = (blob, filename) => {
  try {
    // 创建Blob URL
    const url = URL.createObjectURL(blob);
    downloadFile(url, filename);
  } catch (error) {
    console.error('Blob下载失败：', error);
    return false;
  }
};

/**
 * 下载JSON数据为文件
 * @param {Object} data - JSON数据
 * @param {string} filename - 文件名（默认：data.json）
 */
export const downloadJSON = (data, filename = 'data.json') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('JSON下载失败：', error);
    return false;
  }
};

/**
 * 下载CSV数据
 * @param {Array} data - 数据数组
 * @param {string} filename - 文件名（默认：data.csv）
 */
export const downloadCSV = (data, filename = 'data.csv') => {
  try {
    // 将数组转换为CSV字符串
    const csvString = data.map(row =>
      Array.isArray(row) ? row.join(',') : row
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('CSV下载失败：', error);
    return false;
  }
};

/**
 * 从 Cookie 中获取指定名称的值
 * @param {String} name Cookie 名称（此处为 Admin-Token）
 * @returns {String|null} 返回 Cookie 值，不存在则返回 null
 */
export function getCookie(name) {
  const cookieArr = document.cookie.split('; '); // 分割所有 Cookie（注意分号后有空格）
  for (let i = 0; i < cookieArr.length; i++) {
    const cookieItem = cookieArr[i].split('=');
    // 匹配 Cookie 名称
    if (cookieItem[0] === name) {
      return decodeURIComponent(cookieItem[1]); // 解码（防止 Cookie 值有特殊字符编码）
    }
  }
  return null; // 未找到对应 Cookie
}

/**
 * 通用下载方法（不跳转页面，触发Excel/文件下载）
 * @param {String} url 接口地址（如 'schedule/job/export'）
 * @param {Object} params 请求参数
 * @param {String} fileName 下载后的文件名（如 'job_123456.xlsx'）
 */
export function download(url, params, fileName) {
  // 1. 创建XHR对象
  const xhr = new XMLHttpRequest();
  // 2. 配置请求：POST方法，完整接口地址，异步请求
  // 注意：补充项目基础路径（如 '/api'，根据你的项目配置调整，若url是完整地址可直接使用）
  const fullUrl = process.env.VUE_APP_BASE_API + '/' + url;
  xhr.open('POST', fullUrl, true);
  // 3. 设置响应类型：二进制流（关键，处理Excel文件）
  xhr.responseType = 'blob';
  // 4. 设置请求头（若项目有token认证，必须携带，否则接口会403）
  xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
  // 若你的项目用token认证，添加token请求头（根据你的项目实际情况调整）
  // const token = localStorage.getItem('token');
  // token 在cookie中
  const token = getCookie('Admin-Token');
  if (token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }
  // 5. 监听请求成功回调
  xhr.onload = function() {
    if (this.status === 200) {
      // 6. 获取响应的二进制流（blob对象）
      const blob = this.response;
      // 7. 创建下载链接
      const a = document.createElement('a');
      // 8. 创建blob URL，指向二进制流
      const url = window.URL.createObjectURL(blob);
      // 9. 设置下载文件名
      a.href = url;
      a.download = fileName;
      // 10. 触发点击下载（隐藏a标签，不影响页面）
      document.body.appendChild(a);
      a.click();
      // 11. 清理资源
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };
  // 12. 发送请求（POST请求需序列化参数，根据接口接收方式调整：JSON.stringify 或 FormData）
  // 你的接口接收的是 SysJob 对象，对应JSON格式，故序列化参数
  xhr.send(JSON.stringify(params));
}

export default {
  downloadFile,
  downloadBlob,
  downloadJSON,
  downloadCSV,
  download
};
