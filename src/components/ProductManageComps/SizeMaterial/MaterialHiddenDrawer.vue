<template>
  <el-drawer
    :visible.sync="visible"
    :show-close='false'
    :before-close="handleClose"
    class="mp-erp-comps-pruduct-module-material-hidden-drawer-comp-wrap"
    @open='onOpen'
    @closed='onClosed'>
    <span slot="title" @click="handleClose" class="explain-title">
      <i class="el-icon-arrow-right"></i> 设置隐藏
    </span>
    <section class="drawer-content">
      <ul>
        <li v-for="(it, index1) of list" :key="it.ID">
          <p class="mp-common-title-wrap">{{it.Name}}</p>
          <div>
            <SetHiddenContentItem v-for="(it, i) of it.ShowList" :key="it.Name + i" :itemData='it' @change='(data) => change(data, index1, i)' />
          </div>
        </li>
      </ul>
    </section>
    <footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="onCancle">取消</el-button>
    </footer>
  </el-drawer>
</template>

<script>
import SetHiddenContentItem from './SetHiddenContentItem.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SetHiddenContentItem,
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    onSubmit() {
      const _list = [];
      this.list.forEach(lv1 => {
        lv1.ShowList.forEach(lv2 => {
          lv2.List.forEach(it => {
            if (it.HiddenToCustomer) _list.push(it.ID);
          });
        });
      });
      this.$emit('change', _list);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.list = [];
    },
    handleClose() {
      this.onCancle();
    },
    initEditData() { // 数据初始化方法
      this.list = JSON.parse(JSON.stringify(this.value));
    },
    change(data, index1, index2) {
      const _obj = this.list[index1].ShowList[index2];
      if (_obj && _obj.List) {
        if (typeof data === 'string') {
          const t = _obj.List.find(it => it.ID === data);
          if (t) t.HiddenToCustomer = !t.HiddenToCustomer;
        }
        if (Array.isArray(data)) {
          _obj.List = _obj.List.map(it => ({ ...it, HiddenToCustomer: data.length > 0 }));
        }
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-hidden-drawer-comp-wrap {
  .el-drawer {
    width: 80% !important;
    max-width: 1220px !important;
    min-width: 800px;
    > header {
      padding-left: 16px;
      .explain-title {
        cursor: pointer;
        font-size: 15px;
        color: #888E99;
        display: flex;
        align-items: center;
        transition: 0.1s ease-in-out;
        > i {
          font-size: 18px;
          margin-right: 6px;
        }
        &:hover {
          color: #585858;
          > i {
            font-weight: 700;
          }
        }
        > em {
          font-size: 12px;
          color: #a2a2a2;
        }
      }
    }
  }

  .el-drawer__body {
    height: calc(100% - 70px);
    > .drawer-content {
      display: flex;
      padding-left: 50px;
      height: calc(100% - 100px);
      width: 98%;
      overflow-y: auto;
      flex-direction: column;
      > ul {
        > li {
          display: flex;
          padding-bottom: 15px;
          > p {
            width: 125px;
            flex: none;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-top: 2px;
            color: #444;
          }
        }
      }
    }
    > footer {
      text-align: center;
      padding-top: 40px;
      height: 100px;
      > button {
        height: 35px;
        border-radius: 3px;
        padding: 0;
        width: 120px;
        &.el-button--default {
          border-color: #26bcf9;
          color: #26bcf9;
          &:active {
            border-color: #428dfa;
            color: #428dfa;
          }
        }
        &.el-button--primary {
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          &:hover {
            opacity: 0.88;
          }
          &:active {
            background: linear-gradient(to right, #428dfa, #26bcf9);
          }
        }
      }
    }
  }

  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  input {
    border-radius: 3px;
  }
}
</style>
