var fs = require('fs');
var Canvas = require('canvas');
var GitGraph = require('./gitgraph').GitGraph;
var jsdom = require("jsdom");

/**
 * 基础配置
 * @type {GitGraph}
 */
var graphConfig = new GitGraph.Template({
    branch: {
        color: "#000000",
        lineWidth: 3,
        spacingX: 60,
        mergeStyle: "straight",
        showLabel: true,
        labelFont: "normal 10pt Arial"
    },
    commit: {
        spacingY: -30,
        dot: {
            size: 8,
            strokeColor: "#000000",
            strokeWidth: 4
        },
        tag: {
            font: "normal 10pt Arial",
            color: "yellow"
        },
        message: {
            color: "black",
            font: "normal 12pt Arial",
            displayAuthor: false,
            displayBranch: true,
            displayHash: true,
        }
    },
    arrow: {
        size: 8,
        offset: 3
    }
});

/**
 * 构造消息
 * @param  {string} msg 消息
 * @return {object}     消息定义对象
 */
function message(msg) {
    return {
        messageDisplay: !!msg,
        message: msg
    }
}

/**
 * tag 定义对象
 * @param  {string} tag tag名称
 * @param  {sting} msg  tag消息
 * @return {string}     tag定义对象
 */
function tagRC(tag, msg) {
    return {
        dotColor: "gray",
        dotStrokeWidth: 7,
        message: !msg ? " " : msg,
        tag: tag,
        tagColor: 'gray',
        displayTagBox: false
    }
}

/**
 * tag 定义对象
 * @param  {[type]} tag [description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function tag(tag, msg) {
    return {
        dotColor: "yellow",
        tagColor: "yellow",
        dotStrokeWidth: 10,
        message: !msg ? " " : msg,
        tag: tag,
        displayTagBox: true
    }
}

/**
 *  产生新分支
 * @param  {string} name   名字名称
 * @param  {object} parent 父级分支
 * @param  {number} col    分支显示列号
 * @return {object}        分支对象
 */
function branch(name, parent, col) {
    return parent.branch(name,{
        parentBranch: parent,
        name: name,
        column: col
    });
}

/**
 * 标准消息处理，过滤双引号和单引号
 * @param  {string} msg 原始消息
 * @return {string}     标准消息
 */
function standardMsg(msg) {
    if (!msg) {
        return msg;
    }

    if (/^\s*'.*'\s*$/.test(msg)) {
        msg = msg.replace(/^\s*'/, '').replace(/'\s*$/, '');
    } else if (/^\s*".*"\s*$/.test(msg)) {
        msg = msg.replace(/^\s*"/, '').replace(/"\s*$/, '');
    }
    return msg;
}

/**
 * 根据 git 命令生成分支图
 * @param  {string} file_path 保存路径
 * @param  {string} content   git命令内容
 * @return {void}             无返回值
 */
function drawByGitCmd(file_path, content) {

    var canvas = new Canvas(400, 200, 'svg');
    var gitgraph = new GitGraph({
        //elementId: uuid,
        canvas: canvas,
        template: graphConfig,
        mode: "extended",
        orientation: "vertical"
    });
    var allBranch = {};

    var master = gitgraph.branch({
        name: "master",
        column: 0
    });

    var currentBranch = allBranch['master'] = {
        col: 0,
        branch: master
    };

    var cmds = parseCommands(content);

    for (var i = 0; i < cmds.length; i++) {
        var cmd = cmds[i];

        if(i==0 && cmd.action!='commit') {
            master.commit(message("init repo"));
        }

        if (cmd.action == 'commit') {
            currentBranch.branch.commit(message(cmd.params.msg));
        } else if (cmd.action == 'checkout') {
            if (allBranch[cmd.params.branch]) {
                currentBranch = allBranch[cmd.params.branch];
            } else {
                console.log("[" + cmd.params.branch + "] 不存在")
            }
        } else if (cmd.action == 'branch') {
            if (!allBranch[cmd.params.branch]) {
                allBranch[cmd.params.branch] = {
                    col: currentBranch.col + 1,
                    branch: branch(cmd.params.branch, currentBranch.branch, currentBranch.col + 1)
                };
            }

            currentBranch = allBranch[cmd.params.branch];
        } else if (cmd.action == 'merge') {
            var targetBranch = allBranch[cmd.params.branch].branch;
            if (!cmd.params.msg) {
                currentBranch.branch.merge(targetBranch);
            } else {
                currentBranch.branch.merge(targetBranch, cmd.params.msg);
            }
        } else if (cmd.action == 'tag') {
            // 处理标签
            currentBranch.branch.tag(tag(cmd.params.tag, cmd.params.msg));
        } else {
            console.log("不能解析命令：" + cmd.src);
        }
    }

    // 写入文件
    fs.writeFile(file_path, canvas.toBuffer(), function(err) {
        if (err) throw err;

        console.log('created ' + file_path);

    })
};

/**
 * 解析 git 命令
 * 目前支持：
 *      git commit -m ''
 *      git commit -am ''
 *      git checkout -b <branch_name>
 *      git checkout <branch_name>
 *      git merge <branch_name>
 *      git merge <branch_name> -m ''
 *      git tag -[a|s|u] <tag_name> -m ''
 *
 * @param  {string} commandsStr 完整 git 命令字符串
 * @return {array<object>}      完整 git 对象结婚
 */
function parseCommands(commandsStr) {
    var cmds = [];

    cmdLines = commandsStr.split("\n");

    for (var i = 0; i < cmdLines.length; i++) {
        var cmdStr = cmdLines[i]

        // 空行处理
        // 注视处理，不是以 git 开头的命令都认为是注视
        if(!cmdStr || !cmdStr.replace(/\s/g,'') || !/^git\s+/.test(cmdStr)) {
            continue;
        }

        if (/\s*git\s*commit.*/.test(cmdStr)) {
            // git commit -am ''
            // git commit -m ''
            var msg = cmdStr.replace(/^\s*git\s*commit\s*-[a]?m\s*/g, '');
            if (/^\s*'.*'\s*$/.test(msg)) {
                msg = msg.replace(/^\s*'/, '').replace(/'\s*$/, '');
            } else if (/^\s*".*"\s*$/.test(msg)) {
                msg = msg.replace(/^\s*"/, '').replace(/"\s*$/, '');
            }

            cmds.push({
                action: 'commit',
                params: {
                    msg: msg
                }
            })

        } else if (/\s*git\s*checkout\s*-[b|B].*/.test(cmdStr)) {
            var branch = cmdStr.replace(/\s*git\s*checkout\s*-[b|B]\s*/, '')
            branch = branch.replace(/\s+.*$/, '');
            cmds.push({
                action: 'branch',
                params: {
                    branch: branch
                }
            })
        } else if (/\s*git\s*checkout.*/.test(cmdStr)) {
            var branch = cmdStr.replace(/^\s*git\s*checkout\s*/, '')
            branch = branch.replace(/\s+.*$/, '');
            cmds.push({
                action: 'checkout',
                params: {
                    branch: branch
                }
            })
        } else if (/\s*git\s*merge\s.*/.test(cmdStr)) {
            var branch = cmdStr.replace(/^\s*git\s*merge\s*/, '');
            var msg = null;
            if (/^[^\s]+\s*-m\s*.*$/.test(branch)) {
                // has speci message
                var branch_msg = branch;
                branch = branch_msg.replace(/\s+-m\s*.*$/, '');
                msg = branch_msg.replace(/^[^\s]+\s*-m\s*/, '');

                if (/^\s*'.*'\s*$/.test(msg)) {
                    msg = msg.replace(/^\s*'/, '').replace(/'\s*$/, '');
                } else if (/^\s*".*"\s*$/.test(msg)) {
                    msg = msg.replace(/^\s*"/, '').replace(/"\s*$/, '');
                }
            } else {
                branch = branch.replace(/\s+.*$/, '');
            }

            cmds.push({
                action: 'merge',
                params: {
                    branch: branch,
                    msg: msg
                }
            })
        } else if (/\s*git\s*tag\s.*/.test(cmdStr)) {
            var tag_msg = cmdStr.replace(/\s*git\s*tag\s+/, '');

            var tag = null;
            var msg = null;
            if (/^-m\s+.*/.test(tag_msg)) {
                msg = tag_msg.replace(/^-m\s+/, '').replace(/\s+.*/, '');
                tag = tag_msg.replace(/^-m\s+/, '')
                    .replace(msg, '')
                    .replace(/\s+-[a|s|u]\s+/, '')
                    .replace(/\s+$/, '');



            } else if (/^-[a|s|u]\s+.*/.test(tag_msg)) {
                tag = tag_msg.replace(/^-[a|s|u]\s+/, '').replace(/\s+.*/, '');
                msg = tag_msg.replace(/^-[a|s|u]\s+/, '')
                    .replace(tag, '')
                    .replace(/\s+-m\s+/, '')
                    .replace(/\s+$/, '');
                msg = standardMsg(msg);
            }
            cmds.push({
                action: 'tag',
                params: {
                    tag: tag,
                    msg: msg
                }
            })
        } else {
            cmds.push({
                action: "unkown"
            })
        }

        cmds[cmds.length - 1].src = cmdStr;
    }
    return cmds;
}

module.exports = {
    drawByGitCmd:drawByGitCmd
}
