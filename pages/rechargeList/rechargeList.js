// pages/rechargeList/rechargeList.js

const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

var {
  regeneratorRuntime
} = global

Page({
  data: {
    list: [],
    nodata:false
  },
  async getData() {
    let url = Api.customer.getRechargeList
    let customerCode = Common.getCustomerCode()
    var parms = { 
      customerCode, 
      offset: 0, 
      limit:10 
      }
    var MD5signStr = Common.md5sign(parms);

    let params = Object.assign(parms, {sign: MD5signStr})
    
   let res= await Common.ajax.post(url, params)

   this.setData({
     nodata: res.rows.lenght == 0 ? false : true,
     list:res.rows.map(k=>{
       let dt = new Date(k.payDate)
       var month = ('0' + (dt.getMonth() + 1)).slice(-2);
       var day = ('0' + dt.getDate()).slice(-2);
       var hour = ('0' + dt.getHours()).slice(-2);
       var minute = ('0' + dt.getMinutes()).slice(-2);
       k.payDate_show = `${month}月${day}日  ${hour}:${minute}`

       return k;
     })
   })
  },
  onLoad: function(options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})