<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <el-tooltip v-if="user.apiKey !== null && user.apiKey !== undefined && user.apiKey !== ''" content="您已配置API信息"
                  effect="dark" placement="bottom">
        <span class="right-menu-item vip" @click="bindingClick">API</span>
      </el-tooltip>
      <el-tooltip v-else content="您还未配置API信息" effect="dark" placement="bottom">
        <span class="right-menu-item not-vip" @click="bindingClick">API</span>
      </el-tooltip>

      <el-tooltip v-if="user.inviteUser" content="尊敬的VIP用户,欢迎您,切换API后需要重新认证VIP" effect="dark" placement="bottom">
        <span class="right-menu-item vip">VIP</span>
      </el-tooltip>
      <el-tooltip v-else content="通过页面邀请链接注册即可成为VIP用户" effect="dark" placement="bottom">
        <span class="right-menu-item not-vip">VIP</span>
      </el-tooltip>
      <template v-if="device!=='mobile'">
        <!--        <search id="header-search" class="right-menu-item"/>-->

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect"/>
        </el-tooltip>

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>

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

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatar ? baseApi + '/avatar/' + user.avatar : Avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display:block;" @click="show = true">
            <el-dropdown-item>
              布局设置
            </el-dropdown-item>
          </span>
          <router-link to="/user/center">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <span style="display:block;" @click="open">
            <el-dropdown-item divided>
              退出登录
            </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Avatar from '@/assets/images/avatar.png'
import {binding} from "@/api/monitor/machine";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      addDialogShow: false,
      bindingLoding: false,
      Avatar: Avatar,
      dialogVisible: false,
      form: {
        apiKey: '',
        apiSecret: '',
        password: ''
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'user',
      'baseApi'
    ]),
    show: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.replace({path: '/login'})
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.vip {
  //font-style: oblique; //倾斜
  color: gold !important;
  font-weight: bolder;
}

.not-vip {
  //font-style: oblique; //倾斜
  color: gray !important;
  font-weight: bolder;
}

</style>
