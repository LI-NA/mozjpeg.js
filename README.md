# Mozjpeg.js
Mozjpeg.js is the port of [mozjpeg](https://github.com/mozilla/mozjpeg) in javascript using [emscripten](https://github.com/kripken/emscripten). You can process jpeg file using cjpeg, djpeg and jpegtran. You can also otimize image loss / lossless in the browser.

Tip: Mozjpeg version is Tag 1.5.3 (I just clone git. Check [this tree](https://github.com/mozilla/mozjpeg/tree/b85de60a9f2bc27b9a98a7c2ec0e6ce742099d44)).

## API

### `cjpeg(file, options, printFunction)`

#### `file`
Please use binary file like readFile on node or Uint8Array (converted from base64) on javascript.
```javascript
// Node.js
var input = fs.readFileSync("input.jpg");
var output = mozjpeg.cjpeg(input, ["-quality", "85"]);
```
```javascript
// Browser
function dataURLtoUint8(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
}
function readFile (file, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var ary = dataURLtoUint8(this.target.result);
        callback(ary);
    };
    fileReader.readAsDataURL(file);
}

var input, output;
readFile(your_file_on_here, function(ary) {
    input = ary;
    output = cjpeg(input, ["-quality", "85"]);
    // do something with output
});
```

#### `options`
Options can be array or object. Please check [this document](https://github.com/mozilla/mozjpeg/blob/master/usage.txt) to learn about mozjpeg optinos.
```javascript
var options = ["-quality", "85", "-optimize", "-progressive"];
var options = {quality: "85", optimize: true, progressive: true};
// Both options is same options. If use boolean in value, value will be ignored and only key will be inserted as options.
```

#### `printFunction`
This callback function is optional. It will be called if mozjpeg will print something on stdout or stderr.
```javascript
mozjpeg.cjpeg(input, ["-quality", "85"], function(str) {
    console.log(str);
});
```

#### `return`
```javascript
output = {
    data: [output file],
    stdout: [output string],
    stderr: [error string]
};
```

### `djpeg(file, options, printFunction)`

Those argument is same as cjpeg.

### `jpegtran(file, options, printFunction)`

Those argument is same as cjpeg.

### Node.js

If you are using node.js, you can use like below.
```javascript
var mozjpeg = require("js-mozjpeg");
// ~~~
var output_cjpeg = mozjpeg.cjpeg(input, ["-quality", "85"]);
var output_djpeg = mozjpeg.djpeg(input, ["-grayscale"]);
var output_jpegtran = mozjpeg.jpegtran(input, ["-rotate", "90"]);
```

## Full Example

### Node.js
```
$ npm i -S js-mozjpeg
```

```javascript
var mozjpeg = require("js-mozjpeg");
// mozjpeg-js is already exist.
var fs = require("fs");

var input = fs.readFileSync("input.jpg");
var output = mozjpeg.cjpeg(input, ["-quality", "85"]);
// var output = mozjpeg.cjpeg(input, {quality: "85"});
// You can also use mozjpeg.djpeg and mozjpeg.jpegtran.
/*
output = {
    data: output file,
    stdout: output string,
    stderr: error string
}
*/

console.log(output.stdout);
console.log(output.stderr);

fs.writeFileSync("output.jpg", output.data);
```

### Browser
Please check Demo with Web worker. [https://li-na.github.io/mozjpeg.js/](https://li-na.github.io/mozjpeg.js/)

## Build
Actually, I don't know what it is but I made build shell script and it seems working. Please let me know if you have ANY better way to build this project.

You have to setup emscripten sdk on [here](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html) first.

Then, download or clone this git on your linux computer. (Windows does not supported at this moment)
```
$ git clone https://github.com/LI-NA/mozjpeg.js
```

Finally, just run `./build.sh`. It will install `build-essential cmake libtool autoconf automake m4 nasm pkg-config libpng-dev` packages and configure / compile mozjpeg with emcc.

## Credit
I refered to [as-com's mozjpeg-js](https://github.com/as-com/mozjpeg-js).

## License
[MIT License](LICENSE)

Mozjpeg source code is under [libjpeg-turbo Licenses](deps/mozjpeg/LICENSE.md)
