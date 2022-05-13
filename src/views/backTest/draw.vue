<template>
  <div
    v-loading="!show"
    element-loading-text="数据加载中..."
    :style="!show ? 'height: 500px' : 'height: 100%'"
    class="app-container"
  >
    <div v-if="show">
      <a target="_blank" href="https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA">
        <el-alert
          title="公告:推荐注册binance高返佣帐号(20%) : https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA"
          type="success">
        </el-alert>
      </a>
      <el-alert
        title="WARNING:你已开启高风险模式,请谨慎配置! 同一交易对共享杠杆倍率!"
        type="error"
        v-if="this.$route.query.riskmode === 'true'">
      </el-alert>
      <el-alert
        title="本程序为多空双向网格,请仔细阅读使用说明后再使用本程序!"
        type="error">
      </el-alert>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="box-card-header">新增配置</span>
        </div>
        <el-form ref="form" :rules="rules" :model="form" v-if="this.$route.query.riskmode === 'true'"
                 label-width="120px">
          <!--          <el-form-item label="缓存盘 SSD" prop="tempDrivers">-->
          <!--            <el-checkbox-group v-model="form.tempDrivers" @change="handleTempDriverChange">-->
          <!--              <el-checkbox-->
          <!--                v-for="(item, index) in tempDrivers"-->
          <!--                :key="index"-->
          <!--                :disabled="item.disable"-->
          <!--                :label="item.value"-->
          <!--              >{{-->
          <!--                item.name-->
          <!--              }}-->
          <!--              </el-checkbox>-->
          <!--            </el-checkbox-group>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="目标盘 HDD" prop="targetDrivers">-->
          <!--            <el-checkbox-group v-model="form.targetDrivers" @change="handleTargetDriverChange">-->
          <!--              <el-checkbox-->
          <!--                v-for="(item, index) in targetDrivers"-->
          <!--                :key="index"-->
          <!--                :disabled="item.disable"-->
          <!--                :label="item.value"-->
          <!--                size="small"-->
          <!--              >-->
          <!--                {{ item.name }}-->
          <!--              </el-checkbox>-->
          <!--            </el-checkbox-group>-->
          <!--          </el-form-item>-->
          <!--          <el-tooltip class="item" effect="dark" placement="bottom-start">-->
          <!--            <div slot="content">填写U本位合约交易对</div>-->
          <!--            <el-form-item label="交易对" prop="symbol">-->
          <!--              <el-input v-model="form.symbol" placeholder="BTCUSDT" style="max-width: 224px"/>-->
          <!--            </el-form-item>-->
          <!--          </el-tooltip>-->
          <el-form-item label="交易对" prop="symbol">
            <el-select filterable v-model="form.symbol" clearable placeholder="请选择">
              <el-option v-for="(item, index) in symbols" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="回测时间" prop="time">
            <el-date-picker
              v-model="form.time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              @change="handleBackTestTime()">
            </el-date-picker>
          </el-form-item>
          <!--          <el-tooltip class="item" effect="dark" placement="bottom-start">-->
          <!--            <div slot="content">是否自动判断并修改策略方向(会根据指标自动进行，开多/开空/多空双向切换)-->
          <!--            </div>-->
          <!--            <el-form-item label="自动判断方向" prop="autoSwitch">-->
          <!--              <el-switch v-model="form.autoSwitch"/>-->
          <!--            </el-form-item>-->
          <!--          </el-tooltip>-->
          <el-form-item v-if="!form.autoSwitch" label="开单方向" prop="positionSide">
            <el-select v-model="form.positionSide" clearable placeholder="请选择">
              <el-option v-for="(item, index) in positionSide" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="杠杆倍率" prop="leverage">
            <el-input-number v-model="form.leverage" controls-position="right" :min="1" :max="125"/>
          </el-form-item>
          <el-form-item label="首仓金额" prop="firstPosition">
            <el-input-number v-model="form.firstPosition" controls-position="right" :min="0.1" :max="1000" :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="加仓步进金额" prop="steppingPosition">
            <el-input-number v-model="form.steppingPosition" controls-position="right" :min="-1000" :max="1000"
                             :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="单向购买次数" prop="times">
            <el-input-number v-model="form.times" controls-position="right" :min="0" :max="100"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="补仓率" prop="coverRate">
            <el-input-number v-model="form.coverRate" controls-position="right" :min="0.2" :max="100" :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="补仓回撤率" prop="coverShrinksRate">
            <el-input-number v-model="form.coverShrinksRate" controls-position="right" :min="0" :max="100"
                             :step="0.1"/>
          </el-form-item>
          <el-form-item label="止盈率" prop="stopRate">
            <el-input-number v-model="form.targetRate" controls-position="right" :min="0.2" :max="1000" :step="0.1"/>
          </el-form-item>
          <el-form-item label="止盈回撤率" prop="targetShrinksRate">
            <el-input-number v-model="form.targetShrinksRate" controls-position="right" :min="0" :max="100"
                             :step="0.1"/>
          </el-form-item>
          <el-form-item label="止损率" prop="stopRate">
            <el-input-number v-model="form.stopRate" controls-position="right" :min="0" :max="100" :step="0.1"/>
          </el-form-item>
          <el-form-item label="停止触发等级" prop="autoRestartLevel">
            <el-input-number v-model="form.autoRestartLevel" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="停止后新建" prop="autoRestart">
            <el-switch v-model="form.autoRestart"/>
          </el-form-item>
          <el-form-item label=" ">
            <el-button :loading="autoConfigLoading" type="primary" @click="submitAutoConfig">创建策略</el-button>
          </el-form-item>
        </el-form>

        <!-- --------------------------------- -->

        <el-form ref="form" :rules="rules" :model="form" v-else label-width="120px">
          <el-form-item label="交易对" prop="symbol">
            <el-select filterable v-model="form.symbol" clearable placeholder="请选择">
              <el-option v-for="(item, index) in symbols" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="回测时间" prop="time">
            <el-date-picker
              v-model="form.time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              @change="handleBackTestTime()">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="!form.autoSwitch" label="开单方向" prop="positionSide">
            <el-select v-model="form.positionSide" clearable placeholder="请选择">
              <el-option v-for="(item, index) in positionSide" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="杠杆倍率" prop="leverage">
            <el-input-number v-model="form.leverage" controls-position="right" :min="1" :max="8"/>
          </el-form-item>
          <el-form-item label="首仓金额" prop="firstPosition">
            <el-input-number v-model="form.firstPosition" controls-position="right" :min="1" :max="1000"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="加仓步进金额" prop="steppingPosition">
            <el-input-number v-model="form.steppingPosition" controls-position="right" :min="1" :max="1000"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="单向购买次数" prop="times">
            <el-input-number v-model="form.times" controls-position="right" :min="0" :max="100"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="补仓率" prop="coverRate">
            <el-input-number v-model="form.coverRate" controls-position="right" :min="0.4" :max="100" :step="0.1"
                             @change="handleMaxFee"/>
          </el-form-item>
          <el-form-item label="补仓回撤率" prop="coverShrinksRate">
            <el-input-number v-model="form.coverShrinksRate" controls-position="right" :min="0" :max="100"
                             :step="0.1"/>
          </el-form-item>
          <el-form-item label="止盈率" prop="stopRate">
            <el-input-number v-model="form.targetRate" controls-position="right" :min="0.4" :max="1000" :step="0.1"/>
          </el-form-item>
          <el-form-item label="止盈回撤率" prop="targetShrinksRate">
            <el-input-number v-model="form.targetShrinksRate" controls-position="right" :min="0" :max="100"
                             :step="0.1"/>
          </el-form-item>
          <el-form-item label="止损率" prop="stopRate">
            <el-input-number v-model="form.stopRate" controls-position="right" :min="0" :max="100" :step="0.1"/>
          </el-form-item>
          <el-form-item label="停止触发等级" prop="autoRestartLevel">
            <el-input-number v-model="form.autoRestartLevel" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="停止后新建" prop="autoRestart">
            <el-switch v-model="form.autoRestart"/>
          </el-form-item>
          <el-form-item label=" ">
            <el-button :loading="autoConfigLoading" type="primary" @click="submitAutoConfig">创建策略</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!--运行日志-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="logDialogShow"
        title="运行日志"
        width="60%"
      >
        <div v-if="logLoading" class="log-content">数据加载中...</div>
        <div v-else class="log-content" v-html="logText"/>
      </el-dialog>

      <!--开启任务-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="startDialogShow"
        title="开启任务"
        width="500px"
      >
        <el-form ref="startForm" :model="startForm" :rules="addFormRules" size="small" label-width="120px">
          <el-form-item label="延迟时间(分钟)" prop="delayMinutes">
            <el-input-number v-model="startForm.delayMinutes" controls-position="right" :min="0"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelStartAll">取消</el-button>
          <el-button :loading="startLoading" type="primary" @click="startAll">确认</el-button>
        </div>
      </el-dialog>

      <!-- 选择模板 -->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="templateDialogShow"
        title="选择模板"
        width="500px"
      >
        <el-form ref="templateForm" :model="templateForm" :rules="templateFormRules" size="small" label-width="120px">
          <el-form-item label="模板" prop="templateId">
            <el-select v-model="templateForm.templateId" clearable placeholder="请选择模板">
              <el-option v-for="(item, index) in templateList" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelUserTemplate">取消</el-button>
          <el-button :loading="generateConfigLoading" type="primary" @click="generateConfigByTemplate">确认</el-button>
        </div>
      </el-dialog>

      <!--任务新增-->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="addDialogShow" title="新增任务" width="600px">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" size="small" label-width="120px">
          <el-form-item label="矿工公钥" prop="farmerPublicKey">
            <el-input v-model="addForm.farmerPublicKey"/>
          </el-form-item>
          <el-form-item label="矿池公钥" prop="poolPublicKey">
            <el-input v-model="addForm.poolPublicKey"/>
          </el-form-item>
          <el-form-item label="缓存路径" prop="temporary">
            <el-col :span="12">
              <el-form-item prop="cacheDriver">
                <el-select v-model="addForm.cacheDriver" placeholder="请选择">
                  <el-option
                    v-for="item in tempDrivers"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="folder">
                <el-input v-model="addForm.folder" clearable/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="目标盘 HDD" prop="target">
            <el-checkbox-group v-model="addForm.target">
              <el-checkbox
                v-for="(item, index) in targetDrivers"
                :key="index"
                :disabled="item.disable"
                :label="item.value"
                size="small"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="K" prop="k">
            <el-select v-model="addForm.po" clearable placeholder="请选择">
              <el-option v-for="(item, index) in positionSide" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="线程数" prop="thread">
            <el-input-number v-model="addForm.thread" controls-position="right" :min="1" :max="8"/>
          </el-form-item>
          <el-form-item label="内存大小" prop="memory">
            <el-input-number v-model="addForm.memory" controls-position="right" :min="2048" :max="8192"/>
          </el-form-item>
          <el-form-item label="桶大小" prop="bucket">
            <el-input v-model="addForm.bucket"/>
          </el-form-item>
          <el-form-item label="排除最终目录" prop="excludeFinalDir">
            <el-switch v-model="addForm.excludeFinalDir"/>
          </el-form-item>
          <el-form-item label="循环p图" prop="cycle">
            <el-switch v-model="addForm.cycle"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="toAdd">取消</el-button>
          <el-button :loading="addLoading" type="primary" @click="submitAdd">确认</el-button>
        </div>
      </el-dialog>

      <!--任务修改-->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="updateDialogShow" title="编辑任务"
                 width="500px">
        <el-form ref="updateForm" :model="updateForm" :rules="addFormRules" size="small" label-width="120px">
          <el-form-item label="矿工公钥" prop="farmerPublicKey">
            <el-input v-model="updateForm.farmerPublicKey"/>
          </el-form-item>
          <el-form-item label="矿池公钥" prop="poolPublicKey">
            <el-input v-model="updateForm.poolPublicKey"/>
          </el-form-item>
          <el-form-item label="缓存路径">
            <el-col :span="12">
              <el-form-item prop="cacheDriver">
                <el-select v-model="updateForm.cacheDriver" placeholder="请选择">
                  <el-option
                    v-for="item in tempDrivers"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="folder">
                <el-input v-model="updateForm.folder" clearable/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="目标盘 HDD" prop="target">
            <el-checkbox-group v-model="updateForm.target">
              <el-checkbox
                v-for="(item, index) in targetDrivers"
                :key="index"
                :disabled="item.disable"
                :label="item.value"
                size="small"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="K" prop="k">
            <el-select v-model="updateForm.k" clearable placeholder="请选择">
              <!--              <el-option v-for="(item, index) in KCodes" :key="index" :label="item" :value="item"/>-->
            </el-select>
          </el-form-item>
          <el-form-item label="线程数" prop="thread">
            <el-input-number v-model="updateForm.thread" controls-position="right" :min="1" :max="8"/>
          </el-form-item>
          <el-form-item label="内存大小" prop="memory">
            <el-input-number v-model="updateForm.memory" controls-position="right" :min="2048" :max="8192"/>
          </el-form-item>
          <el-form-item label="桶大小" prop="bucket">
            <el-input v-model="updateForm.bucket"/>
          </el-form-item>
          <el-form-item label="排除最终目录" prop="excludeFinalDir">
            <el-switch v-model="updateForm.excludeFinalDir"/>
          </el-form-item>
          <el-form-item label="循环p图" prop="cycle">
            <el-switch v-model="updateForm.cycle"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelUpdate">取消</el-button>
          <el-button :loading="updateLoading" type="primary" @click="submitUpdate">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listDiskInfo,
  listPlotsConfig,
  generateConfigByTemplate,
  listBackTestSymbols, createBackTest
} from '@/api/monitor/machine'
import {dataSizeFormate} from '@/utils/kmgpt'
import {parseTime} from '@/utils/index'
import {add, del, modify, delAll, startBatch, stopBatch, queryLog} from '@/api/monitor/task'
import {listTemplate, uploadTemplate} from '@/api/monitor/template'

export default {
  name: 'Draw',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最长周期',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
            const start = new Date(1640966400000)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate: (time) => {
          return time.getTime() < 1640966400000 - 24 * 3600000 || time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
        }
      },
      clientId: '',
      show: false,
      addDialogShow: false,
      diskData: [],
      tempDrivers: [
        {
          name: '驱动器1',
          value: 1,
          disable: false
        }
      ],
      targetDrivers: [
        {
          name: '驱动器1',
          value: 1,
          disable: false
        }
      ],
      symbols: ["BTCUSDT"],
      stopWays: [
        {
          label: '盘满停p',
          value: 'FULL_STOP'
        },
        {
          label: '盘可写满时停P',
          value: 'WILL_FULL_STOP'
        }
      ],
      form: {
        symbol: '',
        time: null,
        startTime: null,
        endTime: null,
        autoSwitch: false,
        positionSide: 'BOTH',
        leverage: 5,
        times: 0,
        firstPosition: 10,
        steppingPosition: 5,
        coverRate: 0.6,
        coverShrinksRate: 0,
        targetRate: 0.8,
        targetShrinksRate: 0,
        stopRate: 0,
        autoRestart: true,
        autoRestartLevel: 0,
        share: true
      },
      maxFees: '',
      rules: {
        symbol: [
          {required: true, message: '交易对不能为空', trigger: 'blur'}
        ],
        // tempDrivers: [
        //   { required: true, message: '缓存驱动器不能为空', trigger: 'blur' }
        // ],
        // targetDrivers: [
        //   { required: true, message: '目标驱动器不能为空', trigger: 'blur' }
        // ],
        // autoSwitch: [
        //   {required: true, message: '自动判断方向不能为空', trigger: 'blur'}
        // ],
        time: [
          {required: true, message: '回测时间段不能为空', trigger: 'blur'}
        ],
        positionSide: [
          {required: true, message: '交易方向不能为空', trigger: 'blur'}
        ],
        leverage: [
          {required: true, message: '杠杆倍率不能为空', trigger: 'blur'}
        ],
        times: [
          {required: true, message: '单向购买次数不能为空', trigger: 'blur'}
        ],
        firstPosition: [
          {required: true, message: '首仓金额不能为空', trigger: 'blur'}
        ],
        steppingPosition: [
          {required: true, message: '加仓步进金额不能为空', trigger: 'blur'}
        ],
        // stopWay: [
        //   { required: true, message: '停P方式不能为空', trigger: 'blur' }
        // ],
        coverRate: [
          {required: true, message: '补仓率不能为空', trigger: 'blur'}
        ],
        coverShrinksRate: [
          {required: true, message: '补仓回撤率不能为空', trigger: 'blur'}
        ],
        targetRate: [
          {required: true, message: '止盈率不能为空', trigger: 'blur'}
        ],
        targetShrinksRate: [
          {required: true, message: '止盈回撤率不能为空', trigger: 'blur'}
        ],
        stopRate: [
          {required: true, message: '止损率不能为空', trigger: 'blur'}
        ]
      },
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
      plotsConfigLoading: false,
      plotsConfigList: [],
      delLoading: false,
      queryDiskLoading: false,
      autoConfigLoading: false,
      addForm: {
        symbol: '',
        positionSide: 'BOTH',
        leverage: 5,
        times: 48,
        firstPosition: 4,
        steppingPosition: 2,
        coverRate: 1.5,
        coverShrinksRate: 0,
        targetRate: 1.4,
        targetShrinksRate: 0,
        stopRate: 32
      },
      addFormRules: {
        clientId: [
          {required: true, message: '机器id不能为空', trigger: 'blur'}
        ],
        farmerPublicKey: [
          {required: true, message: '矿工公钥不能为空', trigger: 'blur'},
          {min: 96, max: 98, message: '矿工公钥格式不正确', trigger: 'blur'}
        ],
        poolPublicKey: [
          {required: true, message: '矿池公钥不能为空', trigger: 'blur'},
          {min: 96, max: 98, message: '矿池公钥格式不正确', trigger: 'blur'}
        ],
        cacheDriver: [
          {required: true, message: '缓存磁盘不能为空', trigger: 'blur'}
        ],
        folder: [
          {required: true, message: '缓存文件夹不能为空', trigger: 'blur'}
        ],
        temporary: [
          {required: true, message: '缓存路径不能为空', trigger: 'blur'}
        ],
        target: [
          {required: true, message: '目标路径不能为空', trigger: 'blur'}
        ],
        k: [
          {required: true, message: 'K值不能为空', trigger: 'blur'}
        ],
        thread: [
          {required: true, message: '线程数不能为空', trigger: 'blur'}
        ],
        memory: [
          {required: true, message: '内存不能为空', trigger: 'blur'}
        ],
        bucket: [
          {required: true, message: '桶大小不能为空', trigger: 'blur'}
        ],
        excludeFinalDir: [
          {required: true, message: '排除最终目录不能为空', trigger: 'blur'}
        ],
        cycle: [
          {required: true, message: '循环P图不能为空', trigger: 'blur'}
        ]
      },
      addLoading: false,
      startForm: {
        delayMinutes: 0
      },
      startDialogShow: false,
      startLoading: false,

      templateList: [],
      templateDialogShow: false,
      templateForm: {
        templateId: null,
        clientId: ''
      },
      templateFormRules: {
        templateId: [
          {required: true, message: '请选择模板', trigger: 'blur'}
        ],
        clientId: [
          {required: true, message: '机器id不能为空', trigger: 'blur'}
        ]
      },
      generateConfigLoading: false,
      logText: '',
      logDialogShow: false,
      logLoading: false,
      timer: null,
      updateForm: {
        clientId: '',
        farmerPublicKey: '',
        poolPublicKey: '',
        cacheDriver: '',
        folder: '',
        temporary: '',
        target: [],
        k: 'K32',
        thread: 2,
        memory: 4096,
        bucket: 128,
        excludeFinalDir: true,
        cycle: true
      },
      updateDialogShow: false,
      updateLoading: false
    }
  },
  created() {
    this.show = true
    this.handleMaxFee()
    this.listSymbols()
  },
  destroyed() {
    window.clearInterval(this.timer)
  },
  methods: {
    // setTimer() {
    //   this.timer = window.setInterval(() => {
    //     setTimeout(() => {
    //       // this.listPlotsConfig()
    //     }, 5)
    //   }, 10000)
    // },
    listSymbols() {
      // this.queryDiskLoading = true
      listBackTestSymbols().then(res => {
        // this.queryDiskLoading = false
        this.symbols = res.data
      }).catch(() => {
        // this.queryDiskLoading = false
        this.$message({
          type: 'error',
          message: '交易对获取失败'
        })
      })
    },
    queryFormDiskList() {
      listDiskInfo(this.clientId).then(res => {
        this.show = true
        this.diskData = res.data
        this.tempDrivers = this.diskInfoToCheckBox(res.data)
        this.targetDrivers = this.diskInfoToCheckBox(res.data)
      }).catch(() => {
        // this.queryDiskLoading = false
        this.show = true
      })
    },
    refresh() {
      this.listPlotsConfig()
    },
    listPlotsConfig() {
      // this.plotsConfigLoading = true
      listPlotsConfig(this.clientId).then(res => {
        // this.plotsConfigLoading = false
        this.plotsConfigList = res.data
      }).catch(() => {
        // this.plotsConfigLoading = false
      })
    },
    toAdd() {
      this.addDialogShow = !this.addDialogShow
    },
    submitAdd() {
      this.addForm.temporary = this.addForm.cacheDriver + this.addForm.folder
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addForm.clientId = this.clientId
          this.addLoading = true
          add(this.addForm).then(res => {
            this.addDialogShow = false
            this.addLoading = false
            // this.resetAddForm()
            this.listPlotsConfig()
          }).catch(() => {
            this.addLoading = false
          })
        }
      })
    },
    resetAddForm() {
      this.$refs.addForm.clearValidate()
      this.$refs.addForm.resetFields()
    },
    del(id) {
      console.log('删除成功')
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.listPlotsConfig()
      }).catch(() => {
        this.delLoading = false
      })
    },
    delAll() {
      this.$confirm('此操作将永久删除全部任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAll(this.clientId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.listPlotsConfig()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    toStartAll() {
      this.startDialogShow = true
    },
    cancelStartAll() {
      this.startForm = {
        delayMinutes: 0
      }
      this.startDialogShow = false
    },
    start(id) {
      this.$confirm('确定要开启任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = Array.of(id)
        startBatch(ids, this.clientId, 0).then(res => {
          this.listPlotsConfig()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    startAll() {
      if (this.plotsConfigList.size === 0) {
        this.$message({
          type: 'warning',
          message: '暂无任务!'
        })
        return
      }
      this.startLoading = true
      const ids = this.plotsConfigList.map(item => item.id)
      startBatch(ids, this.clientId, this.startForm.delayMinutes).then(res => {
        this.startLoading = false
        this.cancelStartAll()
        this.listPlotsConfig()
      }).catch(() => {
        this.startLoading = false
      })
    },
    stop(id) {
      this.$confirm('确定要停止该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = Array.of(id)
        stopBatch(ids, this.clientId, 0).then(res => {
          this.$message({
            type: 'success',
            message: '停止成功'
          })
          this.listPlotsConfig()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    stopAll() {
      if (this.plotsConfigList.size === 0) {
        this.$message({
          type: 'warning',
          message: '暂无任务!'
        })
        return
      }
      this.$confirm('确定要停止全部的任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.plotsConfigList.map(item => item.id)
        stopBatch(ids, this.clientId, 0).then(res => {
          this.$message({
            type: 'success',
            message: '停止成功'
          })
          this.listPlotsConfig()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    percentageUsed(usedSpace, totalSpace) {
      return (usedSpace / totalSpace).toFixed(2) * 100
    },
    handleTempDriverChange(val) {
      this.targetDrivers.forEach(item => {
        if (val.indexOf(item.value) >= 0) {
          this.$nextTick(() => {
            item.disable = true
          })
        } else {
          this.$nextTick(() => {
            item.disable = false
          })
        }
      })
    },
    handleMaxFee() {
      var maxFee = 0;
      for (var i = 1; i <= this.form.times; i++) {
        // 从第二仓开始算 二仓 = 首仓金额 + 仓位 × 步进值
        maxFee = maxFee + (this.form.firstPosition + (i - 1) * this.form.steppingPosition)
      }
      this.maxFees = '预计满仓资金使用量:[' + maxFee.toFixed(2) + '](止损指标不参与计算)'
    },
    dataSizeFormate(value) {
      return dataSizeFormate(value)
    },
    submitAutoConfig() {
      // this.form.clientId = this.clientId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.autoConfigLoading = true
          createBackTest(this.form).then(() => {
            this.autoConfigLoading = false
            // this.listPlotsConfig()
            this.form.symbol = ''
            this.$message({
              type: 'success',
              message: '创建成功'
            })
          }).catch(() => {
            this.autoConfigLoading = false
          })
        }
      })
    },
    diskInfoToCheckBox(diskInfo) {
      return diskInfo.map(v => ({name: v.label + '(' + v.mount + ')', value: v.mount, disable: false}))
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
    repleaceN(value) {
      if (value) {
        return value.replace(/\\n/g, '<br>')
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
    useTemplate() {
      this.templateDialogShow = true
      listTemplate().then(res => {
        this.templateList = res.data
      }).catch(() => {

      })
    },
    uploadTemplate() {
      this.$confirm('确定上传模板 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        uploadTemplate(this.clientId).then(res => {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.listPlotsConfig()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    cancelUserTemplate() {
      this.templateDialogShow = false
    },
    generateConfigByTemplate() {
      this.templateForm.clientId = this.clientId
      this.$refs['templateForm'].validate((valid) => {
        if (valid) {
          this.generateConfigLoading = true
          generateConfigByTemplate(this.templateForm).then(() => {
            this.generateConfigLoading = false
            this.templateDialogShow = false
            this.listPlotsConfig()
          }).catch(() => {
            this.generateConfigLoading = false
          })
        }
      })
    },
    showLog(id) {
      this.logDialogShow = true
      this.logLoading = true
      queryLog(id).then(res => {
        this.logLoading = false
        this.logText = res.data.join('<br>')
      }).catch(() => {
      })
    },
    toUpdate(row) {
      this.updateDialogShow = true
      this.updateForm = {...row}
      const temp = this.updateForm.temporary
      const index = temp.indexOf('\\') + 1
      this.$set(this.updateForm, 'cacheDriver', temp.substring(0, index))
      this.$set(this.updateForm, 'folder', temp.substring(index))
      this.updateForm.target = this.updateForm.targetList
    },
    cancelUpdate() {
      this.updateDialogShow = false
      this.$refs.updateForm.resetFields()
      this.$refs.updateForm.clearValidate()
    },
    submitUpdate() {
      this.updateForm.clientId = this.clientId
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.updateLoading = true
          modify(this.updateForm).then(() => {
            this.updateLoading = false
            this.updateDialogShow = false
            this.listPlotsConfig()
          }).catch(() => {
            this.updateLoading = false
          })
        }
      })
    },
    handleBackTestTime() {
      if (this.form.time != null) {
        this.form.startTime = parseTime(this.form.time[0])
        this.form.endTime = parseTime(this.form.time[1])
      }
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

.log-content {
  height: 500px;
  overflow: scroll;
  white-space: nowrap;
}

</style>
