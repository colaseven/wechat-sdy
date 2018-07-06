Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wx.setStorage({
                key: 'userInfo',
                data: res,
              })
              wx.reLaunch({
                url: '../index/index',
              })
              console.log("授权成功")
            }, fail: function (res) {
              console.log(res)
            }
          })
        } else {
          console.log('出错了')
        }
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

  },

  bindGetUserInfo: function (e) {
    console.log(e, e.detail)
    wx.setStorage({
      key: 'userInfo',
      data: e.detail,
    })
    if (e.detail.userInfo) {
      wx.reLaunch({
        url: '../index/index',
      })
    } else {
      wx.navigateBack({
        delta: -1
      })
      console.log("授权失败")
    }
  }
})