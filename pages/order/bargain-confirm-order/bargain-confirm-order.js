// pages/order/bargain-confirm-order/bargain-confirm-order.js
const Config = require("../../../config")
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    getvirNum: '',
    changeValue: 0,//购买数量
    currencyFlag: false,
    clickTime: 0, //提交订单点击次数
  },
  async submitOrders() {
    console.log('changeValue:', this.data.changeValue)

    if (this.data.changeValue == 0) {
      wx.showToast({
        title: '购买数量不能为0',
      })
      return
    }

    if (this.data.changeValue > this.data.virItem.surplusNum) {
      wx.showToast({
        title: '库存不足',
      })
      return
    }

    if (this.data.changeValue > this.data.getvirNum) {
      wx.showToast({
        title: '购买数量超过指定时间内限购数量',
      })
      return
    }

    if (this.data.changeValue < this.data.virItem.minBuyLimit) {
      wx.showToast({
        title: this.data.virItem.minBuyLimit + '件起购!',
      })
      return
    }

    if (this.data.clickTime == 1) {
      wx.showToast({
        title: '正在提交订单...',
      })
      return
    }

    let user = app.globalData.user
    let para = {}

    this.setData({
      clickTime: 1
    })
    let openid = await Common.getMiniOpenId()
    para['customerCode'] = Common.getCustomerCode()
    para['productId'] = this.data.virItem.virProductId.toString()
    para['productPrice'] = this.data.virItem.productPrice.toString()
    para['productNum'] = this.data.changeValue.toString()
    para['orderAmount'] = this.data.TotalP.toString()
    para["payMethod"] = '7';
    para["openWay"] = "H5";
    para["openId"] = openid;
    para["frontUrl"] = 'https://japitest.3721zh.com/webapp/#/payFail?fromType=1&isPayOk=true';

    let MD5signStr = Common.md5sign(para);
    para["sign"] = MD5signStr

    let url = Api.find.submitOrder
    try{
      let res = await Common.ajax.post(url, para)
      let message = JSON.parse(res.message.allinPay.message)
      let payInfo = JSON.parse(message.payInfo)

      console.log('timeStamp:',payInfo.timeStamp)

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
            var fromType = 3  //虚拟商品

            wx.redirectTo({
              url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`,
            })
          }
        })
    }catch(err){
      console.log('Api.find.submitOrder_err:',err)
    }
  },
  async getDetails(vid) {
    let url = Api.find.virProductCurrencyDetailForOrder
    let params = {
      virProductId: vid
      //  virProductId: '578978668773113856'
    }

    let res = await Common.ajax.post(url, params)
    let totalP = ((res.message.productPrice * 1000) * res.message.minBuyLimit) / 1000
    this.setData({
      virItem: res.message,
      changeValue: 1,
      // changeValue: res.message.minBuyLimit,
      setTitName: res.message.virPorductName,
      TotalP: totalP
    }, () => {
      this.getBeans(vid, totalP)
    })
  },
  async getLimitNum(vid) { //获取产品限购数量
  console.log('getlimitNumb')
    let uid = app.globalData.userInfo.id
    let para = {}
    para['customerCode'] = Common.getCustomerCode()
    para['virProductId'] = vid
    // para['virProductId'] = '578978668773113856'
    let MD5signStr = Common.md5sign(para);
    para["sign"] = MD5signStr
    let url = Api.find.getLimitNum
    let res = await Common.ajax.post(url, para)
    this.setData({
      getvirNum: res.message
    })
  },
  async getBeans(vid,amount) { //获取赠豆数
    let url = `${Api.find.getBeans}?virProductId=${vid}&amount=${amount}`
    let params = {
      virProductId: vid,
      // virProductId: '578978668773113856',
      amount: this.data.TotalP
    }

    let res = await Common.ajax.get(url)

    this.setData({
      getbeanNum: res.message
    })
  },
  onLoad: function(options) {
    let { virProductId, currency} = options

    this.getDetails(virProductId)
    this.getLimitNum(virProductId)

    let cellPhone = app.globalData.userInfo.cellPhone
    this.setData({
      cellPhone: `${cellPhone.substring(0, 3)}*****${cellPhone.substring(`${cellPhone.length - 3}`)}`
    })

  },

})