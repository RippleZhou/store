const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 10,
    total: 0,
    items: [],
    searchText: '',
    noDataImgUrl: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_02.png',
    imgIsShow: false,
    options: {},
    requestUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var self = this
    let requestUrl = null
    if (!options.parentId) {
      requestUrl = Api.types.search
    } else {
      requestUrl = Api.types.categorySear
    }
    self.setData({
      searchText: options.searchText || '',
      requestUrl: requestUrl,
      options: options
    })
    
    self.getProList()
  },
  scrolltolower(){
    var self = this
    self.getProList()
  },
  getProList() {
    var self = this

    if (self.data.total <= self.data.offset && self.data.total != 0) return //翻到最后一页 

    let options = self.data.options
    let params = {
      searchText: self.data.searchText,
      sourceType: options.type,
      offset: self.data.offset,
      limit: self.data.limit
    }
    if (options.parentId) {
      params.parentId = options.parentId || ''
      params.typeId = options.typeId || ''
    } else {
      params.typeId = options.typeId || ''
    }

    Common.request.get(self.data.requestUrl, 
      params,data => {
        console.log(data)
        let items = self.data.items
        if (data.rows && data.rows.length > 0) {
          if (items.length > 0) {
            items = items.concat(data.rows)
          } else {
            items = data.rows
          }
          let offset = self.data.limit + self.data.offset
          
          self.setData({
            items: items,
            total: data.total,
            offset: offset
          })
        }
      }
    );
  },
  setDefaultValue: function (e) {
    var self = this
    self.setData({
      searchText: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  search(){
    console.log('search')
    var self = this
    self.setData({
      offset: 0,
      limit: 10,
      total: 0,
      items: [],
    })
    self.getProList()
  },
  onUnload: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})