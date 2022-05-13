<template>
  <el-tabs v-model="activeName" type="border-card" style="padding-left: 5px" @tab-click="handleClick">
    <!--    <el-tab-pane label="矿机监控" name="first">-->
    <!--      <Monitor v-if="activeName === 'first'" />-->
    <!--    </el-tab-pane>-->
    <el-tab-pane label="创建策略" name="second">
      <Draw v-if="activeName === 'second'" />
    </el-tab-pane>
    <!--    <el-tab-pane label="磁盘管理(开发中)" name="three">-->
    <!--      <Disk />-->
    <!--    </el-tab-pane>-->
    <!--    <el-tab-pane label="历史绘图" name="three">-->
    <!--      <History v-if="activeName === 'three'" />-->
    <!--    </el-tab-pane>-->
  </el-tabs>
</template>

<script>
import Monitor from './monitor'
import Draw from './draw'
// import Disk from './disk'
import History from './detail'

export default {
  name: 'ManitorDetail',
  components: { Monitor, Draw, History },
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, envent) {
      this.activeName = tab.name
    }
  }
}
</script>

<style scoped>

::v-deep .el-tabs__header {
  margin: 20px 35px;
  background-color: #ffffff;
  border: 1px solid #dfe4ed;
  border-radius: 35px;
  text-align: center;
}

::v-deep .el-tabs__nav-wrap {
  margin-bottom: 0;
  border-radius: 35px;
}

::v-deep .el-tabs__nav {
  width: 100%;
  display: flex;
  flex-direction: row;
}

::v-deep .el-tabs__item {
  flex: 1;
  padding: 0;
  border: none;
}

::v-deep .el-tabs__item + .el-tabs__item {
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-tabs__item.is-active {
  color: #ffffff !important;
  background-color: #797979 !important;
  border-right-color: #dcdfe6;
  border-left-color: #dcdfe6;
}

::v-deep .el-tabs__item:not(.is-disabled):hover {
  color: #ffffff;
}

</style>
