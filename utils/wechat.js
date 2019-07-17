// 获取服务器数据的接口
var api = function(url,data=''){
    return new Promise((suc, fai) => wx.request({
      url: url,
      data:data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        suc(res);
      },
      fail: function () {
        fai("获取失败");
      },
    }));
  }

module.exports = {
  api: api
}