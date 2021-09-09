<template>
  <CommonElementSetComp
    :ElementDataList='ElementDataList'
    :ElementGroupDataList='ElementGroupDataList'
    :isLoadingElement='isLoadingElement'
    :isLoadingGroup='isLoadingGroup'
    :PositionID='PositionID'
    :showGroup='showGroup'
    :curUseElementModule='curUseElementModule'
    @saveElement='handleEditSubmitSuccess'
    @removeElement='onElementRemove'
    @saveElementGroup='handleGroupSaveSuccess'
    @removeElementGroup='onElementGroupRemove'
    @sortGroupElementList='handleSortSuccess'
    @copyGroupSuccess='fetchData'
    />
</template>

<script>
import CommonElementSetComp from './CommonElementSetComp.vue';

export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    GroupID: {
      type: String,
      default: '',
    },
    showGroup: {
      type: Boolean,
      default: true,
    },
    canRemove: {
      type: Function,
      default: null,
    },
    curUseElementModule: {},
  },
  data() {
    return {
      ElementDataList: [],
      ElementGroupDataList: [],
      isLoadingElement: false,
      isLoadingGroup: false,
    };
  },
  components: {
    CommonElementSetComp,
  },
  methods: {
    handleEditSubmitSuccess({ saveType, editData, ID }) { // 元素添加|编辑成功后的处理方法
      const itemData = editData;
      const isEdit = saveType === '编辑';
      if (!isEdit) {
        itemData.ID = ID;
        this.ElementDataList.push(itemData);
      } else if (isEdit) {
        const i = this.ElementDataList.findIndex(it => it.ID === itemData.ID);
        if (i >= 0) this.ElementDataList.splice(i, 1, itemData);
      }
      this.$emit('elementSave', { isEdit, data: itemData });
    },
    async onElementRemove([id, Module]) {
      const bool = this.canRemove ? this.canRemove(id) : true;
      if (!bool) return;
      if (this.ElementGroupDataList && this.ElementGroupDataList.length > 0) {
        const _list = [];
        this.ElementGroupDataList.forEach(it => _list.push(...it.ElementList));
        const t = _list.find(it => it.ID === id);
        if (t) {
          this.messageBox.failSingleError('删除失败', '该元素在界面元素组中已使用');
          return;
        }
      }
      const resp = await this.api.getElementRemove(id, Module).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          this.ElementDataList = this.ElementDataList.filter(it => it.ID !== id);
          this.$emit('elementRemove', id);
        };
        this.messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getElementList() {
      this.isLoadingElement = true;
      const resp = await this.api.getElementList({ groupID: this.GroupID, positionID: this.PositionID }).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.ElementDataList = resp.data.Data;
      }
      this.isLoadingElement = false;
    },
    handleGroupSaveSuccess({ saveType, editData, ID }) { // 元素组添加|编辑成功后的处理方法
      const itemData = editData;
      const changeElementGroupProp = () => { // 修改元素列表中使用到的元素group属性(所属元素组)，对其进行赋值
        const _groupIncludesElementIDs = itemData.ElementList.map(sub => sub.ID);
        this.ElementDataList.forEach(it => {
          const _it = it;
          if (_groupIncludesElementIDs.includes(it.ID)) {
            if (_it && (!_it.Group || _it.Group.ID !== ID)) {
              _it.Group = {
                ID,
                Name: itemData.Name,
              };
            }
          } else if (_it.Group && _it.Group.ID === ID) {
            _it.Group = null;
          }
        });
      };
      if (saveType === '添加') {
        itemData.ID = ID;
        this.ElementGroupDataList.push(itemData);
        changeElementGroupProp();
        this.$emit('elementGroupSave', { isEdit: false, data: itemData });
      } else if (saveType === '编辑') {
        const i = this.ElementGroupDataList.findIndex(it => it.ID === itemData.ID);
        if (i >= 0) {
          this.ElementGroupDataList.splice(i, 1, itemData);
          changeElementGroupProp();
          this.$emit('elementGroupSave', { isEdit: true, data: itemData });
        }
      }
    },
    async onElementGroupRemove(id) {
      const resp = await this.api.getElementGroupRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          const t = this.ElementGroupDataList.find(it => it.ID === id);
          t.ElementList.forEach(it => {
            const _t = this.ElementDataList.find(ele => ele.ID === it.ID);
            if (_t) _t.Group = null;
          });
          this.ElementGroupDataList = this.ElementGroupDataList.filter(it => it.ID !== id);
          this.$emit('elementGroupRemove', id);
        };
        this.messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getElementGroupList() {
      this.isLoadingGroup = true;
      const resp = await this.api.getElementGroupList(this.PositionID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.ElementGroupDataList = resp.data.Data;
      }
      this.isLoadingGroup = false;
    },
    handleSortSuccess({ ID, ElementList }) { // { ID, ElementList: { ID, Index } } 处理排序成功后的数据修改及弹窗关闭
      const t = this.ElementGroupDataList.find(it => it.ID === ID);
      if (t) {
        t.ElementList = t.ElementList.map(it => {
          const _t = ElementList.find(sub => sub.ID === it.ID);
          if (_t) {
            return {
              ...it,
              Index: _t.Index,
            };
          }
          return { ...it };
        });
      }
    },
    fetchData() {
      this.getElementList();
      if (this.showGroup) this.getElementGroupList();
      this.$emit('copyGroupSuccess');
    },
  },
  mounted() {
    this.getElementList();
    if (this.showGroup) this.getElementGroupList();
  },
};
</script>
<style lang='scss'>
</style>
