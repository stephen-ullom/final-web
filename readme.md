# Final-Language

Compile organized XML files into PHP.

## Basic Example

Create a **source/example.web** file inside a **source** folder:

```xml
<page>
    <set $name="Example" />
    <settings>
        <title>{$name} Title</title>
    </settings>
    <header>{$name} Header</header>
    <paragraph>This is a paragraph with a
        <link to="page">link</link>.
    </paragraph>
</page>
```
Install Final-Language with NPM ```npm install final-language -g```.

Run the compiler "```final source-folder destination-folder```" from the parent directory of the source folder.

Final outputs the following **output/example.php**:

```html
<!DOCTYPE html>
<html>
    <?php $name = "Example"; ?>
    <head>
        <title><?php print($name); ?> Title</title>
    </head>
    <body class="page">
        <h1 class="header"><?php print($name); ?> Header</h1>
        <p class="paragraph">This is a paragraph with a
            <a href="page.php" class="link">link</a>.
        </p>
    </body>
</html>
```

Which renders in the browser:

># Example Title
>This is a paragraph with a [link](page.php).
