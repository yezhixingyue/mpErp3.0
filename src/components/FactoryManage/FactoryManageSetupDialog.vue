<template>
  <CommonDialogComp
    width="700px"
    :title="title"
    :visible="visible"
    @submit="onDialogSubmit"
    @cancle="onDialogCancle"
    @open='onOpen'
    @closed='onClosed'
  >
  <div class="">
    <ThreeLevelSelectComp
    :title='"产品"'
    v-model="locationIDs"
    :showLine='false'
    width1='150px'
    width2='150px'
    width3='150px'
    :level1Options='level1Options'
    :level2Options='level2Options'
    :level3Options='level3Options'
    :defaultProps="{ label: 'ClassName', value: 'ID' }"
    />
    <ul class="mp-erp-common-select-comps-three-level-select-comp-wrap" style="margin-top:30px">
      <li class="text">价格：</li>
      <li>
        <el-select v-model="ruleForm.Price.ID" placeholder="请选择" size="small"
        style="width:150px"
        class="mp-erp-new-common-select-comp-wrap el-select--small">
          <el-option
            v-for="item in PriceList" :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
      </li>
    </ul>
  </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import messageBox from '@/assets/js/utils/message';
import ThreeLevelSelectComp from '@/components/common/SelectorComps/ThreeLevelSelectComp.vue';
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: null,
    },
    FactoryID: {
      type: Number,
      default: null,
    },
    ProductList: {
      type: Array,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    ThreeLevelSelectComp,
  },
  computed: {
    ...mapState('common', ['productNames']),
    locationIDs: {
      get() {
        return {
          level1Val: this.ruleForm.Product.FirstLevelID,
          level2Val: this.ruleForm.Product.SecondLevelID,
          level3Val: this.ruleForm.Product.ProductID,
        };
      },
      set({ level1Val, level2Val, level3Val }) {
        this.ruleForm.Product.FirstLevelID = level1Val;
        this.ruleForm.Product.SecondLevelID = level2Val;
        this.ruleForm.Product.ProductID = level3Val;
      },
    },
    level1Options() {
      if (!this.ProductList || this.ProductList.length === 0) return [];
      return this.ProductList.filter(it => it.ParentID === -1);
    },
    level2Options() {
      if (!this.ProductList || this.ProductList.length === 0 || !this.ruleForm.Product.FirstLevelID) return [];
      return this.ProductList.filter(it => it.ParentID === this.ruleForm.Product.FirstLevelID);
    },
    level3Options() {
      const _arr = this.productNames.filter(it => {
        const Type = 1;
        const t = it.ClassifyList.find(_it => _it.Type === Type);
        if (!t) return false;
        const { FirstLevel, SecondLevel } = t;
        return FirstLevel.ID === this.ruleForm.Product.FirstLevelID && SecondLevel.ID === this.ruleForm.Product.SecondLevelID;
      }).map(it => ({ ID: it.ID, ClassName: it.Name }));
      return [..._arr];
    },
    title() {
      if (this.ruleForm.ID !== 0) return '编辑外发价格';
      return '添加外发价格';
    },
  },
  data() {
    return {
      ruleForm: {
        ID: 0,
        FactoryID: this.FactoryID,
        Product: {
          FirstLevelID: '',
          SecondLevelID: '',
          ProductID: '',
          ProductName: '',
        },
        Price: {
          ID: '',
          Name: '',
        },
        CreateTime: '',
      },
      PriceList: [],
    };
  },
  methods: {
    ...mapActions('common', ['getProductClassifyData', 'getAllProductNames']),
    onDialogSubmit() {
      if (!this.ruleForm.Product.ProductID) {
        messageBox.failSingleError('保存失败', '请选择产品');
        // 请选择产品
        return;
      }
      if (!this.ruleForm.Price.ID) {
        messageBox.failSingleError('保存失败', '请选择价格');
        // 请选择价格
        return;
      }
      this.$emit('submit', this.ruleForm);
    },
    onDialogCancle() {
      this.$emit('update:visible', false);
    },
    initEditData() {
      if (this.itemData) {
        this.ruleForm = JSON.parse(JSON.stringify(this.itemData));
        setTimeout(() => {
          this.ruleForm.Price.ID = this.itemData.Price.ID;
        }, 0);
      }
    },
    onOpen() {
      this.$nextTick(this.initEditData);
    },
    onClosed() {
      this.PriceList = [];
      this.ruleForm = {
        ID: 0,
        FactoryID: this.FactoryID,
        Product: {
          FirstLevelID: '',
          SecondLevelID: '',
          ProductID: '',
          ProductName: '',
        },
        Price: {
          ID: '',
          Name: '',
        },
        CreateTime: '',
      };
    },
    getPrice() {
      this.api.getProductPriceList(this.ruleForm.Product.ProductID).then(res => {
        if (res.data.Status === 1000) {
          this.PriceList = res.data.Data;
        }
      });
      //
    },
  },
  async mounted() {
    this.getProductClassifyData({ key: 6 });
    this.getAllProductNames();
  },
  watch: {
    'ruleForm.Product.ProductID': {
      handler(n) {
        this.ruleForm.Price.ID = '';
        this.ruleForm.Price.Name = '';
        this.PriceList = [];
        if (n) this.getPrice();
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
