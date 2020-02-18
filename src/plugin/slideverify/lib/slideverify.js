import { factory } from "./slideVm"

const setProps = ($vm, options) => {
  const defaults = {}
  Object.keys($vm.$options.props).forEach(k => {
    defaults[k] = $vm.$options.props[k].default
  })
  const _options = Object.assign({}, defaults, options)
  for (let i in _options) {
    $vm.$props[i] = _options[i];
  }
}

let $vm
const libs = {
  open (options) {
    setProps($vm, options)
    //监听事件
    $vm.$off("success");
    $vm.$off("cancel");
    typeof options.success === 'function' && $vm.$once('success', options.success)
    typeof options.cancel === 'function' && $vm.$once('cancel', options.cancel)
    $vm.show()
  },
  hide() {
    $vm.close();
    $vm.$off("success");
    $vm.$off("cancel");
  },
  //只配置文字
  text(sliderText) {
    this.open({ sliderText });
  }
};

export default {
  install(Vue) {
    $vm = factory(Vue);
    Vue.prototype.$slideVerify = libs;
  }
};

export { libs as slideVerify };
