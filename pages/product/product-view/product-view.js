const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
var Util = require("../../../utils/util")
const app = getApp()
let {
  regeneratorRuntime
} = global
Page({
  data: {
    showDetail: false, //当前选中的标签(商品/详情)
    productId: null,
    lunbo: [],
    type: 0,
    productDetails: {},
    skuList: [],
    skuSelected: -1,
    histories: [],
    imgheights: [],
    maxHeight: null,
    swiperAutoPlay: true,
    currentImg: 0,
    cutOffTime: {},
    productImgs: [],
    flags: ["自营电商", "正品保证", "7天退换货", "满49元包邮"],
    popupShow: false,
    amount: 1,
    shareObj: {},
    loginFlag: false,
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    shareShow: false,
  },
  onLoad: function (options) {
    console.log('当前页面站', getCurrentPages())

    console.log('customerCode:onload')
    console.log(options)
    const self = this
    self.setData({
      productId: options.productId,
      type: options.type || 0
    })
    self.getLunbo()
    self.getDetail()
    self.getPurchaseHistory()
    // if (Common.biz.loggedIn()) {
    //   self.borrowBeans()
    //   self.setData({
    //     loginFlag: true
    //   })
    // }
  },
  shareHide() {
    this.setData({
      shareShow: false
    })
  },
  productChange(e) {
    const self = this
    let index = e.currentTarget.dataset.index
    if (!index && index != 0) return
    let productId = self.data.skuList[index].product_id
    self.setData({
      productId: productId
    })
    self.getLunbo()
    self.getDetail()
    self.getPurchaseHistory()
    if (Common.biz.loggedIn()) {
      // self.borrowBeans()
      self.setData({
        loginFlag: true
      })
    }
  },
  swiperChange(e) {
    var self = this
    if (self.data.swiperAutoPlay && e.detail.current == self.data.lunbo.length - 1) {
      self.setData({
        swiperAutoPlay: false
      })
    }
    self.setData({
      currentImg: e.detail.current
    })
  },
  stopAutoPlay() {
    console.log(1111)
    this.setData({
      swiperAutoPlay: false
    })
  },
  imageLoad: function (e) { //获取图片真实宽度  
    const self = this
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = self.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights.push(imgheight);
    let maxHeight = Math.max(...imgheights)
    self.setData({
      maxHeight: maxHeight,
      imgheights: imgheights
    })
  },
  getLunbo() {
    const self = this
    Common.request.get(Api.product.lunbo, {
      productId: self.data.productId
    }, data => {
      // console.log(data)
      self.setData({
        lunbo: data.message
      })
    })
  },
  getDetail() {
    const self = this
    Common.request.get(Api.product.detail, {
      productId: self.data.productId,
      tigger: self.data.type
    }, data => {
      // console.log(data)
      let productDetails = data.message.productDetails
      if (productDetails.endDate) {
        self.cutOffTimes(productDetails.endDate)
      }
      if (productDetails.productAppDesc) {
        self.getProductImgs(productDetails.productAppDesc)
      }
      let skuSelected = -1
      if (data.message.skuList.length > 0) {
        for (let i = 0; i < data.message.skuList.length; i++) {
          if (data.message.skuList[i].product_id == self.data.productId) {
            skuSelected = i
            break;
          }
        };
      }
      console.log(skuSelected)
      self.setData({
        productDetails: productDetails,
        skuList: data.message.skuList,
        skuSelected: skuSelected,
      })
    })
  },
  getProductImgs(desc) {
    const self = this
    if (!desc) return {
      srcs: []
    };
    var regGetBQ = /<img\b.*?(?:\>|\/>)/gi;
    var regGetUrl = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arrBQ = desc.match(regGetBQ);
    var arr = [];
    arrBQ.forEach(item => {
      arr.push(item.match(regGetUrl)[1]);
    });
    self.setData({
      productImgs: arr
    })
  },
  cutOffTimes(endDate) {
    const self = this
    setInterval(function () {
      self.setData({
        cutOffTime: Util.getDateObj(endDate)
      })
    }, 1000)
  },
  async getPurchaseHistory() {
    let customerCode = Common.getCustomerCode()
    let {
      productId
    } = this.data
    let url = `${Api.product.purchaseHistory}?productId=${productId}&customerCode=${customerCode}`
    let data = await Common.ajax.get(url)
    let histories = data.message || []
    var tempArr = [];
    histories.forEach(element => {
      tempArr.push({
        title: `${element.nickName} ${element.second}秒前兑换了该产品`
      });
    });
    this.setData({
      histories: tempArr
    })
  },
  goLogin() {
    console.log('去街鬥', Common.getRoute())
    // pages / product / product - view / product - view
    wx.navigateTo({
      url: '/pages/user/login/login?jumpUrl=' + encodeURIComponent(Common.getRoute()),
    })
  },
  toggleSize() {
    this.setData({
      popupShow: true,
    })
  },
  closePopup() {
    this.setData({
      popupShow: false,
    })
  },
  tabClicks(e) {
    const self = this
    let dataset = e.currentTarget.dataset
    let showDetail = false
    if (dataset.detail) {
      showDetail = true
      let scrollTop = 0
      var query = wx.createSelectorQuery();
      query.select('#top-layout').boundingClientRect()
      query.exec(function (res) {
        let scrollTop = res[0].height
        console.log(res[0].height);
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: 500
        })
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
    }
    self.setData({
      showDetail: showDetail,
    })
  },
  changeNum(e) {
    const self = this
    let dataset = e.currentTarget.dataset
    let index = dataset.index;
    let amount = self.data.amount
    let requestBuyLimit = self.data.productDetails.requestBuyLimit || 1; //最低购买数量
    if (e.currentTarget.id == "sub" && amount > requestBuyLimit) {
      amount -= 1;
    } else if (e.currentTarget.id == "add" && amount < 1000) {
      amount += 1;
    }
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value)
      if (value < requestBuyLimit) {
        amount = requestBuyLimit
      } else if (value > 1000) {
        amount = 1000
      } else if (value) {
        amount = Math.floor(value)
      }
    }
    self.setData({
      amount: amount
    })
  },
  insertIntoShopCar() {
    let customerCode = Common.getCustomerCode()
    const self = this
    if (self.type == 3) {
      wx.showToast({
        title: "秒杀产品不能加入购物车",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!Common.biz.loggedIn("addcart")) return;

    let params = {
      customerCode,
      "productId": self.data.productId,
      "amount": self.data.amount,
      "immediately": 0,
      "limitAmount": self.data.productDetails.requestBuyLimit
    }
    console.log('加入购物车：', params)
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    Common.request.post(
      Api.shoppingCart.addCart, reqParams,
      (data) => {
        wx.showToast({
          title: "加入购物车成功",
          icon: 'none',
          duration: 1500
        })
        self.closePopup()
      }
    );
  },
  puchaseImmediately() {
    const self = this
    if (!Common.biz.loggedIn("startBuy")) return;
    let customerCode = Common.getCustomerCode()
    let params = {
      customerCode,
      "productId": self.data.productId,
      "amount": self.data.amount,
      "immediately": 0,
      "limitAmount": self.data.productDetails.requestBuyLimit
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    Common.request.post(
      Api.shoppingCart.addCart, reqParams,
      (data) => {
        self.closePopup()
        wx.navigateTo({
          url: "/pages/order/confirm-order/confirm-order?immediately=1&isShare=0&spikeSourceType=" + self.data.type
        })
      }
    );
  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: "4007200000"
    })
  },
  goCart() {
    wx.switchTab({
      url: "/pages/cart/cart"
    })
  },
  borrowBeans() {
    const self = this
    if (!Common.biz.loggedIn(Common.getRoute())) return; //检查登录
    let customerCode = Common.getCustomerCode()
    let params = {
      productId: this.data.productId,
      customerCode
    } 
    Common.request.get(Api.product.getShareByKey, params,
      (data) => {
        let message = data.message || {}
        // console.log(message)
        let shareObj = {}
        shareObj.title = message.mainTitle
        let shareUrl = message.shareUrl || ""
        let tempQuery = shareUrl.split("borrowBeans")[1] || ""
        let tempQueryArr = tempQuery.split("/")
        let path = "/pages/beans/borrow-beans/borrow-beans?bwUserId=" + tempQueryArr[1] +
          "&productId=" + tempQueryArr[2] + "&batchNo=" + tempQueryArr[3]
        shareObj.path = path
        self.setData({
          shareObj: shareObj
        })
      })
  },

  share() {
    //借豆 分享
    let that = this
    if (!Common.biz.loggedIn(Common.getRoute())) return;//检查登录
    let params = { productId: that.data.productId, customerCode: Common.getCustomerCode() }
    Common.request.get(Api.product.getShareByKey, params,
      (data) => {
        let shareUrl = data.message.shareUrl
        let title = data.message.mainTitle
        let desc = data.message.secondTitle
        let share = { shareUrl: shareUrl, title: title}
        // console.log('share****:', share)
        let shareParams = that.getShareParams(shareUrl)
        that.setData({
          shareParams,
          share
        }) 
      })
  },
  getShareParams(url) {
    // console.log('url****:',url)
    let paramsUrl = url.substring(url.indexOf('borrowBeans'))
    let params = paramsUrl.substring(paramsUrl.indexOf('/'))
    let pararmsArray = params.split('/')

    this.setData({
      shareShow: true
    })

    return {
      bwUserId: pararmsArray[1],
      productId: pararmsArray[2],
      batchNo: pararmsArray[3]
    }
  },
  onShareAppMessage: function () {
    console.log("aaa", this.data.share)
    let { title } = this.data.share
    let { bwUserId, productId, batchNo } = this.data.shareParams
    return {
      title,
      path: `pages/beans/borrow-beans/borrow-beans?bwUserId=${bwUserId}&productId=${productId}&batchNo=${batchNo}&title=${title}`
    }
  },
  onShow() {
    let customerCode = Common.getCustomerCode()
    if (customerCode) {
      this.setData({
        loginFlag: true
      })
    }
  },
  
})