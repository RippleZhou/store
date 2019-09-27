// components/order/virtual-order/virtual-order.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Component({
  properties: {
    states: Number,
    noMores: String
    //组件的属性列表
  },
  data: {
    orderTab: ['全部', '待付款', '未使用', '已使用', '退款/售后'],
    virtualItem: [],
    offset: 0,
    limit: 10,
    noPage: 0,
    isShows: true,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    tipTxt: ''
  },
  attached() {
    this.getList(this.data.states)
  },
  //组件的方法列表
  methods: {
    clickTab(e) {//点击时切换
      let _this = this
      let dataIndex = e.currentTarget.dataset.index
      _this.setData({
        states: dataIndex,
        virtualItem: [],
        offset: 0,
        noPage: 0,
        isShows: true,
        tipTxt: ''
      })
      _this.getList(_this.data.states)
    },
    swiperChangeTab(e) {//滑动时切换
      let _this = this
      _this.setData({
        states: e.detail.current,
        virtualItem: [],
        offset: 0,
        noPage: 0,
        isShows: true,
      })
      _this.getList(_this.data.states)
    },
    scrolltolower(e) {
      let _this = this
      let dataset = e.currentTarget.dataset
      if (_this.data.offset != 0) {//有数据就继续加载
        _this.getList(dataset.index)
        _this.setData({
          tipTxt: '加载中'
        })
      } else {
        _this.setData({
          tipTxt: '没有更多数据了'
        })
      }
    },
    goDetails(e) {//订单详情
      var orderCode = e.currentTarget.dataset.codes
      wx.navigateTo({
        url: '/pages/order/virtual-detail/virtual-detail?orderCode=' + orderCode,
      })
    },
    delOrder(e) {//删除订单
      var _this = this
      var orderCode = e.currentTarget.dataset.codes
      wx.showModal({
        content: '确认删除订单？删除后将不可恢复。',
        confirmColor: '#E61817',
        success(res) {
          if (res.cancel) { return }
          var parms = { orderCode: orderCode }
          var MD5signStr = Common.md5sign(parms);
          parms.sign = MD5signStr
          Common.request.post(Api.find.delOrder, parms, function (data) {
            if (data.status == 'OK') {
              wx.showToast({ title: data.message, icon: 'none' })
              setTimeout(function () {
                _this.getList(_this.data.states)
              }, 1000)
            } else {
              wx.showToast({ title: data.message, icon: 'none' })
            }
          })
        }
      })
    },
    async continuePay(e) {//立即付款------未完
      let _this = this
      var orderCode = e.currentTarget.dataset.codes
      var user = app.globalData.user
      let openid = await Common.getMiniOpenId()
      var parms = {
        customerCode: Common.getCustomerCode(),
        orderCode: orderCode,
        openId: openid,
        payMethod: 7
      }
      var MD5signStr = Common.md5sign(parms);
      parms.sign = MD5signStr

      try {
        let res = await Common.ajax.post(Api.find.continuePay, parms)
        let message = JSON.parse(res.message.allinPay.message)
        let payInfo = JSON.parse(message.payInfo)

        wx.requestPayment(
          {
            'timeStamp': payInfo.timeStamp,
            'nonceStr': payInfo.nonceStr,
            'package': payInfo.package,
            'signType': payInfo.signType,
            'paySign': payInfo.paySign,
            'success': function (res) {
              var isPayOk = true
              var fromType = 11 //11：是充值记录 1：是查看订单

              wx.navigateTo({
                url: `pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`,
              })
            },
            'fail': function (res) {
              var isPayOk = false
              var fromType = 3  //待付款

              wx.redirectTo({
                url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`,
              })
            }
          })


        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })

      } catch (err) {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })
      }
    },
    refundSchedule(e) {//退款进度
      wx.navigateTo({
        url: '/pages/order/refund-schedule/refund-schedule?orderCode=' + e.currentTarget.dataset.codes,
      })
    },
    getRefud(e) {//申请退款
      var _this = this
      var orderCode = e.currentTarget.dataset.codes
      var parms = { orderCode: orderCode }
      var MD5signStr = Common.md5sign(parms);
      parms.sign = MD5signStr
      Common.request.post(Api.find.getReundNum, parms, function (data) {
        if (data.status == 'OK') {
          wx.showModal({
            content: '您已经频繁取消该订单' + data.refundNum + '次,接下来要收取%' + data.refundRate + '的手续费,是否继续？', confirmColor: '#E61817',
            success(res) {
              if (res.cancel) { return }
              wx.navigateTo({
                url: '/pages/order/fill-refund/fill-refund?orderCode=' + orderCode,
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/order/fill-refund/fill-refund?orderCode=' + orderCode,
          })
        }
      })
    },
    cancelOrder(e) {//取消订单
      var _this = this
      var orderCode = e.currentTarget.dataset.codes
      wx.showModal({
        content: '确认取消该订单吗?',
        confirmColor: '#E61817',
        success(res) {
          if (res.cancel) { return }
          var parms = { orderCode: orderCode }
          var MD5signStr = Common.md5sign(parms);
          parms.sign = MD5signStr
          Common.request.post(Api.find.cancelOrder, parms, function (data) {
            if (data.status == 'OK') {
              wx.showToast({ title: data.message, icon: 'none' })
              setTimeout(function () {
                _this.getList(_this.data.states)
              }, 1000)
            } else {
              wx.showToast({ title: data.message, icon: 'none' })
            }
          })
        }
      })
    },
    getList(states) {//获取数据列表
      let _this = this
      var url = Api.find.getVirOrders
      var user = app.globalData.userInfo
      var parm = {
        customerCode: Common.getCustomerCode(),
        tabNo: _this.data.states,
        offset: _this.data.offset,
        limit: _this.data.limit
      }
      var MD5signStr = Common.md5sign(parm);
      parm.sign = MD5signStr

      Common.request.post(url, parm, function (data) {
        if (data.status == 'OK') {
          console.log(data)
          var rows = data.message
          if (data.total > 0) {
            if (rows.length > 0) {
              var items = _this.data.virtualItem
              for (var i = 0; i < rows.length; i++) {
                items.push(rows[i])
              }
              if (items.length < _this.data.limit) {
                _this.setData({
                  virtualItem: items, noPage: 1, offset: 0
                })
              } else {
                _this.setData({
                  virtualItem: items, noPage: 0, offset: _this.data.offset + 10
                })
              }

            } else {
              _this.setData({
                offset: 0, noPage: 1, isShows: true
              })
            }
          } else {
            _this.setData({
              offset: 0, noPage: 0, isShows: false
            })
          }
        }
      })
    },
    errImg: function (e) {
      let _this = this
      Common.errImgFun(e, _this)
    }
  }
})

