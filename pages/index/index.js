var app = getApp();
const wechat = require('../../utils/wechat.js');
const furl = app.globalData.url;
Page({
  data: {
    displayList: [],
    src: '',
    name: '',
    status: 'play',
    audioAction: {
      method: 'pause'
    },
    loading: true,
    locatId:'',//当前省份id
    navbar: [{}, {}, {},{ id: 9999, title: "分类" }],
    currentTab: 0,//navbar选中的id
    navvalue:[],//navbar选中后显示的内容
    shengfen: [],//省份
    content:[],//分类
    hiddenname: true,
    inputValue:''
  },
  // 导航切换监听
  navbarTap: function(e) {
    var that = this;
    var hidden = false;
    var idx = e.currentTarget.dataset.idx;
    var id = e.currentTarget.dataset.id;
    switch (idx) {
      case 0: {
        if (that.data.currentTab == 0){
          hidden = !that.data.hiddenname;
        }
        that.setData({
        navvalue: that.data.shengfen,
        currentTab: e.currentTarget.dataset.idx,
        hiddenname: hidden
      }); }break;
      case 1: {
        var url = furl + 'channel/' + id;
        wechat.api(url).then((res, reg) => {
          var displayList = res.data.data;
          that.setData({
            displayList: displayList,
            currentTab: e.currentTarget.dataset.idx,
            hiddenname: true
          });
        });
      } break;
      case 2: {
        var url = furl + 'channel/' + id;
        wechat.api(url).then((res, reg) => {
          var displayList = res.data.data;
          that.setData({
            displayList: displayList,
            currentTab: e.currentTarget.dataset.idx,
            hiddenname: true
          });
        });
      } break;
      case 3: {
        if (that.data.currentTab == 3){
          hidden = !that.data.hiddenname;
        }
        that.setData({
          navvalue: that.data.content,
          currentTab: e.currentTarget.dataset.idx,
          hiddenname: hidden
        }); 
      }break;
    }
  },
  //navnar下的的每个选项
  navbarItem:function(e){
    var that = this;
    var dataset = e.target.dataset;
    var navbar = that.data.navbar;
    navbar[0] = dataset;
    var url = furl + 'channel/' + dataset.id;
      wechat.api(url).then((res, reg) => {
        that.setData({
          displayList: res.data.data,
          navbar: navbar
        });
      });
  },
  started: function(){
    this.setData({
      loading: false
    })
  },
  ended: function(){
    this.next()
  },
  //节目选项
  playItem: function(e){
    console.log(e)
    var song = e.currentTarget.dataset;
    this.setData({
      src: song.src,
      name: song.songname,
    })
    this.play()
  },
  //开始暂停
  play_pause: (function(flag){
    return function(){
      flag = !flag
      if(flag){
        this.play()
	      this.setData({
          status: 'pause'
        })
      }else{
        this.pause()
        this.setData({
          status: 'play'
        })
      }
    }
  })(0),
  play: function(){
    this.setData({
      audioAction: {
        method: 'play'
      },
      loading: true
    })
  },
  pause: function(){
    this.setData({
      audioAction: {
        method: 'pause'
      },
    })
  },
  //初始化函数
  onLoad: function () {
    this.getLocation();
  },
  //获取地区和内容分类
  getCategory: function (location){
    var that = this;
   var url = furl + 'category';
    wechat.api(url).then((res, reg) => {
      let mark = 1;
      var locatId = '';
      var content = res.data.data.content;//分类
      var regions = res.data.data.regions;//地区
      var nav = regions.splice(0, 2);
      var navbar = that.data.navbar;
      var displayList = '';
      navbar[1] = nav[0];
      navbar[2] = nav[1];
      for (let i in regions){
        if (location == regions[i].title) {//regions[i].id 当前省份id
          var url = furl + 'channel/' + regions[i].id;
          wechat.api(url).then((res, reg) => {
            displayList = res.data.data;
            that.setData({
              displayList: displayList,
              src: displayList[0].video_url,
              name: displayList[0].title,
            });
          });
          navbar[0] = regions[i];
          mark = 0;
          break;
        }
      }
      if (mark) {
        navbar[0] = nav[0];
      }
      that.setData({
        content: content,
        navbar: navbar,
        shengfen: regions,
      });
    });
  },
  //获取当前省份
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        var url = 'https://api.map.baidu.com/geocoder/v2/?ak=4V4O0gOno8EHKdPVquqCXf5jGsmo7fyE&location=' + latitude + ',' + longitude + '&output=json';
        wechat.api(url).then((res, reg) => {
          var province = res.data.result.addressComponent.province;
          var location = province.substr(0, 2);
          that.getCategory(location);
        });
      }
    })
  },
  //回车和搜索按钮
  inputEnter:function(e){
    console.log(this.data.inputValue);//搜索的名字
    var url = furl + 'channel/' + regions[i].id;
    wechat.api(url).then((res, reg) => {
      displayList = res.data.data;
      that.setData({
        displayList: displayList,
      });
    });
  },
  //实时输入的内容
  input:function(e){
    this.data.inputValue = e.detail.value;
  },
})