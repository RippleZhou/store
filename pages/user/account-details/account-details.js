// pages/user/account-details/account-details.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItem: ['转换豆明细', '现金红包'],
    screenTab: [{ txt: '全部', type: 2 },
    { txt: '充值', type: 11 }, { txt: '现兑商品', type: 10 },
    { txt: '转豆', type: 12 }, { txt: '消费得豆', type: 6 },
    { txt: '抢豆包', type: 4 }, { txt: '其它', type: -1 }],
    curTabs: 0,
    detailList: [],
    scrollmark: true,//是否到底
    offset: 0,//第几页
    limit: 10,//每页条数
    noPage: 0,//没有数据了
    scrollHeight: '',
    isShows: true,
    getType: 0,
    screenHids: false,
    tabItem: ['转换豆明细', '现金红包'],
  },
  onLoad: function (options) {
    if (options.type == '' || options.type == undefined) {
      options.type = 0
    }
    let _this = this
    wx.getSystemInfo({//给scroll-view的高度赋值
      success: function (res) {
        _this.setData({
          getType: options.type,
          curTabs: options.type,
          scrollHeight: (res.windowHeight - 89)
        });
      }
    })
    _this.getList()
  },
  clickTab(e){
    let _this = this
    let dataset = e.currentTarget.dataset
    if (_this.data.curTabs == dataset.index){return}
    else {
      this.setData({
        curTabs: dataset.index,
        isShows: true,
        detailList: [],
        offset: 0,
        noPage:0,
        getType: dataset.index
      })
      this.getList()
    }
  },
  clickScreen(e) {//筛选点击
    let dataset = e.currentTarget.dataset
    this.setData({
      curTabs: 0,
      isShows: true,
      screenHids:false,
      detailList: [],
      offset: 0,
      noPage: 0,
      getType: dataset.index
    })
    this.getList()
  },
  scrollbottom: function () {//滚动到底部
    var _this = this;
    if (_this.data.offset != 0) {//有数据就继续加载
      _this.getList();
      console.log(_this.data.offset)
    }
  },
  getList() {//获取列表
    var self = this;
    wx.showLoading({//开始请求
      mask: true
    })
    let _this = this
    var user = app.globalData.userInfo
    var url = Api.customer.cusConverBeanItem
    var parm = {
      customerCode: Common.getCustomerCode(),
      offset: _this.data.offset,
      limit: _this.data.limit
    }
    if (_this.data.getType == 1) {
      url = Api.customer.getEnvelopList
    } else if (_this.data.getType == 0 || _this.data.getType == 2) {
      url = Api.customer.cusConverBeanItem
    } else {
      var converType = _this.data.getType
      if (_this.data.getType == 6) {
        converType = 1
      }
      parm = {
        customerCode: Common.getCustomerCode(),
        offset: _this.data.offset,
        limit: _this.data.limit,
        converType: converType
      }
      url = Api.customer.cusConverBeanItem
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(url, parm, function (data) {
      if (data.status == 'OK') {
        console.log(data)
        var arryItem = data.rows
        if (arryItem.length > 0) {
          var listItem = _this.data.detailList
          for (var i = 0; i < arryItem.length; i++) {
            listItem.push(arryItem[i])
          }
          if (listItem.length < _this.data.limit) {
            _this.setData({
              detailList: listItem, scrollmark: true, noPage: 0, offset: 0
            })
          } else {
            _this.setData({
              detailList: listItem, scrollmark: true, noPage: 1, offset: _this.data.offset + 10
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
  screenShow() {//点筛选按钮
    this.setData({
      screenHids: !this.data.screenHids
    })
  }
})