// pages/user/login-code/login-code.js
const Util = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()  
const { regeneratorRuntime } = global

Page({
  data: {
    setTitName: '登录',
    user: {
      cellPhone: '',
      codes: '',
    },
    btnDisabled:false,
    codeTxt:'获取验证码',
    jumpUrl: "/pages/index/index",
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
    captchaShow: false,
    captchaReload: false,
    clickTime: 0,
    redirectUrl:null
  },
  onLoad: function (options) {
    var self = this
    if (options.jumpUrl) {
      self.setData({
        jumpUrl: decodeURIComponent(options.jumpUrl)
      })
    }
  },
  setDefaultValue: function (e) {//
    var _this = this
    var user = _this.data.user
    var id = e.currentTarget.id
    user[id] = e.detail.value
    _this.setData({
      user: user
    })
  },
  goBack: function () {
    wx.navigateBack()
  },
  getCodes() {//获取验证码
    let _this = this
   if (!Util.validatePhoneNum(_this.data.user.cellPhone)) {
      wx.showToast({
        title: '*手机号码格式不正确',
        icon: 'none'
      })
      return
    } else {
     _this.setData({
       captchaShow: true
     })
    }
  },
  // 验证码成功回调
  captchaSuccess: function (token) {
    let _this = this
    console.log('token:', token)
    
    _this.setData({
      captchaShow: false
    })
    Common.codeTime(_this)
    let datas = { cellPhone: _this.data.user.cellPhone, type: '2', token: token.detail }
    Common.NewAuthCode(datas)
    console.log('*****')
  },
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
    console.log('captcha_hide')
  },
  async login(){//登录
    let _this =this
    if (!Util.validatePhoneNum(_this.data.user.cellPhone)) {
      wx.showToast({
        title: '*手机号码格式不正确',
        icon: 'none'
      })
      return
    } else if (_this.data.user.codes==""){
      wx.showToast({
        title: '*验证码不能为空',
        icon: 'none'
      })
    }else{
      var ndata = { cellPhone: _this.data.user.cellPhone, authCode: _this.data.user.codes}
      var sign = Common.md5sign(ndata)
      var url = Api.customer.CustomerloginCode + '?cellPhone=' + _this.data.user.cellPhone + '&authCode=' + _this.data.user.codes + '&sign=' + sign
      try{
        let codeloginResult = await Common.ajax.post(url, {})
        console.log('codeloginResult:', codeloginResult)
        let customerCode =  codeloginResult.message.customerCode
        Common.setCustomerCode(customerCode)
        let params2 = {
          customerCode
        }
        let MD5signStr2 = Common.md5sign(params2);
        let url2 = Api.customer.getUserCenter + '?customerCode=' + customerCode + '&sign=' + MD5signStr2
        let res2 = await Common.ajax.post(url2)
        let user = res2.message
        user.customerCode = customerCode
        var name = user.userName
        var tokenStr = encodeURIComponent(JSON.stringify(user))
        var token = "token=" + tokenStr + "; name=" + name

        wx.setStorage({//保存cookie 到storage
          key: "token",
          data: token
        })
        wx.setStorage({//保存cookie 到storage
          key: "user",
          data: user
        })
        app.globalData.token = token
        app.globalData.userInfo = user

        wx.switchTab({
          url: _this.data.jumpUrl,
          fail: function () {
            wx.redirectTo({
              url: _this.data.jumpUrl
            })
          }
        })
      }catch(err){
        wx.showToast({
          title: err.message,
          icon:'none'
        })
      }
    }
  }
})