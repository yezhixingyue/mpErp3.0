<template>
  <section class="mp-erp-comps-price-module-price-table-form-content-wrap">
    <header>
      <span class="space"></span>
      <span v-for="it in XAxisList" :key="it.ID">{{getItemName(it, tableData.XAxis)}}</span>
    </header>
    <main>
      <div v-for="col in YAxisList" :key="col.ID">
        <span class="label">{{getItemName(col, tableData.YAxis)}}</span>
        <ul v-for="row in XAxisList" :key="row.ID">
          <li>
            <span></span>
            <el-input :value="getInputValue(col.ID, row.ID, '')" maxlength="9" size="small" />
            <span class="unit">{{ tableData.Unit || '' }}</span>
          </li>
          <li v-for="it in tableData.DataList" :key="it.ID">
            <span>{{it.Name}}</span>
            <el-input :value="getInputValue(col.ID, row.ID, it.ID)" maxlength="9" size="small" />
            <span class="unit">{{ it.Unit || '' }}</span>
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
  },
  computed: {
    XOperator() {
      return this.tableData.XAxis.Operator;
    },
    YOperator() {
      return this.tableData.YAxis.Operator;
    },
    XAxisList() {
      if (!this.tableData.XAxis.Property) return [];
      return this.tableData.XAxis.List;
    },
    YAxisList() {
      if (!this.tableData.YAxis.Property) return [];
      return this.tableData.YAxis.List;
    },
  },
  methods: {
    getItemName(it, AxisData) {
      const { Property, Operator } = AxisData;
      // 1. 获取到该属性的类型： 数字 | 选择项 | 尺寸
      if (Property.ValueType === 0) { // 数字类型 需要考虑关系
        const { Unit } = Property;
        const arr = it.Value.split(' ');
        if (arr.length === 1) return Unit ? `${arr[0]}${Unit}` : arr[0];
        if (arr.length === 2) {
          const beginNum = arr[0];
          const EndNum = Unit ? `${arr[1]}${Unit}` : arr[1];
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
              return `${_it.Second}${_unit}`;
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
    // eslint-disable-next-line no-unused-vars
    getInputValue(YAxisID, XAxisID, First) {
      // console.log(YAxisID, XAxisID, First);
      return '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-form-content-wrap {
  display: flex;
  flex: 1;
  padding-right: 10px;
  flex-direction: column;
  > header {
    line-height: 28px;
    background-color: #f5f5f5;
    height: 28px;
    padding: 5px 0;
    color: #888E99;
    font-size: 14px;
    display: flex;
    flex: none;
    min-width: 100%;
    > span {
      width: 248px;
      text-align: center;
      &.space {
        width: 180px;
      }
    }
  }
  > main {
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
      }
      > ul {
        width: 248px;
        padding: 14px 0;
        > li {
          display: flex;
          align-items: center;
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
