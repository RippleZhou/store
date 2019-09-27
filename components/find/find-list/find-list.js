// components/find/find-list/find-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      const self = this
      let index = e.currentTarget.dataset.index
      let item = self.data.list[index]
      let url = "/pages/tab3/store-details/store-details?storeid=" + item.storeId +
        "&name=" + item.storeBriefName

      wx.navigateTo({
        url: url,
      })
    },
    showBigImg(e) {
      const self = this
      let dataset = e.currentTarget.dataset
      let item = self.data.list[dataset.index]
      let urls = []
      item.imgs.forEach(function (data) {
        urls.push(data.fileUrl)
      })
      wx.previewImage({
        current: urls[dataset.key], // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
    openmap(e) {
      const self = this
      let index = e.currentTarget.dataset.index
      let item = self.data.list[index]
      // console.log(item)

      let latitude = parseFloat(item.Latitude)
      let longitude = parseFloat(item.Longitude)

      let Tx = Common.bd_decrypt(longitude, latitude);
      let name = item.storeBriefName
      let address = item.storeAddress
      wx.openLocation({
        latitude: Tx.lat,
        longitude: Tx.lng,
        name: name,
        address: address,
        scale: 21
      })
    },
  }
})
