import languages from './languages';
import calendar from './component/calendar.vue';
import moment from 'moment-jalaali';

export default {
    install (Vue, options) {
        Vue.component('calendar', calendar);

        // Directives
        Vue.directive('click-outside', {
            bind: function (el, binding, vNode) {
                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`
                    }
                }
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e) => {
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