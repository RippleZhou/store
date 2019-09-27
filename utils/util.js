function dateFormat (fmt, date) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*加法*/
const floatAdd = (arg1, arg2)=> {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

/*减法*/
const floatSub = (arg1, arg2)=>{
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/*乘法*/
const floatMul = (arg1, arg2)=> {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


/*除法*/
const floatDiv = (arg1, arg2)=> {
  var t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }

  r1 = Number(arg1.toString().replace(".", ""));

  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

const validatePhoneNum = obj => { //手机号码验证
  var $this = obj;
  if (/^1[3|4|5|6|7|8]\d{9}$/.test($this)) {
    return true;
  } else {
    return false;
  }
}
const isNumberOr = obj => {
  var $this = obj;
  if (new RegExp("^[0-9a-zA-Z]{6,16}$").test($this)) {
    return true;
  } else {
    return false;
  }
}

function sendMsgTxt(setTxt) {
  var timer = null;
  var leftSecond = 59;
  var disableAttr = true;
  var defaultBg = false;
  setTxt(leftSecond + 's后获取', disableAttr, defaultBg);
  timer = setInterval(setRemainTime, 1000);

  function setRemainTime() {
    if (leftSecond > 0) {
      disableAttr = true;
      defaultBg = false;
      setTxt(leftSecond + 's后获取', disableAttr, defaultBg);
      leftSecond--;
    } else {
      clearInterval(timer);
      disableAttr = false;
      defaultBg = true;
      setTxt('重发验证码', disableAttr, defaultBg);
    }
  }
}

function getQueryUrl (url, params) {
  return url + '?' + getQueryString(params)
}
function getQueryString (params) {
  var queryString = ''
  for (var index in params) {
    queryString += index + '=' + params[index] + '&'
  }
  queryString = queryString.substr(0, queryString.length - 1)
  return queryString
}
function domain () {
  return window.location.protocol + '//' + window.location.host
}
function getDateObj(cutOffTime) {
  let now = new Date();
  let endTime = new Date(cutOffTime.replace(/-/g, '/'));
  let leftTime = new Date(cutOffTime.replace(/-/g, '/')).getTime() - new Date().getTime();
  let time = {
    o: "00",
    m: "00",
    s: "00"
  }
  if (leftTime < 0) {
    return time;
  }
  else {
    leftTime = parseInt(leftTime / 1000);
    time.o = Math.floor(leftTime / 3600);
    time.m = Math.floor(leftTime / 60 % 60);
    time.s = leftTime % 60;
    if (time.o < 10) {
      time.o = '0' + time.o;
    }
    if (time.m < 10) {
      time.m = '0' + time.m;
    }
    if (time.s < 10) {
      time.s = '0' + time.s;
    }
  }
  return time;
}

module.exports = {
  domain,
  sendMsgTxt,
  dateFormat,
  floatAdd,
  floatSub,
  floatMul,
  floatDiv,
  getDateObj,
  validatePhoneNum,
  isNumberOr
}
