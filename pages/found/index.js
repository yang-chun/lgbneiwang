// pages/post/index.js
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    nav:1,
    statNumbers:[{
      person_count:0,
      weibo_count:0,
      unread_count:0
    }],
    topic_id:0,
    topicLists:'',
    currentIndex: 0, //当前选中标题的下标
    scrollLeft: 0, //tab滚动条的位置
    list: [],
    communityList: [],
    len: '',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
    content_length:'',
    isshow:false,
    statusBarHeight: getApp().globalData.statusBarHeight,
    showInput: false, //控制输入栏
    weibo_id:'',
    magicSwitch:'',
    tabindex:0
  },
    // 导航
    navigation:function(e){
      let tabindex = e.currentTarget.dataset.tabindex ? e.currentTarget.dataset.tabindex : '';
      App.navigation(tabindex);
      
    },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    let _this = this;
    _this.statNumbers();
    wx.hideTabBar();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.audit();
    _this.statNumbers();
    _this.weibo_count();
    _this.lists();
    // _this.getUserinfo();
  },
  label:function(e){
    let _this = this;
    let tocic_id = e.currentTarget.dataset.topic_id;
    _this.setData({
      topic_id: tocic_id,
        len: '',
        no_more: false, // 没有更多数据
        isLoading: true, // 是否正在加载中
        page: 1, // 当前页码
    })
    _this.lists();

  },
  //点击出现输入框
  showInput: function (e) {
    let weibo_id = e.currentTarget.dataset.weibo_id,
      weibo_index = e.currentTarget.dataset.weibo_index;
    this.setData({
      showInput: true,
      weibo_id: weibo_id,
      weibo_index: weibo_index
    })
  },
  eventhandle:function(e){
  },

  //隐藏输入框
  onHideInput: function () {
    this.setData({
      showInput: !this.data.showInput
    })
  },
  // 导航切换
  nav:function(e){
    let _this = this;
    let nav = e.currentTarget.dataset.nav;
    if(nav == 2){
      _this.setData({
        page:1,
        no_more: false,
        len:'',
        isLoading:true
      })
      this.salesman_lists();
    }else{
      _this.setData({
        page: 1,
        no_more:false,
        len:'',
        isLoading: true
      })
      this.lists();
    }
    this.setData({
      nav
    });
  },
  // 是否显示发现页面
  audit: function () {
    let _this = this;
    App._get('weibo/magicSwitch', {}, function (result) {
      _this.setData({
        magicSwitch: result.data
      })
    })
  },
  // 监听滚动
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    _this.setListHeight();
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  more(e){
    let Index =  e.currentTarget.dataset.id,
    list = this.data.list;
    list[Index].show = !list[Index].show || false;
    this.setData({
      list
    });
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

  // 下拉执行
  onPullDownRefresh() {
    let _this = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (this.data.magicSwitch === 0) {
      _this.statNumbers();
      _this.weibo_count();
      _this.lists();
      _this.setData({
        len: '',
        no_more: false, // 没有更多数据
        isLoading: true, // 是否正在加载中
        page: 1, // 当前页码
      })
    }
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(this.data.no_more)
    // 已经是最后一页
    if (this.data.no_more == true) {
      return false;
    }
    if (this.data.nav == 1){
      // 加载下一页列表
      this.lists(true, ++this.data.page);
    }else{
      this.salesman_lists(true, ++this.data.page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // 构建页面参数
    let weibo_id = e.target.dataset.id;
    return {
      title: '蓝工保',
      path: "/pages/found/details?weibo_id="+weibo_id
    };
  },
  statNumbers:function(){
    let _this = this;
    App._get('weibo/statNumbers', {
    }, function (result) {
      _this.setData({
        statNumbers:result.data
      })
    });
  },
  // 获取主题
  weibo_count:function(){
    let _this = this;
    App._get('weibo/topicLists', {
    }, function (result) {
      _this.setData({
        topicLists: result.data
      })
    });
  },
  // 获取微博列表
  lists: function (isPage, page){
    let _this = this;
    _this.setData({
      len: true,
    });
    App._get('weibo/lists', {
      page: page || 1,
      topic_id: _this.data.topic_id
    }, function (result) {
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

  // 获取通讯录列表
  salesman_lists: function (isPage, page) {
    let _this = this
    _this.setData({
      len: true,
    });
    App._get('salesman/lists', {
      page: page || 1,
    }, function (result) {
      let resList = result.data,
        dataList = _this.data.communityList;
      if (isPage == true) {
        if (resList.data == '') {
          _this.setData({
            no_more: true,
          });
        }
        _this.setData({
          'communityList': dataList.concat(resList.data),
          isLoading: false,
          len: false,
        });
      } else {
        _this.setData({
          communityList: resList.data,
          isLoading: false,
          len: false,
        });
      }
    });
  },
  //点赞
  praise:function(e){
    let Index = e.currentTarget.dataset.index,
    list = this.data.list;
    list[Index].is_zan = e.currentTarget.dataset.zan ? 0 : 1 || 0;
    if (list[Index].is_zan== 1){
      list[Index].zan_count = list[Index].zan_count + 1;
    }else{
      list[Index].zan_count = list[Index].zan_count - 1;
    }
    this.setData({
      list
    });
    let _this = this;
    let is_zan = e.currentTarget.dataset.zan?0:1,
      weibo_id = e.currentTarget.dataset.id;
    App._post_form('weibo/doZan',{
      weibo_id: weibo_id
    },function(result){
    
    })
  },
  // 获取用户信息Api
  getUserinfo() {
    let _this = this;
    App._get('sales/userInfo', {}, function (result) {
      _this.setData(
        { userinfo: result.data }
      )
    });
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

    /**
     * 浏览工作图片
     */
    previewImages: function(e) {

        let idx = e.currentTarget.dataset.idx,
          index = e.currentTarget.dataset.index,
            imageUrls = [];
        e.currentTarget.dataset.image.forEach(function(item) {
          imageUrls.push(item.file_path);
        });
        wx.previewImage({
          current: imageUrls[idx],
          urls: imageUrls
        })
    },
  // 评论提交
  formSubmit:function(e){
    let _this = this;
    let Index = this.data.weibo_index,
      list = this.data.list;
    App._post_form('weibo/doComment',{
      weibo_id:this.data.weibo_id,
      content: e.detail.value.comment_count
    },function(result){
      if (result.code == 1){
        list[Index].comment_count = list[Index].comment_count + 1;
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000
        })  
        _this.setData({
          showInput: false,
          list:list
        })
      }
    })
  },
  // 拨打电话
  callem: function (e) {
    let mobile = e.currentTarget.dataset.mobile;
    if (mobile){
      mobile = mobile
    }else{
      return false;
    }
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  //删除帖子
  deleteWeibo:function(e){
    let _this = this,
        weibo_id = e.currentTarget.dataset.weibo_id,
        index = e.currentTarget.dataset.index,
        list = _this.data.list;
    wx.showModal({
      title: '提示',
      content: '确定删除吗！',
      success(res) {
        if (res.confirm) {
          App._post_form("weibo/delete",{
            weibo_id: weibo_id
          },function(result){
            list.splice(index, 1)
            _this.setData({
              'list': list
            })
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  }
})