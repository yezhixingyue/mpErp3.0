<template>
  <section class="mp-erp-customer-setup-page-price-range-table-comp-wrap">
    <header>
      <div>价格等级</div>
      <div></div>
      <div>操作</div>
    </header>
    <main ref="oScrollWrap">
      <ul ref="oContentWrap">
        <li v-for="(it, i) in localList" :key="it.CategoryID || it.key">
          <div>
            <el-input v-model.trim="it.CategoryName" size="mini" :disabled='!canSetup'></el-input>
          </div>
          <div></div>
          <div>
            <CtrlMenus
              v-show="canSetup"
              :showList="['del', 'add']"
              @remove="onRemoveClick(i)"
              @add="onAddClick"
              :canRemove="it.AllowRemove && localList.length > 1"
            />
          </div>
        </li>
      </ul>
    </main>
    <footer>
      <el-button type="primary" size="mini" @click="submit" v-show="canSetup">保 存</el-button>
    </footer>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import CustomerSetupItem from '@/assets/js/TypeClass/CustomerSetupItem';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    canSetup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CtrlMenus,
  },
  data() {
    return {
      localList: [],
    };
  },
  methods: {
    onAddClick() {
      // 添加一行
      const item = new CustomerSetupItem();
      this.localList.push(item);
      this.scrollToEnd();
    },
    onRemoveClick(index) {
      // 删除
      this.localList.splice(index, 1);
    },
    scrollToEnd() {
      // 滚动到底部
      this.$nextTick(() => {
        const d = this.$refs.oContentWrap.offsetHeight - this.$refs.oScrollWrap.offsetHeight;
        if (d > 0) this.$refs.oScrollWrap.scrollTop = d;
      });
    },
    checker() {
      // 1. 非空  2. 不允许重复
      if (this.localList.length === 0) {
        this.messageBox.failSingleError('保存失败', '列表为空');
        return false;
      }
      const t = this.localList.find((it) => it.CategoryName === '');
      if (t) {
        this.messageBox.failSingleError('保存失败', '存在名称为空的项');
        return false;
      }
      const names = this.localList.map((it) => it.CategoryName);
      const len = [...new Set(names)].length;
      if (len < this.localList.length) {
        this.messageBox.failSingleError('保存失败', '存在名称重复，请检查');
        return false;
      }
      if (JSON.stringify(this.localList) === JSON.stringify(this.list)) {
        this.messageBox.failSingleError('保存失败', '未发生更改');
        return false;
      }
      return true;
    },
    async submit() {
      // 保存
      if (!this.checker()) return;
      const resp = await this.api.getPriceGradeSaveRange(this.localList).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$emit('change', resp.data.Data || []);
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  mounted() {
    if (Array.isArray(this.list) && this.list.length > 0) {
      this.localList = this.list.map((it) => new CustomerSetupItem(it));
    } else {
      this.localList = [new CustomerSetupItem()];
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-setup-page-price-range-table-comp-wrap {
  > header > div,
  > main > ul > li > div {
    &:first-of-type {
      width: 550px !important;
      > div.el-input {
        width: 220px;
        line-height: 28px;
        > input {
          text-align: center;
          position: relative;
          top: -2px;
        }
      }
    }
    &:nth-of-type(2) {
      width: 10px !important;
      padding-right: 0px !important;
    }
    &:last-of-type {
      width: 260px !important;
    }
  }
  > header {
    margin-bottom: 8px;
  }
  > footer {
    text-align: center;
    padding-top: 30px;
    button {
      width: 120px;
      font-size: 14px;
    }
  }
}
</style>
