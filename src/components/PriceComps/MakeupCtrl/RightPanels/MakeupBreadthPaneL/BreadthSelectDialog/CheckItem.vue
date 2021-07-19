<template>
  <section class="mp-erp-price-module-breadth-select-check-item-container">
    <header>
      <el-checkbox class="item-title" v-model="checkItemAll" :indeterminate="isIndeterminate">{{data.Name}}</el-checkbox>
      <span class="collapse" :class="{open: isOpen}" @click="isOpen=!isOpen">{{ isOpen ? '收起' : '展开' }} <i class="el-icon-arrow-down"></i> </span>
    </header>
    <main v-show="isOpen">
      <div v-for="it in data.list" :key="it.ID">
        <label>{{it.Name}}</label>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="复选框 A" v-for="item in getModeList(it.ModeList)" :key="item.ID">{{item.Name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </main>
  </section>
</template>

<script>
import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isOpen: true,
      checkList: [],
    };
  },
  computed: {
    checkItemAll: {
      get() {
        return false;
      },
      set(val) {
        console.log(val);
      },
    },
    isIndeterminate() {
      return false;
    },
  },
  methods: {
    getModeList(ModeList) {
      const ids = ModeList.map(it => it.Mode);
      return MakeupMode.filter(it => ids.includes(it.ID));
    },
  },
};
</script>
<style lang='scss'>
</style>
