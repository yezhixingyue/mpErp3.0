<template>
  <div class="mp-common-comp-area-address-rcc-select-comp-wrap">
    <!-- 省 -->
    <el-select v-model="RegionalID" :disabled="disabled" size="small">
      <el-option v-for="it in RegionalList" :key="it.ID" :label="it.Name" :value="it.ID"></el-option>
    </el-select>
    <!-- 市 -->
    <el-select v-model="CityID" :disabled="CityList.length === 0 || disabled" size="small">
      <el-option v-for="it in CityList" :key="it.ID" :label="it.Name" :value="it.ID"></el-option>
    </el-select>
    <!-- 区 -->
    <el-select v-model="CountyID" :disabled="CountyList.length === 0 || disabled" size="small">
      <el-option v-for="it in CountyList" :key="it.ID" :label="it.Name" :value="it.ID"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: null,
    },
    allAreaDataList: {
      type: Array,
      default: () => [],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    autoFill: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    RegionalList() {
      return this.allAreaDataList || [];
    },
    CityList() {
      const t = this.RegionalList.find(it => it.ID === this.RegionalID);
      return t && Array.isArray(t.children) ? t.children : [];
    },
    CountyList() {
      const t = this.CityList.find(it => it.ID === this.CityID);
      return t && Array.isArray(t.children) ? t.children : [];
    },
    RegionalID: {
      get() {
        return this.value ? this.value.RegionalID : '';
      },
      set(val) {
        const t = this.RegionalList.find(it => it.ID === val);
        if (t) {
          const temp = {
            RegionalID: t.ID,
            RegionalName: t.Name,
          };
          this.changeValue(temp, 'RegionalID');
        }
      },
    },
    CityID: {
      get() {
        return this.value ? this.value.CityID : '';
      },
      set(val) {
        const t = this.CityList.find(it => it.ID === val);
        if (t) {
          const temp = {
            CityID: t.ID,
            CityName: t.Name,
          };
          this.changeValue(temp, 'CityID');
        }
      },
    },
    CountyID: {
      get() {
        return this.value ? this.value.CountyID : '';
      },
      set(val) {
        const t = this.CountyList.find(it => it.ID === val);
        if (t) {
          const temp = {
            CountyID: t.ID,
            CountyName: t.Name,
          };
          this.changeValue(temp, 'CountyID');
        }
      },
    },
  },
  methods: {
    changeValue(obj, key) { // 省市区ID共用修改方法
      if (obj[key] === this[key]) return;
      const temp = { ...this.value, ...obj };
      this.$emit('input', temp);
    },
  },
  watch: {
    RegionalID() {
      if (this.CityList.length > 0) this.CityID = this.CityList[0].ID;
    },
    CityID() {
      if (this.CountyList.length > 0) this.CountyID = this.CountyList[0].ID;
    },
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('common/fetchAdAreaList');
    this.loading = false;
    if (!this.RegionalID && this.RegionalID !== 0 && !this.isEdit && this.autoFill) this.RegionalID = 1497; // 河南省的ID
  },
};
</script>
<style lang='scss'>
.mp-common-comp-area-address-rcc-select-comp-wrap {
  .el-select {
    .el-input {
      .el-input__inner {
        padding-left: 8px;
        padding-right: 26px;
        font-size: 12px;
      }
    }
  }
}
</style>
