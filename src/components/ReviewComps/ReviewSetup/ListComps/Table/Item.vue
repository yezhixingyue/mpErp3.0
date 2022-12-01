<template>
  <li v-if="item" class="mp-erp-review-product-table-item-comp-wrap">
    <dl
      class="header"
      @click="handleActive"
      :class="{ active: activeId === item.ID }"
    >
      <dt :title="itemTitle">{{ itemTitle }}</dt>
      <dd class="checked-input-name">
        <el-checkbox v-model="localOrderNameMustInput" :disabled="!hasPermission"></el-checkbox>
        <span>审稿时必须填写订单名称</span>
      </dd>
      <dd
        v-for="it in PanelTypeEnumListWidthCount.filter(_it => !_it.withPart)"
        :key="it.ID"
        :style="`width:${it.width}%`"
        :title="it.Name"
      >
        <span @click.stop="onMenuClick(it, -1)" v-if="hasPermission">
          <i v-if="it.icon" :class="it.icon"></i>
          <span>{{ it.Name }}<template v-if="it.Count"> ({{it.Count}})</template></span>
        </span>
      </dd>
      <dd :class="{ disabled: !hasShowPart, arrow: true }">
        <span @click.stop="onVisibleClick">
          <span>{{ visible ? "收起" : "展开" }}</span>
          <i
            class="caret"
            :class="visible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          ></i>
        </span>
      </dd>
    </dl>

    <div class="content" v-if="hasShowPart" v-show="visible">
      <dl v-for="(part) in localPartList" :key="part.ID">
        <dt :title="part.Name">{{ part.Name }}</dt>
        <dd
          v-for="it in getNumberData(part, PanelTypeEnumList.filter((it) => it.withPart))"
          :key="it.ID"
          :style="`width:${it.partWidth || it.width}%`"
          :title="it.Name"
        >
          <span @click.stop="onMenuClick(it, part._index)" v-if="hasPermission">
            <i v-if="it.icon" :class="it.icon"></i>
            <span>{{ it.Name }}<template v-if="it.Count"> ({{it.Count}})</template></span>
          </span>
        </dd>
      </dl>
    </div>
  </li>
</template>

<script>
import { PanelTypeEnumList } from '../../../../../store/review/reviewEnums';

export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    itemIndex: {
      type: Number,
      default: -1,
    },
    activeId: {
      type: String,
      default: '',
    },
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    itemTitle() {
      if (!this.item) return '';
      const { Name, ProductClass } = this.item;
      if (!Name || !ProductClass) return '';
      const { FirstLevelName, SecondLevelName } = ProductClass;
      return [FirstLevelName, SecondLevelName, Name].filter(it => it).join('-');
    },
    hasPart() {
      return this.item && Array.isArray(this.item.PartList) && this.item.PartList.length > 0;
    },
    localPartList() {
      const list = [];
      if (this.item?.IsSelected) {
        list.push({ ...this.item, _index: -1, Name: '产品' });
      }
      if (this.hasPart) {
        list.push(...this.item.PartList.filter(it => it.IsSelected).map((it, i) => ({ ...it, _index: i })));
      }
      return list;
    },
    hasShowPart() {
      return this.localPartList && this.localPartList.length > 0;
    },
    PanelTypeEnumListWidthCount() {
      return this.getNumberData(this.item, this.PanelTypeEnumList);
    },
    localOrderNameMustInput: {
      get() {
        return this.item?.OrderNameMustInput || false;
      },
      async set(val) {
        const temp = {
          ProductID: this.item?.ID,
          OrderNameMustInput: val,
        };
        const resp = await this.api.getCheckFileOtherSetup(temp).catch(() => null);
        if (resp?.data.Status === 1000) {
          this.$emit('OrderNameMustInputChange', temp);
        }
      },
    },
  },
  data() {
    return {
      PanelTypeEnumList,
      visible: false,
    };
  },
  methods: {
    onVisibleClick() {
      if (!this.hasShowPart) return;
      this.handleActive();
      this.visible = !this.visible;
    },
    onMenuClick(panelType, itemPartIndex) {
      // partIndex 为当前部件所在的索引  如果为-1则指的是产品本身
      if (this.itemIndex === -1) return;
      this.handleActive();
      const temp = {
        itemIndex: this.itemIndex,
        itemPartIndex,
        panelType,
      };
      this.$emit('menuClick', temp);
    },
    handleActive() {
      this.$emit('active', this.item.ID);
    },
    getNumberData(item, enumList) {
      if (!item) return [];
      const getNumber = (KeyOfCount) => {
        if (!KeyOfCount) return '';
        if (item.SetupCountAttribute && Object.prototype.hasOwnProperty.call(item.SetupCountAttribute, KeyOfCount)) {
          return item.SetupCountAttribute[KeyOfCount] || '0';
        }
        if (KeyOfCount === 'SelectedPartNumber') {
          return this.localPartList.length || '0';
        }
        return '0';
      };
      return enumList.map(it => ({
        ...it,
        Count: getNumber(it.KeyOfCount),
      }));
    },
  },
  watch: {
    localPartList(newVal, oldVal) {
      if ((newVal.length > 0 && oldVal.length === 0) || (newVal.length === 0 && oldVal.length > 0)) {
        this.visible = !this.visible;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-product-table-item-comp-wrap {
  font-size: 12px;
  margin-bottom: 10px;
  > .header {
    background: rgb(248, 248, 248);
    height: 44px;
    line-height: 28px;
    border: 1px solid rgba($color: #000000, $alpha: 0);
    box-sizing: border-box;
    transition: background 0.05s ease-in-out;
    &:hover {
      border-color: #ccc;
      box-shadow: -2px 0 0 #ccc;
    }
    transition: 0.05s ease-in-out;
    &.active {
      background: #ebebeb;
      border-color: #ddd;
      box-shadow: -2px 0 0 #ddd;
    }
  }
  > div.content {
    padding-top: 2px;
    // padding-bottom: 10px;
    > dl {
      height: 40px;
      line-height: 24px;
      > dt {
        width: 260px;
        margin-left: calc(16.8% - 135px);
        margin-right: 2%;
        // width: 33.3%;
        // margin-left: 0;
        // margin-right: 18px;
      }
      transition: background 0.05s ease-in-out;
      &:hover {
        background: #d8effc5e;
      }
    }
  }
  dl {
    padding: 8px 0;
    box-sizing: border-box;
    color: #585858;
    white-space: nowrap;
    > dt,
    > dd {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 10px;
      box-sizing: border-box;
    }

    > dt {
      width: 33.3%;
      text-align: center;
      // margin-right: 4%;
    }

    > dd {
      > span {
        color: #26bcf9;
        cursor: pointer;
        user-select: none;
        transition: color 0.05s ease-in-out;
        // text-align: center;
        &:hover {
          color: #35dff9;
        }
        &:active {
          color: darken($color: #26bcf9, $amount: 12);
        }
        > i {
          margin-right: 3px;
          &.caret {
            margin-left: 3px;
            margin-right: 0;
            font-size: 18px;
          }
        }
      }
      &.disabled {
        pointer-events: none;
        user-select: none;
        > span {
          color: #cbcbcb !important;
          cursor: not-allowed;
        }
      }
      &.arrow {
        margin-left: 15px;
        > span > i {
          position: relative;
          top: 1px;
        }
      }
      &.hide {
        visibility: hidden;
      }
      &.checked-input-name {
        width: 33.3%;
        text-align: right;
        padding-right: 25px;
        box-sizing: border-box;
        margin-right: 6%;
        > span {
          font-size: 12px;
          color: #888;
          margin-left: 6px;
        }
      }
    }
  }
  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
