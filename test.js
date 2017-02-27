var DrawGraph = require('./draw-graph.js');

var content = " \
git commit -am 'aaaaa' \n\
git commit -m 'bbbb' \n\
git checkout -b test \n \
git checkout -b test1  \n \
git checkout -b test1 sdfsfa \n \
git checkout   test2 sdfsfa \n \
git checkout test2   dfdfsdfsfa \n \
git commit -m 'ccccc' \n \
git merge master \n \
git commit -m 'ccccc' \n \
git merge master -m 'dfdfsfsfsfa' \n \
git commit -am 'dddddd' \n \
git commit -am \"eeeee\" \n \
git tag -a v1.2.3 -m 'sfdsfsdfa' \n \
git commit -m \"fffff\" \n \
git checkout -b test2  \n \
git commit -am 'test2' \n \
git checkout master \n \
git merge test1 \n \
";

DrawGraph.drawByGitCmd("test.svg", content);
