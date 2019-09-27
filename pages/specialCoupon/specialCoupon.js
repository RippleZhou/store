// pages/specialCoupon/specialCoupon.js

const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global

Page({
  data: {
    imgsrc: ''
  },
  async clickBargain(e) {//砍价
    let user = app.globalData.userInfo
    let item = e.currentTarget.dataset.item
    console.log('item:', item)
    let list = {}
    list['virProductId'] = '578978668773113856' || item.virProductId
    list['userId'] = user.id

    let MD5signStr = Common.md5sign(list);
    list["sign"] = MD5signStr

    let url = Api.find.bargain
    try {
      let res = await Common.ajax.post(url, list)

      wx.showToast({
        title: res.message
      })
      wx.showToast({
        title: '您已成功砍掉了' + parseFloat(res.message.bargainAmount) + '元！',
      })
    } catch (err) {
      wx.showToast({
        title: err.message
      })
    }

  },

  confirmOrder(e) {
    let vid = e.currentTarget.dataset.vid
    wx.navigateTo({
      url: `/pages/order/bargain-confirm-order/bargain-confirm-order?vid=${vid}&currency=1`,
    })
  },

  async getDetails(vid) {
    console.log(vid)
    let url = Api.find.virProductCurrencyDetail
    let params = {
      userId: app.globalData.userInfo.id,
      virProductId: '578978668773113856'
    }
    try {
      let res = await Common.ajax.post(url, params)

      this.setData({
        details: res.message,
        imgsrc: res.message.imageUrls[0]
      })
    } catch (err) {
      wx.showModal({
        title: err.message,
        showCancel: false,
        success(){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }

  },
  onLoad: function (options) {
    let vid = options.vid
    this.getDetails(vid)
  },

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