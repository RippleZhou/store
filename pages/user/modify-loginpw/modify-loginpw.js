// pages/modify-loginpw/modify-loginpw.js
//获取应用实例
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPw:'',
    newPw:'',
    aginPw:''
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {

  },
  curPw:function(e){
    this.setData({
      curPw: e.detail.value
    })
  },
  newPw: function (e) {
    this.setData({
      newPw: e.detail.value
    })
  },
  aginPw: function (e) {
    this.setData({
      aginPw: e.detail.value
    })
  },
  modifypw(){
    let _this = this
    let user = app.globalData.userInfo
    if (_this.data.curPw == '' || _this.data.newPw == '' || _this.data.aginPw==''){
      wx.showToast({
        title: '*密码不能为空！',
        icon: 'none'
      })
    } else if (_this.data.newPw != _this.data.aginPw){
      wx.showToast({
        title: '*两次密码不一致！',
        icon: 'none'
      })
    } else if (!_this.isNumber(_this.data.newPw)){
      wx.showToast({
        title: '请输入6-16位密码！',
        icon: 'none'
      })
    }else{
      let params ={
        customerCode: Common.getCustomerCode(),
        oldPassword: _this.data.curPw,
        newPassword: _this.data.newPw
      }
      let MD5signStr = Common.md5sign(params);
      let url = Api.customer.setPassWord + '?oldPassword=' + _this.data.curPw + '&newPassword=' + _this.data.newPw + '&customerCode=' + Common.getCustomerCode() + '&sign=' + MD5signStr
      Common.request.post(url, {}, function (data) {
        if (data.status == "OK") {
          wx.showModal({
            title: '',
            content: '修改密码成功',
            showCancel: false,
            confirmColor: '#e61817',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/personacenter/personacenter',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  isNumber(s){
    let regu = "^[0-9a-zA-Z]{6,12}$";
    let re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  }
})