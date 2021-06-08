<template>
  <section class="mp-statistic-comps-question-checkout-dia-comp-wrap">
    <span class="span-title-blue" @click="handleAreaDialogOpen">选择问题</span>
    <el-tooltip placement="top-start" :enterable='false' :disabled="!(questionTextArr && questionTextArr.length > 7)"
      transition='none' v-if="questionTextArr && questionTextArr.length > 0">
      <div slot="content" style="padding:6px 0">
        <span style="line-height: 21px" v-for="(item, i) in questionTextArr" :key="item + '-' + i">
          {{ item }}
          <template v-if="i < questionTextArr.length - 1">、</template>
        </span>
      </div>
      <p>{{questionTextArr.join('、')}}</p>
    </el-tooltip>
    <p v-else>请选择问题</p>
    <el-dialog
      title="选择问题"
      :modal='false'
      :visible.sync="showDialog"
      width="750px"
      top='8vh'
      v-dialogDrag
      class="mp-img-style-header area-dialog-wrap"
      :before-close="handleAreaDialogClose">
      <section>
        <header>
          选择问题：
        </header>
        <div>
          <p><el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox></p>
          <checkbox-group-comp
          :showTitle='false'
          :itemList='QuestionTypeList'
          v-model='selectedQuestionArray'
          :defaultProps="{ label: 'Title', value: 'ID' }"
          />
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <normalBtnFull @click.native="handleAreaDialogSave" title='确定' />
        <normalBtn @click.native="handleAreaDialogClose" title="取消" />
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    normalBtnFull,
    normalBtn,
    CheckboxGroupComp,
  },
  data() {
    return {
      showDialog: false,
      // selectedQuestionArray: [],
    };
  },
  computed: {
    ...mapState('service', ['QuestionTypeList']),
    questionTextArr() {
      let _textList = this.value.map(it => {
        const t = this.QuestionTypeList.find(q => q.ID === it.ID);
        return t ? t.Title : '';
      }).filter(it => it);
      if (_textList.length === this.QuestionTypeList.length) _textList = ['全部问题'];
      return _textList;
    },
    isIndeterminate() {
      if (this.selectedQuestionArray.length > 0 && this.selectedQuestionArray.length < this.QuestionTypeList.length) return true;
      return false;
    },
    checkedAll: {
      get() {
        if (this.selectedQuestionArray.length === this.QuestionTypeList.length) return true;
        return false;
      },
      set(val) {
        this.selectedQuestionArray = val ? this.QuestionTypeList : [];
      },
    },
    selectedQuestionArray: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
  methods: {
    handleAreaDialogOpen() {
      if (this.value) this.selectedQuestionArray = this.value;
      this.showDialog = true;
    },
    handleAreaDialogClose() {
      this.showDialog = false;
      if (this.value) this.selectedQuestionArray = this.value;
    },
    handleAreaDialogSave() {
      if (!this.showDialog) return;
      this.$emit('change', this.selectedQuestionArray);
      this.handleAreaDialogClose();
    },
  },
  mounted() {
    this.$store.dispatch('service/getQuestionTypeList');
  },
};
</script>
<style lang='scss'>
.mp-statistic-comps-question-checkout-dia-comp-wrap {
  .area-dialog-wrap {
    .el-dialog__header {
      > span::before {
        background: url(../../../../assets/images/add.png) no-repeat center;
      }
      border-radius: 2px 2px 0px 0
    }
    .el-dialog__body {
      min-height: 520px;
      height: 50vh;
      overflow: auto;
      > section {
        display: flex;
        > header {
          flex: none;
          line-height: 18px;
          margin-right: 10px;
        }
        > div {
          > p {
            margin-bottom: 4px;
          }
          .el-checkbox__label {
            font-size: 13px;
            color: #585858 !important;
            margin-bottom: 6px;
            min-width: 5em;
          }
        }
      }
    }
    .el-dialog__footer {
      > .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: center;
        > button {
          margin: 0;
          & + button {
            margin-left: 35px;
          }
          &.normal-full-btn {
            line-height: 24px;
          }
        }
      }
    }
    > p {
      line-height: 28px;
      font-size: 12px;
      color: #888E99;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 600px;
      height: 28px;
    }
  }
  > p {
    line-height: 28px;
    font-size: 12px;
    color: #888E99;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 600px;
    height: 28px;
  }
}
</style>
