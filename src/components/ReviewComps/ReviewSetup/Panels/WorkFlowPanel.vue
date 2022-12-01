<template>
  <div class="mp-erp-review-panels-workflow-panel-comp-wrap" v-if="value">
    <ul>
      <li>
        <label>文件处理：</label>
        <el-radio-group v-model="DealType" @change="onFileHandleModeChange">
          <el-radio v-for="it in FileHandleModeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li>
        <label>内容审核：</label>
        <el-radio-group v-model="IsCheckContent" :disabled="DealType===FileHandleModeEnums.none.ID">
          <el-radio v-for="it in ContentReviewModeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
    </ul>
    <div class="remark">
      <i class="el-icon-warning is-origin"></i>
      <p class="tips-box">
        <span>注：审核内容的前提必须要处理文件</span>
      </p>
      <p class="tips-box">
        <span>注：无文件时无论怎么设置都不处理文件并且不审核内容</span>
      </p>
      <p class="tips-box">
        <span>注：当需要审核内容且没有生成缩略图时，在内容审核界面显示警告图片，让审核人员知晓</span>
      </p>
    </div>
  </div>
</template>

<script>
import { FileHandleModeEnumList, FileHandleModeEnums, ContentReviewModeEnumList, ContentReviewModeEnums } from '../../../../store/review/reviewEnums';

export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      FileHandleModeEnumList,
      ContentReviewModeEnumList,
      FileHandleModeEnums,
    };
  },
  computed: {
    DealType: {
      get() {
        return this.value ? this.value.DealType : '';
      },
      set(val) {
        this.change({ DealType: val });
      },
    },
    IsCheckContent: {
      get() {
        return this.value ? this.value.IsCheckContent : '';
      },
      set(val) {
        this.change({ IsCheckContent: val });
      },
    },
  },
  methods: {
    onFileHandleModeChange(e) { // 设置文件处理方式
      if (e === FileHandleModeEnums.none.ID && this.IsCheckContent !== ContentReviewModeEnums.notReview.ID) {
        this.IsCheckContent = ContentReviewModeEnums.notReview.ID;
      }
    },
    change(singleObj) {
      if (!this.value || typeof this.value !== 'object') return;
      this.$emit('input', { ...this.value, ...singleObj });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-panels-workflow-panel-comp-wrap {
  font-size: 14px;
  padding-top: 26px;
  > ul {
    padding-left: 40px;
    > li {
      margin-bottom: 28px;
      > label {
        color: #888E99;
        margin-right: 4px;
      }
      > .el-radio-group {
        .el-radio__label {
          font-size: 12px;
          color: #585858;
          display: inline-block;
          min-width: 6em;
        }
        .is-disabled .el-radio__label {
          color: #cbcbcb;
        }
      }
    }
  }
  > div.remark {
    padding-top: 30px;
    color: #888;
    line-height: 24px;
    position: relative;
    padding-left: 10px;
    > p {
      width: auto;
      background: #fff;
      > span {
        display: inline-block;
        background: #FFFBF6;
        padding-left: 6px;
        padding-right: 25px;
        letter-spacing: 1px;
      }
    }
    > i {
      position: absolute;
      left: 0px;
      top: 36px;
      font-size: 15px;
    }
  }
}
</style>
