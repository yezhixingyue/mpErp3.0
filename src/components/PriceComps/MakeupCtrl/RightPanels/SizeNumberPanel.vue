<template>
  <section class="mp-erp-price-module-makeup-ctrl-size-number-panel-container">
    <p class="title">{{Name}}：</p>
    <ul>
      <li>
        <span class="label">展开尺寸长度：</span>
        <span class="value">公式1</span>
        <el-input size="small" maxlength="9" v-model.trim="LengthDefaultValue"></el-input>
        <span class="blue-span">设置</span>
      </li>
      <li>
        <span class="label">展开尺寸宽度：</span>
        <span class="value">公式1</span>
        <el-input size="small" maxlength="9" v-model.trim="WidthDefaultValue"></el-input>
        <span class="blue-span">设置</span>
      </li>
      <li>
        <span class="label">内容不同的展开物料数量：</span>
        <span class="value">公式1</span>
        <el-input size="small" maxlength="9" v-model.trim="DifferentDefaultValue"></el-input>
        <span class="blue-span">设置</span>
      </li>
      <li>
        <span class="label">共需要印刷多少份：</span>
        <span class="value">公式1</span>
        <el-input size="small" maxlength="9" v-model.trim="PrintNumberDefaultValue"></el-input>
        <span class="blue-span">设置</span>
      </li>
    </ul>
    <FormulaPanelElementSelectDialog :visible.sync='visible' :list='PropertyList' @submit='onPropertySelected' :selectedElementIDs='[]'/>
    <!-- 右侧说明抽屉面板 -->
    <el-drawer :visible.sync="drawer" size='470px' :show-close='false'>
      <template slot='title'>
        <span class="drawer-title" @click="drawer=false"> <i class="el-icon-arrow-right"></i> 说明</span>
      </template>
      <div class="drawer-content">
        <p>注意：拼版时会使用此处设置的长度、宽度、数量进行拼版，并印刷指定份数。此处尺寸指的是展开尺寸，物料数量指的是每份不同印刷内容的物料数量。</p>
        <p class="is-pink">特别注意：物料数量是以此展开尺寸为基础的此尺寸物料数量，且印刷内容不同。</p>
        <div>
          <p>例如：</p>
          <ul>
            <li>
              锁线胶装画册 1000本，封面 4P，则宽度为成品宽度 *2+书脊厚度+勒口宽度*2，长度为成品长，物料数量则为 1，共需印刷 1000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容不同，则长度为成品长*2，宽度为成品宽，物料数量则为 16，共需印刷 1000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容相同1P循环，则长度为成品长*2，宽度为成品宽，物料数量则为 1，共需印刷 16000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容相同8P循环，则长度为成品长*2，宽度为成品宽，物料数量则为 2，共需印刷 8000份。
            </li>
          </ul>
          <p>
            <img src="@/assets/images/smile.png" alt="">
            <span class="is-gray">其他应用请自己思考</span>
          </p>
        </div>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';

export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false,
    },
    PropertyList: {
      type: Array,
      default: () => [],
    },
    initData: {
      type: Object,
      default: null,
    },
    Name: {
      type: String,
      default: '',
    },
  },
  components: {
    FormulaPanelElementSelectDialog,
  },
  computed: {
    drawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('update:drawerVisible', val);
      },
    },
  },
  data() {
    return {
      LengthFormula: null,
      LengthDefaultValue: '',
      WidthFormula: null,
      WidthDefaultValue: '',
      DifferentContentFormula: null,
      DifferentDefaultValue: '',
      PrintNumberFormula: null,
      PrintNumberDefaultValue: '',
      visible: false,
      selectedIndex: '',
    };
  },
  methods: {
    onPropertySelected(e) { // 左侧选中属性处理事件
      console.log('onPropertySelected', e);
    },
    getSubmitInfo() {
      const bool = this.getCheckResult();
      console.log(bool);
      // if (bool) return { List: this.localList };
      // return null;
    },
    fieldItemChecker(Property, value, title, isInteger) {
      if (Property) return true;
      if (!value && value !== 0) {
        this.messageBox.failSingleError('保存失败', `${title}未设置`);
        return false;
      }
      if (!this.$utils.getValueIsOrNotNumber(value, isInteger) || value <= 0) {
        this.messageBox.failSingleError('保存失败', `${title}输入数值不正确`);
        return false;
      }
      return true;
    },
    getCheckResult() {
      return this.fieldItemChecker(this.LengthFormula, this.LengthDefaultValue, '展开尺寸长度')
        && this.fieldItemChecker(this.WidthFormula, this.WidthDefaultValue, '展开尺寸宽度')
        && this.fieldItemChecker(this.DifferentContentFormula, this.DifferentDefaultValue, '内容不同的展开物料数量', true)
        && this.fieldItemChecker(this.PrintNumberFormula, this.PrintNumberDefaultValue, '印刷分数', true);
    },
  },
  mounted() {
    // if (this.initData && Array.isArray(this.initData.List)) { // 编辑时还原数据
    //   this.localList = JSON.parse(JSON.stringify(this.initData.List));
    // }
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-size-number-panel-container {
  > .title {
    font-weight: 700;
    font-size: 14px;
    color: #585858;
  }
  > ul {
    padding-top: 10px;
    > li {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .label {
        width: 12em;
        text-align: right;
      }
      .el-input {
        width: 80px;
        margin-right: 46px;
      }
      .value {
        min-width: 8em;
        margin-right: 1em;
        font-weight: 700;
        color: #585858;
      }
      .blue-span {
        font-size: 12px;
        margin-left: 1em;
      }
    }
  }
}
</style>
