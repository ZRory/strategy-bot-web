<template>
  <div
    v-loading="!show"
    element-loading-text="数据加载中..."
    :style="!show ? 'height: 500px' : 'height: 100%'"
    class="app-container"
  >
    <!-- 任务列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="box-card-header">回测详情</span>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="plotsConfigLoading"
        :data="plotsHistoryList"
        size="small"
        border
        stripe
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          align="center"
          header-align="center"
          label="id"
          prop="id"
          sortable="custom"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="startTime"
          label="开始时间"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="endTime"
          label="结束时间"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="maxLevel"
          label="最大仓位"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="times"
          label="总仓位"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="maxAmount"
          label="最大持仓金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="totalProfit"
          label="总盈亏金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="targetProfit"
          label="已止盈金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="stopProfit"
          label="已止损金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="serviceAmount"
          label="手续费"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="currentProfit"
          label="盈亏金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="slidingProfit"
          label="浮亏金额"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="status"
          label="状态"
          :formatter="handlerStatus"
        />
        <el-table-column align="center" header-align="center" :show-overflow-tooltip="true" prop="createTime"
                         label="创建时间"/>
        <el-table-column align="center" header-align="center" :show-overflow-tooltip="true" prop="updateTime"
                         label="更新时间"/>
      </el-table>
      <!--分页组件-->
      <div class="pagination-class" v-if="device === 'mobile'">
        <el-pagination
          background
          layout="total,prev,next,sizes "
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="pagination-class" v-else>
        <el-pagination
          background
          layout="total,prev, pager, next,sizes "
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

  </div>
</template>

<script>
import {closePosition, listBackTestResult, listPlotsHistory, unbinding} from '@/api/monitor/machine'
import {dataSizeFormate} from '@/utils/kmgpt'
import {mapGetters} from "vuex";

export default {
  name: 'History',
  data() {
    return {
      clientId: '',
      show: false,
      plotsHistoryList: [],
      plotsConfigLoading: false,
      closeLoading: false,
      total: 0,
      queryParam: {
        pageSize: 10,
        pageNum: 1,
        backTestId: null,
        column: null,
        sort: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  },
  created() {
    this.backTestId = this.$route.query.backTestId
    this.queryParam.backTestId = this.$route.query.backTestId
    this.queryList()
  },
  destroyed() {
  },
  methods: {
    queryList() {
      this.plotsConfigLoading = true
      listBackTestResult(this.queryParam).then(res => {
        this.show = true
        this.plotsConfigLoading = false
        this.plotsHistoryList = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.show = true
        this.plotsConfigLoading = false
      })
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val
      this.queryList()
    },
    handleCurrentChange(val) {
      this.queryParam.pageNum = val
      this.queryList()
    },
    percentageUsed(usedSpace, totalSpace) {
      return (usedSpace / totalSpace).toFixed(2) * 100
    },
    dataSizeFormate(value) {
      return dataSizeFormate(value)
    },
    statusFormatter(row, column, cellValue) {
      switch (cellValue) {
        case 'QUEUE':
          return '队列中'
        case 'SUCCESS_RUN':
          return '已启动'
        case 'SUCCESS_STOP':
          return '已结束'
        case 'RUNNING':
          return '运行中'
        case 'NOT_RUNNING':
          return '未运行'
        case 'CHIA_APP_NOT_EXIST':
          return 'Chia核心不存在'
        case 'RUNTIME_ERROR':
          return '运行异常'
        case 'ERROR_STOP':
          return '进程异常结束'
      }
    },
    getPositionSide(row, column, cellValue) {
      if (cellValue === 'BOTH') {
        return '多空双开'
      } else if (cellValue === 'LONG') {
        return '开多'
      } else if (cellValue === 'SHORT') {
        return '开空'
      }
    },
    durationFormate(row, column, cellValue) {
      if (cellValue == null) {
        return null
      }
      var theTime = parseInt(cellValue)// 需要转换的时间秒
      var theTime1 = 0// 分
      var theTime2 = 0// 小时
      var theTime3 = 0// 天
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
          if (theTime2 > 24) {
            theTime3 = parseInt(theTime2 / 24)
            theTime2 = parseInt(theTime2 % 24)
          }
        }
      }
      var result = ''
      if (theTime > 0) {
        result = '' + parseInt(theTime) + '秒'
      }
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      if (theTime3 > 0) {
        result = '' + parseInt(theTime3) + '天' + result
      }
      return result
    },
    handlerStatus(row, column, cellValue) {
      switch (cellValue) {
        case 'RUNNING':
          return '运行中'
        case 'PAUSE':
          return '已暂停'
        case 'ERROR':
          return '运行出错'
        case 'STOP':
          return '已停止'
        default:
          return ''
      }
    },
    closeOrder(id) {
      this.closeLoading = true
      closePosition(id).then(() => {
        this.closeLoading = false
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        })
      }).catch((error) => {
        this.closeLoading = false
        this.$message({
          showClose: true,
          message: error.message,
          type: 'warning'
        })
      }).finally(() => {
        this.queryList()
      })
    },
    sortChange(orderInfo) {
      if (orderInfo.order == null) {
        this.queryParam.column = null
        this.queryParam.sort = null
      } else if (orderInfo.order === 'ascending') {
        this.queryParam.column = orderInfo.prop
        this.queryParam.sort = 'ASC'
      } else if (orderInfo.order === 'descending') {
        this.queryParam.column = orderInfo.prop
        this.queryParam.sort = 'DESC'
      }
      this.queryList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;

  .el-icon-refresh {
    margin-right: 10px;
    float: right;
    cursor: pointer;
  }
}

.grid-box {
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(4, 1FR);
}

.grid-item {
  display: flex;
  padding: 10px;
  align-items: center;
}

.grid-item-icon {
  width: 3em;
  height: 3em;
}

.grid-item-content {
  padding: 5px;
  flex: 1;
}

.item-right-1 {

}

.item-right-2 {
  padding: 5px 0;
}

.item-right-3 {
  font-size: 10px;
}

::v-deep .el-progress-bar__outer {
  border-radius: 0;
}

::v-deep .el-progress-bar__inner {
  border-radius: 0;
}

.toolpic-word {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
