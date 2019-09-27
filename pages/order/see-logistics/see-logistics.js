　// pages/order/see-logistics/see-logistics.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    item:[]
  },
  onLoad: function (options) {
    //  options.expressNo
    var orderIds = options.orderId
    this.getList(orderIds)
  },
  getList(orderIds){
    let _this = this
    var url = Api.order.getExpressInfo
    Common.request.get(url, { orderIds: orderIds }, function (data) {
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
  },
})