// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{},
    moviesDouban: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/nowplaying";
        bareak;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        bareak;
      case "Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        bareak;
    }
    this.data.requestUrl = dataUrl; //上滚动加载更多
    util.http(dataUrl, this.processDoubanData)
  },
  // 上滚动加载更多
  onScrollLower: function(event) {
    var nextUrl = this.data.requestUrl + "?star=" +
      this.data.totalCount + "&count = 20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading() //加载图标
  },
  // 下拉刷新
  onPullDownRefresh: function(event) {
    console.log(11111)
    var refreshUrl = this.data.requestUrl + "?star=0&count = 20";
    this.data.movies = {};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData)
    wx.startPullDownRefresh() //加载图标
  },

  processDoubanData: function(moviesDouban) {
   console.log(moviesDouban);
    var moviesDoubans = [];
    for (var idx in moviesDouban.subjects) {
      // 截取字段的长度
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        rating: subject.rating,
        images: subject.images.small,
        movieId: subject.id
      }
      moviesDoubans.push(temp);
    }
     this.setData({
       movies: moviesDouban
     });
    
    // 上滚动加载更多
    var totalMovies = {}
    // 如果要绑定新加载的数据，那么需要之前有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = moviesDouban
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies,
    })
    this.data.totalCount = +20;
    wx.hideNavigationBarLoading(); //隐藏加载图标
    wx.stopPullDownRefresh()// 下拉刷新结束隐藏图标
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function(res) {

      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})