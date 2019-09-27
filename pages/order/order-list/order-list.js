// pages/order/order-list/order-list.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderGroupId:null,
    caorderid:null,
    itemList:{},//总列表
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    orderStateName:'',
    orderStateTxt:'',
    orderState:null,
    cancelList:{},//取消原因列表
    expressFeeCount:0,
    expressBean:0,
    refundAmount:0,
    refundConverBean:0,
    cancelType:0
  },
  onLoad: function (options) {
    let ids = options.orderGroupId
    let _this= this
    _this.setData({ orderGroupId:ids})
    _this.getList(_this.data.orderGroupId)
    _this.getCancelList()
  },
  onShow: function () {

  },
  getTels() {//客服
    Common.getTels()
  },
  confirmReceipt(e){//确认收货
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    var user = app.globalData.userInfo
    wx.showModal({
      content: '是否确认收货?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: orderId, userId: user.id.toString() }
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
  payShows() {//立即付款------未完
    let _this = this
    var orderGroupId = _this.data.orderGroupId
    var user = app.globalData.userInfo
    console.log(user.wxOpenId)
    if (orderGroupId == null || orderGroupId == undefined || orderGroupId==''){return}
    var parms = { orderGroupId: orderGroupId, userId: user.id.toString(), payMethod: 2, openId: user.wxOpenId}
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.order.orderpay, parms, function (data) {
      if (data.status == 'OK') {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
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
  goReturn(e) {//退/换货
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/order/apply-return/apply-return?orderId=' + orderId,
    })
  },
  goSeeLogis(e) {//查看物流
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/order/see-logistics/see-logistics?orderId=' + orderId,
    })
  },
  goLogistics(e){//填写物流信息
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/order/fill-logistics/fill-logistics?orderId=' + orderId,
    })
  },
  cancelReturnedGoods(e){//取消退换货
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    var user = app.globalData.userInfo
    wx.showModal({
      content: '是否确认取消退换货?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderId: orderId, userId: user.id.toString() }
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
  getList(ids){//获取数据列表
    let _this = this
    var user = app.globalData.userInfo
    var MD5signStr = Common.md5sign({ orderGroupId: ids });
    var url = Api.order.getOrderGroupList + '?orderGroupId=' + ids + '&sign=' + MD5signStr
    Common.request.get(url,{}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        console.log(list)
        _this.setData({
          itemList:list,
          orderState: list.orderList[0].orderState
        })
      }else{
        wx.navigateTo({
          url: '/pages/order/all-orders/all-orders?curtab=0&states=0',
        })
      }
    })
  },
  delOrder(e){//删除订单
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    var user = app.globalData.userInfo
    wx.showModal({
      content: '您确定要删除吗?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel){
          return
        }
        let customerCode = Common.getCustomerCode()
        var parms = { orderId: orderId, customerCode}
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
    let parms ={
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
      }else{
        wx.showModal({
          content: data.message,
          showCancel:false,
          confirmColor:'#E61817'
        })
      }
    })

  },
  cancelShows(e){//取消订单原因展示
    let _this = this
    var orderId = e.currentTarget.dataset.orderid
    console.log(orderId)
    this.setData({
      caorderid: orderId
    })
    _this.getDeductionCost(orderId)

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
        if (item.expressFee!=undefined){
          _this.setData({
            expressFeeCount: item.expressFee,
            expressBean: item.expressBean,
            refundAmount: item.refundAmount,
            refundConverBean: item.refundConverBean
          })
        }
        if (_this.data.expressFeeCount>0){
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
          cancelList:list
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
  errImg: function (e) {
    let _this = this
    Common.errImgFun(e, _this)
  },
})