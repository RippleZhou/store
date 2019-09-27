// pages/sendBean/sendBean.js

const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

const { regeneratorRuntime } = global

Page({
  data: {
    pinshouqiText: "当前为拼手气豆包，", //"当前为普通豆包"
    pinshouqiEnterText: "改为普通豆包",
    pingshouqiView: true,
    submitActive: false,

    envelopType: '1',//1拼手气 0 普通
    beanAmount: "0",
    beanNumber: "",
    remark: "恭喜发财！大吉大利！"
  },
  beanExplain() {
    wx.navigateTo({
      url: '/pages/beanExplain/beanExplain',
    })
  },
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  beanNumber(e) {
    this.setData({
      beanNumber: e.detail.value
    })
  },
  async sendBean() {
    var { beanNumber, remark, beanAmount, envelopType, submitActive } = this.data

    if (!submitActive) {
      return;
    }

    var params = {
      beanAmount, //金额
      envelopNum: beanNumber, //数量
      remark,
      cellPhone: app.globalData.userInfo.cellPhone,
      envelopType,
      customerCode: Common.getCustomerCode()
    }

    let MD5signStr = Common.md5sign(params);
    params.sign = MD5signStr

    try {
      let res = await Common.ajax.post(Api.sendBean, params)
      wx.showToast({
        title: '发送豆包成功！点击右上角发豆包给TA',
      })
    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    }

    // Common.request.post(Api.sendBean, params, function (data) {
    //   console.log('data:', data)
    //   if (data.status == 'OK') {
    //     wx.showToast({
    //       title: '发送豆包成功！点击右上角发豆包给TA',
    //     })
    //   } else {
    //     wx.showToast({
    //       title: data.message
    //     })
    //   }
    //   // self.computeMoney();
    // })
  },
  changeBean() {
    var text = this.data.pinshouqiText
    var pingshouqiView = this.data.pingshouqiView
    this.setData({
      pingshouqiView: !pingshouqiView
    })

    if (text == "当前为拼手气豆包，") {
      this.setData({
        envelopType: '0',
        pinshouqiText: "当前为普通豆包，",
        pinshouqiEnterText: "改为拼手气豆包"
      })
    } else {
      this.setData({
        envelopType: '1',
        pinshouqiText: "当前为拼手气豆包，",
        pinshouqiEnterText: "改为普通豆包"
      })
    }
  },
  firstNumber(event) {
    let number = event.detail.value
    if (number == "0") {
      this.setData({
        beanAmount: ""
      })
    }
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
      beanAmount: number
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})