<template>
  <div class="mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap" :class="isMultiple?'isMultiple':''">
    <el-select v-model="localValue" v-if="showOption" placeholder="请选择" size="mini">
      <el-option
        v-for="item in localOperatorList"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID">
      </el-option>
    </el-select>
    <div v-else  class="text-box">
      <span class="text">{{showText}}</span>
    </div>
    <span v-if="isMultiple">下面任一选项时：</span>
    <div v-if="isMultiple" class="multiple-select">
      <el-checkbox-group v-model="checkList" v-if="localOptionList.length < 4">
        <el-checkbox v-for="it in localOptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
      </el-checkbox-group>
      <div class="multiple" v-else>
        <span class="blue-span" @click="onSelectDialogClick">选择</span>
        <div class="show-text" :title="localMaterialSelectedList">{{localMaterialSelectedList}}</div>
        <CheckboxDialogComp v-if="ValueType !== 6" :visible.sync='propVisibel' v-model="checkList" :list='localOptionList' width='800px'
         title="选择选项" :defaultProps="{label: 'Second', value: 'First'}" />
        <MaterialSelectDialog v-else :visible.sync='materialVisible' v-model="checkList" :optionList='localMaterialOptionList'  />
      </div>
    </div>
  </div>
</template>

<script>
import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';
import CheckboxDialogComp from '@/components/common/NewComps/CheckboxDialogComp.vue';
import MaterialSelectDialog from './MaterialSelectDialog.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    PropertyData: {
      type: Object,
      default: null,
    },
    value: {},
    valueList: {},
  },
  components: {
    CheckboxDialogComp,
    MaterialSelectDialog,
  },
  computed: {
    localOperatorList() {
      if (!this.PropertyData || !AllOperatorList || AllOperatorList.length === 0 || !this.PropertyData.OperatorList) return [];
      return AllOperatorList.filter(it => this.PropertyData.OperatorList.includes(it.ID));
    },
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
    isMultiple() {
      return this.ValueType === 1 || this.ValueType === 6;
    },
    localOptionList() {
      if (!this.PropertyData || !Array.isArray(this.PropertyData.OptionList) || this.PropertyData.OptionList.length === 0) return [];
      return this.PropertyData.OptionList;
    },
    checkList: {
      get() {
        if (Array.isArray(this.valueList) && this.valueList.length > 0) {
          const _list = this.valueList.filter(it => it || it === 0);
          return this.isMultiple ? _list.map(it => it.Value) : this.valueList[0].Value;
        }
        return this.isMultiple ? [] : '';
      },
      set(val) {
        const _val = val.filter(it => it || it === 0);
        const _list = this.isMultiple ? _val.map(Value => ({ Value })) : [{ Value: _val }];
        this.$emit('update:valueList', _list);
      },
    },
    localMaterialListObj() { // 仅为物料时且列表数量大于3时使用
      if (!this.localOptionList || !Array.isArray(this.localOptionList) || this.localOptionList.length === 0) return null;
      const _list = this.localOptionList
        .map(it => ({ ...it, list: it.Second.split(' ') }))
        .map(it => ({ ...it, first: it.list[0], second: it.list.length > 1 ? it.list[1] : '', third: it.list.length > 2 ? it.list.slice(2).join(' ') : '' }));
      const _obj = {};
      _list.forEach(it => {
        const { first, second, third, First, Second } = it;
        if (!_obj[first]) _obj[first] = {};
        if (!_obj[first][second]) _obj[first][second] = [];
        _obj[first][second].push({ third, Data: { First, Second } });
      });
      return _obj;
    },
    localMaterialOptionList() { // 仅为物料时且列表数量大于3时使用
      if (!this.localMaterialListObj) return [];
      const list = [];
      Object.keys(this.localMaterialListObj).forEach(fKey => {
        const second = this.localMaterialListObj[fKey];
        const _temp1 = {};
        _temp1.Name = fKey;
        _temp1.List = [];
        Object.keys(second).forEach(sKey => {
          const thirdList = second[sKey];
          const _temp2 = {};
          _temp2.Name = sKey;
          _temp2.List = [];
          if (thirdList.length === 1 && !thirdList[0].third) {
            const { Data } = thirdList[0];
            _temp2.Data = Data;
          } else {
            thirdList.forEach(it => {
              const { third, Data } = it;
              const _temp3 = {};
              _temp3.Name = third;
              _temp3.Data = Data;
              _temp2.List.push(_temp3);
            });
          }
          _temp1.List.push(_temp2);
        });
        list.push(_temp1);
      });
      return list;
    },
    localMaterialSelectedList() { // 已选择物料显示文字
      if (!Array.isArray(this.checkList) || this.checkList.length === 0 || this.localMaterialOptionList.length === 0) return '';
      const _list = this.localMaterialOptionList.map(lv1 => { // 找出并附加已选的物料信息
        const List = lv1.List.map(lv2 => {
          const lv3List = lv2.Data ? [{ Name: lv2.Name, Data: lv2.Data }] : lv2.List;
          const SelectedList = lv3List.filter(it => this.checkList.includes(it.Data.First));
          const isCheckedAll = lv3List.length === SelectedList.length;
          return { ...lv2, SelectedList, isCheckedAll };
        }).filter(it => it.SelectedList.length > 0);
        let isCheckedAll = false;
        if (lv1.List.length === List.length) {
          const t = List.find(it => !it.isCheckedAll);
          isCheckedAll = !t;
        }
        return { ...lv1, List, isCheckedAll };
      }).filter(it => it.List.length > 0);

      const _text = _list.map(lv1 => { // 从提取出的选择信息中转换出要显示的文字
        const { Name, List } = lv1;
        const text = lv1.isCheckedAll ? '全部' : List.map(lv2 => {
          const { SelectedList, isCheckedAll, Data } = lv2;
          let lv2Str = lv2.Name;
          if (isCheckedAll && !Data) lv2Str = `${lv2Str}（全部）`;
          else if (!Data) {
            const names = SelectedList.map(_it => _it.Name).join('、');
            lv2Str = `${lv2Str}（${names}）`;
          }
          return lv2Str;
        }).join('、');
        return `${Name}（${text}）`;
      }).join('、');
      return _text;
    },
  },
  data() {
    return {
      showOption: true,
      showText: '',
      ValueType: '',
      propVisibel: false,
      materialVisible: false,
    };
  },
  methods: {
    onSelectDialogClick() {
      if (this.ValueType === 6) this.materialVisible = true;
      else this.propVisibel = true;
    },
  },
  mounted() {
    if (!AllOperatorList || AllOperatorList.length === 0 || !this.PropertyData
     || !this.PropertyData.OperatorList || this.PropertyData.OperatorList.length === 0) return;
    if (this.localOperatorList.length === 0) return;
    const [{ ID, Name }] = this.localOperatorList;
    this.$emit('change', ID);
    if (this.PropertyData.OperatorList.length === 1 && this.localOperatorList.length === 1) {
      this.showOption = false;
      this.showText = Name;
    }
    this.ValueType = this.PropertyData.ValueType;
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap {
  width: 100px;
  // display: flex;
  // align-items: center;
  .el-select {
    width: 100px;
  }
  .el-input {
    // height: 30px;
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      border-radius: 3px;
    }
    .el-input__suffix {
      height: 30px;
    }
  }
  > span {
    font-size: 12px;
    color: #585858;
    margin-left: 12px;
  }
  > div.text-box {
    display: inline-block;
    line-height: 30px;
    > span.text {
      font-size: 12px;
      color: #585858;
      margin-left: 8px;
      margin-left: 2px;
    }
  }
  .del-btn {
    user-select: none;
  }
  &.isMultiple {
    width: 235px;
    & + .del-btn {
      margin-left: 25px;
    }
  }
  .multiple-select {
    height: 30px;
    line-height: 30px;
    > .el-checkbox-group {
      height: 30px;
      width: 240px;
      overflow: hidden;
      .el-checkbox {
        margin-right: 10px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
          line-height: 32px;
          width: 50px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: -10px;
        }
      }
    }
    > .multiple {
      padding: 5px 0;
      line-height: 22px;
      font-size: 12px;
      display: flex;
      align-items: center;
      .mp-erp-common-check-box-dialog-comp-wrap {
        .el-dialog__header {
          height: 28px;
          padding-top: 4px;
        }
        .mp-common-comps-checkbox-group-comp-wrap {
          .el-checkbox-group {
            white-space: normal;
            .el-checkbox__label {
              width: 145px;
              font-size: 12px;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .show-text {
        display: inline-block;
        margin-left: 10px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        max-width: 200px;
        vertical-align: middle;
      }
    }
  }
}
</style>
