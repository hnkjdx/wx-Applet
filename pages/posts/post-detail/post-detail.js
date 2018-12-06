const postsData = require('../../../data/posts-data.js')
var app = getApp();    //调用全局方法
// pages/posts/post-detail/post-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // 如果在onLoad方法中，不是异步的执行一个数据绑定
    // 则不需要使用this.setData方法
    // 只需要对this.data赋值即可实现数据绑定
    console.log(options.id)
    this.setData({
      postData
    });
    // // 缓存
    // wx.setStorageSync('key', {
    //   game:"理工学院",
    //   developer:"李小月"
    // })
    // 文章收藏
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postsCollected = postsCollected[postId]
      //  this.setData({
      //    collected:postsCollected
      //  })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      //  缓存
      wx.setStorageSync('posts_collected', postsCollected)
    }
    // 音乐播放图片的状态
    if(app.globalData.g_isPlayingMusic && app.globalData. g_currentMusicPostId === postId){
        // this.data.isPlayingMusic = true;
        this.setData({
          isPlayingMusic : true
        })
    }
    this.setMusicMonitor();
  },


  setMusicMonitor: function (){
    // 监听启动音乐
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    // 监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })

    // 监听音乐暂停
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },

  // 点击按钮
  onColletionTap: function(event) {
    //  同步调用
    this.getPostsCollectedAsy();

    // 异步调用
    // this.getPostsCollectedSyc();
  },
  // 异步方法
  getPostsCollectedAsy:function(){
    var that = this;
    wx.getStorage({
      key:"posts_collected",
      success:function(res){
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏.未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected
        that.showModal(postsCollected, postCollected);
      }
    })
  },


  // 同步方法
  getPostsCollectedSyc:function(){
    //  获取缓存方法
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变成未收藏.未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected
    this.showModal(postsCollected, postCollected);
  },



  // 用户通知
  showModal: function(postsCollected, postCollected) {
    var thar = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#45f80",
      success: function(res) {
        if (res.confirm) {
          //   文章是否收藏缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          thar.setData({
            collected: postCollected
          })
        }
      }
    })
  },
   // 用户通知
  showToast: function(postsCollected, postCollected) {
    //   文章是否收藏缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  
  // 分享功能
  onShareTap: function (event){
    var itemList = [
      "分享给微信好友",
      "分享到QQ好友",
      "分享到QQ空间",
      "分享到微博",
    ]
     wx.showActionSheet({
       itemList:itemList,
       itemColor:"#405f80",
       success:function(res){
        //  res.cancel  用户是不是点击了取消按钮
        //  res.tapIndex  数组元素的序号，从0开始
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否取消" + res.cancel + "现在无法实现分享，以后官方有API，再实现"
        })
       }
     })
  },

  // 音乐播放
  onMusicTap:function(event){
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if(isPlayingMusic){
      //  音乐暂停
      wx.pauseBackgroundAudio();
      // 启动音乐
     this.setData({
       isPlayingMusic:false
     })
    }
    else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImg: postData.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
    
  },




  // 获取缓存方法
  // onCollectionTap:function(event){
  //   var game = wx.getStorageSync('key')
  //   console.log(game)
  // },
  // 删除缓存
  // onShareTap:function(event){
  //        wx.getStorageSync('key')
  //       //清除所有缓存
  //        wx.clearStorageSync();
  // },
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