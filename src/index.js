import languages from './languages';
import calendar from './component/calendar.vue';

export default {

    install: function (Vue, options) {
        Vue.component('calendar', calendar);

        // Directives
        Vue.directive('click-outside', {
            bind: function (el, binding, vNode) {
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = function (e) {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                };
                el.__vueClickOutside__ = handler;

                // add Event Listeners
                document.addEventListener('click', handler)
            },

            unbind: function (el, binding) {
                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__);
                el.__vueClickOutside__ = null
            }
        });

        Vue.prototype.$calendar = {
            locale: 'fa',
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

        if (_.has(options, 'languages')) {
            Vue.prototype.$calendar.languages = options.languages;
        }

        if (_.has(options, 'locale')) {
            Vue.prototype.$calendar.locale = options.locale;
        }
    }
}
