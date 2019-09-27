const Util = require('../../../utils/util')
const Common = require('../../../utils/common')
const app = getApp()
Page({
  data: {
    setTitName: '登录',
    isPw: true,
    user: {
      passWord: '',
      cellPhone: '',
      showPositionValue: false,
      conerrorTxt: '',
      sign: '',
      redirectUrl: '',
      CodeUrl: 'loginCode'
    },
    jumpUrl: "/pages/index/index",
  },
  onLoad: function (options) {
    console.log('login页面站', getCurrentPages())
    var self = this

    if (options.jumpUrl) {
      self.setData({
        jumpUrl: decodeURIComponent(options.jumpUrl)
      })
    }

  },
  resetPWType: function () {
    let { isPw } = this.data
    this.setData({
      isPw: !isPw
    })
  },
  setDefaultValue: function (e) {
    var self = this
    var user = self.data.user
    var id = e.currentTarget.id
    user[id] = e.detail.value
    self.setData({
      user: user
    })
  },
  goBack: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  login: function () {
    console.log('login000')
    var self = this;
    if (!Util.validatePhoneNum(self.data.user.cellPhone)) {
      wx.showToast({
        title: '手机号码不正确！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!self.data.user.passWord) {
      wx.showToast({
        title: '密码不能为空！',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    Common.request.localLogin(self.data.user, function (data) {
      let customerCode = data.customerCode
      Common.setCustomerCode(customerCode)
      //跳的目标页面路径
      let jumpUrl = self.data.jumpUrl
      let url = `/${jumpUrl}`
      if (isJumpTabBar(jumpUrl)) {
        // 跳tab
        wx.switchTab({ url })
      }
      console.log(jumpUrl.indexOf('product-view'),'****', jumpUrl.indexOf('find-passwordnext'))
      if (jumpUrl.indexOf('product-view') == 0 || jumpUrl.indexOf('addcart') == 0 || jumpUrl.indexOf('startBuy') == 0 ) {
        console.log('aaaaa走这里了呀')
        wx.navigateBack({
          delta: 1
        })
      } else if (jumpUrl.indexOf('find-passwordnext')!=-1){
        wx.switchTab({ url: '/pages/personacenter/personacenter'})
      } else {
        wx.switchTab({ url })
      }

      function isJumpTabBar(url) {
        if (url.indexOf('index') < 0 ||
          url.indexOf('classify') < 0 ||
          url.indexOf('find') < 0 ||
          url.indexOf('cart') < 0 ||
          url.indexOf('personacenter')) {
          return false
        }
        return true;
      }
      return;
    })
  }

})