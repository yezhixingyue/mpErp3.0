(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-38f420c0"],{"17e0":function(t,a,e){"use strict";var c=e("7c50");e.n(c).a},"2c17":function(t,a,e){"use strict";e.r(a);var c=(e("99af"),e("7db0"),e("b0c0"),e("ac1f"),e("5319"),e("96cf"),e("1da1")),n=e("5530"),i=e("2f62"),o={props:{title:{type:String,default:"产品"},itemData:{type:Object,default:null}},methods:{onSpecificationAddClick:function(){this.$emit("add")}}},r=(e("9622"),e("2877")),s={data:function(){return{ProductID:"",PartID:"",ProductName:"",titleType:""}},components:{StockTable:Object(r.a)(o,(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("section",{staticClass:"mp-erp-product-module-stock-page-list-table-comp-container"},[e("header",[e("span",{staticClass:"mp-common-title-wrap"},[t._v(t._s(t.title)+"库存")]),e("span",{staticClass:"blue-span",on:{click:t.onSpecificationAddClick}},[t._v("+ 添加规格")]),e("span",{staticClass:"blue-span"},[t._v("设置库存预警")]),e("span",{staticClass:"intro"},[t._v("库存数量 ≤ 500个时预警，短信预警手机号：13512341234")])]),e("main",[t.itemData?e("ul",[t._l(t.itemData.StockList,(function(a){return e("li",{key:a.ID},[e("span",[t._v("规格")]),e("span",[t._v("核减数量：")]),e("span",[t._v("当前库存")]),t._m(0,!0)])})),t._m(1)],2):t._e()])])}),[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("span",[t._v("修改库存")]),e("span",[t._v("删除")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("li",{staticClass:"empty"},[e("span",[t._v("暂无条目")])])}],!1,null,null,null).exports},computed:Object(n.a)({},Object(i.e)("productManage",["ProductManageList","ProductModuleKeyIDList","StockLeftPropertyList","ProductStockDataList","StockRightPropertyList"]),{curProduct:function(){var t=this;return this.ProductID?this.ProductManageList.find((function(a){return a.ID===t.ProductID})):null},curPart:function(){var t=this;return this.PartID&&this.curProduct?this.curProduct.PartList.find((function(a){return a.ID===t.PartID})):null}}),methods:{getPositionID:function(){if(this.$route.params){var t=this.$route.params,a=t.ProductID,e=t.PartID,c=t.name,n=t.type;a&&e&&c&&n?(this.ProductID=a,this.PartID="null"!==e?e:"",this.ProductName=c,this.titleType=n,this.getProductOrderData(),this.$store.dispatch("productManage/getProductStockPropertyList",this.ProductID)):this.onGoBackClick()}else this.onGoBackClick()},getProductOrderData:function(){var t=this,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["Part","Stock"];return Object(c.a)(regeneratorRuntime.mark((function e(){var c,n,i,o,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=t.PartID?t.PartID:t.ProductID,n=t.PartID?t.api.getPartModuleData:t.api.getProductModuleData,i=t.$utils.getIDFromListByNames(a,t.ProductModuleKeyIDList),o={ID:c,List:i},t.$store.commit("productManage/setProductStockDataList",[]),e.next=7,n(o).catch((function(){}));case 7:(r=e.sent)&&r.data&&1e3===r.data.Status&&t.$store.commit("productManage/setProductStockDataList",r.data.Data);case 9:case"end":return e.stop()}}),e)})))()},onGoBackClick:function(){this.$router.replace("/ProductManageList")},onSpecificationAddClick:function(t,a){var e=this.ProductID,c=this.ProductName,n=this.titleType,i="/ProductStockSpecificationAdd/".concat(e,"/").concat(t,"/").concat(c,"/").concat(n,"/").concat(a,"/").concat(Date.now());this.$router.push(i)}},mounted:function(){this.getPositionID()}},u=(e("17e0"),Object(r.a)(s,(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("section",{staticClass:"mp-erp-product-list-page-product-stock-list-page-wrap"},[e("header",[e("span",[t._v("当前"+t._s(t.titleType)+"：")]),e("span",[t._v(t._s(t.ProductName))])]),e("main",[t.ProductStockDataList?[e("StockTable",{attrs:{itemData:t.ProductStockDataList},on:{add:function(a){return t.onSpecificationAddClick("null","产品")}}}),t._l(t.ProductStockDataList.PartList,(function(a){return e("StockTable",{key:a.ID,attrs:{title:a.Name,itemData:a},on:{add:function(e){return t.onSpecificationAddClick(a.ID,a.Name)}}})}))]:t._e()],2),e("footer",[e("el-button",{on:{click:t.onGoBackClick}},[e("i",{staticClass:"el-icon-d-arrow-left"}),t._v(" 返回")])],1)])}),[],!1,null,null,null));a.default=u.exports},"7c50":function(t,a,e){},9622:function(t,a,e){"use strict";var c=e("cf16");e.n(c).a},cf16:function(t,a,e){}}]);