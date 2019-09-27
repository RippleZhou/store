
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    redPacketShow:false,
    redClose: false,
    useRedShow:false,

    showSmallRed:true,
   
    appdownloadHidden:true,
    shareShow:false,
    tabs: [],
    currentTab: 0,
    recommend: {},
    speLows: 0,
    headclas: '',
    beforeOpenedShow: false,
    miniRedPacket: false,
    dialogshow: false,
    requestLock: false,//数据请求锁定
  },
  closeRed(){
    this.setData({
      redPacketShow:false,
      useRedShow:false,
      redClose:false,
      showSmallRed:false,
    })
  },
  startUseRed(){
    this.closeRed()
    this.hideSmallRed()
  },
  async getRed(){
    let customerCode = Common.getCustomerCode()
    let params = {
      customerCode
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    let url = Api.userEnvelope.takeIndexEnv
    try {
      let res = await Common.ajax.post(url, reqParams)
      this.setData({
        useRedShow:true,
        num: res.message,
        redPacketShow: false
      })
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon:'none'
      })
    }
  },
  async openRed(){
    if (!Common.biz.loggedIn(Common.getRoute())) {
      return;//检查登录
    } else {
     this.getRed()
    }
  },
  scan(){
    console.log('scan')
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },
  download(){
    wx.navigateTo({
      url: '/pages/navigateDownload/navigateDownload',
    })
  },
  closeDownload(){
    this.setData({
      appdownloadHidden:true
    })
  },
  showRed(){
    this.setData({
      redPacketShow: true,
      redClose: true,
      showSmallRed: true
    })
  },
  async hasGetRed(){
    let url = Api.userEnvelope.checkUserDayEnv
    let customerCode = Common.getCustomerCode()
    let params={
      customerCode
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    try{
      let res = await Common.ajax.post(url, reqParams)
      this.showRed()
    }catch(err){
      this.hideRed()
      this.hideSmallRed()
    }
  },
  hideSmallRed(){
    this.setData({
      showSmallRed:true
    })
  },
  hideRed(){
    this.setData({
      redPacketShow: false,
      redClose:false,
      showSmallRed: false
    })
  },
   onShow() {
     let customerCode = Common.getStorage('customerCode')
   
    //  还需要添加有没有领过红包的 字段（问后台），没领过会有小弹窗
     if (!Common.getStorage('customerCode')){
       this.showRed()
     }
     this.getData()
     this.hasGetRed()
 

    // app.loginMini(res=>{
    //   console.log('res:',res)
    // })

    // wx.login({
    //    success(res){
    //     console.log('res：：：',res)
    //      let authCode= res.code
    //      let params = {
    //        authCode: res.code
    //      }
    //      let sign = Common.miscellaneous.getSign(params);
    //     //  let sign = Common.md5sign(params);
    //      let url = `${Api.customer.getOpenId}?authCode=${authCode}&sign=${sign}`
    //      Common.request.post(url, { ...params,sign},aa=>{ })
    //   }
    // })
  },
  shareHide() {
    this.setData({
      shareShow: false
    })
  },
  getData(){
    console.log('getdata')
    const self = this

    Common.request.get(Api.index.query,{ type: 1 },
      (data) => {
        let message = data.message
        self.setTabs(message.homeTypes)
        var newFloors = self.getFloors(message.homeFloors);
        message.homeFloors = newFloors
  
        message.homeNavigs=message.homeNavigs.map(k=>{
          console.log('输入的id：',k.id)
          

          if(k.id==21){
            k.directUrl ='/pages/lowbuy/lowbuy'
          }

          if(k.id==22){
            k.directUrl='/pages/goldBean/goldBean'
          }
          if (k.id == 3) {
            k.directUrl = '/pages/signInRedPackage/signInRedPackage'
          }

          return k
        })

        console.log('index-message', message)
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
        proImg: 'http://test.img.3721zh.com/UploadFiles/Product/' + item.productId + '/AppPic/1Master.jpg',//item.imgUrl,
        proPrice: new Number(item.priceCurrentPrice).toFixed(2),
        pbuyNum: item.requestBuyLimit
      };
      arr.push(Object.assign(pro, flag));
    });
    return arr;
  },
  setTabs(homeTypes){
    let self = this
    var arr = [];
    homeTypes.forEach(item => {
      arr.push({
        id: item.id,
        name: item.name
      });
    });
    arr.unshift({ id: -1, name: "推荐" });
    self.setData({
      tabs: arr
    })
  },
  swiperChangeTab(event){
    const self = this
    self.getTabHead(event.detail.current)
    self.setData({
      currentTab: event.detail.current
    })
  },
  jumpTab(e){
    const self = this
    let dataset = e.currentTarget.dataset
    self.getTabHead(dataset.index)
    self.setData({
      currentTab: dataset.index
    })
  },
  getTabHead(index){
    const self = this
    if (self.data.tabs[index].headList && self.data.tabs[index].headList.length > 0) return

    if (index == 0 || self.data.requestLock) return//推荐页面不请求 已经请求的不请求
    
    self.setData({
      requestLock: true
    })
    Common.request.get(
      Api.types.clickType, { typeId: self.data.tabs[index].id, type: 1 },
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
  getTabProList(index){
    const self = this
    
    let tabData = self.data.tabs[index]
    if (tabData.total <= tabData.offset) return //翻到最后一页 total <= offset
    
    Common.request.get(
      Api.types.clickSType, 
      { 
        typeId: tabData.id,
        parentId: tabData.parentId,
        offset: tabData.offset,
        limit: tabData.limit,
        recommend: 1,
        sourceType: 1,
        defaultLimit: 0,
      },
      data => {
        console.log(data)
        let tabs = self.data.tabs
        if (data.rows && data.rows.length > 0) {
          if (tabs[index].proList && tabs[index].proList.length > 0) {
            tabs[index].proList = tabs[index].proList.concat(data.rows)
          } else {
            tabs[index].proList = data.rows
          }
          tabs[index].total = data.total
          tabs[index].offset += tabData.limit
          if (tabs[index].total <= tabs[index].offset) {
            tabs[index].lastFlag = true
          }
          self.setData({
            tabs: tabs
          })
        }
      }
    );
  },
  scrolltolower(e) {
    let self = this
    let dataset = e.currentTarget.dataset
    if (dataset.index > 0) {
      self.getTabProList(dataset.index)
    }
  },
  search() {
    wx.navigateTo({
      url: '/pages/product/search/search',
    })
  },
  appdownload(e){
   this.setData({
     appdownloadHidden:false
   })
  },
  getBeanId(e){
    console.log('首页的id：', e.detail.share)
    let shareParams= this.getShareParams(e.detail.share.shareUrl)
    this.setData({
      shareParams,
      share: e.detail.share
    }) 
  },
  getShareParams(url){
    let paramsUrl=url.substring(url.indexOf('borrowBeans'))
    let params =paramsUrl.substring(paramsUrl.indexOf('/'))
    let pararmsArray = params.split('/')

    this.setData({
      shareShow:true
    })

    return {
      bwUserId: pararmsArray[1],
      productId: pararmsArray[2],
      batchNo:pararmsArray[3]
    }
  },
  onShareAppMessage: function (res) {
    let { title} =this.data.share
    let { bwUserId, productId, batchNo}=this.data.shareParams

    return {
      title,
      path: `pages/beans/borrow-beans/borrow-beans?bwUserId=${bwUserId}&productId=${productId}&batchNo=${batchNo}&title=${title}`
      // imageUrl: shareUrl,
      //  path: '/pages/index/index'
    }
  }
})
