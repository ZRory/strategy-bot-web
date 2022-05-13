<template>
  <div class="app-container">
    <div class="head-container">
      <el-button slot="left" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toAdd">
        新增
      </el-button>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialogShow" append-to-body width="500px" title="增加模板">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="矿工公钥" prop="farmerPublicKey">
          <el-input v-model="form.farmerPublicKey" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="矿池公钥" prop="poolPublicKey">
          <el-input v-model="form.poolPublicKey" style="width: 220px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="toAdd">取消</el-button>
        <el-button :loading="addLoading" type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="modifyDialogShow" append-to-body width="500px" title="修改模板">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="矿工公钥" prop="farmerPublicKey">
          <el-input v-model="form.farmerPublicKey" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="矿池公钥" prop="poolPublicKey">
          <el-input v-model="form.poolPublicKey" style="width: 220px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelUpdate">取消</el-button>
        <el-button :loading="modifyLoading" type="primary" @click="submitModify">确认</el-button>
      </div>
    </el-dialog>
    <el-table ref="table" v-loading="queryLoading" :data="data" style="width: 100%;">
      <el-table-column
        align="center"
        header-align="center"
        type="index"
        label="id"
      />
      <el-table-column align="center" header-align="center" :show-overflow-tooltip="true" prop="name" label="模板名称">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-right: 2px" type="text">
            <router-link :to="{ path: '/template/item', query: { templateId: scope.row.id } }">
              {{ scope.row.name }}
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        :show-overflow-tooltip="true"
        prop="farmerPublicKey"
        label="矿工公钥"
      />
      <el-table-column
        align="center"
        header-align="center"
        :show-overflow-tooltip="true"
        prop="poolPublicKey"
        label="矿池公钥"
      />
      <el-table-column
        v-slot="{row:{createTime}}"
        align="center"
        header-align="center"
        label="创建时间"
      >
        <span v-if="createTime!=null">{{ createTime.replace('T', ' ') }}</span>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdate(scope.row)">编辑</el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200"
          >
            <p>确定停止并删除该任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="submitDel(scope.row.id)">确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <div class="pagination-class">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { add, del, modify, page } from '@/api/monitor/template'

export default {
  name: 'Template',
  data() {
    return {
      queryLoading: false,
      data: [],
      delLoading: false,
      addDialogShow: false,
      addLoading: false,
      modifyDialogShow: false,
      modifyLoading: false,
      total: 0,
      queryListParam: {
        pageSize: 10,
        pageNum: 1
      },
      form: {
        id: null,
        name: '',
        farmerPublicKey: '',
        poolPublicKey: ''
      },
      rules: {
        name: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' }
        ],
        farmerPublicKey: [
          { required: true, message: '矿工公钥不能为空', trigger: 'blur' },
          { min: 96, max: 98, message: '矿工公钥格式不正确', trigger: 'blur' }
        ],
        poolPublicKey: [
          { required: true, message: '矿池公钥不能为空', trigger: 'blur' },
          { min: 96, max: 98, message: '矿池公钥格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.queryLoading = true
      page(this.queryListParam).then(res => {
        this.queryLoading = false
        this.data = res.data.list
        this.total = res.data.total
      }).catch(() => {
        this.queryLoading = false
      })
    },
    handleSizeChange(pageSiz) {
      this.queryListParam.pageSize = pageSiz
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.queryListParam.pageNum = currentPage
      this.queryList()
    },
    toAdd() {
      this.addDialogShow = !this.addDialogShow
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          add(this.form).then(res => {
            this.addDialogShow = false
            this.addLoading = false
            this.resetForm()
            this.queryList()
          }).catch(() => {
            this.addLoading = false
          })
        } else {
          this.addLoading = false
        }
      })
    },
    resetForm() {
      this.form = {
        name: '',
        farmerPublicKey: '',
        poolPublicKey: ''
      }
    },
    toUpdate(row) {
      this.modifyDialogShow = !this.modifyDialogShow
      this.form = { ...row }
    },
    cancelUpdate() {
      this.modifyDialogShow = !this.modifyDialogShow
      this.resetForm()
    },
    submitModify() {
      this.$refs['form'].validate((valid) => {
        this.modifyLoading = true
        if (valid) {
          this.form.templateId = this.form.id
          modify(this.form).then(res => {
            this.modifyLoading = false
            this.modifyDialogShow = false
            this.resetForm()
            this.queryList()
          }).catch(() => {
            this.modifyLoading = false
          })
        } else {
          this.modifyLoading = false
        }
      })
    },
    toDelete(id) {
    },
    submitDel(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.queryList()
      }).catch(() => {
        this.delLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
