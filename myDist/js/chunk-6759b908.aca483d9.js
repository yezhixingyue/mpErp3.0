(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6759b908"],{"2af0":function(e,t,i){"use strict";i("4de4"),i("7db0"),i("c740"),i("caad"),i("d81d"),i("a434"),i("2532");var a=i("3835"),n=i("2909"),l=i("5530"),o=i("aa47"),s=i("c117"),r=i("2f62");t.a={data:function(){return{h:0,sortItem:null,tableKey:this.$utils.getRandomRangeId(8),notify:null,hideColLabelList:[],localShowLabelList:[]}},watch:{h:function(e){this.h=e;var t=document.getElementsByClassName("el-table")[0];t&&(t.style.maxHeight="".concat(e,"px"))},hideColLabelList:function(){var e=this;this.tableColData=this.tableColData.map((function(t){var i=Object(l.a)({},t);return e.hideColLabelList.includes(t.label)?i.show=!1:i.show=!0,i}))},isLeftCollapse:function(e){var t=this;setTimeout((function(){t.setHeightByDebounce()}),e?700:450)}},computed:Object(l.a)({},Object(r.e)("layout",["isLeftCollapse"]),{colLabels:function(){return this.tableColData?this.tableColData.map((function(e){return e.label})):[]},curShowColTableData:function(){return this.tableColData?this.tableColData.filter((function(e){return e.show})):[]}}),methods:{getHeight:function(e,t){var i=document.querySelector("#app > section > main");if(!i)return 600;var a=e?document.querySelector(e):null;return(a?i.offsetHeight-a.offsetHeight:i.offsetHeight)-t},initHeightAuto:function(){var e=this;this.$nextTick((function(){return e.setHeightByDebounce()})),window.addEventListener("resize",this.setHeightByDebounce)},removeHeightAuto:function(){window.removeEventListener("resize",this.setHeightByDebounce)},onHeaderDragend:function(e,t,i){var a=this;if(this.tableColData){var n=this.tableColData.find((function(e){return e.label===i.label}));if(n&&(n.width&&(n.width="".concat(e,"px")),n.minWidth&&(n.minWidth="".concat(e,"px"))),this.sortItem){try{this.sortItem.destroy()}catch(e){}this.$nextTick((function(){a.commonTableSortMixin()}))}}},commonTableSortMixin:function(){if(this.tableColData){var e=document.querySelector(".el-table__header thead tr"),t={onEnd:this.handleSortEnd};try{this.sortItem=o.a.create(e,t)}catch(e){}}},handleSortEnd:function(e){var t=this,i=e.oldIndex-1,l=e.newIndex-1;if(this.curShowColTableData.length<this.tableColData.length&&this.curShowColTableData[i]){var o=this.curShowColTableData[i].label,s=this.tableColData.findIndex((function(e){return e.label===o}));if(s>=0&&(i=s),l>0){var r=this.curShowColTableData[l-1].label,c=this.tableColData.findIndex((function(e){return e.label===r}));c>=0&&(l=c+1)}}var u=Object(n.a)(this.tableColData),h=u.splice(i,1),m=Object(a.a)(h,1)[0];u.splice(l,0,m),this.tableColData=u,this.tableKey=this.$utils.getRandomRangeId(8),this.$nextTick((function(){t.commonTableSortMixin()}))},handleMountedAndActivated:function(){var e=this;if(this.setHeightByDebounce=Object(s.a)(this.setHeight,30),this.initHeightAuto(),this.commonTableSortMixin(),this.tableName){var t=JSON.parse(localStorage.getItem(this.tableName));t.length>0&&(t=t.filter((function(t){return e.colLabels.includes(t)}))),this.hideColLabelList=t}},handleDestroyAndDeactivated:function(){if(this.removeHeightAuto(),this.sortItem)try{this.sortItem.destroy()}catch(e){}},onInfoClick:function(){var e=this,t=this.$createElement;if(this.tableColData){var i=160;this.$refs.oElTable&&this.$refs.oElTable.$el&&this.$refs.oElTable.$el.offsetTop&&(i=this.$refs.oElTable.$el.offsetTop-17),this.localShowLabelList=this.colLabels.filter((function(t){return!e.hideColLabelList.includes(t)}));var a=function(){e.notify&&e.notify.close()},l=function(t){var i=e.localShowLabelList.findIndex((function(e){return e===t}));i>=0?e.localShowLabelList.splice(i,1):e.localShowLabelList.push(t)},o=t("section",{class:"content-box"},[t("main",[t("el-checkbox-group",{attrs:{value:this.localShowLabelList}},[this.tableColData.map((function(e){return t("el-checkbox",{on:{change:function(){return l(e.label)}},attrs:{label:e.label},key:e.label})}))])]),t("footer",[t("el-button",{on:{click:function(){e.hideColLabelList=e.colLabels.filter((function(t){return!e.localShowLabelList.includes(t)})),e.tableName&&localStorage.setItem(e.tableName,JSON.stringify(e.hideColLabelList)),a()}},attrs:{type:"primary"}},["保存"]),t("el-button",{on:{click:a}},["关闭"]),t("span",{class:"span-title-blue",on:{click:function(){var t,i=e.colLabels.filter((function(t){return!e.localShowLabelList.includes(t)}));(t=e.localShowLabelList).push.apply(t,Object(n.a)(i))}}},["重置"]),t("p",{class:"is-gray"},[t("span",["1. 没有被选中的列将会被隐藏"]),t("span",["2. 列显示隐藏设置会缓存至本地，在不清除缓存或版本更新的情况下，下次打开会自动延续本次设置"]),t("span",["3. 中间列可左右拖动（不被缓存）"])])])]);this.notify=this.$notify({title:"设置列显示",customClass:"mp-erp-table-column-show-setup-wrap",duration:0,message:o,offset:i})}}},mounted:function(){this.handleMountedAndActivated()},beforeDestroy:function(){this.handleDestroyAndDeactivated()},activated:function(){this.handleMountedAndActivated()},deactivated:function(){this.handleDestroyAndDeactivated()}}},"3e79":function(e,t,i){},"468e":function(e,t,i){"use strict";var a=i("4aae");i.n(a).a},"4aae":function(e,t,i){},"6c7c":function(e,t,i){},"7bc2":function(e,t,i){"use strict";var a=i("6c7c");i.n(a).a},"995d":function(e,t,i){"use strict";var a=i("cf0f");i.n(a).a},ad32:function(e,t,i){"use strict";var a={model:{prop:"value",event:"change"},props:{visible:{type:Boolean,default:!1},title:{type:String,default:"提示"},width:{default:"30%"},top:{type:String,default:"15vh"},showSubmit:{type:Boolean,default:!0},submitText:{type:String,default:"保存"},dangerText:{type:String,default:"重新生成"},cancelText:{type:String,default:"取消"},disabled:{type:Boolean,default:!1},showDanger:{type:Boolean,default:!1},loading:{type:Boolean,default:!1}},computed:{dialogVisible:{get:function(){return this.visible},set:function(e){this.$emit("update:visible",e)}}},data:function(){return{checkList:[]}},methods:{onCancleClick:function(){this.$emit("cancle")},onSubmitClick:function(e){this.dialogVisible&&("BUTTON"===e.target.nodeName?e.target.blur():"BUTTON"===e.target.parentNode.nodeName&&e.target.parentNode.blur(),this.$emit("submit"))},onDangerClick:function(){this.$emit("danger")},onOpen:function(){this.$emit("open")},onOpened:function(){this.$emit("opened")},onClose:function(){this.$emit("close")},onClosed:function(){this.$emit("closed")}}},n=(i("468e"),i("2877")),l=Object(n.a)(a,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],staticClass:"mp-img-style-header mp-erp-common-dialog-comp-wrap",attrs:{title:e.title,visible:e.dialogVisible,"close-on-click-modal":!1,width:e.width,top:e.top,modal:!1,"before-close":e.onCancleClick},on:{"update:visible":function(t){e.dialogVisible=t},open:e.onOpen,opened:e.onOpened,close:e.onClose,closed:e.onClosed}},[e._t("default"),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e.$slots["foot-tip"]?i("div",[e._t("foot-tip")],2):e._e(),i("p",[e.showSubmit?i("el-button",{attrs:{type:"primary",loading:e.loading,disabled:e.disabled},on:{click:e.onSubmitClick}},[e._v(e._s(e.loading?"加载中":e.submitText))]):e._e(),e.showDanger?i("el-button",{attrs:{type:"danger"},on:{click:e.onDangerClick}},[e._v(e._s(e.dangerText))]):e._e(),i("el-button",{on:{click:e.onCancleClick}},[e._v(e._s(e.cancelText))])],1)])],2)}),[],!1,null,null,null);t.a=l.exports},b5ee:function(e,t,i){"use strict";var a=i("3e79");i.n(a).a},cf0f:function(e,t,i){},f60e:function(e,t,i){"use strict";i.r(t);var a=(i("96cf"),i("1da1")),n=i("5530"),l=i("ad32"),o=(i("7db0"),i("d81d"),i("d3b7"),i("25f0"),i("d4ec")),s=i("bee2"),r=i("ade3"),c=function(){function e(t){if(Object(o.a)(this,e),Object(r.a)(this,"ShowIndex",""),Object(r.a)(this,"TypeList",[]),Object(r.a)(this,"Remark",""),Object(r.a)(this,"FailTips",""),Object(r.a)(this,"ID",""),Object(r.a)(this,"Name",""),t&&"[object Object]"===Object.prototype.toString.call(t)){var i=JSON.parse(JSON.stringify(t)),a=i.ID,n=i.Name,l=i.Remark,s=i.FailTips,c=i.TypeList,u=i.ShowIndex;a&&(this.ID=a),n&&(this.Name=n),l&&(this.Remark=l),s&&(this.FailTips=s),(u||0===u)&&(this.ShowIndex=u),c&&(this.TypeList=c.map((function(e){return e.ID})))}}return Object(s.a)(e,null,[{key:"formatSubmitData",value:function(e,t){var i=e.TypeList.map((function(e){var i=t.find((function(t){return t.ID===e}));return Object(n.a)({},i)}));return Object(n.a)({},e,{TypeList:i})}}]),e}(),u={props:{visible:{type:Boolean,default:!1},curData:{type:Object,default:null},FileTypeList:{type:Array,default:function(){return[]}}},components:{CommonDialogComp:l.a},data:function(){return{title:"添加文件类目",ruleForm:null,rules:{Name:[{required:!0,message:"请输入文件类目名称",trigger:"blur"},{min:1,max:6,message:"长度在 1 到 6 个字符",trigger:"blur"}],ShowIndex:[{required:!0,message:"请设置显示顺序",trigger:"blur"},{type:"number",message:"必须为数字类型",trigger:"blur"}],TypeList:[{type:"array",required:!0,message:"请选择文件类型",trigger:"change"}],Remark:[{required:!0,message:"请输入说明文字",trigger:"blur"},{min:1,max:25,message:"长度在 1 到 25 个字符",trigger:"blur"}],FailTips:[{required:!0,message:"请输入未上传提示文字",trigger:"blur"},{min:1,max:40,message:"长度在 1 到 40 个字符",trigger:"blur"}]}}},methods:{onSubmit:function(){var e=this;return Object(a.a)(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$refs.ruleForm.validate().catch((function(){}));case 2:t.sent&&(i=c.formatSubmitData(e.ruleForm,e.FileTypeList),e.$emit("submit",i));case 4:case"end":return t.stop()}}),t)})))()},onCancle:function(){this.$emit("update:visible",!1)},onOpen:function(){this.$nextTick(this.initEditData)},onClosed:function(){this.ruleForm=null},initEditData:function(){this.ruleForm=new c(this.curData),this.title=this.curData?"编辑文件类目":"添加文件类目"}}},h=(i("7bc2"),i("2877")),m=Object(h.a)(u,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("CommonDialogComp",{staticClass:"mp-erp-comps-file-classify-manage-dialog-comp-wrap",attrs:{width:"800px",top:"13vh",title:e.title,visible:e.visible},on:{"update:visible":function(t){e.visible=t},submit:e.onSubmit,cancle:e.onCancle,open:e.onOpen,closed:e.onClosed}},[e.ruleForm?i("el-form",{ref:"ruleForm",staticClass:"file-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"168px",size:"small"}},[i("el-form-item",{key:"FileName",attrs:{label:"类目名称：",prop:"Name"}},[i("el-input",{staticStyle:{width:"350px"},attrs:{placeholder:"请输入类目名称",maxlength:"6","show-word-limit":""},model:{value:e.ruleForm.Name,callback:function(t){e.$set(e.ruleForm,"Name","string"==typeof t?t.trim():t)},expression:"ruleForm.Name"}})],1),i("el-form-item",{key:"ShowIndex",attrs:{label:"显示顺序：",prop:"ShowIndex"}},[i("el-input",{staticStyle:{width:"150px","margin-right":"10px"},attrs:{maxlength:"9"},model:{value:e.ruleForm.ShowIndex,callback:function(t){e.$set(e.ruleForm,"ShowIndex",e._n("string"==typeof t?t.trim():t))},expression:"ruleForm.ShowIndex"}}),i("span",{staticClass:"tips-box"},[i("i",{staticClass:"el-icon-warning"}),e._v(" 注：数字越小显示越靠前")])],1),i("el-form-item",{key:"TypeList",attrs:{label:"文件类型：",prop:"TypeList"}},[i("el-checkbox-group",{model:{value:e.ruleForm.TypeList,callback:function(t){e.$set(e.ruleForm,"TypeList",t)},expression:"ruleForm.TypeList"}},e._l(e.FileTypeList,(function(t,a){return i("el-checkbox",{key:t.ID+"-"+a,attrs:{label:t.ID,name:""+t.ID}},[e._v(e._s(t.Name))])})),1)],1),i("el-form-item",{key:"Remark",attrs:{label:"说明文字：",prop:"Remark"}},[i("el-input",{attrs:{maxlength:"25","show-word-limit":""},model:{value:e.ruleForm.Remark,callback:function(t){e.$set(e.ruleForm,"Remark","string"==typeof t?t.trim():t)},expression:"ruleForm.Remark"}})],1),i("el-form-item",{key:"FailTips",attrs:{label:"未上传时提示文字：",prop:"FailTips"}},[i("el-input",{attrs:{type:"textarea",maxlength:"40","show-word-limit":""},model:{value:e.ruleForm.FailTips,callback:function(t){e.$set(e.ruleForm,"FailTips",t)},expression:"ruleForm.FailTips"}})],1)],1):e._e()],1)}),[],!1,null,null,null).exports,d=(i("4de4"),i("a15b"),i("2af0")),f={props:{dataList:{default:function(){return[]},type:Array},loading:{type:Boolean,default:!1},FileTypeList:{type:Array,default:function(){return[]}}},computed:{localTableData:function(){var e=this;return this.dataList&&Array.isArray(this.dataList)&&0!==this.dataList.length?this.dataList.map((function(t){return Object(n.a)({},t,{TypeText:e.getTypeText(t)})})):[]}},mixins:[d.a],methods:{setHeight:function(){var e=this.getHeight(".mp-erp-file-manage-page-wrap > header",45);this.h=e},onEditClick:function(e){this.$emit("edit",e)},onRemoveClick:function(e){this.$emit("remove",e)},getTypeText:function(e){var t=this;if(!e||!this.FileTypeList||0===this.FileTypeList.length)return"";var i=e.TypeList;if(i&&Array.isArray(i)&&i.length>0){var a=i.map((function(e){var i=t.FileTypeList.find((function(t){return t.ID===e.ID}));return i?i.Name:""})).filter((function(e){return e}));if(a)return a.join("  ")}return""}}},p=(i("b5ee"),Object(h.a)(f,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-table",{key:"mp-erp-file-classify-page-file-table-comp-wrap",staticClass:"mp-erp-file-classify-page-file-table-comp-wrap",staticStyle:{width:"100%"},attrs:{"max-height":e.h,height:e.h,stripe:"",border:"",data:e.localTableData,fit:""}},[i("el-table-column",{attrs:{prop:"Name",label:"类目名称",width:"185"}}),i("el-table-column",{attrs:{prop:"TypeText",label:"文件类型",width:"220"}}),i("el-table-column",{attrs:{prop:"Remark",label:"说明文字",width:"240","show-overflow-tooltip":""}}),i("el-table-column",{attrs:{prop:"FailTips",label:"未上传提示文字","show-overflow-tooltip":""}}),i("el-table-column",{attrs:{prop:"ShowIndex",label:"显示顺序",sortable:"",width:"160"}}),i("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return i("div",{staticClass:"menu-list"},[i("span",{on:{click:function(i){return e.onEditClick(t.row)}}},[i("i"),e._v("编辑")]),i("span",{on:{click:function(i){return e.onRemoveClick(t.row)}}},[i("i"),e._v("删除")])])}}])}),i("div",{attrs:{slot:"empty"},slot:"empty"},[i("span",{directives:[{name:"show",rawName:"v-show",value:!e.loading,expression:"!loading"}]},[e._v("暂无数据")])])],1)}),[],!1,null,null,null)).exports,b=i("2f62"),g={name:"FileSetupPage",components:{FileClassifyDialogComp:m,FileClassifyTableComp:p},data:function(){return{visible:!1,SaveData:null,isTableDataLoading:!1}},computed:Object(n.a)({},Object(b.e)("common",["FileDataList","FileTypeList"])),methods:{onFileSetClick:function(e){this.SaveData=e||null,this.visible=!0},onFileSaveSubmit:function(e){var t=this;return Object(a.a)(regeneratorRuntime.mark((function i(){var a,n,l,o;return regeneratorRuntime.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,t.$store.dispatch("common/getFileInfoSave",e);case 2:(a=i.sent)&&(n=!(!e.ID&&0!==e.ID),l=n?"编辑成功":"添加成功",o=function(){t.handleSaveSuccess({isEdit:n,data:e,ID:a})},t.messageBox.successSingle(l,o,o));case 4:case"end":return i.stop()}}),i)})))()},handleSaveSuccess:function(e){var t=e.isEdit,i=e.data,a=e.ID;this.$store.commit("common/setFileSaveSuccess",{isEdit:t,data:i,ID:a}),this.visible=!1},onFileRemove:function(e){var t=this;if(e){var i=e.ID,a=e.Name;(i||0===i)&&a&&this.messageBox.warnCancelBox("确定删除该文件类目吗","类目名称：[ ".concat(a," ]"),(function(){t.$store.dispatch("common/getFileInfoRemove",i)}))}},fetchFileTypeList:function(){this.$store.dispatch("common/getFileTypeList")},fetchTableDataList:function(){var e=this;return Object(a.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.isTableDataLoading=!0,t.next=3,e.$store.dispatch("common/getFileInfoList");case 3:e.isTableDataLoading=!1;case 4:case"end":return t.stop()}}),t)})))()}},mounted:function(){this.fetchFileTypeList(),this.fetchTableDataList()}},v=(i("995d"),Object(h.a)(g,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("section",{staticClass:"mp-erp-file-manage-page-wrap"},[i("header",[i("el-button",{staticClass:"blue-full-color-btn-styles is-blue-button",attrs:{type:"primary"},on:{click:function(t){return e.onFileSetClick(null)}}},[e._v("添加文件类目")])],1),i("main",[i("FileClassifyDialogComp",{attrs:{visible:e.visible,curData:e.SaveData,FileTypeList:e.FileTypeList},on:{"update:visible":function(t){e.visible=t},submit:e.onFileSaveSubmit}}),i("FileClassifyTableComp",{attrs:{dataList:e.FileDataList,loading:e.isTableDataLoading,FileTypeList:e.FileTypeList},on:{edit:e.onFileSetClick,remove:e.onFileRemove}})],1),i("footer",[i("span",[e._v("共检索出 "),i("i",[e._v(e._s(e.FileDataList.length))]),e._v(" 条数据")])])])}),[],!1,null,null,null));t.default=v.exports}}]);