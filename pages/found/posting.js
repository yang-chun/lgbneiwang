// pages/post/posting.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面参数
    options: null,
    error: '',
    // tup数据
    formData: [],
    topicLists:'',
    magicSwitch: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录页面参数
    this.data.options = options;
    this.setData({
      formData: {
        content: '',
        image_list: [],
        uploaded: []
      }
    })
    this.weibo_count();
    this.audit();
  },
  // 是否显示发现页面
  audit: function () {
    let _this = this;
    App._get('weibo/magicSwitch', {}, function (result) {
      if (result.data == 1){
        wx.setNavigationBarTitle({
          title:'百问百答'
        })
      }
      _this.setData({
        magicSwitch: result.data
      })
    })
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

  /**
 * 选择图片
 */
  chooseImage: function (e) {
    let _this = this,
      imageList = _this.data.formData.image_list;
    // 选择图片
    wx.chooseImage({
      count: 9 - imageList.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        _this.setData({
          ['formData.image_list']: imageList.concat(res.tempFilePaths)
        });
      }
    });
  },
  /**
   * 删除图片
   */
  deleteImage: function (e) {
    let dataset = e.currentTarget.dataset,
      image_list = this.data.formData.image_list;
    image_list.splice(dataset.imageIndex, 1);
    this.setData({
      ['formData.image_list']: image_list
    });
  },

  /**
   * 表单提交
   */
  formSubmit: function (e) {
    let _this = this,
      formData = _this.data.formData;

    // if (e.detail.value.id_card == '') {
    //   wx.showToast({
    //     title: "身份证号不能为空",
    //     icon: "none",
    //     duration: 1000
    //   });
    //   return;
    // }
    // if (e.detail.value.id_card.length != 18) {
    //   wx.showToast({
    //     title: "身份证号有误",
    //     icon: "none",
    //     duration: 1000
    //   });
    //   return false;
    // }

    this.setData({
      ['formData.content']: e.detail.value.content,
      ['formData.topic_id']: this.data.topic_id ? this.data.topic_id:''
    });

    // 判断是否重复提交
    if (_this.submitDisable === true) {
      return false;
    }

    // 表单提交按钮设为禁用 (防止重复提交)
    _this.submitDisable = true;

    wx.showLoading({
      title: '正在处理...',
      mask: true
    });

    // form提交执行函数
    let fromPostCall = function (formData) {
      App._post_form('weibo/sendWeibo', {
        formData: JSON.stringify(formData)
      }, function (result) {
        if (result.code === 1) {
          wx.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/found/index'
                })
              }
            }
          });
        } else {
          App.showError(result.msg);
        }
      },
        false,
        function () {
          wx.hideLoading();
          _this.submitDisable = false;
        });
    };

    // 统计图片数量
    let imagesLength = formData.image_list.length;

    if (imagesLength > 0 || e.detail.value.content) {
      // 判断是否需要上传图片
      imagesLength > 0 ? _this.uploadFile(imagesLength, formData, fromPostCall) : fromPostCall(formData);
    } else {
      wx.showToast({
        title: "没有任何信息!",
        icon: "none",
        duration: 1000
      });
      _this.submitDisable = false;
    }
  },

  /**
   * 上传图片
   */
  uploadFile: function (imagesLength, formData, callBack) {
    // POST 参数
    let params = {
      wxapp_id: App.siteInfo.uniacid,
      token: wx.getStorageSync('token')
    };
    // 文件上传
    let i = 0;

    formData.image_list.forEach(function (filePath, fileKey) {
      wx.uploadFile({
        url: App.api_root + 'upload/image',
        filePath: filePath,
        name: 'iFile',
        formData: params,
        success: function (res) {
          let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
          if (result.code === 1) {
            formData.uploaded[fileKey] = result.data.file_id;
          }
        },
        complete: function () {
          i++;
          if (imagesLength === i) {
            // 所有文件上传完成
            // console.log('upload complete');
            // 执行回调函数
            callBack && callBack(formData);
          }
        }
      });
    });
  },
  // 获取主题
  weibo_count: function () {
    let _this = this;
    App._get('weibo/topicLists', {
    }, function (result) {
      _this.setData({
        topicLists: result.data
      })
    });
  },
  label: function (e) {
    let _this = this;
    let topic_id = e.currentTarget.dataset.topic_id,
      topic_cont = e.currentTarget.dataset.topic_cont;
    if (topic_id == _this.data.topic_id){
      _this.setData({
        topic_id: ''
      })
    }else{
      _this.setData({
        topic_id: topic_id
        // topic_cont: '#'+topic_cont+'#'
      })
    }

  },
})