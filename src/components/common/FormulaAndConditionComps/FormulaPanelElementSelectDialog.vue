<template>
  <CommonDialogComp
    width="850px"
    top='10vh'
    title="添加元素"
    :visible.sync="visible"
    :showSubmit='false'
    cancelText='关闭'
    @cancle="onCancle"
    @open='onOpen'
    class="mp-erp-common-comps-formula-panel-comp-element-select-comp-wrap"
  >
    <section class="show-panel-box">
      <header>
        <el-radio-group v-model="panelRadio" size="mini" class="mp-common-tab-radio-box" v-if="panelList.length > 1">
          <el-radio-button :label="it.value" v-for="it in panelList" :key="it.value">{{it.label}}</el-radio-button>
        </el-radio-group>
        <p v-else-if="DialogTitle">{{DialogTitle}}</p>
      </header>
      <main v-if="showData" >
        <div v-for="it in showData" :key="it.Type">
          <span class="title mp-common-title-wrap">{{getTitle(it.Type)}}</span>
          <!-- 元素组类型 -->
          <ElementGroupTypeShowComp v-if="it.Type === 2" :dataList='it.list' :selectedElementIDs='selectedElementIDs' @submit="onSubmit" />
          <!-- 元素类型 -->
          <ElementTypeShowComp v-else-if="it.Type === 3" :dataList='it.list' :selectedElementIDs='selectedElementIDs' @submit="onSubmit" />
          <!-- 工艺类型 -->
          <CraftTypeShowComp v-else-if="it.Type === 4" :dataList='it.list' :selectedElementIDs='selectedElementIDs' @submit="onSubmit" />
          <!-- 物料类型 -->
          <MaterialTypeShowComp :useType='useType' v-else-if="it.Type === 5" :dataList='it.list' :selectedElementIDs='selectedElementIDs' @submit="onSubmit" />
          <!-- 尺寸组类型 - 共用元素组组件 -->
          <ElementGroupTypeShowComp v-else-if="it.Type === 6" :dataList='it.list' :selectedElementIDs='selectedElementIDs' @submit="onSubmit" />
          <!-- 其它类型 -->
          <div v-else>
            <TipsSpanButton :disabled='selectedElementIDs.includes(item.StoredContent)'
             v-for="item in it.list" :key="item.StoredContent" @click.native="onSubmit(item)" :text='getTextName(item) || item.DisplayContent || "未知名称"' />
          </div>
        </div>
        <p class="constant" v-if="showConstant">
          <span class="blue-span" @click="onConstantClick">常量</span>
        </p>
      </main>
      <main v-else class="null-box">
        <img src="@/assets/images/null.png" alt="">
        <p class="is-font-size-12 is-gray">暂无数据，请先添加</p>
      </main>
    </section>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import { FormulaUseModuleEnum } from '@/assets/js/TypeClass/FormulaClass';
import PropertyClass, { ElementSelectTypeEnum } from '@/assets/js/TypeClass/PropertyClass';
import ElementGroupTypeShowComp from './ElementGroupTypeShowComp.vue';
import ElementTypeShowComp from './ElementTypeShowComp.vue';
import CraftTypeShowComp from './CraftTypeShowComp.vue';
import MaterialTypeShowComp from './MaterialTypeShowComp.vue';

export default {
  components: {
    CommonDialogComp,
    TipsSpanButton,
    ElementGroupTypeShowComp,
    ElementTypeShowComp,
    CraftTypeShowComp,
    MaterialTypeShowComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    selectedElementIDs: {
      type: Array,
      default: () => [],
    },
    useType: {
      type: String,
      default: 'condition',
    },
    DialogTitle: {
      type: String,
      default: '',
    },
    showConstant: {
      type: Boolean,
      default: false,
    },
    curTargetID: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      propertyData: null,
      panelRadio: '', // 上方选项卡的值
      panelList: [],
      tempTabList: [
        { label: '产品', value: 'ProductProperty' },
        { label: '物料', value: 'MaterialProperty' },
      ],
    };
  },
  computed: {
    showData() {
      if (this.propertyData && this.panelRadio) {
        if (this.propertyData[this.panelRadio]) return this.propertyData[this.panelRadio];
        if (this.propertyData.PartProperty[this.panelRadio]) return this.propertyData.PartProperty[this.panelRadio];
      }
      return null;
    },
    // tabList() {
    //   if (!this.propertyData) return [];
    //   const _temp = [];
    //   if (this.propertyData.ProductProperty && this.propertyData.ProductProperty.length > 0) {
    //     _temp.push({ Name: '产品', ID: 'ProductProperty' });
    //   }
    //   if (this.propertyData.PartProperty) {
    //     const keys = Object.keys(this.propertyData.PartProperty);
    //     if (keys && keys.length >)
    //   }
    //   return _temp;
    // },
  },
  methods: {
    onSubmit(data) {
      if (this.selectedElementIDs.includes(data.StoredContent)) return;
      this.$emit('submit', data);
      this.onCancle();
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
    getInitListData() {
      this.panelList = [];
      if (!ElementSelectTypeEnum || !this.list) return;
      // 分类
      // 判断1. 判断所在位置： 产品 | 部件 | 都不是（如特定物料：物料类型元素 物料尺寸） 判断来源：Part（可为null） Product（可为null） 如果都为null则即不是产品也不是部件 -- 可形成顶部tab栏
      // 根据上面判断先定义好几个对应类型的枚举值：product（产品）、part（部件）、material（物料）等（后续补充...）
      // 判断2. 继续判断所在位置（在即不是产品也不是部件的时候）： 判断Material（物料）值是否存在，如果存在则为物料相关；其它情况后面补充
      // 判断3. 判断数据类型：根据Type值判断，如为0时代表元素类型（名称需拼接前缀--在即不是产品也不是部件时） 为1时代表物料尺寸
      // 结束 --- 形成特定的数据格式 以渲染至页面中 ---- 方法根据项目进度慢慢补充完整
      // 1. 先整理是物料的情况
      const _data = {
        ProductProperty: [],
        PartProperty: {}, // [key]: [] 数据形式
        MaterialProperty: [],
      }; // 数据类型汇总对象列表
      this.list.forEach(it => { // 遍历每个属性列表，为每个列表属性归类
        // 1 确定位置
        if (it.Product && it.Product.ID && !it.Part) {
          if (it.Product.ID === this.curTargetID && this.tempTabList && this.tempTabList[0].label) {
            if (!this.tempTabList[0].label.includes('（当前）')) this.tempTabList[0].label += '（当前）';
          }
          _data.ProductProperty.push(it);
        } else if (it.Product && it.Product.ID && it.Part && it.Part.ID) { // 可能有多个部件 所以部件这里还需划分： 暂以Part.ID为key值进行划分
          let key = it.Part.Name || it.Part.ID;
          if (this.curTargetID === it.Part.ID) key += '（当前目标）';
          if (_data.PartProperty[key] && Array.isArray(_data.PartProperty[key])) _data.PartProperty[key].push(it);
          else _data.PartProperty[key] = [it];
        } else if (it.Material && it.Material.ID && !it.Product) _data.MaterialProperty.push(it);
      });
      // ↑ 完成分类
      // 2 对每个分类列表中的属性类型进行划分
      const _temp = this.protertyFilterHelper(_data); // 筛选空数组空对象 然后划分
      this.propertyData = _temp;
      if (Object.keys(_temp).length > 0) {
        const [key] = Object.keys(_temp);
        if (Array.isArray(_temp[key])) this.panelRadio = key;
        else if (Object.prototype.toString.call(_temp[key]) === '[object Object]') {
          const [subkey] = Object.keys(_temp[key]);
          if (Array.isArray(_temp[key][subkey])) this.panelRadio = subkey;
        }
      }
    },
    protertyFilterHelper(data) { // 对划分开的各个数据列表按照属性类型继续划分，并返回结果
      // 先对数据进行筛选 去除没有内容的项
      const temp = {};
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          temp[key] = this.protertySeparateHelper(data[key]); // 数组形式 继续对其进行划分
          const t = this.tempTabList.find(it => it.value === key);
          if (t) {
            console.log(t, key, temp[key], this.curTargetID);
            this.panelList.push({ ...t });
          }
        }
        if (Object.prototype.toString.call(data[key]) === '[object Object]' && Object.keys(data[key]).length > 0) {
          const _temp = {};
          Object.keys(data[key]).forEach(subKey => {
            _temp[subKey] = this.protertySeparateHelper(data[key][subKey]);
            if (key === 'PartProperty') {
              const t = this.panelList.find(it => it.value === subKey);
              if (!t) {
                console.log(subKey, _temp[subKey]);
                this.panelList.push({ label: subKey, value: subKey }); // 部件名称后面需要自动修改
              }
            }
          });
          temp[key] = _temp; // 对象形式 -- 部件
        }
      });
      return temp;
    },
    protertySeparateHelper(list) { // 数组按类型拆分为对象
      const _list = JSON.parse(JSON.stringify(list));
      const _obj = {};
      _list.forEach(it => {
        if (_obj[it.Type] && Array.isArray(_obj[it.Type])) _obj[it.Type].push(it);
        else _obj[it.Type] = [it];
      });
      const _temp = [];
      Object.keys(_obj).forEach(key => {
        _temp.push({
          Type: +key,
          list: _obj[key],
        });
      });
      return _temp;
    },
    onOpen() {
      this.getInitListData();
    },
    getTitle(Type) {
      const t = ElementSelectTypeEnum.find(it => it.ID === Type);
      if (t) {
        if (Type !== 0) return t.nickName;
        const _t = FormulaUseModuleEnum.find(it => it.type === this.panelRadio);
        if (_t) return `${_t.label}${t.nickName}`;
        return t.label;
      }
      return '';
    },
    getTextName(item) {
      return PropertyClass.getProperyName(item);
    },
    onConstantClick() {
      this.$emit('submit', null);
      this.onCancle();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-formula-panel-comp-element-select-comp-wrap {
  .el-dialog__body {
    padding-left: 50px;
    padding-right: 37px;
    height: 560px;
    overflow-y: auto;
    > .show-panel-box{
      > header {
        padding-bottom: 28px;
        > p {
          font-weight: 700;
          font-size: 15px;
          color: #444;
        }
      }
      > main {
        > div {
          // display: flex;
          padding-bottom: 12px;
          padding-top: 6px;
          > span.title {
            width: 120px;
            overflow: hidden;
            white-space: nowrap;
            margin-right: 10px;
            flex: none;
            color: #444;
            padding-bottom: 12px;
          }
          > div {
            display: flex;
            flex-wrap: wrap;
            > span {
              margin: 0 10px;
              padding-bottom: 10px;
              white-space: nowrap;
            }
          }
        }
        > p.constant {
          border-top: 1px solid #ddd;
          margin-top: 15px;
          padding-top: 15px;
          position: relative;
          left: -20px;
          padding-left: 20px;
          > span {
            font-size: 14px;
          }
        }
      }
      > .null-box {
        text-align: center;
        padding-right: 50px;
        padding-top: 50px;
        > p {
          padding-top: 20px;
        }
      }
    }
  }
  .is-element {
    font-size: 14px;
    color: #428DFA;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #428cfadc;
    }
    &:active {
      color: #0959cf;
    }
  }
}

</style>
