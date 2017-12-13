require('./bootstrap');

new Vue({
    name: 'date-picker',
    components: {
        layout: require('./component/layout')
    }
}).$mount('#date-picker');