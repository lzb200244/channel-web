const useUpload = (cos:any, bucket:string = 'chat-1311013567') => {
  /**
     * 上传图片
     * @param file file对象
     * @return 上传地址
     */
  const uploadImg = async (file: File) => {
    const COS_URL = 'https://chat-1311013567.cos.ap-nanjing.myqcloud.com/';
    // 这里省略初始化过程和上传参数
    const key = `${Date.now().toString()}:`;
    let fileName = key.concat(file.name);

    try {
      await cos.uploadFile(cos.uploadFile({
        Bucket: bucket,
        Region: 'ap-nanjing',
        Key: fileName,
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,
        // onProgress(progressData: any) {
        //   // console.log(JSON.stringify(progressData));
        // },
      }));
    } catch (err) {
      // console.log(err);
    }
    return {
      filePath: COS_URL + fileName,
      fileName: file.name,
      fileSize: file.size,

    };
  };
  return {
    uploadImg,
  };
};
export default useUpload;
