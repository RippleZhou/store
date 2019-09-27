// pages/citys/citys.js

const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    searchCityList: [],
    sourceCityList: [],
    list: [],
    showSearch: false,
    searchEmpty: false,
    locationCity: null,
    currentCity: null
  },
  chooseCity(e) {
    let item = e.currentTarget.dataset.item;
    if (!item) {
      item = this.data.sourceCityList.filter(
        item => item.cityName === this.data.locationCity
      )[0];
    }
    Common.setStorage("locationCity", item.cityName);
    Common.setStorage("location", item);
    wx.switchTab({
      url: "/pages/find/find"
    });
  },
  searchInput(e) {
    let value = e.detail.value;
    if (value && value.length) {
      this.setData({
        showSearch: true
      });
      // 筛选
      const searchCityList = this.data.sourceCityList.filter(
        ({ cityName, Pinyin }) =>
          cityName.includes(value) || Pinyin.includes(value)
      );
      this.setData({
        searchCityList
      });
    } else {
      this.setData({
        showSearch: false
      });
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  async getCitys() {
    let url = `${Api.citys}?customerCode=0`;

    // 获取城市列表
    let res = await Common.ajax.post(url, {});
    let cityList = res.message.cityList;
    let citys = [
      { tag: "A", city: [] },
      { tag: "B", city: [] },
      { tag: "C", city: [] },
      { tag: "D", city: [] },
      { tag: "E", city: [] },
      { tag: "F", city: [] },
      { tag: "G", city: [] },
      { tag: "H", city: [] },
      { tag: "I", city: [] },
      { tag: "J", city: [] },
      { tag: "K", city: [] },
      { tag: "L", city: [] },
      { tag: "M", city: [] },
      { tag: "N", city: [] },
      { tag: "O", city: [] },
      { tag: "P", city: [] },
      { tag: "Q", city: [] },
      { tag: "R", city: [] },
      { tag: "S", city: [] },
      { tag: "T", city: [] },
      { tag: "U", city: [] },
      { tag: "V", city: [] },
      { tag: "W", city: [] },
      { tag: "X", city: [] },
      { tag: "Y", city: [] },
      { tag: "Z", city: [] }
    ];
    citys.forEach(item => {
      cityList.forEach(c => {
        if (c.Pinyin.charAt(0) == item.tag.toLocaleLowerCase()) {
          item.city.push(c);
        }
      });
    });
    this.setData({
      sourceCityList: res.message.cityList, // 城市列表
      list: citys // 城市的indexList
    });
  },
  getLocationCity() {
    const _this = this;
    // 获取定位城市
    return new Promise(function(resolve) {
      Common.getLocation(data => resolve(data));
    }).then(data => {
      if (data) {
        _this.setData({
          locationCity: data.cityName
        });
      }
    });
  },
  onLoad() {
    const _this = this;
    // 获取定位城市
    _this.getLocationCity();

    // 获取选择的城市
    wx.getStorage({
      key: "locationCity",
      success({ data }) {
        _this.setData({
          currentCity: data
        });
      }
    });
    // 获取可选城市信息
    this.getCitys();
  }
});
