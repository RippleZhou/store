// pages/user/receiving-address/receiving-address.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    addressList: []
  },
  
  onLoad: function (options) {

  },
  
  onShow: function () {
    this.getList()
  },

  getList() {///获取地址列表
    let _this = this
    let user = app.globalData.userInfo
    Common.request.get(Api.customer.getAddressList, { customerCode: Common.getCustomerCode() }, function (data) {
      if (data.status == "OK") {
        _this.setData({
          addressList: data.rows
        })
        // console.log(_this.data.addressList)
      }
    })
  },

  goback(e){
    const {item} = e.currentTarget.dataset
    if(item){
      app.globalData.chosenAddress = item
    }
    wx.navigateBack()
  }
})