<template>
  <!--  <div class="login" :style="'background-image: linear-gradient(160deg, #00ffd5 40%,#008cff 60%);'">-->
  <div class="login" :style="'background-image: linear-gradient(160deg, #10c6d1 25%,#094368 75%);'">
    <ul class="bg-bubbles">
      <li v-for="i in 10" :key="i"></li>
    </ul>
    <el-form v-show="boxType == 'login'" ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left"
             label-width="0px" class="login-form">
      <h3 class="title">
        AI 网格机器人
      </h3>
      <el-form-item prop="phone">
        <el-input v-model="loginForm.phone" type="text" maxlength="11" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                  @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="graphCode">
        <el-input v-model="loginForm.graphCode" auto-complete="off" placeholder="验证码" style="width: 63%"
                  @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item style="width: 100%;height: 30px;margin-bottom: 10px;">
        <!--        <el-checkbox v-model="loginForm.rememberMe">-->
        <!--          记住我-->
        <!--        </el-checkbox>-->
        <a type="text" href="https://www.wolai.com/8HCqk71eJ3NMnyoTj5XRFv" target="_blank"
           style="color: #409eff !important; text-align: center">点我了解机器人</a>
      </el-form-item>
      <div class="remember-me">
        <el-button type="text" @click="switchBox('register')">还没有账号？注册</el-button>
        <el-button type="text" class="forget-pwd" @click="switchBox('resetpwd')">忘记密码？</el-button>
      </div>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                   @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <el-form v-show="boxType == 'register' || boxType == 'resetpwd'" ref="registerForm" :model="registerForm"
             :rules="registerRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">
        AI 网格机器人
      </h3>
      <el-form-item prop="phone">
        <el-input v-model="registerForm.phone" type="text" maxlength="11" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" minlength="6" maxlength="20" auto-complete="off"
                  placeholder="密码">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="repeatPassword">
        <el-input v-model="registerForm.repeatPassword" type="password" minlength="6" maxlength="20" auto-complete="off"
                  placeholder="确认密码">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="graphCode">
        <el-input v-model="registerForm.graphCode" auto-complete="off" placeholder="验证码" style="width: 63%">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item prop="authCode">
        <el-input v-model="registerForm.authCode" auto-complete="off" placeholder="短信验证码" style="width: 63%">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <el-button v-if="codeShow" :loading="getSmsLoading" size="medium" type="text" @click="sendMobileCode">获取验证码
          </el-button>
          <span v-if="!codeShow">{{ timeCount }}秒后重试</span>
        </div>
      </el-form-item>
      <el-form-item class="remember-me">
        <el-button type="text" @click="switchBox('login')">切换登录</el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button v-if="boxType == 'register'" :loading="loading" size="medium" type="primary" style="width:100%;"
                   @click.native.prevent="handleRegister">
          <span v-if="!loading">注册</span>
          <span v-else>注册...</span>
        </el-button>
        <el-button v-if="boxType == 'resetpwd'" :loading="loading" size="medium" type="primary" style="width:100%;"
                   @click.native.prevent="handleResetPwd">
          <span v-if="!loading">重置密码</span>
          <span v-else>重置密码...</span>
        </el-button>
      </el-form-item>
    </el-form>
<!--    <div id="footer"><a href="http://beian.miit.gov.cn/" target="_blank" id="beian" style="color: white !important; text-align: center">鄂ICP备2021008807号</a></div>-->
  </div>
</template>

<script>
import {encrypt} from '@/utils/rsaEncrypt'
import Config from '@/settings'
import {getCodeImg, register, getSmsCode, findPassword} from '@/api/login'
import Cookies from 'js-cookie'
import Background from '@/assets/images/background.jpg'
import {isvalidPhone} from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.registerForm.password !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入密码'))
      }
    }
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      Background: Background,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        phone: '',
        password: '',
        rememberMe: false,
        graphCode: '',
        uuid: ''
      },
      registerForm: {
        phone: '',
        password: '',
        repeatPassword: '',
        authCode: '',
        graphCode: '',
        uuid: ''
      },
      loginRules: {
        phone: [{required: true, trigger: 'blur', validator: validPhone}],
        password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
        graphCode: [{required: true, trigger: 'change', message: '验证码不能为空'}]
      },
      registerRules: {
        phone: [{required: true, trigger: 'blur', validator: validPhone}],
        password: [
          {required: true, trigger: 'blur', message: '密码不能为空'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        repeatPassword: [{required: true, trigger: 'blur', validator: confirmPass}],
        authCode: [{required: true, trigger: 'change', message: '短信验证码不能为空'}],
        graphCode: [{required: true, trigger: 'change', message: '图形验证码不能为空'}]
      },
      loading: false,
      redirect: undefined,
      boxType: 'login',
      timer: null,
      codeShow: true,
      timeCount: 0,
      getSmsLoading: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    this.point()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.data.graphCode
        this.loginForm.uuid = res.uuid
        if (this.boxType === 'login') {
          this.loginForm.uuid = res.data.uuid
        } else {
          this.registerForm.uuid = res.data.uuid
        }
      })
    },
    getCookie() {
      const phone = Cookies.get('phone')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        phone: phone === undefined ? this.loginForm.phone : phone,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        graphCode: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          phone: this.loginForm.phone,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          graphCode: this.loginForm.graphCode,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('phone', user.phone, {expires: Config.passCookieExpires})
            // Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, {expires: Config.passCookieExpires})
          } else {
            Cookies.remove('phone')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false
            this.$router.push({path: this.redirect || '/'})
          }).catch(err => {
            console.log(err)
            this.loading = false
            this.getCode()
          })
        } else {
          return false
        }
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$notify({
          title: '提示',
          message: '当前登录状态已过期，请重新登录！',
          type: 'warning',
          duration: 5000
        })
        Cookies.remove('point')
      }
    },
    switchBox(type) {
      this.boxType = type
      this.resetForm()
      this.getCode()
    },
    resetForm() {
      this.$refs.loginForm.clearValidate()
      this.$refs.registerForm.clearValidate()
      this.$refs.loginForm.resetFields()
      this.$refs.registerForm.resetFields()
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (this.registerForm.password !== this.registerForm.repeatPassword) {
          return false
        }
        if (valid) {
          this.loading = true
          register(this.registerForm.phone, encrypt(this.registerForm.password), this.registerForm.authCode).then(res => {
            this.$notify({
              title: '注册成功',
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              this.loading = false
              this.boxType = 'login'
              this.$refs.loginForm.clearValidate()
              this.getCode()
            }, 1000)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleResetPwd() {
      this.$refs.registerForm.validate(valid => {
        if (this.registerForm.password !== this.registerForm.repeatPassword) {
          return false
        }
        if (valid) {
          this.loading = true
          findPassword(this.registerForm.phone, encrypt(this.registerForm.password), this.registerForm.authCode).then(res => {
            this.$notify({
              title: '密码重置成功，即将跳转登录',
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              this.loading = false
              this.boxType = 'login'
              this.resetForm()
              this.getCode()
            }, 1000)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    sendMobileCode() {
      this.getSmsLoading = true
      if (!isvalidPhone(this.registerForm.phone)) {
        this.$notify({
          title: '请输入正确的11位手机号码',
          type: 'warning',
          duration: 1000
        })
        this.getSmsLoading = false
        return
      }
      if (this.registerForm.graphCode === '' || !this.registerForm.graphCode || this.registerForm.graphCode.trim() === '') {
        this.$notify({
          title: '图形验证码不能为空',
          type: 'warning',
          duration: 1000
        })
        this.getSmsLoading = false
        return
      }
      getSmsCode(this.registerForm.phone, this.registerForm.graphCode, this.registerForm.uuid).then(res => {
        // 倒计时60秒
        this.setSmsTimer()
      }).catch(() => {
        this.setSmsTimer()
      })
    },
    setSmsTimer() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.timeCount = TIME_COUNT
        this.codeShow = false
        this.timer = setInterval(() => {
          if (this.timeCount > 0 && this.timeCount <= TIME_COUNT) {
            this.timeCount--
          } else {
            this.getSmsLoading = false
            this.codeShow = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
// import popo from '@/canvas/canvas.js'
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  flex-direction: column;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: white;
}

.login-form {
  z-index: 100;
  border: 1px solid rgba(73,215,224,0.5);
  background: rgba(0,52,84,0.6);
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}

.remember-me {
  height: 30px;
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.forget-pwd {
  float: right;
}

#footer {
  flex: 0 0 auto;
  height: 80px;
  line-height: 80px;
}

.bg-bubbles {
  position: absolute;
  // 使气泡背景充满整个屏幕；
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // 如果元素内容超出给定的宽度和高度，overflow 属性可以确定是否显示滚动条等行为；
  overflow: hidden;

  li {
    border-radius: 50%;
    position: absolute;
    // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
    bottom: -160px;
    // 默认的气泡大小；
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    list-style: none;
    // 使用自定义动画使气泡渐现、上升和翻滚；
    animation: square 15s infinite;
    transition-timing-function: linear;
    // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
    &:nth-child(1) {
      left: 10%;
    }

    &:nth-child(2) {
      left: 20%;
      width: 90px;
      height: 90px;
      animation-delay: 2s;
      animation-duration: 7s;
    }

    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }

    &:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-duration: 8s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    &:nth-child(5) {
      left: 70%;
    }

    &:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:nth-child(7) {
      left: 32%;
      width: 160px;
      height: 160px;
      animation-delay: 2s;
    }

    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
    }

    &:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    &:nth-child(10) {
      left: 85%;
      width: 160px;
      height: 160px;
      animation-delay: 5s;
    }
  }

  // 自定义 square 动画；
  @keyframes square {
    0% {
      opacity: 0.5;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      opacity: 0.75;
      transform: translateY(-400px) rotate(90deg)
    }
    50% {
      opacity: 1;
      transform: translateY(-800px) rotate(135deg);
    }
    100% {
      opacity: 0.25;
      transform: translateY(-1200px) rotate(180deg);
    }
  }
}

</style>
