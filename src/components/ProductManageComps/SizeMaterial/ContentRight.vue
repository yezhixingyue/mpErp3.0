<template>
  <section class="mp-erp-product-page-material-size-comp-right-conten-wrap">
    <header>
      <el-button type="primary" size="small" @click="onGeneralSizeSaveClick">设置固定尺寸</el-button>
      <span class="label">尺寸组：</span>
      <span class="name">{{SizeGroup && SizeGroup.GroupInfo ? SizeGroup.GroupInfo.Name : '未设置'}}</span>
      <span class="blue-span" @click="setSizeGroupClick">设置尺寸组</span>
    </header>
    <main>
      <SizeGroupSetDialog :visible.sync='SizeGroupVisible' :PositionID='curPositionID' v-model="localSizeGroup" />
      <GeneralSizeSetDialog :visible.sync="GeneralSizeVisible" :SizeGroup='SizeGroup' @submit='onGeneralSizeSaveSubmit' />
      <ul v-if="SizeGroup && SizeGroup.SizeList">
        <li v-for="it in SizeGroup.SizeList" :key="it.ID">
          <span class="name">{{it.Name}}</span>
          <div class="content">
            <span v-for="(name, i) in getContentList(it.List, it.HiddenToCustomer)" :key="name + i">{{name}}</span>
          </div>
          <span class="del-btn" @click="onItemRemove(it)"><i></i> 删除</span>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import SizeGroupSetDialog from './SizeGroupSetDialog.vue';
import GeneralSizeSetDialog from './GeneralSizeSetDialog.vue';

export default {
  props: {
    curProduct: {
      type: Object,
      default: null,
    },
    curPart: {
      type: Object,
      default: null,
    },
    SizeGroup: {
      type: Object,
      default: null,
    },
  },
  components: {
    SizeGroupSetDialog,
    GeneralSizeSetDialog,
  },
  data() {
    return {
      SizeGroupVisible: false,
      GeneralSizeVisible: false,
    };
  },
  computed: {
    curPositionID() {
      if (!this.curProduct) return '';
      if (this.curPart) return this.curPart.ID;
      return this.curProduct.ID;
    },
    localSizeGroup: {
      get() {
        return this.SizeGroup;
      },
      set(val) {
        this.$emit('SizeGroupSubmit', val);
      },
    },
  },
  methods: {
    onGeneralSizeSaveClick() { // 设置固定尺寸
      if (!this.SizeGroup) {
        this.messageBox.failSingle('请先设置尺寸组');
        return;
      }
      this.GeneralSizeVisible = true;
    },
    setSizeGroupClick() {
      this.SizeGroupVisible = true;
    },
    onGeneralSizeSaveSubmit(SizeList) {
      this.$emit('GeneralSizeSubmit', SizeList);
    },
    getContentList(list, HiddenToCustomer) {
      let _list = list.map(it => {
        const { First, Second } = it;
        const { ElementList } = this.SizeGroup.GroupInfo || {};
        if (!ElementList) return Second;
        let name = '';
        const t = ElementList.find(_it => _it.ID === First);
        if (t) {
          name = `${t.Name}：`;
          let _second = Second;
          if (t.Type === 2) {
            const target = t.OptionAttribute.OptionList.find(option => option.ID === Second);
            if (target) _second = target.Name;
          }
          name += _second;
          if (t.Unit) name += t.Unit;
        } else {
          name = Second;
        }
        return name;
      });
      const item = HiddenToCustomer ? '客户隐藏' : '客户显示';
      _list = [..._list, item];
      return _list;
    },
    onItemRemove({ Name, ID }) {
      this.messageBox.warnCancelBox('确定删除该固定尺寸吗', `尺寸名称：[ ${Name} ]`, () => {
        this.$emit('GeneralSizeRemove', ID);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-page-material-size-comp-right-conten-wrap {
  padding-left: 45px;
  > header {
    white-space: nowrap;
    > span {
      font-size: 14px;
      white-space: nowrap;
      &.label {
        color: #888E99;
        margin-left: 23px;
      }
      &.name {
        margin-left: 6px;
        color: #585858;
        font-weight: 700;
      }
      &.blue-span {
        font-size: 12px;
        margin-left: 25px;
      }
    }
  }
  > main {
    > ul {
      padding-right: 35px;
      padding-top: 35px;
      > li {
        font-size: 12px;
        display: flex;
        align-items: center;
        padding: 14px 0 10px 0;
        border-bottom: 1px solid #eee;
        max-width: 745px;
        .name {
          font-size: 13px;
          color: #444;
          flex: none;
          width: 125px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 10px;
        }
        > div.content {
          flex: 1;
          color: #585858;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 20px;
          > span {
            margin-right: 15px;
          }
        }
        .del-btn {
          font-size: 12px;
          user-select: none;
          display: flex;
          align-items: center;
          position: relative;
          top: 0px;
          color: #a2a2a2;
          flex: none;
          padding-right: 15px;
          width: 60px;
          > i {
            display: inline-block;
            width: 12px;
            height: 18px;
            vertical-align: middle;
            margin-right: 6px;
            background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
          }
          cursor: pointer;
          transition: color 0.05s ease-in-out;
          &:hover {
            color: #444 !important;
          }
        }
      }
    }
  }
}
</style>
