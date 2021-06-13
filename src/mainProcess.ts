const path = require('path');
const fs = require('fs');

// 去除/并转化为小驼峰
const camelCase = (str) =>
    str.replace(
        /([^\/])(?:\/+([^\/]))/g,
        ($0, $1, $2) => $1 + $2.toUpperCase()
    );

module.exports = {
    create(fileName: string) {
        const output = path.join(path.dirname(fileName), './apis');
        // 创建目录
        if (!fs.existsSync(output)) {
            fs.mkdirSync(output);
        }
        const { tags, paths } = require(fileName),
            results: any = [];

        // 处理数据
        tags.map((tag: any) => {
            const resultsItem = {
                name: tag.name,
                description: tag.description,
                api: [],
            };
            Object.keys(paths).forEach((item) => {
                for (let k in paths[item]) {
                    if (paths[item][k].tags[0] === resultsItem.name) {
                        resultsItem.api.push({
                            method: k,
                            url: item,
                            summary: paths[item][k].summary,
                            // parameters: paths[item][k].parameters
                            //     .filter((item) => item.in === 'path')
                            //     .map((item) => item.name),
                        });
                    }
                }
            });
            results.push(resultsItem);
        });

        // 生成请求代码
        results.forEach((item: any) => {
            let code = "import request from './request'\n";
            item.api.forEach((item: any) => {
                let ap = item.url;
                // TODO: 数据在之前处理到位
                // TODO: 正则:  /{ }
                const symbol = ap.indexOf('/{') !== -1 ? 1 : 0;

                const url = symbol ? ap.split('/{') : ap.split('/:');
                const arg = symbol
                    ? url
                          .slice(1)
                          .join(',')
                          .substr(0, symbol - 1)
                    : url.slice(1).join(',');
                const fnName = camelCase(item.method + url[0]);
                const pa = item.method === 'get' ? 'params' : 'data';

                url.slice(1).forEach((it) => {
                    ap = symbol
                        ? ap.replace(`{${it}`, `\${${it}`)
                        : ap.replace(`:${it}`, `\${${it}}`);
                });
                // TODO: 抽取模版方法
                code += `// ${item.summary}\nexport const ${fnName} = (${
                    arg ? arg + ', ' : ''
                }${pa}) => request.${item.method}(\`${ap}\`, ${
                    pa === 'params' ? `{${pa}}` : pa
                })\n`;
            });

            //  写入文件
            fs.writeFile(
                path.join(output, `${item.description || item.name}.js`),
                code,
                function (err) {
                    // const spinner = ora(
                    //     `${item.description || item.name}.js`
                    // ).start();
                    // if (err) {
                    //     // console.log(err);
                    //     spinner.fail();
                    //     return;
                    // }
                    // setTimeout(() => {
                    //     spinner.succeed();
                    // }, 500);
                    // console.log(`${item.description || item.name}.js => success!`);
                }
            );
        });

        // 生成axios
        fs.readFile(path.join(__dirname, './request.txt'), (err, data) => {
            if (err) throw err;
            fs.writeFile(
                path.join(output, 'request.js'),
                data,
                'utf-8',
                function () {}
            );
        });
    },
};
