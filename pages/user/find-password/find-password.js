// pages/find-password/find-password.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal:{
      phone:'',
      code:''
    },
    codeTxt:'获取验证码',
    btnDisabled:false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
    captchaShow: false,
    captchaReload: false,
    clickTime: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  nextPage(){
    let _this = this
    if (_this.clickTime == 1) {
      return
    }
    else if (!_this.data.inputVal.phone) {
      wx.showToast({
        title: '*手机号码不能为空',
        icon: 'none'
      })
    } else if (!_this.data.inputVal.code){
      wx.showToast({
        title: '*请输入验证码',
        icon: 'none'
      })
    }else{
      _this.setData({
        clickTime: 1,
      })
      let MD5signStr = Common.md5sign({
        cellPhone: _this.data.inputVal.phone,
        authCode: _this.data.inputVal.code
      });
      Common.request.post(Api.customer.checkAuthCodeInfo + '?sign=' + MD5signStr + '&cellPhone=' + _this.data.inputVal.phone + '&authCode=' + _this.data.inputVal.code, {}, function (data){
        if (data.status == 'OK'){
          Common.setCustomerCode(data.message)
          wx.navigateTo({
            url: '/pages/user/find-passwordnext/find-passwordnext?tel=' + _this.data.inputVal.phone,
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  modifyInput(e){
    let _this = this
    let vals = _this.data.inputVal
    let id = e.currentTarget.id
    vals[id] = e.detail.value
    _this.setData({
      inputVal: vals
    })
  },
  getCodes(){
    let _this = this
    if (!_this.data.inputVal.phone){
      wx.showToast({
        title: '*手机号码不能为空',
        icon: 'none'
      })
      return
    }else{
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
    let datas = { cellPhone: _this.data.inputVal.phone, type: '3', token: token.detail }
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