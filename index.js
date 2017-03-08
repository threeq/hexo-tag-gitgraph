'use strict';

var fs = require('fs');
var DrawGraph = require('./draw-graph.js');

hexo.extend.tag.register('gitgraph', function(args, content) {

    var name = args[0];
    if(!name) {
        name = uuid();
    }

    var directory = "./source";
    var file_path = "/image/auto-generate/gitgraph-" + name + ".svg";

    if (!fs.existsSync(directory+'/image/auto-generate/')) {
        fs.mkdirSync(directory+'/image/auto-generate/');
    }

    DrawGraph.drawByGitCmd(directory+file_path, content);

    return '<img src="'+file_path+'" />'; //svg 文件地址

}, {
    async: false,
    ends: true
});
