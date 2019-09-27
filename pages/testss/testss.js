// Page({
//   data: {
//     scrollLeft: 0,
//     scrolldata:[
//       {     
      
//         imgurl:'http://test.img.3721zh.com/UploadFiles/Product/102142/AppPic/1Master.jpg',
//         title:'飞科 飞科电吹风FH6228',
//         money:'111',
//       }, 
//       {
//         imgurl: 'http://test.img.3721zh.com/UploadFiles/Product/102142/AppPic/1Master.jpg',
//         title: '飞科 飞科电吹风FH6228',
//         money: '222',
//       },
//       {
//         imgurl: 'http://test.img.3721zh.com/UploadFiles/Product/102142/AppPic/1Master.jpg',
//         title: '飞科 飞科电吹风FH6228',
//         money: '333',
//       },
//       {
//         imgurl: 'http://test.img.3721zh.com/UploadFiles/Product/102142/AppPic/1Master.jpg',
//         title: '飞科 飞科电吹风FH6228',
//         money: '444',
//       }
//     ],
//     //滚动的数组
//     scrolls: [{
//       name: '黄色',
//       tag: 'yellow',
//     },
//     {
//       name: '绿色',
//       tag: 'green',
//     },
//     {
//       name: '红色',
//       tag: 'red',
//     },
//     {
//       name: '黄色',
//       tag: 'yellow',
//     },
//     {
//       name: '绿色',
//       tag: 'green',
//     },
//     {
//       name: '红色',
//       tag: 'red',
//     }

//     ],

//   },
//   onLoad: function () {

//   },

//   upper: function (e) {
//     console.log('滚动到顶部')
//   },
//   lower: function (e) {
//     console.log('滚动到底部')
//   },
//   scroll: function (e) {
//     console.log(e)
//   },
// })

var onlyFirstImage=0
Page({
  data: {
    imgheights: [],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  imageLoad: function(e) {
   
    if (onlyFirstImage>0){
return ;
    }
    onlyFirstImage++

    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;

    var viewHeight = wx.getSystemInfoSync().windowWidth / ratio;

    this.setData({
      viewHeight: viewHeight
    })
  },
  bindchange: function(e) {
    console.log('eeee:', e.detail.current)
    this.setData({
      current: e.detail.current
    })
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  }
})