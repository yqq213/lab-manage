// 根据文件名称获取文件后缀
export const getFileExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  // 如果没有找到点，返回空字符串
  return dotIndex !== -1 ? fileName.substring(dotIndex + 1) : ''
}