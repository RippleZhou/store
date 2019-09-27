const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
var Util = require("../../../utils/api")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeid: null,
    virProductId: null,
    details: {},
    storeInfo: {},
    bargTips: '购买金额再得等额商品（转换豆）！',
    shareObj: {},
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    if (options.storeid) {
      self.setData({
        storeid: options.storeid
      })
      self.setData({
        virProductId: options.virProductId
      })
      self.getDetails()
      self.getTips()
      self.toShare()
    }
  },
  getTips() {
    const self = this
    Common.request.get(Api.find.dictsbargaindetail, { type: 'tip_bargain_detail' }, (data) => {
      self.setData({
        bargTips: data.message[0].value
      })
    }
    );
  },
  getDetails: function () {
    const self = this
    let params = {}
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      params.userId = app.globalData.userInfo.id
    }
    params.virProductId = self.data.virProductId
    Common.request.post(Api.find.virProductDetail, params, (data) => {
      // console.log(data)
      self.setData({
        details: data.message,
        storeInfo: data.message.storeInfo
      })
    });
  },
  openmap() {
    const self = this
    let storeInfo = self.data.storeInfo
    // console.log(item)

    let latitude = parseFloat(storeInfo.Latitude)
    let longitude = parseFloat(storeInfo.Longitude)

    let Tx = Common.bd_decrypt(longitude, latitude);
    let name = storeInfo.storeBriefName
    let address = storeInfo.storeAddress
    wx.openLocation({
      latitude: Tx.lat,
      longitude: Tx.lng,
      name: name,
      address: address,
      scale: 21
    })
  },
  callPhone() {
    const self = this
    wx.makePhoneCall({
      phoneNumber: self.data.storeInfo.phone // 仅为示例，并非真实的电话号码
    })
  },
  confirmOrder(e) {//抢购
    if (!Common.biz.loggedIn("currentPage")) return;

    const self = this
    let virProductId = self.data.virProductId
    wx.navigateTo({
      url: '/pages/order/bargain-confirm-order/bargain-confirm-order?virProductId=' + virProductId,
    })
  },
  clickBargain(e) {//砍价
    if (!Common.biz.loggedIn("currentPage")) return;

    const self = this
    let details = self.data.details
    let params = {}
    params['virProductId'] = self.data.virProductId
    params['userId'] = app.globalData.userInfo.id
    Common.request.post(Api.find.bargain, Common.miscellaneous.signedParams(params),
      data => {
        if (data.message.bargainAmount) {
          details.isBargain = 1
          details.productPrice = Util.floatSub(list[index].productPrice, data.message.bargainAmount)
          details.bargainPeopleNum = list[index].bargainPeopleNum + 1
          wx.showToast({
            title: '您已成功砍掉了' + parseFloat(data.message.bargainAmount) + '元！',
            icon: 'none',
            duration: 1500
          })
          self.setData({
            details: details
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1500
          })
        }
      })
  },
  toShare() {
    const self = this

    let params = {};
    let virProductId = self.data.virProductId
    params.virProductId = virProductId
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      params.userId = app.globalData.userInfo.id
    }
    Common.request.get(Api.find.shareCovers,
      params, data => {
        // console.log(data)
        if (data.status == 'OK') {
          let shareObj = {}
          let paramStr = data.message.shareUrl.split("bargainSharing")[1]
          if (!paramStr) return
          let tempArr = paramStr.split("/")

          shareObj.title = data.message.title
          shareObj.path = "/pages/tab3/bargain-sharing/bargain-sharing?virProductId=" +
            tempArr[1] + "&vendorId=" + tempArr[2] + "&userId=" + tempArr[3]
          shareObj.imageUrl = data.message.imageUrl
          self.setData({
            shareObj: shareObj
          })
        }
      }
    )
    
  },
  goDetail() {
    const self = this
    let url = "/pages/tab3/store-details/store-details?storeid=" + self.data.storeInfo.id +
      "&name=" + self.data.storeInfo.storeBriefName
    wx.navigateTo({
      url: url,
    })
  },
  onShareAppMessage: function (res) {
    const self = this
    if (res.from === 'button') {
      return self.data.shareObj
    }
  }
})