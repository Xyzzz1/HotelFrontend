<template>
  <div class="container" style="width: 60%; height: 500px; padding-bottom: 100px; margin: 0 auto;">
    <div style="height: 100px;"></div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="image-container">
          <img src="../../assets/img/airconditioner.png" />
        </div>
      </el-col>
      <el-col :span="8" class="custom-col">
        <p class="font-indoor-temp">
          室内温度: {{ indoor_temp }} ℃
        </p>
        <p class="font-indoor-temp" v-if="conditioner_state === 0">空调状态: 关机</p>
        <p class="font-indoor-temp" v-else-if="conditioner_state === 1">空调状态: 服务</p>
        <p class="font-indoor-temp" v-else>空调状态: 等待</p>
      </el-col>
    </el-row>
    <el-card class="box-card" style="width: 40rem; margin-left: 100px;">
      <el-row class="row-spacing">
        <el-col :span="6">
          <p class="font-setting" v-if="power_on === false">开关机：关闭</p>
          <p class="font-setting" v-else>开关机：开机</p>
        </el-col>
        <el-col :span="14" class="col-flex">
          <el-switch v-model="power_on" @change="handle_power_on"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="row-spacing">
          <p class="font-setting">温度：{{ settings.temp }} ℃</p>
        </el-col>
        <el-col :span="14" class="col-flex">
          <el-button-group>
            <el-button type="primary" @click="handleTemp(0)">△</el-button>
            <el-button type="primary" @click="handleTemp(1)">▽</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row class="row-spacing">
        <el-col :span="6">
          <p class="font-setting" v-if="settings.wind === 0">风速：--</p>
          <p class="font-setting" v-else-if="settings.wind === 1">风速：低风</p>
          <p class="font-setting" v-else-if="settings.wind === 2">风速：中风</p>
          <p class="font-setting" v-else>风速：高风</p>

        </el-col>
        <el-col :span="14" class="col-flex">
          <el-button-group>
            <el-button type="primary" @click="handleWind(0)">△</el-button>
            <el-button type="primary" @click="handleWind(1)">▽</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row class="row-spacing">
        <el-col :span="2">
          <p class="font-setting">定时</p>
          <div class></div>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model="hours" controls-position="right" @change="handle_time_change" :min=0 :max="23"
            placeholder="小时" class="custom-input"></el-input-number>
          <el-input-number v-model="minutes" controls-position="right" @change="handle_time_change" :min=0 :max="59"
            placeholder="分钟" class="custom-input"></el-input-number>
          <el-input-number v-model="seconds" controls-position="right" @change="handle_time_change" :min=0 :max="59"
            placeholder="秒" class="custom-input"></el-input-number>
        </el-col>
        <el-col :span="6" class="col-flex">
          <el-switch v-model="settings.timer_on" @change="handleTimerOn"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="font-setting">模式</p>
          <div class></div>
        </el-col>
        <el-radio-group v-model="settings.mode" @change="handleModeChange">
          <el-radio :label="1" class="radio-button">制冷</el-radio>
          <el-radio :label="0" class="radio-button">制热</el-radio>
        </el-radio-group>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {
      room_id: -1,
      power_on: false,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      indoor_temp: "--",
      min_temp: 18,
      max_temp: 25,
      conditioner_state: 0,
      settings: {
        temp: "--",
        wind: 0,
        mode: 1,
        target_duration: -1,
        timer_on: false,
      },
    }
  },
  watch: {},
  computed: {},
  beforeCreate() { },
  created() { },
  beforeMount() {
  },
  mounted() {
    this.axios.get(process.env.VUE_APP_BASE_URL + "/user/conditioner/getRoomId?userId=")
      .then(res => {
        console.log(res);
        if (res.data.code != '200') {
          this.$message({
            message: "没有查询到该用户的订房信息！",
            type: "error",
          });
        } else {
          this.room_id = res.data.data;
          this.createEventSource();
          this.axios.get(process.env.VUE_APP_BASE_URL + "/user/conditioner/status?roomId=" +
            this.room_id
          ).then((res) => {
            console.log(res.data);
            if (res.data.data.powerOn) {
              this.power_on = true;
              this.settings.temp = res.data.data.targetTemperature;
              this.settings.wind = res.data.data.windSpeed;
              this.settings.mode = res.data.data.mode;
              if (res.data.data.targetDuration != -1) {
                let totalSeconds = res.data.data.targetDuration;
                this.settings.timer_on = true;
                this.hours = Math.floor(totalSeconds / 3600);
                this.minutes = Math.floor((totalSeconds % 3600) / 60);
                this.seconds = totalSeconds % 60;
              } else {
                this.settings.timer_on = false;
                this.hours = undefined;
                this.minutes = undefined;
                this.seconds = undefined;

              }
              if (res.data.data.reason == -1)
                this.conditioner_state = 1;
              else
                this.conditioner_state = 2;
            } else {
              this.power_on = false;
            }
          })
        }
      });
  },
  beforeUpdate() { },
  updated() { },
  beforeDestroy() {
    //this.source.close();
    //this.closeSSE();
  },
  destroyed() { },
  methods: {
    handle_power_on() {
      if (this.power_on) {
        if (this.settings.mode = 1)
          this.settings.temp = 25;
        else
          this.settings.temp = 22;
        this.settings.wind = 2;
        let duration = -1;
        if (this.settings.timer_on == true)
          duration = this.settings.target_duration;

        let json = {
          roomId: this.room_id,
          userId: null,
          powerOn: true,
          targetTemperature: this.settings.temp,
          windSpeed: 2,
          additionalFee: 0,
          targetDuration: duration,
          requestTime: this.changeTimeStr(new Date().toGMTString()),
          mode: this.settings.mode
        }
        console.log(json);
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/turnOn", json)
          .then((res) => {
            console.log(res.data);
          });

      } else {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/turnOff?roomId=" + this.room_id)
          .then((res) => {
            if (res.data.code == '200') {
              console.log(res.data.data);
            }
            else {
              console.log(res.data.data);
            }
          });
      }
    },
    changeTimeStr(str) {
      str = str.toString();
      str = str.replace(/ GMT.+$/, ''); // Or str = str.substring(0, 24)
      let d = new Date(str);
      let a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
      for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] < 10) {
          a[i] = '0' + a[i];
        }
      }
      str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4];
      return str;
    },
    handleTemp(val) {
      if (!this.power_on) {
        this.$message({
          message: '空调未开机！',
          type: "error",
        });
        clearTimeout(this.timer);
        return;
      }
      if (val == '0') {
        if (this.settings.temp == this.max_temp) {
          this.$message({
            message: '已是最高设定温度',
            type: "error",
          });
          return;
        }
        this.settings.temp += 1;

      } else {
        if (this.settings.temp == 18) {
          this.$message({
            message: '已是最低设定温度',
            type: "error",
          });
          return;
        }
        this.settings.temp -= 1;
      }

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustTargetTemperature?targetTemperature=" + this.settings.temp + "&roomId=" + this.room_id)
          .then((res) => {
            if (res.data.code == '200') {
              this.$message({
                message: res.data.data,
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.data,
                type: "error",
              });
            }
          });
      }, 1000);
    },

    handleWind(val) {
      if (!this.power_on) {
        this.$message({
          message: '空调未开机！',
          type: "error",
        });
        clearTimeout(this.timer);
        return;
      }
      if (val == '0') {
        if (this.settings.wind == 3) {
          this.$message({
            message: '已是最高风速',
            type: "error",
          });
          return;
        }
        this.settings.wind += 1;
      } else {
        if (this.settings.wind == 1) {
          this.$message({
            message: '已是最低风速',
            type: "error",
          });
          return;
        }
        this.settings.wind -= 1;
      }

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustWindSpeed?windSpeed=" + this.settings.wind + "&roomId=" + this.room_id)
          .then((res) => {
            if (res.data.code == '200') {
              this.$message({
                message: res.data.data,
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.data,
                type: "error",
              });
            }
          });
      }, 1000);
    },

    createEventSource() {
      const that = this;
      if (window.EventSource) {
        const source = new EventSource(process.env.VUE_APP_BASE_URL + "/user/conditioner/sse/subscribe?roomId=" + this.room_id);
        source.onopen = (event) => {
          console.log("onopen:" + this.room_id + ": " + event)
        };
        source.onmessage = (event) => {
          console.log("收到消息:" + this.room_id + ": " + event.data);
          let message = JSON.parse(event.data);
          if (message.controllerType == "status-update") { //处理开关机
            if (message.powerOn) {
              this.power_on = true;
              if (message.reason == -1) {
                this.conditioner_state = 1;
              } else if (message.reason == -3) {
                this.conditioner_state = 2;
              }
            } else {
              this.power_on = false;
              this.conditioner_state = 0;
              this.settings.temp = "--";
              this.settings.wind = 0;

            }
          } else if (message.controllerType == "temperature-update") { //处理温度变化
            this.indoor_temp = message.temperature;
          }

        };
        source.onerror = (event) => {
          console.log("onerror :" + clientId + ": " + event)
        };
        source.close = (event) => {
          console.log("close :" + this.room_id + ": " + event)
        };
      } else {
        alert('你的浏览器不支持SSE')
      }
    },
    handle_time_change() {
      if (this.hours == null)
        this.hours = 0;
      if (this.minutes == null)
        this.minutes = 0
      if (this.seconds == null)
        this.seconds = 0;
      this.settings.target_duration = this.hours * 3600 + this.minutes * 60 + this.seconds;
      if (this.settings.timer_on && this.power_on) {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustTargetDuration?targetDuration=" + this.settings.target_duration + "&roomId=" + this.room_id)
          .then((res) => {
            console.log(res);
          });
      }
    },


    handleTimerOn() {
      if (this.settings.timer_on && this.power_on) {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustTargetDuration?targetDuration=" + this.settings.target_duration + "&roomId=" + this.room_id)
          .then((res) => {
            console.log(res);
          });
      }
      else if (this.power_on) {
        this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustTargetDuration?targetDuration=-1&roomId=" + this.room_id)
          .then((res) => {
            console.log(res);
          });
      }
    },


    handleModeChange() {
      if (this.mode == 1)
        this.max_temp = 28;
      else
        this.max_temp = 25;
      this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/adjustMode?roomId=" + this.room_id + "&mode=" + this.settings.mode)
        .then((res) => {
          console.log(res);
        });
    },

    show_error_message(message_output) {
      this.$message({
        message: message_output,
        type: "error",
      });
    },
    closeSSE() {

    },
  },
  fillter: {},
}
</script>

<style scoped>
.col-flex {
  display: flex;
  justify-content: flex-end;

}

.radio-button {
  margin-right: 10px;
}

.box-card {}

.image-container {}

.image-container img {
  transform: scale(0.7, 0.7);
}

.container {}

.font-indoor-temp {
  font-size: 1.5rem;
}

.custom-input {
  width: 100px;
}

.custom-col {}

.row-spacing {
  margin-bottom: 20px;
}

.font-setting {
  font-size: 1.2rem;
  margin: 0;
  padding: 0;
  text-align: left;
}
</style>
