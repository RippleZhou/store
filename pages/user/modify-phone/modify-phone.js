// pages/modifyPhone/modifyPhone.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeTxt:'获取验证码',
    btnDisabled:false,
    modifyPhone:null,
    pcodes:'',
    isRightPhone:true,
    wmodTip:false,
    wtipTxt:'',
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
    captchaShow: false,
    captchaReload: false,
    clickTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  modifyPhone: function (e) {
    this.setData({
      modifyPhone: e.detail.value,
      isRightPhone: /^[1][0-9]{10}$/.test(e.detail.value)
    })
  },
  pcodes:function(e){
    this.setData({
      pcodes: e.detail.value
    })
  },
  setmodify(){//确认修改
    let _this = this
    if (_this.clickTime==1){
      return
    } else if (_this.modifyPhone == null || _this.modifyPhone==""){
      _this.setData({
        wmodTip: true,
        wtipTxt: '*手机号码不能为空'
      })
    } else if (_this.pcodes==''){
      _this.setData({
        wmodTip: true,
        wtipTxt: '*验证码错误，请重新输入'
      })
    }else{
      _this.setData({
        clickTime: 1,
      })
      let MD5signStr = Common.md5sign({
        cellPhone: _this.data.modifyPhone,
        customerId: app.globalData.userInfo.id.toString(),
        authCode: _this.data.pcodes
      });
      Common.request.post(Api.newCustomer.changeCellPhone,{
        cellPhone: _this.data.modifyPhone,
        customerId: app.globalData.userInfo.id.toString(),
        authCode: _this.data.pcodes,
        sign: MD5signStr
      },function(data){
        if (data.status=="OK"){
          _this.setData({
            clickTime: 0,
          })
          wx.showModal({
            content: data.message,
            showCancel: false,
            confirmColor: '#e61817',
            success:function(e){
              wx.navigateTo({
                url: '/pages/user/personalset/personalset',
              })
            }
          })
          
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none',
          })
        }
      })
    }
    // _this.setData({
    //   captchaReload:true
    // })
  },
  getCodes(){//获取验证码
    let _this = this
    if (_this.data.modifyPhone == null){
      _this.setData({
        wmodTip:true,
        wtipTxt:'*手机号码不能为空'
      })
      return
    }
    else if (!_this.data.isRightPhone){
      _this.setData({
        wmodTip: true,
        wtipTxt: '手机号码格式不正确'
      })
      return
    }else{
      let MD5signStr = Common.md5sign({
        cellPhone: _this.data.modifyPhone
      });
      Common.request.post(Api.customer.checkIsLogin + '?sign=' + MD5signStr + '&cellPhone=' + _this.data.modifyPhone,
      {},
      function(res){
        if (res.status == 'OK'){
          _this.setData({
            captchaShow: true
          })
        }else{
          _this.setData({
            wmodTip: true,
            wtipTxt: '手机号码已注册'
          })
        }
      })
      
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
    // Common.codeTime(_this)
    Common.codeTime(_this)
    let datas = { cellPhone: _this.data.modifyPhone, type: '6', token: token.detail }
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