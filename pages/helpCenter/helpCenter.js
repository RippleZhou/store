const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
var questionTitle = require("./questionTitle.js")
console.log(questionTitle)

Page({
  data: {
    questions:[],
    swiperItems: questionTitle,
    tabs:[
      { name: '账户类',id:1}, {name: '订单类',id:2},{name: '发现类',id:3},{ name: '物流类',id:4},{ name:'新手指引',id:5}
    ],
    currentTab: 0,
    list: [],
    newproductList: []
  },
  getQuestions(qType){
    console.log('qType:',qType)
    
      questionTitle.forEach(k=>{
        if (k.tabID == qType.toString()){
          console.log('qType22:', qType)
          this.setData({
            questions: k.questions
          })
        }
      })
  },
  onLoad(){
    this.getQuestions(this.data.currentTab+1)
  },
  gotoDetail(e){
    console.log('gotoDetail',e.currentTarget.dataset)
    let { qtypeid,qid} = e.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/helpCenterDetail/helpCenterDetail?qtypeid=${qtypeid}&qid=${qid}`,
    })

  },
 
  getData() {
    const self = this
    Common.request.get(Api.indexQuery, {
      type: 2
    },
      (data) => {
        let message = data.message
        self.setTabs(message.homeTypes)
        var newFloors = self.getFloors(message.homeFloors);
        message.homeFloors = newFloors
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
  swiperChangeTab(event) {
    console.log('swiperChangeTab')
    var current = event.detail.current
    const self = this
    var typeid = 0

    this.data.tabs.forEach((k, i) => {
      if (i == current - 1) {
        typeid = k.id
      }
    })
    this.getQuestions(current+1)
    self.setData({
      currentTab: event.detail.current
    })
  },
  jumpTab(e) {
    console.log('jumpTabs')
    const self = this
    let dataset = e.currentTarget.dataset
    self.setData({
      currentTab: dataset.index
    })
  },
  setTabs(homeTypes) {
    console.log('setTabs')
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
})