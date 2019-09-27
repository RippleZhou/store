const Common = require('../../../utils/common')
const Util = require('../../../utils/util')
var Api = require("../../../utils/api")
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    bargTips: '',
  },
  attached() { // 在组件实例进入页面节点树时执行
    const self = this
    self.getTips()
  },
  methods: {
    share(e) {
      const self = this

      let params = {};
      let index = e.currentTarget.dataset.index
      let item = self.data.list[parseInt(index)]
      params.virProductId = item.virProductId
      if (app.globalData.userInfo && app.globalData.userInfo.id) {
        params.userId = app.globalData.userInfo.id
      }
      Common.request.get(Api.find.shareCovers,
        params, data => {
          console.log(data)
          if (data.status == 'OK') {
            this.triggerEvent('share', data.message, {})
          }
        }
      )
    },
    getTips(){
      const self = this
      Common.request.get(Api.find.dictsbargain,
        { type: 'tip_bargain' }, data => {
          console.log(data)
          if (data.status == 'OK') {
            self.setData({
              bargTips: data.message[0].value
            })
          }
        }
      )
    },
    goDetails(e) {
      const self = this
      let item = e.currentTarget.dataset.item || {}
      if (item.virType == 1) {//代金券详情
        wx.navigateTo({
          url: '/pages/tab3/store-coupon/store-coupon?virProductId=' + 
            item.virProductId + "&storeid=" + item.vendorId,
        })
      } else {//套餐详情
        wx.navigateTo({
          url: '/pages/tab3/store-meal/store-meal?virProductId=' +
            item.virProductId + "&storeid=" + item.vendorId,
        })
      }
    },
    goConfirmOrder(e) {//抢购
      const self = this
      if (!Common.biz.loggedIn("currentPage")) return;

      let index = e.currentTarget.dataset.index
      let item = self.data.list[parseInt(index)]
      wx.navigateTo({
        url: '/pages/order/bargain-confirm-order/bargain-confirm-order?virProductId=' +
          item.virProductId
      })
    },
    clickBargain(e) {//砍价
      const self = this
      let index = e.currentTarget.dataset.index
      let list = self.data.list
      if (!Common.biz.loggedIn("currentPage")) return;

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
            self.setData({
              list: list
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
  }
})
