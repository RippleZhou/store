//获取应用实例
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let { regeneratorRuntime } = global
 
Page({
  data: {
    exboxList: [],//
    unexboxList:[],//失效商品
    setTitName: "购物车",
    headTxt: "编辑",
    headClas: "",
    isEidt: false,
    isNums: 0, //无效产品数量
    allMoney: 0,
    allNum: 0,
    checkAll: false,
    customerCode: 0,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    validproductIds: '',
  },
  onLoad: function () {
    
  },
  onShow() {
    let self = this
    wx.getStorage({
      key: 'activityCartItems',
      success: function (res) {
        // console.log('购物车:', res.data)
      },
    })
    if (!Common.biz.loggedIn(Common.getRoute())) return;
    let customerCode = Common.getCustomerCode()

    self.setData({
      customerCode
    })

    self.getAllpro();
  },
  editCart(data) {
    let self = this

    if (self.data.isEidt) {
      self.setData({
        isEidt: false,
        headTxt: "编辑",
      })
    } else {
      self.setData({
        isEidt: true,
        headTxt: "完成",
      })
    }
  },
  goBack() {
    let self = this
    self.setData({
      isEidt: false,
      headTxt: "编辑",
    })
  },
  async getCarts() {
    let customerCode = Common.getCustomerCode()
    return await Common.ajax.get(Api.product.queryCart, { customerCode })
  },
  changeCarts(data){
    console.log('data::',data)
    let exboxList = [];//有效产品列表
    let unexboxList=[];//无效产品列表
    let proList = data.message.sellingItems || [];
    var checkAllFlag = true

    for (let i = 0; i < proList.length; i++) {
      let pro = {}; //定义产品对象，获取数据，追加到数组里
      if (proList[i].isSelected == 1) {
        //判断是否选中
        pro.checkpro = true;
      } else {
        checkAllFlag = false
        pro.checkpro = false;
      }
      pro.imgUrl = proList[i].sku.imageUrl; //图片路径
      pro.proTit = proList[i].sku.productName; //"产品名称";
      pro.proId = proList[i].sku.productId; //产品编号
      pro.sourceType = proList[i].sku.sourceType
      console.log(
        "第" +
        (i + 1) +
        "有效个产品：" +
        pro.proId +
        "选中状态：" +
        pro.checkpro
      );
      //pro.proSpec = "1.5kg";//"1.5kg"后台说不显示
      pro.proTips = proList[i].limitAmount + "件起购"; //"2件起购";
      pro.limitAmount = proList[i].limitAmount;
      pro.proPrice = proList[i].sku.price;
      pro.isValid = true; //这里都为有效产品
      pro.proNums = proList[i].amount;
      exboxList.push(pro);
    }
    console.log('exboxList', exboxList)
    if (exboxList.length > 0) {
      this.setData({
        checkAll: checkAllFlag
      })
    }

    //无效产品列表
    let invalidList = data.message.haltSellItems || [];
    // let invalidList = data.message.sellingItems || [];
    for (let i = 0; i < invalidList.length; i++) {
      let pro = {}; //定义产品对象，获取数据，追加到数组里
      pro.imgUrl = invalidList[i].sku.imageUrl; //图片路径
      pro.proTit = invalidList[i].sku.productName; //"产品名称";
      pro.proId = invalidList[i].sku.productId; //产品编号
      pro.sourceType = invalidList[i].sku.sourceType
      pro.proTips = invalidList[i].limitAmount + "件起购888"; //"2件起购";
      pro.limitAmount = invalidList[i].limitAmount;
      pro.proPrice = invalidList[i].sku.price;
      pro.isValid = false; //这里都为无效产品
      pro.proNums = invalidList[i].amount;
      this.ValidproductIds += invalidList[i].sku.productId + ','; //失效产品id
      unexboxList.push(pro);
    }
    console.log('activityCartItems:', exboxList)
    console.log('unexboxList:', unexboxList)

    if (unexboxList.length>0){
      this.setData({
        isNums: unexboxList.length
      })
    }
    
    this.setData({
      exboxList,
      unexboxList
    })

    return exboxList;
  },
  // 获取服务器的购物车
  async getAllpro() {
    console.log('getallpro')
    var self = this;
    let data = await this.getCarts()
    let carts = this.changeCarts(data)
    this.computeMoney(carts)
  },
  computeMoney(list) {
    //计算总数量价格
    let price = 0;
    let numb = 0;

    if(list.length==0){
      console.log('0000')
    }else{
      console.log('11111')
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].checkpro && list[i].isValid) {
        price += list[i].proNums * list[i].proPrice;
        numb += list[i].proNums;
      }
    }
    this.setData({
      allMoney: price,
      allNum: numb
    })
  },
  async changeNum(e) {
    let self = this
    let data = e.currentTarget.dataset
    let index = data.index;
    let exboxList = self.data.exboxList;
    if (e.currentTarget.id == "sub" &&
      exboxList[index].proNums > exboxList[index].limitAmount) {
      exboxList[index].proNums -= 1;
    } else if (e.currentTarget.id == "add" && exboxList[index].proNums < 1000) {
      exboxList[index].proNums += 1;
    }
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value)
      if (value < exboxList[index].limitAmount) {
        exboxList[index].proNums = exboxList[index].limitAmount
      } else if (value > 1000) {
        exboxList[index].proNums = 1000
      } else if (value) {
        exboxList[index].proNums = Math.floor(value)
      }
    }

    self.setData({
      exboxList: exboxList
    })

    let para = {
      customerCode: Common.getCustomerCode(),
      productId: exboxList[index].proId,
      amount: exboxList[index].proNums
    }
    let MD5signStr = Common.md5sign(para);
    let params = { ...para, sign: MD5signStr }
    let res = await Common.ajax.post(Api.product.modifyCartItemAmount, params)
    this.getAllpro()
    // let carts = await this.getCarts()
    // let changedCarts = this.changeCarts(carts)
    // this.computeMoney(changedCarts)

    // Common.request.post(Api.product.modifyCartItemAmount, {
    //   customerCode: app.globalData.user.customerCode,
    //   productId: exboxList[index].proId,
    //   amount: exboxList[index].proNums,
    //   sign: MD5signStr
    // }, function (data) {
    //   if (data.status == "OK") {
    //     console.log("Ok");
    //     self.computeMoney();
    //   } else {
    //     console.log("json字符串" + JSON.stringify(data));
    //   }
    // })
  },
  deletePro(e) {
    //产品删除
    let self = this;
    let dataset = e.currentTarget.dataset
    let params = {};
    params.productIds = '';
    params.customerCode = Common.getCustomerCode()
    let exboxList = self.data.exboxList;
    let list = JSON.parse(JSON.stringify(exboxList))//TODO

    if (dataset.type == "all" && exboxList.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].checkpro == true) {
          params.productIds += "," + list[i].proId;
          exboxList.splice(i, 1);
        }
      }
      if (params.productIds.length > 0) {
        params.productIds = params.productIds.substring(1, params.productIds.length)
      }
    } else if (dataset.proid) {
      params.productIds = "" + dataset.proid;
    } else {
      return
    }
    if (!params.productIds) return
    Common.request.post(Api.product.removeCartItems, Common.getparam(params),
      function (data) {
        if (data.status == "OK") {
          let exboxList = self.data.exboxList;
          exboxList.splice(dataset.index, 1);
          self.setData({
            exboxList: exboxList
          })
          self.computeMoney(exboxList);
        } else {
          console.log(data.message);
        }
      })
  },
  async onButtonClick(){
    console.log('onButtonClick')

    //定义产品对象
    let _this = this;
    let dataset = e.currentTarget.dataset
    let params = {};
    params.customerCode = Common.getCustomerCode()
    params.productIds = "";

    let i = this.data.unexboxList.length;

    //删除全部失效产品
    while (i--) {
      if (this.data.unexboxList[i].isValid == false) {
        params.productIds += this.data.unexboxList[i].proId + ",";
        this.data.unexboxList.splice(i, 1);
      }
    }
    if (params.productIds.length > 0) {
      params.productIds = params.productIds.substring(0, params.productIds.lastIndexOf(','));

      let url = Api.product.removeCartItems
      let MD5signStr = Common.md5sign(params);
      let reqParams = { sign: MD5signStr, ...params }

      let res = await Common.ajax.post(url, reqParams)
      let unexboxList = _this.data.unexboxList;
      unexboxList.splice(dataset.index, 1);
      self.setData({
        unexboxList: unexboxList
      })
      self.computeMoney(unexboxList);
    }
  },
  delFailureClick: function (e) {
    console.log('delFailureClick')
    return;
    let self = this
    //定义产品对象
    let params = {};
    params.customerCode = Common.getCustomerCode();
    params.productIds = "";
    //删除全部失效产品
    let unexboxList = self.data.unexboxList
    for (let i = 0; i < unexboxList.length; i++) {
      if (unexboxList[i].isValid == false) {
        params.productIds += unexboxList[i].proId + ",";
        unexboxList.splice(i, 1);
      }
    }
    if (params.productIds.length > 0) {
      params.productIds = params.productIds.substring(0, params.productIds.lastIndexOf(','))
      Common.request.post(Api.product.removeCartItems, Common.getparam(params),
        function (data) {
          if (data.status == "OK") {
            let exboxList = self.data.exboxList;
            exboxList.splice(dataset.index, 1);
            self.setData({
              exboxList: exboxList
            })
            self.computeMoney(exboxList);


            self.setData({
              isNums: 0,
              exboxList: exboxList
            })
            console.log('ccccccccc')
            self.computeMoney();
            console.log("删除多个失效产品OK");
          } else {
            console.log(res.data.message);
          }
        }
      )
    }
  },
  // 选中切换
  checkSel: function (e) {
    let self = this;
    let dataset = e.currentTarget.dataset
    var index = dataset.index
    let exboxList = self.data.exboxList;


    exboxList[index].checkpro = !exboxList[index].checkpro
    let checkAllFlag = true;
    exboxList.forEach(function (fruit) {
      if (fruit.checkpro == false) {
        checkAllFlag = false;
      }
    }, this);

    let params = {};
    params.customerCode = Common.getCustomerCode();
    params.productIds = "" + exboxList[index].proId;
    if (exboxList[index].checkpro) {
      params.stype = 1;
    } else {
      params.stype = 0;
    }

    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.product.modifyCartItemSelected, params,
      function (data) {
        if (data.status == "OK") {
          console.log("更新产品是否选中OK");

          console.log('切换时候：exboxList:', self.data.exboxList)

          self.setData({
            checkAll: checkAllFlag,
            exboxList: exboxList
          })

          self.computeMoney(self.data.exboxList);
        } else {
          console.log(data.message);
        }
      })
  },
  checkSelAll() {
    var self = this
    let params = {};
    params.customerCode = Common.getCustomerCode()
    params.productIds = "";
    //全选
    let exboxList = self.data.exboxList;
    self.setData({
      checkAll: !self.data.checkAll
    })
    let isTur = false;
    //debugger
    if (self.data.checkAll == true) {
      isTur = true;
      params.stype = 1;
    } else {
      isTur = false;
      params.stype = 0;
    }
    exboxList.forEach(function (fruit) {
      fruit.checkpro = isTur;
      if (fruit.isValid == true) {
        params.productIds += "," + fruit.proId;
      }
      //this.change();
    }, this);
    if (params.productIds.length > 0) {
      params.productIds = params.productIds.substring(1, params.productIds.length);
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.product.modifyCartItemSelected, params,
        function (data) {
          if (data.status == "OK") {
            console.log("更新全部产品是否选中OK");
            self.setData({
              exboxList: exboxList
            })
            self.computeMoney(exboxList);
          } else {
            console.log(data.message);
          }
        })
    }
  },
  //去结算
  goConfirmOrder() {
    var self = this;
    if (self.data.exboxList.length <= 0) {
      wx.showToast({
        title: '请选择要兑换的商品',
        icon: 'none'
      })
      return
    }
    if (self.data.allNum == 0) {
      wx.showToast({
        title: '请选择要兑换的商品',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/order/confirm-order/confirm-order',
    })
  }
})