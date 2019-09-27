// pages/order/returns-details/returns-details.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    items:[]
  },
  onLoad: function (options) {
    let ids = options.orderId//'394048'
    this.getList(ids)
  },
  onShow: function () {

  },
  getTels(){
    Common.getTels()
  },
  getList(ids){//获取数据
    let _this = this
    var MD5signStr = Common.md5sign({ orderId: ids });
    var url = Api.order.orderDetail + '?orderId=' + ids + '&sign=' + MD5signStr
    Common.request.get(url, {}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        console.log(list)
        _this.setData({
          items: list
        })
      } else {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817',
          success(res) {
            wx.navigateTo({
              url: '/pages/order/all-orders/all-orders?curtab=0&states=0',
            })
          }
        })
      }
    })
  },
  goLogistics(e) {//填写物流信息
    wx.navigateTo({
      url: '/pages/order/fill-logistics/fill-logistics?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  cancelReturnedGoods(e) {//取消退/换货
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '是否确认取消退换货？',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: e.currentTarget.dataset.orderid}
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.order.cancelReturnedGoods, parms, function (data) {
          if (data.status == 'OK') {
            wx.showModal({
              content: data.message,
              confirmColor: '#E61817',
              showCancel: false,
              success(res) {
                wx.navigateTo({
                  url: '/pages/order/returns/returns',
                })
              }
            })

          } else {
            wx.showModal({
              content: data.message,
              showCancel: false,
              confirmColor: '#E61817'
            })
          }
        })
      }
    })
  }
})