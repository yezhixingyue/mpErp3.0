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
import { AllOperatorList, getTempMaterialListObj, getTempMaterialOptionList, getTempMaterialSelectedListShowText } from '@/assets/js/TypeClass/PropertyClass';
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
      return getTempMaterialListObj(this.localOptionList);
    },
    localMaterialOptionList() { // 仅为物料时且列表数量大于3时使用
      return getTempMaterialOptionList(this.localMaterialListObj);
    },
    localMaterialSelectedList() { // 已选择物料显示文字
      return getTempMaterialSelectedListShowText(this.checkList, this.localMaterialOptionList);
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
    width: 255px;
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
