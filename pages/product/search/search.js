const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historySearchKeys: [],
    hotKeys: [],
    list: [],
    searchKey: "",
    type: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this 
    if (options.type) {
      self.setData({
        type: options.type
      })
    }
    self.getData()
  },
  onShow: function(){
    const self = this 
    let historySearchKeys = wx.getStorageSync('historySearchKeys') || [];
    self.setData({
      searchKey: '',
      historySearchKeys: historySearchKeys.reverse()
    })
  },
  getData(){
    const self = this 
    
    Common.request.get(Api.product.queryLike,
      { type: self.data.type }, data => {
        console.log(data)
        let hotKeys = data.message.hotSearch.reverse()
        
        self.setData({
          hotKeys: hotKeys,
          list: data.message.homeRecommend
        })
      }
    )
  },
  
  setDefaultValue: function (e) {
    const self = this
    self.setData({
      searchKey: e.detail.value
    })
  },
  goBack() {
    wx.navigateBack()
  },
  deleteSearchKeys() {
    const self = this
    self.setData({
      historySearchKeys: []
    })
    wx.removeStorage({
      key: 'historySearchKeys'
    })
  },
  goSearchList(e) {
    const self = this
    let searchText = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '/pages/product/search-list/search-list?type=' +
        self.data.type + '&searchText=' + searchText,
    })
  },
  search() {
    const self = this
    if (self.data.searchKey.trim() == '') return

    let historySearchKeys = self.data.historySearchKeys
    for (var index in historySearchKeys) {//去掉重复的搜索
      if (historySearchKeys[index] == self.data.searchKey) {
        historySearchKeys.splice(index, 1);
      }
    }

    historySearchKeys.push(self.data.searchKey)
    console.log(historySearchKeys)
    wx.setStorage({//保存cookie 到storage
      key: "historySearchKeys",
      data: historySearchKeys
    })

    wx.navigateTo({
      url: '/pages/product/search-list/search-list?type=' + 
        self.data.type + '&searchText=' + self.data.searchKey,
    })
  },
})