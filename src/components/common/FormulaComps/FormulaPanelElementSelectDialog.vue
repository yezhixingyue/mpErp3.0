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
    <section v-if="showData" class="show-panel-box">
      <header></header>
      <main>
        <div v-for="it in showData" :key="it.Type">
          <span class="title mp-common-title-wrap">{{getTitle(it.Type)}}</span>
          <!-- 元素组类型 -->
          <ElementGroupTypeShowComp v-if="it.Type === 2" :dataList='it.list' :selectedElementIDs='selectedElementIDs' />
          <!-- 其它类型 -->
          <div v-else>
            <TipsSpanButton :disabled='selectedElementIDs.includes(item.StoredContent)'
             v-for="item in it.list" :key="item.StoredContent" @click.native="onSubmit(item)" :text='getTextName(item)' />
          </div>
        </div>
      </main>
    </section>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import { FormulaUseModuleEnum } from '@/assets/js/TypeClass/FormulaClass';
import { ElementSelectTypeEnum, PropertyFixedType } from '@/assets/js/TypeClass/PropertyClass';
import ElementGroupTypeShowComp from './ElementGroupTypeShowComp.vue';

export default {
  components: {
    CommonDialogComp,
    TipsSpanButton,
    ElementGroupTypeShowComp,
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
  },
  data() {
    return {
      propertyData: null,
      panelRadio: '', // 上方选项卡的值
      panelList: [
        { label: '产品', value: 'ProductProperty' },
        { label: '物料', value: 'MaterialProperty' },
        // { label: '部件', value: 'PartProperty' }, // 部件应随数据动态添加
      ],
    };
  },
  computed: {
    showData() {
      if (this.propertyData && this.panelRadio) {
        if (this.propertyData[this.panelRadio]) return this.propertyData[this.panelRadio];
      }
      return null;
    },
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
        if (it.Product && it.Product.ID && !it.Part) _data.ProductProperty.push(it);
        else if (it.Product && it.Product.ID && it.Part && it.Part.ID) { // 可能有多个部件 所以部件这里还需划分： 暂以Part.ID为key值进行划分
          if (_data.PartProperty[it.Part.ID] && Array.isArray(_data.PartProperty[it.Part.ID])) _data.PartProperty[it.Part.ID].push(it);
          else _data.PartProperty[it.Part.ID] = [it];
        } else if (it.Material && it.Material.ID && !it.Product) _data.MaterialProperty.push(it);
      });
      // ↑ 完成分类
      // 2 对每个分类列表中的属性类型进行划分
      const _temp = this.protertyFilterHelper(_data); // 筛选空数组空对象 然后划分
      this.propertyData = _temp;
      if (Object.keys(_temp).length > 0) {
        const [key] = Object.keys(_temp);
        this.panelRadio = key;
      }
    },
    protertyFilterHelper(data) { // 对划分开的各个数据列表按照属性类型继续划分，并返回结果
      // 先对数据进行筛选 去除没有内容的项
      console.log(data);
      const temp = {};
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          temp[key] = this.protertySeparateHelper(data[key]); // 数组形式 继续对其进行划分
        }
        if (Object.prototype.toString.call(data[key]) === '[object Object]' && Object.keys(data[key]).length > 0) {
          const _temp = {};
          Object.keys(data[key]).forEach(subKey => {
            _temp[subKey] = this.protertySeparateHelper(data[key][subKey]);
            if (key === 'PartProperty') {
              const t = this.panelList.find(it => it.value === subKey);
              if (!t) this.panelList.push({ label: '部件', value: subKey }); // 部件名称后面需要自动修改
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
      const { FixedType, Element } = item;
      if (FixedType || FixedType === 0) {
        const t = PropertyFixedType.find(it => it.ID === FixedType);
        if (t) return t.Name;
        return '';
      }
      if (Element && Element.Name) return Element.Name;
      return '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-formula-panel-comp-element-select-comp-wrap {
  .el-dialog__body {
    padding-left: 50px;
    padding-right: 37px;
    max-height: 560px;
    min-height: 280px;
    overflow-y: auto;
    > .show-panel-box{
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
