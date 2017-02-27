# hexo-tag-gitgraph

hexo 博客系统git分支图插件

依赖：
[gitgraph.js](https://github.com/nicoespeon/gitgraph.js) 库
[node-cnavas](https://github.com/Automattic/node-canvas) 库
[jsdom](https://github.com/tmpvar/jsdom) 库

注意：由于 `gitgraph.js` 本身不支持 `node` 环境执行，所以对其源代码有所更改。

# 使用方式

1. 安装 hexo-tag-gitgraph

```
npm intall https://github.com/threeq/hexo-tag-gitgraph.git --save
```

2. 使用标准 `git` 命令描述

目前支持的git命令如下：

        git commit -m ''
        git commit -am ''
        git checkout -b <branch_name>
        git checkout <branch_name>
        git merge <branch_name>
        git merge <branch_name> -m ''
        git tag -[a|s|u] <tag_name> -m ''

使用方式:

```

{% gitgraph %}

git commit -am 'aaaaa'
git commit -m 'bbbb'
git checkout -b test
git checkout -b test1  
git checkout -b test1 sdfsfa
git checkout   test2 sdfsfa
git checkout test2   dfdfsdfsfa
git commit -m 'ccccc'
git merge master
git commit -m 'ccccc'
git merge master -m 'dfdfsfsfsfa'
git commit -am 'dddddd'
git commit -am \"eeeee\"
git tag -a v1.2.3 -m 'sfdsfsdfa'
git commit -m \"fffff\"
git checkout -b test2  
git commit -am 'test2'
git checkout master
git merge test1

{% endgitgraph %}

```

效果：

<img src="https://raw.githubusercontent.com/threeq/hexo-tag-gitgraph/master/test.svg" />

[Demo](http://blog.threeq.me/2016/12/13/hexo/hexo-tag-gitgraph/)
