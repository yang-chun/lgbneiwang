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
    lists:[],
    list:'',
    content_length:'',
    isshow:false,
    page:1,
    weibo_id:'',
    len: '',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    showInput: false, //控制输入栏
    isemoji:false, //是否显示emoji
    commentText:'',
    emojis:["😠","😩","😲","😞","😵","😰","😒","😍","😤","😜","😝","😋","😘","😚","😷","😳","😃","😅","😆","😁","😂","😊","😄","😢","😭","😨","😣","😡","😌","😖","😔","😱","😪","😏","😓","😥","😫","😉","😺","😸","😹","😽","😻","😿","😾","😼","🙀","🙅","🙆","🙇","🙈","🙊","🙉","🙋","🙌","🙍","🙎","🙏",
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this,
    weibo_id = options.weibo_id,
    showInput = options.showInput?true:false;
    _this.setData({
      weibo_id:weibo_id,
      showInput: showInput
    })
    _this.detail_list(weibo_id);
    _this.getcommentList(weibo_id);
    _this.setListHeight();
    // _this.getUserinfo();
  },
  // 聚焦
  onbindfocus(e) {
    let bottom = e.detail.height ? e.detail.height:0;
    this.setData({
      bottom: bottom,
      isEmoji: false,
      emojiHetght: 0,
      footHeight: 0
    })
  },
  // 失焦
  blur(e){
    let bottom = 0;
    if (this.data.isEmoji == false){
      bottom = 0;
    }else{
      bottom = 220;
    }
    this.setData({
      bottom: bottom
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //点击出现输入框
  showInput: function (e) {
    let weibo_id = e.currentTarget.dataset.weibo_id,
    comment_id = e.currentTarget.dataset.comment_id ? e.currentTarget.dataset.comment_id:'',
    nickname = e.currentTarget.dataset.nickname ? '回复：'+e.currentTarget.dataset.nickname :''
    this.setData({
      showInput: true,
      weibo_id: weibo_id,
      comment_id: comment_id,
      nickname: nickname

    })
  },
  //隐藏输入框
  onHideInput: function () {
    this.setData({
      showInput: false,
      isEmoji: false,
      emojiHetght: 0,
      footHeight: 0,
      bottom:0
    })
  },
  // 监听滚动
  onPageScroll: function (e) {
    this.setData({
      showInput: false,
      isEmoji: false,
      emojiHetght: 0,
      footHeight: 0,
      bottom: 0
    })

  },
  // 评论提交
  formSubmit: function (e) {
    let _this = this,
    lists = this.data.lists;
    let weibo_id = _this.data.weibo_id,
      comment_id = _this.data.comment_id;
    App._post_form('weibo/doComment', {
      weibo_id: this.data.weibo_id,
      parent_id: comment_id,
      content: e.detail.value.comment_count
    }, function (result) {
      if (result.code == 1) {
        lists.comment_count = lists.comment_count + 1;
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000
        })
        _this.detail_list(weibo_id);
        _this.getcommentList(weibo_id);
        _this.setData({
          showInput: false,
          lists: lists,
          commentText:'',
          emojiHetght:0,
          footHeight:0

        })
      }
    })
  },
  //更多
  more(e){
    let Index =  e.currentTarget.dataset.id,
    list = this.data.list;
    list.show = !list.show || false;
    this.setData({
      list
    });
  },
  // 微博详情
  detail_list: function(weibo_id){
    let _this = this;
    App._get('weibo/detail',{
      weibo_id:weibo_id
    },function(result){
      let resList = result.data;
      _this.setData({
        list:resList
      })
    })
  },
  //点赞
  praise: function (e) {
    let list = this.data.list;
    list.is_zan = e.currentTarget.dataset.zan ? 0 : 1 || 0;
    if (list.is_zan == 1) {
      list.zan_count = list.zan_count + 1;
    } else {
      list.zan_count = list.zan_count - 1;
    }
    this.setData({
      list
    });
    let _this = this;
    let is_zan = e.currentTarget.dataset.zan ? 0 : 1,
      weibo_id = e.currentTarget.dataset.id;
    App._post_form('weibo/doZan', {
      weibo_id: weibo_id
    }, function (result) {})
  },
  // 获取评论列表
  getcommentList: function (isPage, page){
    let _this = this;
    App._get('weibo/commentList',{
      page:page || 1,
      weibo_id: _this.data.weibo_id
    },function(result){
      let resList = result.data,
        dataList = _this.data.lists;
      if (isPage == true) {
        if (resList.data == '') {
          _this.setData({
            no_more: true,
          });
        }
        _this.setData({
          lists: dataList.concat(resList.data),
          isLoading: false,
          len: dataList.concat(resList.data).length,
        })
      } else {
        _this.setData({
          lists: resList.data,
          isLoading: false,
          total: resList.total,
          len: resList.data.length
        })
      }
    })
  },
  /**
 * 浏览工作图片
 */
  previewImages: function (e) {

    let idx = e.currentTarget.dataset.idx,
      index = e.currentTarget.dataset.index,
      imageUrls = [];
    e.currentTarget.dataset.image.forEach(function (item) {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[idx    ],
      urls: imageUrls
    })
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
    // 已经是最后一页
    if (this.data.len == this.data.total) {
      return false;
    }
    this.getcommentList(true, ++this.data.page);
    this.setListHeight()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // 构建页面参数
    let weibo_id = e.target.dataset.id;
    return {
      title: '帖子详情',
      path: "/pages/found/details?weibo_id=" + weibo_id
    };
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
  // 下拉执行
  onPullDownRefresh() {
    let _this = this,
    weibo_id = _this.data.weibo_id;
    _this.detail_list(weibo_id);
    _this.getcommentList(weibo_id);
    _this.setData({
      page:1
    })
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

// 获取用户信息Api
//   getUserinfo() {
//     let _this = this;
//     App._get('sales/userInfo', {}, function (result) {
//       _this.setData(
//         { userinfo: result.data }
//       )
//     });
//   },

  //删除帖子
  deleteWeibo: function (e) {
    let _this = this,
      weibo_id = e.currentTarget.dataset.weibo_id,
      list = _this.data.list;
    wx.showModal({
      title: '提示',
      content: '确定删除吗！',
      success(res) {
        if (res.confirm) {
          App._post_form("weibo/delete", {
            weibo_id: weibo_id
          }, function (result) {
            wx.reLaunch({
              url: '/pages/found/index'
            })
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },
  // 删除评论
  deleteComments:function(e){
    let _this = this,
      weibo_id = e.currentTarget.dataset.weibo_id,
      comment_id = e.currentTarget.dataset.comment_id,
      index = e.currentTarget.dataset.index,
      lists = _this.data.lists;
    wx.showModal({
      title: '提示',
      content: '确定删除吗！',
      success(res) {
        if (res.confirm) {
          App._post_form("weibo/deleteComment", {
            weibo_id: weibo_id,
            comment_id: comment_id
          }, function (result) {
            lists.splice(index, 1)
            _this.setData({
              'lists': lists,
              'total': _this.data.total-1
            })
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  /**
   * 点击显示emoji表情框
   */
  onEmoji: function (e) {

    let footHeight = e.currentTarget.dataset.footheight,
      bottom=220;
    if (footHeight > 0){
      footHeight = 0;
      bottom = 0;
    }else{
      footHeight = 460;
    }
    this.setData({
      isEmoji: true,
      emojiHetght: 460,
      footHeight: footHeight,
      bottom: bottom
    })
  },
  /**
    * 隐藏emoji表情框
    */
  hidEmoji: function () {
    this.setData({
      isEmoji: false,
      emojiHetght: 0,
      footHeight: 0
    })
  },
  /**
   * 选中emoji表情并显示在输入框内
   */
  emojiBtn: function (e) {
    let index = e.currentTarget.dataset.i,
    _this = this;

    if (_this.data.commentText) {
      // console.log(_this.data.commentText)
      _this.setData({
        commentText: _this.data.commentText + _this.data.emojis[index]
      })
    } else {
      // console.log(_this.data.emojis[index])
      _this.setData({
        commentText: _this.data.emojis[index]
      })
    }
  },
  /**
   * 获取用户评论内容
   */
  getCommentValue(e) {
    this.setData({
      commentText: e.detail.value
    })
  },

  linechange(e){
    let lineCount = e.detail.lineCount,
    _this = this,
      auto_height = _this.data.height;
    if (lineCount>=4){
      _this.setData({
        auto_height:false
      })
    }else{
      _this.setData({
        auto_height: true
      })   
    }
  },
  // 删除内容
  deleteContent:function(e){
    let commentText =  this.data.commentText,
    _this = this;
    var char = commentText.substr(-2, commentText.length);
    var charArr = _this.data.emojis;
    var index = charArr.indexOf(char)
    if (index < 0) {
      commentText = commentText.substr(0, commentText.length - 1);
    } else {
      commentText = commentText.substr(0, commentText.length - 2);
    }
    _this.setData({
      commentText: commentText
    })
  }
})