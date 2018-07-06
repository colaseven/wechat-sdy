//获取应用实例
var commonCityData = require('../../../utils/city.js')
var app = getApp()

Page({
  data: {
    errorHint: "none",
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0,
    totalScoreToPay: 0,//总积分 进行汇算
    goodsList: [],
  },

  onShow: function () {
    var that = this;
    var shopList = [];
    var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
    var price = buyNowInfoMem.price;
    var buyNumber = buyNowInfoMem.number;
    if (price == null || price == undefined) {
      price = 0;
    }
    if (buyNumber == null || buyNumber == undefined) {
      buyNumber = 0;
    }
    that.setData({
      goodsList: buyNowInfoMem,
      totalScoreToPay: price * buyNumber,
    });
  },

  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
  },

  initCityData: function (level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    }
    else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }
  },

  //从微信中读取地址信息
  readFromWx: function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        let provinceName = res.provinceName;
        let cityName = res.cityName;
        let diatrictName = res.countyName;
        let retSelIdx = 0;
        for (var i = 0; i < commonCityData.cityData.length; i++) {
          if (provinceName == commonCityData.cityData[i].name) {
            let eventJ = { detail: { value: i } };
            that.bindPickerProvinceChange(eventJ);
            that.data.selProvinceIndex = i;
            for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
              if (cityName == commonCityData.cityData[i].cityList[j].name) {
                //that.data.selCityIndex = j;
                eventJ = { detail: { value: j } };
                that.bindPickerCityChange(eventJ);
                for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                  if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                    //that.data.selDistrictIndex = k;
                    eventJ = { detail: { value: k } };
                    that.bindPickerChange(eventJ);
                  }
                }
              }
            }
          }
        }
        that.setData({
          wxaddress: res,
        });
      }
    })
  },

  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selCityIndex: 0,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },

  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },

  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },

  hintMessage: function (text, that) {
    that.setData({
      errorHint: 'block',
      errorMsg: text,
    })
    setTimeout(function () {
      that.setData({
        errorHint: 'none'
      })
    }, 2000);

  },

  createOrder: function (e) {
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }
    var linkMan = e.detail.value.linkMan;
    var mobile = e.detail.value.mobile;
    var address = e.detail.value.address;
    var code = e.detail.value.code;
    var province = that.data.selProvince;
    var city = that.data.selCity;
    var district = that.data.selDistrict;
    if (linkMan == "" || linkMan == undefined) {
      that.hintMessage("联系人为必填项", that);
      return;
    }
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (mobile !== 11 && !myreg.test(mobile)) {
      that.hintMessage("手机号码有误", that);
      return;
    }

    if (province == "请选择" || city == "请选择") {
      that.hintMessage("请填写完整的省市区", that);
      return;
    }

    if (address == "" || address == undefined) {
      that.hintMessage("请填写完整地址", that);
      return;
    }

    //封装数据！
    var expressage = {};
    expressage.linkMan = linkMan;
    expressage.mobile = mobile;
    expressage.address = address;
    expressage.code = code;
    expressage.province = province;
    expressage.city = city;
    expressage.district = district;

    var goodsList = that.data.goodsList;
    goodsList.totalCredits = goodsList.number * goodsList.price;
    goodsList.remark = remark;
    var postData = {
      token: loginToken,
      goodsList: goodsList,
      expressage, expressage
    }
    wx.showLoading();
    wx.request({
      url: '',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的参数
      success: (res) => {
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 配置模板消息推送
        var postJsonString = {};
        postJsonString.keyword1 = { value: goodsList.name, color: '#173177' }//商品名称
        postJsonString.keyword2 = { value: goodsList.totalCredits, color: '#173177' }//消费积分
        postJsonString.keyword2 = { value: "", color: '#173177' }//剩余积分
        postJsonString.keyword3 = { value: "", color: '#173177' }//消费时间 //TODO
        postJsonString.keyword4 = { value: "您可以在我的——>积分使用 查看订单详情。", color: '#173177' }//温馨提示
        that.sendTempleMsg(res.data.data.id,
          '9TZ_0pm8Owsr_0MaItrI7VOtfSagDirZfJHVNbW-J5I', e.detail.formId,
          '../use/useDetail?id=' + res.data.data.id, JSON.stringify(postJsonString));//TODO
        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
          url: "../use/useList"
        });
      }
    })
  },


  sendTempleMsg: function (orderId, template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: '',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        type: 0,
        module: 'order',
        business_id: orderId,
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
})
