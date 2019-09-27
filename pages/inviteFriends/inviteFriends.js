// pages/inviteFriends/inviteFriends.js

const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global


Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitedNum:0,
    gainAmount:0,
    showQRcode: false,
    msgList: [
      { url: "url", title: "张**邀请张**并获得20元" },
      { url: "url", title: "刘**邀请李**并获得20元" },
      { url: "url", title: "郭**邀请张**并获得20元" },
      { url: "url", title: "白**邀请靳**并获得20元" },
      { url: "url", title: "孙**邀请赵**并获得20元" },
      { url: "url", title: "周**邀请王**并获得20元" }]
  },
  showCode() {
    this.setData({
      showQRcode: true
    })
  },
  hideMask() {
    this.setData({
      showQRcode: false
    })
  },
  async getInviteInfo() {
    let url = Api.message.getInviteInfo
    if (!Common.biz.loggedIn(Common.getRoute())) return;//检查登录
    let user = app.globalData.user
    let params = {
      customerCode: Common.getCustomerCode()
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = Object.assign(params, { sign: MD5signStr })

    let res = await Common.ajax.post(url, reqParams)
    let  gainAmount = res.message.gainAmount
    let  invitedNum  = res.message.invitedNum

    this.setData({
      gainAmount, invitedNum
    })
    console.log(res)
  },
  onLoad: function (options) {
    this.getInviteInfo()
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