//获取应用实例
var app = getApp()
var canvas = require('../../../utils/canvas.js')
var interval = null //倒计时函数
var url = getApp().data.servsers;
var credits = "0";
var progressTwo = "0";
Page({
  data: {
    toView: "",
    motto: 'MiHome_Store',
    userInfo: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 100,
    bindingStatus: "none",
    gradeStatus: "black",
    snsBtnStyle: true,
    SMSText: "获取验证码",
    currentTime: 60,
  },

  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },
  scroll: function (e) {
    if (this.data.toView == "top") {
      this.setData({
        toView: ""
      })
    }
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data.userInfo
        })
      },
    })
  },

  onReady: function () {
    var that = this;
    //获取banner
    wx.request({
      url: url + '/getBanners',
      method: 'GET',
      success: function (res) {
        if (res.data.state === 200) {
          that.setData({
            banner: res.data.data
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

  onShow: function (_this) {
    var that = _this;
    if (that == undefined) {
      that = this;
    }
    canvas.getopenid(url, null, function (openId) {
      //初始化首页数据 
      wx.request({
        url: url + '/creditsInfo/' + openId,
        method: 'GET',
        success: function (res) {
          if (res.data.state === 200) {
            wx.setStorageSync("level", res.data.data.levelNum);
            wx.setStorageSync("empirical", res.data.data.credits);
            that.setData({
              upgrade: res.data.data.upgrading,
              empirical: res.data.data.credits,
              level: res.data.data.levelNum,
              progressOne: res.data.data.position,
              levelStart: res.data.data.levelNum,
              levelEnd: res.data.data.levelNum + 1,
              creditsEnd: res.data.data.endIntegral,
              creditsStart: res.data.data.startIntegral,
            })
            var color;
            switch (res.data.data.levelNum) {
              case 1:
                color = "#FCCC08"
                break;
              case 2:
                color = "#FC3358"
                break;
              case 3:
                color = "#56E7CA"
                break;
              case 4:
                color = "#F09C18"
                break;
            }
            that.setData({
              activeColor: color
            })
            setTimeout(function () {
              var position = res.data.data.position;
              if (position > 0 && position < 10) {
                position = position - 3;
              } else if (position >= 10 && position < 20) {
                position = position - 5;
              } else if (position >= 20 && position < 90) {
                position = position - 10;
              } else if (position >= 90 && position < 95) {
                position = position - 15;
              } else if (position >= 95) {
                position = position - 20;
              }
              canvas.toCanvas(that, 'canvas', position, 170, res.data.data.credits, color);
              //要延时执行的代码  
            }, 1000) //延迟时间 这里是1秒 
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    });
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tap: function () {
    this.setData({
      toView: "top"
    })
  },

  bindingAccount: function () {
    this.setData({
      bindingStatus: "block",
      gradeStatus: "none"
    })
  },
  cancel: function () {
    this.setData({
      bindingStatus: "none",
      gradeStatus: "black"
    })
  },

  watchPhone: function (e) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (e.detail.cursor === 11 && myreg.test(e.detail.value)) {
      this.setData({
        snsBtnStyle: false,
        phonenumber: e.detail.value
      })

    } else {
      this.setData({
        snsBtnStyle: true
      })
    }
  },

  snsBtn: function (options) {
    var that = this;
    wx.request({
      url: url + "/code/" + that.data.phonenumber,
      method: "GET",
      success: function (res) {
        wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
        if (res.data.state !== 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          var currentTime = that.data.currentTime
          interval = setInterval(function () {
            currentTime--;
            that.setData({
              SMSText: currentTime + '秒',
              snsBtnStyle: true
            })
            if (currentTime == 0) {
              clearInterval(interval)
              that.setData({
                SMSText: '重新发送',
                currentTime: 60,
                snsBtnStyle: false
              })
            }
          }, 1000)
        }
      }
    })
  },


  formSubmit: function (e) {
    var that = this;
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (e.detail.value.phonenumber.length == 0 || e.detail.value.authcode == 0) {
      wx.showToast({
        title: '手机号码或验证码不能为空!',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.phonenumber.length != 11 || !myreg.test(e.detail.value.phonenumber) || e.detail.value.authcode.length != 6) {
      wx.showToast({
        title: '手机号码或验证码输入有误!',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: url + '/bindingAccount',
        method: "POST",
        data: {
          phoneNumber: e.detail.value.phonenumber,
          verifyCode: e.detail.value.authcode,
          openId: wx.getStorageSync("openId")
        },
        header: {
          'content-type': 'application/json',
          'cookie': wx.getStorageSync("sessionid")//读取cookie
        },
        success: function (res) {
          if (res.data.state !== 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              bindingStatus: "none",
              gradeStatus: "black"
            })
            that.onShow(that);
          }
        }
      })
    }
  },

  swipclick: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../index/bannerDetail?id=' + id,
    })
  }
})