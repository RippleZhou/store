// pages/order/refund-schedule/refund-schedule.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    orderCode:'',
    item:[],
    imgUrl:'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_08.png'
  },
  onLoad: function (options) {
    var ids = options.orderCode
    this.setData({
      orderCode:ids
    })
    this.getList(ids)
  },
  getTels() {//客服
    Common.getTels()
  },
  goDetail(e){
    var refundId = e.currentTarget.dataset.refid
    wx.navigateTo({
      url: '/pages/order/virreturn-detail/virreturn-detail?refundId=' + refundId,
    })
  },
  getList(orderCode){//获取列表
    let _this = this
    var url = Api.find.getVirOrderRefundProcess
    Common.request.get(url, { orderCode: orderCode }, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        
        _this.setData({
          item: list
        })
        console.log(_this.data.item)
      } else {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817',
          success(res) {
            wx.navigateTo({
              url: '/pages/order/all-orders/all-orders?curtab=2&states=0',
            })
          }
        })
      }
    })
  }
})