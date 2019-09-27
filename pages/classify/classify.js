const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    clickedIndex: 0,
    menus: [],
    rightItme: [],
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    Common.request.get(Api.product.category, Common.getparam({ type: 1 }),
      data => {
        let menus = data.message;
        let secondMenu = menus[0]
        self.setData({
          menus: menus,
          secondMenu: secondMenu,
          clickedIndex: 0,
        })
      }
    );
  },
  selecteMenu(e) {
    const self = this;
    let index = e.currentTarget.dataset.index
    console.log(index)
    self.setData({
      secondMenu: self.data.menus[index],
      clickedIndex: index,
    })
  },
  goList(e){
    const self = this;
    let dataset = e.currentTarget.dataset
    console.log(dataset)
  
    wx.navigateTo({
      url: '/pages/product/search-list/search-list?type=1&searchText=' +
        dataset.name + "&parentId=" + dataset.parentId
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '转换商城红包铺路，低价直购风靡全国！',
      path: '/pages/classify/classify'
    }
  }
})