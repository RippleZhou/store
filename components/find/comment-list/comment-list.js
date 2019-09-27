// components/find/comment-list/comment-list.js
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
    errorImg:"https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",

  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage: function (e) {
      const self = this
      let index = e.currentTarget.dataset.index
      let i = e.currentTarget.dataset.i
      let item = self.data.list[index]
      let urls = []
      item.imgs.forEach(function (data) {
        urls.push(data.fileUrl)
      })
      wx.previewImage({
        current: urls[i], // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      }) 
    }
  }
})
