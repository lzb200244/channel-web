import COS from 'cos-js-sdk-v5';
import { ref } from 'vue';
import { getCreditAPI } from '@/apis/channel';

export function getFileExtension(filename:string) {
  return filename.slice(filename.lastIndexOf('.') + 1);
}
const useCos = (back:string = 'chat/file/', policy :string) => {
  const cos = new COS({
    async getAuthorization(options, callback) {
      const res = await getCreditAPI(back, policy);
      let { data } = res;

      let { Credentials } = data;
      if (!data || !Credentials) {
        return console.error(`credentials invalid:\n${JSON.stringify(data, null, 2)}`);
      }
      callback({

        TmpSecretId: Credentials.TmpSecretId,
        TmpSecretKey: Credentials.TmpSecretKey,
        SecurityToken: Credentials.Token,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.StartTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.ExpiredTime, // 时间戳，单位秒，如：1580000000
      });
    },
  });
  const percent = ref(0);
  /**
   *
   * @param bucket
   * @param prefix 文件前缀
   * @param file
   * @param region
   * @param key
   */
  const updateFile = async (bucket:string, prefix:string, key :string, file :File, region:string = 'ap-nanjing') => {
    // https://chat-1311013567.cos.ap-nanjing.myqcloud.com/
    // const endFix = getFileExtension(file.name);
    const fileName = `${prefix}-${key}:${file.name}`;
    const PATH = `https://${bucket}.cos.${region}.myqcloud.com/${fileName}`;
    // 这里省略初始化过程和上传参数
    try {
      await cos.uploadFile({
        Bucket: bucket,
        Region: region,
        Key: fileName,
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,
        onProgress(progressData: any) {
          // 上传进度
          percent.value = progressData.percent * 100;
        },
      });
      percent.value = 0;
    } catch (err) {
      console.log(err);
    }
    return {
      filePath: PATH,
      fileName,
      fileSize: file.size,

    };
  };
  return {
    cos, updateFile, percent,
  };
};
export default useCos;
