# slidevertify

> A slidevertify plugin for vue

## 安装插件
```
npm install slideverify
```
## 引入插件 
```
import slideVerify from 'slideverify'
Vue.use(slideVerify)
```
## 用法
用法1

```
this.$slideVerify.open({
  showClose:true,
  sliderText:'快拖我呀！',
  cancel:()=>{
    console.log('取消验证')
  },
  success:() => {
    alert('验证成功');
  }
})
```
用法2
```
import { slideVerify } from 'slideverify'
slideVerify.open({
    showClose:false,
    success:() => {v
    alert('验证成功');
  }
})
```
        
## demo地址
[预览demo](https://elevemonkey.github.io/slide-vertify/dist/index.html#/)
