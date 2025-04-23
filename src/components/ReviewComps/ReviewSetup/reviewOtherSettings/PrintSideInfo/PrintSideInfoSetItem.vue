<template>
  <section class="mp-erp-review-manage-list-page-comps-other-print-side-info-set-up-comp-wrap">
    <header>
      <h2 class="mp-common-title-wrap">单双面设置：</h2>
      <span class="blue-span ft-13" @click="visible = true">设置单双面</span>
      <span class="gray ft-12 content">{{content}}</span>
    </header>
    <PrintSideInfoSetDialog :elements="elements" :PrintSideInfo="PrintSideInfo" :visible.sync="visible" @submit="submit" />
  </section>
</template>

<script>
import PrintSideInfoSetDialog from './PrintSideInfoSetDialog.vue';
import { PrintSideTypeEnumList, PrintSideTypeEnums } from '../../../../../store/review/reviewEnums';

export default {
  props: {
    Product: {
      type: Object,
      default: null,
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
  components: {
    PrintSideInfoSetDialog,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    positionID() {
      let id = '';
      if (this.Part) {
        id = this.Part.ID;
      } else if (this.Product) {
        id = this.Product.ID;
      }
      return id;
    },
    elements() {
      return this.filterMultiplePartElements
        .filter(it => (it.Type === 2 && it.OptionAttribute && it.OptionAttribute.IsRadio && it.OptionAttribute.OptionList?.length > 0))
        .filter(it => (!it._Group || (it._Group.UseTimes && it._Group.UseTimes.MinValue === 1 && it._Group.UseTimes.MaxValue === 1)))
        .map(it => ({ ...it, Name: it._Part && it._Part.Name ? `${it._Part.Name}:${it.Name}` : it.Name }));
    },
    content() {
      if (!this.PrintSideInfo) return '';
      const list = this.elements;
      const t = PrintSideTypeEnumList.find(it => it.ID === this.PrintSideInfo.SideType);
      if (t && t.Name) {
        const c = t.Name;
        if (this.PrintSideInfo.SideType !== PrintSideTypeEnums.propMap.ID || list.length === 0) {
          return c;
        }
        const getPropName = (data) => {
          if (!data) return '';
          let str = '';
          const { Part, Group, Element, OptionList } = data;
          if (Element && Element.Name && OptionList && OptionList.length > 0) {
            str = '(';
            if (Part && Part.Name) str += `${Part.Name}:`;
            if (Group && Group.Name) str += `${Group.Name}:`;
            str += `${Element.Name} - ${OptionList.map(it => it.Name).join('/')})`;
          }
          return str;
        };
        let s = getPropName(this.PrintSideInfo.SingleSide);
        let d = getPropName(this.PrintSideInfo.DoubleSide);
        s = s ? `单面${s}` : s;
        d = d ? `双面${d}` : d;
        return s && d ? `${c}：${s}、 ${d}` : c;
      }
      return '';
    },
    PrintSideInfo() {
      let PrintSideInfo = null;
      if (this.Part) {
        PrintSideInfo = this.Part.PrintSideInfo;
      } else if (this.Product) {
        PrintSideInfo = this.Product.PrintSideInfo;
      }
      return PrintSideInfo;
    },
  },
  methods: {
    async submit(e) {
      if (!e || !this.Product?.ID) return;
      const temp = {
        ProductID: this.Product.ID,
      };
      if (this.Part) temp.PartID = this.Part.ID;
      temp.PrintSideInfo = e;
      const resp = await this.api.getCheckFilePrintSideSetup(temp).catch(() => null);
      if (resp?.data.Status === 1000) {
        const cb = () => {
          this.$emit('changed', temp);
          this.visible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-list-page-comps-other-print-side-info-set-up-comp-wrap {
  > header {
    > h2 {
      font-weight: 700;
      margin-bottom: 15px;
    }
    > .blue-span {
      margin-right: 20px;
      margin-left: 13px;
    }
    padding: 10px 0 18px;
    white-space: nowrap;

    > .content {
      white-space: normal;
      display: inline-block;
      vertical-align: top;
      max-width: calc(100% - 8em);
    }
  }
}
</style>
