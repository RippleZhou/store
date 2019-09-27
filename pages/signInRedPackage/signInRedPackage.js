// pages/signInRedPackage/signInRedPackage.js
const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global;
let dayEnum = {
  firstSignBean: 1,
  secondSignBean: 2,
  thirdSignBean: 3,
  fourthSignBean: 4,
  fifthSignBean: 5,
  sixthSignBean: 6,
  seventhSignBean: 7
}

Page({
  data: {
    isReceive: false,//当天是否签到成功
    isday: 0,//签到天数
    info: {},
    day: 7,
    money:0
  },
  signExplain() {
    wx.navigateTo({
      url: '/pages/signExplain/signExplain',
    })
  },
  gotoInviteFriends() {
    wx.navigateTo({
      url: '/pages/inviteFriends/inviteFriends',
    })
  },
  async getUserSigninInfo() {
    let customerCode = Common.getCustomerCode()
  
    var params = {
      customerCode
    }
    var MD5signStr = Common.md5sign(params);
    let url = `${Api.signin.getSignInfo}?customerCode=${customerCode}&sign=${MD5signStr}`

    let res = await Common.ajax.post(url, {})
    var message = res.message


    let money = 1;
    let isday = message.times
    let info = message
    for (var x in dayEnum) {
      if (dayEnum[x] == isday) {
        money = info[x];
        break;
      }
    }

    this.setData({
      money,
      info:message,
      isday: message.times,
      isReceive: message.signState
    })
  },
  async signin() {
    let url = Api.signin.signIn

    let customerCode = Common.getCustomerCode()
    var params = {
      customerCode
    }
    var MD5signStr = Common.md5sign(params);
    let reqParams = Object.assign(params, { sign: MD5signStr })

    try {
      let res = await Common.ajax.post(url, reqParams)
      this.setData({
        isReceive: true,
        isday: this.data.isday + 1
      })
    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    }
  },
  changeSignIns() {
    this.signin()
    //   }).catch((reson) => {
    //     Vue.$vux.toast.text('签到失败')
    //   });
    // }
  },
  onLoad() {
    if (!Common.biz.loggedIn(Common.getRoute())) return;//检查登录

    this.getUserSigninInfo()
  },
})

