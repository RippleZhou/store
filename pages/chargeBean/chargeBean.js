const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

let {
  regeneratorRuntime
} = global


Page({
  data: {
    cellphone:  "",
    head: "",
    beanNumber: "0",
    submitActive: false
  },
  async chargeBean() {
    if (!this.data.submitActive) {
      return;
    }

    let openid = await Common.getMiniOpenId()
    let user = app.getUser()
    let cellPhone = user.cellPhone
    let beanNum = this.data.beanNumber
    let wxOpenId = openid
    let payMethod = "7" //微信支付
    let frontUrl = 'https://japitest.3721zh.com/webapp/#/payFail?fromType=1&isPayOk=true'

    let params = {
      cellPhone,
      beanNum,
      customerCode: Common.getCustomerCode(),
      wxOpenId,
      payMethod,
      frontUrl
    }

    let MD5signStr = Common.md5sign(params);
    let reqParams = Object.assign(params, { sign: MD5signStr })
    let url = Api.customer.wxRechargeConverBean;

    Common.request.post(url, reqParams, function (data) {
      if (data.status == 'OK') {
        let obj = JSON.parse(data.message)
        let payInfo = JSON.parse(obj.payInfo)

        wx.requestPayment(
          {
            'timeStamp': payInfo.timeStamp,
            'nonceStr': payInfo.nonceStr,
            'package': payInfo.package,
            'signType': payInfo.signType,
            'paySign': payInfo.paySign,
            'success': function (res) {
              console.log('success', res)

              var isPayOk = true
              var fromType = 11 //11：是充值记录 1：是查看订单

              wx.navigateTo({
                url: `pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`,
              })
            },
            'fail': function (res) {
              console.log('fail', res)

              var isPayOk = false
              var fromType = 11

              wx.redirectTo({
                url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`,
              })
            }
          })
      }
    })
  },
  testPay() {
    var isPayOk = true
    var fromType = 1
    wx.navigateTo({
      url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`
    })
  },
  gotoRecord() {
    wx.navigateTo({
      url: '/pages/rechargeList/rechargeList',
    })
    // this.testPay()
  },
  getParams() {
    var { beanNumber } = this.data
    var userInfo = app.globalData.userInfo
    let payMethod = "2"

    var params = {
      customerId: userInfo.id,
      cellPhone: userInfo.cellPhone,
      beanNum: beanNumber,
      payMethod,
      wxOpenId: userInfo.wxOpenId
    }

    return Object.assign(params, { sign: Common.md5sign(params) })
  },
  enterNumber(event) {
    let number = event.detail.value

    if (number == "" || number == "0") {
      this.setData({
        submitActive: false
      })
    } else {
      console.log('submit')
      this.setData({
        submitActive: true
      })
    }

    this.setData({
      beanNumber: number
    })
  },
  firstNumber(event) {
    let number = event.detail.value
    if (number == "0") {
      this.setData({
        beanNumber: ""
      })
    }
  },

  onLoad:async function (options) {
   let customerCode = Common.getCustomerCode()
   let user = await Common.getUser(customerCode)
   this.setData({
     cellphone: user.cellPhone,
     head: user.imageUrl
   })
  }
})