<template>
  <el-checkbox-group v-model="checkList"
  @change="checkChange()"
  >
    <el-checkbox @change="checkItemChange(item[propKey.key])" v-for="item in List" :key="item[propKey.key]"
    :label="item[propKey.key]"
    >{{item[propKey.Name]}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    List: {
      type: Array,
      default: () => [],
    },
    propKey: {
      type: Object,
      default: () => ({
        key: 'ID',
        Name: 'ClassName',
      }),
    },
  },
  data() {
    return {
      checkList: [],
    };
  },
  computed: {
    ...mapState('AfterSaleQuestion', ['SaveDialogData']),
    ProductIDS() {
      return this.SaveDialogData.ProductIDS;
    },
  },
  methods: {
    ...mapMutations('AfterSaleQuestion', ['ChangeSaveDialogData']),
    checkItemChange(key) {
      const ids = [...this.ProductIDS];
      const index = ids.findIndex(it => key === it);
      if (index === -1) {
        ids.push(key);
      } else {
        ids.splice(index, 1);
      }
      this.ChangeSaveDialogData(['ProductIDS', ids]);
    },
    checkListChange() {
      const ids = [...this.ProductIDS];
      this.List.forEach(key => {
        const index = ids.findIndex(it => key.ID === it);
        // 全选的情况
        if (this.checkList.length && index === -1) {
          ids.push(key.ID);
        }
        // 全不选的情况
        if (index !== -1 && this.checkList.length === 0) {
          ids.splice(index, 1);
        }
      });
      this.ChangeSaveDialogData(['ProductIDS', ids]);
    },

    checkChange() {
      this.$emit('change', this.checkList);
      const ids = [...this.ProductIDS];
      this.checkList.forEach(item => {
        const index = ids.findIndex(it => item === it);
        if (index === -1) {
          ids.push(item);
        } else {
          ids.splice(index, 1);
        }
      });
    },
    setCheckList(ARR = []) {
      this.checkList = ARR;
      this.checkChange();
      this.checkListChange();
    },
    initData() {
      const allIDs = this.List.map(it => it.ID);
      const selectIds = this.ProductIDS.filter(it => allIDs.find(el => el === it));
      this.checkList = selectIds;
      this.$emit('change', this.checkList);
    },
  },
  // watch: {
  //   ProductIDS: {
  //     immediate: true,
  //     handler: function handler(val) {
  //       const allIDs = this.List.map(it => it.ID)
  //       this.currentPlacement = val;
  //     },
  //   },
  // },
};
</script>
