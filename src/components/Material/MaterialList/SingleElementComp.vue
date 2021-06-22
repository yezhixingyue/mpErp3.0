<template>
  <section v-if="Element && value" class="mp-erp-material-mass-production-dialog-single-element-show-comp-wrap">
    <header>
      <span class="title">{{Element.Name}}</span>
      <span class="fold-box" :class="isOpen?'':'unfold'" @click="isOpen = !isOpen">
        <em>{{isOpen ? '收起' : '展开'}}</em>
        <i class="el-icon-arrow-up"></i>
      </span>
    </header>
    <main v-show="isOpen">
      <template v-if="Element.Type === 1">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="it in NumberOptions" :key="it" :label="+it">{{it}}</el-checkbox>
        </el-checkbox-group>
        <div v-if="Element.NumbericAttribute.Allow" class="custom-box">
          <el-checkbox v-model="customChecked">自定义</el-checkbox>
          <el-input v-show="customChecked" size="mini" v-model.trim="customValue"></el-input>
        </div>
      </template>
      <template v-if="Element.Type === 2">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="it in Element.OptionAttribute.OptionList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-checkbox>
        </el-checkbox-group>
        <span class="is-font-size-12 is-gray" v-if="checkList.length === 0">该元素未设置选择项</span>
        <!-- <div v-if="Element.OptionAttribute.Allow && (Element.OptionAttribute.AllowCustomer || Element.HiddenToCustomer)" class="custom-box">
          <el-checkbox v-model="customChecked">自定义</el-checkbox>
          <el-input v-show="customChecked" size="mini" v-model.trim="customValue"></el-input>
        </div> -->
      </template>
      <template v-if="Element.Type === 3">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="Element.SwitchAttribute.OpenValue" :title="Element.SwitchAttribute.Words">开</el-checkbox>
          <el-checkbox :label="Element.SwitchAttribute.CloseValue" :title="Element.SwitchAttribute.Words">关</el-checkbox>
        </el-checkbox-group>
      </template>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    Element: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    NumberOptions() {
      if (this.Element.Type === 1) {
        if (this.Element.NumbericAttribute.InputContent) {
          const res = this.$utils.getNumberValueList(this.Element.NumbericAttribute.InputContent);
          return res;
        }
        if (!this.Element.NumbericAttribute.InputContent
         && (this.Element.NumbericAttribute.CheckedValue || this.Element.NumbericAttribute.CheckedValue === 0)) {
          return [this.Element.NumbericAttribute.CheckedValue];
        }
      }
      return [];
    },
    checkList: {
      get() {
        return this.value.checkList;
      },
      set(val) {
        const _temp = { ...this.value };
        _temp.checkList = val;
        this.$emit('change', _temp);
      },
    },
    customValue: {
      get() {
        return this.value.customValue;
      },
      set(val) {
        const _temp = { ...this.value };
        _temp.customValue = val;
        this.$emit('change', _temp);
      },
    },
    customChecked: {
      get() {
        return this.value.customChecked;
      },
      set(val) {
        const _temp = { ...this.value };
        _temp.customChecked = val;
        this.$emit('change', _temp);
      },
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-material-mass-production-dialog-single-element-show-comp-wrap {
  padding-bottom: 30px;
  > header {
    display: flex;
    align-items: center;
    > span {
      line-height: 15px;
      &.title {
        font-size: 14px;
        color: #585858;
        font-weight: bold;
        padding-left: 13px;
        position: relative;
        margin-right: 25px;
        min-width: 70px;
        &::before {
          content: '';
          position: absolute;
          width: 3px;
          height: 15px;
          left: 0;
          background-color: #26bcf9;
        }
      }
      &.fold-box {
        color: #a2a2a2;
        cursor: pointer;
        font-size: 12px;
        user-select: none;
        display: flex;
        align-items: center;
        position: relative;
        top: 1px;
        > em {
          margin-right: 3px;
        }
        > i {
          border-radius: 50%;
          background-color: #f5f5f5;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          // transition: 0.1s ease-in-out;
        }
        &:hover {
          color: #888;
        }
        &.unfold > i {
          transform: rotateZ(180deg);
        }
      }
    }
  }
  > main {
    padding-top: 10px;
    .el-checkbox-group {
      .el-checkbox {
        width: 120px;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        padding: 6px 0;
      }
    }
    .custom-box {
      padding: 4px 0;
      height: 30px;
      display: flex;
      align-items: center;
      > .el-input {
        width: 100px;
        margin-left: 20px;
      }
    }
  }
}
</style>
