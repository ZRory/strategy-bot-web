<template>
  <div
    v-loading="!show"
    element-loading-text="数据加载中..."
    :style="!show ? 'height: 500px' : 'height: 100%'"
    class="app-container"
  >
    <div v-if="show">
      <!-- OS信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">OS信息</span>
        </div>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">主机名</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ osInfo.hostName }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">操作系统</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ osInfo.family }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">启动时间</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ formatSeconds(osInfo.systemUpTime) }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">位数</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ osInfo.bitness }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">主板型号</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ motherboardInfo.manufacturer }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">版本</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ osInfo.name }}</el-col>
        </el-row>
      </el-card>
      <!-- CPU信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">CPU信息</span>
        </div>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">名称</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ cpuInfo2.name }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">数量</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ cpuInfo2.physicalPackage }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">频率</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ frequencyFormate(cpuInfo2.maxFreq) }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">核心数</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ cpuInfo2.coreNum }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">使用率</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ cpuInfo2.used + '%' }}</el-col>
          <el-col :span="3" class="os-el-col os-el-col-head">逻辑处理器</el-col>
          <el-col :span="7" class="os-el-col os-el-col-content">{{ cpuInfo2.logicNum }}</el-col>
        </el-row>
      </el-card>
      <!-- 内存信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">内存信息</span>
        </div>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">总内存大小</el-col>
          <el-col :span="21" class="os-el-col os-el-col-content">{{ dataSizeFormate(memoryInfo2.total) }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">可用内存</el-col>
          <el-col :span="21" class="os-el-col os-el-col-content">{{ dataSizeFormate(memoryInfo2.available) }}</el-col>
        </el-row>
        <el-row class="os-el-row">
          <el-col :span="3" class="os-el-col os-el-col-head">内存占用率</el-col>
          <el-col :span="21" class="os-el-col os-el-col-content">{{ memoryInfo2.usageRate }}%</el-col>
        </el-row>
      </el-card>
      <!-- 磁盘信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">磁盘信息</span>
        </div>
        <el-table ref="table" :data="fileStores" border size="small" stripe style="width: 100%;">
          <el-table-column
            align="center"
            header-align="center"
            :show-overflow-tooltip="true"
            prop="mount"
            label="磁盘路径"
          />
          <el-table-column align="center" header-align="center" :show-overflow-tooltip="true" prop="label" label="磁盘名" />
          <el-table-column align="center" header-align="center" :show-overflow-tooltip="true" prop="type" label="文件系统" />
          <el-table-column
            align="center"
            header-align="center"
            :show-overflow-tooltip="true"
            prop="totalSpace"
            :formatter="tableDataSizeFormator"
            label="总大小"
          />
          <el-table-column
            align="center"
            header-align="center"
            :show-overflow-tooltip="true"
            prop="usableSpace"
            :formatter="tableDataSizeFormator"
            label="可用大小"
          />
          <el-table-column
            align="center"
            header-align="center"
            :show-overflow-tooltip="true"
            prop="usedSpace"
            :formatter="tableDataSizeFormator"
            label="已用大小"
          />
          <el-table-column
            align="center"
            header-align="center"
            :show-overflow-tooltip="true"
            prop="usedSpace,totalSpace"
            label="使用占比"
          >
            <template slot-scope="scope">
              {{ (scope.row.usedSpace / scope.row.totalSpace * 100).toFixed(2) }}%
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 状态 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">状态</span>
        </div>
        <div>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <div class="title">CPU使用率</div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  {{ cpuInfo2.name }}
                </div>
                <div style="padding: 3px">
                  物理CPU数：{{ cpuInfo2.physicalPackage }}
                </div>
                <div style="padding: 3px">
                  核心数：{{ cpuInfo2.coreNum }}
                </div>
                <div style="padding: 3px">
                  逻辑处理器：{{ cpuInfo2.logicNum }}
                </div>
              </div>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(cpuInfo2.used)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ cpuInfo2.coreNum }} 核心</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <div class="title">内存使用率</div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总量：{{ dataSizeFormate(memoryInfo2.total) }}
                </div>
                <div style="padding: 3px">
                  已使用：{{ dataSizeFormate((memoryInfo2.total - memoryInfo2.available)) }}
                </div>
                <div style="padding: 3px">
                  空闲：{{ dataSizeFormate(memoryInfo2.available) }}
                </div>
              </div>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(memoryInfo2.usageRate)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ dataSizeFormate((memoryInfo2.total - memoryInfo2.available)) }} /
              {{ dataSizeFormate(memoryInfo2.total) }}
            </div>
          </el-col>
        </div>
      </el-card>

      <el-card class="box-card">
        <el-row :gutter="6">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">CPU使用率监控</span>
              </div>
              <div>
                <v-chart :options="cpuInfo" />
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">内存使用率监控</span>
              </div>
              <div>
                <v-chart :options="memoryInfo" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { monitor } from '@/api/monitor/machine'
import { dataSizeFormate, tableDataSizeFormator, formatSeconds, frequencyFormate } from '@/utils/kmgpt'

export default {
  name: 'Monitor',
  components: {
  },
  // props: {
  //   activeName: {
  //     type: String,
  //     default: 'first'
  //   }
  // },
  data() {
    return {
      clientId: '',
      show: false,
      timer: null,
      data: {},
      osInfo: {},
      motherboardInfo: {},
      cpuInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      },
      memoryInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      },
      fileStores: [],
      memoryInfo2: {},
      cpuInfo2: {}
    }
  },
  created() {
    console.log('created')
    this.clientId = this.$route.query.clientId
    this.init(this.clientId)
    //this.setTimer()
  },
  destroyed() {
    console.log('destroyed')
    window.clearInterval(this.timer)
  },
  methods: {
    init(clientId) {
      monitor(clientId).then(res => {
        console.log(res)
        const data = res.data
        this.show = true
        this.osInfo = data.osInfo
        this.motherboardInfo = data.motherboardInfo
        this.cpuInfo2 = data.cpuInfo
        this.memoryInfo2 = data.memoryInfo
        this.fileStores = data.fileStores

        this.cpuInfo.xAxis.data.push(data.time)
        this.cpuInfo.series[0].data.push(parseFloat(data.cpuInfo.used))
        this.memoryInfo.xAxis.data.push(data.time)
        this.memoryInfo.series[0].data.push(parseFloat(data.memoryInfo.usageRate))
      })
    },
    // setTimer() {
    //   this.timer = window.setInterval(() => {
    //     setTimeout(() => {
    //       this.init(this.clientId)
    //     }, 5)
    //   }, 5000)
    // },
    dataSizeFormate(value) {
      return dataSizeFormate(value)
    },
    tableDataSizeFormator(row, column, cellValue) {
      return tableDataSizeFormator(row, column, cellValue)
    },
    formatSeconds(value) {
      return formatSeconds(value)
    },
    frequencyFormate(value) {
      return frequencyFormate(value)
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
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
    cursor: pointer;
  }
}

.cpu, .memory, .swap, .disk {
  width: 20%;
  float: left;
  padding-bottom: 20px;
  margin-right: 5%;
}

.title {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-bottom: 16px;
}

.footer {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-top: -5px;
  margin-bottom: 10px;
}

.content {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

/** el-row */
.os-el-row {
  height: 40px;
}

.os-el-col {
  height: 40px;
  padding: 5px;
}

.os-el-col-head {
  background: #f5f7fa;
  line-height: 30px;
}

.os-el-col-content {
  //background: #e5e9f2;
  display: flex;
  align-items: center;
  word-break: break-all;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
