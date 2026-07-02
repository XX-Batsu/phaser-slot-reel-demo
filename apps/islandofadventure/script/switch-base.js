// 切換 workspace 內 slot-base 的 package.json main 欄位。
// 用法：node script/switch-base.js src   或   node script/switch-base.js lib
const fs = require('fs');
const path = require('path');

const target = process.argv[2] === 'lib' ? 'lib/index.js' : 'src/index.js';
const pkgPath = path.join(__dirname, '..', 'node_modules', 'slot-base', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.main = target;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log('slot-base main =>', target);
