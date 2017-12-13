import Vue from "vue";
window.Vue = Vue;
window._ = require('lodash');

let options = {
    locale: 'en',
    // languages: {
    //     en: {
    //         nextMonth: 'next month now',
    //         prevMonth: ' prev month now',
    //         today: 'now now'
    //     },
    // }
};

import VueJCalendar from './index';
Vue.use(VueJCalendar, options);