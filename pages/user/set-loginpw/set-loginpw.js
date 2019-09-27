// pages/user/set-loginpw/set-loginpw.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwItem: {
      logpw: '',
      aginlogpw: ''
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  defautValue: function (e) {
    var _this = this
    var pws = _this.data.pwItem
    var id = e.currentTarget.id
    pws[id] = e.detail.value
    _this.setData({
      pwItem: pws
    })
  },
  setlogpw() {//设置登录密码
    let _this = this
    
    if (!_this.data.pwItem.logpw || !_this.data.pwItem.aginlogpw) {
      wx.showToast({
        title: '*支付密码不能为空',
        icon: 'none'
      })
    } else if (_this.data.pwItem.logpw != _this.data.pwItem.aginlogpw) {
      wx.showToast({
        title: '*两次密码不一致',
        icon: 'none'
      })
    } else {
      let customerCode = Common.getStorage('customerCode')
      
      let params=  {
        customerCode: customerCode,
        oldPassword:'',
        newPassword: _this.data.pwItem.logpw
      }
      let MD5signStr = Common.md5sign(params);
      let reqParams = { sign: MD5signStr, ...params }
      let url = Api.customer.setPassWord + '?sign=' + MD5signStr + '&oldPassword=&customerCode=' + customerCode + '&newPassword=' + _this.data.pwItem.logpw
      Common.request.post(url, {}, function (data) {
        if (data.status == "OK") {
          wx.showToast({
            title: '支付密码设置成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/personacenter/personacenter',
            })
          }, 1500)

        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
      
    }
  }

})