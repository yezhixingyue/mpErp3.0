# ERP

## 列表接口

    POST /Api/Constant/VersionValid
    
    Key 取值见枚举值
    Value 无需传，客户端版本号控制使用
    Page 下单或报价时等9，其它情况不用传值

        生产工厂    Factory = 1,

        2.0版物料   Material = 7,

        销售区域    SellArea = 3,

        配送区域    ExpressArea = 4,

        工艺分类    CraftClass = 5,

        产品分类    ProductClass = 6,

        物料品牌    MaterialBrand = 8,

        产品 仅编号及名称    Product = 60,

        客户端系统    CustomerClient = 70,

        客户分类    CustomerCategory = 71,

        员工端系统    StaffClient = 80,

        部门    Department = 81,

        职务    Job = 82,

        权限    Permission = 83,

        售后类型    AfterSalesClass = 84,


    版本类型
    </summary>
    public enum VersionType : byte
    {

        生产工厂
        Factory = 1,

        销售区域
        SellArea = 3,

        工艺分类
        CraftClass = 5,

        产品分类(代客下单)
        ProductClass = 6,

        2.0版物料
        Material = 7,

        物料品牌
        MaterialBrand = 8,

        文章分类
        ArticleClass = 9,

        产品 仅编号及名称
        Product = 60,

        生产周期
        ProducePeriod = 61,

        客户端系统
        CustomerClient = 70,

        客户分类
        CustomerCategory = 71,

        员工端系统
        StaffClient = 80,

        部门
        Department = 81,

        职务
        Job = 82,

        权限
        Permission = 83,
    }

## 接单员接口

    POST /Api/Staff/List

## 快递列表接口（配送方式列表）

    GET /Api/Express/List

## 资金渠道

        余额        FundCash = 1,

        欠款额      Credit = 2, ----- 不显示

        支付宝      Alipay = 3,

        微信支付    WeiXinPay = 4,

        物流代收    Logistics = 5,

        通联支付    AllinPay = 6, ----- 不显示

        退款        Refund = 12, 

        退还信誉额  Reimbursement = 13, ----- 不显示

        还款        Repayment = 14, ----- 不显示

        返现        ReturnCash = 15,

        手动入账    ManualIncrease = 16,

        手动扣款    ManualDeduct = 23,

        支付订单    PayOrder = 24
    }

## 余额流水类型

        充值     Recharge = 11,

        支付     Consume = 21,

## 订单流水类型

        退款     Refund = 12,

        支付     Consume = 21,

## 支付方式 -- 付款列表

        货到付款    OnDelivery = 0,

        支付定金    Deposit = 1,

        全款支付    Full = 2

## 订单支付状态 -- 付款列表

        待支付          NoPay = 1,

        已付定金        Deposit = 2,

        已付全款        FullPay = 3,

        信誉额支付      Credit = 4,

        客服下单        Service = 5,

        产品券          ProductCoupon = 6,

        重印            RePrint = 7,

## 资金流水状态 -- 付款列表

        未支付   NoPay = 1,

        已支付   HavePay = 2,

        已取消   Cancled = 255,

## 下单方式

        客户端下单  Client = 2,
        员工代下单  Staff = 1，

## 活动状态

        未开始
        NoStart = 0,
        
        进行中
        OnWay = 1,
        
        已中止
        Pause = 2,
        
        已结束
        Finished = 3,
        
        已取消
        Cancled = 255

## 对比符号枚举

        等于
        Equal = 1,
        
        不等于
        NotEqual = 2,
        
        大于
        GreaterThan = 3,
        
        大于等于
        GreaterThanOrEqual = 4,
        
        小于
        LessThan = 5,
        
        小于等于
        LessThanOrEqual = 6,
        
        包含
        Contain = 7,
        
        不包含
        NoContain = 8

## 促销活动价格单位

        产品单价
        ProductUnitPrice = 0,


        总价（每款）
        UnitKindTotalPrice = 1,


        百分比
        Percent = 3

## Type

        印刷方式属性
        PrintType = 1,

        工艺属性
        Craft = 2,

        物料属性
        Material = 3,

        部件属性
        Part = 4,

        产品属性
        Product = 5

## Opera

        等于
        [Description("等于")]
        Equal = 1,

        不等于
        [Description("不等于")]
        NotEqual = 2,

        大于
        [Description("大于")]
        GreaterThan = 3,

        大于等于
        [Description("大于等于")]
        GreaterThanOrEqual = 4,

        小于
        [Description("小于")]
        LessThan = 5,

        小于等于
        [Description("小于等于")]
        LessThanOrEqual = 6,

        包含
        [Description("包含")]
        Contain = 7,

        不包含
        [Description("不包含")]
        NoContain = 8,


        大于等于且小于等于
        [Description("大于等于且小于等于")]
        GreaterThanOrEqualMinAndLessThanOrEqualMax = 11,

        大于且小于等于
        [Description("大于且小于等于")]
        GreaterThanAndLessThanOrEqualMax = 12,

        大于等于且小于
        [Description("大于等于且小于")]
        GreaterThanOrEqualMinAndLessThanMax = 13,

        大于且小于
        [Description("大于且小于")]
        GreaterThanMinAndLessThanMax = 14,


        关联
        [Description("关联")]
        Additional = 101,

        排斥
        [Description("排斥")]
        Reject = 102

## PropertyType

        产品数量
        [Description("产品数量")]
        ProductNumber = 1,
        
        部件数量
        [Description("部件数量")]
        PartNumber = 2,
        
        默认产品
        [Description("默认产品")]
        DefaultProduct = 3,
        
        部件尺寸
        [Description("尺寸")]
        PartSize = 5,
        
        物料种类
        [Description("种类")]
        MaterialKind = 6,
        
        拼版长
        [Description("拼版长")]
        MakeupLength = 7,
        
        拼版宽
        [Description("拼版宽")]
        MakeupWidth = 8,
        
        单个面积
        [Description("单个面积")]
        SingleArea = 9,
        
        总面积
        [Description("总面积")]
        TotalArea = 10,
        
        部件
        [Description("部件")]
        Part = 11,
        
        工艺面积
        [Description("工艺面积")]
        CraftArea = 13,
        
        产品总面积
        [Description("总面积")]
        ProductTotalArea = 14,
        
        专版印张数量
        [Description("专版印张数量")]
        MakeupMaterialNumber = 15,
        
        部件实际长
        [Description("实际长")]
        PartRealLength = 16,
        
        部件实际宽
        [Description("实际宽")]
        PartRealWidth = 17,
        
        印数
        [Description("印数")]
        PrintSheepNumber = 18,

        
        工艺
        [Description("工艺")]
        Craft = 30,
        
        产品工艺
        [Description("产品工艺")]
        ProductCraft = 31,
        
        部件工艺
        [Description("工艺")]
        PartCraft = 32,
        
        部件物料
        [Description("物料")]
        PartMaterial = 33,
        
        实际克重
        [Description("实际克重")]
        MaterialWeight = 34,
        
        物料厚度
        [Description("物料厚度")]
        MaterialThicness = 35,

        
        物料属性
        [Description("物料属性")]
        MaterialProperty = 61,
        
        印刷属性
        [Description("印刷属性")]
        PrintProperty = 62,
        
        部件属性
        [Description("部件属性")]
        PartProperty = 63,
        
        工艺属性
        [Description("工艺属性")]
        CraftProperty = 64,
        
        印刷属性组
        [Description("印刷属性组")]
        PrintPropertyGroup = 65,
        
        部件属性组
        [Description("部件属性组")]
        PartPropertyGroup = 66,

        
        总价增加
        [Description("总价增加")]
        TotalPrice = 81,
        
        总价上浮百分比
        [Description("总价上浮百分比")]
        TotalPriceFloatingPercent = 82,
        
        部件单价
        [Description("部件单价")]
        PartUnitPrice = 83,
        
        部件属性组
        [Description("部件属性组单价")]
        PartPropertyGroupUnitPrice = 84
    }

## Unit

        米
        [Description("米")]
        Meter = 11,

        厘米
        [Description("厘米")]
        Centimeter = 12,

        毫米
        [Description("毫米")]
        MilliMeter = 13,


        专版印张数量
        [Description("专版印张数量")]
        MakeupMaterialNumber = 15,


        平方米
        [Description("平方米")]
        SquareMeter = 21,

        平方厘米
        [Description("平方厘米")]
        SquareCentimeter = 22,

        平方毫米
        [Description("平方毫米")]
        SquareMilliMeter = 23,

        克
        [Description("克")]
        Gram = 31,

        盎司
        [Description("盎司")]
        Ounce = 32,

        吨
        [Description("吨")]
        Ton = 33,

        丝
        [Description("丝")]
        Si = 34,

        千克
        [Description("千克")]
        Kg = 35,


        P
        [Description("P")]
        P = 41,

        个
        [Description("个")]
        An = 42,

        根/条/束
        [Description("根/条/束")]
        Loaf = 43,

        块
        [Description("块")]
        Cube = 44,


        令
        [Description("令")]
        Ream = 45,

        套
        [Description("套")]
        Set = 46,

        面
        [Description("面")]
        Side = 47,


        款
        [Description("款")]
        Kind = 60,

        模位
        [Description("模位")]
        Module = 61,

        总量
        [Description("总量")]
        Total = 62,

        增量
        [Description("增量")]
        Increment = 63,

        大版占位单价
        [Description("大版占位单价")]
        MakeupNumber = 64,


        盒
        [Description("盒")]
        Box = 151,

        张
        [Description("张")]
        Piece = 152,

        本
        [Description("本")]
        Book = 153,

        件
        [Description("件")]
        Article = 154,

        副
        [Description("副")]
        Pair = 155,

        包
        [Description("包")]
        Bale = 156,

        幅
        [Description("幅")]
        Double = 157,

        自定义
        [Description("自定义")]
        UserDefined = 255

## 优惠券发放状态 CouponProvideStatus

        未开始发放
        NotStarted = 0,

        发放中
        InProcess = 1

        已发放结束
        Finished = 2

## 优惠券使用状态 CouponUseStatus

        未开始
        NotStarted = 0

        可使用
        NotStart = 1

        已过期
        Expired = 2

## 优惠券码状态

        未激活
        UnActivated = 0,
        
        已激活
        HaveActivated = 1,
        
        已使用
        HaveUsed = 2

## 优惠券生成方式

        手动生成 （ 暂时只有这一种 ）
        ManuallyGenerated = 0

## 工艺周期类型 CraftPeriodType

        不额外增加      
        NoIncrease = 0

        累加工艺周期
        Summation = 1
        
        取最长工艺周期
        TakeMaximum = 2

        按照工艺种类递增
        IncreaseByKind = 3

## 售后申请类型（诉求意向）

  退货退款  0
  
  补印  1
  
  减款  2
  
  其他  255

## 售后状态（问题反馈状态）

  已提交  0
  
  处理中  1
  
  处理成功  2

  已拒绝 3
  
  已取消  255
  
## 统计分析 --------------- ↓

    1. 统计类型 public enum StatisticsType : byte

    {
        订单  Order = 0,

        客户  Customer = 1,

        客户订单  CustomerOrder = 2,

        售后单  AfterSalesOrder = 3

    }


    2. 统计数据类型 public enum StatisticsDataType : byte

    {
        订单总金额  OrderTotalAmount = 0,

        订单实际金额(减去售后损失)  OrderActualAmount = 1,

        订单数量  OrderCount = 2,

        客户数量  CustomerCount = 3,
        
        客单价  PerCustomerTransaction = 4,

        售后损失金额  LossAmount = 5

    }


    3. 统计订单状态 public enum StatisticsOrderStatus : byte

    {
        正常  Normal = 0,

        已过期  Expired = 254,

        已取消  Cancled = 255

    }


    4. 统计下单方式 public enum StatisticsOrderType : byte

    {
        代客下单  Staff = 1,

        客户端  Client = 2,

        网页版   Web = 3

    }


    5. 统计日期分组  public enum StatisticsTimeSpan : byte

    {
        不分组  None = 0,

        年  Year = 1,

        月  Month = 2,

        周  Week = 3,

        日  Day = 4,

        小时  Hour = 5

    }


    6. 图表类型 public enum ChartType : byte

    {

        柱状图  BarGraph = 0,

        折线图  LinChart = 1,

        饼状图  PieChart = 2

    }


    7. 统计条件类型 public enum StatisticsConditionType : byte

    {
        订单状态  Status = 0,

        下单方式  OrderType = 1,

        单个订单金额  OrderAmount = 2,

        单个订单损失金额  OrderLossAmount = 3,

        客户类型  CustomerType = 4,

        客户等级  CustomerGrade = 5,

        注册方式  RegType = 6,

        注册时间  RegTime = 7,

        客户总订单金额  CustomerOrderAmount = 8,

        客户总损失金额  CustomerLossAmount = 9,

        售后单类型  QuestionSolutionType = 10,

        售后问题  QuestionType = 11,
        
        物流方式  Express = 12,

        产品一级分类  ProductFirstLevel = 21,

        产品二级分类  ProductSecondLevel = 22,

        产品三级分类  ProductThirdLevel = 23,

        大区  AreaFirstLevel = 31,

        城市  AreaSecondLevel = 32,

        县区  AreaThirdLevel = 33,

    }


    8. 统计数据拆分类型 public enum StatisticsSplitType : byte

    {
        行  Row = 0,

        列  Column = 1,

        日期  Time = 2

    }

    9. 统计数据注册时间

       新注册客户 0
       老客户     1


    10. 统计订单状态

      正常订单    0
      有售后订单  1
      已取消      254
      已过期      255

    11. 售后单处理类型
      
      减款        2
      补印        7

    12. 客户注册方式
      员工添加    255
      客户端      0
      网页版      1
      微信端      2

## 统计分析 --------------- ↑

this.debounceClose = debounce(200, () => this.handleClosePopper()); 把组件中得200时间改成0

public enum MultiLevelClassType : byte
        工艺
        Craft = 0,
        代客下单
        ValetOrder = 1

## 属性使用位 UseModule

        物料类型公式
        MaterialFormula = 0,

        产品公式
        ProductFormula = 1,

        产品子公式
        ProductSubFormula = 2,

        计算公式
        CalculateFormula = 3,

        计算子公式
        CalculateSubFormula = 4,

        报价结果公式
        PriceResultFormula = 5,

        报价方案公式 6,

        库存条件
        StockConstraint = 11,

        工厂条件
        FactoryConstraint = 12,

        文件条件
        FileConstraint = 13,

        交互条件
        InteractionConstraint = 14

        子公式筛选数据
        SubFormulaConstraint = 15

        子公式对比条件
        SubFormulaCompareConstraint = 16

        对比验证和风险提示  17

        右侧交互结果弹窗 18

        对比主属性 19

        对比从属性 20

        库存右侧属性选择弹窗列表 21

        拼版控制尺寸数量属性列表 MakeupSizeNumberic = 22

        拼版混合相同条件设置  23

        设置计算子公式条件筛选，目前看是和设置子公式条件筛选出来的数据一样  24

        子交互 25

        子对比 26

        子条件 27

        价格子公式筛选 左 28

        价格子公式筛选 右 29

## 运算符号

        等于
        Equal = 1,

        不等于
        NotEqual = 2,

        大于
        GreaterThan = 3,

        大于等于
        GreaterThanOrEqual = 4,

        小于
        LessThan = 5,

        小于等于
        LessThanOrEqual = 6,

        包含
        Contain = 7,

        不包含
        NoContain = 8,


        大于等于且小于等于
        GreaterThanOrEqualMinAndLessThanOrEqualMax = 11,

        大于且小于等于
        GreaterThanAndLessThanOrEqualMax = 12,

        大于等于且小于
        GreaterThanOrEqualMinAndLessThanMax = 13,

        大于且小于
        GreaterThanMinAndLessThanMax = 14,


        关联
        Additional = 101,

        排斥
        Reject = 102

## 属性值类型

        值
        Numeric = 0,

        单选
        Radio = 1,

        多选
        MultiChoice = 2,

        多次使用选择项
        MultiUsedOption = 3,

        开关
        Switch = 4,

        工艺
        Craft = 5,
        
        物料
        Material = 6

## 产品控制类型

        界面交互
        UIInteraction = 0,

        子交互
        SubInteraction = 1,

        对比
        Compare = 2,

        子对比
        SubCompare = 3,

        风险提示
        RiskTips = 4

## 拼版控制类型 MakeupControlType

        尺寸数量
        SizeNumber = 0,

        拼版幅面
        Breadth = 1,

        拼版规则
        Rule = 2,

        拼版算法
        Algorism = 3,

        印刷次数
        PrintTimes = 4,

        物料损耗
        Wastage = 5

## 裁切规则 CuttingRule

        最大数量
        None = 0,

        通刀
        TongDao = 1,

        方向一致
        SameDirection = 2
    }

## 印刷次数规则 PrintTimesRule

        两倍纸张数量
        TwoTimesMaterial = 0,

        纸张数量
        SameWithMaterial = 1

## 损耗规则 WastageRule

        物料损耗设为
        Setup = 0,

        物料损耗增加
        Increment = 1

## 损耗单位类型 WastageUnitType

        展开物料数量
        UnMakeupNumber = 1,

        印刷幅面物料数量
        MakeupNumber = 2

## 损耗单位 WastageUnit

        百分比
        Percent = 0,

        张
        Paper = 1

 public enum SizeNumberFormulaType:byte
    {
        展开长
        UnfoldLength=0,

        展开宽
        UnfoldWidth = 1,

        内容不同
        DifferentContent = 2,
        
        印刷份数
        PrintNumber = 3,
    }

UseModule枚举中加入
        生产工期组成公式
        ProducePeriodItemFormula = 9,

        生产总工期公式
        ProduceTotalPeriodFormula = 10,

        生产工期组成条件

        ProducePeriodItemConstraint = 44,
        生产总工期条件

        ProduceTotalPeriodConstraint = 45,

        特殊工期条件
        SpecialPeriodConstraint = 47,

PropertyFixedType枚举中加入
        工期数据
        ProducePeriodItemData = 39,


PropertyFixedType 增加
        /// <summary>
        /// 重量
        /// </summary>
        [Description("重量")]
        Weight = 48,
UseModule增加
        /// <summary>
        /// 快递价格条件
        /// </summary>
        [Description("快递价格条件")]
        [Category(ConstriantModules.UseModuleConstraintCategory)]
        LogisticsConstraint = 48,

        /// <summary>
        /// 快递价格公式
        /// </summary>
        [Description("快递价格公式")]
        [Category(ConstriantModules.UseModuleFormulaCategory)]
        LogisticsFormula = 100,

## 注册方式  RegType ----------- 客户管理使用

        客户端
        Client = 0,

        网页版
        Web = 1,

        微信
        Mobile = 2,

        员工添加
        Manual = 255

## 认证状态  AuthStatus

        未申请
        Initial = 0,

        申请
        Apply = 1,

        通过
        Checked = 2,

        拒绝
        Refuse = 3,

## 客户状态  CustomerStatus

        正常
        Nomal = 1,

        已冻结
        Freezed = 2,

        已删除
        Deleted = 3

## 账号状态  AccountStatus

        正常
        Nomal = 1,

        禁用
        Forbit,

## 返现类型  CashBackType

        充值返现
        Recharge = 1,

        消费返现
        Consume,

## 企业类型  CompanyType

        类型不清楚
        UnKown =   0
        
        设计公司
        
        DesignCompany = 1,
        
        个体户
        
        SelfEmployed = 2,
        
        连锁店
        
        MultyShop = 3,
        
        渠道店铺
        
        ChannelShop = 4,
        
        电商商户
        
        EBusiness = 5,
    }

## 经营场所  CompanyPlace

        场所不清楚
        UnKown =   0

        店面
        Shops = 1,
        
        住宅
        House,

        办公室
        Office,
        
        工业园
        IndustrialPark

## 经营规模 CompanyScale

        规模不清楚
        UnKown =   0

        1-5
        OneToFive = 1,
        
        6-15
        SixToFifteen 2,
        
        16-50
        SixteenToFifty 3,

        大于50
        MoreThanFifty 4
