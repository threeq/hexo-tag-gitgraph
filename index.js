'use strict';

var DrawGraph = require('./draw-graph.js');

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

hexo.extend.tag.register('gitgraph', function(args, content) {

    var uuid = guid();

    var directory = "./source"
    var file_path = "/image/gitgraph-" + uuid + ".svg"

    DrawGraph.drawByGitCmd(directory+file_path, content);

    return '<img src="'+file_path+'" />'; //svg 文件地址

}, {
    async: false,
    ends: true
});
