<template>
  <el-tooltip :effect="effect" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
    <div slot="content">
      <div v-for="(res, ri) in tooltipList" :key="ri">
        <p v-if="typeof res === 'string'">{{res}}</p>
        <div v-else>
          <p>{{res.name}}：</p>
          <p class="mp-tree-table-tooltip-item" v-for="(it,i) in res.list" :key='i'>{{it}}；</p>
          <p class="mp-tree-table-tooltip-item" v-if="res.list.length === 0">不包含全部已有区域</p>
        </div>
      </div>
    </div>
    <div style="text-overflow: ellipsis;overflow: hidden;">
      {{title}}<template v-if="showContent">：</template>{{showContent}}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    list: {},
    effect: {
      type: String,
      default: 'light',
    },
    title: {
      type: String,
      default: '适用区域',
    },
    subTitle: {
      type: String,
      default: '区域',
    },
  },
  computed: {
    showContent() {
      if (typeof this.list === 'string') return this.list;
      const _list = this.list.map(it => {
        if (typeof it === 'string') return it;
        if (typeof it === 'object') {
          if (it.list && it.list.length > 0) return `${it.name}：${it.list.join('；')}`;
          return `${it.name}：不包含已有${this.subTitle}`;
        }
        return '';
      });
      return _list.join('、');
    },
    tooltipList() {
      if (typeof this.list === 'string') return [this.list];
      return this.list;
    },
  },
};
</script>
<style lang='scss'>
.mp-tree-table-tooltip-item {
  padding-left: 1.5em;
  // padding-left: 3em;
  // text-indent: -1.5em;
}
</style>
