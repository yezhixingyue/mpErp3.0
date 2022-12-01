<template>
  <section class="mp-erp-price-manage-makeup-ctrl-page-wrap">
    <header>
      <p>当前产品：{{$route.params.name}}</p>
      <el-radio-group v-model="curControlType" size="small">
        <el-radio-button
         v-for="type in MakeupControlTypeList"
         :label="type.ID"
         :key="type.ID"
         >
         {{type.Name}}（{{getTypeLength(type.ID)}}）
        </el-radio-button>
      </el-radio-group>
      <TopRadioButtonComp
        v-model="curSolutionID"
       :loading='isSolutionListLoading'
       :list='curTypeSolutionList'
       @remove='onRemoveClick'
       @itemSave='onSolutionSaveClick'
       />
    </header>
    <main :class="isTableDataloading || isPropertyListLoading?'loading':''">
      <SolutionSaveDialog :visible.sync="solutionSaveVisible" :saveData='solutionSaveData' @submit="onSolutionSaveSubmit" />
      <template v-if="curSolutionItem">
        <SolutionTableCom
          @remove='onTableItemRemove'
          @setup="onSetupPageJump($event, '', '')"
          @rowClick='onRowClick'
          :type='`${curControlType}`'
          :titleObj='getTitleObj(null, curControlType)'
          :dataList='getTargetItemList()'
          :activeRowID='activeRowID'
          >
          <template #title>
            <p class="tips-box"> <i class="el-icon-warning"></i> {{tipsContent}}</p>
          </template>
        </SolutionTableCom>
        <template v-if="curProduct && Array.isArray(curProduct.PartList)">
          <SolutionTableCom
          v-for="item in curProduct.PartList" :key="item.ID"
          @remove='onTableItemRemove'
          @setup="onSetupPageJump($event, item.ID, item.Name)"
          @rowClick='onRowClick'
          :type='`${curControlType}`'
          :title='item.Name'
          :titleObj='getTitleObj(item, curControlType)'
          :dataList='getTargetItemList(item.ID)'
          :activeRowID='activeRowID'
          />
        </template>
        <!-- 混拼设置 -->
        <template v-if="curControlType === 0">
          <SolutionTableCom
            v-for="item in canMixinMakeupPartList" :key="item.ID + 'mixin'"
            @remove='onMixinTableItemRemove($event, item.ID)'
            @setup="onSetupPageJump($event, item.ID, item.Name, true)"
            @rowClick='onRowClick'
            :type='`${curControlType}`'
            :title='item.Name'
            :titleObj="{title: `多个[ ${item.Name} ]混拼设置`, btnText: '+ 添加条件'}"
            :dataList='item.mixinList'
            :activeRowID='activeRowID'
            class="mixin-table"
            >
            <template #title>
              <div class="title-box">
                <span class="blue-span" @click="getMixtureMakeupChangeDefault(item)">设置默认</span>
                <span class="mixture">默认：{{item.mixinData.AllowMixture? '混拼' : '不混拼'}}</span>
                <span class="blue-span" @click="onSamePropertySetupClick(item)">相同条件设置</span>
                <span class="is-gray is-font-size-12 crafts" :title="getSamePropertyListText(item)">{{getSamePropertyListText(item)}}</span>
                <span class="blue-span" @click="onExcludeNumCtrlSetupClick(item)">排除数量设置</span>
                <span class="is-gray is-font-size-12">{{item.mixinData.ExcludeNumberFormulaText}}</span>
              </div>
            </template>
          </SolutionTableCom>
        </template>
      </template>
      <div v-else-if="!isSolutionListLoading">
        <p class="tips-box is-pink" style="margin: 0;width:300px"> <i  class="el-icon-warning"></i> 请设置并选择分类方案</p>
      </div>
      <PartMixinDefaultSetSaveDialog :visible.sync="mixinDefaultSetVisible" :saveData='mixinDefaultSaveData' @submit="onMixinDefaultSetSaveSubmit" />
      <FormulaPanelElementSelectDialog
       isMultiple
       title="相同条件设置"
       :visible.sync='SamePropertyVisible'
       :list='curMixinSamePropertyList'
       :MultipleCheckedList='setSameProperty&&setSameProperty.mixinData&&setSameProperty.mixinData.SamePropertyList
        ?setSameProperty.mixinData.SamePropertyList:[]'
       @select='onSamePropertySelected'
        />
      <PartMixinExcludeNumCtrlDialog :visible.sync="ExcludeNumCtrlVisible" :curData='curExcludeNumCtrlData' @submit="onExcludeNumCtrlSubmit" />
    </main>
    <footer>
      <el-button class="goback" @click="onGobackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import SolutionSaveDialog from '@/components/PriceComps/MakeupCtrl/SolutionSaveDialog';
import PartMixinDefaultSetSaveDialog from '@/components/PriceComps/MakeupCtrl/PartMixinDefaultSetSaveDialog.vue';
import SolutionTableCom from '@/components/PriceComps/MakeupCtrl/SolutionTableCom.vue';
import { FormulaPanelElementSelectDialog } from '@/components/common/mpzj-sell-lib/lib';
import PartMixinExcludeNumCtrlDialog from '@/components/PriceComps/MakeupCtrl/PartMixinExcludeNumCtrlDialog.vue';
import TopRadioButtonComp from '@/components/common/NewComps/TopRadioButtonComp';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'MakeupCtrl',
  mixins: [recordScrollPositionMixin('main.page-wrap')],
  components: {
    SolutionSaveDialog,
    SolutionTableCom,
    PartMixinDefaultSetSaveDialog,
    FormulaPanelElementSelectDialog,
    PartMixinExcludeNumCtrlDialog,
    TopRadioButtonComp,
  },
  computed: {
    ...mapState('priceManage', ['MakeupControlTypeList', 'ProductFormulaPropertyList', 'PriceManageList']),
    curTypeSolutionList() {
      if (!this.solutionList || (!this.curControlType && this.curControlType !== 0) || this.solutionList.length === 0) return [];
      return this.solutionList.filter(it => it.Type === this.curControlType);
    },
    curSolutionItem() {
      if (!this.curSolutionID) return null;
      return this.solutionList.find(it => it.ID === this.curSolutionID);
    },
    localSolutionDataList() {
      return this.getReductionList(this.MakeupRuleItemList, this.AllPropertyList);
    },
    curProduct() {
      if (Array.isArray(this.PriceManageList) && this.$route.params.id) {
        return this.PriceManageList.find(it => it.ID === this.$route.params.id);
      }
      return null;
    },
    canMixinMakeupPartList() { // 可以混拼的部件列表
      if (!this.curProduct) return [];
      return this.curProduct.PartList.filter(it => it.UseTimes && it.UseTimes.MaxValue > 1).map(it => {
        let mixinData = {
          AllowMixture: false,
          ExcludeNumberFormula: null,
          ID: '',
          List: [],
          PartID: it.ID,
          SamePropertyList: [],
          SolutionID: this.curSolutionID,
        };
        let mixinList = [];
        if (Array.isArray(this.MixtureMakeupList) && this.MixtureMakeupList.length > 0) {
          const t = this.MixtureMakeupList.find(_it => _it.PartID === it.ID);
          if (t) mixinData = t;
          if (t && Array.isArray(t.List)) {
            mixinList = this.getReductionList(t.List, this.AllPropertyList, t.PartID);
          }
        }
        const ExcludeNumberFormulaList = this.ProductFormulaPropertyList.filter(_it => _it.PartID && _it.PartID === it.ID && !_it.GroupID);
        // const t = ExcludeNumberFormulaList.find(_it => _it.ID === mixinData.ExcludeNumberFormula);
        const ExcludeNumberFormulaText = mixinData.ExcludeNumberFormula ? `排除数量：${mixinData.ExcludeNumberFormula.Name}` : '未设置';
        mixinData.ExcludeNumberFormulaText = ExcludeNumberFormulaText;
        mixinData.ExcludeNumberFormulaList = ExcludeNumberFormulaList;
        return {
          ...it,
          mixinData,
          mixinList,
        };
      });
    },
    tipsContent() {
      let tip = '';
      switch (this.curControlType) {
        case 0:
          tip = '注：未设置的产品 / 部件，不拼版';
          break;
        case 1:
          tip = '注：未指定幅面的产品 / 部件，不拼版';
          break;
        case 2:
          tip = '适用于画册等需要按折手方式拼版的产品，不设置则认为按1张拼版';
          break;
        case 3:
          tip = '未指定算法时，使用“考虑通刀”算法';
          break;
        case 4:
          tip = '未设置的产品 / 部件，按物料数量计算';
          break;
        case 5:
          tip = '损耗计算先匹配“物料损耗设为”数值的条目，仅匹配一条，如果没有，则损耗设为 0；然后匹配损耗增加条目，可匹配多条进行累加';
          break;
        case 6:
          tip = '未指定物料尺寸的产品/部件，不拼版';
          break;
        default:
          break;
      }
      return tip;
    },
    curUseModule() {
      const t = this.MakeupControlTypeList.find(it => it.ID === this.curControlType);
      return t ? t.UseModule : null;
    },
  },
  data() {
    return {
      curControlType: 0,
      curSolutionID: '',
      solutionSaveVisible: false,
      solutionSaveData: null,
      solutionList: [],
      isSolutionListLoading: true,
      MakeupRuleItemList: [],
      isTableDataloading: false,
      isPropertyListLoading: true,
      mixinDefaultSetVisible: false,
      mixinDefaultSaveData: null,
      MixtureMakeupList: [], // 混拼数据列表
      SamePropertyData: {}, // 相同条件设置属性列表数据
      curMixinSamePropertyList: [], // 当前打开的相同属性弹窗属性选择列表
      SamePropertyVisible: false,
      setSameProperty: null, // 正在设置相同条件设置的部件项目数据
      ExcludeNumCtrlVisible: false, // 排除数量设置弹窗开关
      curExcludeNumCtrlData: null,
      AllPropertyList: [],
      activeRowID: '',
    };
  },
  methods: {
    getReductionList(list, AllPropertyList, PartID) {
      if (!Array.isArray(list) || list.length === 0) return [];
      const _list = JSON.parse(JSON.stringify(list)).map(it => {
        let t = AllPropertyList.find(_it => (
          _it.ProductID === it.ProductID && _it.UseModule === this.curUseModule && ((!_it.PartID && !it.PartID) || it.PartID === _it.PartID)
        ));
        if (!t && PartID) {
          t = AllPropertyList.find(_it => _it.PartID === PartID && _it.UseModule === this.curUseModule);
        }
        if (!t) return it;
        const { Constraint } = it;
        const [_Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(Constraint, t.PropertyList);
        return { ...it, Constraint: _Constraint, _ConditionText };
      });
      return _list;
    },
    onGobackClick() {
      this.$router.replace('/PriceManageList');
    },
    onSolutionSaveClick(ID) {
      const data = ID ? this.solutionList.find(it => it.ID === ID) : null;
      const temp = {
        ID: data ? data.ID : '',
        Name: data ? data.Name : '',
        Type: this.curControlType,
        ProductID: this.$route.params.id,
      };
      this.solutionSaveData = temp;
      this.solutionSaveVisible = true;
    },
    async onSolutionSaveSubmit(data) { // 保存拼版方案
      const nameSameItem = this.curTypeSolutionList.find(it => it.Name === data.Name);
      if (nameSameItem) {
        if (nameSameItem.ID === data.ID) {
          this.messageBox.failSingleError('保存失败', '方案名称未发生更改');
        } else {
          this.messageBox.failSingleError('保存失败', '存在相同的方案名称');
        }
        return;
      }
      const resp = await this.api.getMakeupSolutionSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          if (!data.ID) { // 新增
            this.solutionList.push({ ...data, ID: resp.data.Data });
            if (this.curTypeSolutionList.length === 1) this.curSolutionID = resp.data.Data;
          } else { // 编辑
            const t = this.solutionList.find(it => it.ID === data.ID);
            if (t) t.Name = data.Name;
          }
          this.solutionSaveVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getMakeupSolutionList() { // 获取拼版方案列表数据
      const resp = await this.api.getMakeupSolutionList(this.$route.params.id).catch(() => {});
      this.isSolutionListLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.solutionList = resp.data.Data;
        if (this.solutionList.length > 0) {
          const t = this.solutionList.find(it => it.Type === this.curControlType);
          if (t) this.curSolutionID = t.ID;
        }
      }
    },
    onRemoveClick() {
      this.messageBox.warnCancelBox('确定要删除当前方案吗', `方案名称：[ ${this.curSolutionItem ? this.curSolutionItem.Name : '未知方案名称'} ]`, () => {
        this.getMakeupSolutionRemove();
      });
    },
    async getMakeupSolutionRemove() { // 删除方案
      const resp = await this.api.getMakeupSolutionRemove(this.curSolutionID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const i = this.solutionList.findIndex(it => it.ID === this.curSolutionID);
          if (i > -1) {
            this.solutionList.splice(i, 1);
            const _atterList = this.solutionList.slice(i);
            const t = _atterList.find(it => it.Type === this.curControlType);
            if (t) this.curSolutionID = t.ID;
            else {
              const _formerList = this.solutionList.slice(0, i).reverse();
              const t2 = _formerList.find(it => it.Type === this.curControlType);
              if (t2) this.curSolutionID = t2.ID;
              else this.curSolutionID = '';
            }
          }
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    getTypeLength(type) {
      return this.solutionList.filter(it => it.Type === type).length;
    },
    getTitleObj(item) { // 获取表格头部标题
      const str = this.$utils.getNameFromListByIDs(this.curControlType, this.MakeupControlTypeList);
      let front = '+ 添加';
      if ([1, 4].includes(this.curControlType)) front = '设置';
      if ([0].includes(this.curControlType)) front = '+ 添加拼版';
      const behind = front.includes('设置') ? '' : '设置';
      return {
        title: `${item ? item.Name : '产品'}${str}`,
        btnText: `${front}${str}${behind}`,
      };
    },
    async onTableItemRemove(e) {
      if (!e || !e.ID) return;
      const resp = await this.api.getMakeupSolutionItemRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.MakeupRuleItemList = this.MakeupRuleItemList.filter(it => it.ID !== e.ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async onMixinTableItemRemove(e, PartID) {
      if (!e || !e.ID) return; // e.PartID
      const resp = await this.api.getMixtureMakeupItemRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const t = this.MixtureMakeupList.find(it => it.PartID === PartID);
          if (t) t.List = t.List.filter(it => it.ID !== e.ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onSetupPageJump(data, PartID, PartName, isMixin) { // 跳转条件配置页面
      if (!data) return;
      const [setType, editData] = data;
      const ProductID = this.$route.params.id;
      const params = {
        ProductID,
        PartID: PartID || 'null',
        ProductName: this.$route.params.name,
        PartName: PartName || 'null',
        SolutionName: this.curSolutionItem.Name,
        SolutionID: this.curSolutionItem.ID,
        isMixin: isMixin || false,
        setType,
      };
      this.$store.commit('priceManage/setCurMakeupItemEditData', editData);
      this.activeRowID = editData ? editData.ID || '' : '';
      // setMakeupCtrlConditionSetupPropertyList
      // eslint-disable-next-line max-len
      const t = this.AllPropertyList.find(it => it.UseModule === this.curUseModule && it.ProductID === ProductID && (it.PartID === PartID || (!PartID && !it.PartID)));
      if (t) {
        this.$store.commit('priceManage/setMakeupCtrlConditionSetupPropertyList', t.PropertyList);
        this.$router.push({ name: 'MakeupCtrlConditionSet', params });
      }
    },
    async getMakeupRuleItemList() { // 获取混拼方案列表数据
      if (!this.curSolutionID) return;
      this.isTableDataloading = true;
      const resp = await this.api.getMakeupRuleItemList(this.curSolutionID).catch(() => {});
      this.isTableDataloading = false;
      if (resp && resp.data.Status === 1000) {
        this.MakeupRuleItemList = resp.data.Data;
      }
    },
    getTargetItemList(PartID) {
      if (!Array.isArray(this.localSolutionDataList)) return [];
      if (PartID) {
        return this.localSolutionDataList.filter(it => it.PartID === PartID);
      }
      return this.localSolutionDataList.filter(it => !it.PartID);
    },
    async getMixtureMakeupList() { // 获取混拼列表
      if (!this.curSolutionID || this.curControlType !== 0) return;
      const resp = await this.api.getMixtureMakeupList(this.curSolutionID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.MixtureMakeupList = await Promise.all(resp.data.Data.map(async (it) => {
          const list = await this.getSamePropertyList(it.PartID);
          const SamePropertyList = it.SamePropertyList.map(_it => PropertyClass.getPerfectPropertyByImperfectProperty(_it, list)).filter(_it => _it);
          return { ...it, SamePropertyList };
        }));
      }
    },
    async onMixinDefaultSetSaveSubmit(e) {
      if (!e) return;
      const { solutionID, partID } = e;
      const resp = await this.api.getMixtureMakeupChangeDefault(solutionID, partID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const t = this.MixtureMakeupList.find(_it => _it.PartID === partID);
          if (t) t.AllowMixture = !t.AllowMixture;
          else this.getMixtureMakeupList();
          this.mixinDefaultSetVisible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    getMixtureMakeupChangeDefault(item) {
      const temp = { Part: item, solutionID: this.curSolutionID };
      this.mixinDefaultSaveData = temp;
      this.mixinDefaultSetVisible = true;
    },
    async onSamePropertySetupClick(item) { // 相同条件设置点击
      this.setSameProperty = item;
      this.curMixinSamePropertyList = await this.getSamePropertyList(item.ID);
      this.SamePropertyVisible = true;
    },
    async getSamePropertyList(PartID) {
      if (Array.isArray(this.SamePropertyData[PartID]) && this.SamePropertyData[PartID].length > 0) return this.SamePropertyData[PartID];
      const resp = await PropertyClass.getPropertyList({ ProductID: this.$route.params.id, UseModule: 23, PartID });
      this.SamePropertyData[PartID] = resp;
      return resp;
    },
    getMixinDataList(ID) {
      if (Array.isArray(this.MixtureMakeupList) && this.MixtureMakeupList.length > 0) {
        const t = this.MixtureMakeupList.find(it => it.PartID === ID);
        return t ? t.List : [];
      }
      return [];
    },
    async onSamePropertySelected(List) {
      const temp = {
        List,
        PartID: this.setSameProperty.ID,
        SolutionID: this.curSolutionID,
      };
      const resp = await this.api.getMixtureMakeupSamePropertySetup(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const t = this.MixtureMakeupList.find(_it => _it.PartID === this.setSameProperty.ID);
          if (t) t.SamePropertyList = List;
          else this.getMixtureMakeupList();
          this.SamePropertyVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    getSamePropertyListText(item) {
      if (item && item.mixinData && Array.isArray(item.mixinData.SamePropertyList) && item.mixinData.SamePropertyList.length > 0) {
        return `${item.mixinData.SamePropertyList.map(it => (it ? it.DisplayContent.replace(/\[|\]/g, '') : '')).filter(it => it).join('、')} 相同`;
      }
      return '无';
    },
    onExcludeNumCtrlSetupClick(item) { // 排除数量控制点击开关
      if (!item || !item.mixinData) return;
      if (item.mixinData.ExcludeNumberFormulaList.length === 0) {
        this.messageBox.failSingle('当前部件上没有设置子公式');
        return;
      }
      this.curExcludeNumCtrlData = {
        PartID: item.ID,
        ExcludeNumberFormula: item.mixinData.ExcludeNumberFormula,
        ExcludeNumberFormulaList: item.mixinData.ExcludeNumberFormulaList,
      };
      this.ExcludeNumCtrlVisible = true;
    },
    async onExcludeNumCtrlSubmit(formularID) {
      const { PartID, ExcludeNumberFormulaList } = this.curExcludeNumCtrlData;
      const resp = await this.api.getMixtureMakeupExcludeNumberSetup(this.curSolutionID, PartID, formularID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const t = this.MixtureMakeupList.find(_it => _it.PartID === PartID);
          if (t) {
            if (!formularID) {
              t.ExcludeNumberFormula = null;
            } else {
              const targetFormular = ExcludeNumberFormulaList.find(it => it.ID === formularID);
              if (targetFormular) t.ExcludeNumberFormula = targetFormular;
            }
          } else this.getMixtureMakeupList();
          this.ExcludeNumCtrlVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getAllPropertyList() {
      if ((this.curUseModule || this.curUseModule === 0) && this.curProduct) {
        this.isPropertyListLoading = true;
        const ProductID = this.curProduct.ID;
        const PartIDs = this.curProduct.PartList?.map(it => it.ID) || [];
        const list = [{ ProductID, UseModule: this.curUseModule }];
        const Parts = PartIDs.map(it => ({ ProductID, UseModule: this.curUseModule, PartID: it }));
        list.push(...Parts);
        const _AllPropertyList = await Promise.all(list.map(async (it) => {
          const _t = this.AllPropertyList.find(_it => _it.ProductID === it.ProductID && _it.PartID === it.PartID && _it.UseModule === it.UseModule);
          // console.log(_t);
          if (_t) return _t;
          const PropertyList = await PropertyClass.getPropertyList(it);
          return { ...it, PropertyList };
        })).catch(() => {});
        this.AllPropertyList.push(..._AllPropertyList);
        this.isPropertyListLoading = false;
      }
    },
    onRowClick(ID) {
      this.activeRowID = ID;
    },
  },
  watch: {
    curControlType() {
      if (this.curTypeSolutionList.length > 0) this.curSolutionID = this.curTypeSolutionList[0].ID;
      else this.curSolutionID = '';
      this.MakeupRuleItemList = [];
      this.getAllPropertyList();
    },
    curSolutionID() {
      this.getMakeupRuleItemList();
      this.getMixtureMakeupList();
    },
  },
  created() {
    this.$store.dispatch('priceManage/getProductFormulasListJoinCalculate', this.$route.params.id);
  },
  async mounted() {
    this.getMakeupSolutionList();
    await this.$store.dispatch('priceManage/getMakeupPropertyList', this.$route.params.id);
    this.getAllPropertyList();
    this.isPropertyListLoading = false;
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'MakeupCtrlConditionSet') {
      next(vm => {
        vm.getMakeupRuleItemList();
        vm.getMixtureMakeupList();
      });
    } else {
      next();
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-makeup-ctrl-page-wrap {
  padding: 0 10px;
  background-color: #f5f5f5;
  min-width: 980px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
    padding-bottom: 25px;
    background-color: #fff;
    flex: none;
    > p {
      font-weight: 700;
      line-height: 30px;
      font-size: 15px;
      color: #21CAE3;
      margin-bottom: 25px;
    }
    .el-radio-group {
      > .el-radio-button {
        user-select: none;
        .el-radio-button__inner {
          font-size: 14px;
          padding: 5px 16px;
          padding-left: 20px;
          // width: 120px;
          line-height: 20px;
        }
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          z-index: 10;
          left: 10px;
          top: calc(50% - 2px);
          transition: opacity 0.1s ease-in-out;
        }
        &.is-active{
          &::before {
            opacity: 1;
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 30px;
    padding-right: 8px;
    // > .mp-erp-product-module-interaction-risk-warning-table-com-container {
    //   > header {
    //   }
    // }
    &.loading {
      > section, > div > section {
        opacity: 0.2;
      }
    }
    .tips-box {
      min-width: 300px;
      margin-left: 35px;
      width: auto;
      white-space: nowrap;
    }
    .title-box {
      font-size: 12px;
      padding-left: 20px;
      white-space: nowrap;
      flex: 1;
      overflow: hidden;
      display: flex;
      > span {
        line-height: 18px;
        flex: 0 1 auto;
        &.blue-span {
          font-size: 13px;
          width: 160px;
          text-align: right;
          margin-right: 6px;
          &:first-of-type {
            margin-right: 20px;
          }
        }
        &.crafts {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 560px;
          min-width: 3em;
        }
      }
    }
    .mixin-table {
      > header {
        padding-right: 15px;
        box-sizing: border-box;
        .mp-common-title-wrap {
          min-width: 223px;
        }
        .title-box {
          .mixture {
            color: #989898;
            font-size: 12px;
            width: 6em;
            flex: none;
          }
        }
      }
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
  }
}
</style>
