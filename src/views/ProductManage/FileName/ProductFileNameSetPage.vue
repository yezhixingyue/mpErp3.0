<template>
  <section class="mp-erp-product-list-page-product-file-name-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
      <div v-if="productData">
        <div class="left">
          <el-checkbox v-model="productData.AllowAnalysisName">允许进行文件名解析</el-checkbox>
          <div>
            <el-checkbox v-model="productData.AllowBatchUpload" v-show="productData.AllowAnalysisName">允许进行批量上传</el-checkbox>
          </div>
          <el-checkbox v-model="productData.IsAppendWeight">附加重量</el-checkbox>
          <el-checkbox v-model="productData.IsAppendPrice">附加价格 （如果有的话）</el-checkbox>
        </div>
        <ul class="right">
          <li>
            <span>分隔符：</span>
            <el-input size="small" @focus="onInpFocus('SplitChars')" @blur="onInpBlur" v-model="SplitChars"></el-input>
            <div :class="showTipType === 'SplitChars' ? 'active':''" class="tip">只可输入 , ' | / 和空格等5种符号</div>
          </li>
          <li>
            <span>部件开始结束符号：</span>
            <el-input size="small" @focus="onInpFocus('PartSplitChars')" @blur="onInpBlur" v-model.trim="PartSplitChars"></el-input>
            <div :class="showTipType === 'PartSplitChars' ? 'active':''" class="tip">只可输入【】 {} []  《》 &lt; &gt; () （）等符号，必须成对出现</div>
          </li>
          <li>
            <span>元素组开始结束符号：</span>
            <el-input size="small" @focus="onInpFocus('GroupSplitChars')" @blur="onInpBlur" v-model.trim="GroupSplitChars"></el-input>
            <div :class="showTipType === 'GroupSplitChars' ? 'active':''" class="tip">只可输入【】 {} []  《》 &lt; &gt; () （）等符号，必须成对出现，且不可与其它分隔符重复</div>
          </li>
          <li>
            <span>工艺开始结束符号：</span>
            <el-input size="small" @focus="onInpFocus('CraftSplitChars')" @blur="onInpBlur" v-model.trim="CraftSplitChars"></el-input>
            <div :class="showTipType === 'CraftSplitChars' ? 'active':''" class="tip">只可输入【】 {} []  《》 &lt; &gt; () （）等符号，必须成对出现，且不可与其它分隔符重复</div>
          </li>
          <li class="explain" @click="onExplainClick">
            <i>?</i>
            <span>说明</span>
          </li>
        </ul>
      </div>
    </header>
    <main>
      <ExplainDrawer :visible.sync='drawer' />
      <template v-if="productData">
        <ItemContentShow key="product" :itemData='productData' @change='onItemDataChange' show />
        <ItemContentShow isPart v-for="it in productData.PartList" :key='it.ID' :itemData='it' @change='onItemDataChange' />
      </template>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { SplitCharsReg, GroupAndPartSplitCharsReg } from '@/assets/js/utils/regexp';
import ExplainDrawer from '@/components/ProductManageComps/FileName/ExplainDrawer.vue';
import ItemContentShow from '@/components/ProductManageComps/FileName/ItemContentShow';

export default {
  name: 'ProductFileNameSet',
  components: {
    ExplainDrawer,
    ItemContentShow,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    SplitChars: {
      get() {
        return this.productData ? this.productData.SplitChars : '';
      },
      set(val) {
        this.productData.SplitChars = val.replace(SplitCharsReg, '');
      },
    },
    PartSplitChars: {
      get() {
        return this.productData ? this.productData.PartSplitChars : '';
      },
      set(val) {
        this.productData.PartSplitChars = val.replace(GroupAndPartSplitCharsReg, '');
      },
    },
    GroupSplitChars: {
      get() {
        return this.productData ? this.productData.GroupSplitChars : '';
      },
      set(val) {
        this.productData.GroupSplitChars = val.replace(GroupAndPartSplitCharsReg, '');
      },
    },
    CraftSplitChars: {
      get() {
        return this.productData ? this.productData.CraftSplitChars : '';
      },
      set(val) {
        this.productData.CraftSplitChars = val.replace(GroupAndPartSplitCharsReg, '');
      },
    },
  },
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      productData: null,
      drawer: false,
      showTipType: '',
    };
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.getProductOrderData();
    },
    async getProductOrderData(dataType = ['FalseWords']) { // 获取初始产品信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        // 获取数据成功
        this.productData = resp.data.Data;
      }
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    onExplainClick() {
      this.drawer = true;
    },
    onItemDataChange(e) { // 监听数据改变
      if (!this.productData || !e) return;
      const { isPart, ID } = e;
      if (!isPart) { // 产品上
        this.handleDataChange(this.productData, e);
      } else { // 部件上
        const t = this.productData.PartList.find(it => it.ID === ID);
        if (!t) return;
        this.handleDataChange(t, e);
      }
    },
    handleDataChange(data, e) { // 处理数据改变
      const { position, FalseWords, GroupID, CraftID, ElementID } = e;
      const _data = data;
      if (position === 'self') { // 自身名称
        _data.FalseWords = FalseWords;
      }
      if (position === 'element') { // 元素
        this.handleElementTypeDataChange(_data, e);
      }
      if (position === 'group' && GroupID) { // 元素组
        this.handleGroupTypeDataChange(_data, e);
      }
      if (position === 'craft' && CraftID) { // 工艺
        const t = _data.CraftList.find(it => it.ID === CraftID);
        if (!t) return;
        if (e.ElementID && e.ElementID === CraftID) t.FalseWords = FalseWords; // 工艺本身
        else if (e.ElementID && !e.GroupID) this.handleElementTypeDataChange(t, e); // 工艺上元素
        else if (e.ElementID && e.GroupID) this.handleGroupTypeDataChange(t, e); // 工艺上元素组
      }
      if (position === 'SizeGroup') { // 尺寸组
        if (_data.SizeGroup && _data.SizeGroup.GroupInfo && _data.SizeGroup.GroupInfo.ID === GroupID) {
          if (GroupID === ElementID) { // 尺寸组本身
            _data.SizeGroup.GroupInfo.FalseWords = FalseWords;
          } else {
            this.handleElementTypeDataChange(_data.SizeGroup.GroupInfo, e);
          }
        }
      }
      if (position === 'material') { // 物料
        _data.MaterialFalseWords = FalseWords;
      }
    },
    handleElementTypeDataChange(data, payload) { // 处理元素类型 或 元素选项类型值修改的方法
      if (!data || !payload) return;
      const { ElementID, OptionID, FalseWords } = payload;
      const t = data.ElementList.find(it => it.ID === ElementID);
      if (!t) return;
      if (!OptionID) t.FalseWords = FalseWords;
      else if (t.OptionAttribute && t.OptionAttribute.OptionList && t.OptionAttribute.OptionList.length > 0) {
        const o = t.OptionAttribute.OptionList.find(it => it.ID === OptionID);
        if (o) o.FalseWords = FalseWords;
      }
    },
    handleGroupTypeDataChange(data, payload) { // 元素组数据修改处理
      const { GroupID, ElementID, FalseWords } = payload;
      const group = data.GroupList.find(it => it.ID === GroupID);
      if (!group) return;
      if (group.ID === ElementID) { // 部件本身
        group.FalseWords = FalseWords;
      } else {
        this.handleElementTypeDataChange(group, payload);
      }
    },
    async onSubmitClick() {
      if (!this.productData) return;
      const { SplitChars, PartSplitChars, GroupSplitChars, CraftSplitChars } = this.productData;
      if (!GroupSplitChars || !SplitChars || !PartSplitChars || !CraftSplitChars) {
        this.messageBox.failSingleError('保存失败', '分隔符与开始结束符号必填，请输入及补充分隔符');
        return;
      }
      const resp = await this.api.getProductSetFalseWords(this.productData).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.messageBox.successSingle('设置成功', this.onGoBackClick, this.onGoBackClick);
      }
    },
    onInpFocus(type) {
      this.showTipType = type;
    },
    onInpBlur() {
      this.showTipType = '';
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-file-name-set-comp-wrap {
  height: 100%;
  // width: 1724px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
  overflow-y: overlay;
  > header {
    padding: 30px 0;
    line-height: 15px;
    box-sizing: border-box;
    height: 200px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    background-color: #fff;
    padding-left: 20px;
    margin-bottom: 10px;
    width: 1714px;
    > div {
      padding-top: 28px;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      > .left {
        display: flex;
        align-items: center;
        width: 400px;
        min-width: 354px;
        flex-wrap: wrap;
        padding-top: 22px;
        border-right: 1px solid #eee;
        > div {
          width: 140px;
        }
        .el-checkbox {
          display: flex;
          align-items: center;
          width: 140px;
          margin-bottom: 15px;
          > .el-checkbox__label {
            font-size: 12px;
            color: #585858;
          }
        }
      }
      > ul {
        display: flex;
        padding-left: 30px;
        padding-bottom: 15px;
        align-items: flex-end;
        > li {
          > span {
            color: #888E99;
            margin-bottom: 10px;
            display: block;
          }
          width: 235px;
          margin-right: 18px;
          &.explain {
            margin-left: 15px;
            padding-left: 15px;
            height: 20px;
            line-height: 20px;
            display: flex;
            border-left: 1px solid #eee;
            margin-bottom: 6px;
            font-size: 12px;
            align-items: center;
            cursor: pointer;
            user-select: none;
            width: 60px;
            > i {
              margin-right: 5px;
              width: 13px;
              height: 13px;
              color: #FF3769;
              border: 1px solid #FF3769;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            > span {
              margin: 0;
            }
            &:hover {
              > span {
                color: #444;
              }
            }
          }
          position: relative;
          > div.tip {
            position: absolute;
            bottom: -52px;
            font-size: 12px;
            height: 50px;
            line-height: 18px;
            opacity: 0;
            left: 0;
            right: 0;
            transition: 0.1s ease-in-out;
            &.active {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 20px;
    background-color: #fff;
    width: 1714px;
    box-sizing: border-box;
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    padding-left: 20px;
    background-color: #fff;
    padding-bottom: 30px;
    padding-right: 300px;
    width: 1714px;
    box-sizing: border-box;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
