<template>
  <li class="mp-promote-single-condition-comp-wrap">
    <span>条件</span>
    <SelectComp
        :title="resultIndex"
        :options='conditions'
        class="first-box"
        :defaultProps='{label: "Prefix",value: "index"}'
        @handleChange="e=>handleChange('first', e)"
     />
    <SelectComp
        :title="Operator"
        :options='secondOptions'
        class="second-box"
        :defaultProps='{label: "name",value: "ID"}'
        @handleChange="e=>handleChange('second', e)"
     />
    <SelectComp
        v-if="OptionList && OptionList.length > 0"
        :title="Value"
        class="third-box"
        :options='OptionList'
        :defaultProps='{label: "Value",value: "OptionID"}'
        @handleChange="e=>handleChange('third', e)"
     />
    <div class="inp-box" v-else>
        <input type="text" v-model="inpVal" @blur="onInpBlur" />
        <span>{{this.conditions[this.resultIndex] && this.conditions[this.resultIndex].Unit}}</span>
    </div>
    <div class="del-box"  @click="handleDelClick">
        <span class="is-gray">
          <img src="@/assets/images/del.png" alt="">删除</span>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex';
import SelectComp from '@/components/common/SelectComp.vue';

export default {
  props: {
    conditionList: {
      type: Array,
      default: () => [],
    },
    itemData: {
      type: Object,
      default: () => ({}),
    },
    itemIndex: {},
    hasDecimal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SelectComp,
  },
  computed: {
    ...mapState('common', ['OperatorKeyValueList']),
    conditions() {
      return this.conditionList.map((it, i) => ({ ...it, index: i }));
    },
    secondOptions() {
      if (!this.conditions[this.resultIndex]) return [];
      const _list = this.conditions[this.resultIndex].OperatorList;
      const _list2 = this.OperatorKeyValueList.filter(it => _list.includes(it.ID));
      return _list2;
    },
    OptionList() {
      if (!this.conditions[this.resultIndex]) return [];
      return this.conditions[this.resultIndex].OptionList;
    },
    inpVal: {
      get() {
        return this.itemData.Value;
      },
      set(newVal) {
        const _condition = this.conditionList[this.resultIndex];
        let _val;
        if (!this.hasDecimal) {
          _val = newVal.replace(/[^\d]/g, '');
          // _val = _val === '' ? _val : +_val;
        } else {
          const _str = newVal.replace(/^\./, '0.').replace(/[^\d.]/g, '');
          const _arr = _str.split('');
          let pointLen = 0;
          let pointIndex = 0;
          const _list = _arr.map((it, i) => {
            if (it === '.') {
              pointLen += 1;
              pointIndex = i;
              if (pointLen === 1) return it;
              return null;
            }
            if (pointIndex === 0 || pointIndex >= i - 3) return it;
            return null;
          }).filter(it => it);
          _val = _list.join('');
        }
        // _val = _val === '' ? _val : +_val;
        // if (_val !== '') {
        //   if (!isNaN(_val)) _val = +_val;
        // }
        // if (_val || _val === 0) {
        //   if (_condition.MaxValue !== -1) _val = _val < _condition.MaxValue ? _val : _condition.MaxValue;
        //   // eslint-disable-next-line max-len
        //   if (_condition.MinValue || _condition.MinValue === 0) {
        //   _val = _val > _condition.MinValue ? _val : _condition.MinValue;
        // }
        // }
        const _obj = {
          ProductID: _condition.ProductID,
          PartID: _condition.PartID,
          CraftID: _condition.CraftID,
          GroupID: _condition.GroupID,
          PropertyID: _condition.PropertyID, // 以上5个为回传项
          PropertyType: _condition.PropertyType, // 条件前半部分
          Operator: this.Operator, // 关系
          Value: _val, // 条件后半部分： 输入的值 | 选项的ID
          // ---- 新补充部分 - 工期部分开始补充
          Unit: _condition.Unit,
          Prefix: _condition.Prefix,
          OptionList: _condition.OptionList,
          ValueType: _condition.ValueType,
        };
        this.$emit('editCondition', [_obj, this.itemIndex]);
      },
    },
    resultIndex: {
      get() {
        const item = this.conditions.filter(it => {
          const { ProductID, PartID, CraftID, GroupID, PropertyID, PropertyType } = this.itemData;
          return it.PropertyType === PropertyType && it.PropertyID === PropertyID
            && it.GroupID === GroupID && it.CraftID === CraftID && it.PartID === PartID
            && it.ProductID === ProductID;
        });
        if (item.length > 0) return item[0].index;
        return 0;
      },
    },
    Operator: {
      get() {
        if (!this.itemData || !this.itemData.Operator) return 1;
        return this.itemData.Operator;
      },
    },
    Value() {
      return this.itemData.Value || '';
    },
  },
  methods: {
    handleChange(type, e) {
      let _obj;
      let Operator;
      switch (type) {
        case 'first':
          Operator = this.conditionList[e].OperatorList.includes(1) ? 1 : this.conditionList[e].OperatorList[0];
          _obj = {
            ProductID: this.conditionList[e].ProductID,
            PartID: this.conditionList[e].PartID,
            CraftID: this.conditionList[e].CraftID,
            GroupID: this.conditionList[e].GroupID,
            PropertyID: this.conditionList[e].PropertyID, // 以上5个为回传项
            PropertyType: this.conditionList[e].PropertyType, // 条件前半部分
            Operator, // 关系
            Value: '', // 条件后半部分： 输入的值 | 选项的ID
            // ---- 新补充部分 - 工期部分开始补充
            Unit: this.conditionList[e].Unit,
            Prefix: this.conditionList[e].Prefix,
            OptionList: this.conditionList[e].OptionList,
            ValueType: this.conditionList[e].ValueType,
          };
          break;
        case 'second':
          _obj = {
            ProductID: this.conditionList[this.resultIndex].ProductID,
            PartID: this.conditionList[this.resultIndex].PartID,
            CraftID: this.conditionList[this.resultIndex].CraftID,
            GroupID: this.conditionList[this.resultIndex].GroupID,
            PropertyID: this.conditionList[this.resultIndex].PropertyID, // 以上5个为回传项
            PropertyType: this.conditionList[this.resultIndex].PropertyType, // 条件前半部分
            Operator: e, // 关系
            Value: '', // 条件后半部分： 输入的值 | 选项的ID
            // ---- 新补充部分 - 工期部分开始补充
            Unit: this.conditionList[this.resultIndex].Unit,
            Prefix: this.conditionList[this.resultIndex].Prefix,
            OptionList: this.conditionList[this.resultIndex].OptionList,
            ValueType: this.conditionList[this.resultIndex].ValueType,
          };
          break;
        case 'third':
          _obj = {
            ProductID: this.conditionList[this.resultIndex].ProductID,
            PartID: this.conditionList[this.resultIndex].PartID,
            CraftID: this.conditionList[this.resultIndex].CraftID,
            GroupID: this.conditionList[this.resultIndex].GroupID,
            PropertyID: this.conditionList[this.resultIndex].PropertyID, // 以上5个为回传项
            PropertyType: this.conditionList[this.resultIndex].PropertyType, // 条件前半部分
            Operator: this.Operator, // 关系
            Value: e, // 条件后半部分： 输入的值 | 选项的ID
            // ---- 新补充部分 - 工期部分开始补充
            Unit: this.conditionList[this.resultIndex].Unit,
            Prefix: this.conditionList[this.resultIndex].Prefix,
            OptionList: this.conditionList[this.resultIndex].OptionList,
            ValueType: this.conditionList[this.resultIndex].ValueType,
          };
          break;
        default:
          break;
      }
      this.$emit('editCondition', [_obj, this.itemIndex]);
    },
    handleDelClick() {
      // 1
      this.$emit('delCondition', [this.itemIndex]);
    },
    onInpBlur(e) {
      const _condition = this.conditionList[this.resultIndex];
      if (e.target.value === '') return;
      let _val = +e.target.value;
      if (_val || _val === 0) {
        if (_condition.MaxValue !== -1) _val = _val < _condition.MaxValue ? _val : _condition.MaxValue;
        // eslint-disable-next-line max-len
        if (_condition.MinValue || _condition.MinValue === 0) _val = _val > _condition.MinValue ? _val : _condition.MinValue;
      }
      // if (_val !== +e.target.value) {
      const _obj = {
        ProductID: _condition.ProductID,
        PartID: _condition.PartID,
        CraftID: _condition.CraftID,
        GroupID: _condition.GroupID,
        PropertyID: _condition.PropertyID, // 以上5个为回传项
        PropertyType: _condition.PropertyType, // 条件前半部分
        Operator: this.Operator, // 关系
        Value: +_val, // 条件后半部分： 输入的值 | 选项的ID
        // ---- 新补充部分 - 工期部分开始补充
        Unit: _condition.Unit,
        Prefix: _condition.Prefix,
        OptionList: _condition.OptionList,
        ValueType: _condition.ValueType,
      };
      this.$emit('editCondition', [_obj, this.itemIndex]);
      // }
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-promote-single-condition-comp-wrap {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  padding-right: 30px;
  > span {
    font-size: 14px;
    font-weight: 600;
    color: $--color-text-primary;
    line-height: 25px;
    margin-right: 18px;
  }
  > .mp-common-select-comp-wrap {
    & + .mp-common-select-comp-wrap {
      margin-left: 30px;
    }
    &.first-box {
      > div > input{
        width: 158px;
      }
    }
    &.third-box {
      > div {
          width: 200px;
          &::after {
            right: 46px;
          }
          > input{
            width: 158px;
          }
      }
    }
  }
  > .inp-box {
    margin-left: 30px;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    > input {
      outline: none;
      border: 1px solid $--border-color-base;
      height: 25px;
      margin-right: 10px;
      width: 132px;
      text-align: right;
      padding: 0 6px;
      box-sizing: border-box;
      color: $--color-text-primary;
    }
    > span {
    //   line-height: 30px;
      font-size: 12px;
      width: 15px;
      white-space: nowrap;
    }
  }
  > .del-box {
    font-size: 13px;
    line-height: 25px;
    padding: 0px 4px;
    cursor: pointer;
    user-select: none;
    > span > img {
      position: relative;
      top: 2px;
      margin-right: 8px;
    }
    &:hover{
      > span {
          color: #444 !important;
      }
    }
  }
}
</style>
