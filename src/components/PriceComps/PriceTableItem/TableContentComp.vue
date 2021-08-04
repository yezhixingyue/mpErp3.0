<template>
  <section class="mp-erp-comps-price-module-price-table-form-content-wrap mp-scroll-wrap hidden">
    <header>
      <span class="space"></span>
      <span v-for="(it, XIndex) in XAxisList" :key="it.ID" :title="RowNameList[XIndex]">{{RowNameList[XIndex]}}</span>
    </header>
    <main>
      <div v-for="(col, YIndex) in YAxisList" :key="col.ID">
        <span class="label" :title="ColNameList[YIndex]">{{ColNameList[YIndex]}}</span>
        <ul v-for="row in XAxisList" :key="row.ID">
          <li>
            <span></span>
            <el-input :value="getInputValue(col.ID, row.ID, '')" @input="onInputChange($event, col.ID, row.ID, '')" maxlength="9" size="small" />
            <span class="unit" :title="tableData.Unit || ''">{{ tableData.Unit || '' }}</span>
          </li>
          <li v-for="it in tableData.DataList" :key="it.ID">
            <span :title="it.Name">{{it.Name}}</span>
            <el-input :value="getInputValue(col.ID, row.ID, it.ID)" @input="onInputChange($event, col.ID, row.ID, it.ID)" maxlength="9" size="small" />
            <span class="unit" :title="it.Unit || ''">{{ it.Unit || '' }}</span>
          </li>
        </ul>
      </div>
    </main>
  </section>
</template>

<script>
import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';

export default {
  props: {
    tableData: {
      type: Object,
      default: () => ({}),
    },
    YAxisList: {
      type: Array,
      default: () => [],
    },
    XAxisList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    XOperator() {
      return this.tableData.XAxis.Operator;
    },
    YOperator() {
      return this.tableData.YAxis.Operator;
    },
    RowNameList() {
      return this.XAxisList.map(it => this.getItemName(it, this.tableData.XAxis));
    },
    ColNameList() {
      return this.YAxisList.map(it => this.getItemName(it, this.tableData.YAxis));
    },
  },
  methods: {
    getItemName(it, AxisData) {
      const { Property, Operator } = AxisData;
      if (!Property) return '';
      // 1. 获取到该属性的类型： 数字 | 选择项 | 尺寸
      if (Property.ValueType === 0) { // 数字类型 需要考虑关系
        const { Unit } = Property;
        const arr = it.Value.split(' ');
        if (arr.length === 1) return Unit ? `${arr[0]}${Unit}` : arr[0];
        if (arr.length === 2) {
          let beginNum = arr[0];
          let EndNum = Unit ? `${arr[1]}${Unit}` : arr[1];
          if (EndNum === '-1') {
            beginNum = Unit ? `${arr[0]}${Unit}` : arr[0];
            EndNum = '无穷大';
          }
          const FirstOperator = this.$utils.getNameFromListByIDs(Operator.First, AllOperatorList, { label: 'label', value: 'ID' });
          const SecondOperator = this.$utils.getNameFromListByIDs(Operator.Second, AllOperatorList, { label: 'label', value: 'ID' });
          return `${beginNum} ${FirstOperator} 值 ${SecondOperator} ${EndNum}`;
        }
      } else if (Property.FixedType === 7) { // 尺寸类型
        const { OptionList, SizeGroup } = Property;
        if (it.Value) {
          if (Array.isArray(OptionList)) {
            const t = OptionList.find(_it => _it.First === it.Value);
            return t ? t.Second : it.Value;
          }
        }
        if (it.Values && it.Values.length > 0) {
          const { ElementList } = SizeGroup;
          if (Array.isArray(ElementList) && ElementList.length === it.Values.length) {
            let isSameUnit = true;
            const { Unit } = ElementList[0];
            ElementList.forEach(el => {
              if (!isSameUnit) return;
              if (el.Unit !== Unit) isSameUnit = false;
            });
            return it.Values.map((_it, i) => {
              let _unit = '';
              if (!isSameUnit) _unit = ElementList[i].Unit || '';
              else if (i === it.Values.length - 1) _unit = Unit || '';
              let _val = _it.Second;
              if (ElementList[i].Type === 2) {
                const _t = ElementList[i].OptionAttribute?.OptionList?.find(o => o.ID === _it.Second);
                if (_t) _val = _t.Name;
              }
              return `${_val}${_unit}`;
            }).join('×');
          }
        }
      } else { // 选项
        const { OptionList } = Property;
        if (Array.isArray(OptionList)) {
          const t = OptionList.find(_it => _it.First === it.Value);
          return t ? t.Second : it.Value;
        }
      }
      return '未知标题';
    },
    getInputValue(YAxisID, XAxisID, First) {
      const t = this.tableData.PriceList.find(it => it.YAxisID === YAxisID && it.XAxisID === XAxisID);
      if (t && Array.isArray(t.List)) {
        const targetItem = t.List.find(it => it.First === First || (!First && (it.First === '00000000-0000-0000-0000-000000000000' || !it.First)));
        if (targetItem) return targetItem.Second;
      }
      return '';
    },
    onInputChange(val, YAxisID, XAxisID, First) {
      this.$emit('itemInput', val, YAxisID, XAxisID, First);
    },
    onSubmitClick() {
      if (this.disabled) return;
      this.$emit('submit');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-form-content-wrap {
  // display: flex;
  // flex: 1;
  // padding-right: 10px;
  // flex-direction: column;
  overflow-x: auto;
  > header {
    line-height: 28px;
    background-color: #f5f5f5;
    height: 38px;
    color: #888E99;
    font-size: 14px;
    display: flex;
    flex: none;
    min-width: 100%;
    > span {
      width: 248px;
      text-align: center;
      overflow: hidden;
      padding: 5px 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: #f5f5f5;
      flex: none;
      &.space {
        width: 180px;
      }
      &:last-of-type {
        margin-right: 10px;
      }
    }
  }
  > main {
    padding-bottom: 10px;
    display: inline-block;
    min-width: 100%;
    > div {
      display: flex;
      border-bottom: 1px solid #eee;
      > .label {
        color: #888E99;
        font-size: 14px;
        width: 156px;
        padding-right: 6px;
        padding-left: 20px;
        line-height: 30px;
        display: flex;
        align-items: center;
        min-height: 66px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // flex: none;
        // border-bottom: 1px solid #eee;
      }
      > ul {
        width: 248px;
        padding: 14px 0;
        // border-bottom: 1px solid #eee;
        > li {
          display: flex;
          align-items: center;
          flex: none;
          .el-input {
            width: 100px;
            padding: 4px 0;
            margin: 0 8px;
            input {
              height: 30px;
              line-height: 30px;
              border-radius: 2px;
            }
          }
          > span {
            font-size: 12px;
            color: #585858;
            width: 62px;
            text-align: right;
            padding-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &.unit {
              color: #a2a2a2;
              text-align: left;
            }
          }
        }
      }
    }
  }
}
</style>
