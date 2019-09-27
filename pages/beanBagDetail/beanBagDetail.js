// pages/beanBagDetail/beanBagDetail.js

const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

Page({
  data: {
    list: [],
    page: 0,
    bean_detail_logo: "data:image/png;base64,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"
  },
  addBean() {
    wx.navigateTo({
      url: '/pages/chargeBean/chargeBean',
    })
  },
  getList(envEnvelopeId) {
    let that = this
    let url = ''
    console.log('page:', this.data.page)
    let limit = 10
    let page = this.data.page
   
    let offset = page * limit
    let envelopeId = envEnvelopeId //580
    let id = 0 //290070

    url = `${Api.userEnvelope.queryTimingConvertEnvelopeDetail}?envelopeId=${envelopeId}&id=${id}&offset=${offset}&limit=${limit}`

    // if (!this.envCode)
    //   url = Api.userEnvelope.queryTimingConvertEnvelopeDetail + '?envelopeId=' + this.envEnvelopeId + '&id=' + id + '&'
    // else

    Common.request.post(url, {}, function (data) {
      if (data.status == 'OK') {
        //没有数据

        let hasPage = data.total / limit - page
        if (data.rows.length > 0) {
          that.setData({
            list: that.data.list.concat(data.rows),
            page:++page,
            hasPage
          })
        }
      }
    })
  },
  onLoad: function (option) {
    
    let envEnvelopeId = option.envEnvelopeId
    console.log('envEnvelopeId:', envEnvelopeId)
    this.getList(envEnvelopeId)
  },

  onReachBottom: function () {
    console.log('上拉触底')
    console.log('this.data.hasPage', this.data.hasPage)

    if (this.data.hasPage > 0) {
      this.getList()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})