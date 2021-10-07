<template>
  <section class="mp-erp-material-type-page-sub-formula-set-comp-wrap">
    <header>
      <span class="title">子公式列表</span>
      <span class="blue-span" @click="onSubFormulaAddClick">+添加子公式</span>
    </header>
    <main>
      <el-table
        class="mp-erp-common-sub-formula-table-comp-wrap"
        stripe
        border
        :data="tableDataList"
        key="mp-erp-common-sub-formula-table-comp-wrap"
        fit
        style="width: 100%"
      >
        <el-table-column prop="Name" label="名称" width="220"></el-table-column>
        <el-table-column prop="Content" label="数据筛选"  min-width="240">
          <template slot-scope="scope">
            <span v-if="typeof scope.row.conditionText === 'string'">{{scope.row.conditionText}}</span>
            <el-tooltip effect="light" v-else popper-class='common-property-condition-text-tips-box'>
              <div slot="content">
                <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'tips' + i">
                  <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span class="name">{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span class="val">{{it.val}}</span>
                  <span v-if="i === scope.row.conditionText.length - 1" style="margin-left:2px"> 。</span>
                  <span v-else style="margin-left:2px">；</span>
                </p>
              </div>
              <div class="common-property-condition-text-content-box">
                <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'content' + i">
                  <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span>{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span>{{it.val}}</span>
                </p>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Content" label="公式"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Target" label="子公式目标"  width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Unit" label="单位"  width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="UseTimes" label="使用次数"  width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="240" class-name='menu-column'>
          <div class="menu-list" slot-scope="scope">
            <span class="icon-span" @click="onFilterClick(scope.row)"><i></i>筛选数据</span>
            <span class="icon-span" @click="onSetupClick(scope.row)"><i></i>编辑</span>
            <span class="icon-span" @click="onRemoveClick(scope.row)"><i></i>删除</span>
          </div>
        </el-table-column>
        <div slot="empty">
          <span v-show="!loading">暂无公式</span>
        </div>
      </el-table>
      <SubFormulaAddAndSelectDialog :visible.sync='visible' :PropertyList='PropertyList' @submit='onSelectCompleted' warnTitle='子公式' />
    </main>
  </section>
</template>

<script>
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import SubFormulaAddAndSelectDialog from './SubFormulaAddAndSelectDialog.vue';

export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    formulaH: {
      type: Number,
      default: 560,
    },
    PositionType: {
      type: String,
      default: '',
    },
    UseModule: {
      type: Number,
      default: 2,
    },
    CompareUseModule: {
      type: Number,
      default: 255,
    },
  },
  components: {
    SubFormulaAddAndSelectDialog,
  },
  data() {
    return {
      localTableData: [],
      loading: false,
      PropertyList: null,
      visible: false,
      ComparePropertyList: [],
    };
  },
  computed: {
    tableDataList() {
      if (!this.localTableData || this.localTableData.length === 0) return [];
      if (!this.ComparePropertyList || this.ComparePropertyList.length === 0) return this.localTableData;
      const list = this.localTableData.map(it => {
        if (!it.Constraint) return { ...it, conditionText: '无' };
        const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.ComparePropertyList);
        // const Constraint = {
        //   ...it.Constraint,
        //   ItemList: it.Constraint.ItemList.map(item => {
        //     let { ValueList } = item;
        //     if (ValueList && ValueList.length === 1 && !ValueList[0].Value && ValueList[0].Property) {
        //       const Property = PropertyClass.getPerfectPropertyByImperfectProperty(ValueList[0].Property, this.ComparePropertyList);
        //       if (Property) ValueList = [{ Property }];
        //     }
        //     const Property = PropertyClass.getPerfectPropertyByImperfectProperty(item.Property, this.ComparePropertyList);
        //     console.log('Property', Property);
        //     return {
        //       ...item,
        //       Property,
        //       ValueList,
        //     };
        //   }).filter(item => item.Property),
        // };
        // return { ...it, Constraint, conditionText: this.getConditionText(Constraint.ItemList) };
        return { ...it, Constraint, conditionText };
      });
      return list;
    },
  },
  methods: {
    onSetupClick(data) { // data 为null时为新增 有数据时为编辑
      this.$emit('setup', data);
    },
    onFilterClick(data) { // data 为null时为新增 有数据时为编辑
      this.$emit('filter', { ...data, ComparePropertyList: this.ComparePropertyList });
    },
    async onRemoveClick(data) {
      if (!data || !data.ID) return;
      this.messageBox.warnCancelBox('确定删除该公式吗', `公式名称：[ ${data.Name} ]`, () => {
        this.handleRemove(data);
      });
    },
    async handleRemove(data) {
      const resp = await this.api.getFormulaRemove(data.ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => { this.setDataListRemove(data.ID); };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    setDataListRemove(ID) {
      this.localTableData = this.localTableData.filter(it => it.ID !== ID);
    },
    async getFormulaList() {
      if (!this.PositionID || this.loading) return;
      this.loading = true;
      const resp = await this.api.getFormulaList({ [this.PositionType]: this.PositionID, UseModule: this.UseModule }).catch(() => {});
      this.loading = false;
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.localTableData = resp.data.Data;
      }
    },
    onSubFormulaAddClick() {
      this.visible = true;
      this.getPropertyList();
    },
    async getPropertyList() {
      if (this.PropertyList && Array.isArray(this.PropertyList) && this.PropertyList.length > 0) return;
      const resp = await this.api.getSubformulaUseableProperty(this.PositionID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.PropertyList = resp.data.Data;
      }
    },
    async getComparePropertyList() {
      const propertyList = await PropertyClass.getPropertyList({ [this.PositionType]: this.PositionID, UseModule: this.CompareUseModule });
      if (propertyList) this.ComparePropertyList = propertyList;
    },
    onSelectCompleted(selectedItem) { // 选择属性完成并开始添加子公式跳转页面
      if (!selectedItem) return;
      this.$emit('add', selectedItem);
      this.visible = false;
    },
    // getConditionText(list) {
    //   const str = PropertyClass.getPropertyConditionText(list);
    //   return str || '无';
    // },
  },
  mounted() {
    this.getFormulaList();
    this.getComparePropertyList();
    // eslint-disable-next-line max-len
    const oTable = document.querySelector('.mp-erp-material-type-page-sub-formula-set-comp-wrap .mp-erp-common-sub-formula-table-comp-wrap .el-table__body-wrapper');
    if (oTable) oTable.style.minHeight = `${this.formulaH}px`;
  },
  // activated() {
  //   this.getFormulaList();
  // },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-sub-formula-set-comp-wrap {
  > header {
    font-size: 14px;
    display: flex;
    > .title {
      font-weight: 700;
      padding-left: 13px;
      position: relative;
      font-size: 15px;
      margin-right: 40px;
      &::before {
        content: '';
        width: 3px;
        height: 15px;
        background-color: #26bcf9;
        left: 0;
        position: absolute;
      }
    }
  }
  > main {
    padding-right: 10px;
    padding-top: 30px;
    .mp-erp-common-sub-formula-table-comp-wrap {
      border-top-color: rgb(230, 230, 230);
      border-left: 1px solid rgb(230, 230, 230);
      .el-table__header-wrapper thead tr th {
        .cell {
          line-height: 36px;
          font-size: 14px;
        }
        // &.menu-column {
          // text-align: left;
          // padding-left: 120px;
        // }
      }
      .el-table__body-wrapper {
        .el-table__row {
          width: 100%;
          > td {
            > .cell {
              font-size: 12px;
              height: 30px;
              color: #585858;
              .menu-list {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding-right: 12px;
                font-size: 12px;
                > span.icon-span {
                  color: #a2a2a2;
                  transition: color 0.05s ease-in-out;
                  cursor: pointer;
                  margin: 0 10px;
                  display: flex;
                  align-items: center;
                  user-select: none;
                  &:hover {
                    color: #444;
                  }
                  > i {
                    width: 16px;
                    height: 16px;
                    background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
                    margin-right: 4px;
                  }
                  &:last-of-type > i {
                    background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
                  }
                  &:first-of-type > i {
                    background: url(../../../assets/images/filter.png) no-repeat center center/16px 15px;
                  }
                }
                > span.mp-common-tip-span-btn-box {
                  margin-right: 45px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
