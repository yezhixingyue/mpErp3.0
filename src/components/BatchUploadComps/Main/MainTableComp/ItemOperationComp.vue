<template>
  <ul v-if="itemData" class="mp-c-batch-upload-page-main-table-operation-item-comp-wrap">
    <li class="f" @click="onUploadClick" :class="{disabled: itemData.orderStatus==='success'}" >
      <img src="@/assets/images/icon-upload.png" style="vertical-align: -3px;">
      <span class="label">下单</span>
    </li>
    <li @click="onDetailClick">
      <img src="@/assets/images/icon-detail.png" alt="" style="vertical-align: -5px;">
      <span class="label">详情</span>
    </li>
    <li @click="onRemoveClick" :class="{disabled: itemData.uploadStatus === 'uploading'}">
      <img src="@/assets/images/del-disabled.png" alt="" style="vertical-align: -3px;" v-if="itemData.uploadStatus === 'uploading'">
      <img src="@/assets/images/del.png" alt="" style="vertical-align: -3px;" v-else>
      <span class="label">删除</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isError() {
      if (!this.itemData) return false;
      return this.itemData.uploadStatus === 'fail' || this.itemData.orderStatus === 'fail'
       || !this.itemData.result.HavePrice || !this.itemData.result.HavePrice;
    },
  },
  methods: {
    onUploadClick() {
      if (this.itemData.orderStatus === 'success') return;
      this.$emit('upload', this.itemData);
    },
    onDetailClick() {
      this.$emit('detail', this.itemData);
    },
    onRemoveClick() {
      if (this.itemData.uploadStatus === 'uploading') return;
      this.$emit('remove', this.itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-operation-item-comp-wrap {
  text-align: center;
  > li {
    display: inline-block;
    margin: 0 5px;
    line-height: 18px;
    cursor: pointer;
    img {
      margin-right: 6px;
    }
    span.label {
      display: inline-block;
      min-width: 3em;
      text-align: left;
      color: #989898;
      transition: color 0.05s;
      user-select: none;
    }
    &.f {
      .i {
        text-align: right;
      }
    }
    &:hover {
      span.label {
        color: #585858;
      }
    }
    &.disabled, &.c {
      span.label {
        color: #cbcbcb;
      }
      cursor: not-allowed;
    }
  }
}
</style>
