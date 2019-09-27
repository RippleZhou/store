//app.js
const Config = require('./config')

global.regeneratorRuntime=require('./libs/regenerator-runtime/runtime-module.js')

// function getUser(){
//   try {
//     var value = wx.getStorageSync('user')
//     if (value) {
//       return value
//     }else{
//       console.log('user else')
//     }
//   } catch (e) {
//     console.log('getUser catch')
//   }
// }

// let user = getUser()

App({
  onLaunch: function (options) {
    this.login()
  },
  getUser(){
    try {
      var value = wx.getStorageSync('user')
      if (value) {
        return value
      } else {
        console.log('user else')
      }
    } catch (err) {
      console.log('getUser err')
    }
  },
  login: function () {
    var self = this
    //从本地缓存中获取数据
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('user');
    if (!token || !userInfo) {
      // wx.navigateTo({
      //   url: '../pages/user/login/login',
      // })
      return
    } else {
      self.globalData.token = token
      self.globalData.userInfo = userInfo
    }
    
  },
  loginMini: function (callback) {
    console.log('login---')
    var self = this
    wx.login({
      success: function (data) {
        console.log('hehe')


        wx.request({
          url: Config.loginMiNiUrl,
          method: "POST",
          data: {
            code: data.code
          },
          success: function (res) {
            //如果后台接口允许登录
            if (res.data && res.data.data) {
              // self.globalData.unionId = res.data.data.unionId
              self.globalData.cookie = res.header["Set-Cookie"]
              wx.setStorage({//保存cookie 到storage
                key: "cookie",
                data: res.header["Set-Cookie"]
              })
              if (res.data.data.shouldRegister) {
                wx.navigateTo({
                  url: '../login/login'
                })
              }
              if (callback) {
                callback()
              }
            } else {
              //TODO 
            }
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          }
        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
      }
    })
  },
  authorize: function (callback) {
    var self = this
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        self.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (callback) {
          callback(self.globalData.userInfo)
        }
      }
    })
  },
  globalData: {
    locationCity:'',
    token: null,//登录接口获得的token
    userInfo: null,//用户信息
    location: null,//用户定位信息
    unionId: null
  }
})