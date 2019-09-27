// pages/set-paypw/set-paypw.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pws:{
      paypw:'',
      aginpaypw:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  defautValue:function(e){
    var _this = this
    var pws = _this.data.pws
    var id = e.currentTarget.id
    pws[id] = e.detail.value
    _this.setData({
      pws: pws
    })
  },
  setpaypw(){//设置支付密码
    let _this = this
    if (!_this.data.pws.paypw || !_this.data.pws.aginpaypw){
      wx.showToast({
        title: '*支付密码不能为空',
        icon: 'none'
      })
    } else if (_this.data.pws.paypw != _this.data.pws.aginpaypw){
      wx.showToast({
        title: '*两次密码不一致',
        icon: 'none'
      })
    } else if (_this.data.pws.paypw.length!=6){
      wx.showToast({
        title: '*请输入6位密码',
        icon: 'none'
      })
    }else{
      var user = app.globalData.userInfo
      if(user){
        var MD5signStr = Common.md5sign({
          customerCode: Common.getCustomerCode(),
          payPassWordOld:'',
          payPassWordNew: _this.data.pws.paypw
        });
        Common.request.post(Api.customer.EditPayPassWord,{
          customerCode: Common.getCustomerCode(),
          payPassWordOld:'',
          payPassWordNew: _this.data.pws.paypw,
          sign: MD5signStr
        },function(data){
          if (data.status=="OK"){
            wx.showToast({
              title: '支付密码设置成功',
              icon: 'none'
            })
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/user/personalset/personalset',
              })
            },1500)
            
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