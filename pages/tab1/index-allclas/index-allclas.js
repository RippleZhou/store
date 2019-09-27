const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    id: null,
    parentId: null,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const self = this
    self.setData({
      id: parseInt(options.id),
      parentId: parseInt(options.parentId),
      title: options.title,
    })
    self.getData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  getData: function () {
    const self = this
    Common.request.get(
      Api.types.clickType, { typeId: self.data.id, type: 1 },
      data => {
        // console.log(data)
        let productList = []
        let currentTab = 0
        for (var index in data.message.phTypeList) {
          if (data.message.phTypeList[index].id == self.data.parenId) {
            currentTab = index; 
            break;
          }
          let tempObj = {}
          tempObj.offset = 0
          tempObj.limit = 10
          tempObj.lastFlag = false
          tempObj.name = data.message.phTypeList[index].name
          tempObj.parentId = data.message.phTypeList[index].parentId
          tempObj.id = data.message.phTypeList[index].id
          productList.push(tempObj)
        }
        // productList.for
        self.setData({
          currentTab: currentTab,
          productList: productList
        })
        self.getProList()
      }
    );
  },
  getProList: function () {
    const self = this
    let currentTab = self.data.currentTab
    let productList = self.data.productList
    let classifyObj = productList[currentTab]
    if (productList.length == 0) return
    if (productList[currentTab] && productList[currentTab].lastFlag) return //翻到最后一页 total <= offset
    Common.request.get(
      Api.types.clickSType,
      {
        typeId: self.data.id,
        parentId: classifyObj.id,
        offset: classifyObj.offset,
        limit: classifyObj.limit,
        recommend: 1,
        sourceType: 1,
        defaultLimit: 0,
      },
      data => {
        console.log(data)
        
        if (data.rows && data.rows.length > 0) {
          if (productList[currentTab].list && productList[currentTab].list.length > 0) {
            productList[currentTab].list = productList[currentTab].list.concat(data.rows)
          } else {
            productList[currentTab].list = data.rows
          }
          productList[currentTab].total = data.total
          productList[currentTab].offset += productList[currentTab].limit
          if (productList[currentTab].total <= productList[currentTab].offset) {
            productList[currentTab].lastFlag = true
          }
          self.setData({
            productList: productList
          })
        }
      }
    );
  },
  jumpTab(e) {
    var self = this
    let dataset = e.currentTarget.dataset
    self.setData({
      currentTab: dataset.index
    })
    self.getProList()
  },
  scrolltolower(){
    const self = this
    self.getProList()
  },
  swiperChangeTab(event) {
    var self = this
    self.setData({
      currentTab: event.detail.current
    })
    self.getTabHead()
  },
})