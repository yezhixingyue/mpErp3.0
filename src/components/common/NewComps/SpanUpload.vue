<template>
  <span class="blue-span mp-erp-common-span-upload-comp-wrap" @click="onClick">
    {{label}}
    <input type="file" name="" id="" ref="oInp" @change="onFlieInputChange" :multiple='multiple' :accept='accept'>
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '导入表',
    },
    accept: {
      type: String,
      default: '*',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    uploadApiLabel: {
      type: String,
      default: 'getPriceTableImport',
    },
    canRepeat: { // 是否可以连续重复上传
      type: Boolean,
      default: false,
    },
    paramsArray: {
      type: Array,
      defalut: () => [],
    },
  },
  methods: {
    onClick() {
      this.$refs.oInp.click();
    },
    async onFlieInputChange(e) {
      if (!e.target.files || !e.target.files[0]) return;
      const file = e.target.files[0];
      const resp = await this.api[this.uploadApiLabel](file, ...this.paramsArray).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        // 上传（导入）成功，查看数据，触发事件
        this.$emit('afterUpload', resp.data.Data);
        if (this.canRepeat) this.$refs.oInp.value = '';
      } else {
        this.$refs.oInp.value = '';
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-span-upload-comp-wrap {
  > input {
    display: none;
  }
}
</style>
