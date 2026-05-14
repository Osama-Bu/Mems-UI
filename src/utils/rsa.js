
/* 产引入jsencrypt实现数据RSA加密 */
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA

export default {
  /* JSEncrypt加密 */
  rsaPublicData(publicKey,data) {
    var jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(publicKey)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data)
    return result
  },
  /* JSEncrypt解密 */
  rsaPrivateData(data) {
    var jsencrypt = new JSEncrypt()
    jsencrypt.setPrivateKey(privateKey)
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data)
    return result
  },

}
