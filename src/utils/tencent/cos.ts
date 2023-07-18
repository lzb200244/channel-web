import COS from 'cos-js-sdk-v5';

const useCos = (back:string = 'http://127.0.0.1:8000/api/chat/file/') => {
  const cos = new COS({
    getAuthorization(options, callback) {
      let url = back; // url 替换成您自己的后端服务
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function (e) {
        let data = JSON.parse(e.target.responseText);
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
  return {
    cos,
  };
};
export default useCos;
