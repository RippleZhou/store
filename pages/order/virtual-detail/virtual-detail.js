// pages/order/virtual-detail/virtual-detail.js
const Common = require('../../../utils/common')
var Utils=require('../../../utils/util')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    item:{},
    proPrice:0,
    codeIsShow:false,
    codeImg:'',
    orderCode:''
  },
  onLoad: function (options) {
    var ids = options.orderCode
    this.setData({
      orderCode:ids
    })
    this.getList(ids)
  },
  getTels(){//客服
    Common.getTels()
  },
  handleCopy(e){//复制
    var code = e.currentTarget.dataset.vircode
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  showCpdes(e){//显示二维码
    var codeImg=e.currentTarget.dataset.codeimg
    this.setData({
      codeIsShow:true,
      codeImg: codeImg
    })
  },
  colseCode(){//关闭
    this.setData({
      codeIsShow: false
    })
  },
  goReturnDetail(e){//退款详情
    var virState=e.currentTarget.dataset.status
    var refundId=e.currentTarget.dataset.ids
    if (virState == 3 || virState == 4 || virState == 5){
      wx.navigateTo({
        url: '/pages/order/virreturn-detail/virreturn-detail?refundId=' + refundId,
      })
    }
  },
  getList(orderCode) {//详情列表
    let _this = this
    var user = app.globalData.userInfo
    var url = Api.find.getVirOrderDetail
    Common.request.get(url, { orderCode: orderCode}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        console.log(list)
        _this.setData({
          item: list,
          proPrice: Utils.floatMul(list.sellPrice, list.productNum)
        })
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
  delOrder() {//删除订单
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '确认删除订单？删除后将不可恢复。',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) {
          return
        }
        var parms = { orderCode: _this.data.orderCode }
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.find.delOrder, parms, function (data) {
          if (data.status == 'OK') {
            wx.showModal({
              content: data.message,
              confirmColor: '#E61817',
              showCancel: false,
              success(res) {
                wx.navigateTo({
                  url: '/pages/order/all-orders/all-orders?curtab=2&states=0',
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
  getRefudInfo(){//申请退款
    var _this = this
    var parms = { orderCode: _this.data.orderCode }
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.find.getReundNum, parms, function (data) {
      if (data.status == 'OK') {
        wx.showModal({
          content: '您已经频繁取消该订单' + data.refundNum + '次,接下来要收取%' + data.refundRate + '的手续费,是否继续？', confirmColor: '#E61817',
          success(res) {
            if (res.cancel) { return }
            wx.navigateTo({
              url: '/pages/order/fill-refund/fill-refund?orderCode=' + _this.data.orderCode,
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/order/fill-refund/fill-refund?orderCode=' + _this.data.orderCode,
        })
      }
    })
  },
  refundSchedule() {//退款进度
    wx.navigateTo({
      url: '/pages/order/refund-schedule/refund-schedule?orderCode=' + _this.data.orderCode,
    })
  },
  cancelOrder() {//取消订单
    var _this = this
    wx.showModal({
      content: '确认取消该订单吗?',
      confirmColor: '#E61817',
      success(res) {
        if (res.cancel) { return }
        var parms = { orderCode: _this.data.orderCode }
        var MD5signStr = Common.md5sign(parms);
        parms.sign = MD5signStr
        Common.request.post(Api.find.cancelOrder, parms, function (data) {
          if (data.status == 'OK') {
            wx.showToast({ title: data.message, icon: 'none' })
            setTimeout(function () {
              _this.getList(_this.data.orderCode)
            }, 1000)
          } else {
            wx.showToast({ title: data.message, icon: 'none' })
          }
        })
      }
    })
  },
  continuePay() {//立即付款------未完
  console.log('weilkk')
    let _this = this
    var user = app.globalData.userInfo
    var parms = { customerId: user.id.toString(), orderCode: _this.data.orderCode, openId: user.wxOpenId, aliUserId: user.aliUserId.toString(),payMethod: '2' }
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.find.continuePay, parms, function (data) {
      console.log(data)
      if (data.status == 'OK') {
        if (data.message.allinPay == null){
          console.log("Fail")
          return
        }
        let payInfo = JSON.parse(JSON.parse(data.message.allinPay.message).payInfo)
        console.log(payInfo)
        Common.callPay(payInfo, 3).then(data => {
          _this.clickTime = 0
        });
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
})