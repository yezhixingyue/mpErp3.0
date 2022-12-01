<template>
  <section class="mp-erp-price-module-sub-condition-set-page--wrap">
    <header>
      <span>当前产品：</span>
      <span>{{Name}}</span>
      <p>
        <el-button type="primary" size="small" @click="onSubCondtionAddClick">添加子条件</el-button>
      </p>
    </header>
    <main :class="{loading: allLoading || listLoading}">
      <ChildCondtionPartSelectDialog :visible.sync='visible' :list='canSetPartList' @select="handlePartSelect" />
      <ul>
        <li v-for="(it, i) in localChildConditionList" :key="it.ID" @click="onRowClick(it)" :class="{active: activeRowID === it.ID}">
          <span class="sort">{{i + 1}}.</span>
          <div class="name">{{it.Name}}</div>
          <div class="condition">
            <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
              <div slot="content">
                <p class="if-box">{{it.FilterTypeText}}：</p>
                <template v-if="Array.isArray(it._ConditionText)">
                  <p v-for="(item, i) in it._ConditionText" :key="item.name + 'tips' + i">
                    <span v-if="i > 0" class="type">{{it.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                    <span class="name">{{item.name}}</span>
                    <span class="is-origin">{{item.operator}}</span>
                    <span class="val">{{item.val}}</span>
                    <span v-if="i === it._ConditionText.length - 1" style="margin-left:2px"> 。</span>
                    <span v-else style="margin-left:2px">；</span>
                  </p>
                </template>
                <p v-else>{{it._ConditionText}}</p>
              </div>
              <div class="common-property-condition-text-content-box">
                <p class="if-box">{{it.FilterTypeText}}</p>
                <template v-if="Array.isArray(it._ConditionText)">
                  <p v-for="(item, i) in it._ConditionText" :key="item.name + 'content' + i">
                    <span v-if="i > 0" class="type">{{it.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                    <span>{{item.name}}</span>
                    <span>{{item.operator}}</span>
                    <span>{{item.val}}</span>
                  </p>
                </template>
                <p v-else>{{it._ConditionText}}</p>
              </div>
            </el-tooltip>
          </div>
          <div class="target">{{it.PartName}}</div>
          <div class="count">引用次数：{{it.UseTimes}}次</div>
          <CtrlMenus @edit='onEditClick(it)' @remove='onRemoveClick(it)' />
        </li>
      </ul>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ChildCondtionPartSelectDialog from '@/components/PriceComps/SubCondition/ChildCondtionPartSelectDialog';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

export default {
  name: 'subConditionList',
  components: {
    ChildCondtionPartSelectDialog,
    CtrlMenus,
  },
  data() {
    return {
      ProductID: '',
      Name: '',
      ChildConditionList: [],
      visible: false,
      allLoading: true,
      listLoading: true,
      activeRowID: '',
    };
  },
  computed: {
    ...mapState('priceManage', ['PriceManageList', 'ChildConditionPropertyList']),
    curProduct() {
      if (Array.isArray(this.PriceManageList) && this.ProductID) {
        return this.PriceManageList.find(it => it.ID === this.ProductID);
      }
      return null;
    },
    canSetPartList() {
      if (!this.curProduct || this.curProduct.PartList.length === 0) return [];
      return this.curProduct.PartList.filter(it => it.UseTimes && it.UseTimes.MaxValue > 1);
    },
    canSetPartListIDs4Fetch() {
      return this.canSetPartList.map(it => ({ ProductID: it.ProductID, PartID: it.ID }));
    },
    localChildConditionList() {
      return this.getReductionList(this.ChildConditionList, this.ChildConditionPropertyList);
    },
  },
  methods: {
    getPathData() { // 初始化获取地址栏参数
      const { id, name } = this.$route.params;
      this.ProductID = id;
      this.Name = name;
    },
    onGoBackClick() {
      this.$router.replace('/PriceManageList');
    },
    onSubCondtionAddClick() {
      if (this.canSetPartList.length === 0) {
        this.messageBox.failSingleError('添加失败', '仅存在多次使用的部件时才可设置子条件');
        return;
      }
      this.visible = true;
    },
    async getProductChildConditionList() { // 获取列表数据
      this.listLoading = true;
      const resp = await this.api.getProductChildConditionList(this.ProductID).catch(() => {});
      this.listLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.ChildConditionList = resp.data.Data;
      }
    },
    handlePartSelect(e) {
      if (!e) return;
      const { ID, Name } = e;
      this.$store.commit('priceManage/setCurChildConditionEditData', null);
      this.visible = false;
      setTimeout(() => {
        this.$router.push({ name: 'subConditionSet', params: { PartID: ID, PartName: Name, ProductName: this.Name } });
      }, 100);
    },
    async fetchData() {
      await Promise.all([this.getProductChildConditionList(), this.$store.dispatch('priceManage/getChildConditionPropertyList', this.canSetPartListIDs4Fetch)]);
      this.allLoading = false;
    },
    onEditClick(item) {
      this.$store.commit('priceManage/setCurChildConditionEditData', item);
      this.$router.push({ name: 'subConditionSet', params: { PartID: item.PartID, PartName: item.PartName, ProductName: this.Name } });
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该子条件吗?', `子条件名称：[ ${item.Name} ]`, () => {
        this.handleRemove(item);
      });
    },
    async handleRemove({ ID }) {
      const resp = await this.api.getPartChildConditionRemove(ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.ChildConditionList = this.ChildConditionList.filter(it => it.ID !== ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    getTargetName({ PartID }) {
      const t = this.canSetPartList.find(it => it.ID === PartID);
      return t ? t.Name : '未知部件';
    },
    getPropertyList(PartID, list) {
      if (list.length === 0) return [];
      const t = list.find(it => it.length > 0 && it[0].Part && it[0].Part.ID === PartID);
      return t || [];
    },
    getReductionList(list, allPropertyList) {
      if (!Array.isArray(list) || list.length === 0) return [];
      const _list = JSON.parse(JSON.stringify(list)).map(it => {
        const { Constraint, PartID } = it;
        const PropertyList = this.getPropertyList(PartID, allPropertyList);
        const [_Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(Constraint, PropertyList);
        // eslint-disable-next-line no-nested-ternary
        const FilterTypeText = Constraint ? (Constraint.FilterType === 1 ? '满足所有' : '满足任一') : '未知满足关系';
        const PartName = this.getTargetName(it);
        return { ...it, Constraint: _Constraint, _ConditionText, FilterTypeText, PartName };
      });
      return _list;
    },
    onRowClick({ ID }) {
      this.activeRowID = ID;
    },
  },
  mounted() {
    this.getPathData(); // 初始化获取地址栏参数
    this.fetchData();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'subConditionSet') {
      next(vm => {
        vm.getProductChildConditionList();
      });
    } else {
      next();
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-sub-condition-set-page--wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    // height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    height: 144px;
    > p {
      padding-top: 45px;
      > button {
        font-size: 14px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    &.loading {
      opacity: 0.2;
    }
    > ul {
      > li {
        width: 1100px;
        display: flex;
        border-bottom: 1px solid #eee;
        line-height: 24px;
        padding: 8px 16px;
        transition: 0.1s ease-in-out;
        > div {
          font-size: 12px;
          color: #585858;
          flex: none;
          &.name {
            width: 11em;
            font-size: 13px;
            padding-left: 13px;
          }
          &.target {
            width: 11em;
          }
          &.condition {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 60px;
          }
          &.count {
            width: 11em;
            margin-right: 6px;
          }
          &.ctrl-menus-container {
            width: 106px;
            margin-left: 14px;
          }
        }
        &:hover {
          background-color: #f8f8f8;
          border-color: #ccc;
        }
        > .sort {
          line-height: 24px;
          min-width: 18px;
          font-size: 12px;
          color: #989898;
        }
        &.active {
          border-color: #ccc;
          background-color: #eee;
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    width: 1100px;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
