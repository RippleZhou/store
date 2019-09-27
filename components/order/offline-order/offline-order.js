// components/order/offline-order/offline-order.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Component({
  properties: {
    noMores: String
    //组件的属性列表
  },
  data: {
    offlineItem:['0','1'],
    offset: 0,
    limit: 10,
    noPage: 0,
    isShows: true,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    tipTxt:'',
    scrollHeight:0
  },
  attached () {
    let _this = this
    this.setData({ offlineItem:[],offset:0})
    wx.getSystemInfo({//给scroll-view的高度赋值
      success: function (res) {
        _this.setData({
          scrollHeight: (res.windowHeight)
        });
      }
    })
    this.getList()
  },
  //组件的方法列表
  methods: {
    scrolltolower(){
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
    getList(){
      var url = Api.order.getStoreOrderList
      let _this = this
      var user = app.globalData.userInfo
      var parm = {
        customerCode: Common.getCustomerCode(),
        offset: _this.data.offset,
        limit: _this.data.limit
      }
      var MD5signStr = Common.md5sign(parm);
      parm.sign = MD5signStr

      Common.request.post(url, parm, function (data) {
        if (data.status == 'OK') {
          console.log(data)
          var rows = data.rows
          if (data.total > 0) {
            if (rows.length > 0) {
              var items = _this.data.offlineItem
              for (var i = 0; i < rows.length; i++) {
                items.push(rows[i])
              }
              if (items.length < _this.data.limit) {
                _this.setData({
                  offlineItem: items, noPage: 1, offset: 0
                })
              } else {
                _this.setData({
                  offlineItem: items,noPage: 0, offset: _this.data.offset + 10
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

