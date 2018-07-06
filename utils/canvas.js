
function toCanvas(_this, id, progress, widht, credits, color) {
  const ctx = wx.createCanvasContext('myCanvas'),
    percent = progress,  //最终百分比
    lineWidth = 15,  //圆形线条的宽度
    circleX = (widht + lineWidth) / 2,     //  中心x坐标
    circleY = widht / 2 + lineWidth,       // 中心y坐标
    radius = widht / 2, //圆环半径
    fontSize = 25; //字体大小 
  // 偏移
  var c = wx.getSystemInfoSync().screenWidth - widht
  var lf = c / 2 - lineWidth / 2
  var w = (radius * 2 + lineWidth)
  _this.setData({
    // w: 394
    w: w,
    lf: lf
  })
  //两端圆点
  function smallcircle1(cx, cy, r) {
    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.setLineWidth(lineWidth);
    // ctx.setFillStyle('#06a8f3'); 
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  function smallcircle2(cx, cy, r) {
    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.setLineWidth(lineWidth);
    ctx.setFillStyle('#00f8bb');
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 画圆
  function circle(cx, cy, r) {
    ctx.beginPath();
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#EEEEEE');
    ctx.arc(cx, cy, r, Math.PI * 2.5 / 3, Math.PI * 0.5 / 3);
    // ctx.arc(circleX, circleY, radius, (Math.PI * 2.9 / 3), 0.1 * Math.PI / 3, false)
    ctx.setLineCap('round');
    ctx.stroke();

  }

  // 画弧线
  function sector(cx, cy, r, startAngle, endAngle, anti) {
    ctx.beginPath();
    // ctx.moveTo(cx, cy + r); // 从圆形底部开始画  
    ctx.setLineWidth(lineWidth);

    // console.log(cx, cy + r)
    // 渐变色 - 可自定义
    var linGrad = ctx.createLinearGradient(
      circleX - radius - lineWidth, circleY, circleX + radius + lineWidth, circleY
    );
    //linGrad.addColorStop(0.0, '#eee');
    //linGrad.addColorStop(0.5, 'red');
    //linGrad.addColorStop(1.0, '#00f8bb');                   
    var yc = (Math.PI * 2 / 3) + endAngle / 100 * (Math.PI * 5 / 3)

    if (yc < 2) {
      ctx.setStrokeStyle("aquamarine")
    } else if (yc > 2 && yc < 4) {
      ctx.setStrokeStyle(color)
    }
    else {
      ctx.setStrokeStyle(color)
    }
    // 圆弧两端的样式
    ctx.setLineCap('round');

    // 圆弧
    ctx.arc(
      cx, cy, r,
      (Math.PI * 2.5 / 3),
      // (Math.PI * 2.9 / 3),
      // 2.9,
      (Math.PI * 2.5 / 3) + endAngle / 100 * (Math.PI * 5 / 3),
      false
    );
    ctx.stroke();
    ctx.draw()


  }

  //  刷新
  function loading() {
    if (process >= percent) {
      clearInterval(circleLoading);
    }
    // 清除canvas内容
    ctx.clearRect(0, 0, circleX * 2, circleY * 2);
    // 中间的字
    ctx.font = fontSize + 'px April';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333333';
    ctx.fillText('积分' + credits, circleX, circleY);
    // 圆形
    circle(circleX, circleY, radius);
    // 圆弧
    sector(circleX, circleY, radius, Math.PI * 2 / 3, process);
    // 两端圆点
    // smallcircle1(150 + Math.cos(2 * Math.PI / 360 * 120) * 100, 150 + Math.sin(2 * Math.PI / 360 * 120) * 100, 5);
    // smallcircle2(150 + Math.cos(2 * Math.PI / 360 * (120 + process * 3)) * 100, 150 + Math.sin(2 * Math.PI / 360 * (120 + process * 3)) * 100, 5);
    //  控制结束时动画的速度
    if (process / percent > 0.90) {
      process += 0.30;
    } else if (process / percent > 0.80) {
      process += 0.55;
    } else if (process / percent > 0.70) {
      process += 0.75;
    } else {
      process += 1.0;
    }
  }
  var process = 0.0;   //进度
  var circleLoading = setInterval(function () {
    loading();
  }, 20);

}
/** 获取unid */
function getopenid(host, basei, calkhs) {
  // 登录
  wx.login({
    success: res => {
      console.log(res, "消息胜多负少")
      if (res.code) {
        wx.setStorageSync('code', res.code)
        console.log(res.code, 'code获取成功')
        var code = res.code
        wx.request({
          url: host + '/getOpenId/' + code,
          data: {
          },
          method: 'GET',
          header: {
            'Authorization': basei,
          },
          success: function (res) {
            console.log(res, '小程序登入接口')
            var openId = res.data.data.openid;
            // var unionid = res.data.data.unionid;
            var a = res.data.data.uid;
            wx.setStorageSync('openId', openId)
            // wx.setStorageSync('unionid', unionid) //TODO
            calkhs(openId);
          },
          fail: function (res) {
            fail(res)
            console.log(res)
          }
        })
      }
      // console.log(res)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
}
module.exports = {
  toCanvas: toCanvas,
  getopenid: getopenid
}
