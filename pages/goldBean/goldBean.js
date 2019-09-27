// pages/lowbuy/lowbuy.js
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()



Page({
  data: {
    //全部后面的类型 数据 缓存
    cacheList: [
      // {tid:107,data:[]}
    ],
    empty: '',
    tabs: [],
    currentTab: 0,
    list: [],
    newproductList: []
  },
  getTabHead(index) {
    const self = this
    if (self.data.tabs[index].headList && self.data.tabs[index].headList.length > 0) return

    if (index == 0 || self.data.requestLock) return //推荐页面不请求 已经请求的不请求

    self.setData({
      requestLock: true
    })
    Common.request.get(
      Api.types.clickType, {
        typeId: self.data.tabs[index].id,
        type: 1
      },
      data => {
        // console.log(data)
        let tabs = self.data.tabs
        let headList = data.message.phTypeList || []
        tabs[index].headList = headList.slice(0, 9)
        tabs[index].offset = 0
        tabs[index].limit = 10
        tabs[index].parentId = headList[0].id
        self.getTabProList(index)
        self.setData({
          requestLock: false,
          tabs: tabs
        })
      }
    );
  },
  getData() {
    const self = this
    Common.request.get(Api.indexQuery, {
      type: 3
    },
      (data) => {
        let message = data.message

        console.log('message::', message)

        self.setTabs(message.homeTypes)

        var newFloors = self.getFloors(message.homeFloors);
        message.homeFloors = newFloors
        console.log('message::2', message)

        message.newproductList = this.data.newproductList
        self.setData({
          recommend: message
        })
      }
    );
  },
  getFloors(floors) {
    const self = this;
    var arr = [];
    floors.forEach(item => {
      arr.push({
        ad_list: {
          proid: item.id,
          url: "",
          img: item.imgUrl,
          jumpId: item.jumpId,
          jumpIds: item.jumpIds,
          jumpType: item.jumpType
        },
        proList: self.getProductList(item.proProductVos)
      });
    });
    return arr;
  },
  getProductList(productList) {
    var arr = [];
    productList.forEach(item => {
      var flag = {
        payByBean: false,
        payByQuan: false,
        payByGoldenBean: false
      };
      switch (item.sourceType) {
        case 1:
          flag.payByBean = true;
          flag.payByQuan = true;
          break;
        case 2:
          flag.payByQuan = true;
          break;
        case 3:
          flag.payByGoldenBean = true
          break;
        case 4:
          break;
        case 5:
          break;
      }
      var pro = {
        proId: item.productId,
        proTit: item.brandName + ' ' + item.productTitle,
        proImg: 'http://test.img.3721zh.com/UploadFiles/Product/' + item.productId + '/AppPic/1Master.jpg', //item.imgUrl,
        proPrice: new Number(item.priceCurrentPrice).toFixed(2),
        pbuyNum: item.requestBuyLimit
      };
      arr.push(Object.assign(pro, flag));
    });
    return arr;
  },
  gotoDetail(e) {
    var pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: `/pages/product/product-view/product-view?productId=${pid}`
    })
    console.log(pid)
    //跳详情
  },
  getCache(typeid) {
    var array = []
    this.data.cacheList.forEach(k => {
      if (k.tid && k.tid == typeid) {
        array = k.data
      }
    })
    return array;
  },
  swiperChangeTab(event) {
    console.log('event:', event)
    var current = event.detail.current
    const self = this
    console.log('current', current)
    console.log('this.data.message:', this.data.recommend.homeTypes)
    var typeid = 0
    this.data.recommend.homeTypes.forEach((k, i) => {
      if (i == current - 1) {
        console.log(k.id)
        typeid = k.id
      }
    })

    var cache = this.getCache(typeid)
    if (cache.length > 0) {
      this.setData({
        empty: '',
        list: cache,
        showEmpty: false
      })
    } else {
      var params = {
        typeId: typeid,
        sourceType: 3,
        offset: 0,
        limit: 10
      }
      Common.request.get(Api.clickFType, params, data => {
        if (data.status == 'OK') {
          if (data.rows.length == 0) {
            this.setData({
              empty: '没有更多数据',
              showEmpty: true
            })
          } else {
            this.setData({
              empty: '',
              showEmpty: false
            })
          }

          var cache = {
            tid: params.typeId,
            data: data.rows
          }

          this.data.cacheList.push(cache)

          this.setData({
            cacheList: this.data.cacheList,
            list: data.rows
          })
        }
      })
    }

    self.getTabHead(current)
    self.setData({
      currentTab: event.detail.current
    })
  },
jumpTab(e) {
  const self = this
  let dataset = e.currentTarget.dataset
  self.getTabHead(dataset.index)
  self.setData({
    currentTab: dataset.index
  })
},
setTabs(homeTypes) {
  let self = this
  var arr = [];
  homeTypes.forEach(item => {
    arr.push({
      id: item.id,
      name: item.name
    });
  });
  arr.unshift({
    id: -1,
    name: "全部"
  });
  self.setData({
    tabs: arr
  })
},

onLoad: function (options) {
  this.getData()
},



/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {

}
})