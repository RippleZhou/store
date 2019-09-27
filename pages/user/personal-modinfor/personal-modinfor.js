// pages/user/personal-modinfor/personal-modinfor.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    sexArry: ['未设置', '男', '女'],
    userImg: 'https://v.3721zh.com/static/img/bean_detail_logo.d3495ac.png',
    nickName: '',
    sexType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    if (!Common.biz.loggedIn(Common.getRoute())) {
      return;//检查登录
    }
    let customerCode = Common.getStorage('customerCode')
    let MD5signStr = Common.md5sign({
      customerCode: customerCode
    });
    Common.request.post(Api.customer.getUserCenter + '?customerCode=' + customerCode + '&sign=' + MD5signStr, {},
      function (data) {
        console.log(data)
        if (data.status == 'OK') {
          var indx = data.message.sexType
          _this.setData({
            nickName: data.message.nickName,
            userImg: data.message.imageUrl,
            index: indx
          })
        }
      })
  },
  bindSexChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  nNicks: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  saveInfor() {
    let _this = this
    let customerCode = Common.getStorage('customerCode')
    let MD5signStr = Common.md5sign({
      customerCode: customerCode,
      nickName: _this.data.nickName,
      sexType: _this.data.index.toString()
    });
    Common.request.post(Api.customer.setUserInfo, {
      customerCode: customerCode,
      nickName: _this.data.nickName,
      sexType: _this.data.index.toString(),
      sign: MD5signStr
    },
      function (data) {
        if (data.status == 'OK') {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/personacenter/personacenter',
            })
          }, 3000)
        }
      })
  }
})