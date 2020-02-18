
import PopupComponent from './slide-verify.vue'
let $vm
export const factory = (Vue)=> {
  if (!$vm) {
    let Popup = Vue.extend(PopupComponent)
    $vm = new Popup({
      el: document.createElement('div')
    })
    document.body.appendChild($vm.$el)
  }
  return $vm
}