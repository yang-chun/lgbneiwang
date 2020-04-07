// pages/post/message.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    len: '',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getmessageList();
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
  // 获取消息列表
  getmessageList: function (isPage,page) {
    let _this = this;
    App._get('weibo/messageLists',{
      page: page || 1
    },function(result){
      let resList = result.data,
        dataList = _this.data.list;
      if (isPage == true) {
        if (resList.data == '') {
          _this.setData({
            no_more: true,
          });
        }
        _this.setData({
          'list': dataList.concat(resList.data),
          isLoading: false,
          len: dataList.concat(resList.data).length
        });
      } else {
        _this.setData({
          list: resList.data,
          isLoading: false,
          total: resList.total,
          len: resList.data.length
        });
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 已经是最后一页
    if (this.data.len == this.data.total) {
      return false;
    }
    this.getmessageList(true, ++this.data.page);

  },
})