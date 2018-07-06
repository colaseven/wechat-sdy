//index.js
//获取应用实例
var url = getApp().data.servsers;
var app = getApp()
Page({
  data: {
    goods: [{
      arCode: "",
      categoryId: 2246,
      characteristic: "",
      commission: 5,
      commissionType: 2,
      dateAdd: "2017-10-30 10:51:08",
      dateStart: "2017-10-30 10:44:34",
      dateUpdate: "2018-06-19 16:47:26",
      id: 6765,
      logisticsId: 386,
      minPrice: 80,
      minScore: 0,
      name: "测试专用",
      numberFav: 0,
      numberGoodReputation: 1,
      numberOrders: 1,
      originalPrice: 0,
      paixu: 0,
      pic: "https://cdn.it120.cc/apifactory/2017/09/18/4dab0bf4842cb53981d10df926aed40d.jpg",
      pingtuan: false,
      pingtuanPrice: 0,
      recommendStatus: 0,
      recommendStatusStr: "普通",
      shopId: 0,
      status: 0,
      statusStr: "上架",
      stores: 700000,
      userId: 951,
      videoId: "c4c6e38eeb3a428e80f1a8b32c6de587",
      views: 31255,
      weight: 0
    }],
    autoplay: true,
    interval: 3000,
    duration: 1000,
    scrollTop: "0",
  },



  toDetailsTap: function (e) {
    //跳转商品详情页
    wx.navigateTo({
      url: "../storeDetail/detail?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "../storeDetail/detail?id=" + e.currentTarget.dataset.id
      })
    }
  },

  scroll: function (e) {
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    //获取banner
    wx.request({
      url: url + '/getBanners',
      method: 'GET',
      success: function (res) {
        if (res.data.state === 200) {
          that.setData({
            banners: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  onShow: function () {
    var that = this;
    that.setData({
      credits: wx.getStorageSync("empirical")
    })
  },


  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch: function () {
    // this.getGoodsList(this.data.activeCategoryId);
  }
})
