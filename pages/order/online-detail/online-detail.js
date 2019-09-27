// pages/order/online-detail/online-detail.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    orderId:null,
    orderGroupId:null,
    items:{},
    cancelList: {},//取消原因列表
    expressFeeCount: 0,
    expressBean: 0,
    refundAmount: 0,
    refundConverBean: 0,
    cancelType: 0,
    caorderid: null,
  },
  onLoad: function (options) {
    let _this =this
    //options.orderId
    var orderId = 49383;
    _this.setData({
      orderId: options.orderId,
      orderGroupId: options.orderGroupId
    })
    _this.getList(_this.data.orderId)
    _this.getCancelList()
  },
  onShow: function () {

  },
  getTels() {//客服
    Common.getTels()
  },
  getList(ids){//详情列表
    let _this = this
    var user = app.globalData.userInfo
    var MD5signStr = Common.md5sign({ orderId: ids });
    var url = Api.order.orderDetail + '?orderId=' + ids + '&sign=' + MD5signStr
    Common.request.get(url, {}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        console.log(list)
        _this.setData({
          items:list
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
  goSeeLogis(){//查看物流
    let _this =this
    console.log(_this.data.items.sendGoods.expressNo)
    wx.navigateTo({
      url: '/pages/order/see-logistics/see-logistics?orderId=' + _this.data.items.orderId + '&expressNo=' + _this.data.items.sendGoods.expressNo,
    })
  },
  goReturn(){//退换货
    let _this = this
    wx.navigateTo({
      url: '/pages/order/apply-return/apply-return?orderId=' + _this.data.items.orderId,
    })
  },
  goLogistics() {//填写物流信息
    let _this = this
    wx.navigateTo({
      url: '/pages/order/fill-logistics/fill-logistics?orderId=' + _this.data.items.orderId,
    })
  },
  cancelReturnedGoods() {//取消退换货
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '此订单确定取消退/换货吗?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: _this.data.items.orderId, userId: user.id.toString() }
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.order.cancelReturnedGoods, parms, function (data) {
          if (data.status == 'OK') {
            wx.navigateTo({
              url: '/pages/order/returns/returns',
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
  },
  confirmReceipt() {//确认收货
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '是否确认收货?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: _this.data.items.orderId, userId: user.id.toString(), sendGoodsId: _this.data.items.sendGoods.sendGoodsIds}
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.order.receiveGoods, parms, function (data) {
          if (data.status == 'OK') {
            _this.getList(_this.data.orderGroupId)
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
  },
  delOrder() {//删除订单
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '您确定要删除吗?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: _this.data.items.orderId, userId: user.id.toString() }
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.order.hideOrder, parms, function (data) {
          if (data.status == 'OK') {
            wx.showModal({
              content: data.message,
              confirmColor: '#E61817',
              showCancel: false,
              success(res) {
                wx.navigateTo({
                  url: '/pages/order/all-orders/all-orders?curtab=0&states=0',
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
  },
  cancelOrder() {//取消订单
    let _this = this
    var user = app.globalData.userInfo
    let parms = {
      orderGroupId: _this.data.orderGroupId,
      orderIds: _this.data.caorderid,
      expressFee: _this.data.expressFeeCount,
      expressBean: _this.data.expressBean,
      refundAmount: _this.data.refundAmount,
      refundConverBean: _this.data.refundConverBean,
      userId: user.id.toString(),
      cancelType: _this.data.cancelType
    }
    var MD5signStr = Common.md5sign(parms)
    parms.sign = MD5signStr
    Common.request.post(Api.order.cancelOrder, parms, function (data) {
      if (data.status == 'OK') {
        wx.showModal({
          content: data.message,
          confirmColor: '#E61817',
          success(res) {
            _this.getList(_this.data.orderGroupId)
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

  },
  cancelShows() {//取消订单原因展示
    let _this = this
    this.setData({
      caorderid: _this.data.items.orderId
    })
    _this.getDeductionCost(_this.data.items.orderId)

  },
  getDeductionCost(orderId) {//获取扣除的运费
    let _this = this
    _this.setData({
      expressFeeCount: 0,
      expressBean: 0,
      refundAmount: 0,
      refundConverBean: 0
    })
    Common.request.get(Api.order.getDeductionCost + '?orderGroupId=' + _this.data.orderGroupId + '&orderIds=' + orderId, {}, function (data) {
      if (data.status == 'OK') {
        var item = data.message
        if (item.expressFee != undefined) {
          _this.setData({
            expressFeeCount: item.expressFee,
            expressBean: item.expressBean,
            refundAmount: item.refundAmount,
            refundConverBean: item.refundConverBean
          })
        }
        if (_this.data.expressFeeCount > 0) {
          wx.showModal({
            content: '取消该商品后，此订单金额将不满足包邮金额，需扣除运费' + _this.data.expressFeeCount + '元',
            success(res) {
              if (res.confirm) {
                _this.cancelOrder()
              }
            }
          })
        }
        if (_this.data.expressBean > 0) {
          wx.showModal({
            content: '取消该商品后，此订单金额将不满足包邮金额，需扣除运费' + _this.expressBean + '粒豆',
            success(res) {
              if (res.confirm) {
                _this.cancelOrder()
              }
            }
          })
        }
        console.log(data)
      }
    })
  },
  getCancelList() {//获取取消原因
    let _this = this
    Common.request.get(Api.order.getReasons, {}, function (data) {
      if (data.status == 'OK') {
        console.log(data.message)
        let list = data.message
        _this.setData({
          cancelList: list
        })
      }
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let type = e.detail.value
    this.setData({
      cancelType: parseInt(type) + 1
    })
    this.cancelOrder()
  },
})