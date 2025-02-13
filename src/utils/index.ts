import CryptoJS from 'crypto-js'

// 根据文件名称获取文件后缀
export const getFileExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  // 如果没有找到点，返回空字符串
  return dotIndex !== -1 ? fileName.substring(dotIndex + 1) : ''
}

// DES加密
export const des_encrypt = (params) => {
  const pubKey = 'jensjemxkaiem2odemnha3je' // des-secret-key
  const pubiv = '96582454' // des-iv
  const keyHex = CryptoJS.enc.Utf8.parse(pubKey)
  const ivHex = CryptoJS.enc.Utf8.parse(pubiv)
  const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(params)) // params是对象的时候
  const encrypted = CryptoJS.TripleDES.encrypt(srcs, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

// DES解密
export const des_decrypt = (message) => {
  const pubKey = 'jensjemxkaiem2odemnha3je' // des-secret-key
  const pubiv = '96582454' // des-iv
  const keyHex = CryptoJS.enc.Utf8.parse(pubKey)
  const ivHex = CryptoJS.enc.Utf8.parse(pubiv)
  var decrypt_str = CryptoJS.TripleDES.decrypt(message, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypt_str.toString(CryptoJS.enc.Utf8);
}