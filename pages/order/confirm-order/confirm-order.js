const Common = require("../../../utils/common");
var Api = require("../../../utils/api");
var Util = require("../../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    detailShow: false,
    detailListHeight: "604", //一个商品的高度 ，604等于最大2个商品的高度
    address: {},
    productList: [],
    paymentCost: {},
    countbox: {}, //产品数量计数
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    fromAddressList: false, //从详情页返回的
    showIdCard: false, //海外购填写身份号码
    canChangeNum: true //从详情进入的可以修改购买数量
  },

  closeDetail() {
    this.setData({
      detailShow: false
    });
  },
  showDetails() {
    this.setData({
      detailShow: true
    });
  },
  async getOrders() {
    console.log("getorders");
    let url = Api.list.getMyOrders;
    let params = {
      customerCode: Common.getCustomerCode(),
      tabNo: 1,
      limit: 10,
      offset: 0
    };
    let MD5signStr = Common.md5sign(params);
    let reqParams = {
      sign: MD5signStr,
      ...params
    };
    return await Common.ajax.post(url, reqParams);
  },
  async continuePay(oid) {
    let url = Api.find.continuePay;
    let params = {
      customerCode: Common.getCustomerCode(),
      orderCode: oid,
      openId: app.globalData.user.wxOpenId,
      aliUserId: "default",
      payMethod: "7"
    };
    let MD5signStr = Common.md5sign(params);
    let reqParams = {
      sign: MD5signStr,
      ...params
    };

    return await Common.ajax.post(url, reqParams);
  },
  goAddress() {
    wx.navigateTo({
      url: "/pages/user/receiving-address/receiving-address"
    });
  },

  //提交订单
  async submitOrder() {
    console.log("submitOrder");

    let wxopenid = Common.getWxOpenId();
    let customerCode = Common.getCustomerCode();

    let { paymentCost, address } = this.data;

    let url = Api.order.submitOrder;

    if (!address.id) {
      wx.showModal({
        content: "请先填写收货地址",
        showCancel: false
      });
      return;
    }

    console.log("address:", this.data.address.id);
    console.log("customerCode", customerCode);

    console.log("beanAmount", paymentCost.beanAmount);
    console.log("converBeanAmount", paymentCost.converBeanAmount);
    console.log("expressBean", paymentCost.expressBean);
    console.log("expressFee", paymentCost.expressFee);
    console.log("paymentAmount", paymentCost.paymentAmount);
    console.log("totalAmount", paymentCost.totalAmount);
    console.log("paymentCost", paymentCost);

    let productItems = paymentCost.items.map(k => {
      return {
        amount: k.amount,
        price: k.price,
        productId: k.productId
      };
    });

    function getStrforParamValue(data) {
      let obj = "[";
      for (let item in data) {
        let str = "";
        obj += "{";
        for (let o in data[item]) {
          if (str == "") {
            str = o + "=" + data[item][o];
          } else {
            str += "," + o + "=" + data[item][o];
          }
        }
        obj += str + "},";
      }
      obj = obj.substring(0, obj.length - 1);
      obj += "]";
      return obj;
    }

    let productItemsStr = getStrforParamValue(productItems);
    let openid = await Common.getMiniOpenId();

    let params = {
      addressId: address.id,
      beanAmount: paymentCost.beanAmount,
      converBeanAmount: paymentCost.converBeanAmount,
      customerCode,
      expressBean: paymentCost.expressBean,
      expressFee: paymentCost.expressFee,
      paymentAmount: paymentCost.paymentAmount,
      totalAmount: paymentCost.totalAmount,
      productItems: productItemsStr,
      remark: "",
      frontUrl:"https://japitest.3721zh.com/webapp/#/payFail?fromType=1&isPayOk=true",
      isInvoice: 0,
      isShare: 0,
      openWay: "H5",
      payMethod: 7,
      source: 0,
      openId: openid
    };
    let MD5signStr = Common.miscellaneous.getSign(params);

    params.productItems = productItems;
    let reqParams = {
      sign: MD5signStr,
      ...params
    };

    try {
      let res = await Common.ajax.post(url, reqParams);
      if (res.status=="OK"){
        if (res.message.allinPay == null) {
          var isPayOk = true;
          var fromType = 1; //11：是充值记录 1：是查看订单
          app.globalData.chosenAddress = null // 重置地址
          wx.navigateTo({
            url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`
          });
          return
        }
      }
      let message = JSON.parse(res.message.allinPay.message);
      let payInfo = JSON.parse(message.payInfo);

      wx.requestPayment({
        timeStamp: payInfo.timeStamp,
        nonceStr: payInfo.nonceStr,
        package: payInfo.package,
        signType: payInfo.signType,
        paySign: payInfo.paySign,
        success: function(res) {
          var isPayOk = true;
          var fromType = 11; //11：是充值记录 1：是查看订单
          app.globalData.chosenAddress = null // 重置地址
          wx.navigateTo({
            url: `pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`
          });
        },
        fail: function(res) {
          var isPayOk = false;
          var fromType = 1; //待付款

          wx.redirectTo({
            url: `/pages/payFail/payFail?isPayOk=${isPayOk}&fromType=${fromType}`
          });
        }
      });

    } catch (err) {
      wx.showModal({
        content: err.message,
        showCancel: false
      });
    }
    return;
  },
  async beanInput(e) {
    console.log("e", e.detail.value);
    var value = e.detail.value || 0;
    let url = Api.order.computeCost;
    let params = {
      converBeanAmount: parseInt(value),
      customerCode: Common.getCustomerCode(),
      source: 0,
      useType: 1,
      isShare: 0
    };

    let MD5signStr = Common.md5sign(params);
    let reqParams = {
      sign: MD5signStr,
      ...params
    };
    let res = await Common.ajax.post(url, reqParams);

    if (value > res.message.converBeanAmount) {
      value = res.message.converBeanAmount;
    }

    var paymentCost = this.data.paymentCost;
    paymentCost.converBeanAmount = parseInt(value);
    this.setData({
      paymentCost
    });
  },
  renderPaymentCost(paymentCost) {
    this.setData({
      paymentCost
    });
  },
  renderDetail(items) {
    this.setData({
      buyerCart: items
    });
  },
  async getSettlementOrder() {
    let params = {
      customerCode: Common.getCustomerCode(),
      source: 0
    };
    let sign = Common.md5sign(params);
    let url = `${Api.order.confirmOrder}?customerCode=${
      params.customerCode
    }&source=${params.source}&sign=${sign}`;
    let res = await Common.ajax.get(url);
    console.log("res.message.buyerCart.items:", res.message.buyerCart.items);
    this.renderDetail(res.message.buyerCart.items);
    this.renderPaymentCost(res.message.paymentCost);
  },

  async getSelectUserBean() {
    let cellPhone = app.globalData.user.cellPhone;
    let url = Api.selectUserBean;
    let params = {
      cellPhone
    };
    let MD5signStr = Common.md5sign(params);
    let reqParams = {
      sign: MD5signStr,
      ...params
    };

    let res = await Common.ajax.post(url, reqParams);
    console.log("resssss", res);
  },
  onLoad: function(options) {
    console.log("onLoad")
    this.getAddress();
    if (options.selectAddress) {
      this.setData({
        fromAddressList: true
      });
    }
    if (options.immediately == 1) {
      //从详情进入的可以修改购买数量
      this.setData({
        canChangeNum: true
      });
    }
  },
  async getAddress() {
    let address;
    let customerCode = Common.getCustomerCode();
    let url = `${Api.customer.getAddressList}?customerCode=${customerCode}`;
    try {
      let addressResult = await Common.ajax.get(url);
      let defaultAddress = addressResult.rows.filter(v => v.isDefault);
      if (!defaultAddress.length) {
        address = addressResult.rows[0];
      } else {
        address = defaultAddress[0];
      }
      this.setData({
        address
      });
    } catch (err) {
      wx.showModal({
        title: "获取地址失败",
        showCancel: false
      });
    }
  },
  onShow: function() {
    this.getOrderInfo();
    const { chosenAddress } = app.globalData;
    if (chosenAddress) {
      this.setData({
        address: chosenAddress
      });
    } else {
      this.getAddress();
    }
  },
  getOrderInfo() {
    const self = this;
    let customerCode = Common.getCustomerCode();
    let params = Common.miscellaneous.signedParams({
      customerCode,
      source: 0
    });

    Common.request.get(Api.order.confirmOrder, params, data => {
      // paymentCost
      let paymentCostItems = data.message.paymentCost.items;
      let buyerCartItems = data.message.buyerCart.items;
      let detailList = buyerCartItems.map((item, index) => {
        let newitem = item;
        newitem["bean"] = paymentCostItems[index].bean;
        newitem["converBean"] = paymentCostItems[index].converBean;
        newitem["payment"] = paymentCostItems[index].payment;

        return newitem;
      });
      console.log('ddddddddd', detailList)
      let productList = data.message.buyerCart.items;
      productList.forEach(itme => {
        //海外购填写身份号码
        if (itme.sku.importFlag == 1) {
          self.setData({
            showIdCard: true
          });
        }
      });
      let countbox = {};
      if (self.data.canChangeNum) {
        countbox.minValue = productList[0].limitAmount; //最小购买量
        countbox.proNums = productList[0].amount; //购买量
      }

      console.log("paymentCost:", data.message.paymentCost);

      self.setData({
        countbox: countbox,
        productList: productList,
        paymentCost: data.message.paymentCost,
        detailList: detailList
      });
    });
  },
  changeNum(e) {
    let self = this;
    let data = e.currentTarget.dataset;
    let index = data.index;
    let countbox = self.data.countbox;
    if (e.currentTarget.id == "sub" && countbox.proNums > countbox.minValue) {
      countbox.proNums -= 1;
    } else if (e.currentTarget.id == "add" && countbox.proNums < 1000) {
      countbox.proNums += 1;
    }
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value);
      if (value < countbox.minValue) {
        countbox.proNums = countbox.minValue;
      } else if (value > 1000) {
        countbox.proNums = 1000;
      } else if (value) {
        countbox.proNums = Math.floor(value);
      }
    }
    self.setData({
      countbox: countbox
    });
    let MD5signStr = Common.md5sign({
      userId: app.globalData.userInfo.id,
      productId: countbox.proId,
      amount: countbox.proNums
    });
    Common.request.post(
      Api.product.modifyCartItemAmount,
      {
        userId: app.globalData.userInfo.id,
        productId: productList[0].sku.proId,
        amount: countbox.proNums,
        sign: MD5signStr
      },
      function(data) {
        if (data.status == "OK") {
          console.log("Ok");
          // self.computeMoney();
        } else {
          console.log("json字符串" + JSON.stringify(data));
        }
      }
    );
  }
});
