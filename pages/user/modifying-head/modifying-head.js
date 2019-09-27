// pages/user/modifying-head/modifying-head.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({
  data: {
    tempFilePaths: [],
    base64:''
  },
  onLoad: function (options) {

  },
  addImgs() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        _this.setData({ tempFilePaths: tempFilePaths})
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
          encoding: 'base64', // 编码格式
          success: res => { // 成功的回调
            var base = 'data:image/png;base64,' + res.data
            _this.setData({ base64: base }) 
          }
        })
      }
    })
  },
  saveHeads() {
    let _this = this
    let customerCode = Common.getCustomerCode()
    if (_this.data.tempFilePaths === "") {
      wx.showToast({
        title: "请选择头像",
        icon: 'none'
      })
      return
    }
    
    let MD5signStr = Common.md5sign({
      customerCode: Common.getCustomerCode(),
      filesbase64: _this.data.base64
    });
    console.log('****aaa****', _this.data.base64)
    Common.request.post(Api.customer.setUserInfo, {
      customerCode: Common.getCustomerCode(),
      filesbase64: _this.data.base64,
      sign: MD5signStr
    },
      function (data) {
        if (data.status == 'OK') {
          wx.showToast({
            title: "头像保存成功！",
            icon: 'none'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/personacenter/personacenter',
            })
          }, 3000)
        }
      })
    
  }
})