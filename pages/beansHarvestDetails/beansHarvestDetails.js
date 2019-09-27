// pages/beansHarvestDetails/beansHarvestDetails.js
const Config = require("../../config")
const Common = require('../../utils/common')
const Util = require('../../utils/util')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    stateName:'',
    beanNum: 0,
    isSubmit:false,
    stateSubmitText: '确认收豆',
    createDate: null,
    selId:'',
    beanList:[]
  },
   async getList() {
    let url = Api.customer.selectWithBeansList
    let customerCode = Common.getCustomerCode()
    let params = {
      customerCode
    }
    let _this=this
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    let res = await Common.ajax.post(url, reqParams)
    let beanList = res.message.withBeanList
     this.setData({ beanList})
    
     if (_this.data.beanList && _this.data.beanList.length > 0) {
       _this.setData({
        stateName:'待确认收豆',
        stateSubmitText:'确认收豆',
         createDate: _this.data.beanList[0].createDate,
         beanNum: _this.data.beanList[0].beanNum,
         selId: _this.data.beanList[0].id,
        isSubmit: true,
      })
    }
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.getList()
  },
  enterBean: function () {
    let _this =this
    if (_this.data.isSubmit==true){
      let beanNum = _this.data.beanList[0].beanNum
      let selId = _this.data.beanList[0].id
      let url = Api.customer.getTransferBean
      let MD5signStr = Common.md5sign({ transferId: _this.data.selId})
      let reqParams = { sign: MD5signStr, transferId: _this.data.selId.toString() }
      Common.request.post(url, reqParams, function (data) {
        if (data.status == 'OK') {
          _this.setData({
            beanNum,
            selId
          })
          let beanList = _this.data.beanList
          beanList.splice(0, 1)
          let isT =false
          if (beanList != null && beanList.length <= 0) {
            isT =false
          } else {
            isT = true
          }
          _this.setData({
            stateName: '已收豆',
            stateSubmitText: '继续领豆',
            isSubmit:isT,
            beanList
          })
        }else{
          _this.setData({
            stateName: '领豆失败',
            stateSubmitText: '继续领豆'
          })
        }
      }, error => {
        console.log('error')
      })
    }

  },
})