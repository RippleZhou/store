// pages/beans/borrow-beans/borrow-beans.js
const Config = require("../../../config")
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global

Page({
  data: {
    codeInputs: ['', '', '', ''],
    codeNumbers: [],
    codeNow: 0,
    focus: false,
    cursor: 0,
    userCode: '',//用户验证码

    phone: '',
    historTIts: '已有3万+人抢单成功',
    historyItems: [],//历史抢单
    codeTxt: '60s重新获取',
    show: true,//获取验证码是否显示
    IssendCode: false,//是否获取过验证码
    numLen: ['0', '1', '2', '3'],//验证码长度
    isDisable: false,//获取验证码是否禁用
    userPhone: '',//用户手机号码
    myCaptcha: null,
    borrowSuccess: false,
    historyIsShow: false,
    productItem: {},
    borrowBeanNumber: 0,
    isShowList: true,
    oldUser: false,//老用户输入框
    newUser: false,//新用户输入框
    btnShows: true,
    captchaShow: false,
    captchaReload: false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
    shareShow: false
  },
  clickCode(e) {
    let index = e.currentTarget.dataset.index
    let length = this.data.userCode.length

    if (index < length) {
      this.setData({
        focus: true,
        cursor: length,
        codeNow: length
      })
      return;
    }

    this.setData({
      focus: true,
      cursor: index + 1,
      codeNow: index
    })
  },
  async showRecordList(tag) {
    console.log('showRecordList')
    let _this = this
    let { bwUserId, batchNo } = this.data

    let params = {
      bwCustomerCode: bwUserId,
      batchNo,
      offset: 1,
      limit: 10
    }
    let MD5signStr = Common.md5sign(params);

    let url = `${Api.borrow.queryBWRecordList}?bwCustomerCode=${bwUserId}&batchNo=${batchNo}&offset=${params.offset}&limit=${params.limit}&sign=${MD5signStr}`

    let res = await Common.ajax.post(url, {})
    if (tag) { //验证码登录 进来的
      this.setData({
        newUser: false
      })
    }

    this.setData({
      historyIsShow: true,
      historyItems: res.rows,
      historTIts: `已有${res.total}人借豆给你`,
      isShowList: true
    })
  },
  async showHistoryList(tag) {
    console.log('showHistoryList')

    let { productId } = this.data
    let customerCode = Common.getCustomerCode()
    let url = `${Api.product.purchaseHistoryNew}?productId=${productId}&customerCode=${customerCode}`
    let res = await Common.ajax.get(url)
    if (tag) {
      this.setData({
        newUser: false
      })
    }
    this.setData({
      historyIsShow: true,
      historyItems: res.message,
      isShowList: false
    })
  },
  async gotoLogin({ cellPhone, authCode }) {
    let params = {
      cellPhone,
      authCode
    }
    let MD5signStr = Common.md5sign(params);
    let url = `${Api.customer.CustomerloginCode}?cellPhone=${cellPhone}&authCode=${authCode}&sign=${MD5signStr}`
    try {
      let res = await Common.ajax.post(url, {})
      let params2 = {
        customerCode: Common.getCustomerCode(),
      }
      let MD5signStr2 = Common.md5sign(params2);

      let url2 = Api.customer.getUserCenter + '?customerCode=' + Common.getCustomerCode() + '&sign=' + MD5signStr2
      let res2 = await Common.ajax.post(url2)

      let { bwUserId } = this.data
      let giveUserId = Common.getCustomerCode()

      if (bwUserId == giveUserId) {
        this.showRecordList(1)
      } else {
        this.showHistoryList(1)
      }

    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    }


    // this.setData({
    //   userId: res.message,
    //   giveUserId
    // })


    // let url = Api.newBorrow.queryCustomerCode
    // let params = {
    //   openId: wxOpenId
    // }
    // let MD5signStr = Common.md5sign(params);
    // let reqParams = Object.assign(params, { sign: MD5signStr })
    // let res = await Common.ajax.post(url, reqParams)

    // let bwUserId = 'BLR2Z3TJNV5JE'
    // // let batchNo = 'GXF1S016EGUX96207IN2C461D9KNWYQH'
    // // let bwUserId = this.data.bwUserId
    // let giveUserId = app.globalData.userInfo.id

    // if (bwUserId == giveUserId) {
    //   this.showRecordList()
    // } else {
    //   this.showHistoryList()
    // }


  },
  codeInput(e) {
    console.log(e.detail.value)
    let value = e.detail.value
    let len = value.length
    let vArray = value.split('')

    if (len == 4) {
      console.log('登陆开始')
      let phone = this.data.userPhone
      this.gotoLogin({ cellPhone: phone, authCode: value })

      // let user = app.globalData.userInfo
      // console.log('user:', user)
      // console.log('user.wxOpenId:', user.wxOpenId)
      // if (user.wxOpenId) {
      //   console.log('user2222')
      //   // this.gotoLogin(user.wxOpenId)
      // }
    }

    if (len < 4) {
      let arr = []
      let l = len;
      for (let x = 0; x < 4 - len; x++) {
        vArray[l] = ''
        l++
      }
    }

    this.setData({
      userCode: value,
      codeNow: len,
      codeInputs: vArray.map(k => {
        if (k) {
          k = '●'
        }
        return k
      })
    })

  },
  getNum() {
    console.log('getNum')
  },

  // 验证码成功回调
  captchaSuccess: function (token) {
    console.log('token:', token)
    console.log(token.detail)


    this.setData({
      IssendCode: true,
      show: false,
      captchaShow: false
    })
    Common.codeTime(this)

    let datas = { cellPhone: this.data.userPhone, type: '6', token: token.detail }
    Common.NewAuthCode(datas)
  },
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
  },


  gotoShare() {
    this.setData({
      shareShow: true
    })
  },
  shareHide() {
    this.setData({
      shareShow: false
    })
  },
  VerifyPhone(val) {
    return /^[0-9]{11}$/.test(val)
  },
  phoneInput(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  async getCode() {//获取验证码
    console.log('获取验证码')

    let _this = this
    let { isDisable, userPhone, } = this.data
    if (isDisable) {
      return
    }

    this.setData({
      isDisable: true
    })

    if (userPhone == '') {
      wx.showModal({
        content: '手机号码不能为空',
        showCancel: false
      })
      return;
    } if (!this.VerifyPhone(userPhone)) {
      wx.showModal({
        content: '手机格式不正确',
        showCancel: false
      })
      return;
    } else {
      this.setData({
        // isDisable: false,
        focus: true,//验证码输入 
        captchaShow: true
      })

      let MD5signStr = Common.md5sign({
        cellPhone: userPhone
      });

      // let url = `${Api.customer.checkIsLogin}?sign=${MD5signStr}&cellPhone=${userPhone}`
      // try {
      //   let res = await Common.ajax.post(url)

      //   this.setData({
      //     // isDisable: false,
      //     focus: true,//验证码输入 
      //     captchaShow: true
      //   })
      // } catch (err) {
      //   wx.showModal({
      //     content: err.message,
      //     showCancel: false
      //   })
      // }
    }
  },
  goBorrowBean(e) {
    console.log('借豆')

    let userI = app.globalData.userInfo
    if (userI) {
      console.log('aaaaa')
      this.gotoShare()
      let pid = e.currentTarget.dataset.pid

      let that = this
      let params = { productId: pid, userId: app.globalData.userInfo.id }
      Common.request.get(Api.product.getShareByKey, params,
        (data) => {
          console.log('ccc', data)
          let shareUrl = data.message.shareUrl
          let title = data.message.mainTitle
          let desc = data.message.secondTitle
          let shareParams = that.getShareParams(shareUrl)

          that.setData({
            shareParams,
            productId: shareParams.productId,
            batchNo: shareParams.batchNo,
            bwUserId: shareParams.bwUserId,
            title
          })
        }
      )
    } else {
      wx.navigateTo({
        url: `/pages/user/login/login?jumpUrl=${Common.getRoute()}`
      })
    }

  },
  async getData({ productId, batchNo }) {
    let url = `${Api.newBorrow.queryBwProductInfoNew}?productId=${productId}&batchNo=${batchNo}`

    try {
      let res = await Common.ajax.get(url)
      this.setData({
        productItem: res.message
      })
    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    }

  },
  async getList() {
    let type = 1
    let url = `${Api.product.queryLike}?type=${type}`;
    let res = await Common.ajax.get(url)

    this.setData({
      moreItems: res.message.homeRecommend
    })
  },
  async getConfig() {
    let url = `${Api.borrow.queryBWConfig}`
    let res = await Common.ajax.post(url)
    this.setData({
      beanDescription: res.message.description,
    })
  },
 
  async getUser(bwUserId) {
    let params = {
      customerCode: bwUserId
    }
    let MD5signStr = Common.md5sign(params);
    console.log('66667777')

    let url = `${Api.customer.getUserCenter}?customerCode=${bwUserId}&sign=${MD5signStr}`

    try {
      let res = await Common.ajax.post(url)
      this.setData({
        userimage: res.message.imageUrl,
      })
    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    }

  },
  async getQueryBWRecordList() {
    let { bwUserId, batchNo } = this.data
    let params = {
      bwCustomerCode: bwUserId,
      batchNo,
      offset: 1,
      limit: 10
    }
    let sign = Common.md5sign(params);

    // let bwCustomerCode = 'BLR2Z3TJNV5JE'
    // // let batchNo = 'GXF1S016EGUX96207IN2C461D9KNWYQH'
    // let offset = 1
    // let limit = 10
    // let sign = "58F751411514350EC422F40F08F86791"

    let url = `${Api.borrow.queryBWRecordList}?bwCustomerCode=${bwCustomerCode}&batchNo=${batchNo}&offset=${offset}&limit=${limit}&sign=${sign}`
    let res = await Common.ajax.post(url, {})
    this.setData({
      historTIts: '已有' + res.total + '人借豆给你'
    })


    this.setData({

    })
  },
  sendBorrow() {
    if (this.data.productItem.needConverBeans <= 0) {
      wx.showModal({
        content: '好友转换豆已满！',
        showCancel: false
      })
      return
    }

    let userI = app.globalData.userInfo
    let oldUser, newUser;
    if (userI) {
      oldUser = true
      newUser = false
    } else {
      newUser = true
      oldUser = false
    }

    this.setData({
      btnShows: false,
      oldUser,
      newUser
      // oldUser: true,
      // newUser: false
    })
  },
  BeanInput(e) {
    var value = e.detail.value
    this.setData({
      borrowBeanNumber: value
    })
  },
  showDialogStyle() { },
  sendRefuse() {//残忍拒绝
    let _this = this
    // document.getElementById('failAudio').play()
    this.setData({
      borrowFailShow: true,
    })

    setTimeout(function () {
      _this.setData({
        borrowFailShow: false
      })
    }, 1000)
  },
  async borrowBeanOk() {
    console.log('确认借豆')
    let _this = this
    let { bwUserId, productId, batchNo, title, borrowBeanNumber, giveUserId } = this.data
    // let user = app.globalData.userInfo
    // if (!user)return; 

    if (!borrowBeanNumber) {
      wx.showModal({
        content: '请输入豆额',
        showCancel: false
      })
      return
    }

    let url = `${Api.borrow.bwConverBean}`
    let params = {
      bwCustomerCode,
      giveCustomerCode,
      // bwUserId,
      // giveUserId,
      productId,
      batchNo,
      beans: borrowBeanNumber
    }
    let MD5signStr2 = Common.md5sign(params);
    let reqParams2 = Object.assign(params, { sign: MD5signStr2 })

    try {
      let data = await Common.ajax.post(url, reqParams2)
      // document.getElementById('successAudio').play()
      this.setData({
        borrowSuccess: true
      })

      setTimeout(function () {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 3000)
    }
    catch (error) {
      wx.showModal({
        content: error.message,
        showCancel: false
      })
    }
  },
  async isLogin(bwUserId) {
    let user = app.globalData.userInfo
    // user['wxOpenId'] = 'oyxDksj8lSVqKOaCwff1_4Ki_h3A'

    if (user && user.wxOpenId) {//登录
      let url = Api.customer.checkWxIsLogin
      let params = { "wxOpenId": user.wxOpenId }

      let MD5signStr = Common.md5sign(params);
      let reqParams = Object.assign(params, { sign: MD5signStr })
      let res = await Common.ajax.post(url, reqParams)

      let giveUserId = Common.getCustomerCode()
      // let giveUserId = 'BLR2Z3TJNV5JE'

      console.log('giveUserId', giveUserId)
      console.log('bwUserId:', bwUserId)

      if (bwUserId == giveUserId) {
        console.log('自己看自己')
        this.showRecordList()
      } else {
        this.showHistoryList()
      }

      this.setData({
        userId: res.message,
        giveUserId: giveUserId
      })
    } else {
      this.setData({
        historyIsShow: false
      })
    }
  },
  goProducts(e) {
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: `/pages/product/product-view/product-view?productId=${pid}`
    })

  },
  async onLoad(options) {
    // let { title } = options
    // : bwUserId /: productId /: batchNo

    let { bwUserId, productId, batchNo, title } = options
    // let bwUserId = 'BLR2Z3TJNV5JE' //=customerCode
    // let productId = 'UVA3PXYMWTFAO'
    // let batchNo = 'QV9BW9LBQP4WUJGNUHVLR23QH3XC1YD7'

    // let bwUserId ='FSD6XNE4XE7PI'
    // let productId = 'J72O2Z56ANJRQ'
    // let batchNo = '54168SCY9HLSI7FKFCFRWL49HHWJJJR2'

    this.isLogin(bwUserId);
    this.getData({ productId, batchNo })
    this.getList()
    this.getConfig()
    this.getUser(bwUserId)
    // this.getQueryBWRecordList()

    this.setData({
      bwUserId, productId, batchNo, title
    })
  },
  getShareParams(url) {
    let paramsUrl = url.substring(url.indexOf('borrowBeans'))
    let params = paramsUrl.substring(paramsUrl.indexOf('/'))
    let pararmsArray = params.split('/')

    return {
      bwUserId: pararmsArray[1],
      productId: pararmsArray[2],
      batchNo: pararmsArray[3]
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let { bwUserId, productId, batchNo, title } = this.data

    return {
      title,
      path: `pages/beans/borrow-beans/borrow-beans?bwUserId=${bwUserId}&productId=${productId}&batchNo=${batchNo}&title=${title}`
    }
  }
})