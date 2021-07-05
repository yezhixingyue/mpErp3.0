<template>
  <el-drawer
  class="mp-erp-product-module-file-name-page-explain-drawer-comp-wrap"
  :visible.sync="visible"
  :show-close='false'
  :before-close="handleClose">
  <span slot="title" @click="handleClose" class="explain-title"><i class="el-icon-arrow-right"></i> 说明</span>
  <ul>
    <li>
      <span class="title">分隔符： </span>
      <p>允许多个符号，每个符号只能是单个半角或全角字符，各符号间不要留空格，空格本身也可以作为分隔符。例如：,'| /</p>
    </li>
    <li>
      <span class="title">开始结束符号： </span>
      <p>
        <span>必须成对设置，每个符号只能是单个半角或全角字符，两个符号成为一对，但不能是相同的符号，可以设置多对符号，每一对符号间使用空格分开，空格不可以作为开始结束符号。</span>
        <span class="is-pink">注意：部件和元素组不能设置相同的起始符号。 </span>
        <span>例如：【】 {} []  《》 &lt; &gt; () （）</span>
      </p>
    </li>
    <li>
      <span class="title">隐藏名称：</span>
      <p>
        <span class="block">指允许文件名不体现产品、部件、元素、元素组名称。允许隐藏，但不是必须隐藏，所以通假字还是可以用作解析名称。</span>
        <span class="block"><i class="is-bold">注意：</i>当需要进行文件名解析时，单部件产品可以隐藏部件名称，多部件产品不能隐藏，否则会解析不成功。</span>
        <span class="block is-pink">隐藏产品名称时，在下单面板需要先选中产品，后进行解析，批量下单面板操作相同。</span>
      </p>
    </li>
    <li>
      <span class="title">通假字：</span>
      <p>
        <span>通假字以空格分开，可以是英文、汉字、词。如果隐藏元素名称，数值元素只能依靠单位为判断属于哪个元素，所以同部件数值元素的单位不能相同。例如：盒 合 He</span>
        <i style="margin-left:30px">单面 单面印 单</i>
      </p>
    </li>
    <li>
      <span class="title">尺寸连接符：</span>
      <p>
        <span>指各尺寸维度间的连接符号。允许多个符号，每个符号只能是单个半角或全角字符，各符号间不要留空格，</span>
        <span class="is-pink">空格本身不能作为连接符。</span>
        <span class="block">例如：+x</span>
      </p>
    </li>
    <li>
      <span class="title">文件名解析：</span>
      <p>指可通过拖动文件到下单面板，解析文件名数据填充下单面板。</p>
    </li>
    <li>
      <span class="title">批量上传：</span>
      <p>指通过批量下单面板进行多文件批量下单，自动验证合法证，自动计算价格。</p>
    </li>
  </ul>
</el-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      explain1: {
        value1: 0,
        options1: [{ label: '铜版纸白色', value: 0 }, { label: '铜版纸黑色', value: 1 }, { label: '双胶纸白色', value: 2 }, { label: '双胶纸黑色', value: 3 }],
        value2: 0,
        options2: [{ label: '157克', value: 0 }, { label: '200克', value: 1 }],
      },
      explain2: {
        value1: 0,
        options1: [{ label: '铜版纸', value: 0 }, { label: '双胶纸', value: 1 }],
        value2: 0,
        options2: [{ label: '157克', value: 0 }, { label: '200克', value: 1 }],
        value3: 0,
        options3: [{ label: '白色', value: 0 }, { label: '黑色', value: 1 }],
      },
      explain3: {
        value1: 0,
        options1: [{ label: '铜版纸白色157克', value: 0 }, { label: '铜版纸黑色157克', value: 1 }, { label: '双胶纸白色157克', value: 2 }, { label: '双胶纸白色157克', value: 3 },
          { label: '铜版纸白色200克', value: 4 }, { label: '铜版纸黑色200克', value: 5 }, { label: '双胶纸白色200克', value: 6 }, { label: '双胶纸白色200克', value: 7 }],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-file-name-page-explain-drawer-comp-wrap {
  .el-drawer {
    width: 470px !important;
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
      }
    }
    > .el-drawer__body {
      color: #585858;
      font-size: 12px;
      padding: 4px 48px 0 45px;
      > ul {
        > li {
          > span.title {
            font-weight: 700;
            font-size: 14px;
          }
          > p {
            padding-top: 8px;
            line-height: 24px;
            > span {
              &.block {
                display: block;
              }
            }
          }
          &:not(:last-of-type) {
            margin-bottom: 25px;
          }
        }
      }
    }
  }
}
</style>
