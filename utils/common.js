var md5 = require("md5/js-md5")
var md5Sign = require("md5/sign")
var Api = require("api")
const app = getApp()
let {
  regeneratorRuntime
} = global

var common = {
  appkey: "3721zhkj",
  error: {
    api: {}
  },
  ajax: {},
  request: {},
  response: {
    check: {}
  },
  biz: {
    loggedIn: {} //检查是否登录
  },
  miscellaneous: {
    getSign: {},
    signedParams: {}
  },

  //获取 login code
  getLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            console.log('res.code:', res.code)
            // return;
            resolve(res.code)
          } else {
            reject(res.errMsg)
          }
        }
      })
    })
  },
  async getOpenId(loginCode) {
    let params = {
      authCode: loginCode
    }
    let MD5signStr = this.md5sign(params);
    let url = `${Api.getMiniAppOpenId}?authCode=${loginCode}&sign=${MD5signStr}`
    let res = await this.ajax.post(url)
    return res.message;
  },
  async bindOpenId(openid) {
    if (!this.biz.loggedIn(this.getRoute())) return;//检查登录
    let customerCode = this.getCustomerCode()
    let params = {
      openId: openid,
      customerCode
    }
    let MD5signStr = this.md5sign(params);
    let url = `${Api.addMiniOpenId}?sign=${MD5signStr}&openId=${openid}&customerCode=${customerCode}`
    let result = await this.ajax.post(url)

    if (result.status == 'OK') {
      return openid
    } else {
      return false;
    }
  },
  //获取 小程序 openid （最终）
  async getMiniOpenId() {
    let code = await this.getLoginCode()
    let _openid = await this.getOpenId(code)
    let openid = await this.bindOpenId(_openid)
    return openid
  }
}
common.getRoute = function () {
  let pages = getCurrentPages();
  let currPage = {};
  if (pages.length) {
    currPage = pages[pages.length - 1];
  }
  console.log('currPage.route:', currPage.route)
  return currPage.route || null
}

common.biz.getStorage=(key)=>{
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      return value
    } else {
      return ''
    }
  } catch (e) {
    this.showStorageError()
  }
}

common.setCustomerCode = function (customerCode) {
  return this.setStorage('customerCode', customerCode)
}
common.getCustomerCode=function(){
  return this.getStorage('customerCode')
}
common.removeCustomerCode = function () {
  return this.removeStorage('customerCode')
}

//是否登录
common.biz.isLogin = function() {
  console.log('getStorage',this.getStorage('customerCode'))
  return this.getStorage('customerCode')
}

common.biz.gotoLogin = (redirectUrl) => {
  if (redirectUrl && redirectUrl == "currentPage") {
    wx.navigateTo({
      url: '/pages/user/login/login?jumpUrl=' + encodeURIComponent(common.getFullPath()),
    })
  } else {
    wx.navigateTo({
      url: '/pages/user/login/login?jumpUrl=' + encodeURIComponent(redirectUrl),
    })
  }
}

common.biz.loggedIn = function (redirectUrl) {
  console.log('redirectUrl', redirectUrl)
  let islogin = this.isLogin()
  if (!islogin) {
    this.gotoLogin(redirectUrl)
    return false
  } else {
    return true
  }
}

common.getFullPath = function () {
  let pages = getCurrentPages();
  let currPage = {};
  if (pages.length) {
    currPage = pages[pages.length - 1];
  }
  let queryString = ''
  for (var index in currPage.options) {
    queryString += index + '=' + currPage.options[index] + '&'
  }
  queryString = queryString.substr(0, queryString.length - 1)
  if (queryString) {
    return "/" + currPage.route + '?' + queryString
  } else {
    return "/" + currPage.route
  }
}

common.error.api = function (message) {
  this.name = 'api'
  this.message = message || 'Default Message'
  this.stack = new Error().stack
}
common.error.api.prototype = Object.create(Error.prototype)
common.error.api.prototype.constructor = common.error.api
/**
 * @synopsis zhkj-api-签名算法
 *
 * @param params 需要被签名的接口参数对象
 *
 * @returns 访问api需要的签名
 */

common.miscellaneous.getSign = params => {
  console.log('md5Sign', md5Sign.raw(params))

  var data = md5Sign.raw(params) + '&key=' + common.appkey
  return md5(data).toUpperCase()
}
/** 
 * @synopsis zhkj-api-签名算法
 *
 * @param params 需要对象被签名的对象
 *
 * @returns
 */
common.miscellaneous.signedParams = params => {
  console.log('signedParams')
  var sign = common.miscellaneous.getSign(params)
  return Object.assign(params, {
    sign: sign
  })
}
common.getparam = function (data) {
  let param = {};
  for (let item in data) {
    param[item] = data[item];
  }
  param['sign'] = common.miscellaneous.getSign(data);
  return param;
},
  common.md5sign = function (data) {
    console.log('commonsign',data)
    let ret = [];
    let str = '';
    let obj = {};
    for (let item in data) {
      ret.push(item.toLowerCase());
      obj[item.toLowerCase()] = item;
    }
    ret.sort();
    for (let key in ret) {
      let _key = obj[ret[key]];
      let res = data[_key];
      if (str === '') {
        str = _key + '=' + res;
      } else {
        str += '&' + _key + '=' + res;
      }
    }
    str += '&key=' + common.appkey;
    console.log('ssssssstttrrr:', str)
    let sign = md5(str).toUpperCase();
    return sign;
  },

  common.request.localLogin = function (data, callback, errorcallback) {
    let url = Api.customer.login
    let newdata = {
      cellPhone: data.cellPhone,
      passWord: data.passWord
    }
    newdata = common.miscellaneous.signedParams(newdata)
    wx.request({
      url: url,
      method: "GET",
      data: newdata,
      success: function (res) {
        if (res.data.status === "OK") {
          let url = Api.customer.getUserCenter

          function md5sign(data) {
            let ret = [];
            let str = '';
            let obj = {};
            for (let item in data) {
              ret.push(item.toLowerCase());
              obj[item.toLowerCase()] = item;
            }
            ret.sort();
            for (let key in ret) {
              let _key = obj[ret[key]];
              let res = data[_key];
              if (str === '') {
                str = _key + '=' + res;
              } else {
                str += '&' + _key + '=' + res;
              }
            }
            str += '&key=' + common.appkey;
            let sign = md5(str).toUpperCase();
            return sign;
          }

          let MD5signStr = md5sign({
            customerCode: res.data.message.customerCode,
          });
          let customerCode = res.data.message.customerCode

          console.log('customerCode::', res.data.message.customerCode)

          wx.request({
            url: Api.customer.getUserCenter + '?customerCode=' + res.data.message.customerCode + '&sign=' + MD5signStr,
            method: 'POST',
            success(res) {
              if (res.data.status === "OK") {
                var user = res.data.message
                var name = user.userName
                user['customerCode'] = customerCode
                var tokenStr = encodeURIComponent(JSON.stringify(user))
                var token = "token=" + tokenStr + "; name=" + name

                try {
                  wx.setStorageSync('token', token)
                  wx.setStorageSync('user', user)
                } catch (e) {
                  console.log('save storage error')
                }

                app.globalData.token = token
                app.globalData.userInfo = user

                if (callback) {
                  callback(res.data.message)
                } else {
                  wx.switchTab({
                    url: "../index/index"
                  })
                }
              }
            }
          })
          // self.setData({
          //   beanAmount: data.message.beanAmount
          // })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        return;
      }
    })
  }


//密码登录
common.pwdLogin = function ({ cellphone, password }) {
  let url = Api.user.login
  let params = { cellPhone: cellphone, passWord: password }
  let MD5signStr = this.md5sign(params);
  let reqParams = { sign: MD5signStr, ...params }
  try {
    return this.ajax.post(url, reqParams)
  } catch (err) {
    this.showToast(err.message)
  }
}
common.showToast = function (message) {
  wx.showToast({
    title: message,
    icon: 'none'
  })
}
common.goback = () => {
  wx.navigateBack({
    delta: 1
  })
}
common.gotoCustom = function (jumpurl) {
  let isTabBar = this.isTabBar(jumpurl)
  if (isTabBar) {
    wx.switchTab({
      url: jumpurl
    })
  } else {
    wx.navigateTo({
      url: jumpurl
    })
  }

}

common.isTabBar = function (jumpurl) {
  // /pages/owner / owner
  let urlarr = jumpurl.split('/')
  let pageName = urlarr[urlarr.length - 1]
  if (pageName == 'index' || pageName == 'owner' || pageName == 'order' || pageName == 'exchangeBox') {
    return true
  } else {
    return false;
  }
}

common.showStorageError = () => {
  wx.showToast({
    title: '设置错误',
    icon: 'none'
  })
}
common.setStorage = function (key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    this.showStorageError()
  }
}
common.getStorage = function (key) {
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      return value
    } else {
      return ''
    }
  } catch (e) {
    this.showStorageError()
  }
}

common.removeStorage = function (key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    wx.showModal({
      title: '删除userCode失败',
      showCancel: false
    })
  }
}

// common.isLogin = function () {
//   return this.getStorage('islogin')
// }
// common.saveLogin = function () {
//   this.setStorage('islogin', 1)
// }
common.saveUser = function (user) {
  this.setStorage('user', user)
}
common.gotoLogin = function () {
  wx.navigateTo({
    url: '/pages/user/codelogin/codelogin'
  })
}
common.gotoBind = function () {
  wx.navigateTo({
    url: '/pages/bindAddress/bindAddress'
  })
}

common.gotoIndex = function () {
  wx.switchTab({
    url: '/pages/index/index'
  })
}
common.gotoOwner = function () {
  wx.switchTab({
    url: '/pages/owner/owner'
  })
}
common.getUserFromApi = async function (userCode) {
  let url = Api.housing.getUser
  let params = {
    userCode
  }
  let MD5signStr = this.md5sign(params);
  let reqParams = { sign: MD5signStr, ...params }
  return this.ajax.post(url, reqParams)
},
common.showModel=function(msg){
  wx.showModal({
    title: msg,
    showCancel: false
  })
}

common.getUser = async function (customerCode) {
  let params = {
    customerCode
  }
  let MD5signStr = this.md5sign(params);
  let url = `${Api.customer.getUserCenter}?customerCode=${customerCode}&sign=${MD5signStr}`
  let userResult = await this.ajax.post(url)
  return userResult.message
}
common.getWxOpenId = function () {
  return this.getStorage('user').wxOpenId
}
common.getUserCode = function () {
  return this.getStorage('userCode')
}

common.setWxOpenId = function (openid) {
  this.setStorage('openid', openid)
}
common.setUserCode = function (value) {
  this.setStorage('userCode', value)
}
common.validPassword = function (password) {
  // let reg = /^[A-Za-z0-9]{6,}|[A-Za-z0-9~!@#$^&*()=|{}]{6,}$/
  let reg = /(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}|(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}[A-Za-z0-9~!@#$^&*()=|{}]{6,}/
  return reg.test(password)
}

// 原来的登陆
// common.request.localLogin = function (data, callback, errorcallback) {
//   let url = Api.customer.CustomerLogin
//   let newdata = { cellPhone: data.cellPhone, passWord: data.passWord }
//   newdata = common.miscellaneous.signedParams(newdata)
//   wx.request({
//     url: url,
//     method: "GET",
//     data: newdata,
//     success: function (res) {
//       if (res.data.status === "OK") {
//         var user = res.data.message
//         var name = user.userName
//         var tokenStr = encodeURIComponent(JSON.stringify(user))
//         var token = "token=" + tokenStr + "; name=" + name
//         wx.setStorage({//保存cookie 到storage
//           key: "token",
//           data: token
//         })
//         wx.setStorage({//保存cookie 到storage
//           key: "user",
//           data: user
//         })

//         app.globalData.token = token
//         app.globalData.userInfo = user
//         console.log('app.globalData.token:', app.globalData.token)
//         console.log('app.globalData.userInfo:', app.globalData.userInfo)

//         if (callback) {
//           callback(res.data.message)
//         } else {
//           wx.switchTab({
//             url: "../index/index"
//           })
//         }
//       } else {
//         console.log('aaaaaaa')
//         wx.showToast({
//           title: res.data.message,
//           icon: 'none',
//           duration: 2000
//         })
//       }
//       return;
//     }
//   })
// }

common.request.get = function (url, params, callback, errorcallback) {
  wx.showLoading()
  wx.request({
    url: url,
    header: {
      'Cookie': app.globalData.token //用户信息
    },
    method: "GET",
    data: params,
    success: function (res) {
      wx.hideLoading()
      if (res.data.status && res.data.status == "OK") {
        if (callback) {
          callback(res.data)
        }
        return;
      } else {
        wx.showToast({
          title: JSON.stringify(res.data.message),
          icon: 'none',
          duration: 1500
        })
      }
    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1500
      })
    },
  })
}

common.request.post = function (url, params, callback, errorcallback, contype) {
  let headtype = ''
  if (contype == 1) {
    headtype = 'application/x-www-form-urlencoded'
  } else {
    headtype = 'application/json;charset=UTF-8'
  }
  wx.showLoading()
  wx.request({
    url: url,
    method: "POST",
    header: {
      'Cookie': app.globalData.token, //用户信息
      'Content-Type': headtype
    },
    data: params,
    success: function (res) {
      wx.hideLoading()
      if (res.data.status && res.data.status == "OK") {
        if (callback) {
          callback(res.data)
        }
        return;
      } else {
        wx.showToast({
          title: JSON.stringify(res.data.message),
          icon: 'none',
          duration: 1500
        })
      }

    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1500
      })
    },
  })
}

common.ajax.get = function (url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: {
        'Cookie': app.globalData.token //用户信息
      },
      method: "GET",
      data: params,
      success: function (res) {
        if (res.data.status && res.data.status == "OK") {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误！',
          icon: 'none',
          duration: 1500
        })
      },
    })
  })

}
common.ajax.post = function (url, params) {
  console.log('params', params)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Cookie': app.globalData.token, //用户信息
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: params,
      success: function (res) {
        console.log('ressss', res.data.status)
        if (res.data.status && res.data.status == "OK") {
          console.log('ressss2', typeof res.data.status)
          resolve(res.data)
        } else {
          console.log('reject')
          reject(res.data)
        }

      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误！',
          icon: 'none',
          duration: 1500
        })
      },
    })
  })

}

common.response.check = function (res) {
  if (res.status === 200) {
    //请求正确返回
    if (res.data.status === 'OK') {
      //接口正确返回
      return true
    } else {
      throw new common.error.api(res)
    }
  } else {
    throw 'network error'
  }
}
common.bd_decrypt = function (bd_lng, bd_lat) {
  //百度地图坐标转腾讯(高德)
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {
    lng: gg_lng,
    lat: gg_lat
  };
}
common.encodeUTF8 = function (s) {
  let i,
    r = [],
    c,
    x
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c)
    else if (c < 0x800) r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f))
    else {
      if ((x = c ^ 0xd800) >> 10 == 0)
        //对四字节UTF-16转换为Unicode
        (c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000),
          r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f))
      else r.push(0xe0 + ((c >> 12) & 0xf))
      r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f))
    }
  return r
}

// 字符串加密成 hex 字符串
common.sha1 = function (s) {
  var data = new Uint8Array(common.encodeUTF8(s))
  var i, j, t
  var l = (((data.length + 8) >>> 6) << 4) + 16,
    s = new Uint8Array(l << 2)
  s.set(new Uint8Array(data.buffer)), (s = new Uint32Array(s.buffer))
  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3
  var w = [],
    f = [
      function () {
        return (m[1] & m[2]) | (~m[1] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      },
      function () {
        return (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      }
    ],
    rol = function (n, c) {
      return (n << c) | (n >>> (32 - c))
    },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  (m[2] = ~m[0]), (m[3] = ~m[1])
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0)
    for (j = 0; j < 80; j++)
      (w[j] =
        j < 16 ?
          s[i + j] :
          rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)),
        (t =
          (rol(m[0], 5) + f[(j / 20) | 0]() + m[4] + w[j] + k[(j / 20) | 0]) |
          0),
        (m[1] = rol(m[1], 30)),
        m.pop(),
        m.unshift(t)
    for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0
  }
  t = new DataView(new Uint32Array(m).buffer)
  for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2)

  var hex = Array.prototype.map
    .call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? '0' : '') + e.toString(16)
    })
    .join('')
  return hex
}
//获取当前定位城市及编号
common.getLocation = function (callback) {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      const speed = res.speed
      const accuracy = res.accuracy
      let url = Api.customer.getCityByLngAndLat + '?longitude=' + longitude + '&latitude=' + latitude
      common.request.get(Api.customer.getCityByLngAndLat, {
        longitude: longitude,
        latitude: latitude
      }, data => {
        app.globalData.location = data.message
        if (callback) {
          callback(data.message)
        }
      })
    }
  })
}

//获取验证码
common.NewAuthCode = function (datas) {

  let url = Api.customer.GetmsAuthCode
  let sign = common.md5sign({
    cellPhone: datas.cellPhone,
    type: datas.type,
    token: datas.token
  })

  common.request.get(url, {
    cellPhone: datas.cellPhone,
    type: datas.type,
    sign: sign,
    token: datas.token
  }, function (data) {
    console.log(data)
    if (data.status == 'OK') {
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        content: data.message,
        showCancel: false,
        confirmColor: '#e61817',
      })
    }
  })
}

// common.NewAuthCode = function (datas) {
//   let url = Api.newCustomer.newgetmsAuthCode
//   let sign = common.md5sign({
//     cellPhone: datas.cellPhone,
//     type: datas.type,
//     token: datas.token
//   })

//   common.request.get(url, {
//     cellPhone: datas.cellPhone,
//     type: datas.type,
//     sign: sign,
//     token: datas.token
//   }, function (data) {
//     console.log(data)
//     if (data.status == 'OK') {
//       wx.showToast({
//         title: data.message,
//         icon: 'none',
//         duration: 2000
//       })
//     } else {
//       wx.showModal({
//         content: data.message,
//         showCancel: false,
//         confirmColor: '#e61817',
//       })
//     }
//   })
// }

//倒计时
common.codeTime = function (_this) {
  let TIME_COUNT = 60
  if (!_this.timer) {
    console.log('TIME_COUNT', TIME_COUNT)
    _this.count = TIME_COUNT;
    _this.timer = setInterval(() => {
      if (_this.count > 1 && _this.count <= TIME_COUNT) {
        _this.count--
        _this.setData({
          codeTxt: _this.count + 's重新获取',
          btnDisabled: true
        })
      } else {
        clearInterval(_this.timer);
        _this.setData({
          isDisable: false,
          codeTxt: '发送验证码',
          btnDisabled: false,
          captchaReload: true
        })
        _this.timer = null;
      }
    }, 1000)
  }
}
common.VerifyPhone = function (val) {
  return /^[0-9]{11}$/.test(val)
}
common.cityData = function (callback) {
  common.request.get(Api.customer.addressData, {
    params: {
      type: 1
    }
  }, function (data) {
    if (data.status == 'OK') {
      callback(data.message)
    }
  })
}
common.errImgFun = function (e, that) { //
  var _errImg = e.target.dataset.errImg;
  console.log(e.detail.errMsg + "----" + "----" + _errImg);
  that.setData({
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png'
  });
}

common.callPay = function (payinfo) { //支付
  return new Promise(function (resolve, reject) {
    wx.requestPayment({
      timeStamp: payinfo.timeStamp, // 时间戳，自1970年以来的秒数
      nonceStr: payinfo.nonceStr, // 随机串
      package: payinfo.package,
      signType: payinfo.signType, // 微信签名方式：
      paySign: payinfo.paySign, // 微信签名
      success(res) {

        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          console.log('callpay request:ok')
          resolve(res)
          //用户支付成功
          // wx.navigateTo({
          //   url: `pages/payFail/payFail?isPayOk=true&fromType=${type}`,
          // })
        } else {
          console.log('callpay request:not ok')
          // wx.navigateTo({
          //   url: `pages/payFail/payFail?isPayOk=false&fromType=${type}`,
          // })
        }
      },
      fail(err) {
        console.log('callpay fail')
        reject(err)
      }
    })
  })
}



common.getTels = function () { //客服
  wx.makePhoneCall({
    phoneNumber: '400-720-0000'
  })
},

  module.exports = common