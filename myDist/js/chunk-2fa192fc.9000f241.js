(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2fa192fc"],{"0a1e":function(e,t,l){"use strict";var i=l("e57c");l.n(i).a},"327e":function(e,t,l){"use strict";var i=l("903f");l.n(i).a},"468e":function(e,t,l){"use strict";var i=l("4aae");l.n(i).a},"4aae":function(e,t,l){},"75d5":function(e,t,l){},"8e6e":function(e,t,l){"use strict";var i=l("dc48");l.n(i).a},"903f":function(e,t,l){},ad32:function(e,t,l){"use strict";var i={model:{prop:"value",event:"change"},props:{visible:{type:Boolean,default:!1},title:{type:String,default:"提示"},width:{default:"30%"},top:{type:String,default:"15vh"},showSubmit:{type:Boolean,default:!0},submitText:{type:String,default:"保存"},dangerText:{type:String,default:"重新生成"},cancelText:{type:String,default:"取消"},disabled:{type:Boolean,default:!1},showDanger:{type:Boolean,default:!1}},computed:{dialogVisible:{get:function(){return this.visible},set:function(e){this.$emit("update:visible",e)}}},data:function(){return{checkList:[]}},methods:{onCancleClick:function(){this.$emit("cancle")},onSubmitClick:function(){this.dialogVisible&&this.$emit("submit")},onDangerClick:function(){this.$emit("danger")},onOpen:function(){this.$emit("open")},onOpened:function(){this.$emit("opened")},onClose:function(){this.$emit("close")},onClosed:function(){this.$emit("closed")}}},n=(l("468e"),l("2877")),a=Object(n.a)(i,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],staticClass:"mp-img-style-header mp-erp-common-dialog-comp-wrap",attrs:{title:e.title,visible:e.dialogVisible,"close-on-click-modal":!1,width:e.width,top:e.top,modal:!1,"before-close":e.onCancleClick},on:{"update:visible":function(t){e.dialogVisible=t},open:e.onOpen,opened:e.onOpened,close:e.onClose,closed:e.onClosed}},[e._t("default"),l("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e.showSubmit?l("el-button",{attrs:{type:"primary",disabled:e.disabled},on:{click:e.onSubmitClick}},[e._v(e._s(e.submitText))]):e._e(),e.showDanger?l("el-button",{attrs:{type:"danger"},on:{click:e.onDangerClick}},[e._v(e._s(e.dangerText))]):e._e(),l("el-button",{on:{click:e.onCancleClick}},[e._v(e._s(e.cancelText))])],1)],2)}),[],!1,null,null,null);t.a=a.exports},c209:function(e,t,l){"use strict";var i=l("c6ab"),n={props:{title:{type:String,default:""},level1Options:{type:Array,default:function(){return[]}},level2Options:{type:Array,default:function(){return[]}},defaultProps:{type:Object,default:function(){return{label:"Name",value:"ID"}}},lv2DefaultProps:{type:Object,default:null},value:{type:Object,default:function(){return{level1Val:"",level2Val:""}}},isAssociated:{type:Boolean,default:!0}},model:{prop:"value",event:"change"},components:{SelectComp:i.a},computed:{level1:{get:function(){return this.value.level1Val},set:function(e){this.value.level1Val!==e&&this.$emit("change",{level1Val:e,level2Val:this.isAssociated?"":this.level2})}},level2:{get:function(){return this.value.level2Val},set:function(e){this.$emit("change",{level1Val:this.level1,level2Val:e})}}}},a=(l("0a1e"),l("2877")),r=Object(a.a)(n,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("ul",{staticClass:"mp-erp-common-select-comps-two-level-select-comp-wrap"},[e.title?l("li",{staticClass:"text"},[l("span",[e._v(e._s(e.title)+"：")])]):e._e(),l("li",{staticClass:"first-select-box"},[l("SelectComp",{attrs:{options:e.level1Options,defaultProps:e.defaultProps},model:{value:e.level1,callback:function(t){e.level1=t},expression:"level1"}})],1),l("li",[l("SelectComp",{attrs:{options:e.level2Options,defaultProps:e.lv2DefaultProps||e.defaultProps},model:{value:e.level2,callback:function(t){e.level2=t},expression:"level2"}})],1)])}),[],!1,null,null,null);t.a=r.exports},c6ab:function(e,t,l){"use strict";var i={props:{value:{default:"不限"},options:{type:Array,default:function(){return[{value:"",label:"不限"}]}},defaultProps:{type:Object,default:function(){return{label:"label",value:"value"}}},filterable:{type:Boolean,default:!1}},model:{prop:"value",event:"change"},computed:{result:{get:function(){return this.value},set:function(e){e!==this.value&&this.$emit("change",e)}}}},n=(l("8e6e"),l("2877")),a=Object(n.a)(i,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-select",{staticClass:"mp-erp-new-common-select-comp-wrap",attrs:{filterable:e.filterable,size:"small"},model:{value:e.result,callback:function(t){e.result=t},expression:"result"}},e._l(e.options,(function(t){return l("el-option",{key:t.value,attrs:{label:t[e.defaultProps.label],value:t[e.defaultProps.value]}})})),1)}),[],!1,null,null,null);t.a=a.exports},d76a:function(e,t,l){"use strict";l.r(t);var i=(l("99af"),l("4de4"),l("7db0"),l("caad"),l("2532"),l("96cf"),l("1da1")),n=l("5530"),a={props:{filterWords:{}},data:function(){return{keyWord:""}},methods:{onClick:function(){this.$emit("onFactoryAddClick")},onFilterClick:function(e){e&&"clear"===e?this.$emit("onFilterClick",""):this.$emit("onFilterClick",this.keyWord)}},watch:{filterWords:{handler:function(e){e!==this.keyWord&&(this.keyWord=e)},immediate:!0}}},r=l("2877"),o=Object(r.a)(a,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("header",[l("el-button",{staticClass:"blue-full-color-btn-styles is-blue-button",attrs:{type:"primary"},on:{click:e.onClick}},[e._v("添加生产工厂")]),l("div",{staticClass:"input-box"},[l("el-input",{attrs:{placeholder:"请输入搜索关键字"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onFilterClick(t)}},model:{value:e.keyWord,callback:function(t){e.keyWord="string"==typeof t?t.trim():t},expression:"keyWord"}}),l("el-button",{attrs:{type:"primary"},on:{click:e.onFilterClick}},[e._v("筛选")]),l("span",{staticClass:"blue-span",on:{click:function(t){return e.onFilterClick("clear")}}},[e._v("清除筛选项")])],1)],1)}),[],!1,null,null,null).exports,s=l("2af0"),c={props:{dataList:{default:function(){return[]},type:Array},filterWords:{},getAddName:{type:Function,default:function(){}}},mixins:[s.a],data:function(){return{search:""}},methods:{setHeight:function(){var e=this.getHeight("",105);this.h=e},onEditClick:function(e){this.$emit("handleAddressItemEdit",e)},onRemoveClick:function(e){this.$emit("handleAddressItemRemove",e)}}},u=(l("327e"),Object(r.a)(c,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-table",{staticClass:"mp-erp-factory-manage-page-table-comp-wrap",staticStyle:{width:"100%"},attrs:{"max-height":e.h,height:e.h,data:e.dataList,stripe:"",border:"",fit:""}},[l("el-table-column",{attrs:{prop:"FactoryName",label:"工厂名称","min-width":"160"}}),l("el-table-column",{attrs:{prop:"Address",label:"工厂地址","min-width":"360"},scopedSlots:e._u([{key:"default",fn:function(t){return l("span",{staticClass:"is-gray"},[e._v(e._s(e.getAddName(t.row)))])}}])}),l("el-table-column",{attrs:{prop:"LinkMan",label:"联系人","min-width":"130"}}),l("el-table-column",{attrs:{prop:"Mobile",label:"联系电话","min-width":"130"}}),l("el-table-column",{attrs:{label:"操作",width:"320"},scopedSlots:e._u([{key:"default",fn:function(t){return l("div",{staticClass:"menu-list"},[l("span",{on:{click:function(l){return e.onEditClick(t.row)}}},[l("i"),e._v("编辑")]),l("span",{on:{click:function(l){return e.onRemoveClick(t.row)}}},[l("i"),e._v("删除")])])}}])}),l("div",{attrs:{slot:"empty"},slot:"empty"},[e.filterWords?l("span",[e._v("当前关键字为："+e._s(e.filterWords)+"， 筛选出条目为0， 请尝试更换搜索关键字")]):l("span",[e._v("暂无数据")])])],1)}),[],!1,null,null,null)).exports,d=(l("4160"),l("d81d"),l("b64b"),l("159b"),l("ad32")),m=l("c209"),f={props:{visible:{type:Boolean,default:!1},areaList:{type:Array,default:function(){return[]}},itemData:{type:Object,default:null}},components:{CommonDialogComp:d.a,TwoLevelSelectComp:m.a},computed:{locationIDs:{get:function(){return{level1Val:this.ruleForm.ProvinceID,level2Val:this.ruleForm.CityID}},set:function(e){var t=e.level1Val,l=e.level2Val;this.ruleForm.ProvinceID=t,this.ruleForm.CityID=l}},level1Options:function(){return this.areaList&&0!==this.areaList.length?this.areaList.map((function(e){return{Name:e.Name,ID:e.ID}})):[]},level2Options:function(){var e=this;if(!this.areaList||0===this.areaList.length||!this.ruleForm.ProvinceID)return[];var t=this.areaList.find((function(t){return t.ID===e.ruleForm.ProvinceID}));return t?t.children.map((function(e){return{Name:e.Name,ID:e.ID}})):[]},title:function(){return this.ruleForm.FactoryID?"编辑生产工厂":"添加生产工厂"}},data:function(){return{ruleForm:{FactoryName:"",ProvinceID:"",CityID:"",Address:"",LinkMan:"",Mobile:"",FactoryID:0},rules:{FactoryName:[{required:!0,message:"请输入工厂名称",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],CityID:[{required:!0,message:"请选择工厂地址",trigger:"change"}],Address:[{required:!0,message:"请输入详细地址",trigger:"blur"},{min:2,max:60,message:"长度在 2 到 60 个字符",trigger:"blur"}],LinkMan:[{required:!0,message:"请输入联系人",trigger:"blur"},{min:2,max:10,message:"长度在 2 到 10 个字符",trigger:"blur"}],Mobile:[{required:!0,message:"请输入联系电话",trigger:"blur"},{pattern:/^1[3456789]\d{9}$/,message:"手机号码格式不正确",trigger:"blur"}]}}},methods:{onDialogSubmit:function(){var e=this;this.$refs.ruleForm.validate((function(t){t&&e.$emit("submit",e.ruleForm)}))},onDialogCancle:function(){this.$emit("update:visible",!1)},initEditData:function(){var e=this;this.itemData?Object.keys(this.ruleForm).forEach((function(t){(e.itemData[t]||0===e.itemData[t])&&(e.ruleForm[t]=e.itemData[t])})):(Object.keys(this.ruleForm).forEach((function(t){e.ruleForm[t]=""})),this.ruleForm.FactoryID=0,this.level1Options.length>0&&(this.ruleForm.ProvinceID=this.level1Options[0].ID),this.level2Options.length>0&&(this.ruleForm.CityID=this.level2Options[0].ID))},onOpen:function(){this.$nextTick(this.initEditData)},onClosed:function(){this.$refs.ruleForm.resetFields()}}},p=Object(r.a)(f,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("CommonDialogComp",{attrs:{width:"700px",title:e.title,visible:e.visible},on:{"update:visible":function(t){e.visible=t},submit:e.onDialogSubmit,cancle:e.onDialogCancle,open:e.onOpen,closed:e.onClosed}},[l("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[l("el-form-item",{attrs:{label:"工厂名称",prop:"FactoryName"}},[l("el-input",{attrs:{placeholder:"请输入工厂名称",maxlength:"20","show-word-limit":""},model:{value:e.ruleForm.FactoryName,callback:function(t){e.$set(e.ruleForm,"FactoryName",t)},expression:"ruleForm.FactoryName"}})],1),l("el-form-item",{attrs:{label:"工厂地址",prop:"CityID"}},[l("TwoLevelSelectComp",{attrs:{level1Options:e.level1Options,level2Options:e.level2Options},model:{value:e.locationIDs,callback:function(t){e.locationIDs=t},expression:"locationIDs"}})],1),l("el-form-item",{attrs:{label:"详细地址",prop:"Address"}},[l("el-input",{attrs:{placeholder:"请输入详细地址",maxlength:"60","show-word-limit":""},model:{value:e.ruleForm.Address,callback:function(t){e.$set(e.ruleForm,"Address",t)},expression:"ruleForm.Address"}})],1),l("el-form-item",{attrs:{label:"联系人",prop:"LinkMan"}},[l("el-input",{attrs:{placeholder:"请输入联系人",maxlength:"10","show-word-limit":""},model:{value:e.ruleForm.LinkMan,callback:function(t){e.$set(e.ruleForm,"LinkMan","string"==typeof t?t.trim():t)},expression:"ruleForm.LinkMan"}})],1),l("el-form-item",{attrs:{label:"联系电话",prop:"Mobile"}},[l("el-input",{attrs:{placeholder:"请输入联系电话",maxlength:"11","show-word-limit":""},model:{value:e.ruleForm.Mobile,callback:function(t){e.$set(e.ruleForm,"Mobile","string"==typeof t?t.trim():t)},expression:"ruleForm.Mobile"}})],1)],1)],1)}),[],!1,null,null,null).exports,h=l("2f62"),v={components:{FactoryManageHeader:o,FactoryManageTable:u,FactoryManageDialog:p},computed:Object(n.a)({},Object(h.e)("common",["factoryList"]),{},Object(h.c)("common",["allAdAreaTreeList"]),{filterDataList:function(){var e=this;return this.filterWords?this.factoryList.filter((function(t){return t.FactoryName.includes(e.filterWords)||t.Address.includes(e.filterWords)||t.LinkMan.includes(e.filterWords)||t.Mobile.includes(e.filterWords)})):this.factoryList}}),data:function(){return{dialogVisible:!1,curItemData:null,filterWords:""}},methods:{onFactoryAddClick:function(){this.curItemData=null,this.dialogVisible=!0},onFilterClick:function(e){this.filterWords=e},getItemAddressName:function(e){if(!e||!this.allAdAreaTreeList||0===this.allAdAreaTreeList.length)return"";var t=this.allAdAreaTreeList.find((function(t){return t.ID===e.ProvinceID}));if(t){var l=t.children.find((function(t){return t.ID===e.CityID}));return l?"".concat(t.Name).concat(l.Name).concat(e.Address):"".concat(t.Name).concat(e.Address)}return"".concat(e.Address)},handleAddressItemEdit:function(e){this.curItemData=e,this.dialogVisible=!0},onSubmit:function(e){var t=this;return Object(i.a)(regeneratorRuntime.mark((function l(){var i,n,a;return regeneratorRuntime.wrap((function(l){for(;;)switch(l.prev=l.next){case 0:if(e){l.next=2;break}return l.abrupt("return");case 2:return i=0===e.FactoryID?"添加":"编辑",l.next=5,t.$store.dispatch("common/getFactorySave",e);case 5:(n=l.sent)&&(a=function(){t.dialogVisible=!1,t.$store.commit("common/setFactoryChange",{type:0===e.FactoryID?"add":"edit",data:n})},t.messageBox.successSingle("".concat(i,"成功!"),a,a));case 7:case"end":return l.stop()}}),l)})))()},handleAddressItemRemove:function(e){var t=this;this.messageBox.warnCancelBox("确定删除该工厂吗 ?","工厂名称：[ ".concat(e.FactoryName," ]"),(function(){t.$store.dispatch("common/getFactoryRemove",e)}))}},mounted:function(){this.$store.dispatch("common/getFactoryList"),this.$store.dispatch("common/fetchAdAreaList")}},b=(l("ff0f"),Object(r.a)(v,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("section",{staticClass:"mp-erp-factory-manage-page-wrap"},[l("FactoryManageHeader",{attrs:{filterWords:e.filterWords},on:{onFactoryAddClick:e.onFactoryAddClick,onFilterClick:e.onFilterClick}}),l("main",[l("FactoryManageTable",{attrs:{dataList:e.filterDataList,filterWords:e.filterWords,getAddName:e.getItemAddressName},on:{handleAddressItemEdit:e.handleAddressItemEdit,handleAddressItemRemove:e.handleAddressItemRemove}}),l("FactoryManageDialog",{attrs:{visible:e.dialogVisible,areaList:e.allAdAreaTreeList,itemData:e.curItemData},on:{"update:visible":function(t){e.dialogVisible=t},submit:e.onSubmit}})],1),l("footer",[l("span",[e._v("共检索出 "),l("i",[e._v(e._s(e.factoryList.length))]),e._v(" 条数据")]),l("span",{directives:[{name:"show",rawName:"v-show",value:e.filterWords,expression:"filterWords"}],staticStyle:{"margin-left":"5px"}},[e._v("，筛选出 "),l("i",[e._v(e._s(e.filterDataList.length))]),e._v(" 条")])])],1)}),[],!1,null,null,null));t.default=b.exports},dc48:function(e,t,l){},e57c:function(e,t,l){},ff0f:function(e,t,l){"use strict";var i=l("75d5");l.n(i).a}}]);