/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// var host = "https://mall.richkinggo.com/api" //生产
var host = "#" //测试
var config = {
  host,
  // 登录地址，用于建立会话
  loginMiNiUrl: `${host}/auth/login/wechat-mini-program`,
  loginUrl: `${host}/auth/login/cms`,
  msgUrl: `${host}/auth/login/sms-captcha`,
  //判断是否登录
  isloginUrl: `${host}/auth/login`,
  // 首页
  homeUrl: `${host}/product/list/index`,
  //购物车总数
  totalUrl: `${host}/cart/total`,
  //商品详情
  detailUrl: `${host}/product/sku/`,
  // 购物车列表
  cartListUrl: `${host}/cart/list`,
  //添加至购物车
  editCartUrl: `${host}/cart/edit`,
  //获取邮费
  carrigeUrl: `${host}/order/carriage`,
  //默认地址
  defaultAddrUrl: `${host}/address/default`,
  // 地址列表
  addressListUrl: `${host}/address/list`,
  //新增地址
  addAddressUrl: `${host}/address`,
  //编辑地址
  updateAddressUrl: `${host}/address/update`,
  //删除地址
  deleteAddressUrl: `${host}/address/delete`,
  //提交订单
  orderUrl: `${host}/order`,
  //订单列表
  orderListUrl: `${host}/order/list?status=`,
  //订单详情
  orderDetlUrl: `${host}/order/`,
  //支付结果页
  payResult: `${host}/wechat-pay/result`,
  //支付
  payUrl: `${host}/wechat-pay/mini-program/pay`
};

module.exports = config
