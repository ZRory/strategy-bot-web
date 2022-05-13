<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input
          v-model="queryListParam.redeemCode"
          clearable
          placeholder="兑换卡号"
          style="width: 185px;"
          class="filter-item"
        />
        <el-input
          v-model="queryListParam.cardNo"
          clearable
          placeholder="授权卡号"
          style="width: 185px;"
          class="filter-item"
        />
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
        @click="bindingClick"
      >
        <svg-icon icon-class="login" class="el-button_icon" />
        卡号兑换
      </el-button>
      <el-button
        slot="left"
        class="filter-item"
        size="mini"
        type="primary"
        @click="getTrialClick"
      >
        <svg-icon icon-class="login" class="el-button_icon" />
        领取试用卡
      </el-button>

      <!--弹框表单组件-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="exchangeDialogShow"
        title="兑换卡号"
        width="40%"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="卡号" label-width="40px">
            <el-input v-model="form.redeemCode" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="bindingClick">取消</el-button>
          <el-button :loading="bindingLoding" type="primary" @click="submitExchange">确认</el-button>
        </div>
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="queryLoading" :data="machineList" size="small" stripe style="width: 100%;">
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="redeemCode"
          label="兑换卡号"
        />
        <el-table-column
          align="center"
          header-align="center"
          :show-overflow-tooltip="true"
          prop="cardNo"
          label="授权卡号"
        />
        <el-table-column
          v-slot="{row:{status}}"
          align="center"
          header-align="center"
          label="绑定状态"
        >
          <el-tag v-if="status" type="success">已绑定</el-tag>
          <el-tag v-else>未绑定</el-tag>
        </el-table-column>
        <el-table-column
          v-slot="{row:{bindTime, effective}}"
          align="center"
          header-align="center"
          label="绑定时间"
          empty-text="未授权"
        >
          <el-tooltip
            v-if="bindTime!=null"
            class="item"
            effect="dark"
            :content="bindTime.replace('T', ' ')"
            placement="top"
          >
            <el-tag v-if="effective" type="success">{{ bindTime.substring(0, 10) }}</el-tag>
            <el-tag v-else type="danger">{{ bindTime.substring(0, 10) }}</el-tag>
          </el-tooltip>
        </el-table-column>
        <el-table-column
          v-slot="{row:{endTime, effective}}"
          align="center"
          header-align="center"
          label="到期时间"
          empty-text="未授权"
        >
          <el-tooltip
            v-if="endTime!=null"
            class="item"
            effect="dark"
            :content="endTime.replace('T', ' ')"
            placement="top"
          >
            <el-tag v-if="effective" type="success">{{ endTime.substring(0, 10) }}</el-tag>
            <el-tag v-else type="danger">{{ endTime.substring(0, 10) }}</el-tag>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div class="pagination-class">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="machineTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { exchange, list, getTestCard } from '@/api/cards/cards'

export default {
  name: 'Cards',
  data() {
    return {
      exchangeDialogShow: false,
      bindingLoding: false,
      form: {
        redeemCode: ''
      },
      rules: {
        redeemCode: [
          { required: true, message: '卡号不能为空', trigger: 'blur' }
        ]
      },
      queryLoading: false,
      queryListParam: {
        redeemCode: null,
        cardNo: null,
        pageSize: 10,
        pageNum: 1
      },
      machineList: [],
      machineTotal: 0
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    bindingClick() {
      this.exchangeDialogShow = !this.exchangeDialogShow
    },
    submitExchange() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.bindingLoding = true
          exchange(this.form).then(res => {
            this.exchangeDialogShow = false
            this.bindingLoding = false
            this.resetQuery()
            this.queryList()
          }).catch(() => {
            this.form.bindingCode = ''
            this.bindingLoding = false
          })
        }
      })
    },
    getTrialClick() {
      getTestCard().then(res => {
        this.$message({
          type: 'success',
          message: '领取成功'
        })
        this.queryList()
      }).catch(() => {

      })
    },
    resetQuery() {
      this.queryListParam = {
        redeemCode: null,
        cardNo: null,
        pageSize: 10,
        pageNum: 1
      }
    },
    queryList() {
      this.queryLoading = true
      list(this.queryListParam).then(res => {
        this.queryLoading = false
        this.machineList = res.data.list
        this.machineTotal = res.data.total
      }).catch((error) => {
        this.queryLoading = false
        this.$message({
          showClose: true,
          message: error.message,
          type: 'warning'
        })
      })
    },
    handleSizeChange(pageSiz) {
      this.queryListParam.pageSize = pageSiz
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.queryListParam.pageNum = currentPage
      this.queryList()
    }
  }
}
</script>

<style scoped>

</style>
