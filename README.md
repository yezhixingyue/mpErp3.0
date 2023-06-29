# ERP

安装事项：
1. node版本使用16.17.0； 全部安装完依赖并且项目可以运行起来后， 把根目录element-ui-lib中文件全部覆盖至element-ui库中的lib文件夹（ elemen-ui使用版本2.13.0 ）。
2. 关于packages文件夹，为独立git仓库，和pc下单项目共用，如果有改动后，注意拉取至最新代码。

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

## 站点类型

        下单
        PlaceOrder = 0,

        Erp后台管理
        ManageErp = 1,

        包裹打印
        PackagePrint = 2,

        快递打单
        ExpressPrint = 3,

        网站后台
        ManageSite =4


## 订单管理表格无法复制文字问题？
    可能和Sortable库中的selectstart有关，已做针对处理，后续查看效果

## 可能会用到的js库
    vuex-module-decorators