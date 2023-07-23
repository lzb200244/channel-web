/**
 * 校验文件后缀是否合格
 * @param extension
 */
const createValidateFileExtension = (extension:string[] = []) => (filename:string) => {
  // @ts-ignore
  let fileExt = filename.split('.').pop().toLowerCase();
  return extension.map((item) => item.toLowerCase()).includes(fileExt);
};
/**
 * 常见的图片类型
 */
const ImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'tif', 'webp', 'svg', 'ico'];
const isOverSize = (fileSize:number, limitSize:number) => {
  let fileSizeInMB = fileSize / (1024 * 1024); // 将字节转换为兆字节
  return fileSizeInMB > limitSize;
};
// eslint-disable-next-line import/prefer-default-export
export { createValidateFileExtension, ImageTypes, isOverSize };
