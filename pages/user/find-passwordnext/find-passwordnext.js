// pages/user/find-passwordnext/find-passwordnext.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
const { regeneratorRuntime } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pws: {
      newpw: '',
      aginpw: ''
    },
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      tel: options.tel
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  defautValue: function (e) {
    var _this = this
    var pws = _this.data.pws
    var id = e.currentTarget.id
    pws[id] = e.detail.value
    _this.setData({
      pws: pws
    })
  },
  async setpw() {//新密码
    console.log('setpw')
    let _this = this
    if (!_this.data.pws.newpw || !_this.data.pws.aginpw) {
      wx.showToast({
        title: '*密码不能为空',
        icon: 'none'
      })
    } else if (_this.data.pws.newpw != _this.data.pws.aginpw) {
      wx.showToast({
        title: '*两次密码不一样',
        icon: 'none'
      })
    } else {
    
      let customerCode = Common.getStorage('customerCode')
      if (customerCode == null || customerCode == undefined || customerCode==''){
        wx.showToast({
          title: '请先验证',
          icon: 'none'
        })
        return
      }
      
      let params = {
        customerCode: customerCode,// 'FSD6XNE4XE7PI',
        oldPassword:'',
        newPassword: _this.data.pws.newpw
      }
      let MD5signStr = Common.md5sign(params);
      let url = Api.customer.setPassWord + '?sign=' + MD5signStr + '&oldPassword=&customerCode=' + customerCode + '&newPassword=' + _this.data.pws.newpw
      let reqParams = { sign: MD5signStr, ...params }
      let setPasswordResult = await Common.ajax.post(url, {},{},{},2)
      Common.removeCustomerCode('customerCode')
      setTimeout(function(){
        if (!Common.biz.loggedIn(Common.getRoute())) {
          return;//检查登录
        } else {
          wx.navigateTo({
            url: '/pages/user/login/login?jumpUrl=' + encodeURIComponent(Common.getRoute()),
          })
        }
      },100)
      
    }
  }
})