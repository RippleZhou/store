// pages/activityNinetyNine/activityNinetyNine.js
const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    items: [],
    priceRange: 10,
  },
  gotocart() {
    wx.switchTab({
      url: "/pages/cart/cart"
    })
  },
  buyNow(e) {
    let item = e.currentTarget.dataset.item
    const self = this;

    var cartItems = [];

    try {
      const value = wx.getStorageSync('activityCartItems')
      if (value) {
        let valuearr = JSON.parse(value)
        cartItems = valuearr
      }
    } catch (e) {
      console.log('get storage error!')
    }

    let flag = true
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].productId == item.productId) {
        flag = false
      }
    }

    if (flag) {
      cartItems.push(item);

      wx.setStorage({
        key: 'activityCartItems',
        data: JSON.stringify(cartItems)
      })
    }
    this.gotocart()
  },
  gotodetail(e){
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: `/pages/product/product-view/product-view?productId=${pid}`
    })
  },
  filterData(filterIndex, list) {
    console.log('list', list)
    if(list.length==0){
      return list
    }
    let items = list.filter(k => {
      if (k.cashPrice == filterIndex) {
        return k;
      }
    })
    console.log('items:', items)
    return items;
  },
  priceRange(e) {
    let index = e.currentTarget.dataset.index
    let items = []

    if (index == '10') {
      console.log('111')
      items = this.filterData(9.9, this.data.sourceList)
    }
    if (index == '20') {
      console.log('222')
      items = this.filterData(19.9, this.data.sourceList)
    }
    if (index == '30') {
      console.log('333')
      items = this.filterData(29.9, this.data.sourceList)
    }

    this.setData({
      priceRange: index,
      items: items
    })
  },
  async getActivityInfo() {
    let activeCode = 'ninetyNine'
    let url = `${Api.queryActivityNew}?activeCode=${activeCode}&offset=1&limit=2`
    let res = await Common.ajax.get(url)
    if (res.rows.length > 0) {

      this.queryItem(res.rows[0].id)

      this.setData({
        activityInfo: res.rows[0],
        activityId: res.rows[0].id

      })
    } else {
      this.setData({
        sourceList: [],
        activityEnd: true
      })
    }
  },
  async queryItem(activityId) {
    console.log('queryItem')
    
    let offset = 0
    let limit = 10
    let url = `${Api.queryItem}?activityId=${activityId}&offset=${offset}&limit=${limit}`;
    let res = await Common.ajax.get(url)
    console.log('rows:', res.rows)

    this.setData({
      sourceList: res.rows,
      items: this.filterData(9.9, res.rows)
    })
  },

  onLoad: function(options) {
    this.getActivityInfo()
  },

  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})