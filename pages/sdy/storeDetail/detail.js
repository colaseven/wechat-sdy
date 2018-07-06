//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
var url = getApp().data.servsers;
var credits;
Page({
  data: {
    buyNumber: 1,
    buyNumMin: 0,
    buyNumMax: 999,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    shopNum: 0,
    hideShopPopup: true,
    creditsConvert: true,
    bgsStatus: "none",
    redeemCode: "ABCDEFGHIJKLMNOPQRST"

  },
  onLoad: function (e) {
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
    var content = "<p>商品详情演示！</p><p><img src=\"https://cdn.it120.cc/apifactory/2017/09/18/e8757190108d9350f64489fd1fe256f5.jpg\" title=\"apifactory/2017/09/18/e8757190108d9350f64489fd1fe256f5.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/09/18/eaa40b082ef1a6ab59ae7702c7db77e8.jpg\" title=\"apifactory/2017/09/18/eaa40b082ef1a6ab59ae7702c7db77e8.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/09/18/6609093bb6c1441ba57ec23529ed370e.jpg\" title=\"apifactory/2017/09/18/6609093bb6c1441ba57ec23529ed370e.jpg\"/></p><p><br/></p>"
    WxParse.wxParse('article', 'html', content, that, 5);

    var productName = "测试专用";
    credits = 80;
    var actualPrice = "30.00";
    that.setData({
      productName: productName,
      credits: credits,
      actualPrice: actualPrice
    })
  },




  tobuy: function () {
    var that = this;
    if (1 === 1) {//TODO
      wx.showModal({
        title: '提示',
        content: "确认使用" + credits + " 积分兑换？",
        success: function (res) {
          if (res.confirm) {
            that.setData({
              creditsConvert: false,
              bgsStatus: "black",
            })
          } else if (res.cancel) {
          }
        }
      })
    } else {
      this.bindGuiGeTap();
    }
  },

  copyRedeemCode: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.redeemCode,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },

  cancel: function () {
    this.setData({
      creditsConvert: true,
      bgsStatus: "none"
    })
  },
  /**
	  * 立即购买
	  */
  buyNow: function () {
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '兑换数量不能为0！',
        showCancel: false
      })
      return;
    }

    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    // 写入本地存储
    wx.setStorage({
      key: 'buyNowInfo',
      data: buyNowInfo
    })
    this.closePopupTap();
    wx.navigateTo({
      url: "../storePay/payOrder"
    })
  },

  /**
     * 组建立即购买信息
     */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = "1";
    shopCarMap.pic = "../../../images/icons/ydslogo.png";
    shopCarMap.name = this.data.productName;
    shopCarMap.price = this.data.credits;
    shopCarMap.number = this.data.buyNumber;
    return shopCarMap;
  },

  /**
  * 规格选择弹出框隐藏
  */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },

  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },

  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },

  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: this.data.productName,
      path: '/pages/storeDetail/detail?id=123&inviter_id=' + wx.getStorageSync('uid'),//TODO
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
