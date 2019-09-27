const Common = require("../../../utils/common");
const Util = require("../../../utils/util");
var Api = require("../../../utils/api");
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    storeid: {
      type: String,
      value: ""
    },
    storeName: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    popupShow: false, //TODO
    isOpenCamera: false,
    comIsShow: false,
    commentContent: "",
    imglist: [],
    vedioUrl: null,
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    comsCancel() {
      const self = this;
      wx.showModal({
        title: "",
        content: "放弃编辑？",
        success(res) {
          if (res.confirm) {
            self.setData({
              popupShow: false,
              isOpenCamera: false,
              vedioUrl: null,
              imglist: [],
              commentContent: ""
            });
          }
        }
      });
    },
    comsConfirm() {
      console.log(111);
      const self = this;
      if (
        self.data.commentContent.length == 0 ||
        self.data.commentContent.length > 80
      ) {
        wx.showToast({
          title: "评论内容不能为空或者大于80个字",
          icon: "none",
          duration: 1500
        });
        return;
      }
      wx.uploadFile({
        header: {
          Cookie: app.globalData.token //用户信息
        },
        url: Api.find.addCommentEx, // 仅为示例，非真实的接口地址
        filePath: self.data.vedioUrl,
        name: "fileList",
        formData: {
          storeId: self.data.storeid,
          createUserId: app.globalData.userInfo.id,
          commentContent: self.data.commentContent,
          files: [{ sortNo: 1, fileType: 2 }]
        },
        success(res) {
          wx.showToast({
            title: "提交成功！内容正在审核中...",
            icon: "none",
            duration: 1500
          });
          return;
        }
      });
    },
    openvideo() {
      const self = this;
      wx.chooseVideo({
        sourceType: ["camera"],
        maxDuration: 15,
        camera: "back",
        success(res) {
          console.log(res);
          self.setData({
            popupShow: true,
            isOpenCamera: false,
            vedioUrl: res.tempFilePath,
            imglist: []
          });
        }
      });
    },
    openCamera() {
      const self = this;
      wx.chooseImage({
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          console.log("chooseiMAGE:", res);
          let imglist = self.data.imglist;
          imglist = imglist.concat(res.tempFilePaths);
          self.setData({
            popupShow: true,
            isOpenCamera: true,
            imglist: imglist,
            vedioUrl: null
          });
        }
      });
    },
    submit() {
      //发表
      const self = this;
      if (!Common.biz.loggedIn("currentPage")) return;

      let message = null;
      if (self.data.commentContent.length < 12) {
        message = "评论内容不能小于12个字";
      } else if (
        self.data.commentContent == "" ||
        self.data.commentContent.length > 80
      ) {
        message = "评论内容不能为空或者大于80个字";
      }

      if (message) {
        wx.showToast({
          title: message,
          icon: "none",
          duration: 1500
        });
        return;
      }

      let url =
        Api.find.addComment +
        "?storeId=" +
        self.data.storeid +
        "&createUserId=" +
        app.globalData.userInfo.id +
        "&commentContent=" +
        self.data.commentContent;

      Common.request.post(url, [], data => {
        self.writeText();
        wx.showToast({
          title: "提交成功！内容正在审核中...",
          icon: "none",
          duration: 1500
        });
      });
    },
    setDefaultValue: function(e) {
      var self = this;
      self.setData({
        commentContent: e.detail.value
      });
    },
    handleBlur() {
      this.setData({
        comIsShow: false
      });
    },
    writeText() {
      const self = this;
      self.setData({
        comIsShow: !self.data.comIsShow
      });
    },
    prevent(){
      return false
    }
  }
});
