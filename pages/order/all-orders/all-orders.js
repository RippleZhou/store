// pages/order/all-orders/all-orders.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    headTab:['线上订单','线下订单','虚拟订单'],
    currentTab: null,
    states:null,
    noMores:'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_02.png'
  },
  onLoad: function (options) {
    if (options.curtab == undefined || options.states==undefined){
      options.states=0
      options.curtab=0
    }
    
    this.setData({
      currentTab: options.curtab,
      states: options.states
    })
    console.log(options.curtab, options.states)
  },
  onShow: function () {
  },
  getTels(){//客服
    Common.getTels()
  },
  clickHeadTab(e){
    let _this = this
    let dataIndex = e.currentTarget.dataset.index
    if (_this.data.currentTab == dataIndex)return
    _this.setData({
      currentTab: dataIndex,
    })
  },

  
})