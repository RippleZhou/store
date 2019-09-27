const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    tabList: [
      { name: "砍价", bannerType: 3, offset: 1, pages: 10 },
      { name: "霸王餐", bannerType: 1, offset: 1, pages: 10 },
      { name: "折扣店", bannerType: 2, offset: 1, pages: 10 }
    ],
    location: { cityName: "上海市", id: 16 },
    currentTab: 0,
    shareObj: {
      title: "转换商城霸王餐，一言不合就免单，咱也体验看看！",
      path: "/pages/find/find"
    },
    popupShow: false,
    errorImgban:
      "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo2.png",
    longitude: 121.54409,
    latitude: 31.22114,
    locationCity: "上海市"
  },

  async getVirData() {
    let url = Api.find.virProductsCurrency;

    let customerCode = Common.getCustomerCode();

    let params = {
      limit: 2,
      offset: 1
    };

    let res = await Common.ajax.post(url, params);

    this.setData({
      virProductsCurrency: res.rows
    });
  },
  async clickBargain(e) {
    //砍价
    let item = e.currentTarget.dataset.item;
    let list = {};
    list["virProductId"] = item.virProductId;
    list["customerCode"] = Common.getCustomerCode();
    let MD5signStr = Common.md5sign(list);
    list["sign"] = MD5signStr;

    let url = Api.find.bargain;
    try {
      let res = await Common.ajax.post(url, list);
      console.log("res", res);
      wx.showToast({
        title: res.message
      });
      item.isBargain = 1;
      item.productPrice = this.accSub(
        item.productPrice,
        res.message.bargainAmount
      );
      item.bargainPeopleNum = item.bargainPeopleNum + 1;
      wx.showToast({
        title: "您已成功砍掉了" + parseFloat(res.message.bargainAmount) + "元！"
      });
    } catch (err) {
      wx.showToast({
        title: err.message
      });
    }
  },
  async gotodetail(e) {
    let vid = e.currentTarget.dataset.vid;

    wx.navigateTo({
      url: `/pages/specialCoupon/specialCoupon?vid=${vid}`
    });
  },
  accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },

  getData({ longitude, latitude }) {
    const self = this;
    self.getBanners();
    let tabList = self.data.tabList;
    for (let i = 0; i < tabList.length; i++) {
      if (tabList[i].bannerType == 3) {
        console.log("精度维度：", longitude, latitude);
        self.getBargainList(i, { longitude, latitude });
      } else {
        self.getFindList(i);
      }
    }
  },
  getBanners() {
    const self = this;
    let tabList = self.data.tabList;
    for (let i = 0; i < tabList.length; i++) {
      let url =
        Api.find.queryBannerList +
        "?bannerType=" +
        tabList[i].bannerType +
        "&refId=" +
        self.data.location.id;

      Common.request.post(url, {}, data => {
        tabList[i].banners = data.message;
        self.setData({
          tabList: tabList
        });
      });
    }
  },

  getFindList(index) {
    const self = this;
    let tabList = self.data.tabList;
    if (tabList[index].total <= tabList[index].offset) return; //翻到最后一页 total <= offset

    let url =
      Api.find.queryPromotion +
      "?bannerType=" +
      tabList[index].bannerType +
      "&areaId=" +
      self.data.location.id +
      "&offset=" +
      tabList[index].offset +
      "&limit=" +
      tabList[index].pages;

    Common.request.post(url, {}, data => {
      let rows = data.message.rows;
      if (rows && rows.length > 0) {
        if (tabList[index].items && tabList[index].items.length > 0) {
          tabList[index].items = tabList[index].items.concat(rows);
        } else {
          tabList[index].items = rows;
        }
        tabList[index].total = data.message.total;
        tabList[index].offset += tabList[index].pages;
        if (tabList[index].total <= tabList[index].offset) {
          tabList[index].lastFlag = true;
        }
        self.setData({
          tabList: tabList
        });
      }
    });
  },
  getBargainList(index, { longitude, latitude }) {
    const self = this;
    let tabList = self.data.tabList;
    if (tabList[index].total <= tabList[index].offset) return; //翻到最后一页 total <= offset

    let params = {
      // customerCode":"用户编码","areaId":17,"offset":1,"limit":10,"longitude":121.499108,"latitude":31.169698,"mapType":"gaode"
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      mapType: "gaode",
      offset: tabList[index].offset, //分页 1开始
      limit: tabList[index].pages, //分页条数
      areaId: self.data.location.id //城市ID
    };
    if (app.globalData.userInfo) {
      params.userId = app.globalData.userInfo.id;
    }
    Common.request.post(Api.find.virProducts, params, data => {
      let rows = data.rows;
      if (rows && rows.length > 0) {
        if (tabList[index].items && tabList[index].items.length > 0) {
          tabList[index].items = tabList[index].items.concat(rows);
        } else {
          tabList[index].items = rows;
        }
        tabList[index].total = data.total;
        tabList[index].offset += tabList[index].pages;
        if (tabList[index].total <= tabList[index].offset) {
          tabList[index].lastFlag = true;
        }
        self.setData({
          tabList: tabList
        });
      }
    });
  },
  scrolltolower(e) {
    console.log("-------scrolltolower");
    let self = this;
    let dataset = e.currentTarget.dataset;
    if (dataset.type == 3) {
      console.log("dataset.index:", dataset.index);
      self.getBargainList(dataset.index);
    } else {
      console.log("dataset.index22:", dataset.index);
      self.getFindList(dataset.index);
    }
  },
  openShare(e) {
    const self = this;
    let shareObj = self.data.shareObj;
    let detail = e.detail;
    let paramStr = e.detail.shareUrl.split("bargainSharing")[1];
    if (!paramStr) return;
    let tempArr = paramStr.split("/");

    shareObj.title = detail.title;
    shareObj.path =
      "/pages/tab3/bargain-sharing/bargain-sharing?virProductId=" +
      tempArr[1] +
      "&vendorId=" +
      tempArr[2] +
      "&userId=" +
      tempArr[3];
    shareObj.imageUrl = detail.imageUrl;
    self.setData({
      popupShow: true,
      shareObj: shareObj
    });
  },
  changeTab(e) {
    const self = this;
    let dataset = e.currentTarget.dataset;
    self.setData({
      currentTab: dataset.index
    });
    self.setShare();
  },
  swiperChangeTab(event) {
    const self = this;
    self.setData({
      currentTab: event.detail.current
    });
    self.setShare();
  },
  setShare() {
    const self = this;
    let shareObj = self.data.shareObj;
    if (self.data.currentTab == 2) {
      shareObj.title = "在转换商城发现这家商户消费有豆送，豆换刚需商品！";
    } else {
      shareObj.title = "转换商城霸王餐，一言不合就免单，咱也体验看看！";
    }
    shareObj.path = "/pages/find/find?activeIndex=" + self.data.currentTab;
    self.setData({
      shareObj: shareObj
    });
  },
  closePopup() {
    const self = this;
    self.setData({
      popupShow: false
    });
  },
  getLocation2() {
    const self = this;
    Common.getLocation(function(location) {
      console.log("location", location);
      self.setData({
        location: location
      });
      self.getData();
    });
  },
  getAuth() {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.userLocation"]) {
            console.log("userlocation");

            // 授权弹窗
            wx.authorize({
              scope: "scope.userLocation",
              success() {
                wx.getLocation({
                  type: "wgs84",
                  success(res) {
                    resolve(res);
                  }
                });
              },
              fail() {
                //授权失败
                console.log("fail...");
                console.log(" that.data...", that.data);
                let { locationCity, longitude, latitude } = that.data;

                if (!locationCity) {
                  locationCity = "上海市";
                }

                let coordinate = { longitude, latitude };

                that.getData(coordinate);
                that.setCoordinate({ locationCity, ...coordinate });
                that.setData({ locationCity });
              }
            });
          }
        }
      });
    });
  },
  async getLocation(res) {
    let url = Api.getAddressByLngAndLat;
    let params = {
      longitude: res.longitude,
      latitude: res.latitude
    };
    return await Common.ajax.get(url, params);
  },
  getCoordinate(callback) {
    wx.getStorage({
      key: "longitude",
      success: function(res) {
        let longitude = res.data;

        wx.getStorage({
          key: "latitude",
          success: function(res) {
            console.log(res.data);
            let latitude = res.data;

            let coordinate = {
              longitude,
              latitude
            };
            callback && callback(coordinate);
          }
        });
      }
    });
  },
  setCoordinate({ locationCity, longitude, latitude }) {
    wx.setStorage({
      key: "locationCity",
      data: locationCity
    });

    wx.setStorage({
      key: "longitude",
      data: longitude
    });

    wx.setStorage({
      key: "latitude",
      data: latitude
    });
  },
  async getCityLocation() {
    let that = this;
    var value = wx.getStorageSync("locationCity");
    if (value) {
      this.setData({
        locationCity: value
      });
      this.getCoordinate(coordinate => {
        that.getData({
          longitude: coordinate.longitude,
          latitude: coordinate.latitude
        });
      });
    } else {
      console.log("getauth");
      let res = await this.getAuth();
      console.log("res", res);
      let res2 = await this.getLocation(res);
      console.log("res2", res2);
      let locationCity = res2.message.province;
      let coordinate = { longitude: res.longitude, latitude: res.latitude };

      this.getData(coordinate);
      this.setCoordinate({ locationCity, ...coordinate });
      this.setData({
        locationCity
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(this.data.shareObj);
    return this.data.shareObj;
  },
  onLoad: function(options) {
    const self = this;
    if (options.activeIndex) {
      self.setData({
        currentTab: options.activeIndex
      });
      self.setShare();
    }
  },
  async onShow() {
    let locationCity = await Common.getStorage("locationCity");
    let location = await Common.getStorage("location");
    this.setData({
      locationCity,
      location
    });
    this.getVirData();
    this.getCityLocation();
  }
});
