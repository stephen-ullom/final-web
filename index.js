#!/usr/bin/env node

var file = require('./file');
var parser = require('./parser');

var path = require('path');

try {
    var sass = require('node-sass');
} catch (error) {
    // No sass
}
// var beautify = require('js-beautify').html;

var sourceDir = './source/';
var buildDir = './build/';

// Compile source files
if (process.argv[2] && process.argv[3]) {
    sourceDir = process.argv[2];
    buildDir = process.argv[3];
    compile(sourceDir, buildDir);
} else {
    console.log('Please provide a source folder and an output folder.');
}

function compile(source, destination) {
    // Replace source/folder/file.ext with destination/folder/file.ext

    // Remove ending / or \
    source = source.replace(/[\\\/]$/, '');
    destination = destination.replace(/[\\\/]$/, '');

    // var destinationFolder = destination.match(/(\w*)[\\\/]/)[0];
    // compileFile(source, path.dirname(source.replace(/(\w*)[\\\/]/, destinationFolder)) + '/');
    compileFile(source, destination);
    // console.log(path.dirname(source.replace(/(\w*)[\\\/]/, destinationFolder)));
}

// Compile files
function compileFile(source, destination) {
    // Make the folder if it doesn't exist
    file.makeFolder(destination);

    if (file.isFolder(source)) {

        // file.makeFolder(destination);
        // file.copy(source, destination + source);

        // file.makeFolder(destination);
        var files = file.list(source);

        for (const key in files) {
            // console.log(source + '/' + files[key] + ' ' + destination);
            // var destinationFolder = destination.match(/(\w*)[\\\/]/)[0];
            // compileFile(source + files[key], path.dirname(source.replace(/(\w*)[\\\/]/, destinationFolder)));
            // console.log(destinationFolder);
            compileFile(source + '/' + files[key], destination);
        }
    } else {
        // console.log(source + ' ' + destination);
        var destinationFolder = path.dirname(source.replace(/^[\w-]*/, destination)) + '/';
        file.makeFolder(destinationFolder);

        // console.log(destinationFolder);
        switch (path.extname(source)) {
            case '.web':
                if (source != 'template.web') {
                    var html = file.read(source);
                    var page;
                    try {
                        page = parser(html);

                        page = page.replace(/^\s*[\n\r]/g, ''); // Replace empty lines

                        page = page.replace(/\?>\s*\n*\s*<\?php /g, ''); // Remove double php tags

                        // page = beautify(page, {
                        //     extra_liners: '',
                        //     preserve_newlines: false
                        // });

                        file.write(destinationFolder + path.parse(source).name + '.php', page);
                    } catch (error) {
                        var portion = html.substring(0, error.position);
                        var line = portion.split('\n').length - 1;

                        // Debug
                        console.log(error);

                        showError('Final', error.code, source + ':' + line + ':' + error.position);
                        // console.log('\x1b[1;34m%s\x1b[0m', 'Final Error:', error.code + ' at (' + source + sourceFile + ':' + line + ':' + error.position + ')');
                    }
                }
                break;
            case '.scss':
                if (sass) {
                    try {
                        var scss = file.read(source);
                        if (scss != '') {
                            var output = sass.renderSync({
                                data: scss
                            });
                            file.write(destinationFolder + path.parse(source).name + '.css', output.css);
                        }
                    } catch (error) {
                        showError('Sass', error.message, source + ':' + error.line);
                    }
                } else {
                    showError('Final', 'The node-sass package must be installed to compile .scss files.', false);

                }
                break;
                // case '.js':
                //     if (source != 'functions.js') {
                //         file.makeFolder(destination);
                //         file.copy(source, destination + source);
                //     }
                //     break;
                // case '':
                //     if (sourceFile.substring(0, 1) == '.') {
                //         console.log('Cannot copy file: ' + sourceFile);
                //     } else {
                //         file.makeFolder(destinationFolder + sourceFile);
                //         console.log(destinationFolder + sourceFile);
                //         // compile(sourceFile + '/', destinationFolder + sourceFile + '/');
                //     }
                //     break;
            default:
                file.copy(source, destinationFolder + path.basename(source));
                break;
        }
    }
}

// function compileFile(source, destination) {
//     switch (path.extname(source)) {
//         case '.web':
//             if (source != 'template.web') {
//                 var html = file.read(source);
//                 var page;
//                 try {
//                     page = parser(html);

//                     page = page.replace(/^\s*[\n\r]/g, ''); // Replace empty lines

//                     page = page.replace(/\?>\s*\n*\s*<\?php /g, ''); // Remove double php tags

//                     // page = beautify(page, {
//                     //     extra_liners: '',
//                     //     preserve_newlines: false
//                     // });

//                     file.write(destination + path.parse(source).name + '.php', page);
//                 } catch (error) {
//                     var portion = html.substring(0, error.position);
//                     var line = portion.split('\n').length - 1;

//                     // console.log('\x1b[1;34m%s\x1b[0m', 'Final Error:', error.code + ' at (' + source + sourceFile + ':' + line + ':' + error.position + ')');
//                     showError('Final', error.code, source + ':' + line + ':' + error.position);
//                 }
//             }
//             break;
//         case '.scss':
//             if (sass) {
//                 try {
//                     var scss = file.read(source);
//                     if (scss != '') {
//                         var output = sass.renderSync({
//                             data: scss
//                         });
//                         file.write(destination + path.parse(source).name + '.css', output.css);
//                     }
//                 } catch (error) {
//                     showError('Sass', error.message, source + ':' + error.line);
//                 }
//             } else {
//                 showError('Final', 'The node-sass package must be installed to compile .scss files.');

//             }
//             break;
//         case '.js':
//             if (source != 'functions.js') {
//                 file.makeFolder(destination);
//                 file.copy(source, destination + source);
//             }
//             break;
//             // case '':
//             //     if (sourceFile.substring(0, 1) == '.') {
//             //         console.log('Cannot copy file: ' + sourceFile);
//             //     } else {
//             //         file.makeFolder(destinationFolder + sourceFile);
//             //         console.log(destinationFolder + sourceFile);
//             //         // compile(sourceFile + '/', destinationFolder + sourceFile + '/');
//             //     }
//             //     break;
//         default:
//             file.makeFolder(destination);
//             file.copy(source, destination + source);
//             break;
//     }
// }

function showError(type, message, location) {
    var color = '0';
    switch (type.toLowerCase()) {
        case 'final':
            // Blue
            color = '1;34';
            break;
        case 'sass':
            // Blue
            color = '1;35';
            break;
    }
    if (location) {
        location = '(' + location + ')';
    } else {
        location = '';
    }
    console.log('\x1b[' + color + 'm%s\x1b[0m', type + ' Error:', message, location);
}