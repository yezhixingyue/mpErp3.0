<template>
  <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
    <div slot="content">
      <div v-for="(res, ri) in tooltipList" :key="ri">
        <p v-if="typeof res === 'string'">{{res}}</p>
        <div v-else>
          <p>{{res.name}}：</p>
          <p class="mp-tree-table-tooltip-item" v-for="(it,i) in res.list" :key='i'>{{it}}；</p>
        </div>
      </div>
    </div>
    <div style="text-overflow: ellipsis;overflow: hidden;">
      适用区域：{{showContent}}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    list: {},
  },
  computed: {
    showContent() {
      if (typeof this.list === 'string') return this.list;
      const _list = this.list.map(it => {
        if (typeof it === 'string') return it;
        if (typeof it === 'object') {
          return `${it.name}：${it.list.join('；')}`;
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
