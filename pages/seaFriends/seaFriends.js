// pages/seaFriends/seaFriends.js
const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global



Page({
  data: {
    empty: false
  },
findFriend(){
  wx.navigateTo({
    url: "/pages/inviteFriends/inviteFriends",
  })
},
  async getList() {
    let url = Api.borrow.getBorrowBeanList

    let customerCode = Common.getCustomerCode()
 
    let params={
      customerCode,
      limit: 10000,
      offset: 0,
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = Object.assign(params, { sign: MD5signStr })
    // let params = {
    //   bwUserId: 140,
    //   limit: 10000,
    //   offset: 0,
    //   sign: "A68066095DAD7D74D09934BB32C041C5"
    // }

    let res = await Common.ajax.post(url, reqParams)
    if (res.rows.length > 0) {
      this.setData({
        items: res.rows,
        empty: false
      })
    } else {
      this.setData({
        empty: true
      })
    }

    console.log('res::', res)
  },
  onLoad: function (options) {
    this.getList()
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