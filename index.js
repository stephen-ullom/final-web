var file = require('./file');
var parser = require('./parser');

var path = require('path');
var sass = require('node-sass');
var beautify = require('js-beautify').html;

var buildDir = './build/';
var sourceDir = './source/';

// Compile source files
compile(sourceDir, buildDir);

// Compile files
function compile(source, destination) {
    var files = file.list(source);

    for (const key in files) {
        switch (path.extname(files[key])) {
            case '.web':
                if (files[key] != 'template.web') {
                    var html = file.read(source + files[key]);
                    var page;
                    try {
                        page = parser(html);

                        page = page.replace(/^\s*[\n\r]/g, ''); // Replace empty lines

                        page = page.replace(/\?>\s*\n*\s*<\?php /g, ''); // Remove double php tags

                        // page = beautify(page, {
                        //     extra_liners: '',
                        //     preserve_newlines: false
                        // });

                        file.write(destination + path.parse(files[key]).name + '.php', page);
                    } catch (error) {
                        var portion = html.substring(0, error.position);
                        var line = portion.split('\n').length - 1;

                        console.log('Error: ' + error.code + ' at (' + source + files[key] + ':' + line + ':' + error.position + ')');
                    }
                }
                break;
            case '.scss':
                if (sass) {
                    var scss = file.read(source + files[key]);
                    if (scss != '') {
                        var output = sass.renderSync({
                            data: scss
                        });
                        file.write(destination + path.parse(files[key]).name + '.css', output.css);
                    }
                } else {
                    console.log('The node-sass package must be installed to compile .scss files.');
                }
                break;
            case '.js':
                if (files[key] != 'functions.js') {
                    file.makeFolder(destination);
                    file.copy(source + files[key], destination + files[key]);
                }
                break;
            case '':
                if (files[key].substring(0, 1) == '.') {
                    console.log('Cannot copy file: ' + source + files[key]);
                } else {
                    file.makeFolder(destination + files[key]);
                    compile(source + files[key] + '/', destination + files[key] + '/');
                }
                break;
            default:
                file.makeFolder(destination);
                file.copy(source + files[key], destination + files[key]);
                break;
        }
    }
}