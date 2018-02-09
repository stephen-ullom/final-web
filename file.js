var fs = require('fs');

module.exports = {
    read: function (path) {
        return fs.readFileSync(path, "utf-8");
    },
    write: function (path, data) {
        fs.writeFileSync(path, data);
        console.log("Write  " + path);
    },
    copy: function (path, destination) {
        fs.copyFileSync(path, destination);
        console.log("Copy   " + destination);
    },
    list: function (path) {
        return fs.readdirSync(path);
    },
    exists: function (path) {
        return fs.existsSync(path);
    },
    makeFolder: function(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
            console.log("Folder " + path);
        }
    },
    delete: function (path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            console.log("Delete " + path);
        }
    }
}