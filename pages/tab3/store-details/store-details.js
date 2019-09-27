const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
var Util = require("../../../utils/api")
const app = getApp()

console.log('Util:::',Util)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {},
    storeid: null,
    mealsInfo: [],
    couponInfo: [],
    swiperAutoPlay: true,
    bargTips: '购买金额再得等额商品（转换豆）！',
    popupShow: false,
    shareObj: {},
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
  },
  onLoad: function (options) {
    const self = this
    if(options.name) {
      wx.setNavigationBarTitle({
        title: options.name
      })
    }
    if (options.storeid) {
      self.setData({
        storeid: options.storeid
      })
      self.getStoreInfo()
      self.getDiscountInfo()
      self.getTips()
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
  getStoreInfo() {
    const self = this
    Common.request.post(Api.find.queryStore + "?storeId=" + 
      self.data.storeid + "&offset=1&limit=3", {}, (data) => {
        self.setData({
          storeInfo: data.message
        })
      }
    );
  },
  getDiscountInfo() {
    const self = this
    let params = {}
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      params.userId = app.globalData.userInfo.id
    }
    params.vendorId = self.data.storeid
    Common.request.post(Api.find.virProductsOfVendor, params, (data) => {
        // console.log(data)
        let couponInfo = []
        let mealsInfo = []
      for (let i = 0; i < data.message.length; i++) {
          if (data.message[i].virType == 1) {
            couponInfo.push(data.message[i]);
          } else {
            mealsInfo.push(data.message[i]);
          }
        }
        self.setData({
          couponInfo: couponInfo,
          mealsInfo: mealsInfo
        })
      }
    );
  },
  closePopup() {
    const self = this
    self.setData({
      popupShow: false
    })
  },
  swiperChange(e) {
    const self = this
    if ( e.detail.current == self.data.storeInfo.imgs.length-1) {
      self.setData({
        swiperAutoPlay: false
      })
    }
  },
  stopAutoPlay() {
    const self = this
    self.setData({
      swiperAutoPlay: false
    })
  },
  callPhone() {
    const self = this
    wx.makePhoneCall({
      phoneNumber: self.data.storeInfo.phone // 仅为示例，并非真实的电话号码
    })
  },
  openmap(e) {
    const self = this
    let index = e.currentTarget.dataset.index
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
  toShare(e) {
    const self = this

    let params = {};
    let virProductId = e.currentTarget.dataset.id
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
            popupShow: true,
            shareObj: shareObj
          })
        }
      }
    )
  },
  confirmOrder(e) {//抢购
    if (!Common.biz.loggedIn("currentPage")) return;

    let virProductId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/bargain-confirm-order/bargain-confirm-order?virProductId=' + virProductId,
    })
  },

  clickBargain(e) {//砍价
    if (!Common.biz.loggedIn("currentPage")) return;

    const self = this
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let list = []
    if(type =="coupon") {
      list = self.data.couponInfo
    } else {
      list = self.data.mealsInfo
    }
    let params = {}
    params['virProductId'] = list[index].virProductId
    params['customerCode'] = Common.getCustomerCode()
    Common.request.post(Api.find.bargain, Common.miscellaneous.signedParams(params),
      data => {
        if (data.message.bargainAmount) {
          list[index].isBargain = 1
          list[index].productPrice = Util.floatSub(list[index].productPrice, data.message.bargainAmount)
          list[index].bargainPeopleNum = list[index].bargainPeopleNum + 1
          wx.showToast({
            title: '您已成功砍掉了' + parseFloat(data.message.bargainAmount) + '元！',
            icon: 'none',
            duration: 1500
          })
          if (type == "coupon") { 
            self.setData({
              couponInfo: list
            })
          } else {
            self.setData({
              mealsInfo: list
            })
          }
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1500
          })
        }
      })
  },
  goCommentList() {
    wx.navigateTo({
      url: "/pages/tab3/comments/comments?storeid=" + this.data.storeid,
    })
  },
  goDeatails(e) {
    const self = this
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let list = []
    if (type == "coupon") {
      list = self.data.couponInfo
      wx.navigateTo({
        url: '/pages/tab3/store-coupon/store-coupon?virProductId=' + list[index].virProductId
          + "&storeid=" + self.data.storeid,
      })
    } else {
      list = self.data.mealsInfo
      wx.navigateTo({
        url: '/pages/tab3/store-meal/store-meal?virProductId=' + list[index].virProductId
          + "&storeid=" + self.data.storeid,
      })
    }
  },
  onShareAppMessage: function () {
    const self = this
    if(self.data.popupShow) {
      return this.data.shareObj
    } else {
      return {
        title: "转换商城霸王餐，一言不合就免单，咱也体验看看！"
      }
    }
  }
})