<template>
    <div>
        <div v-if="selectedDay">{{selectedDay.format('YYYY-MM-DD')}}</div>
        <calendar :default="currentDate" @change="selectDay"></calendar>
    </div>
</template>


<script>
    import moment from 'moment-jalaali';
    export default {
        name: 'layout',
        data() {
            return {
                currentDate: moment(), //optional if you set this current day set default or other date
                selectedDay: moment(), // set today for selected day
            }
        },
        methods: {
            selectDay(day) {
                this.selectedDay = day;
            },
        }
    }
</script>