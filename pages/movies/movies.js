var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    inTheaters: {},
    comingSoon: {},
    searchResult: {},
    top250: {},
    dataset: [],
    containerShow: true,
    searchPanelShow: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  //  请求API数据
  onLoad: function(event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/nowplaying" + "？start=0&count=20";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/nowplaying" + "？start=0&count=20";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "？start=0&count=20";
    // 异步
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣top250");
  },


  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category,
    })
  },
  //电影详情页面
  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movies-detail/movie-detail?id=" + movieId
    })
  },

  getMovieListData: function(url, settedkey, categoryTitle) {
    var that = this;
    wx.request({
      url: 'http://api.douban.com/v2/movie/nowplaying?apikey=0df993c66c0c636e29ecbb5344252a4a',
      data: {},
      method: 'GET', //OPTTONS, GET, HEAD,POST,PUT,DELETE, TRACE,CONNECT
      header: {
        'Content-type': 'application/xml' // 默认值
      },
      success: function(res) {
        that.processDoubanData(res.data, settedkey, categoryTitle)
      },
      fail: function(error) {
        console.log(error)

      },
    })
  },
  // 搜索框关闭返回页面
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}, //结果清为空
    })
  },
  //搜索
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 搜索出来的结果
  onBindBlur: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/nowplaying?apikey=0df993c66c0c636e29ecbb5344252a4a" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  processDoubanData: function(moviesDouban, settedkey, categoryTitle) {
    console.log(moviesDouban)
    var movies = [];
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
      movies.push(temp)
    }

    // var readyData = {};
    // categoryTitle: categoryTitle
    // readyData[settedkey] = movies;
    // this.setData(readyData)
    this.setData({
      movies: moviesDouban,
    })
  },














  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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