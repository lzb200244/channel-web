/**
 * 判断是否过期多久
 * @param timestamp 时间搓
 * @param minute 过期分钟
 */
const isTimeElapsed = (timestamp:number, minute:number) => {
  let now = Date.now(); // 当前时间的时间戳
  let elapsed = now - timestamp; // 当前时间与给定时间戳之间的时间差（毫秒）

  // 将时间差转换为分钟
  let elapsedMinutes = Math.floor(elapsed / (1000 * 60));

  return elapsedMinutes > minute; // 判断时间差是否大于2分钟
};
export default isTimeElapsed;
