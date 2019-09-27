// pages/helpCenterDetail/helpCenterDetail.js
let questions= require('./questions.js')
// console.log(questions)

Page({
  data: {
    qTypeid:'',
    qTitle:'',
    nodes: [
      {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 60px; color: red;'
        },
        children: [{
          type: 'text',
          text: 'Hello&nbsp;World!'
        }]
      }
    ]
  },
  onLoad: function (options) {

    var { qtypeid,qid } = options
    console.log('qTypeid:', qtypeid)
    console.log('qid:', qid)

    // questions.forEach(k=>{
    //   if (k.qTypeid == 1 && k.qid == 104){
    //     this.setData({
    //       question:k
    //     })
    //   }
    // })

    questions.forEach(k => {
      if (k.qTypeid == qtypeid && k.qid == qid) {
        this.setData({
          question: k
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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