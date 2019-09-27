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
    offset: 1,
    limit: 10,
    total: 0,
    list: [],
    commentContent: "",
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
      self.getData()
    }
  },
  getData: function () {
    const self = this
    if (self.data.total <= self.data.offset && self.data.total != 0) return

    let params = {
      storeId: self.data.storeid,
      offset: self.data.offset,
      limit: self.data.limit,
      cusCode: app.globalData.userInfo.customerCode
    }
    Common.request.post(Api.find.queryComment, params, (data) => {
      let offset = self.data.offset + self.data.limit
      let list = self.data.list
      if(list.length > 0 ) {
        list = list.concat(data.rows)
      } else {
        list = data.rows
      }
      self.setData({
        list: list,
        total: data.total,
        offset: offset
      })
    },
    ()=>{},1
    )
  },
  setDefaultValue: function (e) {
    var self = this
    self.setData({
      commentContent: e.detail.value
    })
  },
  scrolltolower(e) {
    const self = this
    self.getData()
  },

  submit() {
    //发表
    const self = this
    if (!Common.biz.loggedIn("currentPage")) return;

    if (self.data.commentContent.length < 12) {
      wx.showToast({
        title: '评论内容不能小于12个字',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    let url = Api.find.addComment + "?storeId=" + self.data.storeid +
      "&createUserId=" + app.globalData.userInfo.id + 
      "&commentContent=" + self.data.commentContent
    Common.request.post(url, [], (data) => {
      wx.showToast({
        title: '提交成功！内容正在审核中...',
        icon: 'none',
        duration: 1500
      })
    })
  },
  onShareAppMessage: function () {

  }
})