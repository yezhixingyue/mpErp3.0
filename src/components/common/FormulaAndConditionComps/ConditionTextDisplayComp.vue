<template v-if="conditionObj">
  <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
    <div slot="content">
      <p class="if-box"><span class="is-origin">当</span> {{conditionObj.FilterTypeText}}：</p>
      <template v-if="Array.isArray(conditionObj.conditionText)">
        <p v-for="(it, i) in conditionObj.conditionText" :key="it.name + 'tips' + i">
          <span v-if="i > 0" class="type">{{conditionObj.Constraint.FilterType === 1 ? '且' : '或'}}</span>
          <span class="name">{{it.name}}</span>
          <span class="is-origin">{{it.operator}}</span>
          <span class="val">{{it.val}}</span>
          <span v-if="i === conditionObj.conditionText.length - 1" style="margin-left:2px"> 。</span>
          <span v-else style="margin-left:2px">；</span>
        </p>
      </template>
      <p v-else>{{conditionObj.conditionText}}</p>
      <p class="if-box" style="margin-right:5px">
        <span class="is-origin">时 生效。</span>
      </p>
    </div>
    <div class="common-property-condition-text-content-box">
      <p class="if-box"><span class="is-origin">当</span> {{conditionObj.FilterTypeText}}</p>
      <template v-if="Array.isArray(conditionObj.conditionText)">
        <p v-for="(it, i) in conditionObj.conditionText" :key="it.name + 'content' + i">
          <span v-if="i > 0" class="type">{{conditionObj.Constraint.FilterType === 1 ? '且' : '或'}}</span>
          <span>{{it.name}}</span>
          <span>{{it.operator}}</span>
          <span>{{it.val}}</span>
        </p>
      </template>
      <p v-else>{{conditionObj.conditionText}}</p>
      <p class="if-box" style="margin-left:10px;margin-right:5px">
        <span class="is-origin">时 生效。</span>
      </p>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    conditionObj: {
      type: Object,
      default: null,
    },
  },
};
</script>
<style lang='scss'>
</style>
