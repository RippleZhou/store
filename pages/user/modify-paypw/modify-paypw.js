// pages/modify-paypw/modify-paypw.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paypw:{
      curPw:'',
      newPw:'',
      aginPw:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  defautValue:function(e){
    var _this = this
    var paypw = _this.data.paypw
    var id = e.currentTarget.id
    paypw[id] = e.detail.value
    _this.setData({
      paypw: paypw
    })
  },
  modifypaypw(){//修改支付密码
    var _this = this
    if (!_this.data.paypw.curPw || !_this.data.paypw.newPw || !_this.data.paypw.aginPw){
      wx.showToast({
        title: '*密码不能为空',
        icon: 'none'
      })
    } else if (_this.data.paypw.newPw != _this.data.paypw.aginPw){
      wx.showToast({
        title: '*两次密码不一致',
        icon: 'none'
      })
    } else if (_this.data.paypw.newPw.length!=6){
      wx.showToast({
        title: '*请输入6位密码',
        icon: 'none'
      })
    }else{
      var user = app.globalData.userInfo
      if (user){
        var MD5signStr = Common.md5sign({
          customerCode: Common.getCustomerCode(),
          payPassWordOld: _this.data.paypw.curPw,
          payPassWordNew: _this.data.paypw.newPw
        });
        Common.request.post(Api.customer.EditPayPassWord,{
          customerCode: Common.getCustomerCode(),
          payPassWordOld: _this.data.paypw.curPw,
          payPassWordNew: _this.data.paypw.newPw,
          sign: MD5signStr
        },function(data){
          if (data.status == 'OK'){
            wx.showToast({
                title: '支付密码设置成功',
                icon: 'none'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/personacenter/personacenter',
                })
              }, 1500)
          }else{
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
          }
        })
      }
    }
  }
})