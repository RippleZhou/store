// pages/personalset/personalset.js
const Config = require("../../../config")
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")

const app = getApp()
const { regeneratorRuntime } = global
Page({ 
  data: {
    setlogTxt: '设置登录密码',
    setlogUrl: '/pages/user/set-loginpw/set-loginpw',
    setpayTxt: '设置支付密码',
    setpayUrl: '/pages/user/set-paypw/set-paypw',
    uerImg: 'https://v.3721zh.com/static/img/bean_detail_logo.d3495ac.png',
    cellPhone: '',
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: async function () {
    var _this=this
    if (!Common.biz.loggedIn(Common.getRoute())) {
      return;//检查登录
    } else {
      let customerCode = Common.getStorage('customerCode')
      let user = await Common.getUser(customerCode)
      
      _this.setData({
        uerImg: user.imageUrl,
        cellPhone: user.cellPhone.substring(0, 3) + '****' + user.cellPhone.substring(7),
        nickName: user.nickName
      })

      if (user.passWord != null && user.passWord != '') {
        _this.setData({
          setlogTxt: '修改登录密码',
          setlogUrl: '/pages/user/modify-loginpw/modify-loginpw'
        })
      }
      if (user.payPassWord != null && user.payPassWord != '') {
        _this.setData({
          setpayTxt: '修改支付密码',
          setpayUrl: '/pages/user/modify-paypw/modify-paypw'
        })
      }
    }
  },
  logOut() {//退出登录

    let customerCode = Common.getCustomerCode()
    let MD5signStr = Common.md5sign({
      customerCode
    });
    let params = {
      customerCode,
      sign: MD5signStr
    }
    Common.request.post(Api.customer.customerlogOut, params,
      function (data) {
        console.log(data)
        if (data.status == 'OK') {
          app.globalData.user = null
          app.globalData.token = null

          try {
            wx.removeStorageSync('customerCode')
            wx.removeStorageSync('user')
            wx.removeStorageSync('token')
            wx.switchTab({
              url: '/pages/index/index'
            })
          } catch (e) {
            console.log('remove storage error')
          }
        }
      }, function (error) {
        wx.showModal({
          content: error,
          showCancel: false
        })
      })
  }

})