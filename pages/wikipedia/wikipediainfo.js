let App = getApp();
Page({
  data: {
    title:'',
    list:[]
  },
  onLoad: function (e) {

  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    let _this = this;
    _this.setData(
      { title: _this.options.title }
    )
    App._get('article/questions', {
      category_id: _this.options.category_id
    }, function (result) {
      _this.setData(
        { list: result.data }
      )
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    let _this = this;
    _this.setData(
      {title :  _this.options.title}
    )
    App._get('article/questions', {
      category_id: _this.options.category_id
    }, function(result) {
      _this.setData(
        {list : result.data}
      )
    });

  },


  //显示隐藏
  tigger: function (e) {
    var _this = this;
    var toggleBtnVal = _this.data.uhide
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      _this.setData({
        uhide: -1
      })
    } else {
      _this.setData({
        uhide: num
      })
    }
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }

})