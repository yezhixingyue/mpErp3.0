(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6c1966be"],{"0571":function(t,e,i){},"0eb9":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAqFBMVEUAAAAAAP8A//8zmf8rgP9Jkv9AgP9Alf87if9Hjv9AifZAif9DjPlAi/k+iPlEjvlDi/lAivpCjvpCjPs/jfdDjftBjPtDjvlAi/lCjfpCjftBi/lCjvtCjfpCjfpBjfpCjftBjftBjflCjfpCjfpCjPpCjvpCjfpCjftCjftCjPpCjPpCjfpBjPpBjftCjfpCjftCjPpCjfpCjfpCjfpBjfpCjfpCjfqXXPJcAAAAN3RSTlMAAQEFBgcIDA0SHBwqLC0tLjA2PkFBR1hccHd5fJufqK6wt87X2Njh5OXp7O3u7u/v8PP3+Pr+o2px6wAAAHNJREFUCNdVx8cCwUAARdErYbToRBctugiD9/9/ZmGUnN1hkMTrtzjpwzngo3HySPm5mkxT16CbafMZVf7q33Ub5b9lJWkT1nOuM0nSvOg6lLQb13DtScdLFTh0AMqath5LINxba217UWCyLQEYY4wH4MMLT3UNYgPDWD4AAAAASUVORK5CYII="},"10e2":function(t,e,i){},1904:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABV0lEQVQ4T6WTMUvDUBDH//eGpn4OawpCJ110SvHpKHTQWRcFBcFPIggKuuisg+BYI+2ki50KQp/t57Dp8E4ufQkxsSnFLEfI3f/u/7sL4Z8P5ev9dtRiRWcEa4yuHst3PxzfMJRPli/NjveUrSkKhOMrgE5c0sjF5Wnka6Orp3MEog8AazOc9Yz21gsC9ddoj5kDhlolcFCGhUFdgv0kou5gy3uMLdTDyRuDNxbhSaD3ga5sxgICCaCjvAAR9mPnjIeiON8K5BSiH0ZDAA4WYNk2h9tLXSmsvXwHilQnIzIy2qvJe1ZgIMMkSdJdPMYWY0a/pjBGe/VUYJYFmUKSct1dj4yFlXDSmUc/z0C28aUrzSnEdtSCol2AGyU3kGj0AOrD8rNcZeESy6ZJus65xMkdwAcuybjo4NK90ZXDUgEhDqZzhu1nfyaCaoD4ItlMuq1Fru+v3B/CMIkRmm5zmAAAAABJRU5ErkJggg=="},"1c9b":function(t,e,i){"use strict";i.d(e,"a",(function(){return n})),i("99af"),i("7db0"),i("d81d");var a=i("5530"),n=function(t,e){return e&&Array.isArray(e.PartList)?t.map((function(t){var i=t.ApplyRange,n=t.Name,r="";if(i.PartID){var o=e.PartList.find((function(t){return t.ID===i.PartID}));o&&(r=o.Name)}else r="产品";var s=r?"".concat(n," [").concat(r,"]"):n;return Object(a.a)({},t,{ShowName:s,Count:0})})):t}},"266d":function(t,e,i){},3e3:function(t,e,i){"use strict";i.r(e);var a=(i("4de4"),i("7db0"),i("c740"),i("4160"),i("d81d"),i("b0c0"),i("d3b7"),i("3ca3"),i("159b"),i("ddb0"),i("96cf"),i("1da1")),n=i("3835"),r=i("5530"),o=i("2f62"),s=i("3eca"),c=i("dbbc"),l=i("2909"),u=i("ad32"),p={props:{visible:{type:Boolean,default:!1},saveData:{type:Object,default:null},rangeList:{type:Array,default:function(){return[]}},showGroup:{type:Boolean,default:!1}},components:{CommonDialogComp:u.a},computed:{GroupList:function(){var t=this;if(!this.showGroup)return[];var e=this.rangeList.find((function(e){return e.PartID===t.ruleForm.PartID}));return e?Object(l.a)(e.CraftGroupList):[]},curPartID:function(){return this.ruleForm.PartID}},data:function(){return{title:"添加费用",ruleForm:{ID:"",Name:"",PartID:"",GroupID:"",PriceID:"",CraftID:""},selectedGroupIDObj:{}}},methods:{onSubmit:function(){var t=this;return Object(a.a)(regeneratorRuntime.mark((function e(){var i,a,n,o,s,c,l,u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$refs.ruleForm.validate().catch((function(){}));case 2:i=e.sent,t.ruleForm.GroupID?(a=t.GroupList.find((function(e){return e.ID===t.ruleForm.GroupID})),t.ruleForm.CraftID=a?a.CraftID:""):t.ruleForm.CraftID="",n=t.ruleForm,o=n.CraftID,s=n.GroupID,c=n.PartID,l={CraftID:o,GroupID:s,PartID:c},delete(u=Object(r.a)({},t.ruleForm,{ApplyRange:l})).CraftID,delete u.GroupID,delete u.PartID,i&&t.$emit("submit",u);case 11:case"end":return e.stop()}}),e)})))()},onCancle:function(){this.$emit("update:visible",!1)},onOpen:function(){this.$nextTick(this.initEditData)},onClosed:function(){this.$refs.ruleForm.resetFields()},initEditData:function(){this.title=this.saveData.ID?"编辑费用":"添加费用",this.selectedGroupIDObj={},this.saveData&&this.saveData.GroupID&&(this.selectedGroupIDObj[this.saveData.PartID||"product"]=this.saveData.GroupID),this.ruleForm=Object(r.a)({},this.saveData)}},watch:{curPartID:function(t,e){var i=t||"product",a=e||"product";this.ruleForm.GroupID&&(this.selectedGroupIDObj[a]=this.ruleForm.GroupID),this.ruleForm.GroupID=this.selectedGroupIDObj[i]||""}}},m=(i("4b08"),i("2877")),d=Object(m.a)(p,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("CommonDialogComp",{staticClass:"mp-erp-comps-price-module-price-solution-item-save-dialog-comp-wrap",class:t.showGroup?"show-group":"",attrs:{width:"700px",top:"15vh",title:t.title,visible:t.visible},on:{"update:visible":function(e){t.visible=e},submit:t.onSubmit,cancle:t.onCancle,open:t.onOpen,closed:t.onClosed},scopedSlots:t._u([{key:"foot-tip",fn:function(){return[i("p",{staticClass:"tips-box is-pink"},[i("i",{staticClass:"el-icon-warning"}),i("span",[t._v("注：应用范围只能在添加时设定，")]),i("span",{staticClass:"is-bold"},[t._v("后期不能更改 ！")])])]},proxy:!0}])},[i("el-form",{ref:"ruleForm",attrs:{model:t.ruleForm,"label-width":"100px","hide-required-asterisk":""}},[i("el-form-item",{attrs:{label:"费用名称：",prop:"Name",rules:[{required:!0,message:"费用名称不能为空"}]}},[i("el-input",{attrs:{"show-word-limit":"",maxlength:"8",size:"small"},model:{value:t.ruleForm.Name,callback:function(e){t.$set(t.ruleForm,"Name","string"==typeof e?e.trim():e)},expression:"ruleForm.Name"}})],1),i("el-form-item",{attrs:{label:"应用范围："}},[i("el-radio-group",{attrs:{disabled:!(!t.saveData||!t.saveData.ID)},model:{value:t.ruleForm.PartID,callback:function(e){t.$set(t.ruleForm,"PartID",e)},expression:"ruleForm.PartID"}},t._l(t.rangeList,(function(e){return i("el-radio",{key:e.PartID||e.Name,attrs:{title:e.Name,label:e.PartID}},[t._v(t._s(e.Name))])})),1),i("p",{directives:[{name:"show",rawName:"v-show",value:t.GroupList.length>0,expression:"GroupList.length > 0"}]}),i("el-radio-group",{directives:[{name:"show",rawName:"v-show",value:t.GroupList.length>0,expression:"GroupList.length > 0"}],attrs:{disabled:!(!t.saveData||!t.saveData.ID)},model:{value:t.ruleForm.GroupID,callback:function(e){t.$set(t.ruleForm,"GroupID",e)},expression:"ruleForm.GroupID"}},t._l(t.GroupList,(function(e){return i("el-radio",{key:e.ID,attrs:{title:e.Name,label:e.ID}},[t._v(t._s(e.Name))])})),1)],1)],1)],1)}),[],!1,null,null,null).exports,f=(i("99af"),i("a15b"),i("53ca")),h=i("bc5c"),A=i("f7ec"),g={props:{type:{type:String,default:""},dataList:{type:Array,default:function(){return[]}},titleObj:{type:Object,default:null},loading:{type:Boolean,default:!1}},components:{CtrlMenus:h.a},computed:Object(r.a)({},Object(o.e)("priceManage",["MakeupControlTypeList","WastageRuleList","WastageUnitTypeList","WastageUnitList","PrintTimesRuleList","CuttingRuleList"]),{localTableData:function(){var t=this;return this.dataList&&Array.isArray(this.dataList)&&0!==this.dataList.length?this.dataList.map((function(e){return Object(r.a)({},e,{FilterTypeText:e.Constraint?1===e.Constraint.FilterType?"满足所有":"满足任一":"未知关系类型",result:t.getShowResult(e)})})):[]}}),data:function(){return{}},methods:{onSetupClick:function(t){this.$emit("setup",t)},onRemoveClick:function(t){var e=this;this.messageBox.warnCancelNullMsg("确定删除该条设置吗?",(function(){e.$emit("remove",t)}))},getShowResult:function(t){var e=this,i=this.MakeupControlTypeList.find((function(t){return t.ID===+e.type}));if(!i)return["未知结果"];if("尺寸数量"===i.Name){var a=t.LengthFormula,n=t.WidthFormula,r=t.DifferentContentFormula,o=t.PrintNumberFormula;if(t.MixtureID)return["允许混拼"];var c=function(t,i){var a=t.Value,n=t.FormulaName,r=t.Type,o=i;if(a||0===a)o+=a;else if(n){o+=n;var c=e.$utils.getNameFromListByIDs(r,s.c);c&&(o+=c)}else o+="未获取到";return o};return[c(a||{},"长："),c(n||{},"宽："),c(r||{},"纸张数量："),c(o||{},"印刷份数：")]}if("拼版幅面"===i.Name)return[t.BreadthList.map((function(t){var i=t.First,a=t.Second,n=e.$utils.getNameFromListByIDs(a,A.a).join("、");return"".concat(i.Name,"（").concat(n,"）")})).join("、")];if("拼版规则"===i.Name){var l=t.RuleList;if(!Array.isArray(l))return[""];var u=l.map((function(t){return"".concat(t.ColumnNumber,"列 X ").concat(t.RowNumber,"行")})).join("、");return["产品使用 ".concat(u," 进行拼版")]}if("拼版算法"===i.Name){var p=t.CuttingRule;if(!p&&0!==p)return[""];var m=this.$utils.getNameFromListByIDs(p,this.CuttingRuleList);return["".concat(this.titleObj.title,"使用：").concat(m,"算法")]}if("印刷次数"===i.Name){var d=t.PrintTimes;if(!d&&0!==d)return[""];var h=this.$utils.getNameFromListByIDs(d,this.PrintTimesRuleList);return["".concat(this.titleObj.title,"为：").concat(h)]}if("物料损耗"===i.Name){var g=t.Wastage;if("object"!==Object(f.a)(g))return[""];var C=g.Rule,v=g.Value,I=g.Unit,b=g.UnitType,D=this.$utils.getNameFromListByIDs(C,this.WastageRuleList),P=this.$utils.getNameFromListByIDs(I,this.WastageUnitList),S=this.$utils.getNameFromListByIDs(b,this.WastageUnitTypeList);return["".concat(D,"：").concat(v).concat(P,"（ ").concat(S," ）")]}return["其它类型，暂未生成对应结果"]}}},C=(i("a2dbd"),Object(m.a)(g,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("section",{staticClass:"mp-erp-price-module-makeup-ctrl-table-comp-container"},[t.titleObj?i("header",[i("span",{staticClass:"mp-common-title-wrap"},[t._v(t._s(t.titleObj.title))]),i("span",{staticClass:"blue-span",on:{click:function(e){return t.onSetupClick(null)}}},[t._v(t._s(t.titleObj.btnText))]),t._t("title")],2):t._e(),i("main",[t._l(t.localTableData,(function(e){return i("div",{key:e.ID},[i("div",{staticClass:"condition"},[i("el-tooltip",{attrs:{effect:"light","popper-class":"common-property-condition-text-tips-box",placement:"bottom-start","visible-arrow":!1}},[i("div",{attrs:{slot:"content"},slot:"content"},[i("p",{staticClass:"if-box"},[i("span",{staticClass:"is-origin"},[t._v("如果")]),t._v(" "+t._s(e.FilterTypeText)+"：")]),Array.isArray(e._ConditionText)?t._l(e._ConditionText,(function(a,n){return i("p",{key:a.name+"tips"+n},[n>0?i("span",{staticClass:"type"},[t._v(t._s(1===e.Constraint.FilterType?"且":"或"))]):t._e(),i("span",{staticClass:"name"},[t._v(t._s(a.name))]),i("span",{staticClass:"is-origin"},[t._v(t._s(a.operator))]),i("span",{staticClass:"val"},[t._v(t._s(a.val))]),n===e._ConditionText.length-1?i("span",{staticStyle:{"margin-left":"2px"}},[t._v(" 。")]):i("span",{staticStyle:{"margin-left":"2px"}},[t._v("；")])])})):i("p",[t._v(t._s(e._ConditionText))]),i("p",{staticClass:"if-box",staticStyle:{"margin-right":"5px"}},[i("span",{staticClass:"is-origin"},[t._v(t._s("1"===t.type?"使用":"则"))])]),t._l(e.result.filter((function(t){return t})),(function(e,a){return i("p",{key:e+a},[t._v(t._s(e))])}))],2),i("div",{staticClass:"common-property-condition-text-content-box"},[i("p",{staticClass:"if-box"},[i("span",{staticClass:"is-origin"},[t._v("如果")]),t._v(" "+t._s(e.FilterTypeText))]),Array.isArray(e._ConditionText)?t._l(e._ConditionText,(function(a,n){return i("p",{key:a.name+"content"+n},[n>0?i("span",{staticClass:"type"},[t._v(t._s(1===e.Constraint.FilterType?"且":"或"))]):t._e(),i("span",[t._v(t._s(a.name))]),i("span",[t._v(t._s(a.operator))]),i("span",[t._v(t._s(a.val))])])})):i("p",[t._v(t._s(e._ConditionText))]),i("p",{staticClass:"if-box",staticStyle:{"margin-left":"10px","margin-right":"5px"}},[i("span",{staticClass:"is-origin"},[t._v(t._s("1"===t.type?"使用":"则"))])]),i("p",t._l(e.result.filter((function(t){return t})),(function(a,n){return i("em",{key:a+n,staticStyle:{"margin-right":"4px"}},[t._v(t._s(a)+" "),n<e.result.length-1?i("i",{staticStyle:{color:"#33BBD5","font-weight":"700","font-size":"13px"}},[t._v("；")]):t._e()])})),0)],2)])],1),i("span",{staticClass:"priority-box"},[t._v("优先级："+t._s(e.Priority))]),i("CtrlMenus",{on:{edit:function(i){return t.onSetupClick(e)},remove:function(i){return t.onRemoveClick(e)}}})],1)})),0===t.localTableData.length?i("div",[i("span",{staticStyle:{"margin-left":"25px",color:"#a2a2a2"}},[t._v(t._s(t.loading?"加载中":"暂无数据"))])]):t._e()],2)])}),[],!1,null,null,null)).exports,v=i("1c9b"),I={name:"CompositionCostOfCraft",components:{TopRadioButtonComp:c.a,CraftPriceTitleItemSaveDialog:d,PriceTableComp:C},computed:Object(r.a)({},Object(o.e)("priceManage",["curCraftPriceItemData","curPriceItem","PriceManageList","PriceTableList","PriceTableConditionPropertyList"]),{curProduct:function(){var t=this;return this.PriceManageList.find((function(e){return e.ID===t.ProductID}))},curPartName:function(){var t=this;if(this.isQuotationPage||!this.curCraftPriceItemData||!this.ProductData)return"";if(!this.curCraftPriceItemData.PartID)return"产品本身";var e=this.ProductData.PartList.find((function(e){return e.ID===t.curCraftPriceItemData.PartID}));return e?e.Name:""},curCraft:function(){return this.curCraftPriceItemData&&this.curCraftPriceItemData.Craft||{}},rangeList:function(){var t=this;if(!this.ProductData)return[];var e=[],i={PartID:"",Name:"产品",CraftGroupList:this.getCraftGroupList(this.ProductData.CraftList)};return e.push(i),Array.isArray(this.ProductData.PartList)&&this.ProductData.PartList.forEach((function(i){var a=i.ID,n=i.Name,r=i.CraftList,o={PartID:a,Name:n,CraftGroupList:t.getCraftGroupList(r)};e.push(o)})),e},SolutionList:function(){var t=this;if(!this.curPriceItem)return[];if(this.isQuotationPage)return Object(v.a)(this.curPriceItem.PriceTableList,this.ProductData)||[];if(!this.CraftPriceID||!Array.isArray(this.curPriceItem.CraftPriceList))return[];var e=this.curPriceItem.CraftPriceList.find((function(e){return e.ID===t.CraftPriceID}));return e?Object(v.a)(e.PriceTableList,this.ProductData):[]},curSolutionItem:function(){var t=this;return this.SolutionID?this.SolutionList.find((function(e){return e.ID===t.SolutionID})):null},tableDataList:function(){if(!Array.isArray(this.PriceTableList)||0===this.PriceTableList.length)return[];var t=this.PriceTableConditionPropertyList;return JSON.parse(JSON.stringify(this.PriceTableList)).map((function(e){var i=e.Constraint,a=s.d.getConstraintAndTextByImperfectConstraint(i,t),o=Object(n.a)(a,2),c=o[0],l=o[1];return Object(r.a)({},e,{Constraint:c,_ConditionText:l})}))}}),data:function(){return{SolutionID:"",PriceID:"",PriceName:"",ProductID:"",ProductName:"",CraftPriceID:"",visible:!1,saveData:null,ProductData:null,isQuotationPage:!1,canLoadContentTableData:!0,isTableLoading:!1}},methods:{onGoBackClick:function(){this.$goback()},onRemoveClick:function(){var t=this;this.messageBox.warnCancelBox("确定要删除当前方案吗","方案名称：[ ".concat(this.curSolutionItem?this.curSolutionItem.Name:"未知方案名称"," ]"),(function(){t.getPriceSolutionRemove()}))},onItemSaveClick:function(t){var e=t?this.SolutionList.find((function(e){return e.ID===t})):null,i="",a="",n="";e&&e.ApplyRange&&(i=e.ApplyRange.PartID||"",a=e.ApplyRange.CraftID||"",n=e.ApplyRange.GroupID||"");var r={ID:e?e.ID:"",Name:e?e.Name:"",CraftPriceID:this.isQuotationPage?"":this.CraftPriceID,PriceID:this.PriceID,PartID:i,CraftID:a,GroupID:n};this.saveData=r,this.visible=!0},handleDialogSubmit:function(t){var e=this;return Object(a.a)(regeneratorRuntime.mark((function i(){var a,n,r;return regeneratorRuntime.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(!(a=e.SolutionList.find((function(e){return e.Name===t.Name&&(e.ApplyRange.PartID===t.ApplyRange.PartID||!e.ApplyRange.PartID&&!t.ApplyRange.PartID)})))){i.next=4;break}return a.ID===t.ID?e.messageBox.failSingleError("保存失败","方案名称未发生更改"):e.messageBox.failSingleError("保存失败","存在相同的方案名称且应用的部件相同"),i.abrupt("return");case 4:return i.next=6,e.api.getPriceSolutionSave(t).catch((function(){}));case 6:(n=i.sent)&&1e3===n.data.Status&&(r=function(){e.$store.commit("priceManage/setPriceItemSolutionItemChange",[e.ProductID,e.PriceID,t,n.data.Data,e.isQuotationPage,e.CraftPriceID]),e.visible=!1,1!==e.SolutionList.length||e.SolutionID||(e.canLoadContentTableData=!1)},e.messageBox.successSingle("保存成功",r,r));case 8:case"end":return i.stop()}}),i)})))()},getProductData:function(){var t=this;return Object(a.a)(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("priceManage/getProductCraftData",t.ProductID);case 2:i=e.sent,t.ProductData=i;case 4:case"end":return e.stop()}}),e)})))()},getCraftGroupList:function(t){if(!Array.isArray(t))return[];var e=[];return t.forEach((function(t){Array.isArray(t.GroupList)&&t.GroupList.forEach((function(i){var a=i.UseTimes;a&&a.MaxValue>1&&e.push(Object(r.a)({},i,{CraftID:t.ID}))}))})),e},getPriceSolutionRemove:function(){var t=this;return Object(a.a)(regeneratorRuntime.mark((function e(){var i,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.api.getPriceSolutionRemove(t.SolutionID).catch((function(){}));case 2:i=e.sent,a=function(){t.SolutionList.findIndex((function(e){return e.ID===t.SolutionID}))>-1&&(t.$store.commit("priceManage/setPriceItemSolutionItemRemove",[t.ProductID,t.PriceID,t.SolutionID,t.isQuotationPage,t.CraftPriceID]),t.SolutionList.length>0?t.SolutionID=t.SolutionList[0].ID:t.SolutionID="")},i&&1e3===i.data.Status?t.messageBox.successSingle("删除成功",a,a):i&&1004===i.data.Status&&a();case 5:case"end":return e.stop()}}),e)})))()},getPriceTableList:function(){var t=this;return Object(a.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.SolutionID){e.next=2;break}return e.abrupt("return");case 2:return t.isTableLoading=!0,e.next=5,Promise.all([t.$store.dispatch("priceManage/getPriceTableList",t.SolutionID)]);case 5:t.isTableLoading=!1;case 6:case"end":return e.stop()}}),e)})))()},onTableItemRemove:function(t){var e=this;return Object(a.a)(regeneratorRuntime.mark((function i(){var a,n;return regeneratorRuntime.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(t&&t.ID){i.next=2;break}return i.abrupt("return");case 2:return i.next=4,e.api.getMakeupSolutionItemRemove(t.ID).catch((function(){}));case 4:(a=i.sent)&&1e3===a.data.Status&&(n=function(){e.MakeupRuleItemList=e.MakeupRuleItemList.filter((function(e){return e.ID!==t.ID}))},e.messageBox.successSingle("删除成功",n,n));case 6:case"end":return i.stop()}}),i)})))()},onSetupPageJump:function(t){var e=this.isQuotationPage?"QuotationPriceTableItemSet":"CraftPriceTableItemSet",i=this.$route.params;this.$store.commit("priceManage/setCurSolutionItem",this.curSolutionItem),this.$store.commit("priceManage/setCurEditPriceItemData",t),this.$router.push({name:e,params:i})}},watch:{SolutionList:function(t,e){t.length>0&&0===e.length&&!this.SolutionID&&(this.SolutionID=t[0].ID)},SolutionID:function(t){t&&(this.canLoadContentTableData?this.getPriceTableList():this.canLoadContentTableData=!0)}},mounted:function(){var t=this.$route.params.isQuotation;if(t||this.curPriceItem&&this.curCraftPriceItemData&&this.curCraftPriceItemData.Craft){var e=this.curPriceItem,i=e.ID,a=e.Name;this.PriceID=i,this.PriceName=a,this.ProductID=this.$route.params.id,this.ProductName=this.$route.params.name,t&&(this.isQuotationPage=t),t||(this.CraftPriceID=this.curCraftPriceItemData.Craft.CraftPriceID),this.getProductData(),this.$store.dispatch("priceManage/getPriceTablePropertyLists",this.ProductID)}else this.$goback()}},b=(i("c4d7"),Object(m.a)(I,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("section",{staticClass:"mp-erp-price-module-craft-price-cost-composition-set-page-wrap"},[i("header",[i("span",[t._v("当前产品：")]),i("span",[t._v(t._s(t.ProductName))]),t.curPartName?i("span",{staticClass:"name"},[t._v("当前部件："+t._s(t.curPartName))]):t._e(),i("span",{staticClass:"name"},[t._v("价格名称："+t._s(t.PriceName))]),t.isQuotationPage?t._e():i("span",{staticClass:"name"},[t._v("设置工艺："+t._s(t.curCraft.Name))]),i("TopRadioButtonComp",{attrs:{title:"费用",list:t.SolutionList,loading:!1},on:{remove:t.onRemoveClick,itemSave:t.onItemSaveClick},model:{value:t.SolutionID,callback:function(e){t.SolutionID=e},expression:"SolutionID"}})],1),i("main",[i("PriceTableComp",{attrs:{titleObj:{title:"费用表",btnText:"+ 添加费用表"},loading:t.isTableLoading,dataList:t.tableDataList},on:{remove:t.onTableItemRemove,setup:function(e){return t.onSetupPageJump(e,"","")}}}),i("CraftPriceTitleItemSaveDialog",{attrs:{showGroup:!t.isQuotationPage,visible:t.visible,rangeList:t.rangeList,saveData:t.saveData},on:{"update:visible":function(e){t.visible=e},submit:t.handleDialogSubmit}})],1),i("footer",[i("el-button",{on:{click:t.onGoBackClick}},[i("i",{staticClass:"el-icon-d-arrow-left"}),t._v(" 返回")])],1)])}),[],!1,null,null,null));e.default=b.exports},"3a48":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJBRURDM0JEQkI3QjExRUFCRkM4OTA5RkY4QTEzM0VFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJBRURDM0JFQkI3QjExRUFCRkM4OTA5RkY4QTEzM0VFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkFFREMzQkJCQjdCMTFFQUJGQzg5MDlGRjhBMTMzRUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkFFREMzQkNCQjdCMTFFQUJGQzg5MDlGRjhBMTMzRUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4rxy6UAAAAy0lEQVR42mJgIAKwbf5pDsQPQTRMjJEITSxA6h4QywLxJyB2++XLfpKJkE1AagcQZ0E18QHxLpA4CwFNu6CKxYE4GoiXQvlLmYnQBAJiQKwHtRkkF8hIhCZksBvoPzcQg4kETW+AuBgjVInQ5AS07TJMANnG2cRqgmsE2rYfSNUD8VNiNIGdCtSkAKTvQxWlAfFkIJbGpwlmoyeULQLEs4A4F4jP4NMEAqAE4I7EB2lOAWowJZQUQRoNgHgVEG8H4p1ATc+JSfgAAQYARRBJE7ECLWIAAAAASUVORK5CYII="},"468e":function(t,e,i){"use strict";var a=i("4aae");i.n(a).a},"4aae":function(t,e,i){},"4b08":function(t,e,i){"use strict";var a=i("e75c");i.n(a).a},"6e30":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3NDlERTgxNzdEMTExRUFCREM5RjNGQzRGRkFBQ0U4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3NDlERTgyNzdEMTExRUFCREM5RjNGQzRGRkFBQ0U4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjc0OURFN0Y3N0QxMTFFQUJEQzlGM0ZDNEZGQUFDRTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc0OURFODA3N0QxMTFFQUJEQzlGM0ZDNEZGQUFDRTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7W2NX3AAACRUlEQVR42mxSS2tTQRQ+Z2buKze1MSWpfWB9IAUFFy5EEAT3/gH/gktBxYVb/4GK2I0WYkFw7cqtuOrChRJqMJioTXLbYtPcx9yZ45kkS4cL98zcb873OBdvdtpwCFW4FnyFTrF+65veeBBjXicASq2fXfR/Pr8afHn/Kb0BDTkCVcEU+qYBu+kmjClqMa6tSX4EtxA2e+VyK7NBeGwX4ILXBVWSXDuy8aMRLVZCzNc8sB8s4MChPTRhTkHQLs/uKLIHKfkvcbk9tiMbYygIiHUg0rQ1M/GDMGMiyKyAupwA1tr53SVx3GUmOUP9b/FNRJuRfwpv/9iNvutzTyTYCn+w3NMyQsyR05q7CA0qX5HJMzU0jYd9U3vsoUPRVAx7gJLfvtuzHE0CSr4Vol5VEwr7Vb5fw5P7LLaXgr8VYf6U0+smdvGFD+W9WGTqtz39piDVER6YgeEOVZy0YszecT05I5JXV4K9HZY4ZtDbCItt506BORA+FkMnRGJ5XaEG1ioR6DyfKUNSucROKLjsMAKpJwSYERfAGTcNuxCcrfNgXY2z0AzIBuKUYSD4cMgJQUZRoyRvPgeYA3l4bN8H3XRMHEoiAiyOXPwKymaEmcvFKjQTPi95QwJdsrDgMBJNolgvdzE8lOCSZDk+FLRvliq6kCpAjZoUjCHckFM+GKnMRm72e3+pcie1QcrywoGpff5j6pr/rbAElRY2DjnqMU/IiHX1C1bU/ms2at1suI9maulhybXUbD90ETTF4daqSOCfAAMArfYZ68CyjZgAAAAASUVORK5CYII="},"855c":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAMAAAAs2N9uAAAAAXNSR0IArs4c6QAAAThQTFRFAAAAAAD/AID/Var/QID/SZL/QID/OY7/M5n/Lov/RovoRov/RIj/QI//PJb/OY7xOY7/PYb/Oov/Q5D/QIr0PY//QIf3RI/4Qor4QIz/QI36P4v7Q4/7Qo37QIz7Qoz7Qov3QY37QYz7QIr4QI38P4v8QY78QIz8QYz8QY38Qo35QI38Q478Qoz5QI76Qoz6Qo36QYz6QI36QY76QI36Q436Qo36QY37QI34Qo37QY35QYz5Qoz6Qoz6QY36Qoz6Qo36QYz6QYz5QY35QY36Qo37Qo37QY37Qo37Qo36Qoz6Qo77QY36Qoz7QY36Qo36QYz6QY36Qoz6Qo35Qoz6Qoz7Qo35Qo37QY36Qo36Qo37Qo37Qoz6Qo36QY36Qo36Qo36Qo36Qoz6Qo36QY36Qo36QY36Qo36uDprygAAAGd0Uk5TAAECAwQHCAkKCwsLDxAREhIVFhcYGSAiIyg4OTk6PD5CQ0dITE1PUFJTVVdYWWNkZWZnamtrcHJ0iImKjJCRl5udqKioqq+wsbq9vcPGy8zP09jZ2uPk6Orr6+/w8PLz9PX3+fr6/noFHYEAAADHSURBVBgZBcEFQgIAEACwqdiN2N3d3R0oAnYH1v3/B25A3046c7RUD0D7ZcTj3U+8rwB0vH1vtlI5eR17QPLhpQsoO4lVsBtDRvZLDB4rvfpsRHXhnObbg4HCLNOxVkV/zFHb+/y30ZIY/4qbjwkz0cNpRESM1mQjsjVmoofy1EIu1VSkNp9voD/mOYuIiDESCVQXLqhILeRSTcUAuzGMzm0AJB9eu4FEEUDH2/dWG5VTN+sA2i8jnu5/430ZAH076czhYh3wDwXDJi2g2fGvAAAAAElFTkSuQmCC"},"8c7b":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAABFElEQVQ4T72TsUoDQRCGv39OL1FQxMIqXSABsbFQ1AfIk4gIqXwB0ScQweewsxAClmKnpWgjBts0IonxdmQDWlxyyWHhVruzs9/s/vOvyI1GZ3AKHOfjE9eiq3FA/wDXEVaM8OCrktZihurXgw0Sr5WqCFhmvWE6/5Bmnz2gqkZn0AcqZQEx74u0mTC8E74SAV5w+MWhJkjy+x60iXEzFRCwPSOcA1t/A3i2K82dCd/5J4DrIlO4+qnmXrm17KNOYssxZqYFd10KqhM1cNHF9fwLwNuG2g7ro37ji8B2nJcTcaYG4RDZUmEbwwzAUyu9H92s0AceTpDtA2MujU+YDZhizRyg/woq/ReAd4W0+djSW6zxDTChl/pgNivTAAAAAElFTkSuQmCC"},a2dbd:function(t,e,i){"use strict";var a=i("266d");i.n(a).a},ad32:function(t,e,i){"use strict";var a={model:{prop:"value",event:"change"},props:{visible:{type:Boolean,default:!1},title:{type:String,default:"提示"},width:{default:"30%"},top:{type:String,default:"15vh"},showSubmit:{type:Boolean,default:!0},submitText:{type:String,default:"保存"},dangerText:{type:String,default:"重新生成"},cancelText:{type:String,default:"取消"},disabled:{type:Boolean,default:!1},showDanger:{type:Boolean,default:!1},loading:{type:Boolean,default:!1}},computed:{dialogVisible:{get:function(){return this.visible},set:function(t){this.$emit("update:visible",t)}}},data:function(){return{checkList:[]}},methods:{onCancleClick:function(){this.$emit("cancle")},onSubmitClick:function(t){this.dialogVisible&&("BUTTON"===t.target.nodeName?t.target.blur():"BUTTON"===t.target.parentNode.nodeName&&t.target.parentNode.blur(),this.$emit("submit"))},onDangerClick:function(){this.$emit("danger")},onOpen:function(){this.$emit("open")},onOpened:function(){this.$emit("opened")},onClose:function(){this.$emit("close")},onClosed:function(){this.$emit("closed")}}},n=(i("468e"),i("2877")),r=Object(n.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],staticClass:"mp-img-style-header mp-erp-common-dialog-comp-wrap",attrs:{title:t.title,visible:t.dialogVisible,"close-on-click-modal":!1,width:t.width,top:t.top,modal:!1,"before-close":t.onCancleClick},on:{"update:visible":function(e){t.dialogVisible=e},open:t.onOpen,opened:t.onOpened,close:t.onClose,closed:t.onClosed}},[t._t("default"),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t.$slots["foot-tip"]?i("div",[t._t("foot-tip")],2):t._e(),i("p",[t.showSubmit?i("el-button",{attrs:{type:"primary",loading:t.loading,disabled:t.disabled},on:{click:t.onSubmitClick}},[t._v(t._s(t.loading?"加载中":t.submitText))]):t._e(),t.showDanger?i("el-button",{attrs:{type:"danger"},on:{click:t.onDangerClick}},[t._v(t._s(t.dangerText))]):t._e(),i("el-button",{on:{click:t.onCancleClick}},[t._v(t._s(t.cancelText))])],1)])],2)}),[],!1,null,null,null);e.a=r.exports},b355:function(t,e,i){},bc5c:function(t,e,i){"use strict";var a={props:{canEdit:{type:Boolean,default:!0},canRemove:{type:Boolean,default:!0},canCopy:{type:Boolean,default:!0},canSelect:{type:Boolean,default:!0},canSetupCost:{type:Boolean,default:!0},canAllCost:{type:Boolean,default:!0},showList:{type:Array,default:function(){return["edit","del"]}}},methods:{onEditClick:function(){this.canEdit&&this.$emit("edit")},onRemoveClick:function(){this.canRemove&&this.$emit("remove")},onCopyClick:function(){this.canCopy&&this.$emit("copy")},onSelectClick:function(){this.canSelect&&this.$emit("select")},onAllCostClick:function(){this.canAllCost&&this.$emit("allCost")},onSetupCostClick:function(){this.canSetupCost&&this.$emit("setupCost")}}},n=(i("fe9a"),i("2877")),r=Object(n.a)(a,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ctrl-menus-container"},[t.showList.includes("copy")?a("span",{class:t.canCopy?"":"disabled",on:{click:t.onCopyClick}},[a("img",{attrs:{src:i("8c7b"),alt:""}}),a("i",[t._v("拷贝")])]):t._e(),t.showList.includes("select")?a("span",{class:t.canSelect?"":"disabled",on:{click:t.onSelectClick}},[a("img",{attrs:{src:i("0eb9"),alt:""}}),a("i",[t._v("选择")])]):t._e(),t.showList.includes("edit")?a("span",{class:t.canEdit?"":"disabled",on:{click:t.onEditClick}},[a("img",{attrs:{src:i("3a48"),alt:""}}),a("i",[t._v("编辑")])]):t._e(),t.showList.includes("del")?a("span",{class:t.canRemove?"":"disabled",on:{click:t.onRemoveClick}},[a("img",{attrs:{src:i("6e30"),alt:""}}),a("i",[t._v("删除")])]):t._e(),t.showList.includes("setupCost")?a("span",{class:t.canSetupCost?"":"disabled",on:{click:t.onSetupCostClick}},[a("img",{attrs:{src:i("1904"),alt:""}}),a("i",[t._v("设置费用组成")])]):t._e(),t.showList.includes("allCost")?a("span",{class:t.canAllCost?"":"disabled",on:{click:t.onAllCostClick}},[a("img",{attrs:{src:i("855c"),alt:""}}),a("i",[t._v("总费用")])]):t._e()])}),[],!1,null,null,null);e.a=r.exports},c4d7:function(t,e,i){"use strict";var a=i("0571");i.n(a).a},dbbc:function(t,e,i){"use strict";var a={model:{prop:"value",event:"change"},props:{title:{type:String,default:"方案"},list:{type:Array,default:function(){return[]}},loading:{type:Boolean,default:!1},value:{}},computed:{radio:{get:function(){return this.value},set:function(t){this.$emit("change",t)}}},methods:{onRemoveClick:function(){this.$emit("remove")},onItemSaveClick:function(t){this.$emit("itemSave",t)}}},n=(i("e04b"),i("2877")),r=Object(n.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mp-erp-common-comps-top-radio-button-comp-wrap"},[t.loading?i("span",{staticClass:"is-font-size-12 is-gray"},[t._v(" "+t._s(t.title)+"加载中...")]):i("el-scrollbar",{attrs:{"wrap-class":"scrollbar-wrapper"}},[i("el-radio-group",{attrs:{size:"small"},model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},t._l(t.list,(function(e){return i("el-radio-button",{key:e.ID,attrs:{label:e.ID}},[t._v(t._s(e.ShowName?e.ShowName+"（"+e.Count+"）":e.Name))])})),1)],1),t.loading||0!==t.list.length?t._e():i("span",{staticClass:"is-font-size-12 is-gray"},[t._v("该分类尚无"+t._s(t.title)+"，请添加")]),i("span",{staticClass:"blue-span",on:{click:function(e){return t.onItemSaveClick(null)}}},[t._v("+添加"+t._s(t.title))]),t.radio?i("div",{staticClass:"menus"},[i("span",{staticClass:"blue-span",on:{click:function(e){return t.onItemSaveClick(t.radio)}}},[t._v("编辑当前"+t._s(t.title)+"名称")]),i("span",{staticClass:"red-span",on:{click:t.onRemoveClick}},[t._v("删除当前"+t._s(t.title))])]):t._e()],1)}),[],!1,null,null,null);e.a=r.exports},e04b:function(t,e,i){"use strict";var a=i("b355");i.n(a).a},e75c:function(t,e,i){},f7ec:function(t,e,i){"use strict";i.d(e,"a",(function(){return o})),i.d(e,"b",(function(){return c})),i("4de4"),i("7db0"),i("4160"),i("d81d"),i("d3b7"),i("25f0"),i("159b");var a=i("d4ec"),n=i("bee2"),r=i("ade3"),o=[{ID:1,Name:"正翻版",key:"zhengFan"},{ID:2,Name:"自翻版",key:"ziFan"},{ID:4,Name:"天地翻",key:"tianDiFan"}],s=function(){return o.map((function(t){return{checked:!1,Mode:t.ID,WhiteEdge:{Length:"",Width:""},key:t.key,Name:t.Name}}))},c=function(){function t(e){var i=this;if(Object(a.a)(this,t),Object(r.a)(this,"ID",""),Object(r.a)(this,"Name",""),Object(r.a)(this,"MinMaterialSize",{Length:"",Width:""}),Object(r.a)(this,"MaxMaterialSize",{Length:"",Width:""}),Object(r.a)(this,"Class",""),Object(r.a)(this,"ModeList",s()),e&&"[object Object]"===Object.prototype.toString.call(e)){var n=JSON.parse(JSON.stringify(e)),o=n.ID,c=n.Name,l=n.MinMaterialSize,u=n.MaxMaterialSize,p=n.Class,m=n.ModeList;o&&(this.ID=o),c&&(this.Name=c),l&&(this.MinMaterialSize=l),u&&(this.MaxMaterialSize=u),p&&(this.Class=p),m&&m.length>0&&m.forEach((function(t){var e=i.ModeList.find((function(e){return t.Mode===e.Mode}));e&&(e.checked=!0,e.WhiteEdge=t.WhiteEdge)}))}}return Object(n.a)(t,null,[{key:"formatSubmit",value:function(t){var e=JSON.parse(JSON.stringify(t));return e.ModeList=e.ModeList.filter((function(t){return t.checked})).map((function(t){return{Mode:t.Mode,WhiteEdge:t.WhiteEdge}})),e}}]),t}()},fe9a:function(t,e,i){"use strict";var a=i("10e2");i.n(a).a}}]);