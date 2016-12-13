
'use strict';

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


hexo.extend.tag.register('gitgraph', function (args, content) {

    var uuid = guid();
    var canvas = '<div style="overflow-x: auto;"><canvas id="'+uuid+'"></canvas></div>';
    var jscode = '<script> \n'+
'    (function (win) { \n'+
'        if(!win.graphConfig) { \n'+
'            win.graphConfig = new GitGraph.Template({ \n'+
'                branch: { \n'+
'                    color: "#000000", \n'+
'                    lineWidth: 3, \n'+
'                    spacingX: 60, \n'+
'                    mergeStyle: "straight", \n'+
'                    showLabel: true,          \n'+
'                    labelFont: "normal 10pt Arial" \n'+
'                },\n'+
'                commit: {\n'+
'                    spacingY: -30, \n'+
'                    dot: { \n'+
'                        size: 8,\n'+
'                        strokeColor: "#000000",\n'+
'                        strokeWidth: 4\n'+
'                    },\n'+
'                    tag: {\n'+
'                        font: "normal 10pt Arial",\n'+
'                        color: "yellow"\n'+
'                    },\n'+
'                    message: {\n'+
'                        color: "black",\n'+
'                        font: "normal 12pt Arial",\n'+
'                        displayAuthor: false,\n'+
'                        displayBranch: false,\n'+
'                        displayHash: false,\n'+
'                    }\n'+
'                },\n'+
'                arrow: {\n'+
'                    size: 8,\n'+
'                    offset: 3\n'+
'                }\n'+
'            });\n'+
'        } \n'+
'        var gitgraph = new GitGraph({ \n'+
'          elementId:"'+uuid+'", \n'+
'          template: win.graphConfig, \n'+
'          mode: "extended", \n'+
'          orientation: "vertical" \n'+
'        }); \n'+
'        '+content+' \n'+
'    }(window)); \n'+
'    </script>';

    return canvas+jscode;

    // return new Promise(function (resolve, reject) {
    //
    //     resolve(canvas+jscode);
    // }).then(function (data) {
    //         return data;
    //     }, function (err) {
    //         return err;
    //     });

}, {async: false, ends: true});
