// pages/news/news.js
Page({
  data: {
    show: false,
  },
  onLoad: function (options) {

  },
  gotoLogisticsMessage(){
    wx.navigateTo({
      url: '/pages/logisticsMessage/logisticsMessage',
    })
  },
  gotoPreferentialPromotion(){
    wx.navigateTo({
      url: '/pages/preferentialPromotion/preferentialPromotion',
    })
  },
  gotoAccountMessage(){
    wx.navigateTo({
      url: '/pages/accountMessage/accountMessage',
    })
  },
  gotoTransactionMessage() {
    wx.navigateTo({
      url: '/pages/transactionMessage/transactionMessage',
    })
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