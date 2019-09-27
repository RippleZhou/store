// pages/user/update-address/update-address.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    arryList: {
      contactName: '',
      contactCellPhone: '',
      addressDetail: ''
    },
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    isDefault: 0,
    checkeds: false,
    storeId: '',
    provinces: [],
    citys: [],
    countys: [],
    cityValue: [0, 0, 0],
    cityData: [],
    provinceName: '',
    cityName: '',
    countyName: '',
    cityText: '请选择省－市－区',
    isCity: true,
    isDate: true
  },
  onLoad: function (options) {
    console.log('options::',options)

    let _this = this
    Common.cityData(function (data) {
      _this.setData({
        cityData: data
      })
      _this.getAddressData()
    })
    if (options.id != "" && options.id != undefined && options.id != null) {//添加/修改
      _this.setData({
        state: 1,
        storeId: options.id,
        arryList: {
          isDefault:options.isDefault,
          contactName: options.contactName,
          contactCellPhone: options.contactCellPhone,
          addressDetail: options.addressDetail
        },
        cityText: options.area
      })
      if (options.isDefault == 1) {
        _this.setData({
          checkeds: true
        })
      } else {
        _this.setData({
          checkeds: false
        })
      }
    }
  },
  adListDefault(e) {
    var _this = this
    var arryList = _this.data.arryList
    var id = e.currentTarget.id
    arryList[id] = e.detail.value
    _this.setData({
      arryList: arryList
    })
  },
  onShow: function () {
    let _this = this
    if (_this.data.state == 0) {
      wx.setNavigationBarTitle({
        title: '新建收货地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '修改收货地址'
      })
    }

  },
  updateAddress() {//修改按钮
    let _this = this
    _this.isNull(_this)
  },
  getSave(_this) {//添加地址
    var user = app.globalData.userInfo
    var parm = {
      customerCode: Common.getCustomerCode(),
      contactName: _this.data.arryList.contactName,
      contactCellPhone: _this.data.arryList.contactCellPhone,
      provinceCode: _this.data.provinceCode.toString(),
      cityCode: _this.data.cityCode.toString(),
      countyCode: _this.data.countyCode.toString(),
      addressDetail: _this.data.arryList.addressDetail,
      isDefault: _this.data.isDefault
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(Api.customer.addAddress, parm, function (data) {
      if (data.status == 'OK') {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  getUpdate(_this) {//修改地址
    var user = app.globalData.userInfo
    var parm = {
      customerCode: Common.getCustomerCode(),
      contactName: _this.data.arryList.contactName,
      contactCellPhone: _this.data.arryList.contactCellPhone,
      provinceCode: _this.data.provinceCode.toString(),
      cityCode: _this.data.cityCode.toString(),
      countyCode: _this.data.countyCode.toString(),
      addressDetail: _this.data.arryList.addressDetail,
      isDefault: _this.data.arryList.isDefault,
      id: _this.data.storeId
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(Api.customer.editAddress, parm, function (data) {
      if (data.status == 'OK') {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  delAddress() {//删除地址
    let _this = this
    var user = app.globalData.userInfo
    wx.showModal({
      content: '确定删除地址吗?',
      confirmColor: '#e61817',
      success(res) {
        if (res.confirm) {
          var parm = {
            customerCode: Common.getCustomerCode(), id: _this.data.storeId
          }
          var MD5signStr = Common.md5sign(parm);
          parm.sign = MD5signStr
          Common.request.post(Api.customer.deleteAddress, parm, function (data) {
            if (data.status == 'OK') {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  isCheck(e) {//是否为默认
    if (e.detail.value == '') {
      this.setData({
        isDefault: 0,
        checkeds: false
      })
    } else {
      this.setData({
        isDefault: 1,
        checkeds: true
      })
    }
  },
  isNull(_this) {//信息是否为空
    if (!_this.data.arryList.contactName) {
      wx.showToast({
        title: '请输入收货人名字',
        icon: 'none'
      })
      return
    } else if (!_this.data.arryList.contactCellPhone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    } else if (!Common.VerifyPhone(_this.data.arryList.contactCellPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    } else if (!_this.data.cityText) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return
    } else if (!_this.data.arryList.addressDetail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }
    if (_this.data.state == 0) {//添加地址
      _this.getSave(_this)
    } else {//修改地址
      _this.getUpdate(_this)
    }
  },
  getAddressData() {//获取城市默认列表
    let _this = this
    let provinces = [], citys = [], countys = []
    for (let i = 0; i < _this.data.cityData.length; i++) {
      provinces.push(_this.data.cityData[i].text);
    }
    for (let i = 0; i < _this.data.cityData[0].children.length; i++) {
      citys.push(_this.data.cityData[0].children[i].text)
    }
    for (let i = 0; i < _this.data.cityData[0].children[0].children.length; i++) {
      countys.push(_this.data.cityData[0].children[0].children[i].text)
    }
    _this.setData({
      provinces: provinces,
      citys: citys,
      countys: countys
    })
  },
  //城市选择器
  cityChange: function (e) {
    //console.log(e);
    let _this = this
    var val = e.detail.value
    var t = this.data.cityValue;
    if (val[0] != t[0]) {
      var citys = [], countys = [];
      if (_this.data.cityData[val[0]].children == null) {
        return
      }
      for (let i = 0; i < _this.data.cityData[val[0]].children.length; i++) {
        citys.push(_this.data.cityData[val[0]].children[i].text)
      }
      if (_this.data.cityData[val[0]].children[0] == null) { return }
      for (let i = 0; i < _this.data.cityData[val[0]].children[0].children.length; i++) {
        countys.push(_this.data.cityData[val[0]].children[0].children[i].text)
      }
      this.setData({
        citys: citys,
        countys: countys,
        cityValue: [val[0], 0, 0],
        provinceName: _this.data.cityData[val[0]].text,
        cityName: _this.data.cityData[val[0]].children[0].text,
        countyName: _this.data.cityData[val[0]].children[0].children[0].text,
        provinceCode: _this.data.cityData[val[0]].value,
        cityCode: _this.data.cityData[val[0]].children[0].value,
        countyCode: _this.data.cityData[val[0]].children[0].children[0].value
      })
      return;
    }
    if (val[1] != t[1]) {
      countys = [];
      if (_this.data.cityData[val[0]].children[val[1]] == null) { return }
      for (let i = 0; i < _this.data.cityData[val[0]].children[val[1]].children.length; i++) {
        countys.push(_this.data.cityData[val[0]].children[val[1]].children[i].text)
      }
      this.setData({
        countys: countys,
        cityValue: [val[0], val[1], 0],
        provinceName: _this.data.cityData[val[0]].text,
        cityName: _this.data.cityData[val[0]].children[val[1]].text,
        countyName: _this.data.cityData[val[0]].children[val[1]].children[0].text,
        provinceCode: _this.data.cityData[val[0]].value,
        cityCode: _this.data.cityData[val[0]].children[val[1]].value,
        countyCode: _this.data.cityData[val[0]].children[val[1]].children[0].value
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        cityValue: val,
        provinceName: _this.data.cityData[val[0]].text,
        cityName: _this.data.cityData[val[0]].children[val[1]].text,
        countyName: _this.data.cityData[val[0]].children[val[1]].children[val[2]].text,
        provinceCode: _this.data.cityData[val[0]].value,
        cityCode: _this.data.cityData[val[0]].children[val[1]].value,
        countyCode: _this.data.cityData[val[0]].children[val[1]].children[val[2]].value
      })
      return;
    }
  },
  showCitys() {//展示picker弹层
    this.setData({
      isCity: false,
      isDate: false
    })
  },
  ideChoice(e) {//确认
    var _this = this;
    var $act = e.currentTarget.dataset.act;
    var $mold = e.currentTarget.dataset.mold;
    //城市
    if ($act == 'confirm' && $mold == 'city') {
      _this.setData({
        cityText: _this.data.provinceName + ' ' + _this.data.cityName + ' ' + _this.data.countyName,
      })
    }
    _this.setData({
      isCity: true,
      isDate: true
    })
  },

})