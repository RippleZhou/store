const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global
Page({
  data: {
    empty: true,
    list:[]
  },
  showEmpty() {
    this.setData({
      empty: true
    })
  },
  hideEmpty(){
    this.setData({
      empty: false
    })
  },
  async updateMessage() {
    let url = Api.message.getMessageReadState
    let customerCode = Common.getCustomerCode()
    let params = {
      customerCode
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    let res = await Common.ajax.post(url, reqParams)
  },

  async getExpresInfoList() {
    let url = Api.message.getExpresInfoList
    let customerCode = Common.getCustomerCode()
    let params = {
      customerCode,
      limit: 10,
      offset: 0
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    let res = await Common.ajax.post(url, reqParams)
    res.rows.length == 0 ? this.hideEmpty() : this.showEmpty()
    this.setData({
      list:res.rows
    })
  },
  onLoad: function (options) {
    this.updateMessage()
    this.getExpresInfoList()
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