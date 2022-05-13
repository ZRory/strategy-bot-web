<template>
  <div class="app-container">
    <div class="head-container">
      <el-button slot="left" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toAdd">
        新增
      </el-button>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialogShow" append-to-body width="500px">
      <el-form ref="form" :inline="false" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="缓存路径" prop="temporary">
          <el-input v-model="form.temporary" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="目标路径" prop="target">
          <el-input v-model="form.target" />
        </el-form-item>
        <el-form-item label="内存大小" prop="memory">
          <el-input-number v-model="form.memory" controls-position="right" :min="2048" :max="8192" />
        </el-form-item>
        <el-form-item label="线程数" prop="thread">
          <el-input-number v-model="form.thread" controls-position="right" :min="1" :max="8" />
        </el-form-item>
        <el-form-item label="K" prop="k">
          <el-select v-model="form.k" clearable placeholder="请选择" style="width: 200px;">
            <el-option v-for="(item, index) in KCodes" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="桶大小" prop="bucket">
          <el-input-number v-model="form.bucket" controls-position="right" :min="32" :max="128" />
        </el-form-item>
        <el-form-item label="循环p图" prop="cycle">
          <el-switch v-model="form.cycle" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelAdd">取消</el-button>
        <el-button :loading="addLoading" type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
    <el-table ref="table" v-loading="queryLoading" :data="data" style="width: 100%;">
      <el-table-column align="center" :show-overflow-tooltip="true" type="index" label="id" width="100px" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="temporary" label="缓存路径" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="target" label="目标路径" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="memory" label="内存大小" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="thread" label="线程数" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="k" label="k" width="50px" />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="bucket" label="桶大小" />
      <el-table-column
        v-slot="{row:{cycle}}"
        align="center"
        header-align="center"
        :show-overflow-tooltip="true"
        label="循环p图"
      >
        <span v-if="cycle">是</span>
        <span v-else>否</span>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdate(scope.row)">编辑</el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200"
          >
            <p>确定删除该绘图任务吗？</p>
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
    <!-- <div class="pagination-class">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </div>
</template>

<script>
import { add, del, modify, page } from '@/api/monitor/templateItem'
export default {
  name: 'TemplateItem',
  data() {
    return {
      templateId: null,
      queryLoading: false,
      data: [],
      delLoading: false,
      addDialogShow: false,
      addLoading: false,
      total: 0,
      queryListParam: {
        templateId: '',
        pageSize: 10,
        pageNum: 1
      },
      submitType: '', // Add, Update
      form: {
        templateId: null,
        id: null,
        temporary: '',
        target: '',
        memory: 4096,
        thread: 2,
        k: 'K32',
        bucket: 128,
        cycle: true
      },
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
      rules: {
        temporary: [
          { required: true, message: '缓存路径不能为空', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '目标路径不能为空', trigger: 'blur' }
        ],
        memory: [
          { type: 'number', required: true, message: '内存大小不能为空', trigger: 'blur' }
        ],
        thread: [
          { type: 'number', required: true, message: '线程数不能为空', trigger: 'blur' }
        ],
        k: [
          { required: true, message: 'k值大小不能为空', trigger: 'blur' }
        ],
        bucket: [
          { required: true, message: '桶大小不能为空', trigger: 'blur' }
        ],
        cycle: [
          { required: true, message: '循环p图不能为空', trigger: 'blur' }
        ]
      },
      KCodes: [
        'K32',
        'K33',
        'K34',
        'K35'
      ]
    }
  },
  created() {
    this.templateId = this.$route.query.templateId
    this.queryList()
  },
  methods: {
    queryList() {
      this.queryLoading = true
      this.queryListParam.templateId = this.templateId
      page(this.queryListParam).then(res => {
        this.queryLoading = false
        this.data = res.data
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
      this.addDialogShow = true
      this.submitType = 'Add'
    },
    cancelAdd() {
      this.addDialogShow = false
      this.submitType = ''
      this.resetForm()
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        this.form.templateId = this.templateId
        this.addLoading = true
        if (valid) {
          if (this.submitType === 'Add') {
            this.form.id = null
            add(this.form).then(res => {
              this.addDialogShow = false
              this.submitType = ''
              this.addLoading = false
              this.resetForm()
              this.queryList()
            }).catch(() => {
              this.addLoading = false
            })
          } else {
            modify(this.form).then(res => {
              this.addDialogShow = false
              this.submitType = ''
              this.addLoading = false
              this.resetForm()
              this.queryList()
            }).catch(() => {
              this.addLoading = false
            })
          }
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      // this.form = {
      //   templateId: null,
      //   id: null,
      //   temporary: '',
      //   target: '',
      //   memory: 4096,
      //   thread: 2,
      //   k: 'K32',
      //   bucket: 128,
      //   cycle: true
      // }
    },
    toUpdate(row) {
      this.addDialogShow = true
      this.submitType = 'Update'
      this.form = { ...row }
      debugger
      this.form.target = JSON.parse(this.form.target).join(',')
    },
    toDelete(id) {
    },
    submitDel(id) {
      this.delLoading = true
      del(id, this.templateId).then(res => {
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
