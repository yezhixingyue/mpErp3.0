<!--
 * @Describe: 行政区域选择树形组件
 * @FilePath: /src/components/common/NewComps/AdAreaComp.vue
-->
<template>
  <section>
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      >
    </el-tree>
  </section>
</template>

<script>
export default {
  data() {
    return {
      props: {
        label: 'Name',
        isLeaf: 'leaf',
      },
      count: 1,
      areaList: [],
    };
  },
  methods: {
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate);
    // },
    // handleNodeClick(data) {
    //   console.log(data);
    // },
    // eslint-disable-next-line consistent-return
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const _data = await this.getAreaData(-1);
        return resolve([..._data]);
      }
      if (node.level > 2) return resolve([]);
      // console.log(node.level);
      const _data2 = await this.getAreaData(node.data.ID);
      if (node.level === 2) {
        _data2.forEach(it => {
          const _it = it;
          _it.leaf = true;
        });
      }
      resolve(_data2);
    },
    async getAreaData(parentID) {
      const res = await this.api.getDistrictList(parentID);
      if (res.data.Status !== 1000) return [];
      return res.data.Data;
    },
  },
  mounted() {
  },
};
</script>

<style>

</style>
