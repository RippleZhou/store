// pages/turnBeans/turnBeans.js

const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    setTitName: '我要转豆',
    value01: '',
    popShows: false,
    popTips: ''
  },

  phoneInput(e) {
    let phone = e.detail.value
    console.log(phone)
    if (phone) {
      this.setData({
        phone,
        canUse: true
      })
    } else {
      this.setData({
        phone,
        canUse: false
      })
    }
  },
  async sumbitPs() {
    let { phone } = this.data
    let customerCode = Common.getCustomerCode()
    let userResult = await Common.getUser(customerCode)
    if (!phone) {
        return;
    } else{
      let reg = /^1[3456789]\d{9}$/;
      if (!reg.test(phone)) {
        Common.showModel('手机格式不正确')
      } else if (phone == userResult.userName) {
        Common.showModel('转豆双方账号不能是同一账号')
      } else {
        wx.navigateTo({
          url: `/pages/turnBeanNums/turnBeanNums?phone=${phone}`,
        })
      }
    }
  },
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})