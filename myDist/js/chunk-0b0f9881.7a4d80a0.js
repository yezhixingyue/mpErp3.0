(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0b0f9881"],{"072a":function(e,t,i){"use strict";var n=i("956e");i.n(n).a},2243:function(e,t,i){},"283a":function(e,t,i){},"31e0":function(e,t,i){"use strict";i.d(t,"a",(function(){return c})),i.d(t,"b",(function(){return p})),i("99af"),i("7db0"),i("caad"),i("d3b7"),i("ac1f"),i("25f0"),i("2532"),i("466d");var n=i("d4ec"),r=i("bee2"),s=i("ade3"),a=i("192e"),l=i("247a"),o=i("7775"),u=i("3eca"),c=[{type:"ProductProperty",label:"产品"},{type:"MaterialProperty",label:"物料"}],p=function(){function e(t){if(Object(n.a)(this,e),Object(s.a)(this,"ID",""),Object(s.a)(this,"Name",""),Object(s.a)(this,"Content",""),Object(s.a)(this,"UseModule",""),Object(s.a)(this,"UseTimes",""),Object(s.a)(this,"Unit",""),Object(s.a)(this,"Remark",""),Object(s.a)(this,"PropertyList",[]),t&&"[object Object]"===Object.prototype.toString.call(t)){var i=JSON.parse(JSON.stringify(t)),r=i.ID,a=i.Name,l=i.Content,o=i.PositionID,u=i.UseModule,c=i.UseTimes,p=i.Unit,d=i.PropertyList,f=i.Remark,m=i.MaterialTypeID,h=i.PartID,y=i.ProductID,L=i.PriceID,C=i.TableID,b=i.GroupID,D=i.ElementID,I=i.CraftID;r&&(this.ID=r),a&&(this.Name=a),l&&(this.Content=l),o&&(this.PositionID=o),m&&(this.MaterialTypeID=m),h&&(this.PartID=h),y&&(this.ProductID=y),L&&(this.PriceID=L),C&&(this.TableID=C),b&&(this.GroupID=b),D&&(this.ElementID=D),I&&(this.CraftID=I),(u||0===u)&&(this.UseModule=u),c&&(this.UseTimes=c),p&&(this.Unit=p),f&&(this.Remark=f),d&&Array.isArray(d)&&d.length>0&&(this.PropertyList=d)}}return Object(r.a)(e,null,[{key:"checkSubmit",value:function(e){if(!e||"[object Object]"!==Object.prototype.toString.call(e))return a.a.failSingleError("操作失败","获取提交信息出错"),!1;var t=e.Name,i=e.PropertyList,n=e.Content;if(!t)return a.a.failSingleError("操作失败","请输入公式名称"),!1;if(i&&i.length>0){var r=i.find((function(e){return!e.DefaultValue&&0!==e.DefaultValue}));if(r)return a.a.failSingleError("操作失败","".concat(r.Element?r.Element.Name:r.DisplayContent,"未设置空值")),!1;if(r=i.find((function(e){if(!e.Element)return!Object(l.h)(e.DefaultValue);var t=e.Element,i=t.Type,n=t.NumbericAttribute,r=!(1===i&&n&&n.AllowDecimal);return!Object(l.h)(e.DefaultValue,r)})))return a.a.failSingleError("操作失败","".concat(r.Element?r.Element.Name:r.DisplayContent,"空值设置值不正确(检查是否为数字或是否允许小数)")),!1;for(var s=0;s<i.length;s+=1){var c=i[s];if(c.ValueRange){var p=c.ValueRange,d=p.MinValue,f=p.MaxValue;if((d||0===d)&&+c.DefaultValue<d)return a.a.failSingleError("操作失败","".concat(c.Element?c.Element.Name:c.DisplayContent,"空值设置值不能小于").concat(d)),!1;if((f||0===f)&&+c.DefaultValue>f&&-1!==f)return a.a.failSingleError("操作失败","".concat(c.Element?c.Element.Name:c.DisplayContent,"空值设置值不能大于").concat(f)),!1}}if(r=i.find((function(e){var t=e.DefaultValue,i=e.AvailableValueList;return!u.d.AvailableValueListChecker(t,i)})))return a.a.failSingleError("操作失败","".concat(r.Element?r.Element.Name:r.DisplayContent,"空值设置值不正确，请检查其取值范围")),!1}if(!n)return a.a.failSingleError("操作失败","请填写公式内容"),!1;var m=n.match(o.d);return!m||(a.a.failSingleError("操作失败","公式中[ ".concat(m," ]请转为半角字符")),!1)}},{key:"checkCalculate",value:function(e){if(!e||"[object Object]"!==Object.prototype.toString.call(e))return a.a.failSingleError("计算失败","获取提交信息出错"),!1;var t=e.PropertyList,i=e.Content;if(!i)return a.a.failSingleError("计算失败","请填写公式内容"),!1;var n=i.match(o.d);if(n)return a.a.failSingleError("计算失败","公式中[ ".concat(n," ]等字符为全角字符，请转换为半角")),!1;if(t&&t.length>0){var r=t.find((function(e){return!e.CalculateValue&&0!==e.CalculateValue&&i.includes(e.DisplayContent)}));if(r)return a.a.failSingleError("计算失败","".concat(r.Element?r.Element.Name:r.DisplayContent,"未设置测试计算数值")),!1;if(r=t.find((function(e){return i.includes(e.DisplayContent)&&!Object(l.h)(e.CalculateValue)})))return a.a.failSingleError("计算失败","".concat(r.Element?r.Element.Name:r.DisplayContent,"计算值不合法(检查是否为数字或是否允许小数)")),!1}return!0}}]),e}()},"466d":function(e,t,i){"use strict";var n=i("d784"),r=i("825a"),s=i("50c4"),a=i("1d80"),l=i("8aa5"),o=i("14c3");n("match",1,(function(e,t,i){return[function(t){var i=a(this),n=null==t?void 0:t[e];return void 0!==n?n.call(t,i):new RegExp(t)[e](String(i))},function(e){var n=i(t,e,this);if(n.done)return n.value;var a=r(e),u=String(this);if(!a.global)return o(a,u);var c=a.unicode;a.lastIndex=0;for(var p,d=[],f=0;null!==(p=o(a,u));){var m=String(p[0]);d[f]=m,""===m&&(a.lastIndex=l(u,s(a.lastIndex),c)),f++}return 0===f?null:d}]}))},"468e":function(e,t,i){"use strict";var n=i("4aae");i.n(n).a},4944:function(e,t,i){"use strict";var n=i("283a");i.n(n).a},"4aae":function(e,t,i){},5731:function(e,t){e.exports="data:image/png;base64,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"},"918d":function(e,t,i){"use strict";var n=i("2243");i.n(n).a},"956e":function(e,t,i){},a9e4:function(e,t,i){"use strict";var n=(i("99af"),i("4de4"),i("7db0"),i("4160"),i("caad"),i("d81d"),i("b64b"),i("d3b7"),i("25f0"),i("2532"),i("159b"),i("5530")),r=i("3835"),s=i("ad32"),a=i("2387"),l=i("31e0"),o=i("3eca"),u=(i("c740"),i("a434"),function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"mp-erp-common-comps-on-element-select-dialog-element-type-show-item-comp-wrap"},e._l(e.elementList,(function(t){return i("li",{key:t.StoredContent||t.ID},[e.isMultiple&&t.StoredContent?i("el-checkbox",{attrs:{value:e.MultipleCheckedIDList.includes(t.StoredContent)},on:{change:function(i){return e.onCheckedItemChange(i,t)}}},[e._v(e._s(e.getName(t)))]):i("span",{class:{"has-child":t._FixedTypeList&&t._FixedTypeList.length>0,disabled:!t.StoredContent,"is-disabled":t.StoredContent&&e.selectedElementIDs.includes(t.StoredContent),"is-element":!0},on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))]),t._FixedTypeList&&t._FixedTypeList.length>0?i("div",[e._v(" （"),e._l(t._FixedTypeList,(function(t){return i("span",{key:t.StoredContent,staticClass:"blue-span",class:e.selectedElementIDs.includes(t.StoredContent)?"is-disabled":"",on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))])})),e._v("） ")],2):e._e()],1)})),0)}),c={props:{dataList:{type:Array,default:function(){return[]}},ElementList:{type:Array,default:null},selectedElementIDs:{type:Array,default:function(){return[]}},isMultiple:{type:Boolean,default:!1},checkedList:{type:Array,default:function(){return[]}}},computed:{elementList:function(){if(this.ElementList)return this.ElementList;if(!this.dataList||!Array.isArray(this.dataList)||0===this.dataList.length)return[];var e=[];return JSON.parse(JSON.stringify(this.dataList)).forEach((function(t){if(t.FixedType||0===t.FixedType){var i=e.find((function(e){return(e.Element?e.Element.ID:e.ID)===(t.Element?t.Element.ID:t.Formula.ID)}));if(i)i._FixedTypeList.push(t);else{var r=t.Element||t.Formula;e.push(Object(n.a)({},r,{_FixedTypeList:[t]}))}}else{var s=e.findIndex((function(e){return(e.Element?e.Element.ID:e.ID)===t.Element.ID}));if(s>-1){if(!e[s].StoredContent&&t.StoredContent){var a=e[s]._FixedTypeList,l=Object(n.a)({},t,{_FixedTypeList:a});e.splice(s,1,l)}}else e.push(Object(n.a)({},t,{_FixedTypeList:[]}))}})),e},MultipleCheckedIDList:function(){return Array.isArray(this.checkedList)?this.checkedList.map((function(e){return e.StoredContent})):[]}},methods:{getName:function(e){return o.d.getProperyName(e)},onItemClick:function(e){this.$emit("submit",e)},onCheckedItemChange:function(e,t){this.$emit("checked",e,t)}}},p=(i("918d"),i("2877")),d=Object(p.a)(c,u,[],!1,null,null,null).exports,f={props:{dataList:{type:Array,default:null},selectedElementIDs:{type:Array,default:function(){return[]}},ElementGroupList:{type:Array,default:null},isMultiple:{type:Boolean,default:!1},checkedList:{type:Array,default:function(){return[]}}},components:{ElementTypeShowComp:d},computed:{groupList:function(){if(this.ElementGroupList)return this.ElementGroupList;if(!this.dataList||!Array.isArray(this.dataList)||0===this.dataList.length)return[];var e=[],t=[];return JSON.parse(JSON.stringify(this.dataList)).forEach((function(i){var r=i.Group,s=i.FixedType,a=i.Element,l=i.Formula,o=a||l;if(!o&&r&&!s&&0!==s){var u=e.findIndex((function(e){return(e.Group?e.Group.ID:e.ID)===r.ID}));if(u>-1){if(!e[u].StoredContent&&i.StoredContent){var c=e[u],p=c.List,d=c._FixedTypeList;p=p||[],d=d||[];var f=Object(n.a)({},i,{List:p,_FixedTypeList:d});e.splice(u,1,f)}}else e.push(Object(n.a)({},i,{_FixedTypeList:[],List:[]}))}if(a&&r&&!s&&0!==s&&!l){var m=e.find((function(e){return(e.Group?e.Group.ID:e.ID)===r.ID}));if(m){m.List||(m.List=[]);var h=m.List.findIndex((function(e){return(e.Element?e.Element.ID:e.ID)===a.ID}));if(h>-1){if(!m.List[h].StoredContent&&i.StoredContent){var y=m.List[h]._FixedTypeList,L=Object(n.a)({},i,{_FixedTypeList:y});m.List.splice(h,1,L)}}else m.List.push(i)}else e.push(Object(n.a)({},r,{List:[i]}))}if(!a&&r&&(s||0===s)&&!l){var C=e.find((function(e){return(e.Group?e.Group.ID:e.ID)===r.ID}));if(C)C._FixedTypeList||(C._FixedTypeList=[]),C._FixedTypeList.push(i);else{var b=Object(n.a)({},r,{List:[],_FixedTypeList:[i]});e.push(b)}t.push(i)}if(o&&r&&(s||0===s)){var D=e.find((function(e){return(e.Group?e.Group.ID:e.ID)===r.ID}));if(D){var I=D.List.find((function(e){return(e.Element?e.Element.ID:e.ID)===o.ID}));if(I)I._FixedTypeList||(I._FixedTypeList=[]),I._FixedTypeList.push(i);else{var v=Object(n.a)({},o,{_FixedTypeList:[i]});D.List.push(v)}}else e.push(Object(n.a)({},r,{_FixedTypeList:[i],List:[]}))}})),e},MultipleCheckedIDList:function(){return Array.isArray(this.checkedList)?this.checkedList.map((function(e){return e.StoredContent})):[]}},methods:{getName:function(e){return o.d.getProperyName(e)},onItemClick:function(e){this.$emit("submit",e)},onCheckedItemChange:function(e,t){this.$emit("checked",e,t)}}},m=(i("e363"),Object(p.a)(f,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap"},e._l(e.groupList,(function(t){return i("li",{key:t.Group?t.Group.ID:t.ID},[t.Group?i("label",[e.isMultiple&&t.StoredContent?i("el-checkbox",{attrs:{value:e.MultipleCheckedIDList.includes(t.StoredContent)},on:{change:function(i){return e.onCheckedItemChange(i,t)}}},[e._v(e._s(t.Group.Name))]):t.StoredContent?i("span",{staticClass:"is-element",on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(t.Group.Name))]):i("span",[e._v(e._s(t.Group.Name))]),t._FixedTypeList&&t._FixedTypeList.length>0?[e._v(" （"),e._l(t._FixedTypeList,(function(t){return i("span",{key:t.StoredContent,staticClass:"blue-span",class:e.selectedElementIDs.includes(t.StoredContent)?"is-disabled":"",on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))])})),e._v("） ")]:e._e(),t.List.length>0?[e._v("：")]:e._e()],2):e._e(),!t.Group&&t.Name?i("label",[e._v(e._s(t.Name)+" "),t._FixedTypeList&&t._FixedTypeList.length>0?[e._v(" （"),e._l(t._FixedTypeList,(function(t){return i("span",{key:t.StoredContent,staticClass:"blue-span",class:e.selectedElementIDs.includes(t.StoredContent)?"is-disabled":"",on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))])})),e._v("） ")]:e._e(),t.List.length>0?[e._v("：")]:e._e()],2):e._e(),i("ElementTypeShowComp",{attrs:{ElementList:t.List,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.checkedList},on:{submit:e.onItemClick,checked:e.onCheckedItemChange}})],1)})),0)}),[],!1,null,null,null)).exports,h={props:{dataList:{type:Array,default:function(){return[]}},selectedElementIDs:{type:Array,default:function(){return[]}},isMultiple:{type:Boolean,default:!1},checkedList:{type:Array,default:function(){return[]}}},components:{ElementTypeShowComp:d,ElementGroupTypeShowComp:m},computed:{craftTypeList:function(){if(!this.dataList||!Array.isArray(this.dataList)||0===this.dataList.length)return[];var e=[],t=JSON.parse(JSON.stringify(this.dataList)),i=function(e){return{Craft:e,_ElementList:[],_ElementGroupList:[]}},r=function(t){var i=e.find((function(e){return t.ID===e.Craft.ID}));if(i){if(!i.StoredContent&&t.StoredContent){var r=i._ElementList,s=i._ElementGroupList,a=Object(n.a)({},t,{_ElementList:r,_ElementGroupList:s}),l=e.findIndex((function(e){return t.ID===e.Craft.ID}));e.splice(l,1,a)}}else e.push(t)};return t.forEach((function(t){var s=t.Craft,a=t.Element,l=t.Group,o=t.FixedType,u=t.Formula,c=a||u;if(!s||a||l||o||0===o||u||r(t),s&&a&&!l&&!o&&0!==o&&!u){var p=e.find((function(e){return s.ID===e.Craft.ID}));if(p){p._ElementList||(p._ElementList=[]);var d=p._ElementList.findIndex((function(e){return(e.Element?e.Element.ID:e.ID)===a.ID}));if(d>-1){if(!p._ElementList[d].StoredContent&&t.StoredContent){var f=p._ElementList[d]._FixedTypeList,m=Object(n.a)({},t,{_FixedTypeList:f});p._ElementList.splice(d,1,m)}}else p._ElementList.push(t)}else{var h=i(s);h._ElementList.push(t),r(h)}}if(s&&a&&!l&&(o||0===o)&&!u){var y=e.find((function(e){return s.ID===e.Craft.ID}));if(y){y._ElementList||(y._ElementList=[]);var L=y._ElementList.find((function(e){return(e.Element?e.Element.ID:e.ID)===a.ID}));if(L)L._FixedTypeList||(L._FixedTypeList=[]),L._FixedTypeList.push(t);else{var C=Object(n.a)({},a,{_FixedTypeList:[t]});y._ElementList.push(C)}}else{var b=i(s),D=Object(n.a)({},a,{_FixedTypeList:[t]});b._ElementList.push(D),r(b)}}if(s&&!a&&l&&!o&&0!==o&&!u){var I=e.find((function(e){return s.ID===e.Craft.ID}));if(I){var v=Object(n.a)({},t,{List:[]});I._ElementGroupList||(I._ElementGroupList=[]);var E=I._ElementGroupList.findIndex((function(e){return(e.Group?e.Group.ID:e.ID)===l.ID}));if(E>-1){if(!I._ElementGroupList[E].StoredContent&&t.StoredContent){var _=I._ElementGroupList[E].List,g=Object(n.a)({},t,{List:_});I._ElementGroupList.splice(E,1,g)}}else I._ElementGroupList.push(v)}else{var k=i(s),T=Object(n.a)({},t,{List:[]});k._ElementGroupList.push(T),r(k)}}if(s&&a&&l&&!o&&0!==o&&!u){var S=e.find((function(e){return s.ID===e.Craft.ID}));if(S){var x=Object(n.a)({},l,{List:[t]});S._ElementGroupList||(S._ElementGroupList=[]);var O=S._ElementGroupList.find((function(e){return(e.Group?e.Group.ID:e.ID)===l.ID}));if(O){var M=O.List.findIndex((function(e){return e.ID===a.ID}));if(M>-1){if(!O.List[M].StoredContent&&t.StoredContent){var A=O.List[M]._FixedTypeList,G=Object(n.a)({},t,{_FixedTypeList:A});O.List.splice(M,1,G)}}else O.List.push(t)}else S._ElementGroupList.push(x)}else{var j=i(s),F=Object(n.a)({},l,{List:[t]});j._ElementGroupList.push(F),r(j)}}if(s&&!c&&l&&(o||0===o)){var N=e.find((function(e){return s.ID===e.Craft.ID}));if(N){var w=Object(n.a)({},l,{List:[],_FixedTypeList:[t]});N._ElementGroupList||(N._ElementGroupList=[]);var P=N._ElementGroupList.find((function(e){return(e.Group?e.Group.ID:e.ID)===l.ID}));P?(P._FixedTypeList||(P._FixedTypeList=[]),P._FixedTypeList.push(t)):N._ElementGroupList.push(w)}else{var B=i(s),V=Object(n.a)({},l,{List:[],_FixedTypeList:[t]});B._ElementGroupList.push(V),r(B)}}if(s&&c&&l&&(o||0===o)){var Y=e.find((function(e){return s.ID===e.Craft.ID}));if(Y){Y._ElementGroupList||(Y._ElementGroupList=[]);var W=Y._ElementGroupList.find((function(e){return(e.Group?e.Group.ID:e.ID)===l.ID}));if(W){var R=W.List.find((function(e){return(e.Element?e.Element.ID:e.ID)===c.ID}));if(R)R._FixedTypeList||(R._FixedTypeList=[]),R._FixedTypeList.push(t);else{var Z=Object(n.a)({},c,{_FixedTypeList:[t]});W.List.push(Z)}}else{var U=Object(n.a)({},l,{List:[Object(n.a)({},c,{_FixedTypeList:[t]})],_FixedTypeList:[]});Y._ElementGroupList.push(U)}}else{var J=i(s),X=Object(n.a)({},l,{List:[Object(n.a)({},c,{_FixedTypeList:[t]})],_FixedTypeList:[]});J._ElementGroupList.push(X),r(J)}}})),e},MultipleCheckedIDList:function(){return Array.isArray(this.checkedList)?this.checkedList.map((function(e){return e.StoredContent})):[]}},methods:{getName:function(e){return o.d.getProperyName(e)},onItemClick:function(e){e.StoredContent&&this.$emit("submit",e)},onCheckedItemChange:function(e,t){this.$emit("checked",e,t)}}},y=(i("e952"),Object(p.a)(h,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"mp-erp-common-comps-on-element-select-dialog-craft-type-show-item-comp-wrap"},e._l(e.craftTypeList,(function(t){return i("li",{key:t.StoredContent||t.Craft.ID},[e.isMultiple&&t.StoredContent?i("el-checkbox",{attrs:{value:e.MultipleCheckedIDList.includes(t.StoredContent)},on:{change:function(i){return e.onCheckedItemChange(i,t)}}},[e._v(e._s(t.Craft.Name))]):i("label",{staticClass:"is-element",class:{"is-disabled":t.StoredContent&&e.selectedElementIDs.includes(t.StoredContent),"no-element":!t.StoredContent},on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(t.Craft.Name)+" "),t._ElementList||t._ElementGroupList?[e._v("：")]:e._e()],2),i("div",[i("ElementTypeShowComp",{attrs:{selectedElementIDs:e.selectedElementIDs,ElementList:t._ElementList,isMultiple:e.isMultiple,checkedList:e.checkedList},on:{submit:e.onItemClick,checked:e.onCheckedItemChange}}),i("ElementGroupTypeShowComp",{attrs:{selectedElementIDs:e.selectedElementIDs,ElementGroupList:t._ElementGroupList,isMultiple:e.isMultiple,checkedList:e.checkedList},on:{submit:e.onItemClick,checked:e.onCheckedItemChange}})],1)],1)})),0)}),[],!1,null,null,null)).exports,L={props:{dataList:{type:Array,default:function(){return[]}},selectedElementIDs:{type:Array,default:function(){return[]}},useType:{type:String,default:"condition"},isMultiple:{type:Boolean,default:!1},checkedList:{type:Array,default:function(){return[]}}},computed:{formulaMaterialList:function(){if(!this.dataList||"formula"!==this.useType||0===this.dataList.length)return[];var e=[];return this.dataList.forEach((function(t){var i=t.MaterialType,n=e.find((function(e){return e.MaterialType.ID===i.ID}));n?n.List.push(t):e.push({MaterialType:i,List:[t]})})),e},MultipleCheckedIDList:function(){return Array.isArray(this.checkedList)?this.checkedList.map((function(e){return e.StoredContent})):[]}},methods:{getName:function(e){return o.d.getProperyName(e)},onItemClick:function(e){this.$emit("submit",e)},onCheckedItemChange:function(e,t){this.$emit("checked",e,t)}}},C=(i("072a"),Object(p.a)(L,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap"},["formula"===e.useType?e._l(e.formulaMaterialList,(function(t){return i("li",{key:t.MaterialType.ID,staticClass:"formula-type"},[i("label",[e._v(e._s(t.MaterialType.Name)+"：")]),e._l(t.List,(function(t){return i("span",{key:t.Element.ID,staticClass:"is-element",class:{"is-disabled":t.StoredContent&&e.selectedElementIDs.includes(t.StoredContent)},on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))])}))],2)})):e._l(e.dataList,(function(t){return i("li",{key:t.StoredContent||t.ID},[e.isMultiple&&t.StoredContent?i("el-checkbox",{attrs:{value:e.MultipleCheckedIDList.includes(t.StoredContent)},on:{change:function(i){return e.onCheckedItemChange(i,t)}}},[e._v(e._s(e.getName(t)))]):i("span",{staticClass:"is-element",class:{"has-child":t.FixedTypeList,disabled:!t.StoredContent,"is-disabled":t.StoredContent&&e.selectedElementIDs.includes(t.StoredContent)},on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))]),t.FixedTypeList?i("div",[e._v(" （"),e._l(t.FixedTypeList,(function(t){return i("span",{key:t.StoredContent,staticClass:"blue-span",class:e.selectedElementIDs.includes(t.StoredContent)?"is-disabled":"",on:{click:function(i){return e.onItemClick(t)}}},[e._v(e._s(e.getName(t)))])})),e._v("） ")],2):e._e()],1)}))],2)}),[],!1,null,null,null)).exports,b={components:{CommonDialogComp:s.a,TipsSpanButton:a.a,ElementGroupTypeShowComp:m,ElementTypeShowComp:d,CraftTypeShowComp:y,MaterialTypeShowComp:C},props:{visible:{type:Boolean,default:!1},list:{type:Array,default:function(){return[]}},selectedElementIDs:{type:Array,default:function(){return[]}},useType:{type:String,default:"condition"},DialogTitle:{type:String,default:""},showConstant:{type:Boolean,default:!1},curTargetID:{type:String,default:""},fixedPartName:{type:String,default:""},isMultiple:{type:Boolean,default:!1},title:{type:String,default:"添加元素"},MultipleCheckedList:{type:Array,default:function(){return[]}}},data:function(){return{propertyData:null,panelRadio:"",panelList:[],tempTabList:[{label:"产品",value:"ProductProperty"},{label:"物料",value:"MaterialProperty"}],MultipleList:[]}},computed:{showData:function(){if(this.propertyData&&this.panelRadio){if(this.propertyData[this.panelRadio])return this.propertyData[this.panelRadio];if(this.propertyData.PartProperty&&this.propertyData.PartProperty[this.panelRadio])return this.propertyData.PartProperty[this.panelRadio]}return null},MultipleCheckedIDList:function(){return Array.isArray(this.MultipleList)?this.MultipleList.map((function(e){return e.StoredContent})):[]}},methods:{onSubmit:function(e){this.selectedElementIDs.includes(e.StoredContent)||(this.$emit("submit",e),this.onCancle())},onChecked:function(e,t){e?this.MultipleList.push(t):this.MultipleList=this.MultipleList.filter((function(e){return e.StoredContent!==t.StoredContent}))},onCancle:function(){this.$emit("update:visible",!1)},getInitListData:function(){var e=this;if(this.panelList=[],o.b&&this.list){var t={ProductProperty:[],PartProperty:{},MaterialProperty:[]};this.list.forEach((function(i){if(i.Product&&i.Product.ID&&!i.Part)i.Product.ID===e.curTargetID&&e.tempTabList&&e.tempTabList[0].label&&(e.tempTabList[0].label.includes("（当前）")||(e.tempTabList[0].label+="（当前）")),t.ProductProperty.push(i);else if(i.Product&&i.Product.ID&&i.Part&&i.Part.ID){var n=i.Part.Name||i.Part.ID;e.curTargetID===i.Part.ID&&(n+="（当前目标）"),t.PartProperty[n]&&Array.isArray(t.PartProperty[n])?t.PartProperty[n].push(i):t.PartProperty[n]=[i]}else i.Material&&i.Material.ID&&!i.Product&&t.MaterialProperty.push(i)}));var i=this.protertyFilterHelper(t);if(this.propertyData=i,Object.keys(i).length>0){var n=Object.keys(i),s=Object(r.a)(n,1)[0];if(Array.isArray(i[s]))this.panelRadio=s;else if("[object Object]"===Object.prototype.toString.call(i[s])){var a=Object.keys(i[s]),l=Object(r.a)(a,1)[0];Array.isArray(i[s][l])&&(this.panelRadio=l)}}this.fixedPartName&&(this.panelRadio="产品"===this.fixedPartName?"ProductProperty":this.fixedPartName)}},protertyFilterHelper:function(e){var t=this,i={};return Object.keys(e).forEach((function(r){if(Array.isArray(e[r])&&e[r].length>0){i[r]=t.protertySeparateHelper(e[r]);var s=t.tempTabList.find((function(e){return e.value===r}));s&&t.panelList.push(Object(n.a)({},s))}if("[object Object]"===Object.prototype.toString.call(e[r])&&Object.keys(e[r]).length>0){var a={};Object.keys(e[r]).forEach((function(i){(a[i]=t.protertySeparateHelper(e[r][i]),"PartProperty"===r)&&(t.panelList.find((function(e){return e.value===i}))||t.panelList.push({label:i,value:i}))})),i[r]=a}})),i},protertySeparateHelper:function(e){var t=JSON.parse(JSON.stringify(e)),i={};t.forEach((function(e){i[e.Type]&&Array.isArray(i[e.Type])?i[e.Type].push(e):i[e.Type]=[e]}));var n=[];return Object.keys(i).forEach((function(e){n.push({Type:+e,list:i[e]})})),n},onOpen:function(){this.getInitListData(),this.setMultipleListInit()},setMultipleListInit:function(){this.MultipleList=this.MultipleCheckedList.filter((function(e){return e.StoredContent}))},getTitle:function(e){var t=this,i=o.b.find((function(t){return t.ID===e}));if(i){if(0!==e)return i.nickName;var n=l.a.find((function(e){return e.type===t.panelRadio}));return n?"".concat(n.label).concat(i.nickName):i.label}return""},getTextName:function(e){return o.d.getProperyName(e)},onConstantClick:function(){this.$emit("submit",null),this.onCancle()},onMultipleSubmit:function(){this.$emit("select",this.MultipleList)}}},D=(i("4944"),Object(p.a)(b,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("CommonDialogComp",{staticClass:"mp-erp-common-comps-formula-panel-comp-element-select-comp-wrap",attrs:{width:"850px",top:"10vh",title:e.title,visible:e.visible,showSubmit:e.isMultiple,cancelText:"关闭"},on:{"update:visible":function(t){e.visible=t},cancle:e.onCancle,open:e.onOpen,submit:e.onMultipleSubmit}},[n("section",{staticClass:"show-panel-box"},[n("header",[e.panelList.length>1&&!e.fixedPartName?n("el-radio-group",{staticClass:"mp-common-tab-radio-box",attrs:{size:"mini"},model:{value:e.panelRadio,callback:function(t){e.panelRadio=t},expression:"panelRadio"}},e._l(e.panelList,(function(t){return n("el-radio-button",{key:t.value,attrs:{label:t.value}},[e._v(e._s(t.label))])})),1):e.DialogTitle?n("p",[e._v(e._s(e.DialogTitle))]):e._e()],1),e.showData?n("main",[e._l(e.showData,(function(t){return n("div",{key:t.Type},[n("span",{staticClass:"title mp-common-title-wrap"},[e._v(e._s(e.getTitle(t.Type)))]),2===t.Type?n("ElementGroupTypeShowComp",{attrs:{dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):3===t.Type?n("ElementTypeShowComp",{attrs:{dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):4===t.Type?n("CraftTypeShowComp",{attrs:{dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):5===t.Type?n("MaterialTypeShowComp",{attrs:{useType:e.useType,dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):6===t.Type?n("ElementGroupTypeShowComp",{attrs:{dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):8===t.Type?n("ElementTypeShowComp",{attrs:{dataList:t.list,selectedElementIDs:e.selectedElementIDs,isMultiple:e.isMultiple,checkedList:e.MultipleList},on:{submit:e.onSubmit,checked:e.onChecked}}):n("div",[e.isMultiple?e._l(t.list,(function(t){return n("el-checkbox",{key:t.StoredContent,attrs:{value:e.MultipleCheckedIDList.includes(t.StoredContent)},on:{change:function(i){return e.onChecked(i,t)}}},[e._v(e._s(e.getTextName(t)||t.DisplayContent||"未知名称"))])})):e._l(t.list,(function(t){return n("TipsSpanButton",{key:t.StoredContent,attrs:{disabled:e.selectedElementIDs.includes(t.StoredContent),text:e.getTextName(t)||t.DisplayContent||"未知名称"},nativeOn:{click:function(i){return e.onSubmit(t)}}})}))],2)],1)})),e.showConstant?n("p",{staticClass:"constant"},[n("span",{staticClass:"blue-span",on:{click:e.onConstantClick}},[e._v("常量")])]):e._e()],2):n("main",{staticClass:"null-box"},[n("img",{attrs:{src:i("5731"),alt:""}}),n("p",{staticClass:"is-font-size-12 is-gray"},[e._v("暂无数据，请先添加")])])])])}),[],!1,null,null,null));t.a=D.exports},ad32:function(e,t,i){"use strict";var n={model:{prop:"value",event:"change"},props:{visible:{type:Boolean,default:!1},title:{type:String,default:"提示"},width:{default:"30%"},top:{type:String,default:"15vh"},showSubmit:{type:Boolean,default:!0},submitText:{type:String,default:"保存"},dangerText:{type:String,default:"重新生成"},cancelText:{type:String,default:"取消"},disabled:{type:Boolean,default:!1},showDanger:{type:Boolean,default:!1},loading:{type:Boolean,default:!1}},computed:{dialogVisible:{get:function(){return this.visible},set:function(e){this.$emit("update:visible",e)}}},data:function(){return{checkList:[]}},methods:{onCancleClick:function(){this.$emit("cancle")},onSubmitClick:function(e){this.dialogVisible&&("BUTTON"===e.target.nodeName?e.target.blur():"BUTTON"===e.target.parentNode.nodeName&&e.target.parentNode.blur(),this.$emit("submit"))},onDangerClick:function(){this.$emit("danger")},onOpen:function(){this.$emit("open")},onOpened:function(){this.$emit("opened")},onClose:function(){this.$emit("close")},onClosed:function(){this.$emit("closed")}}},r=(i("468e"),i("2877")),s=Object(r.a)(n,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],staticClass:"mp-img-style-header mp-erp-common-dialog-comp-wrap",attrs:{title:e.title,visible:e.dialogVisible,"close-on-click-modal":!1,width:e.width,top:e.top,modal:!1,"before-close":e.onCancleClick},on:{"update:visible":function(t){e.dialogVisible=t},open:e.onOpen,opened:e.onOpened,close:e.onClose,closed:e.onClosed}},[e._t("default"),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e.$slots["foot-tip"]?i("div",[e._t("foot-tip")],2):e._e(),i("p",[e.showSubmit?i("el-button",{attrs:{type:"primary",loading:e.loading,disabled:e.disabled},on:{click:e.onSubmitClick}},[e._v(e._s(e.loading?"加载中":e.submitText))]):e._e(),e.showDanger?i("el-button",{attrs:{type:"danger"},on:{click:e.onDangerClick}},[e._v(e._s(e.dangerText))]):e._e(),i("el-button",{on:{click:e.onCancleClick}},[e._v(e._s(e.cancelText))])],1)])],2)}),[],!1,null,null,null);t.a=s.exports},dbd1:function(e,t,i){},e363:function(e,t,i){"use strict";var n=i("dbd1");i.n(n).a},e952:function(e,t,i){"use strict";var n=i("feaa");i.n(n).a},feaa:function(e,t,i){}}]);