# vue-j-calendar
vuejs date time picker 

## Installation
You can install it via [yarn](https://yarnpkg.com/) or [NPM](http://npmjs.org/).

```bash
$ npm install vue-j-calendar --save

$ yarn add vue-j-calendar
```

## Configuration
```js
import Vue from "vue";
window.Vue = Vue;

//options is optional

let options = {
    locale: 'fa',
    languages: {
        fa: {
            nextMonth: 'ماه بعد',
            prevMonth: ' ماه قبل',
            today: 'الان'
        },
    }
};

import VueJCalendar from 'vue-j-calendar';
Vue.use(VueJCalendar, {options});
```

## Usage
```js
<template>
    <div>
        <div>{{selectedDay.format('jYYYY-jMM-jDD')}}</div>
        <calendar :default="currentDate" @change="selectDay"></calendar>
    </div>
</template>


<script>
    export default {
        name: 'layout',
        data() {
            return {
                //also => currentDate: moment()
                currentDate: '1399-09-14', //[optional] if you set this current day set default
                selectedDay: null,
            }
        },
        methods: {
            selectDay(day) {
                this.selectedDay = day;
            },
        }
    }
</script>
```
