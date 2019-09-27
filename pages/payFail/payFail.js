// pages/payFail/payFail.js

const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

let { regeneratorRuntime } = global

Page({
  data: {
    isPayOk: false,
    fromType: 0,
    list: [],
    linkTxt: '重新支付',
    setTitName: '支付失败'
  },
  init: function ({ fromType, isPayOk }) {
    let linkTxt=''
    let setTitName=''

    if (isPayOk == 'false') {
        linkTxt='重新支付',
        setTitName="支付失败"
        this.setData({
          fromType
        })
    } else {
      if (fromType == 1 || fromType == 2 || fromType == 3) {
          linkTxt='查看订单',
          setTitName='支付成功'
      } else {
          linkTxt='充值记录',
          setTitName='充值成功'
      }
    }

    this.setData({
      isPayOk,
      linkTxt,
      setTitName
    })
  },
  gotoOrder(type,virtab){
    console.log('gotoorder:',type,virtab)
    // let _virtab= 0  //线上订单
    // let _type=1 ; //全部 
    wx.navigateTo({
      url: `/pages/order/all-orders/all-orders?curtab=${virtab}&states=${type}`
    })
  },
  gotoChargeBean(){
    wx.navigateTo({
      url: '/pages/chargeBean/chargeBean',
    })
  },
  gotoRechargeList(){
    wx.navigateTo({
      url: '/pages/rechargeList/rechargeList',
    })
  },
  payGolinks() {
    let {linkTxt, fromType} = this.data

    if (linkTxt == '重新支付') {
      console.log('重新支付：', fromType)
      if (fromType == 1 || fromType == 2) {
        this.gotoOrder(1,0)
      }else if (fromType == 3) {
        this.gotoOrder(1, 2)
      } else if (fromType == 11) {
        this.gotoChargeBean()
      }
    } else if (linkTxt == '查看订单') {
      if (this.fromType == 3) {
        this.gotoOrder(0,2)
      } else {
        this.gotoOrder(0, 0)
      }
    } else if (linkTxt == '充值记录') {
        this.gotoRechargeList()
    }
  },
  gotoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  goProView(e) {
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: `/pages/product/product-view/product-view?productId=${pid}`
    })
  },
  async getData() {
    let url = Api.product.queryLike
    let params = { type: 1 }
    let res = await Common.ajax.get(url, params)
    console.log('rrrrr:', res.message.homeRecommend)
    this.setData({
      list: res.message.homeRecommend
    })
  },
  onLoad(options) {
    var { isPayOk, fromType} = options

    console.log('options:',options)

    this.init({ fromType, isPayOk})
    this.getData()
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