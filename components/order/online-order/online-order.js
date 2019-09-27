// components/order/online-order/online-order.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Component({
  properties: {
    states:Number,
    noMores:String
    //组件的属性列表
  },
  data: {
    orderTab: ['全部', '待付款', '待发货', '待收货', '已完成'],
    offset:0,
    limit:10,
    onlineItem:[],
    noPage:0,
    isShows:true,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    tipTxt:'',
    cancelList: {},//取消原因列表
    expressFeeCount: 0,
    expressBean: 0,
    refundAmount: 0,
    refundConverBean: 0,
    cancelType: 0,
    orderId:null,
    orderGroupId:null
  },
  attached(){
    this.getList(this.data.states)
    this.getCancelList()
  },
  //组件的方法列表
  methods: {
    clickTab(e) {//点击时切换
      let _this = this
      let dataIndex = e.currentTarget.dataset.index
      if (this.data.states == dataIndex){return}
      _this.setData({
        states: dataIndex,
        onlineItems: [],
        offset: 0,
        noPage: 0,
        isShows: true,
      })
      _this.getList(_this.data.states)
    },
    swiperChangeTab(e) {//滑动时切换
      let _this = this
      _this.setData({
        states: e.detail.current,
        onlineItem: [],
        offset: 0,
        noPage:0,
        isShows:true,
      })
      _this.getList(_this.data.states)
    },
    scrolltolower(e) {//是否到底
      console.log('///////')
      let _this = this
      let dataset = e.currentTarget.dataset
      if (_this.data.offset != 0) {//有数据就继续加载
        _this.getList(dataset.index)
        _this.setData({
          tipTxt:'加载中'
        })
        console.log(_this.data.offset)
      }else{
        _this.setData({
          tipTxt: '没有更多数据了'
        })
      }
    },
    async getList(states) {//获取数据列表
      let _this = this
      var url = Api.list.getMyOrders
      let customerCode = Common.getCustomerCode()
      
      var parm = {
        customerCode,
        tabNo: states,
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
              var items = _this.data.onlineItem
              for (var i = 0; i < rows.length; i++) {
                items.push(rows[i])
              }
              if (items.length < _this.data.limit) {
                _this.setData({
                  onlineItem: items, noPage: 1, offset: 0
                })
              } else {
                _this.setData({
                  onlineItem: items, noPage: 0, offset: _this.data.offset + 10
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
    goDetails(e){//跳转详情
      console.log(e)
      let orderGroupId = e.currentTarget.dataset.grid
      let orderId = e.currentTarget.dataset.orid
      let states = e.currentTarget.dataset.states
      if (states == 0 || states==1){
        wx.navigateTo({
          url: '/pages/order/order-list/order-list?orderGroupId=' + orderGroupId,
        })
      } else if (states == 2 || states == 3 || states==4){
        wx.navigateTo({
          url: '/pages/order/online-detail/online-detail?orderId=' + orderId + '&orderGroupId=' + orderGroupId,
        })
      }
    },
   async payShows(e) {//立即付款------未完
      console.log('立即付款')
     let customerCode = Common.getCustomerCode()
      let openid = await Common.getMiniOpenId()
      console.log('openid:',openid)
      var orderGroupId = e.currentTarget.dataset.grid
      let _this = this
      var user = app.globalData.user
     var parms = { orderGroupId: orderGroupId, customerCode, payMethod: '7', openId: openid }
      var MD5signStr = Common.md5sign(parms);
      parms.sign = MD5signStr
      try{
        let data = await Common.ajax.post(Api.order.orderpay, parms)
        let allinpay = JSON.parse(data.message.allinPay.message)
        let payInfo =  JSON.parse(allinpay.payInfo)
        console.log('payInfo.timestamp:',payInfo.timestamp)
        try{
          let res = await Common.callPay(payInfo)
        }catch(err){
          console.log('err')
          wx.redirectTo({
            url: '/pages/payFail/payFail?isPayOk=false&fromType=1'
          })

        }
            //pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}
      }catch(err){
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })
      }
    },
    goSeeLogis(e) {//查看物流
      let _this = this
      var orderId = e.currentTarget.dataset.orderid
      wx.navigateTo({
        url: '/pages/order/see-logistics/see-logistics?orderId=' + orderId,
      })
    },
    cancelOrder() {//取消订单
      let _this = this
      var user = app.globalData.userInfo
      let parms = {
        orderGroupId: _this.data.orderGroupId,
        orderIds: _this.data.orderId,
        expressFee: _this.data.expressFeeCount,
        expressBean: _this.data.expressBean,
        refundAmount: _this.data.refundAmount,
        refundConverBean: _this.data.refundConverBean,
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
              _this.getList(_this.data.states)
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
    cancelShows(e) {//取消订单原因展示
      let _this = this
      var orderId = e.currentTarget.dataset.orderid
      var orderGroupId = e.currentTarget.dataset.grid
      console.log(orderId)
      this.setData({
        orderId: orderId,
        orderGroupId: orderGroupId
      })
      _this.getDeductionCost()

    },
    getDeductionCost() {//获取扣除的运费
      let _this = this
      _this.setData({
        expressFeeCount: 0,
        expressBean: 0,
        refundAmount: 0,
        refundConverBean: 0
      })
      Common.request.get(Api.order.getDeductionCost + '?orderGroupId=' + _this.data.orderGroupId + '&orderIds=' + _this.data.orderId, {}, function (data) {
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
    errImg: function (e) {
      let _this = this
      Common.errImgFun(e, _this)
    }
  }
})
