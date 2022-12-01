<template>
  <section class="mp-erp-review-manage-list-page-comps-other-print-color-info-set-up-comp-wrap">
    <header>
      <p class="mp-common-title-wrap">印色设置：</p>
      <div class="c">
        <span class="blue-span" @click="onChangeClick(null, false)">+ 添加印色设置</span>
        <div>
          <label for="">默认印色：</label>
          <span class="is-gray">{{defaultContent}}</span>
        </div>
        <span class="blue-span" @click="onChangeClick(null, true)">设置默认颜色</span>
      </div>
    </header>
    <main>
      <PrintColorSetupDialog
       :visible.sync="visible"
       :item="curEditItem"
       :isDefault="isDefault"
       :elements="elements"
       :Product="Product"
       :PrintColorList="PrintColorList"
       @submit="onDialogSubmit"
       />
      <PrintColorTable :list="PrintColorList" @edit="onChangeClick" @remove="remove" />
    </main>
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import PrintColorSetupDialog from './PrintColorSetupDialog.vue';
import PrintColorTable from './PrintColorTable';
import PrintColorItemClass from './PrintColorItemClass';

export default {
  props: {
    Product: {
      type: Object,
      default: () => ({}),
    },
    Part: {
      type: Object,
      default: null,
    },
    filterMultiplePartElements: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [recordScrollPositionMixin('.mp-erp-review-manage-list-page-comps-other-print-color-info-set-up-comp-wrap .el-table__body-wrapper')],
  components: {
    PrintColorSetupDialog,
    PrintColorTable,
  },
  data() {
    return {
      visible: false,
      curEditItem: null,
      curEditIndex: -1,
      isDefault: false,
    };
  },
  computed: {
    curItem() {
      return this.Part || this.Product;
    },
    defaultContent() {
      return PrintColorItemClass.getColorDisplayContent(this.curItem.DefaultPrintColor);
    },
    elements() {
      return this.filterMultiplePartElements
        .filter(it => (it.Type === 2 && (it.OptionAttribute?.OptionList?.length > 0 || it?.OptionAttribute?.Allow === true)));
    },
    PrintColorList() {
      const list = this.curItem && Array.isArray(this.curItem.PrintColorList) ? this.curItem.PrintColorList : [];
      return list.map(it => ({
        ...it,
        _PropDisplayContent: PrintColorItemClass.getPropOptionDisplayContent(it),
        _ColorDisplayContent: PrintColorItemClass.getColorDisplayContent(it.ColorList),
      }));
    },
  },
  methods: {
    onChangeClick(item, isDefault = false) { // 添加|编辑 点击事件
      let temp = {
        data: null,
        index: -1,
      };
      if (item) {
        temp = item;
      }
      const { data, index } = temp;
      this.curEditItem = isDefault ? { ColorList: this.curItem?.DefaultPrintColor || [] } : data;
      this.curEditIndex = index;
      this.isDefault = isDefault;
      this.visible = true;
    },
    onDialogSubmit(data) {
      if (!data) return;

      const temp = {
        ...data,
        ProductID: this.Product.ID,
      };

      if (this.Part) {
        temp.PartID = this.Part.ID;
      }

      // 分为默认颜色设置 和 印色设置 getCheckFileDefaultPrintColorSetup ---  准备进行接口提交
      this.submit(temp);
    },
    async submit(data) {
      const requestFunc = this.isDefault ? this.api.getCheckFileDefaultPrintColorSetup : this.api.getCheckFilePrintColorSetup;
      const resp = await requestFunc(data).catch(() => null);
      if (resp?.data.Status === 1000) { // 新增时 id 为 resp.data.Data
        const cb = () => {
          if (this.isDefault) {
            this.$emit('changed', data); // 默认时可以直接添加， 印色设置时需要另外处理
          } else {
            this.handleChanged({ item: { ...data.PrintColor, ID: resp.data.Data }, index: this.curEditIndex });
          }
          this.visible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async remove({ data, index }) {
      const resp = await this.api.getCheckFilePrintColorRemove(data.ID).catch(() => null);
      if (resp?.data.Status === 1000) {
        const cb = () => {
          this.handleChanged({ index, isRemove: true });
          this.visible = false;
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    handleChanged({ item, index, isRemove }) {
      let list = this.curItem && Array.isArray(this.curItem.PrintColorList) ? this.curItem.PrintColorList : [];
      list = [...list];
      if (isRemove) {
        list.splice(index, 1);
      } else if (index === -1) { // 新增
        list.push(item);
      } else {
        list.splice(index, 1, item);
      }
      const temp = {
        PrintColorList: list,
        ProductID: this.Product.ID,
      };
      if (this.Part) {
        temp.PartID = this.Part.ID;
      }
      this.$emit('changed', temp);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-list-page-comps-other-print-color-info-set-up-comp-wrap {
  min-width: 600px;
  > header {
    > .mp-common-title-wrap {
      margin-bottom: 15px;
    }
    > .c {
      display: flex;
      overflow: hidden;
      color: #585858;
      > .blue-span {
        flex: none;
      }
      > div {
        flex: 1;
        text-align: right;
        margin: 0 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
