import css from './css/index.css';
import less from './css/black.less';
import sass from './css/bb.scss';
import abc from './abc';
// import $ from 'jquery';//优化不好 建议在config.js中引用
{
   let string = "Hello Webpack!";
   document.getElementById('title').innerHTML = string;

}
// abc();
$('#title').html("Hello 2017-December")

var json = require('../config.json');
$("#json").html(json.name+":website:"+json.website);