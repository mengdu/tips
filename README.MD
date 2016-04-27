### tips.js
> tips.js 是一个小贴士工具，可以在网页中用来提示信息;无需任何其他插件支持。

![image](https://github.com/mengdu/tips/raw/master/jietu.png)

### 使用教程
###### 必须文件：
  + tips.js        
  + tips.min.css

注：tips用了些小图标在tips.min.css文件是通过dataURL的，所以，如果想直接引用images下的图标，可以使用tips.css文件。

###### 引入：
  ```
  <link rel="stylesheet" type="text/css" href="./css/tips.min.css">
  <script type="text/javascript" src="./js/tips.js"></script>

  ```
###### 创建对象：
```
  var t=tips(options);//返回tips对象
```
tips([options]);返回值tips实例
###### options参数：
  options是一个json参数,是可选的。

  + type string tips的类型，支持defalut、success、error、warning种类型
  + autoheidden bool 自动隐藏，默认true；如果为false 将需要鼠标点击关闭按钮tips才会关闭
  + showtime int 显示时间，单位毫秒(不需要带单位)，默认3000
  + position string	显示位置top-left top-center top-right bottom-left bottom-center bottom-right center-center七种类型
  + css json 设置tips样式(不推荐，容易使tips动画失效)

###### 例子：

```
t2=tips({
  autohidden:false,					
  type:'error',							
  position:'center-center',	//显示在浏览器中间
  css:{											
    margin:"10px",
    "max-width":"300px"
  }
});
```
>详细例子请看目录里的demo.html文件

### 浏览器兼容

> tips使用了css3的transition动画及事件监听来实现动画效果，所以一些浏览器并不支持，比如ie10

### 关于
