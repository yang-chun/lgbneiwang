// pages/customer/customer.js
let App = getApp();
Page({
  data: {
    allTitle: [
      { id: 0, title: '成交未投保' },
      { id: 1, title: '已投保' },
      { id: 2, title: '总客户' }
    ],
    userinfo: {
      avatarUrl: '/images/logo.jpg'
    },
    currentIndex: 0, //当前选中标题的下标
    scrollLeft: 0, //tab滚动条的位置
    activated_persons:'0',
    activated_customers: '0',
    in_yesterday: '0',
    out_yesterday: '0',
    
    show:false,
    topNum: 0,
    type:'unactivated',
    list: [],
    len:'',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
    tabindex: 1
  },
  // 导航
  navigation: function (e) {
    let tabindex = e.currentTarget.dataset.tabindex ? e.currentTarget.dataset.tabindex : '';
    App.navigation(tabindex)
  },
  statNumbers: function () {
    let _this = this;
    App._get('weibo/statNumbers', {
    }, function (result) {
      _this.setData({
        statNumbers: result.data
      })
    });
  },
// 下拉执行
  onPullDownRefresh() {
    let _this = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    _this.statNumbers();
    _this.getparameter();
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  //点击切换标题
  changeTitle(event) {
    let index = event.target.dataset.current;//当前点击标题的index
    let _this = this;
    if (index == 0) {
      _this.setData({
        type: 'unactivated',
      })
    }
    if (index == 1) {
      _this.setData({
        type: 'activated',
      })
    }
    if (index == 2) {
      _this.setData({
        type: '',
      })
    }
    _this.getCustomerList()
    this.setData({
      currentIndex: index
    })
    this.setData({
      no_more: false,
      page: 1,
      isLoading: true,
      len: 'true',
      topNum: this.data.topNum = 0
    })
    _this.goTop();
  },

// 监听滚动
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  onReady: function () {
    let _this = this;
    _this.getparameter();
    _this.setListHeight();
    _this.statNumbers();
    wx.showShareMenu({
      withShareTicket: true
    })
  },


  // Api 获取四个参数
  getparameter(){
    let _this = this;
    App._get('sales/statistics', {}, function (result) {
      _this.setData({
        activated_persons: result.data.activated_persons,
        activated_customers: result.data.activated_customers,
        in_yesterday: result.data.in_yesterday,
        out_yesterday: result.data.out_yesterday,
      })
      _this.getCustomerList();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });
  },
  /**
   * Api：获取客户列表
   */
  getCustomerList(isPage, page) {
    let _this = this
    _this.setData({
      len: true,
    });

    App._get('sales/customerList', {
      page: page || 1,
      type: _this.data.type
    }, function (result) {
      let resList = result,
      dataList = _this.data.list;

      if (isPage == true) {
        if (resList.data == ''){
          _this.setData({
            no_more: true,
          });
        }
        _this.setData({
          'list': dataList.concat(resList.data),
          isLoading: false,
          len: false,
        });
      } else {
        _this.setData({
          list: resList.data,
          isLoading: false,
          len: false,
        });
      }

    });
  },

  onReachBottom: function () {
    // 已经是最后一页
    if (this.data.no_more == true) {
      return false;
    }
    // 加载下一页列表
    this.getCustomerList(true, ++this.data.page);
  },

  /**
   * 设置文章列表高度
   */
  setListHeight: function () {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750,
      scrollHeight = systemInfo.windowHeight; // swiper高度

    this.setData({
      scrollHeight
    });
  },


})
