import COS from 'cos-js-sdk-v5';

function getFileExtension(filename:string) {
  return filename.slice(filename.lastIndexOf('.') + 1);
}
const useCos = (back:string = 'http://127.0.0.1:8000/api/chat/file/') => {
  const cos = new COS({
    getAuthorization(options, callback) {
      let url = back; // url 替换成您自己的后端服务
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function (e) {
        let xhr = e.target as XMLHttpRequest;
        if (xhr == null) {
          return console.error('XMLHttpRequest error: e.target is null');
        }
        let data = JSON.parse(xhr.responseText);

        data = data.data;
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
      };
      xhr.send();
    },
  });

  const updateFile = async (bucket:string, key:string, file :File, region:string = 'ap-nanjing') => {
    // https://chat-1311013567.cos.ap-nanjing.myqcloud.com/
    const fileName = `avatar-${key}.${getFileExtension(file.name)}`;
    const PATH = `https://${bucket}.cos.${region}.myqcloud.com/${fileName}`;
    // 这里省略初始化过程和上传参数
    try {
      await cos.uploadFile({
        Bucket: bucket,
        Region: region,
        Key: fileName,
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,

      });
    } catch (err) {
      // console.log(err);
    }
    return {
      filePath: PATH,
      fileName,
      fileSize: file.size,

    };
  };
  return {
    cos, updateFile,
  };
};
export default useCos;
