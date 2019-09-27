// pages/order/virreturn-detail/virreturn-detail.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    item:[]
  },
  onLoad: function (options) {
    console.log(options)
    let refundId = options.refundId
    this.getDetail(refundId)
  },
  getTels() {//客服
    Common.getTels()
  },
  getDetail(refundId){
    let _this = this
    var url = Api.find.getVirOrderRefundDetail
    Common.request.get(url, { refundId: refundId }, function (data) {
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