<template>
  <main class="mp-erp-common-comps-basic-setup-element-set-common-comp-wrap">
    <div class="item-box">
      <p>
        <el-button type="primary" @click="onElementTemplateSetClick(null)">+添加界面元素</el-button>
      </p>
      <ElementTableComp :dataList='ElementDataList' @edit='onElementTemplateSetClick' @remove='onElementRemove' :loading='isLoadingElement' />
    </div>
    <ElementDialogComp
     :visible.sync='elementVisible'
     @submit="onElementSaveSubmit"
     :curData='curElementEditData'
     :isCommon='isCommon'
     :PositionID='PositionID'
     :commonList='commonElementList' />
    <template v-if="showGroup">
      <div class="item-box">
        <p>
          <el-button type="primary" @click="onElementGroupSetClick(null)">+添加界面元素组</el-button>
          <span v-if="!isCommon" class="blue-span" @click="onElementGroupCopyClick">根据元素组模板添加</span>
        </p>
        <ElementGroupTableComp :dataList='ElementGroupDataList' @edit='onElementGroupSetClick'
          @remove='onElementGroupRemove' @sort='onElementGroupSort' :loading='isLoadingGroup'/>
      </div>
      <ElementGroupDialogComp
        :visible.sync='elementGroupVisible'
        :ElementList='ElementDataList'
        :PositionID='PositionID'
        :curData='curElementGroupEditData'
        @submit="onElementGroupSaveSubmit" />
      <CommonSortDialogComp :SortList='curSortList' :visible.sync='sortVisible' @submit='onSortSubmit' />
      <ElementGroupTempSelector :visible.sync='groupTempVisible' :list='commonGroupList' @submit="onElementGroupCopySubmit" />
    </template>
  </main>
</template>

<script>
import ElementDialogComp from '@/components/ElementTemplate/ElementDialogComp.vue';
import ElementTableComp from '@/components/ElementTemplate/ElementTableComp.vue';
import ElementGroupTableComp from '@/components/ElementTemplate/ElementGroupTableComp.vue';
import ElementGroupDialogComp from '@/components/ElementTemplate/ElementGroupDialogComp.vue';
import CommonSortDialogComp from '@/components/common/NewComps/CommonSortDialogComp.vue';
import { mapState } from 'vuex';
import ElementGroupTempSelector from './ElementGroupTempSelector.vue';

export default {
  props: {
    ElementDataList: {
      type: Array,
      default: () => [],
    },
    ElementGroupDataList: {
      type: Array,
      default: () => [],
    },
    isLoadingElement: {
      type: Boolean,
      default: false,
    },
    isLoadingGroup: {
      type: Boolean,
      default: false,
    },
    isCommon: {
      type: Boolean,
      default: false,
    },
    PositionID: {
      type: String,
      default: '',
    },
    showGroup: {
      type: Boolean,
      default: true,
    },
    curUseElementModule: {},
  },
  components: {
    ElementDialogComp,
    ElementTableComp,
    ElementGroupDialogComp,
    ElementGroupTableComp,
    CommonSortDialogComp,
    ElementGroupTempSelector,
  },
  computed: {
    ...mapState('basicSet', { commonElementList: 'ElementDataList' }),
    ...mapState('basicSet', { commonGroupList: 'ElementGroupDataList' }),
  },
  data() {
    return {
      elementVisible: false,
      curElementEditData: null,
      elementGroupVisible: false,
      curElementGroupEditData: null,
      curSortItemData: null,
      curSortList: [],
      sortVisible: false,
      groupTempVisible: false, // 根据元素组模板添加数据
    };
  },
  methods: {
    // 元素处理方法 ↓
    onElementTemplateSetClick(itemData) { // 打开元素设置弹窗 并设置其编辑数据（添加设为null）
      this.curElementEditData = itemData || null;
      this.elementVisible = true;
    },
    async onElementSaveSubmit(saveData) { // 元素保存： 添加 | 编辑
      if (!saveData) return;
      const saveType = saveData.ID ? '编辑' : '添加';
      const _saveData = saveData;
      if (saveData.Type === 2 && saveData.OptionAttribute.UseTimes) {
        const { MaxValue, MinValue } = saveData.OptionAttribute.UseTimes;
        if (!MaxValue && !MinValue && (MinValue !== 0 || MaxValue !== 0)) delete _saveData.OptionAttribute.UseTimes;
      }
      if (this.curUseElementModule || this.curUseElementModule === 0) _saveData.Module = this.curUseElementModule;
      if (!_saveData.HiddenToCustomer) delete _saveData.DefaultValue;
      const resp = await this.api.getElementSave(_saveData).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const temp = {
          saveType,
          editData: saveData,
          ID: resp.data.Data,
        };
        const callback = () => { this.handleEditSubmitSuccess(temp); };
        this.messageBox.successSingle(`${saveType}成功!`, callback, callback);
      }
    },
    handleEditSubmitSuccess({ saveType, editData, ID }) { // 元素添加|编辑成功后的处理方法
      // 对仓库数据进行修改或添加 ElementDataList
      this.$emit('saveElement', { saveType, editData, ID });
      // 关闭弹窗
      this.elementVisible = false;
    },
    onElementRemove(itemData) {
      if (!itemData) return;
      this.messageBox.warnCancelBox('确定删除该元素吗', `元素名称：[ ${itemData.Name} ]`, () => {
        this.$emit('removeElement', itemData.ID);
      });
    },
    // 下面为元素组处理方法 ↓
    onElementGroupSetClick(groupItemData) { // 打开元素组设置弹窗 并设置其编辑数据（添加设为null）
      if (!groupItemData && (!this.ElementDataList || this.ElementDataList.length === 0)) {
        // 添加
        this.messageBox.failSingleError('操作失败', '请先添加界面元素');
        return;
      }
      this.curElementGroupEditData = groupItemData || null;
      this.elementGroupVisible = true;
    },
    async onElementGroupSaveSubmit(saveData) {
      if (!saveData) return;
      const saveType = saveData.ID ? '编辑' : '添加';
      const _saveData = saveData;
      if (this.curUseElementModule || this.curUseElementModule === 0) _saveData.Module = this.curUseElementModule;
      const resp = await this.api.getElementGroupSave(_saveData).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const temp = {
          saveType,
          editData: _saveData,
          ID: resp.data.Data,
        };
        const callback = () => { this.handleGroupSaveSuccess(temp); };
        this.messageBox.successSingle(`${saveType}成功!`, callback, callback);
      }
    },
    handleGroupSaveSuccess({ saveType, editData, ID }) { // 元素组添加|编辑成功后的处理方法
      this.$emit('saveElementGroup', { saveType, editData, ID });
      this.elementGroupVisible = false;
    },
    onElementGroupRemove(itemData) {
      if (!itemData) return;
      this.messageBox.warnCancelBox('确定删除该元素组吗', `元素组名称：${itemData.Name}`, () => {
        this.$emit('removeElementGroup', itemData.ID);
      });
    },
    // 下面为元素组模板复制处理方法 ↓
    onElementGroupCopyClick() {
      if (!this.commonGroupList || this.commonGroupList.length === 0) {
        this.messageBox.failSingleError('操作失败', '暂无元素组模板，请先到元素模板中添加');
        return;
      }
      this.groupTempVisible = true;
    },
    onElementGroupCopySubmit(GroupID) {
      const t = this.commonGroupList.find(it => it.ID === GroupID);
      if (t) {
        const _localGroupNames = this.ElementGroupDataList.map(it => it.Name);
        if (_localGroupNames.includes(t.Name)) {
          this.messageBox.failSingleError('添加失败', '当前界面元素组中已包含同名元素组，请检查');
          return;
        }
        const _localElementNames = this.ElementDataList.map(it => it.Name);
        const _Element = t.ElementList.find(it => _localElementNames.includes(it.Name));
        if (_Element) {
          this.messageBox.failSingleError('添加失败', `系统将自动新建 [${_Element.Name}] 元素，但在当前界面元素中已存在同名元素`);
          return;
        }
        const temp = { GroupID, PositionID: this.PositionID };
        this.fetchElementGroupCopy(temp);
      }
    },
    async fetchElementGroupCopy(data) {
      const _data = data;
      if (this.curUseElementModule || this.curUseElementModule === 0) _data.Module = this.curUseElementModule;
      const resp = await this.api.getElementGroupCopy(_data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 拷贝成功 重新获取数据
        const cb = () => {
          this.$emit('copyGroupSuccess');
          this.groupTempVisible = false;
        };
        this.messageBox.successSingle('通过元素组模板添加成功', cb, cb);
      }
    },
    // 下面为元素组排序处理方法 ↓
    onElementGroupSort(itemData) { // 打开弹窗 开始排序
      this.curSortList = itemData.ElementList;
      this.curSortItemData = itemData;
      this.sortVisible = true;
    },
    async onSortSubmit(list) {
      const _temp = {
        ID: this.curSortItemData.ID,
        ElementList: list.map(it => ({
          ID: it.ID,
          Index: it.Index,
        })),
      };
      const resp = await this.api.getElementGroupElementSort(_temp).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => { this.handleSortSuccess(_temp); };
        this.messageBox.successSingle('排序成功', callback, callback);
      }
    },
    handleSortSuccess(data) { // { ID, ElementList: { ID, Index } } 处理排序成功后的数据修改及弹窗关闭
      this.$emit('sortGroupElementList', data);
      this.sortVisible = false;
    },
  },
  mounted() {
    if (!this.isCommon) {
      if (this.showGroup) this.$store.dispatch('basicSet/getElementGroupList');
      this.$store.dispatch('basicSet/getElementList');
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-basic-setup-element-set-common-comp-wrap {
  > .item-box {
    > p {
      padding-top: 30px;
      padding-bottom: 25px;
      height: 35px;
      > button {
        height: 35px;
        padding: 0;
        width: 125px;
      }
      > .blue-span {
        font-size: 14px;
        margin-left: 25px;
      }
    }
  }
}
</style>
