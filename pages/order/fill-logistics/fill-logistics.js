// pages/order/fill-logistics/fill-logistics.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
var Utils = require("../../../utils/util.js")
const app = getApp()
Page({
  data: {
    orderId:null,
    logItem:[],//物流
    index:null,//物流索引
    logTxt:'请选择物流公司',
    proItem:[],//产品
    defautImg:[],//上传的照片
    modyFill:{
      "fillNum":null,
      "fillTel":null,
      "fillInfor":null
    },
  },
  onLoad: function (options) {
    var orderId = options.orderId//'394048'
    this.setData({
      orderId: orderId
    })
    this.getProInfor(orderId)
    this.getExpressCompanys()
  },
  onShow: function () {

  },
  getTels() {
    Common.getTels()
  },
  modyFill(e){//ＩＮＰＵＴ值
    let _this = this
    let vals = _this.data.modyFill
    let id = e.currentTarget.id
    vals[id] = e.detail.value
    _this.setData({
      modyFill: vals
    })
  },
  submitInfo(){//提交
    let _this = this
    if (_this.data.index==null){
      wx.showToast({
        title: '物流公司不能为空',
        icon: 'none'
      })
    }else{
      var user = app.globalData.userInfo
      let parms={
        orderId: _this.data.orderId,
        expressCompany: _this.data.logTxt,
        expressCode: _this.data.modyFill.fillNum,
        expressPhone: _this.data.modyFill.fillTel,
        imgUrls:0,
        expressRemark: _this.data.modyFill.fillInfor
      }
      var MD5signStr = Common.md5sign(parms);
      parms.sign = MD5signStr
      Common.request.post(Api.order.fillInExpressSubmit, parms, function (data) {
        if (data.status == "OK") {
          console.log(data)
          wx.showToast({
            title: '提交成功!',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/order/returns/returns',
            })
          },1000)
        } else {
          wx.showToast({
            title: '提交失败!',
            icon: 'none'
          })
        }
      })
    }
  },
  bindPickerChange(e){//选择物流
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let _this = this
    this.setData({
      index: e.detail.value,
      logTxt: _this.data.logItem[e.detail.value].text
    })
  },
  getExpressCompanys(){//获取物流公司
    let _this = this
    Common.request.get(Api.order.getExpressCompanys,{},function(data){
      if (data.status=="OK"){
        console.log(data)
        let arry = data.message
        _this.setData({
          logItem: arry
        })
        console.log(arry)
      }else{
        wx.showToast({
          title: '信息加载失败!',
          icon: 'none'
        })
      }
    })
  },
  getProInfor(orderId){//获取产品
    let _this = this
    Common.request.get(Api.order.fillInExpress + '?orderId=' + orderId, {}, function (data) {
      if (data.status == "OK") {
        console.log(data)
        let arry = data.message
        let imgs = arry.expressInfo.expressImageUrl != null && arry.expressInfo.expressImageUrl != '' && arry.expressInfo.expressImageUrl != 0? arry.expressInfo.expressImageUrl.split(',') : []
        var txts = '请选择物流公司'
        if (arry.expressInfo.expressCompany != null && arry.expressInfo.expressCompany != '' && arry.expressInfo.expressCompany!=undefined){
          txts = arry.expressInfo.expressCompany
        }
        console.log(arry.expressInfo.expressImageUrl,'*****')
        _this.setData({
          proItem: arry,
          defautImg: imgs,
          logTxt: txts,
          modyFill:{
            fillInfor: arry.expressInfo.expressRemark
          }
        })
        console.log(arry)
      } else {
        wx.showToast({
          title: '信息加载失败!',
          icon: 'none'
        })
      }
    })
  },
  chooseType(){//上传照片
    let _this = this
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        
        _this.setData({
          defautImg: tempFilePaths
        })
        console.log(tempFilePaths)
      }
    })
  }
})