(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-22b56fbe"],{"259e":function(t,e,a){"use strict";a.r(e);var c=(a("b0c0"),a("5530")),r=a("2f62"),i={name:"CraftTotalPriceSetPage",components:{},computed:Object(c.a)({},Object(r.e)("priceManage",["curCraftPriceItemData","curPriceItem"]),{curCraft:function(){return this.curCraftPriceItemData.Craft||{}}}),data:function(){return{PriceID:"",PriceName:"",ProductID:"",ProductName:""}},methods:{onGoBackClick:function(){this.$goback()}},mounted:function(){if(this.curPriceItem&&this.curCraftPriceItemData&&this.curCraftPriceItemData.Craft){var t=this.curPriceItem,e=t.ID,a=t.Name;this.PriceID=e,this.PriceName=a,this.ProductID=this.$route.params.id,this.ProductName=this.$route.params.name}else this.$goback()}},s=(a("a9b5"),a("2877")),n=Object(s.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"mp-erp-price-module-craft-price-total-price-set-page-wrap"},[a("header",[a("span",[t._v("当前产品：")]),a("span",[t._v(t._s(t.ProductName))]),a("span",{staticClass:"name"},[t._v("价格名称："+t._s(t.PriceName))]),a("span",{staticClass:"name"},[t._v("设置工艺："+t._s(t.curCraft.Name))])]),a("main"),a("footer",[a("el-button",{on:{click:t.onGoBackClick}},[a("i",{staticClass:"el-icon-d-arrow-left"}),t._v(" 返回")])],1)])}),[],!1,null,null,null);e.default=n.exports},"2e43":function(t,e,a){},a9b5:function(t,e,a){"use strict";var c=a("2e43");a.n(c).a}}]);