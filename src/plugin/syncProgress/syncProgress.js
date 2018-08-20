import SyncProgress  from './syncProgress.vue';
let $vm

export default {
  install (Vue, options) {
    if (!$vm) {
      const SyncProgressPlugin = Vue.extend(SyncProgress)

      $vm = new SyncProgressPlugin({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    $vm.show = false

    let syncprogress = {
      show (text) {
        $vm.show = true

        $vm.text = text
      },
      hide () {
        $vm.show = false
      }
    }

    if (!Vue.$syncProgress) {
      Vue.$syncProgress = syncprogress
    }
    // Vue.prototype.$syncProgress = Vue.$syncProgress;
    Vue.mixin({
      created() {
        this.$syncProgress = Vue.$syncProgress;
      },
    })
  }
}