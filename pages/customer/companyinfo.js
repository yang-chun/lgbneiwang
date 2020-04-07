// pages/customer/companyinfo.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_name:'',
    contact:'',
    mobile:'',
    activated_persons:'',
    
    list:[],
    len: '',
    len2: '',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1 // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    _this.getparameter();
    _this.getCustomerList();
    _this.setListHeight();
  },

  // Api 获取公司信息

  getparameter() {
    let _this = this;
    App._get('sales/customerDetail', {
      customer_id: _this.options.id
    }, function (result) {
      _this.setData({
        company_name: result.data.company_name,
        contact: result.data.contact,
        mobile: result.data.mobile,
        activated_persons: result.data.activated_persons
      })
    });
  },

  //Api 获取列表
  getCustomerList(isPage, page) {
    let _this = this
    App._get('sales/policyChangeList', {
      page: page || 1,
      customer_id: _this.options.id
    }, function (result) {
      let resList = result,
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
          len: resList.data.length
        });
      } else {
        _this.setData({
          list: resList.data,
          isLoading: false,
          len2: resList.data.length,
        });
      }

    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
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
  // 拨打电话

  callem:function(e){
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: this.data.mobile 
    })
  }

})