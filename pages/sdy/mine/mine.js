var url = getApp().data.servsers;
Page({
  data: {
    userInfo: {},
    item: {
      signinHidden: false,
      userlocal: {
        nickName: '',
        nickPwd: ''
      },
    },
    bindingDetailStatus: "none",
    level: "0",
    credits: "0",
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (data) {
        that.setData({
          userInfo: data.data.userInfo,
        })
      },
    })
  },

  quit: function () {
    this.setData({
      userInfo: '',
      'item.signinHidden': false
    })
  },
  onReady: function () {

    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    that.setData({
      level: wx.getStorageSync("level"),
      credits: wx.getStorageSync("empirical")
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  viewDetail: function () {
    var _this = this;
    wx.request({
      url: url + '/boundAccounts/' + wx.getStorageSync("openId"),
      method: "GET",
      success: function (res) {
        if (res.data.state === 200) {
          if (res.data.data.length > 0) {
            _this.setData({
              bindingDetails: res.data.data
            })
          } else {
            _this.setData({
              bindingDetails: ["暂无数据"]
            })
          }
        } 
      }
    })
    _this.setData({
      bindingDetailStatus: "black",
    })
  },

  cancel: function () {
    this.setData({
      bindingDetailStatus: "none",
    })
  },

  creditsSource: function () {
    wx.navigateTo({
      url: '../source/sourceList',
    })
  },

  creditsUse: function () {
    wx.navigateTo({
      url: '../use/useList',
    })
  }
})