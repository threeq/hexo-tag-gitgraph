
'use strict';

var fs = require('hexo-fs');
var Promise = require('bluebird');
var process = require('child_process');

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


hexo.extend.tag.register('gitgraph', function (args, content) {

    return new Promise(function (resolve, reject) {
        var uuid = guid();
        var canvas = '<canvas id="'+uuid+'"></canvas>';
        var jscode = '<script> \
        (function (win) { \
            if(!win.graphConfig) { \
                win.graphConfig = new GitGraph.Template({ \
                    branch: { \
                        color: "#000000", \
                        lineWidth: 3, \
                        spacingX: 60, \
                        mergeStyle: "straight", \
                        showLabel: true,          \
                        labelFont: "normal 10pt Arial" \
                    },\
                    commit: {\
                        spacingY: -30, \
                        dot: { \
                            size: 8,\
                            strokeColor: "#000000",\
                            strokeWidth: 4\
                        },\
                        tag: {\
                            font: "normal 10pt Arial",\
                            color: "yellow"\
                        },\
                        message: {\
                            color: "black",\
                            font: "normal 12pt Arial",\
                            displayAuthor: false,\
                            displayBranch: false,\
                            displayHash: false,\
                        }\
                    },\
                    arrow: {\
                        size: 8,\
                        offset: 3\
                    }\
                });\
            } \

            var gitgraph = new GitGraph({ \
              elementId:'+uuid+', \
              template: win.graphConfig, \
              mode: "extended", \
              orientation: "vertical" \
            }); \
            '+content+' \
        }(window)); \
        </script>'
        resolve(canvas+jscode);
    }).then(function (data) {
            return data;
        }, function (err) {
            return err;
        });

}, {async: true, ends: true});
