<template>
  <section class="mp-erp-product-list-page-craft-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
      <p>
        <el-button type="primary" size="small" @click="craftVisible = true">设置可用工艺</el-button>
        <span class="text" :title="usableCraftText">{{usableCraftText}}</span>
        <span class="blue-span" @click="sortVisible = true" :class="CraftList && CraftList.length > 0 ? '' : 'disabled'">设置排序</span>
      </p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='50%' v-if="curProduct">
        <template v-slot:left>
          <ContentLeft
           ref='oLeft'
           :usableCraftList='CraftList'
           :CraftConditionList='CraftConditionList'
           @submit='onSingleCraftSaveSubmit'
           @remove='onSingleCraftRemove'
           />
        </template>
        <template v-slot:right>
          <ContentRight
           ref='oRight'
           :usableCraftList='CraftList'
           :CraftGroupList='CraftGroupList'
           @setHiddenCraftList='setHiddenCraftList'
           @setGroupCraftList='setGroupCraftList'
           />
        </template>
      </LRWidthDragAutoChangeComp>
      <UsableCraftSetDialog :usableCraftList='CraftList' :visible.sync='craftVisible' @submit="onUsableCraftSetSubmit" />
      <MaterialSortDialog title="可用工艺排序" :visible.sync='sortVisible' v-model="SortListData" />
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import ContentLeft from '@/components/ProductManageComps/CraftSet/ContentLeft.vue';
import ContentRight from '@/components/ProductManageComps/CraftSet/ContentRight.vue';
import UsableCraftSetDialog from '@/components/ProductManageComps/CraftSet/UsableCraftSetDialog.vue';
import MaterialSortDialog from '@/components/ProductManageComps/SizeMaterial/MaterialSortDialog.vue';

export default {
  components: {
    LRWidthDragAutoChangeComp,
    ContentLeft,
    ContentRight,
    UsableCraftSetDialog,
    MaterialSortDialog,
  },
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '',
      CraftList: [],
      CraftConditionList: [],
      CraftGroupList: [],
      craftVisible: false,
      sortVisible: false,
    };
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    usableCraftText() {
      if (!this.CraftList || this.CraftList.length === 0) return '';
      return this.CraftList.map(it => it.Name).join('、');
    },
    SortListData: {
      get() {
        if (!this.CraftList || !Array.isArray(this.CraftList) || this.CraftList.length === 0) return [];
        return this.CraftList.map(({ ID, Name }) => ({ ID, Name }));
      },
      set(val) {
        if (!val || val.length === 0) return;
        this.onSortSubmit(val);
      },
    },
  },
  methods: {
    getPositionID() { // 获取初始url信息 并 触发初始数据获取
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.getProductOrPartCraftData();
    },
    async getProductOrPartCraftData(dataType = ['Craft', 'CraftCondition', 'CraftDisplayGroup']) { // 获取初始可用工艺列表 及 已设置工艺条件列表
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        // 获取数据成功
        const { CraftList, CraftConditionList, CraftGroupList } = resp.data.Data;
        if (dataType.includes('Craft') && CraftList) this.CraftList = CraftList;
        if (dataType.includes('CraftCondition') && CraftConditionList) this.CraftConditionList = CraftConditionList;
        if (dataType.includes('CraftDisplayGroup') && CraftGroupList) this.CraftGroupList = CraftGroupList;
      }
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    async onUsableCraftSetSubmit(data) {
      const { ProductID, PartID } = this;
      const List = data.map(it => it.ID);
      const temp = { ProductID, PartID, List };
      const resp = await this.api.getProductCraftUsableSet(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.CraftList = data;
          this.craftVisible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    async onSortSubmit(list) { // 可用工艺排序
      const { ProductID, PartID } = this;
      const TypeList = list.map(it => it.ID);
      const temp = { ProductID, PartID, TypeList };
      const resp = await this.api.getProductCraftOrder(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          const _newList = [];
          const _oldList = JSON.parse(JSON.stringify(this.CraftList));
          TypeList.forEach(TypeID => {
            _oldList.forEach((it, i) => {
              if (it && it.ID === TypeID) {
                _newList.push(it);
                _oldList.splice(i, 1, null);
              }
            });
          });
          this.CraftList = _newList;
          this.sortVisible = false;
        };
        this.messageBox.successSingle('保存排序成功', cb, cb);
      }
    },
    async onSingleCraftSaveSubmit(data) {
      const { ProductID, PartID } = this;
      const temp = { ProductID, PartID, ...data };
      const resp = await this.api.getProductCraftConditionSave(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑单选工艺成功' : '添加单选工艺成功';
        const cb = () => {
          if (!isEdit) this.CraftConditionList.push({ ...temp, ID: resp.data.Data });
          else {
            const i = this.CraftConditionList.findIndex(it => it.ID === temp.ID);
            if (i > -1) this.CraftConditionList.splice(i, 1, temp);
          }
          this.$refs.oLeft.visible = false;
        };
        this.messageBox.successSingle(msg, cb, cb);
      }
    },
    async onSingleCraftRemove(data) {
      if (!data) return;
      const { ID } = data;
      const resp = await this.api.getProductCraftConditionRemove(ID).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          const i = this.CraftConditionList.findIndex(it => it.ID === ID);
          if (i > -1) this.CraftConditionList.splice(i, 1);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async setHiddenCraftList(list) { // 设置工艺对客户隐藏
      if (!list || list.length === 0) return;
      const { ProductID, PartID } = this;
      const List = list.filter(it => it.HiddenToCustomer).map(it => it.ID);
      const temp = { ProductID, PartID, List };
      const resp = await this.api.getProductCraftSetHidden(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.CraftList = list;
          this.$refs.oRight.DisplayHiddenVisible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    async setGroupCraftList(list) { // 设置工艺显示分组
      if (!list || list.length === 0) return;
      const { ProductID, PartID } = this;
      const temp = { ProductID, PartID, List: list };
      const resp = await this.api.getProductCraftSetGroup(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.CraftGroupList = list;
          this.$refs.oRight.DisplayGroupingVisible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-craft-set-comp-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 120px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    white-space: nowrap;
    > p {
      padding-top: 15px;
      white-space: nowrap;
      > button {
        width: 125px;
      }
      > span {
        font-size: 12px;
        font-weight: 400;
        margin-left: 18px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        &.text {
          color: #999;
          max-width: calc(100% - 220px);
          min-width: 100px;
        }
      }
    }
  }
  > main {
    flex: 1;
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    flex: none;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      color: #26BCF9;
    }
  }
}
</style>
