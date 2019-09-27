// pages/turnBeanNums/turnBeanNums.js
Page({
  data: {
    shuomingValue: '',
    beanNumberValue: ''
  },
  async changeBean(){
    let { canSubmit, shuomingValue, beanNumberValue}=this.data
    if (!canSubmit){
      return ;
    }
    let customerCode = Common.getCustomerCode()

    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    let url = Api.customer.transferBean
let params={
  beanNum: beanNumberValue,
// cellPhone: "18019304383"
customerCode,
// payPassword: "111111"
remark: shuomingValue
}
let reds = await Common.ajax.post(url,params)

    console.log('changebean')
  },
  beanNumberInput(e) {
    let value = e.detail.value
    console.log('value:', value)
    let canSubmit = false
    if (value.length > 0) {
      canSubmit = true
    }
    this.setData({
      canSubmit,
      beanNumberValue: value
    })
  },
  addBeanInput(e) {
    let value = e.detail.value
  
    this.setData({
      shuomingValue: value
    })
  },
  onLoad: function (options) {
    console.log(options.phone)
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})