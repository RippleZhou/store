// components/header.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    setTitName: {
      type: String,
      value: '转换商城',
    },
    headLeft: {
      type: Boolean,
      value: false,
    },
    headRight: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    edit: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('headevent', myEventDetail, myEventOption)
    },
    cancel: function() {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('headevent')
    },
  }
})
