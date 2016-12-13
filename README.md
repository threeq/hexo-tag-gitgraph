# hexo-tag-gitgraph
hexo 博客系统git分支图插件，以来 gitgraph.min.js 库

# 使用方式

1. 安装 hexo-tag-gitgraph

```
npm intall https://github.com/threeq/hexo-tag-gitgraph.git --save
```

2. 将 `gitgraph.min.js`和`gitgraph.css` 加入到你的博客系统中，注意需要加载`head`标签中

3. 使用 js 语法进行分支描述

```

{% gitgraph %}
function message(msg) {
    return {
        messageDisplay:!!msg,
        message: msg
    }
}

function commit() {
    return {
      dotColor: "white",
      dotSize: 10,
      dotStrokeWidth: 10,
      sha1: "666",
      message: "Pimp dat commit",
      author: "Jacky <prince@dutunning.com>",
      tag: "a-super-tag",
      onClick: function(commit) {
        console.log("Oh, you clicked my commit?!", commit);
      }
    };
}

function tagRC(tag, msg) {
    return {
        dotColor: "gray",
        dotStrokeWidth: 7,
        message:!msg?" ":msg,
        tag:tag,
        tagColor:'gray'
    }
}

function tag(tag, msg) {
    return {
        dotColor: "yellow",
        dotStrokeWidth: 10,
        message:!msg?" ":msg,
        tag:tag
    }
}

function branch(name, parent, col) {
    return gitgraph.branch({
        parentBranch:parent,
        name:name,
        column:col
   });
}

// You can manually fix columns to control the display.

var topicCol = 0;
var featureCol = 1;
var testCol = 2;
var releaseCol = 3;
var hotfixCol = 4;
var masterCol = 5;

var master = gitgraph.branch({
    name:"master",
    column:masterCol
    });
var feature1 = gitgraph.branch({
    parentBranch:master,
    name:"feature/contact-v1.0.0",
    column:featureCol
});

master
.commit(message("master 线上主分支，所有的主线版本必须合并到master，如：v1.0.0、v1.2.0、v2.0.0 等"))
.merge(feature1, message("feature/contact-v1.0.0 通讯录v1.0.0迭代开发，这里的分支版本号必须要 tapd 里面迭代保持一致"));

feature1
.commit(message())
.commit(message());

var topic = branch("topic/#id", feature1, topicCol)

topic
.commit(message("topic/#id 开发人员个人开发使用分支, <id>：任务、功能或缺陷 id；"))
.commit(message())
.commit(message());

topic.merge(feature1, message("通过 merge 的方式合并到团队迭代开发分支 feature 上"));

feature1.commit(message());

var test_100 = gitgraph.branch({
    parentBranch: feature1,
    name: "test/contact-v1.0.0",
    column:testCol
});
master.merge(feature1, message("迭代开发完成进去测试阶段，将 master 合并到 feature 后建立相应 test 分支。删除 feature 分支"))
test_100.commit(message("测试分支bug修复，操作和原则与开发 feature 一样"));

var hotfix_101 = gitgraph.branch({
    parentBranch: master,
    name: "hotfix/v1.2.15",
    column:hotfixCol
})
.commit(message("hotfix/v1.2.15 线上修复补丁分支，用户线上紧急 bug 处理"))
.commit(message("Bug fix commit(s)"))
.commit(tagRC("v1.2.15-rc", "Start v1.2.15-rc Release Candidate builds. bug 修复完成，进入公测或灰度阶段，标记公测版本"))
.commit(message("Bug fix commit(s)"))
.merge(master, tag("v1.2.15","Release v1.2.15 tagged， bug 修复完成，确认上线，标记线上版本，删除 hotfix 分支"))
master.commit(tag("v1.2.16","其他开发组提交版本"))

test_100.commit(message(" ")).commit(message(" "));

var release_100 = gitgraph.branch({
    parentBranch: test_100,
    name: "release/v1.3.0",
    column:releaseCol
});
master.merge(test_100, message("测试完成，合并 master 到 test 分支建立 release 分支，进入公测或灰度发布阶段，删除 test 分支"));

release_100
.commit(tagRC("v1.3.0-rc","Start v1.3.0-rc Release Candidate builds. 进入公测或灰度发布，标记公测版本"))
.commit(message("Bug fix commit(s)"))
.commit(message(" "))
.merge(master, tag("v1.3.0","Release v1.3.0 tagged。公测完成，确认上线，标记线上版本，删除 release 分支"))

///////////////////////////////////////////////////
// 修复线上bug
var hotfix_101 = gitgraph.branch({
    parentBranch: master,
    name: "hotfix/v1.3.1",
    column:hotfixCol
})
.commit(message("hotfix/v1.3.1 修复上线紧急 bug"))
.commit(message("Bug fix commit(s)"))
.commit(tagRC("v1.3.1-rc", " "))
.commit(message("Bug fix commit(s)"))

// 修复完成，上线
hotfix_101.merge(master, tag("v1.3.1","Release v1.3.1 tagged"))
///////////////////////////////////////////////////


// 开始新迭代
var feature_news_150 = gitgraph.branch({
    parentBranch: master,
    name: "feature/news-v1.5.0",
    column:featureCol
});

feature_news_150.commit(message()).commit(message()).commit(message());

// 进入测试阶段
var test_news_150 = gitgraph.branch({
    parentBranch: feature_news_150,
    name: "test/news-v1.5.0",
    column:testCol
});
master.merge(feature_news_150);
test_news_150
.commit(message())
.commit(message())
.commit(message());

// 开始线上灰度
var release_200 = gitgraph.branch({
    parentBranch: test_news_150,
    name: "release/v2.0.0",
    column:releaseCol
});

master.merge(test_news_150);

release_200
.commit(message())
.commit(tagRC("v2.0.0-rc"))
.commit(message());

// 正式上线
release_200.merge(master, tag("v2.0.0","Release v2.0.0 tagged"))


{% endgitgraph %}

```

[Demo](http://blog.threeq.me/2016/12/13/hexo/hexo-tag-gitgraph/)
