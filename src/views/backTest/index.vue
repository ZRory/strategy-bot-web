<template>
  <div class="app-container">
    <div>
      <!-- 搜索 -->
      <el-input
        v-model="queryShareListParam.symbol"
        clearable
        placeholder="交易对"
        style="width: 185px;"
        class="filter-item"
      />
      <!--        <el-input-->
      <!--          v-model="queryListParam.remark"-->
      <!--          clearable-->
      <!--          placeholder="机器备注"-->
      <!--          style="width: 185px;"-->
      <!--          class="filter-item"-->
      <!--        />-->
      <el-select v-model="queryShareListParam.status" clearable size="small" placeholder="策略状态" class="filter-item">
        <el-option v-for="item in searchStatus" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <span>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="queryList"
          >搜索</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="resetQuery"
          >重置</el-button>
        </span>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <br>
      <a target="_blank" href="https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA">
        <el-alert
          title="公告:推荐注册binance高返佣帐号(20%) : https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA"
          type="success">
        </el-alert>
      </a>
      <el-alert
        title="本程序为多空双向网格,请仔细阅读使用说明后再使用本程序!"
        type="error">
      </el-alert>
      <br>

      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="remarkDialogShow" title="复制策略"
                 width="280px">
        <el-alert
          title="所有人账户可用U等等都不一样，复制策略一定要谨慎操作！"
          type="error">
        </el-alert>
        <br>
        <el-form ref="form" :rules="updateRules" :model="updateForm"
                 label-width="108px">
          <el-form-item label="交易对" prop="positionSide">
            <el-input v-model="updateForm.symbol" autosize disabled/>
          </el-form-item>
          <!--          <el-tooltip class="item" effect="dark" placement="bottom-start">-->
          <!--            <div slot="content">是否自动判断并修改策略方向(会根据指标自动进行，开多/开空/多空双向切换)-->
          <!--            </div>-->
          <!--            <el-form-item label="自动判断方向" prop="autoSwitch">-->
          <!--              <el-switch v-model="updateForm.autoSwitch"/>-->
          <!--            </el-form-item>-->
          <!--          </el-tooltip>-->
          <el-form-item v-if="!updateForm.autoSwitch" label="开单方向" prop="positionSide">
            <el-select v-model="updateForm.positionSide" clearable placeholder="请选择">
              <el-option v-for="(item, index) in positionSide" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="杠杆倍率" prop="leverage">
            <el-input-number v-model="updateForm.leverage" controls-position="right" :min="1" :max="125"/>
          </el-form-item>
          <el-form-item label="首仓金额" prop="firstPosition">
            <el-input-number v-model="updateForm.firstPosition" controls-position="right" :min="0.1" :max="1000"
                             :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="加仓步进金额" prop="steppingPosition">
            <el-input-number v-model="updateForm.steppingPosition" controls-position="right" :min="0.1" :max="600"
                             :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="单向购买次数" prop="times">
            <el-input-number v-model="updateForm.times" controls-position="right" :min="0" :max="100"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="补仓率" prop="coverRate">
            <el-input-number v-model="updateForm.coverRate" controls-position="right" :min="0.2" :max="100"/>
          </el-form-item>
          <el-form-item label="补仓回撤率" prop="coverShrinksRate">
            <el-input-number v-model="updateForm.coverShrinksRate" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="止盈率" prop="stopRate">
            <el-input-number v-model="updateForm.targetRate" controls-position="right" :min="0.2" :max="1000"/>
          </el-form-item>
          <el-form-item label="止盈回撤率" prop="targetShrinksRate">
            <el-input-number v-model="updateForm.targetShrinksRate" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="止损率" prop="stopRate">
            <el-input-number v-model="updateForm.stopRate" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="停止触发等级" prop="autoRestartLevel">
            <el-input-number v-model="updateForm.autoRestartLevel" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="停止后新建" prop="autoRestart">
            <el-switch v-model="updateForm.autoRestart"/>
          </el-form-item>
          <el-form-item label="是否分享">
            <el-switch v-model="updateForm.share"/>
          </el-form-item>
          <!--          <el-form-item label="排除最终目录">-->
          <!--            <el-switch v-model="form.excludeFinalDir" active-color="#13ce66" inactive-color="#ff4949" />-->
          <!--          </el-form-item>-->
          <el-form-item label="预资金占用">
            <el-input type="textarea" v-model="maxFees" autosize disabled/>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelRemark">取消</el-button>
          <el-button :loading="remarkLoading" type="primary" @click="submitRemark">确认</el-button>
        </div>
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="queryLoading" :data="machineList" size="small" stripe style="width: 100%;"
                @sort-change="sortChange">
        <el-table-column fixed align="center" header-align="center" :show-overflow-tooltip="true" prop="id" label="id"
                         sortable="custom">
          <template slot-scope="scope">
            <el-button size="mini" style="margin-right: 2px" type="text" @click="checkEquity(scope.row.id)">
              {{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="symbol"
          label="交易对"
        />
        <!--        <el-table-column align="center" header-align="center" prop="autoSwitch" label="自动判断方向">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.autoSwitch ? '是' : '否' }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
          prop="positionSide"
          label="交易方向"
          :formatter="getPositionSide"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="leverage"
          label="杠杆倍率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="firstPosition"
          label="首仓金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="steppingPosition"
          label="加仓步进金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="times"
          label="单向购买次数"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="coverRate"
          label="补仓率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="coverShrinksRate"
          label="补仓回撤率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="targetRate"
          label="止盈率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="targetShrinksRate"
          label="止盈回撤率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="stopRate"
          label="止损率"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="autoRestartLevel"
          label="停止触发等级"
        />
        <el-table-column align="center" header-align="center" prop="autoRestart" label="停止后新建">
          <template slot-scope="scope">
            {{ scope.row.autoRestart ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="status"
          label="策略状态"
          :formatter="handlerStatus"
        />
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          header-align="center"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--          prop="remark"-->
        <!--          label="备注信息"-->
        <!--        />-->
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          header-align="center"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--          prop="share"-->
        <!--          label="是否分享"-->
        <!--        />-->
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="createTime"
          label="创建时间"
          sortable="custom"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="updateTime"
          label="更新时间"
          sortable="custom"
        />
        <el-table-column label="操作" width="260px" align="center">
          <template slot-scope="scope">
            <el-button
              slot="reference"
              class="filter-item"
              size="mini"
              type="primary" plain
              icon="el-icon-s-operation"
              @click="toRemark(scope.row)"
            >
              复制策略
            </el-button>
            <el-button
              slot="reference"
              class="filter-item"
              size="mini"
              type="primary" plain
              @click="checkEquity(scope.row.id)"
              icon="el-icon-data-analysis"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div class="pagination-class" v-if="device === 'mobile'">
        <el-pagination
          background
          layout="total,prev, next,sizes "
          :total="machineTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="pagination-class" v-else>
        <el-pagination
          background
          layout="total,prev, pager, next,sizes "
          :total="machineTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>

<script>
import {
  binding,
  unbinding,
  list,
  bindEquityCardAuto,
  bindEquityCard,
  checkEquity,
  updateRemark,
  queryProfit, balance, createStrategy, listBackTest
} from '@/api/monitor/machine'
//import Cookies from "js-cookie";
import Config from "@/settings";
import {mapGetters} from "vuex";

export default {
  name: 'MachineManage',
  data() {
    return {
      addDialogShow: false,
      bindingLoding: false,
      bindingEquityCardAutoLoading: false,
      balanceCardLoading: false,
      profitDialogShow: false,
      balanceDialogShow: false,
      form: {
        apiKey: '',
        apiSecret: '',
        password: ''
      },
      updateForm: {
        strategyId: '',
        symbol: '',
        autoShare: false,
        positionSide: 'BOTH',
        times: 0,
        firstPosition: 4,
        steppingPosition: 2,
        coverRate: 1.4,
        coverShrinksRate: 0,
        targetRate: 1.2,
        targetShrinksRate: 0,
        share: false,
        stopRate: 0,
        autoRestartLevel: 0,
        autoRestart: true
      },
      maxFees: '',
      profit: {
        strategyId: '',
        totalProfit: '',
        serviceAmount: '',
        currentProfit: '',
        slidingProfit: ''
      },
      balance: {
        //当前所需起始保证金总额(存在逐仓请忽略), 仅计算usdt资产
        totalInitialMargin: '',
        //维持保证金总额, 仅计算usdt资产
        totalMaintMargin: '',
        //账户总余额, 仅计算usdt资产
        totalWalletBalance: '',
        //持仓未实现盈亏总额, 仅计算usdt资产
        totalUnrealizedProfit: '',
        //保证金总余额, 仅计算usdt资产
        totalMarginBalance: '',
        //持仓所需起始保证金(基于最新标记价格), 仅计算usdt资产
        totalPositionInitialMargin: '',
        //当前挂单所需起始保证金(基于最新标记价格), 仅计算usdt资产
        totalOpenOrderInitialMargin: '',
        //全仓账户余额, 仅计算usdt资产
        totalCrossWalletBalance: '',
        //全仓持仓未实现盈亏总额, 仅计算usdt资产
        totalCrossUnPnl: '',
        //可用余额, 仅计算usdt资产
        availableBalance: '',
        //最大可转出余额, 仅计算usdt资产
        maxWithdrawAmount: ''
      },
      rules: {
        apiKey: [
          {required: true, message: 'apiKey不能为空', trigger: 'blur'}
        ],
        apiSecret: [
          {required: true, message: 'apiSecret不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '登录密码不能为空', trigger: 'blur'}
        ]
      },
      updateRules: {
        // symbol: [
        //   {required: true, message: '交易对不能为空', trigger: 'blur'}
        // ],
        // // tempDrivers: [
        // //   { required: true, message: '缓存驱动器不能为空', trigger: 'blur' }
        // // ],
        // // targetDrivers: [
        // //   { required: true, message: '目标驱动器不能为空', trigger: 'blur' }
        // // ],
        // positionSide: [
        //   {required: true, message: 'K值不能为空', trigger: 'blur'}
        // ],
        // leverage: [
        //   {required: true, message: '杠杆倍率不能为空', trigger: 'blur'}
        // ],
        // times: [
        //   {required: true, message: '单向购买次数不能为空', trigger: 'blur'}
        // ],
        // firstPosition: [
        //   {required: true, message: '首仓金额不能为空', trigger: 'blur'}
        // ],
        // steppingPosition: [
        //   {required: true, message: '加仓步进金额不能为空', trigger: 'blur'}
        // ],
        // // stopWay: [
        // //   { required: true, message: '停P方式不能为空', trigger: 'blur' }
        // // ],
        // coverRate: [
        //   {required: true, message: '补仓率不能为空', trigger: 'blur'}
        // ],
        // coverShrinksRate: [
        //   {required: true, message: '补仓回撤率不能为空', trigger: 'blur'}
        // ],
        // targetRate: [
        //   {required: true, message: '止盈率不能为空', trigger: 'blur'}
        // ],
        // targetShrinksRate: [
        //   {required: true, message: '止盈回撤率不能为空', trigger: 'blur'}
        // ],
        // stopRate: [
        //   {required: true, message: '止损率不能为空', trigger: 'blur'}
        // ]
      },
      searchStatus: [
        {value: '', label: '全部'},
        {value: 'RUNNING', label: '运行中'},
        {value: 'PAUSE', label: '已暂停'},
        {value: 'ERROR', label: '运行出错'},
        {value: 'STOP', label: '已停止'}
      ],
      osFamilies: [
        {value: 'RUNNING', label: '运行'},
        {value: 'PAUSE', label: '暂停'},
        // {value: 'ERROR', label: '运行出错'},
        {value: 'STOP', label: '停止'}
      ],
      positionSide: [
        {
          label: '多空双向',
          value: 'BOTH'
        },
        {
          label: '开多',
          value: 'LONG'
        },
        {
          label: '开空',
          value: 'SHORT'
        }
      ],
      remarkLoading: false,
      unbindingLoding: false,
      queryLoading: false,
      toProfitCardLoading: false,
      queryShareListParam: {
        status: '',
        symbol: null,
        remark: null,
        pageSize: 10,
        pageNum: 1,
        column: null,
        sort: null
      },
      machineList: [],
      machineTotal: 0,
      cardDialogShow: false,
      bindingCardLoding: false,
      cardForm: {
        strategyId: '',
        status: ''
      },
      cardRules: {
        status: [
          {required: true, message: '状态不能为空', trigger: 'blur'}
        ]
      },
      remarkDialogShow: false,
      remarkForm: {
        clientId: '',
        remark: ''
      },
      remarkLoding: false
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  },
  created() {
    // if (Cookies.get('queryShareListParam') !== undefined) {
    //   this.queryShareListParam = JSON.parse(Cookies.get('queryShareListParam'))
    // }
    this.queryList()
  },
  methods: {
    unbinding(clientId) {
      this.unbindingLoding = true
      unbinding(clientId).then(() => {
        this.unbindingLoding = false
        this.resetQuery()
        this.queryList()
      }).catch((error) => {
        this.delLoading = false
        this.$message({
          showClose: true,
          message: error.message,
          type: 'warning'
        })
      })
    },
    handleMaxFee() {
      var maxFee = 0;
      for (var i = 1; i <= this.updateForm.times; i++) {
        // 从第二仓开始算 二仓 = 首仓金额 + 仓位 × 步进值
        maxFee = maxFee + (this.updateForm.firstPosition + (i - 1) * this.updateForm.steppingPosition)
      }
      this.maxFees = '预计满仓资金使用量:[' + maxFee.toFixed(2) + '](止损指标不参与计算)'
    },
    bindEquityCardAuto() {
      this.$confirm('确定要一键绑定授权吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bindEquityCardAuto().then(() => {
          this.queryList()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    bindingClick() {
      this.addDialogShow = !this.addDialogShow
    },
    submitBinding() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.bindingLoding = true
          binding(this.form).then(res => {
            this.bindingLoding = false
            this.addDialogShow = false
            this.resetQuery()
            this.$message({
              type: 'success',
              message: '绑定成功'
            })
            this.queryList()
          }).catch(() => {
            this.bindingLoding = false
          })
        }
      })
    },
    resetQuery() {
      this.queryShareListParam = {
        osFamily: null,
        cpuName: null,
        remark: null,
        pageSize: 10,
        pageNum: 1
      }
    },
    queryList() {
      this.queryLoading = true
      // this.queryListParam.pageNum = 1
      //Cookies.set('queryShareListParam', this.queryShareListParam)
      //this.queryShareListParam.share = true
      listBackTest(this.queryShareListParam).then(res => {
        if (res.data.current > res.data.pages) {
          this.queryShareListParam.pageNum = 1
          listBackTest(this.queryShareListParam).then(res => {
            this.queryLoading = false
            this.machineList = res.data.records
            this.machineTotal = res.data.total
          }).catch(() => {
            this.queryLoading = false
          })
        } else {
          this.queryLoading = false
          this.machineList = res.data.records
          this.machineTotal = res.data.total
        }
      }).catch(() => {
        this.queryLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.queryShareListParam.pageSize = pageSize
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.queryShareListParam.pageNum = currentPage
      this.queryList()
    },
    dataSizeFormate(row, column, cellValue) {
      if (cellValue === 0) {
        return '0.00 B'
      } else {
        const e = Math.floor(Math.log(cellValue) / Math.log(1024))
        return (cellValue / Math.pow(1024, e)).toFixed(2) +
          ' ' + ' KMGTP'.charAt(e) + 'B'
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
    toBalanceCard() {
      this.balanceCardLoading = true
      balance().then(res => {
        this.balance = res.data
        this.balanceDialogShow = true
        this.balanceCardLoading = false
      }).catch(() => {
        this.balanceCardLoading = false
      })
    },
    toProfitCard(strategyId) {
      this.toProfitCardLoading = true
      queryProfit(strategyId).then(res => {
        this.profit = res.data
        this.profitDialogShow = true
        this.toProfitCardLoading = false
      }).catch(() => {
        this.toProfitCardLoading = false
      })
    },
    toBindingCard(strategyId) {
      this.cardDialogShow = true
      this.cardForm.strategyId = strategyId
    },
    cancelBindingCard() {
      this.cardDialogShow = false
    },
    submitBindingCard() {
      this.$refs['cardForm'].validate((valid) => {
        if (valid) {
          this.bindingCardLoding = true
          bindEquityCard(this.cardForm).then(res => {
            this.bindingCardLoding = false
            this.cardDialogShow = false
            this.queryList()
          }).catch(() => {
            this.bindingCardLoding = false
          })
        }
      })
    },
    checkEquity(backTestId) {
      // this.$router.push({ path: '/machines/detail', query: { clientId: clientId }})
      // checkEquity(clientId).then(res => {
      //   this.$router.push({path: '/machines/detail', query: {clientId: clientId}})
      // }).catch(() => {
      // })
      this.$router.push({path: '/backTest/detail', query: {backTestId: backTestId}})
    },
    toRemark(row) {
      this.remarkDialogShow = true
      this.updateForm = row
      this.handleMaxFee()
    },
    cancelRemark() {
      this.remarkDialogShow = false
    },
    submitRemark() {
      this.remarkLoading = true
      this.updateForm.strategyId = this.updateForm.id
      createStrategy(this.updateForm).then(() => {
        this.remarkLoading = false
        this.remarkDialogShow = false
        this.$message({
          type: 'success',
          message: '创建成功'
        })
      }).catch(() => {
        this.remarkLoading = false
      })
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
    sortChange(orderInfo) {
      if (orderInfo.order == null) {
        this.queryShareListParam.column = null
        this.queryShareListParam.sort = null
      } else if (orderInfo.order === 'ascending') {
        this.queryShareListParam.column = orderInfo.prop
        this.queryShareListParam.sort = 'ASC'
      } else if (orderInfo.order === 'descending') {
        this.queryShareListParam.column = orderInfo.prop
        this.queryShareListParam.sort = 'DESC'
      }
      this.queryList()
    }
  }
}
</script>

<style scoped>

</style>
