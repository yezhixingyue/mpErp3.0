<template>
  <section class="schedule-wrap">
    <header class="is-bold">
      服务进度：
    </header>
    <ul>
      <li>
        <p>2024-4-27 20:45</p>
        <p title="李小二转给王大志">李小二转给王大志李小二转给王大志</p>
        <p><span>查看原因</span></p>
      </li>
      <li></li>
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
    >li{
      width: 124px;
      text-align: center;
      line-height: 16px;
      padding: 0 10px;
      box-sizing: border-box;
      >p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
