<template>
  <section v-if="itemData" class="mp-erp-product-module-filename-item-content-show-comp-wrap">
    <header>
      <span class="mp-common-title-wrap is-black">{{itemData.ShowName || itemData.Name}}</span>
      <span class="icon" :class="showMain ? 'show' : ''" @click="showMain = !showMain">
        {{ showMain ? '收起' : '展开' }}
        <i class="el-icon-arrow-down"></i>
      </span>
    </header>
    <main v-show="showMain">
      <!-- 产品|部件名称 -->
      <SingleElementItem v-model="PartFalseWords"  />

      <!-- 元素 -->
      <p class="part-title" v-if="itemData.ElementList.length > 0">元素 --</p>
      <div>
        <SingleElement v-for="it in itemData.ElementList" :key="it.ID" :ElementData='it' @change="onNameDataChange($event, 'element')" />
      </div>

      <!-- 元素组 -->
      <p class="part-title" v-if="itemData.GroupList.length > 0">元素组 --</p>
      <SingleElementGroup v-for="group in itemData.GroupList" :key="group.ID" :group='group' @change="onNameDataChange($event, 'group')" />

      <!-- 工艺 -->
      <p class="part-title" v-if="itemData.CraftList.length > 0">工艺 --</p>
      <div>
        <SingleCraft v-for="craft in itemData.CraftList" :key="craft.ID" :craft='craft' @change="onNameDataChange($event, 'craft')" />
      </div>

      <!-- 尺寸组 -->
      <p class="part-title" v-if="itemData.SizeGroup">尺寸组 --</p>
      <div>
        <SingleElementGroup
         key="SizeGroup" isSizeGroup v-if="itemData.SizeGroup" :group='itemData.SizeGroup.GroupInfo' @change="onNameDataChange($event, 'SizeGroup')" />
      </div>

      <!-- 物料  ? -->
      <p class="part-title">物料</p>
      <SingleElement :ElementData='MaterialFalseWords' @change="onNameDataChange($event, 'material')" />
    </main>
  </section>
</template>

<script>
import SingleElement from './SingleElement';
import SingleElementGroup from './SingleElementGroup';
import SingleElementItem from './SingleElement/SingleElementItem';
import SingleCraft from './SingleCraft';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
    isPart: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SingleElement,
    SingleElementItem,
    SingleElementGroup,
    SingleCraft,
  },
  computed: {
    PartFalseWords: {
      get() {
        return this.itemData ? this.itemData.FalseWords : null;
      },
      set(val) {
        const temp = {
          FalseWords: val,
        };
        this.onNameDataChange(temp, 'self');
      },
    },
    MaterialFalseWords: {
      get() {
        return this.itemData ? { Name: this.itemData.MaterialDisplayName, FalseWords: this.itemData.MaterialFalseWords, ID: '' } : null;
      },
      // set(val) {
      //   const temp = {
      //     FalseWords: val,
      //   };
      //   this.onNameDataChange(temp, 'material');
      // },
    },
  },
  methods: {
    onNameDataChange(e, position) { // 元素变化 元素组变化
      if (!e) return;
      const temp = {
        ...e,
        position,
        isPart: this.isPart,
        ID: this.itemData.ID,
      };
      this.$emit('change', temp);
    },
  },
  data() {
    return {
      showMain: false,
    };
  },
  mounted() {
    this.showMain = this.show;
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-filename-item-content-show-comp-wrap {
  > header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > .mp-common-title-wrap {
      font-size: 15px;
      min-width: 7em;
      margin-right: 2em;
      &::before {
        height: 15px;
      }
    }
    > .icon {
      font-size: 12px;
      color: #A2A2A2;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      line-height: 15px;
      &.show > i {
        transform: rotateZ(180deg);
      }
      > i {
        margin-left: 10px;
        font-size: 12px;
        width: 15px;
        height: 15px;
        background-color: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
    }
  }
  > main {
    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .part-title {
      color: #F4A307;
      font-size: 14px;
      padding-left: 14px;
      position: relative;
      margin-top: 20px;
      margin-bottom: 4px;
      &::before {
        content: '';
        position: absolute;
        height: 6px;
        width: 6px;
        background-color: #F4A307;
        border-radius: 50%;
        left: 0;
        top: calc(50% - 3px);
      }
    }
  }
}
</style>
