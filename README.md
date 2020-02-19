# slidevertify

> A slidevertify plugin for vue

## 安装插件

```
npm install slideVerify
```
## 引入插件 

```
import slideVerify from 'slideVerify'
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
import { slideVerify } from '@/plugins/slideVerify'
slideVerify.open({
    showClose:false,
    success:() => {
    alert('验证成功');
  }
})
```
        
## demo地址
[预览demo](https://elevemonkey.github.io/slide-vertify/dist/index.html#/)
