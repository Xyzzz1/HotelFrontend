import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import findroom from "../views/login.vue";

var CtrlSwitch = true;

const routes = [
  {
    path: '/',
    name: '',
    component: findroom,
    meta: {
      title: "酒店客房预订系统"
    },
  },
  {
    path: "/index",
    name: "index",
    component: () => import('@/views/index.vue'),
    meta: {
      title: "酒店客房预订系统"
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import('@/views/login.vue'),
    meta: {
      title: "酒店客房预订系统-登录"
    }
  },
  {
    path: "/resetpswd",
    name: "resetpswd",
    component: () => import('@/views/resetpswd.vue'),
    meta: {
      title: "酒店客房预订系统-重置密码"
    }
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: () => import('@/views/reservation.vue'),
    meta: {
      title: "酒店客房预订系统-订房"
    },
  },
	{
	  path: '/reservation-c',
	  name: 'reservation-c',
	  component: () => import('@/views/reservation-custom.vue'),
	  meta: {
	    title: "酒店客房预订系统-订房"
	  },
	},
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/views/mine.vue'),
    meta: {
      title: "酒店客房预订系统-我的"
    },
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/roomdetail.vue'),
    meta: {
      title: "酒店客房预订系统-客房详情"
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search.vue'),
    meta: {
      title: "酒店客房预订系统-客房详情"
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue'),
    meta: {
      title: "酒店客房预订系统-注册"
    },
  },
  {
    path: '/changepswd',
    name: 'changepswd',
    component: () => import('@/views/changepswd.vue'),
    meta: {
      title: "酒店客房预订系统-更改密码"
    },
  },
  {
    path: '/submitok',
    name: 'submitok',
    component: () => import('@/views/submitok.vue'),
    meta: {
      title: "订单提交成功"
    },
  },
  {
    path: '/submitfail',
    name: 'submitfail',
    component: () => import('@/views/submitfail.vue'),
    meta: {
      title: "订单提交失败"
    },
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/views/service.vue'),
    meta:{
      title: "酒店客房服务"
    },
    children:[
      {
        path: '/service/checkinfo',
        name: 'checkinfo',
        component: () => import('@/views/checkinfo.vue'),
        meta: {
          title: "酒店客房预订系统-个人信息"
        },
      },
      {
        path: '/service/myroom',
        name: 'myroom',
        component: () => import('@/views/sub_item/myroom.vue'),
        meta:{
          title: "酒店客房服务-我的房间"
        },
      },
      {
        path: '/service/conditioner',
        name: 'conditioner',
        component: () => import('@/views/sub_item/conditioner.vue'),
        meta:{
          title: "酒店客房服务-空调遥控"
        },
      },
      {
        path: "login",
        name: "login",
        component: () => import('@/views/login.vue'),
        meta: {
          title: "酒店客房预订系统-登录once again"
        }
      },
      {
        path: '/service/history',
        name: 'history',
        component: () => import('@/views/history.vue'),
        meta: {
          title: "酒店客房预订系统-历史订单"
        },
      },
      {
        path: "/service/logout",
        name: "login",
        component: () => import('@/views/logout.vue'),
        meta: {
          title: "酒店客房预订系统-登出"
        }
      },
      {
        path: "/service/resetpswd",
        name: "resetpswd",
        component: () => import('@/views/resetpswd.vue'),
        meta: {
          title: "酒店客房预订系统-重置密码"
        }
      },
      {
        path: '/service/contact',
        name: 'contact',
        component: () => import('@/views/contact.vue'),
        meta: {
          title: "酒店客房预订系统-联系我们"
        },
      },
    ]
  },
];

const router = new VueRouter({
  routes
})

export default router


/* 
//权限判断，如果未登录就跳转到登录页
  beforeEnter(to,from,next) {
    if (!CtrlSwitch) {
      next()
      return
    }
    let token=localStorage.userName
    if (token!=""&&token!=undefined) {
      next()
    }else{
      console.log("未登录，无权限")
      next('/login')
    }
  }
*/
