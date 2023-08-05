<template>
  <li class="lv1" v-if="item">
    <p class="openClose">
      <el-checkbox :disabled="disabled" @change="checkChange" v-model="checked" :indeterminate="indeterminate">{{item[propKey.Name]}}</el-checkbox>
      <span @click="openClose = !openClose">{{ !openClose ?'展开':"折叠" }}</span>
    </p>
    <ul v-show="openClose">
      <CheckboxLv2
      v-for="lv2it in item.children" :key="lv2it.ID"
      :item="lv2it"
      :propKey="{
        key: 'ID',
        Name: 'ClassName',
      }"
      ref="lv2"
      :disabledProducts="disabledProducts"
      @setDisabled="setDisabled"
      @change="lv2change"/>
    </ul>
  </li>
</template>
<script>

import CheckboxLv2 from './CheckboxLv2';

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
    disabledProducts: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CheckboxLv2,
  },
  data() {
    return {
      Lv2Data: {},
      checked: false,
      indeterminate: false,
      openClose: false,
      disabled: true,
    };
  },
  computed: {
  },
  methods: {
    checkChange() {
      const cb = (bool) => {
        this.$refs.lv2.forEach(it => {
          it.setCheck(bool);
        });
        // this.$refs.lv2.forEach(it => {
        //   it.setCheckList(bool);
        // });
      };
      // checkChange 触发 走到这一行的时候 checked 的值已经改变
      if (!this.checked) { // 如果当前是全选
        // 全不选
        cb(false);
      } else {
        // 全选
        cb(true);
      }
    },

    getStatus() {
      const keys = Object.keys(this.Lv2Data);
      const checkedkey = keys.some(key => !this.Lv2Data[key].checked);
      if (checkedkey) {
        this.checked = false;
      } else {
        this.checked = true;
      }

      this.indeterminate = keys.some(key => this.Lv2Data[key].indeterminate);
      if (!this.indeterminate) {
        if (keys.filter(key => this.Lv2Data[key].checked).length === 0) {
          this.indeterminate = false;
        } else {
          this.indeterminate = keys.filter(key => this.Lv2Data[key].checked).length !== this.item.children.length;
        }
      }
    },
    lv2change(id, status) {
      this.Lv2Data[id] = status;
      this.getStatus();
    },
    initData() {
      this.checked = false;
      this.indeterminate = false;
      this.openClose = false;
      this.$refs.lv2.forEach(it => {
        it.initData();
      });
    },
    ClosedData() {
      this.$refs.lv2.forEach(it => {
        it.setCheck(false);
      });
    },
    setDisabled() {
      this.disabled = false;
    },
  },
  async mounted() {
    this.item.children.forEach(it => {
      this.Lv2Data[it.ID] = {};
    });
  },
};
</script>
