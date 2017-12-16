<style lang="scss">
    @import '../../dist/css/app.css';
</style>

<template>
    <div>
        <input v-if="$calendar.locale == 'fa'" :value="selectedDay.format('jYYYY-jMM-jDD')" @click="visible = true">
        <input v-else :value="selectedDay.format('YYYY-MM-DD')" @click="visible = true">

        <div v-if="visible" v-click-outside="closeCalendar" id="vueDatePicker" class="date-picker-container"
             :class="{'direction-rtl': $calendar.locale == 'fa', 'direction-ltr': $calendar.locale != 'fa'}">
            <!--calendar header-->
            <div class="header ta-center">
                <div class="top ta-center">
                    <select v-model="selectedMonth" @change="goToMonth(selectedMonth)">
                        <option v-for="month in months" :value="month.clone().locale('en').format($calendar.format[$calendar.locale].M)" >{{month.format($calendar.format[$calendar.locale].MMMM)}}</option>
                    </select>
                </div>
                <div class="display-inb ta-right">
                    <span @click="prevMonth" class="btn-prev-month">{{calendarText.text.prevMonth}}</span>
                </div>

                <div class="display-inb ta-center">
                    <span class="month" v-if="$calendar.locale === 'fa'">{{currentDate.format('jMMMM')}}</span>
                    <span class="month"  v-else>{{currentDate.format('MMMM')}}</span>

                    <span v-if="!visibleGoToYear">
                        <span class="year" v-if="$calendar.locale === 'fa'" @click="visibleGoToYear = !visibleGoToYear"> {{currentDate.format('jYYYY')}} </span>
                        <span class="year" v-else @click="visibleGoToYear = !visibleGoToYear"> {{currentDate.format('YYYY')}} </span>
                    </span>

                    <input v-if="visibleGoToYear" v-click-outside="closeGoToYear" v-model="year" v-on:keyup.13="goToYear" type="number" class="input-year" min="1300" autofocus>

                </div>

                <div class="display-inb ta-left">
                    <span @click="nextMonth" class="btn-next-month">{{calendarText.text.nextMonth}}</span>
                </div>
            </div>

            <!--calendar body-->
            <table class="body">
                <tr>
                    <td class="weekday" v-for="titles in calendarText.dayTitles">
                        {{less(titles)}}
                    </td>
                </tr>
                <tr v-for="week in monthDays" class="row">
                    <td v-for="day in week" class="cell" @click="selectDay(day.date)"
                        :class="{
                            'selected': day.date.format('YYYYMMDD') == currentDate.format('YYYYMMDD'),
                            'holiday': day.holiday,
                            'disable': day.disabled,
                            'disabled-holiday': day.holiday && day.disabled,
                            'today': day.date.format('YYYYMMDD') === momentNow.format('YYYYMMDD')
                        }">
                        <span v-if="$calendar.locale === 'fa'">{{day.date.format('jD')}}</span>
                        <span v-else>{{day.date.format('D')}}</span>
                    </td>
                </tr>
            </table>
            <div class="footer">
                <span @click="goToday" class="btn-today">{{calendarText.text.today}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment-jalaali';

    export default {
        name: 'calendar',
        data() {
            return {
                calendarText: [],
                monthDays: [],
                selectedDay: moment(),
                months: [],
                year: null,
                currentDate: moment(),
                visible: false,
                selectedMonth: null,

                visibleGoToYear: false,
            }
        },
        props: [
            'default',
        ],
        computed: {
            momentNow() {
                return moment();
            }
        },
        created() {
            moment.locale(this.$calendar.locale);
            if (this.$calendar.locale === 'fa') {
                moment.loadPersian({
                    dialect: 'persian-modern',
                    usePersianDigits: false
                });
            }

            let starterDay = moment();
            if (this.default) {
                if(typeof this.default === 'string'){
                    starterDay = moment(this.default, this.$calendar.format[this.$calendar.locale].YYYYMMDD);
                }else{
                    starterDay = this.default;
                }
            }

            //get year month
            this.selectedMonth = starterDay.format(this.$calendar.format[this.$calendar.locale].MM);
            let monthSelectionItems = moment().startOf(this.$calendar.format[this.$calendar.locale].Year);
            let endOfYear = monthSelectionItems.clone().endOf(this.$calendar.format[this.$calendar.locale].Year);

            while (monthSelectionItems.format(this.$calendar.format[this.$calendar.locale].YM) <= endOfYear.format(this.$calendar.format[this.$calendar.locale].YM)) {
                this.months.push(monthSelectionItems.clone());
                monthSelectionItems.add(1, this.$calendar.format[this.$calendar.locale].Month)
            }

            starterDay.locale(this.$calendar.locale);
            this.selectDay(starterDay);
            this.calendarText = this.weekDayTitles();
            this.getMonthDays();
        },
        methods: {
            init() {
                this.currentDate = moment();
                moment.locale(this.$calendar.locale);
            },
            getMonthDays() {
                this.getCurrentMonth();
                this.getPrevMonth();
                this.getNextMonthDays();

                this.monthDays = _.chunk(this.monthDays, 7);
            },
            nextMonth() {
                this.currentDate.add(1, this.$calendar.format[moment.locale()].Month);
                this.getMonthDays();
            },
            prevMonth() {
                this.currentDate.subtract(1, this.$calendar.format[moment.locale()].Month);
                this.getMonthDays();
            },
            getCurrentMonth() {
                this.monthDays = [];
                let monthDays = this.currentDate.clone().startOf(this.$calendar.format[moment.locale()].Month).subtract(1, 'd');

                while (this.currentDate.clone().endOf(this.$calendar.format[moment.locale()].Month).format(this.$calendar.format[moment.locale()].YMD) !== monthDays.format(this.$calendar.format[moment.locale()].YMD)) {
                    monthDays.add(1, 'd');
                    this.monthDays.push({
                        disabled: false,
                        holiday: this.checkForHoliday(monthDays),
                        date: monthDays.clone()
                    });
                }
            },
            getPrevMonth() {
                let startOfPrevMonth = this.currentDate.clone().startOf(this.$calendar.format[moment.locale()].Month);
                if (this.$calendar.locale === 'fa' && startOfPrevMonth.days() !== 6) {
                    this.getPrevMonthDays(startOfPrevMonth);
                }
                if (this.$calendar.locale !== 'fa' && startOfPrevMonth.days() > 0) {
                    this.getPrevMonthDays(startOfPrevMonth);
                }
            },
            getPrevMonthDays(startOfPrevMonth) {
                let startOfPrevMonthDays = startOfPrevMonth.days();
                if (this.$calendar.locale === 'fa') {
                    startOfPrevMonthDays = startOfPrevMonth.days() + 1;
                }

                let prevMonthStart = startOfPrevMonth.clone().subtract(startOfPrevMonthDays, 'd');
                let prevMonthDay = prevMonthStart.clone().endOf(this.$calendar.format[moment.locale()].Month).add(1, 'd');
                while (prevMonthStart.format(this.$calendar.format[moment.locale()].YMD) !== prevMonthDay.format(this.$calendar.format[moment.locale()].YMD)) {
                    prevMonthDay.subtract(1, 'd');
                    this.monthDays.unshift({
                        disabled: true,
                        holiday: this.checkForHoliday(prevMonthDay),
                        date: prevMonthDay.clone()
                    });
                }
            },
            getNextMonthDays() {
                let nextMonthStart = this.currentDate.clone().endOf(this.$calendar.format[moment.locale()].Month).add(1, 'd');
                while (this.monthDays.length % 7 !== 0) {
                    this.monthDays.push({
                        disabled: true,
                        holiday: this.checkForHoliday(nextMonthStart),
                        date: nextMonthStart.clone()
                    });
                    nextMonthStart.add(1, 'd');
                }
            },
            checkForHoliday(singleDate) {
                if (moment.locale() === 'fa') {
                    if (singleDate.days() === 5)
                        return true;
                    return false
                }

                if (singleDate.days() === 0)
                    return true;
                return false;
            },
            selectDay(day) {
                this.currentDate = day;
                this.selectedDay = this.currentDate;
                this.$emit('change', this.currentDate)
            },
            goToday() {
                this.init();
                this.getMonthDays();
            },
            goToMonth(month) {
                if (this.$calendar.locale === 'fa') {
                    this.currentDate.jMonth(parseInt(month)-1);
                } else  {
                    this.currentDate.month(parseInt(month)-1);
                }
                this.getMonthDays();
            },
            goToYear() {
                if (!moment(this.year + '/1/1',).isValid() || !this.year) {
                    return false;
                }

                if (this.$calendar.locale === 'fa') {
                    this.currentDate = moment(this.year + '/1/1', 'jYYYY/jMM/jDD'); //jalali
                } else {
                    this.currentDate.set('year', this.year); //georgian
                }
                this.getMonthDays();
                this.visibleGoToYear = false;
            },
            closeGoToYear() {
                this.visibleGoToYear = false;
            },
            less(value) {
                return value.substr(0, 3);
            },
            getPersianMonthName(name) {
                let monthNames = {
                    Farvardin: 'فروردین',
                    Ordibehesht: 'اردیبهشت',
                    Khordaad: 'خرداد',
                    Tir: 'تیر',
                    Amordaad: 'مرداد',
                    Shahrivar: 'شهریور',
                    Mehr: 'مهر',
                    Aabaan: 'آبان',
                    Aazar: 'آذر',
                    Dey: 'دی',
                    Bahman: 'بهمن',
                    Esfand: 'اسفند'
                };

                return _.find(monthNames, function (monthName, monthKey) {
                    return monthKey === name;
                });
            },
            /**
             * return days title as given locale
             *
             * @returns {Array}
             */
            weekDayTitles() {
                let weekDays = moment()._locale._weekdays;

                if (moment.locale() === 'fa') {
                    weekDays = _.initial(weekDays);
                    weekDays.unshift(moment().day(6).format('dddd'))
                }

                let calendarText = [];
                if (this.$calendar.languages[moment.locale()]) {
                    calendarText = this.$calendar.languages[moment.locale()]
                } else {
                    calendarText = this.$calendar.languages.en;
                }

                return {
                    dayTitles: weekDays,
                    text: calendarText
                };
            },
            closeCalendar() {
                this.visible = false;
            },
        }
    }
</script>