module.exports = {
    // Final elements
    page: {
        open: function(attributes) {
            // result = '';
            // for (const key in args) {
            //     result += args[key].name;
            // }
            return '<!DOCTYPE html>\n' + element('html', attributes);
        },
        close: '</body>\n</html>'
    },
    settings: {
        open: '<head>',
        close: '</head>\n<body class="page">'
    },
    title: {
        open: function(attributes) {
            return element('title', attributes)
        },
        close: '</title>'
    },
    info: {
        open: function(attributes) {
            return element('meta', attributes, null, true);
        }
    },
    reference: {
        open: function(attributes) {
            return element('link', attributes);
        }
    },
    style: {
        open: function(attributes) {
            return element('style', attributes);
        },
        close: '</style>'
    },
    javascript: {
        open: function(attributes) {
            for (const key in attributes) {
                if (attributes[key].name == 'source') {
                    attributes[key].value = '"' + attributes[key].literalValue + '.js"';
                }
            }
            return element('script', attributes);
        },
        close: '</script>'
    },
    // Basic elements
    header: {
        open: function(attributes) {
            return element('h1', attributes, 'header');
        },
        close: '</h1>'
    },
    subheader: {
        open: function(attributes) {
            return element('h2', attributes, 'subheader');
        },
        close: '</h2>'
    },
    paragraph: {
        open: function(attributes) {
            return element('p', attributes, 'paragraph');
        },
        close: '</p>'
    },
    text: {
        open: function(attributes) {
            return element('span', attributes, 'text');
        },
        close: '</span>'
    },
    box: {
        open: function(attributes) {
            return element('div', attributes, 'box');
        },
        close: '</div>'
    },
    link: {
        open: function(attributes) {
            return element('a', attributes, 'link');
        },
        close: '</a>'
    },
    button: {
        open: function(attributes) {
            return element('button', attributes, 'button');
        },
        close: '</button>'
    },
    input: {
        open: function(attributes) {
            return element('input', attributes, 'input', true);
        }
    },
    list: {
        open: function(attributes) {
            return element('ul', attributes, 'list');
        },
        close: '</ul>'
    },
    item: {
        open: function(attributes) {
            return element('li', attributes, 'item');
        },
        close: '</li>'
    },
    image: {
        open: function(attributes) {
            return element('image', attributes, null, true);
        }
    },
    table: {
        open: function(attributes) {
            return element('table', attributes, 'table');
        },
        close: '</table>'
    },
    row: {
        open: function(attributes) {
            return element('tr', attributes, 'row');
        },
        close: '</tr>'
    },
    data: {
        open: function(attributes) {
            return element('td', attributes, 'data');
        },
        close: '</td>'
    },
    bold: {
        open: function(attributes) {
            return element('b', attributes, 'bold');
        },
        close: '</b>'
    },
    italic: {
        open: function(attributes) {
            return element('i', attributes, 'italic');
        },
        close: '</i>'
    },
    break: {
        open: '<br>'
    },
    // PHP functions
    script: {
        open: '<?php ',
        close: ' ?>'
    },
    set: {
        open: function(attributes) {
            return '<?php ' + attributes[0].name + ' = ' + php(attributes[0].value) + '; ?>';
        }
    },
    string: {
        open: function(attributes) {
            return '<?php ' + attributes[0].name + ' = "';
        },
        close: '"; ?>'
    },
    if: {
        open: function(attributes, argument) {
            // console.log(php(argument.value));
            // var parts = '';
            // for(part in attributes){
            //     parts += attributes[part].name;
            // }
            return '<?php if (' + php(argument.value) + ') { ?>';
        },
        close: '<?php } ?>'
    },
    else: {
        open: '<?php else { ?>',
        close: '<?php } ?>'
    },
    function: {
        open: function(attributes, argument) {
            return '<?php function ' + attributes[0].name + '(' + attributes[0].argument.value + ')' + ' { ?>';
        },
        close: '<?php } ?>'
    },
    foreach: {
        open: function(attributes, argument) {
            return '<?php foreach (' + php(argument.value) + ') { ?>';
        },
        close: '<?php } ?>'
    },
    while: {
        open: function(attributes, argument) {
            return '<?php while (' + php(argument.value) + ') { ?>';
        },
        close: '<?php } ?>'
    },
    include: {
        open: function(attributes) {
            return '<?php include("' + strip(attributes[0].name) + '.php"); ?>';
        }
    },
    return: {
        open: function(attributes) {
            return '<?php return ' + attributes[0].name + '; ?>';
        }
    },
    location: {
        open: function(attributes) {
            return '<?php header("Location: ' + strip(attributes[0].name) + '"); ?>';
        }
    },
    try: {
        open: '<?php try { ?>',
        close: '<?php } ?>'
    },
    catch: {
        open: function(attributes, argument) {
            return '<?php catch (' + argument.value + ') { ?>'
        },
        close: '<?php } ?>'
    },
    switch: {
        open: function(attributes, argument) {
            return '<?php switch (' + php(argument.value) + ') { ?>';
        },
        close: '<?php } ?>'
    },
    case: {
        open: function(attributes, argument) {
            return '<?php case ' + php(argument.value) + ': ?>';
        },
        close: '<?php break; ?>'
    }
}

function element(name, attributes, classes, end) {
    var result = "<" + name;

    // Add classes if they exists
    if (classes) {
        var addedClasses = false;
        for (const key in attributes) {
            if (attributes[key].name == 'class') {
                attributes[key].value = '"' + classes + ' ' + attributes[key].literalValue + '"';
                addedClasses = true;
            }
        }
        if (!addedClasses) {
            attributes.class = '"' + classes + '"';
        }
    }

    // Set attributes
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key) && attributes[key] != undefined) {
            var attributeName;
            var attributeValue;
            if (typeof attributes[key] == 'string') {
                attributeName = key;
                attributeValue = attributes[key];
            } else {
                switch (attributes[key].name) {
                    case 'to':
                        attributeName = 'href';
                        break;
                    case 'source':
                        attributeName = 'src';
                        break;
                    default:
                        attributeName = attributes[key].name;
                        break;
                }
                attributeValue = attributes[key].value;
            }
            attributeValue = setPlaceholders(attributeValue);
            result += ' ' + attributeName + '=' + attributeValue;
        }
    }
    if (end) {
        result += '/';
    }
    result += '>';
    return result;
}

function php(value) {
    output = value
        // Array keys
        .replace(/:/g, ' =>')
        // Condition statements
        .replace(/ EQ /g, ' == ')
        .replace(/ NEQ /g, ' != ')
        .replace(/ IS /g, ' === ')
        .replace(/ ISN /g, ' !== ')
        .replace(/ LT /g, ' < ')
        .replace(/ LTE /g, ' <= ')
        .replace(/ GT /g, ' > ')
        .replace(/ GTE /g, ' >= ');

    return output;
}

function strip(value) {
    return value.substring(1, value.length - 1).trim();
}

function setPlaceholders(value) {
    // Replace ${variable} with <?php print $variable ?>    
    var output = value.replace(/{/g, '<?php print(').replace(/}/g, '); ?>');
    return output;
}