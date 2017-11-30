const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

if(process.env.type=="build"){
    var website = {
        publicPath:"https://www.google.com:2233/"//上线
    }
}else{//开发
    var website = {
        publicPath:"http://192.168.88.144:2233/"
        // 最后加 / 是为了能让图片加载出来 防止找不到路径(图片大小大于5000B 所以不用base64编码 line:44)
    }
}

module.exports={
    devtool:'eval-source-map',
    // entry:entry.path,
    entry:{
        entry:'./src/entry.js',
        jquery:'jquery',
        vue:"vue"
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        // filename:'bundle.js',
        filename:'[name].js',
        publicPath:website.publicPath
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                // use:['style-loader','css-loader'],
                use:extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:[{
                        loader:"css-loader",
                        options:{importLoaders:1}
                    },
                "postcss-loader"]
                //     loader:"style-loader",
                //     // module:true
                // },{
                //     loader:"css-loader"
                })
                // include:/exclude:
                // query
            },
            {
                test:/\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:5000,
                        outputPath:'images/'//不起作用?
                    }
                }]
            },
            {
                test:/\.(html|htm)$/i,
                use:['html-withimg-loader']
            },
            {
                test:/\.less$/,
                // use:[{
                //     loader:"style-loader"
                // },{
                //     loader:"css-loader"
                // },{
                //     loader:"less-loader"
                // }]
                use:extractTextPlugin.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"less-loader"
                    }],
                    fallback:"style-loader"
                })
            },
            {
                test:/\.scss/,
                // use:[{
                //     loader:"style-loader"
                // },{
                //     loader:"css-loader"
                // },{
                //     loader:"sass-loader"
                // }]
                use:extractTextPlugin.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"sass-loader"
                    }],
                    fallback:"style-loader"
                })
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:"babel-loader",
                },
                exclude:/node_modules/
            }
        ]
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name:["jquery","vue"],//入口文件的jquery单独抽离
            filename:"assets/js/[name].min.js",//抽离路径
            minChunks:2
        }),
        new webpack.ProvidePlugin({
            $:"jquery",
            // "vue":"vue"
        }),
        // new uglify()
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template: './src/index.html'
        }),
        new extractTextPlugin("css/index.css"),
        new PurifyCSSPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),
        new webpack.BannerPlugin('2hz4917版权所有'),
        new copyWebpackPlugin([{
            from:__dirname+'/src/public',
            to:'./public'
        }]),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        contentBase: path.resolve(__dirname,'dist'),
        host:'192.168.88.144',
        compress:true,
        port:2233
    },
    watchOptions:{
        poll: 1000,//监测修改的时间 (ms)
        aggregateTimeout: 500,//防止重复按键
        ignored: /node_modules/, //忽略打包的文件
    }
}