// pages/order/returns/returns.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
var Utils = require("../../../utils/util.js")
const app = getApp()
Page({
  data: {
    returnItem: [],
    offset: 0,
    limit: 10,
    noPage: 0,
    isShows:true,
    noMores: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_05.png',
    scrollHeight:0,
    tipTxt: '',
    allPrice:0
  },
  onLoad: function (options) {
    let _this = this
    this.setData({offset: 0 })
    // _this.setData({
    //   allPrice: Utils.floatMul(rows[i].productNum, rows[i].productPrice)
    // })
    wx.getSystemInfo({//给scroll-view的高度赋值
      success: function (res) {
        _this.setData({
          scrollHeight: (res.windowHeight)
        });
      }
    })
    this.getList()
  },
  getTels(){
    Common.getTels()
  },
  goDetails(e){//详情
    wx.navigateTo({
      url: '/pages/order/returns-details/returns-details?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  goSeeLogis(e) {//查看物流
    wx.navigateTo({
      url: '/pages/order/see-logistics/see-logistics?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  goLogistics(e) {//填写物流信息
    wx.navigateTo({
      url: '/pages/order/fill-logistics/fill-logistics?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  getList(){//列表
    let _this = this
    var user = app.globalData.userInfo
    var url = Api.order.getReturnedGoods + '?customerCode=' + Common.getCustomerCode() + '&offset=' + _this.data.offset + '&limit=' + _this.data.limit
    Common.request.get(url, {}, function (data) {
      if (data.status == 'OK') {
        console.log(data)
        var rows = data.rows
        if (data.total > 0) {
          if (rows.length > 0) {
            var items = _this.data.returnItem
            for (var i = 0; i < rows.length; i++) {
              items.push(rows[i])
            }
            if (items.length < _this.data.limit) {
              _this.setData({
                returnItem: items, noPage: 1, offset: 0
              })
            } else {
              _this.setData({
                returnItem: items, noPage: 0, offset: _this.data.offset + 10
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
  scrolltolower() {
    let _this = this
    if (_this.data.offset != 0) {//有数据就继续加载
      _this.setData({
        tipTxt: '加载中'
      })
      _this.getList()
    } else {
      _this.setData({
        tipTxt: '没有更多数据了'
      })
    }
  },
})