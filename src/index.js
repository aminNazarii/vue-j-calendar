import languages from './languages';
import calendar from './component/calendar.vue';
import moment from 'moment-jalaali';

export default {
    install (Vue, options) {
        Vue.component('calendar', calendar);

        let newOptions = {
            locale: 'fa',
            visible: false,
            languages: languages,
            format: {
                fa: {
                    YYYYMMDD: 'jYYYY-jMM-jDD',
                    Year: 'jYear',
                    Month: 'jMonth',
                    Day: 'jDay',
                    YMD: 'jYYYYjMMjDD',
                    YM: 'jYYYYjMM',
                    Y: 'jY',
                    M: 'jM',
                    MM: 'jMM',
                    MMMM: 'jMMMM',
                    D: 'jD'
                },
                en: {
                    YYYYMMDD: 'YYYY-MM-DD',
                    Year: 'Year',
                    Month: 'Month',
                    Day: 'Day',
                    YMD: 'YYYYMMDD',
                    YM: 'YYYYMM',
                    Y: 'Y',
                    M: 'M',
                    MM: 'MM',
                    MMMM: 'MMMM',
                    D: 'D'
                }
            },
        };

        if (options.languages) {
            newOptions.languages = options.languages;
        }

        if (options.locale) {
            newOptions.locale = options.locale;
        }

        if (options.visible) {
            newOptions.visible = options.visible;
        }

        Vue.prototype.$calendar = newOptions;
    }
}