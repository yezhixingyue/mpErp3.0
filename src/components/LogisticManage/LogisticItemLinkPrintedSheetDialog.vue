<template>
  <CommonDialogComp
    width="450px"
    top="16vh"
    :title="title"
    :visible.sync="localVisible"
    smallBtn
    @submit="submitForm"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-logistic-item-printed-sheet-link-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <ul v-if="ruleForm" class="content">
      <li>
        <label>关联快印仓：</label>
        <el-select v-model="ruleForm.ExpressProductID" filterable placeholder="快印仓" size="small" class="line express">
          <el-option
            v-for="item in [{ID: '', Name:'无'}, ...ExpressProductList]"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../packages/CommonDialogComp';
import LogisticItem from '../../assets/js/TypeClass/LogisticTypeClass/LogisticItem';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
    ExpressProductList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: null,
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      const name = this.editData?.Name ? `${this.editData.Name}` : '';
      return `关联${name}快印仓`;
    },
  },
  methods: {
    onOpen() {
      this.$store.dispatch('basicSet/getExpressProductList');
      this.ruleForm = new LogisticItem(this.editData);
    },
    onClosed() {
      this.ruleForm = null;
    },

    submitForm() {
      this.$emit('submit', this.ruleForm);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-printed-sheet-link-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 48px;
    padding-top: 40px;
    padding-left:110px;
    min-height: 40px;
    max-height: 420px;
    overflow: overlay;
    ul.content {
      > li {
        margin-bottom: 13px;
        > label {
          color: #888e99;
          font-size: 13px;
        }
        > .el-select {
          height: 30px;
          line-height: 30px;
          width: 110px;
          position: relative;
          top: -1px;
          margin-right: 28px;
          .el-input__inner {
            height: 30px;
            font-size: 13px;
            padding-left: 10px;
            padding-right: 24px;
          }
          .el-input__suffix {
            top: 2px;
            right: 0;
          }
          &.express {
            width: 160px;
          }
        }
        .tips-box {
          margin-bottom: 20px;
        }
        > .ctrl-menus-container {
          margin-left: 12px;
        }
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
    button {
      width: 120px;
      height: 30px;
      padding: 0;
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
