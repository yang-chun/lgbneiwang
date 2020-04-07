// pages/customer/customer.js
Page({
  data: {
    allTitle: [
      { id: 0, title: '成交未投保' },
      { id: 1, title: '成交已投保' },
      { id: 2, title: '总客户' }
    ],
    currentIndex: 0, //当前选中标题的下标
    scrollLeft: 0, //tab滚动条的位置
    
  },



  //点击切换标题
  changeTitle(event) {
    let index = event.target.dataset.current;//当前点击标题的index
    this.setData({
      currentIndex: index
    })
  },
  

  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      scrollTop: e.scrollTop
    })
  }

})
