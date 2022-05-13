<template>
  <div v-loading="!show" element-loading-text="数据加载中..." :style="!show ? 'height: 500px' : 'height: 100%'" class="app-container">
    <div v-if="show">
      <el-card class="box-card">
        <div class="grid-box">
          <div v-for="(item,index) in diskData" :key="index" class="grid-item">
            <svg-icon icon-class="disk" class-name="grid-item-icon" />
            <div class="grid-item-content">
              <div class="item-right-1">
                {{ item.label }}({{ item.mount }})
              </div>
              <div class="item-right-2"><el-progress :stroke-width="15" :show-text="false" :percentage="percentageUsed(item.usableSpace, item.totalSpace)" type="line" /></div>
              <div class="item-right-3">{{ dataSizeFormate(item.freeSpace) }}可用，共 {{ dataSizeFormate(item.totalSpace) }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        研发中。。。
      </el-card>
    </div>
  </div>
</template>

<script>
import { listDiskInfo } from '@/api/monitor/machine'
import { dataSizeFormate } from '@/utils/kmgpt'
export default {
  name: 'Disk',
  data() {
    return {
      show: false,
      diskData: [
        {
          label: 'Windows',
          mount: 'C:\\',
          totalSpace: 40,
          usableSpace: 10,
          freeSpace: 30
        },
        {
          label: 'Windows',
          mount: 'C:\\',
          totalSpace: 20,
          usableSpace: 10,
          freeSpace: 10
        },
        {
          label: 'Windows',
          mount: 'C:\\',
          totalSpace: 80,
          usableSpace: 10,
          freeSpace: 70
        }
      ],
      clientId: ''
    }
  },
  created() {
    this.clientId = this.$route.query.clientId
    this.queryDiskList()
    this.tempDrivers = this.diskInfoToCheckBox(this.diskData)
    this.targetDrivers = this.diskInfoToCheckBox(this.diskData)
  },
  destroyed() {
  },
  methods: {
    queryDiskList() {
      listDiskInfo(this.clientId).then(res => {
        this.diskData = res.data
        this.show = true
      }).catch(() => {
        console.log('查询磁盘列表失败')
      })
    },
    percentageUsed(usableSpace, totalSpace) {
      return (usableSpace / totalSpace).toFixed(2) * 100
    }, dataSizeFormate(value) {
      return dataSizeFormate(value)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .box-card {
    margin-bottom: 5px;
    span {
      margin-right: 28px;
    }
    .el-icon-refresh {
      margin-right: 10px;
      float: right;
      cursor:pointer;
    }
  }

  .grid-box{
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns: repeat(4, 1FR);
  }
  .grid-item{
    display: flex;
    padding: 10px;
    align-items: center;
  }
  .grid-item-icon{
    width: 3em;
    height: 3em;
  }
  .grid-item-content{
    padding: 5px;
    flex: 1;
  }
  .item-right-1{

  }
  .item-right-2{
    padding: 5px 0;
  }
  .item-right-3{
    font-size: 10px;
  }

::v-deep .el-progress-bar__outer{
  border-radius: 0;
}
::v-deep .el-progress-bar__inner{
  border-radius: 0;
}
</style>
