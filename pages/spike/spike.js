// pages/spike/spike.js
const Common = require('../../utils/common')
var Api = require("../../utils/api")
var Util = require("../../utils/util")
const app = getApp()
Page({
  data: {
    spikeTab:[
      {tit:'正在疯抢',tip:'距离结束'},
      { tit: '即将开始' ,tip:'距离开始'},
      { tit: '明日预告', tip: '距离开始'},
    ],
    states:0,
    spikeItem:[],
    offset:0,
    limit: 10,
    noPage:0,
    isShows:true,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    tipTxt:"没有更多数据",
    cutOffTime:'2019-01-02',
  },
  onLoad: function (options) {
    this.getList(this.data.states)
  },
  onShow: function () {
    let _this = this
    _this.cutOffTimes(_this.data.cutOffTime)
  },
  clickTab(e) {//点击时切换
    let _this = this
    let dataIndex = e.currentTarget.dataset.index
    if (this.data.states == dataIndex) { return }
    _this.setData({
      states: dataIndex,
      spikeItem: [],
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
      spikeItem: [],
      offset: 0,
      noPage: 0,
      isShows: true,
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
        tipTxt: '加载中'
      })
      console.log(_this.data.offset)
    } else {
      _this.setData({
        tipTxt: '没有更多数据了'
      })
    }
  },
  cutOffTimes(endDate) {
    const self = this
    setInterval(function () {
      self.setData({
        cutOffTime: Util.getDateObj(endDate)
      })
    }, 1000)
  },
  goPage(e){
    wx.navigateTo({
      url: '/pages/product/product-view/product-view?type=3&productId=' + e.currentTarget.dataset.ids,
    })
  },
  getList(states){
    let _this = this
    var url = Api.product.queryProSeckill
    var parm = {
      type: 1,
      state: states,
      offset: _this.data.offset,
      limit: _this.data.limit
    }
    Common.request.get(url, parm, function (data) {
      if (data.status == 'OK') {
        console.log(data)
        var rows = data.rows
        if (data.total > 0) {
          if (rows.length > 0) {
            var items = _this.data.spikeItem
            // if (states==0){
            //   _this.setData({
            //     cutOffTime: rows[0].endDate
            //   })
            //   _this.cutOffTimes(rows[0].endDate)
            // }else{
            //   _this.setData({
            //     cutOffTime: rows[0].startDate
            //   })
            //   _this.cutOffTimes(rows[0].startDate)
            // }
            for (var i = 0; i < rows.length; i++) {
              items.push(rows[i])
            }
            if (items.length < _this.data.limit) {
              _this.setData({
                spikeItem: items, noPage: 1, offset: 0
              })
            } else {
              _this.setData({
                spikeItem: items, noPage: 0, offset: _this.data.offset + 10
              })
            }

          } else {
            _this.setData({
              offset: 0, noPage: 1, isShows: true,cutOffTime: _this.data.cutOffTime
            })
          }
        } else {
          _this.setData({
            offset: 0, noPage: 0, isShows: false, cutOffTime: _this.data.cutOffTime
          })
        }
      }
    })
  }
})