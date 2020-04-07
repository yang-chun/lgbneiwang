let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {
      monthRoyalty: '0.00',
      monthPremium: '0.00',
      monthCustomer:0,
      avatarUrl:'/images/logo.jpg'
    },
    monthlist:[],
    tabindex:2
  },
  // 导航
  navigation: function (e) {
    let tabindex = e.currentTarget.dataset.tabindex ? e.currentTarget.dataset.tabindex : '';
    App.navigation(tabindex)
  },
  // 获取3个数据
  statNumbers: function () {
    let _this = this;
    App._get('weibo/statNumbers', {
    }, function (result) {
      _this.setData({
        statNumbers: result.data
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.getUserinfo();
    _this.statNumbers();
  },

  // 获取用户信息Api
  getUserinfo(){
    let _this = this;
    App._get('sales/userInfo', {}, function (result) {
      _this.setData(
        {userinfo: result.data }
      )
      _this.getMonthlist();
    });
  },

  //获取月列表 Api

  getMonthlist(){
    let _this = this;
    App._get('sales/royaltyList', {}, function (result) {
      _this.setData(
        { monthlist: result.data }
      )
    });
  },

  // 下拉执行
  onPullDownRefresh() {
    let _this = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    _this.getMonthlist();
    _this.getUserinfo();
    _this.statNumbers();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },


})