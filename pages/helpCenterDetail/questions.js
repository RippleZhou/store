
/*
  qTypeid 是类型id 
  1：账户类
  2.订单类
  3.发现类
  4.物流类
  5.新手指引

  qLayout 设置布局类型
  1.标准
  2.数字标题 （包含标题）
  3.数字 内容（不带标题的）
  4.英文 标题 
  5.标题+图片
*/
var questions=[
  { //1.标准 布局
    qTypeid: '1',qid: '101', qLayout:1,
    qTitle: '转换豆是什么?', 
    qContent: '转换豆是转换商城兑换商品的介质，1豆=1元人民币的商品介质，可在转换豆区域兑换等值商品。不支持在“低价购”专区兑换；若兑换金豆专区的商品，转换豆按照3:1自动转换成金豆。转换豆和金豆仅限于兑换商品不支持提现。' 
  },
  {
    qTypeid: '1', qid: '102', qLayout: 1,
    qTitle: '金豆是什么?', 
    qContent: '金豆是转换商城“金豆专区”兑换商品的介质，1金豆=1元人民币的商品介质，可在金豆专区兑换等值商品。不支持在“低价购”专区兑换；若兑换转换豆专区的商品，1金豆自动转换成3粒转换豆。金豆仅限于兑换商品不支持提现。' 
  },
  {
    qTypeid: '1', qid: '103', qLayout: 1,
    qTitle: '现金红包是什么?',
    qContent: '现金红包，可以用于在转换商城购买商品时，抵扣一定比例的商品价格,根据商品不同最高可抵商品价格的60%;现金红包不支持抵用“金豆”专区商品，现金红包仅限于购物抵用，不支持提现。'
  },
  {
    qTypeid: '1', qid: '104', qLayout: 2, //2.数字标题 （包含标题）布局
    qTitle: '转换豆获取渠道有哪些?',
    qContent: [
      { 
        title: '1.注册得豆', 
        content:'注册成为转换商城的会员,即可获得1粒转换豆，完成注册自动到账。'
      },
      {
        title: '2.消费得豆',
        content: '在转换商城线下合作商户消费，根据商户赠送比例不同，可得消费额不同比例得转换豆。'
      },
      {
        title: '3.抢豆包得豆',
        content: '转换商城会定期投放抢豆包的活动，参与抢豆包可抢不同额度的转换豆，最高可抢100粒转换豆，每次所投放的豆包会设置其总数量，先到先得抢完为止。'
      },
      {
        title: '4.好友借豆',
        content: '转换商城会定期投放抢豆包的活动，参与抢豆包可抢不同额度的转换豆，最高可抢100粒转换豆，每次所投放的豆包会设置其总数量，先到先得抢完为止。'
      },
    ]
  },

  {
    qTypeid: '1', qid: '105', qLayout: 1,
    qTitle: '现金红包获取渠道有哪些?',
    qContent: '1.签到得现金红包<br></h3><p>可通过每天签到获取现金红包，依次签到现金红包每天X两倍， 间断需重新开始，签完7天后，重新开始签到。</p><p>2.邀请好友得现金红包<br>可通过每天签到获取现金红包，依次签到现金红包每天X两倍， 间断需重新开始，签完7天后，重新开始签到。</p><p>3.借豆给好友得现金红包<br>每成功借豆给好友可获得50元现金红包'
  },
  {
    qTypeid: '1', qid: '106', qLayout: 1,
    qTitle: '转换豆使用规则?',
    qContent: '转换豆可用于在转换商城商品兑换（不包含低价购，秒杀，以及拼团区商品）若兑换商品时但转换豆不足时，在结算时系统会自动提示可使用现金红包抵用额度，然后差额部分以现金补足完成购买。'
  },
  {
    qTypeid: '1', qid: '107', qLayout: 1,
    qTitle: '现金红包使用规则?',
    qContent: '现金红包可在低价购和转换豆专区使用，在转换商城购买商品时，抵扣一定比例的商品价格,根据商品不同最高可抵商品价格的60%，剩余差额可用现金补足完成商品购买。'
  },
  {
    qTypeid: '1', qid: '108', qLayout: 1,
    qTitle: '转换豆和现金红包可以同时使用吗?',
    qContent: '可以，在购买商品时，优先使用转换豆，若同时使用现金红包，根据商品不同商品在结算时系统会自动显示可使用现金红包额度，即完成购买，仅限于转换豆专区商品支持。'
  },
  {
    qTypeid: '1', qid: '109', qLayout: 1,
    qTitle: '退/换货后，转换豆和现金红包是否退还?',
    qContent: '使用转换豆所兑换的商品，支持质量商品的退货，在退货的同时退还所使用的转换豆或者现金以及现金红包；若非质量商品的退换货由顾客承担商品往来的快递费，退还扣除相应的快递费后退还现金。'
  },
  {
    qTypeid: '1', qid: '110', qLayout: 1,
    qTitle: '退款金额大约多久到账?',
    qContent: '退款在客服审核通过后，在收到商品确认无误后，在六个工作日到账。'
  },
  {
    qTypeid: '1', qid: '111', qLayout: 1,
    qTitle: '什么是分享赚钱?',
    qContent: '免费为分享者打造了一个专享店铺，在其店铺配置了热销商品，并且由转换商城负责快递，分享人发起分享，若朋友完成购买可得朋友购买金额15%的佣金。'
  },
  {
    qTypeid: '1', qid: '112', qLayout: 1,
    qTitle: '佣金多久可提现?',
    qContent: '你所分享的朋友，所购商品签收后的7个工作日后，可在店铺内点点击提现即可。'
  },
  {
    qTypeid: '1', qid: '113', qLayout: 4,//4.英文 标题 布局
    qTitle: '提现未到账是什么原因?',
    qContent: [
      {
        title: 'A：', 
        content:'网络延迟。可能支付宝存在延时，可咨询客服或者从新发起提现稍后再查询一次账户是否到账。'
      },
      {
        title:'B：',
        content:'填写支付宝账号和姓名不是支付宝实名认证的姓名,请检查后重新填写。'
      }
    ] 
  },
  {
    qTypeid: '1', qid: '114', qLayout: 1,
    qTitle: '分享后续的购买佣金会持续有吗?',
    qContent: '分享的链接不删除,您的好友通过您分享的活动链接完成购买的,佣金将持续拥有。'
  },
  {
    qTypeid: '1', qid: '115', qLayout: 1,
    qTitle: '别人分享我的链接我会有佣金吗?',
    qContent: '有的，只要是打开你最初转发的链接，所有人只要通过此原始链接购买的，你都有持续的佣金。'
  },
  {
    qTypeid: '1', qid: '116', qLayout: 1,
    qTitle: '赚取的佣金是自动提现还是需要自己手动提现?',
    qContent: '需要自己手动提现,佣金每到一笔可提现金额,系统会消息通知，收到通知后即可操作提现。'
  },

  {
    qTypeid: '2', qid: '201', qLayout: 3,//3.数字 内容（不带标题的）
    qTitle: '售后退换/货原则说明?',
    qContent: [
      '1.保证商品的外包装完整且无损坏；退换商品未经使用且不超退换有效期，有效期为收货后的15天之内；',
      '2.需退换的商品收货时得到赠品的，请将赠品一同寄回，否则本商城有权不办理退换货；',
'3.如您索要了收据，请将收据、说明书、包装、商品一并寄回给商家办理退换货手续，如收据丢失，将无法办理换货；',
'4.如您索要了收据，请将收据、说明书、包装、商品一并寄回给商家办理退换货手续，如收据丢失，将无法办理换货；',
'5.商城上的图片及信息仅供参考，因拍摄灯光等原因，可能造成产品图片和实物有一定差别，一切以实物为准。',
'6.如您在本商城兑换的商品出现问题，您可登录商城，进行退换货申请或者拨打客服电话，联系客服说明退换货情况，审核通过后寄回商品并填写物流信息。',
'7.根据法律规定及商品性质，如下商品不予办理换货服务：',
'2.1 个人定制类商品；',
'2.2 鲜活易腐商品，例如鲜花、绿植、果蔬、低温乳品、速冻食品等；',
'2.3 在线下载或消费者拆封的音像制品、计算机软件等数字化商品；',
'2.4 交付的报纸、期刊类商品；',
'2.5 食用类商品，例如食品、保健品、饮料、药品、酒类、奶粉、婴儿辅食等；',
'2.6 贵重类商品，例如钻石、贵金属、手表、珠宝、奢侈品等；',
'2.7 个人护理、贴身类商品，例如计生用品、美护、内衣、贴身袜裤等；',
'2.8 虚拟类商品，例如礼品卡、手机完值、游戏点卡等完值类商品.以及门票、机票、旅游套餐等一次性消费服务类商品等',
'2.9 特殊类商品，例如运营商合约手机以及二手品、处理品等；',
'2.10 任何非转换商城的商品(序列号不符);',
'2.11 过保商品(超过三包保修期的商品);',
'2.12 其他根据商品性质不宜办理换货的商品'
    ]
  },

  {
    qTypeid: '2', qid: '202', qLayout: 5,//5.文件+图片
    qTitle: '如何查看订单?',
    qContent: [
      {
        title:'1.登录商城，点击右下方”我的”',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_1_01.jpg'
      },
      {
        title: '2.点击”全部订单’,进入订单列表页面;',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_1_02.jpg'
      },
      {
        title: '3.选择相对应订单，点击查看订单详情。',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_1_03.jpg'
      }
    ]
  },

  {
    qTypeid: '2', qid: '203', qLayout: 5,//5.文字+图片
    qTitle: '如何取消订单?',
    qContent: [
      {
        title: '1.登录商城，点击右下方’我的’菜单；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_2_01.jpg'
      },
      {
        title: '2.点击“全部订单”,选择对应订单，点击“取消订单按钮” ',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_2_02.jpg'
      },
      {
        title: '3.选择取消原因，并点击”确定’',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_2_03.jpg'
      }
    ]
  },

  {
    qTypeid: '2', qid: '204', qLayout: 5,//5.文字+图片
    qTitle: '如何退/换货?',
    qContent: [
      {
        title: '1.确认收货后，与客服协商，根据协商结果填写退换货申请;',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_01.jpg'
      },
      {
        title: '2.点击“已完成”订单“',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_02.jpg'
      },
      {
        title: '3.选择需要退换货的商品，点击“退换货”按钮；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_03.jpg'
      },
      {
        title: '4.填写退换货申请，等待商家审核申请；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_04.jpg'
      },
      {
        title: '5.商城同意退换货后，退回商品，7天有效期内填写物流信息；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_05.jpg'
      },
      {
        title: '5.商城同意退换货后，退回商品，7天有效期内填写物流信息；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_05.jpg',
        image2: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_3_06.jpg'
      },
      {
        title: '6.商城收到商品并确认不影响二次销售后，会根据申请内容，退还商品款项。',
      },
    ]
  },

  {
    qTypeid: '2', qid: '205', qLayout: 5,//5.文字+图片
    qTitle: '如何修改/新增地址?',
    qContent: [
      {
        title: '1.进入商城，点击右下方“我的”菜单;',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_4_01.jpg'
      },
      {
        title: '2.点击“设置”,进入“个人资料”，进入“收货地址管理”',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_4_02.jpg'
      },
      {
        title: '3.点击“修改”按钮修改资料或者点击“新增”按钮，填写相对应信息；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_dd_4_03.jpg'
      },
      {
        title: '4.点击已有地址，可对用户手机号、收件人姓名、地址进行修改并保存收货地址。',
      },
    ]
  },

  {
    qTypeid: '2', qid: '206', qLayout: 5,//5.文字+图片
    qTitle: '订单提交成功，商品显示无货?',
    qContent: [
      {
        title: ' 因为同时抢购商品的用户非常多，所以出现此情况，请您耐心等待一下，我们会尽快备货商品并为您发货。',
      },
    ]
  },
  {
    qTypeid: '2', qid: '207', qLayout: 5,//5.文字+图片
    qTitle: '拆分后的订单不满足免基础运费条件，会多收运费吗?',
    qContent: [
      {
        title: '运运费是以您成功提交订单的金额计算的，若您提交订单时没有收取运费，则系统产生拆分订单时，就不会收取运费。',
      },
    ]
  },
  {
    qTypeid: '2', qid: '208', qLayout: 3,
    qTitle: '一个订单购买多件商品退换单个商品时，退款金额怎么算?',
    qContent: [
      '1.一个订单购买多件商品退换单个商品时，退款金额怎么算',
      '2.因商品质量问题造成的退换货，在退换货周期内，商城承担退换货的运费。用户垫付运费，商城确认收货后，同商品退回金额一起退还；',
      '3.因非商品质量问题并由用户发起的退换货行为，将由用户承担返回商城的运费。',
      '4.拒绝退换货商品时“到付”行为，否则本商城将拒收商品，产生的运费由用户承担。'
    ]
  },

  {
    qTypeid: '2', qid: '209', qLayout: 3,
    qTitle: '拒收商品是否需要收取运费?',
    qContent: [
      '1.您好，如若因商品破损因素拒收商品的，运费由商城承担；',
      '2.您好，如若因商品破损因素拒收商品的，运费由商城承担；'
    ]
  },

  {
    qTypeid: '2', qid: '210', qLayout: 3,
    qTitle: '收货后您，发现少件怎么办?',
    qContent: [
      '1.商品签收时，请您在付款后与配送人员当面核对：商品及配件、应付金额、商品数量及发货清单、赠品(如有)等，如发现少件情况，请及时联系客服，并拍照留作证明；',
      '2.为了保护您的权益，建议您尽量不要委托他人代为签收；如由他人代为签收商品而没有在配送人员在场的情况下验货，则视为您所订购商品的包装无任何问题。'
    ]
  },

  {
    qTypeid: '2', qid: '211', qLayout: 3,
    qTitle: '订单什么情况会收取退换货的运费?',
    qContent: [
      '1.因商品质量问题造成的退换货，在退换货周期内，商城将承担退换货的运费；',
      '2.因非商品质量问题并由用户发起的退换货行为，将由用户承担返回商城的运费。'
    ]
  },

  {
    qTypeid: '2', qid: '212', qLayout: 3,
    qTitle: '我的订单为何无法申请售后退换货?',
    qContent: [
      '1.商品在配送途中无法申请退换货；',
      '2.网络或系统问题，建议您刷新页面或稍后再申请；',
      '3.订单已超出售后申请时间。'
    ]
  },

  {
    qTypeid: '2', qid: '213', qLayout: 1,
    qTitle: '退款为什么比购买商品的价格少了?',
    qContent: '商城是根据您的实际支付金额进行退款，请核实您订单中是否使用了转换豆和现金红包，在退款时订单中使用的转换豆和现金红包按照使用数分别原路返还。'
  },

  {
    qTypeid: '2', qid: '214', qLayout: 3,
    qTitle: '验货与签收?',
    qContent: [
      '1.快件签收时，请您与配送人员当面核对：商品及配件、应付金额、商品数量及发货清单、赠品(如有)等；',
      '2.为了保护您的权益，建议您尽量不要委托他人代为签收；如由他人代为签收商品而没有在配送人员在场的情况下验货，则视为您所订购商品的包装无任何问题；'
    ]
  },

  {
    qTypeid: '3', qid: '301', qLayout: 1,
    qTitle: '霸王餐是什么?',
    qContent: '转换商城重点推荐的商户，此商户内植入了”餐厅mini超市“，前往商户就餐消费的，可根据消费金额得等值刚需商品（即得转换豆），支持在线下”餐厅mini超市“现场，完成用豆兑换商品——称之为：霸王餐。'
  },

  {
    qTypeid: '3', qid: '302', qLayout: 1,
    qTitle: '折扣店是什么?',
    qContent: '转换商城重点推荐的商户，此商户内植入了”餐厅mini超市“，前往商户就餐消费的，可根据消费金额得相应比例的刚需商品（即得转换豆），支持在线下”餐厅mini超市“现场，完成用豆兑换商品——称之为：折扣店（即边吃边拿）。'
  },
  {
    qTypeid: '3', qid: '303', qLayout: 1,
    qTitle: '"赚豆"是什么?',
    qContent: '前去所推荐的线下商户消费就餐，买单后得到相应的商品额度（即转换豆），同时真实发表评论、拍照片及拍视频上传参与互动的，并上传内容真实吻合，待系统完成审核匹配真实的，转换商城赠予2粒转换豆。'
  },


  {
    qTypeid: '4', qid: '401', qLayout: 1,
    qTitle: '为什么一个订单却有几个发货地址?',
    qContent: '同个订单中的不同商品可能来自不同的仓库，不同商品可能会分为一个以上的包裹发出，可能不会同时送达，建议您耐心等待。'
  },
  {
    qTypeid: '4', qid: '402', qLayout: 3,
    qTitle: '一个订单购买多件商品退换单个商品时，运费怎么算?',
    qContent: [
      '1. 因商品质量问题造成的退换货，在退换货周期内，商城承担退换货的运费。用户垫付运费，商城确认收货后，同商品退回金额一起退还；',
      '2.因非商品质量问题并由客户发起的退换货行为，将由客户承担返回商城的运费。',
      '3.拒绝退换货商品时“到付”行为，否则本商城将拒收商品，产生的运费由用户承担。'
    ]
  },

  {
    qTypeid: '4', qid: '403', qLayout: 1,
    qTitle: '物流快递多久可以送达?',
    qContent: '商城将在您成功订购后3个工作日内安排发货,物流公司将商品在7个工作日内配送到您的收货地址。如您在9个工作日内未接到购买物品的送货通知或商品包裹寄达通知,请与商城客服中心联系(400-720-0000),我们将为您及时解决问题'
  },
  {
    qTypeid: '4', qid: '404', qLayout: 1,
    qTitle: '是否可以指定某个快递公司?',
    qContent: '为了更快更有效的将您的商品送达，目前暂不提供指定快递公司的配送服务。'
  },

  {
    qTypeid: '4', qid: '405', qLayout: 5,
    qTitle: '物流如何查询?',
    qContent: [
      {
        title: '1.登录商城，点击右下方“我的”菜单;',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_wl_01.jpg'
      },
      {
        title: '2.进入“我的”页面，点击“待收货”图标；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_wl_02.jpg'
      },
      {
        title: '3.进入“待收货”订单列表页面，直接点击”查看物流“按钮，或者点击商品进入详情页面；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_wl_03.jpg'
      },
      {
        title: '4.订单详情页面，查看快递信息即可。',
      },
    ]
  },
  {
    qTypeid: '4', qid: '406', qLayout: 3,
    qTitle: '配送时间及范围?',
    qContent: [
      ' 1.配送时间',
      '1.1、商城将在您成功订购后3个工作日内安排发货。物流公司将商品在7个工作日内配送到您的收货地址。如您在9个工作日肉末接到购买物品的送货通知或商品包裹寄达通知，请与商城客服中心联系(400-720-0000),我们将为您及时解决问题；',
'1.2、如果用户已成功购买商城的商品，在商品送出后，您可以登录商城，点击右下方”我的待收货’中查看购买商品订单的配送情况；',
'1.3、商城目前暂不提供指定时间段的配送服务。',
'2.配送范围',
'2.1、商城目前暂不提供指定时间段的配送服务。',
'2.2、配送范围覆盖全国大部分地区(港澳台地区除外)'
    ]
  },
  {
    qTypeid: '4', qid: '407', qLayout: 3,
    qTitle: '运费明细说明?',
    qContent: [
      '1.单笔订单商品金额累积转换豆消费数量不少于等于300粒，则免运费，当订单转换豆消费数量小于300粒，则额外收取50粒转换豆为运费；',
    '2.单笔订单商品现金金额累积消费不少于等于49元，则免运费，当订单现金金额小于49元时，则收5-10元运费；</p><p>3.当订单商品金额是转换豆+现金时，以现金规则收取运费。'
    ]
  },
  {
    qTypeid: '4', qid: '408', qLayout: 3,
    qTitle: '物流显示派件，几天未送到怎么办?',
    qContent: [
'1.货物已经到达当地，快递员正在将货物送往目的地途中，请耐心等待。',
'通过商城客服热线了解商品所在位置，客服热线为：400-720-0000。'
    ]
  },

  {
    qTypeid: '5', qid: '501', qLayout: 5,
    qTitle: '如何找回密码?',
    qContent: [
      {
        title: '1.进入“设置”页面，选择“设置登录密码”；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_1_01.jpg'
      },
      {
        title: '2.进入“设置登录密码”页面，根据页面提示，输入老密码和新密码，然后点击“确认修改”按钮提交；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_1_02.jpg'
      },
      {
        title: '3.如忘记老密码，点击“忘记密码”按钮；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_1_03.jpg'
      },
      {
        title: '4.进入“找回密码”页面，输入手机号及验证码，点击“下一步”按钮；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_1_04.jpg'
      },
      {
        title: '5.进入“设置新密码”页面，输入新密码，确认提交；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_1_05.jpg'
      },
    ]
  },

  {
    qTypeid: '5', qid: '502', qLayout: 3,
    qTitle: '如何修改密码?',
    qContent: [
      '进入“我的”点击左上角的设置，根据页面提示，输入老密码和新密码，',
      '然后点击“确认修改”按钮提交',
'1.如忘记老密码，点击“忘记密码”按钮；',
'2.进入“找回密码”页面，输入手机号及验证码，点击“下一步”按钮；',
'3.进入“设置新密码”页面，输入新密码，确认提交；'
    ]
  },
  {
    qTypeid: '5', qid: '503', qLayout: 3,
    qTitle: '如何联系客服?',
    qContent: [
      '如有问题，请与商城客服中心联系(400-720-0000),我们将为您及时解决问题。',
    ]
  },

  {
    qTypeid: '5', qid: '504', qLayout: 5,
    qTitle: '如何修改个人资料?',
    qContent: [
      {
        title: '1.进入“我的”页面，点击“设置”按钮或者个人头像；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_2_01.jpg'
      },
      {
        title: '2.进入“设置”页面，点击“昵称”选项；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_2_02.jpg'
      },
      {
        title: '3.进入“个人资料”页面，根据提示修改相对应信息；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_2_03.jpg'
      },
    ]
  },

  {
    qTypeid: '5', qid: '505', qLayout: 5,
    qTitle: '如何设置店铺?',
    qContent: [
      {
        title: '1.首次设置店铺信息',
        title2:' (1).注册登陆',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_3_01.jpg'
      },
      {
        title: '(2).设置头像及店铺信息',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_3_02.jpg'
      },
      {
        title: '2.修改店铺信息',
        title2:'(1).点击首页“账户”',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_3_03.jpg'
      },
 
      {
        title: '(2).点击头像',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_3_04.jpg'
      },

      {
        title: '(3).设置店铺信息',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_3_05.jpg'
      },
    ]
  },

  {
    qTypeid: '5', qid: '506', qLayout: 5,
    qTitle: '如何发豆包?',
    qContent: [
      {
        title: '1.进入“我的”页面，点击“发豆包”选项；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_4_01.jpg'
      },
      {
        title: '2.进入“发豆包”页面，豆包类型分为两种，分别为普通豆包和拼手气豆包。普通豆包,领取的每个豆包转换豆数相同。拼手气豆包,领取的转换豆数随机；',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_4_02.jpg'
      },
    ]
  },

  {
    qTypeid: '5', qid: '507', qLayout: 3,
    qTitle: '发豆包规则?',
    qContent: [
     '1.豆包单笔限额600粒豆,单次最多可发200个豆包。每天限额20000粒豆。若超过限额,请您次日在进行操作',
      '2.如何发放的豆包未被领取完,在24小时后将自动退回到账户中。',
      '3.豆包最低起发量为1粒豆,余额高于20粒部分为豆包可用额度；'
    ]
  },

  {
    qTypeid: '5', qid: '508', qLayout: 5,
    qTitle: '如何修改绑定手机号?',
    qContent: [
      {
        title: '1.进入“我的”页面，点击“设置”按钮',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_5_01.jpg'
      },
      {
        title: '2.选择“修改手机号”',
        image: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_help_xs_5_02.jpg'
      }
    ]
  }
]

module.exports = questions