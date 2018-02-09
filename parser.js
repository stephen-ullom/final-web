var functions = require('./functions');
var isEscape = false;
var output = '';

var parser = require('htmljs-parser').createParser({
    onText: function(event) {
        // Text within an HTML element
        var value = event.value;

        // Replace { and } with <?php print(); ?>
        if (!isScript && !isEscape) {
            value = value.replace(/{/g, '<?php print(').replace(/}/g, '); ?>');
        }

        if (isEscape) {
            // Replace <, >, empty line, new line
            value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/^\s+[\n\r]/gm, '').replace(/\n/g, '<br>');
        }
        out(value);
    },
    onPlaceholder: function(event) {
        //  ${<value>]} // escape = true
        // $!{<value>]} // escape = false 
        var value = event.value; // String 
        var escaped = event.escaped; // boolean 
        var withinBody = event.withinBody; // boolean 
        var withinAttribute = event.withinAttribute; // boolean 
        var withinString = event.withinString; // boolean 
        var withinOpenTag = event.withinOpenTag; // boolean 
        var pos = event.pos; // Integer

        // if (!withinAttribute) {
        // if (value.indexOf("(") > 0) {
        //     out('<?php print ' + value + '; ?>');
        // } else {
        //     out('<?php print $' + value + '; ?>');
        // }
        // }
    },
    onOpenTag: function(event) {
        var tagName = event.tagName; // String
        var attributes = event.attributes; // Array
        var argument = event.argument; // Object
        var position = event.pos; // Integer

        isEscape = false;

        if (tagName == 'escape') {
            // Escape < and >
            parser.enterStaticTextContentState();
            isEscape = true;
            return true;
        } else if (tagName == 'html') {
            // Allow vanilla HTML
            parser.enterParsedTextContentState();
            return true;
        }

        if (tagName == 'script' || tagName == 'set') {
            isScript = true;
        } else {
            isScript = false;
        }

        if (functions.hasOwnProperty(tagName)) {
            if (functions[tagName].hasOwnProperty('open')) {
                if (typeof functions[tagName].open == 'string') {
                    out(functions[tagName].open);
                } else {
                    out(functions[tagName].open(attributes, argument));
                }
            }
        } else {
            console.log('There is no function for a "' + tagName + '" tag.');
        }
    },
    onCloseTag: function(event) {
        var tagName = event.tagName; // String
        var position = event.pos; // Integer

        if (functions.hasOwnProperty(tagName)) {
            if (functions[tagName].hasOwnProperty('close')) {
                out(functions[tagName].close);
            }
        }
    },
    onComment: function(event) {
        // Text within XML comment
        var value = event.value; // String
        var position = event.pos; // Integer
        out('<!--' + value + '-->');
    },
    onError: function(event) {
        // Error
        var message = event.message; // String
        var code = event.code; // String
        var position = event.pos; // Integer

        // var portion = page.substring(0, position);

        throw {
            code: code,
            position: position
        };
        // console.log(message + ' at position: ' + position);
    },
}, {
    ignorePlaceholders: true
});

function out(value) {
    output += value;
}

module.exports = function(html) {
    // Reset values
    output = '';
    parser.parse(html);
    return output;
};