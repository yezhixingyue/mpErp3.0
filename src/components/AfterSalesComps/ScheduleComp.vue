<template>
  <section class="schedule-wrap">
    <header class="is-bold">
      服务进度：
    </header>
    <ul>
      <li>
        <img src="@/assets/images/动线剪头.png" alt="">
        <p>2024-4-27 20:42</p>
        <p title="李小二转给王大志">李小二转给王大志李小二转给王大志</p>
        <p>
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <span slot="reference">查看原因</span>
          </el-popover>
        </p>
      </li>
      <li>
        <img src="@/assets/images/动线剪头.png" alt="">
        <p>2024-4-27 20:42</p>
        <p title="李小二转给王大志">李小二转给王大志李小二转给王大志</p>
        <p>
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <span slot="reference">查看原因</span>
          </el-popover>
        </p>
      </li>
      <li>
        <img src="@/assets/images/动线剪头.png" alt="">
        <p>2024-4-27 20:42</p>
        <p title="李小二转给王大志">李小二转给王大志李小二转给王大志</p>
        <p>
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <span slot="reference">查看原因</span>
          </el-popover>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      nowDate: null,
    };
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.schedule-wrap{
  padding-left: 20px;
  font-size: 12px;
  >header{
    margin: 10px 0 10px 0;
  }
  >ul{
    padding: 16px 5px 15px 5px;
    background-color: #F4FBFF;
    border-radius: 4px;
    display: flex;
    overflow-x: auto;
    >li+li{
      margin-left: 10px;
    }
    >li{
      width: 124px;
      text-align: center;
      line-height: 16px;
      padding: 0 10px;
      box-sizing: border-box;
      position: relative;
      &:last-of-type{
        >img{
          filter: grayscale(0%);
        }
      }
      >img{
        position: absolute;
        left: -10px;
        top: 16px;
        filter: grayscale(100%);
      }
      >p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        >span{
          color: #26BCF9;
        }
      }
    }
  }
}
</style>
