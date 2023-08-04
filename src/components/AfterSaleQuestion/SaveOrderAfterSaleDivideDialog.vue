<template>
  <CommonDialogComp
    width="800px"
    top='12vh'
    :title="`${this.ID?'编辑':'添加'}问题类型`"
    :visible="visible"
    submitText='确定'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    destroy-on-close
    class="mp-erp-comps-save-order-after-sale-divide-dialog-comp-wrap"
   >
    <div class="lv1-item">
      <div class="from"><span>问题类型：</span>
        <el-input v-model="DivideName" size="small" placeholder="请输入问题类型" maxlength="50" show-word-limit></el-input>
      </div>
      <p>产品：</p>
      <ul class="product-list">
          <CheckboxLv1
            v-for="lv1it in ProductClassify" :key="lv1it.ID"
            :item="lv1it"
            ref="lv1"
            :disabledProducts="disabledProducts"
            :propKey="{key: 'ID',Name: 'ClassName'}">
          </CheckboxLv1>
      </ul>

    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CheckboxLv1 from './CheckboxLv1';
import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    EditData: {
      type: Object,
      default: () => null,
    },
    disabledProducts: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    CheckboxLv1,
  },
  data() {
    return {
      // ID: '',
      // DivideName: '',
      // ProductIDS: [],
    };
  },
  computed: {
    ...mapState('AfterSaleQuestion', ['SaveDialogData']),
    ...mapGetters('common', ['allProductClassifyWithEmpty', 'allProductClassify4CustomerWithEmpty']),
    ProductClassify() {
      return this.allProductClassifyWithEmpty
        .map(lv1it => ({ ...lv1it, children: lv1it.children.filter(lv2it => !!lv2it.children.length) }))
        .filter(it => it.children.length);
    },
    ID: {
      get() {
        return this.SaveDialogData.ID;
      },
      set(val) {
        this.ChangeSaveDialogData(['ID', val]);
      },
    },
    DivideName: {
      get() {
        return this.SaveDialogData.DivideName;
      },
      set(val) {
        this.ChangeSaveDialogData(['DivideName', val]);
      },
    },
    ProductIDS: {
      get() {
        return this.SaveDialogData.ProductIDS;
      },
      set(val) {
        this.ChangeSaveDialogData(['ProductIDS', val]);
      },
    },
  },
  methods: {
    ...mapMutations('AfterSaleQuestion', ['ChangeSaveDialogData']),
    onSubmit() {
      console.log(this.ProductIDS.length);
      if (!this.DivideName) {
        this.messageBox.failSingleError('保存失败', '请输入问题类型');
      } else if (!this.ProductIDS.length) {
        this.messageBox.failSingleError('保存失败', '请选择产品');
      } else {
        this.api.getOrderAfterSaleDivideSave(this.SaveDialogData).then(res => {
          if (res.data.Status === 1000) {
            this.$emit('getList');
            this.onCancle();
          }
        });
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(() => {
        this.initEditData();
        this.$refs.lv1.forEach(it => {
          it.initData();
        });
      });
    },
    onClosed() { // 关闭 重置表单
      this.ID = '';
      this.DivideName = '';
      this.ProductIDS = [];
      this.$emit('update:EditData', null);
      this.$refs.lv1.forEach(it => {
        it.ClosedData();
      });
    },
    initEditData() { // 数据初始化方法
      if (this.EditData) {
        this.ID = this.EditData.ID;
        this.DivideName = this.EditData.DivideName;
        this.ProductIDS = this.EditData.ProductIDS;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-save-order-after-sale-divide-dialog-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow-y: auto;
    padding-top: 10px;
    .lv1-item{
      line-height: 24px;
      .from{
        display: flex;
        align-items: center;
        >span{
          font-weight: 700;
          font-size: 16px;
        }
        .el-input{
          width: 400px;
        }
      }
      >p{
        margin-top: 10px;
        font-weight: 700;
          font-size: 16px;
      }
      .product-list{
        .openClose{
          position: relative;
          >span{
            top: 0;
            position: absolute;
            left: 200px;
            cursor: pointer;
            color: #26bcf9;
            padding: 0 6px;
            user-select:none;
          }
        }
        .el-checkbox{
          height: 24px;
          width: 200px;
          display: flex;
          align-items: center;
          margin-right: 10px;
          .el-checkbox__label{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .lv1{
          .lv2{
            padding-left: 20px;
            .el-checkbox-group{
              padding-left: 20px;
              display: flex;
              flex-wrap: wrap;
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
