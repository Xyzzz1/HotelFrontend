<template>
  <div class="container" style="width: 60%; height: 500px; padding-bottom: 100px; margin: 0 auto;">
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
        <p class="font-indoor-temp" v-if="mode === 0">当前模式: 制冷</p>
        <p class="font-indoor-temp" v-else-if="mode === 1">当前模式: 制热</p>
      </el-col>
    </el-row>
    <el-card class="box-card" style="width: 40rem; margin-left: 100px;">
      <el-row class="row-spacing">
        <el-col :span="6">
          <p class="font-setting" v-if="conditioner_state === 0">空调状态：关闭</p>
          <p class="font-setting" v-else-if="conditioner_state === 1">空调状态：开启</p>
          <p class="font-setting" v-else>空调状态：等待</p>
        </el-col>
        <el-col :span="14" class="col-flex">
          <el-switch v-model="power_on" @change="handle_power_on"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="row-spacing">
          <p class="font-setting" v-if="settings.temp === 10086">温度：-- ℃</p>
          <p class="font-setting" v-else>温度：{{ settings.temp }} ℃</p>
        </el-col>
        <el-col :span="14" class="col-flex">
          <el-button-group>
            <el-button type="primary">△</el-button>
            <el-button type="primary">▽</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row class="row-spacing">
        <el-col :span="6">
          <p class="font-setting" v-if="settings.wind === -1">风速：--</p>
          <p class="font-setting" v-else-if="settings.wind === 0">风速：低风</p>
          <p class="font-setting" v-else-if="settings.wind === 1">风速：中风</p>
          <p class="font-setting" v-else>风速：高风</p>

        </el-col>
        <el-col :span="14" class="col-flex">
          <el-button-group>
            <el-button type="primary">△</el-button>
            <el-button type="primary">▽</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <p class="font-setting">定时</p>
          <div class></div>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model="settings.hours" controls-position="right" @change="handle_hour_change" :min=0
            :max="24" placeholder="小时" class="custom-input"></el-input-number>
          <el-input-number v-model="settings.minutes" controls-position="right" @change="handle_minute_change" :min=0
            :max="60" placeholder="分钟" class="custom-input"></el-input-number>
          <el-input-number v-model="settings.seconds" controls-position="right" @change="handle_second_change" :min=0
            :max="60" placeholder="秒" class="custom-input"></el-input-number>
        </el-col>
        <el-col :span="6" class="col-flex">
          <el-switch v-model="timer_on"></el-switch>
        </el-col>
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
      timer_on: false,
      indoor_temp: 25,
      conditioner_state: 0,
      mode: 0,
      settings: {
        temp: 10086,
        wind: -1,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
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
    this.axios.get("http://localhost:9151/service/conditioner/getRoomID")
      .then(res => {
        if (res.data.code != '200') {
          console.log("没有查询到该用户的订房信息！");
        } else {
          this.room_id = res.data.data;
          this.createEventSource();
          this.axios.get("http://localhost:9151/service/conditioner/status?roomID=" +
            this.room_id
          ).then((res) => {
            if (res.data.code == '200') {
              this.power_on = true;
              this.conditioner_state = 1;
              this.settings.temp = res.data.targetTemperature;
              this.settings.wind = res.data.currentWindSpeed;
            } else if (res.data.code == '501') {
              this.conditioner_state = 2;
              this.power_on = true
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
        let json = {
          roomID: this.room_id,
          userID: null,
          powerO: true,
          targetTemperature: 25,
          windSpeed: 2,
          additionalFee: 0,
          targetDuration: null,
          requestTime: this.changeTimeStr(new Date().toGMTString())
        }
        this.axios.post("http://localhost:9151/service/conditioner/turnOn", json)
          .then((res) => {
            console.log(res.data.data);
          });

      } else {
        this.axios.post("http://localhost:9151/service/conditioner/turnOff?roomID=" + this.room_id)
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

    createEventSource() {
      const that = this;
      if (window.EventSource) {
        console.log(this.room_id);
        const source = new EventSource("http://localhost:9151/service/conditioner/subscribe?roomID=" + this.room_id);
        source.onopen = (event) => {
          console.log("onopen:" + this.room_id + ": " + event)
        };
        source.onmessage = (event) => {
          console.log("收到消息:" + this.room_id + ": " + event.data);
        };
        source.onerror = (event) =>{
            console.log("onerror :"+clientId+": "+event)
        };
        source.close = (event) => { 
          console.log("close :" + this.room_id + ": " + event) 
        };
      } else {
        alert('你的浏览器不支持SSE')
      }
    },
    handle_hour_change() {

    },
    handle_minute_change() {

    },
    handle_second_change() {

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
