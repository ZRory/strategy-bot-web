<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input
          v-model="queryListParam.symbol"
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
        <el-select v-model="queryListParam.status" clearable size="small" placeholder="策略状态" class="filter-item">
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
      <el-button
        slot="left"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-key"
        @click="bindingClick"
      >
        绑定API
      </el-button>
      <el-button
        slot="left"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-wallet"
        :loading="balanceCardLoading"
        @click="toBalanceCard"
      >
        查询账户余额信息
      </el-button>
      <a target="_blank" href="https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA">
        <el-alert
          title="公告:推荐注册binance高返佣帐号(20%) : https://accounts.binance.com/zh-CN/register?ref=YAF2OKAA"
          type="success"
        />
      </a>
      <el-alert
        v-if="this.$route.query.riskmode === 'true'"
        title="WARNING:你已开启高风险模式,请谨慎配置! 同一交易对共享杠杆倍率!"
        type="error"
      />
      <el-alert
        title="本程序为多空双向网格,请仔细阅读使用说明后再使用本程序!"
        type="error"
      />
      <br>
      <!--      <el-button-->
      <!--        slot="left"-->
      <!--        class="filter-item"-->
      <!--        size="mini"-->
      <!--        type="primary"-->
      <!--        :loading="bindingEquityCardAutoLoading"-->
      <!--        @click="bindEquityCardAuto"-->
      <!--      >-->
      <!--        <svg-icon icon-class="role" class="el-button_icon" />-->
      <!--        一键授权-->
      <!--      </el-button>-->
      <!--绑定机器-->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="addDialogShow" title="绑定API" width="280px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
          <el-form-item label="ApiKey" prop="apiKey">
            <el-input v-model="form.apiKey"/>
          </el-form-item>
          <el-form-item label="ApiSecret" prop="apiSecret">
            <el-input v-model="form.apiSecret"/>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="form.password" type="password" auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="bindingClick">取消</el-button>
          <el-button :loading="bindingLoding" type="primary" @click="submitBinding">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="remarkDialogShow"
        title="修改策略"
        width="280px"
      >
        <el-form
          v-if="this.$route.query.riskmode === 'true'"
          ref="form"
          :rules="updateRules"
          :model="updateForm"
          label-width="108px"
        >
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
          <!--          <el-form-item label="杠杆倍率" prop="leverage">-->
          <!--            <el-input-number v-model="updateForm.leverage" controls-position="right" :min="1" :max="8"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="首仓金额" prop="firstPosition">
            <el-input-number
              v-model="updateForm.firstPosition"
              controls-position="right"
              :min="0.1"
              :max="1000"
              :step="0.1"
              @change="handleMaxFee"
            />
          </el-form-item>
          <el-form-item label="加仓步进金额" prop="steppingPosition">
            <el-input-number
              v-model="updateForm.steppingPosition"
              controls-position="right"
              :min="-1000"
              :max="1000"
              :step="0.1"
              @change="handleMaxFee"
            />
          </el-form-item>
          <el-form-item label="单向购买次数" prop="times">
            <el-input-number
              v-model="updateForm.times"
              controls-position="right"
              :min="0"
              :max="100"
              @change="handleMaxFee"
            />
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
            <el-input v-model="maxFees" type="textarea" autosize disabled/>
          </el-form-item>
        </el-form>

        <el-form v-else ref="form" :rules="updateRules" :model="updateForm" label-width="108px">
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
          <!--          <el-form-item label="杠杆倍率" prop="leverage">-->
          <!--            <el-input-number v-model="updateForm.leverage" controls-position="right" :min="1" :max="8"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="首仓金额" prop="firstPosition">
            <el-input-number
              v-model="updateForm.firstPosition"
              controls-position="right"
              :min="2"
              :max="1000"
              @change="handleMaxFee"
            />
          </el-form-item>
          <el-form-item label="加仓步进金额" prop="steppingPosition">
            <el-input-number
              v-model="updateForm.steppingPosition"
              controls-position="right"
              :min="1"
              :max="600"
              @change="handleMaxFee"
            />
          </el-form-item>
          <el-form-item label="单向购买次数" prop="times">
            <el-input-number
              v-model="updateForm.times"
              controls-position="right"
              :min="0"
              :max="100"
              @change="handleMaxFee"
            />
          </el-form-item>
          <el-form-item label="补仓率" prop="coverRate">
            <el-input-number v-model="updateForm.coverRate" controls-position="right" :min="0.4" :max="100"/>
          </el-form-item>
          <el-form-item label="补仓回撤率" prop="coverShrinksRate">
            <el-input-number v-model="updateForm.coverShrinksRate" controls-position="right" :min="0" :max="100"/>
          </el-form-item>
          <el-form-item label="止盈率" prop="stopRate">
            <el-input-number v-model="updateForm.targetRate" controls-position="right" :min="0.4" :max="1000"/>
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
            <el-input v-model="maxFees" type="textarea" autosize disabled/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelRemark">取消</el-button>
          <el-button :loading="remarkLoading" type="primary" @click="submitRemark">确认</el-button>
        </div>
      </el-dialog>

      <!--选择卡号-->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="cardDialogShow" title="修改状态" width="320px">
        <el-form ref="cardForm" :model="cardForm" :rules="cardRules" size="small" label-width="90px">
          <el-form-item label="策略状态" prop="status">
            <el-select v-model="cardForm.status" clearable size="small" label="策略状态" class="filter-item">
              <el-option v-for="item in osFamilies" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelBindingCard">取消</el-button>
          <el-button :loading="bindingCardLoding" type="primary" @click="submitBindingCard">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="profitDialogShow"
        title="盈亏信息"
        width="280px"
      >
        <el-form ref="form" :model="profit" size="small" label-width="90px">
          <el-form-item label="总盈亏金额">
            <el-input v-model="profit.totalProfit" disabled/>
          </el-form-item>
          <el-form-item label="手续费">
            <el-input v-model="profit.serviceAmount" disabled/>
          </el-form-item>
          <el-form-item label="浮动盈亏">
            <el-input v-model="profit.slidingProfit" disabled/>
          </el-form-item>
          <el-form-item label="已实现盈亏">
            <el-input v-model="profit.currentProfit" disabled/>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="balanceDialogShow"
        title="U本位账户资产"
        width="280px"
      >
        <el-form ref="form" :model="profit" size="small" label-width="100px">
          <el-form-item label="钱包余额">
            <el-input v-model="balance.totalWalletBalance" disabled style="color: gray"/>
          </el-form-item>
          <el-form-item label="保证金余额">
            <el-input v-model="balance.totalMarginBalance" disabled/>
          </el-form-item>
          <el-form-item label="未实现盈亏">
            <el-input v-model="balance.totalUnrealizedProfit" disabled/>
          </el-form-item>
          <el-form-item label="下单可用余额">
            <el-input v-model="balance.availableBalance" disabled/>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        :data="machineList"
        size="small"
        stripe
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          fixed
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="id"
          label="id"
          sortable="custom"
        >
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
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          header-align="center"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--          prop="motherBoardModel"-->
        <!--          label="主板型号"-->
        <!--        />-->
        <!--        <el-table-column align="center" header-align="center" prop="autoSwitch" label="自动判断方向">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.autoSwitch ? '是' : '否' }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="remark"
          label="备注信息"
        />
        <el-table-column align="center" header-align="center" prop="share" label="是否分享">
          <template slot-scope="scope">
            {{ scope.row.share ? '是' : '否' }}
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" header-align="center" prop="status" label="在线状态">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '在线' : '离线' }}</el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          v-slot="{row:{equityCardNo}}"-->
        <!--          align="center"-->
        <!--          header-align="center"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--          label="授权卡"-->
        <!--        >-->
        <!--          <el-tag :type="equityCardNo!=null ? 'success' : 'danger'">-->
        <!--            {{ equityCardNo != null ? equityCardNo : '未授权' }}-->
        <!--          </el-tag>-->
        <!--        </el-table-column>-->
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
              type="primary"
              plain
              icon="el-icon-switch-button"
              @click="toBindingCard(scope.row.id)"
            >
              修改状态
            </el-button>
            <el-button
              slot="reference"
              class="filter-item"
              size="mini"
              type="primary"
              plain
              icon="el-icon-s-operation"
              @click="toRemark(scope.row)"
            >
              修改策略
            </el-button>
            <el-button
              slot="reference"
              class="filter-item"
              size="mini"
              type="primary"
              plain
              icon="el-icon-money"
              :loading="toProfitCardLoading"
              @click="toProfitCard(scope.row.id)"
            >
              查看盈亏
            </el-button>
            <el-button
              slot="reference"
              class="filter-item"
              size="mini"
              type="primary"
              plain
              icon="el-icon-data-analysis"
              @click="checkEquity(scope.row.id)"
            >
              查看仓位
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div v-if="device === 'mobile'" class="pagination-class">
        <el-pagination
          background
          layout="total,prev, next,sizes "
          :total="machineTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-else class="pagination-class">
        <el-pagination
          background
          layout="total,prev, pager, next,sizes "
          :total="machineTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      /> -->

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
  queryProfit, balance
} from '@/api/monitor/machine'
import Cookies from 'js-cookie'
import Config from '@/settings'
import {mapGetters} from 'vuex'

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
        autoSwitch: false,
        positionSide: 'BOTH',
        times: 48,
        firstPosition: 4,
        steppingPosition: 2,
        coverRate: 1.4,
        coverShrinksRate: 0,
        targetRate: 1.2,
        targetShrinksRate: 0,
        share: true,
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
        // 当前所需起始保证金总额(存在逐仓请忽略), 仅计算usdt资产
        totalInitialMargin: '',
        // 维持保证金总额, 仅计算usdt资产
        totalMaintMargin: '',
        // 账户总余额, 仅计算usdt资产
        totalWalletBalance: '',
        // 持仓未实现盈亏总额, 仅计算usdt资产
        totalUnrealizedProfit: '',
        // 保证金总余额, 仅计算usdt资产
        totalMarginBalance: '',
        // 持仓所需起始保证金(基于最新标记价格), 仅计算usdt资产
        totalPositionInitialMargin: '',
        // 当前挂单所需起始保证金(基于最新标记价格), 仅计算usdt资产
        totalOpenOrderInitialMargin: '',
        // 全仓账户余额, 仅计算usdt资产
        totalCrossWalletBalance: '',
        // 全仓持仓未实现盈亏总额, 仅计算usdt资产
        totalCrossUnPnl: '',
        // 可用余额, 仅计算usdt资产
        availableBalance: '',
        // 最大可转出余额, 仅计算usdt资产
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
      queryListParam: {
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
    if (Cookies.get('queryStatus') !== undefined) {
      this.queryListParam.status = Cookies.get('queryStatus')
    }
    this.queryList()
  },
  methods: {
    unbinding(clientId) {
      this.unbindingLoding = true
      unbinding(clientId).then(() => {
        this.unbindingLoding = false
        this.resetQuery()
      }).catch((error) => {
        this.delLoading = false
        this.$message({
          showClose: true,
          message: error.message,
          type: 'warning'
        })
      }).finally(() => {
        this.queryList()
      })
    },
    handleMaxFee() {
      var maxFee = 0
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
          }).catch(() => {
            this.bindingLoding = false
          }).finally(() => {
            this.queryList()
          })
        }
      })
    },
    resetQuery() {
      this.queryListParam = {
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
      Cookies.set('queryStatus', this.queryListParam.status)
      list(this.queryListParam).then(res => {
        if (res.data.current > res.data.pages) {
          this.queryListParam.pageNum = 1
          list(this.queryListParam).then(res => {
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
      this.queryListParam.pageSize = pageSize
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.queryListParam.pageNum = currentPage
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
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }).catch(() => {
            this.bindingCardLoding = false
          }).finally(() => {
            this.queryList()
          })
        }
      })
    },
    checkEquity(clientId) {
      // this.$router.push({ path: '/machines/detail', query: { clientId: clientId }})
      // checkEquity(clientId).then(res => {
      //   this.$router.push({path: '/machines/detail', query: {clientId: clientId}})
      // }).catch(() => {
      // })
      this.$router.push({path: '/strategy/detail', query: {clientId: clientId}})
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
      updateRemark(this.updateForm).then(res => {
        this.remarkLoading = false
        this.remarkDialogShow = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$refs.updateForm.resetFields()
      }).catch(() => {
        this.remarkLoading = false
      }).finally(() => {
        this.queryList()
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
        this.queryListParam.column = null
        this.queryListParam.sort = null
      } else if (orderInfo.order === 'ascending') {
        this.queryListParam.column = orderInfo.prop
        this.queryListParam.sort = 'ASC'
      } else if (orderInfo.order === 'descending') {
        this.queryListParam.column = orderInfo.prop
        this.queryListParam.sort = 'DESC'
      }
      this.queryList()
    }
  }
}
</script>

<style scoped>

</style>
