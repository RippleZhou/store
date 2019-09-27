// pages/user/register/register.js
const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global
Page({
  data: {
    inputVal: {
      phone: '',
      code: '',
      pw: '',
      pw2: ''
    },
    referCellPhone: '',
    codeTxt: '获取验证码',
    btnDisabled: false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup',
    },
    aliUserId: '000',
    wxOpenId: '000',
    captchaShow: false,
    captchaReload: false,
    clickTime: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },

  setUser(user) {
    Common.setStorage('user', user)
  },

  gotoUserCenter() {
    wx.switchTab({
      url: '/pages/personacenter/personacenter'
    })
  },
  async doRegister() {
    let { inputVal, wxOpenId, aliUserId, referCellPhone } = this.data
    let url = `${Api.customer.userRegister1}`
    let params = {
      password: inputVal.pw,
      cellPhone: inputVal.phone,
      authCode: inputVal.code
    }

    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    try {
      let registerResult = await Common.ajax.post(url, reqParams)
      let customerCode = registerResult.message
      Common.setCustomerCode(customerCode)
      this.gotoUserCenter()
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
  },
  getRegister() {
    let _this = this
    if (_this.clickTime == 1) {
      return
    } else if (!Utils.validatePhoneNum(_this.data.inputVal.phone)) {
      wx.showToast({
        title: '*请输入正确的手机号码!',
        icon: 'none'
      })
    } else if (!_this.data.inputVal.code) {
      wx.showToast({
        title: '*请输入验证码',
        icon: 'none'
      })
    } else if (!_this.data.inputVal.pw || !_this.data.inputVal.pw2) {
      wx.showToast({
        title: '*请输入密码',
        icon: 'none'
      })
    } else if (!Utils.isNumberOr(_this.data.inputVal.pw)) {
      wx.showToast({
        title: '*密码格式不正确',
        icon: 'none'
      })
    } else if (_this.data.inputVal.pw != _this.data.inputVal.pw2) {
      wx.showToast({
        title: '*二次密码输入不一致',
        icon: 'none'
      })
    } else {
      _this.setData({
        clickTime: 1,
      })

      this.doRegister()


    }
  },
  modifyInput(e) {
    let _this = this
    let vals = _this.data.inputVal
    let id = e.currentTarget.id
    vals[id] = e.detail.value
    _this.setData({
      inputVal: vals
    })
  },
  getCodes() {
    let _this = this
    if (!Utils.validatePhoneNum(_this.data.inputVal.phone)) {
      wx.showToast({
        title: '*请输入正确的手机号码',
        icon: 'none'
      })
      return
    } else {
      _this.setData({
        captchaShow: true
      })
      console.log(0)
    }
  },
  // 验证码成功回调
  captchaSuccess: function (token) {
    let _this = this
    console.log('token:', token)
    console.log(token.detail)
    _this.setData({
      captchaShow: false
    })
    Common.codeTime(_this)
    let datas = {
      cellPhone: _this.data.inputVal.phone,
      type: '6',
      token: token.detail
    }
    Common.NewAuthCode(datas)
  },
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
    console.log('captcha_hide')
  },

})