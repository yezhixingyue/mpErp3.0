<template>
  <li class="lv2" v-if="item">
    <el-checkbox @change="checkChange" v-model="checked" :indeterminate="indeterminate">{{item[propKey.Name]}}</el-checkbox>
    <CheckboxLv3
    :List="item.children"
    :propKey="{
      key: 'ID',
      Name: 'ClassName',
    }"
    ref="lv3"
    @change="lv3change"/>
  </li>
</template>
<script>

import CheckboxLv3 from './CheckboxLv3';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    item: {
      type: Object,
      default: () => null,
    },
    propKey: {
      type: Object,
      default: () => ({
        key: 'ID',
        Name: 'ClassName',
      }),
    },
  },
  components: {
    CheckboxLv3,
  },
  data() {
    return {
      checkList: [],
      Lv3List: [],
      checked: false,
    };
  },
  computed: {
    indeterminate() {
      if (this.Lv3List.length === 0 || this.Lv3List.length === this.item.children.length) {
        return false;
      }
      return true;
    },
  },
  methods: {
    checkChange() {
      if (this.Lv3List.length === this.item.children.length) { // 如果当前是全选
        // 全不选
        this.$refs.lv3.setCheckList([]);
      } else {
        // 全选
        this.$refs.lv3.setCheckList(this.item.children.map(it => it.ID));
      }
      // this.$emit('change', this.checked);
    },
    setCheck(bool) {
      if (bool) {
        this.$refs.lv3.setCheckList(this.item.children.map(it => it.ID));
      } else {
        this.$refs.lv3.setCheckList([]);
      }
    },
    lv3change(list) {
      this.Lv3List = list;
      this.checked = this.Lv3List.length === this.item.children.length;
      this.$emit('change', this.item.ID, { checked: this.checked,
        indeterminate: this.indeterminate });
    },
    initData() {
      this.$refs.lv3.initData();
    },
  },
};
</script>
