var fs = require("fs");

module.exports = function(grunt){

    function generate(path, separator) {
        var files = fs.readdirSync(path),
            structure = {};
        for(var i = 0; i < files.length; i++){
            if(fs.lstatSync(path + "/" + files[i]).isDirectory()){
                continue;
            }
            if(files[i].indexOf(".md") === -1){
                continue;
            }
            addFile(files[i], structure, separator);
        }

        fs.writeFileSync(path + "/_Sidebar.md", generateMarkdown(structure));
    }

    function addFile(fileName, structure, separator){
        var parts, name, part;
        parts = fileName.split(separator);
        name = parts.pop();
        while(parts.length > 0){
            part = parts.shift();
            if(!structure.folders){
                structure.folders = {};
            }
            if(!structure.folders[part]){
                structure.folders[part] = {};
            }
            structure = structure.folders[part];
        }
        if(!structure.files){
            structure.files = [];
        }
        if(name === "index.md"){
            structure.index = name;
        }else{
            structure.files.push(name);
        }
    }

    function generateMarkdown(structure, path, separator){
        var str = "", folders = [], folderStructure, name;
        path || (path = []);
        if(structure.files){
            structure.files.sort();
            for(var i = 0; i < structure.files.length; i++){
                if(structure.files[i].charAt(0) === "_"){
                    continue;
                }
                name = cleanName(structure.files[i]);
                if(structure.folders && structure.folders[name]){
                    structure.folders[name].index = "";
                    continue;
                }
                str += tabs(path.length) + " * [" + name + "](./" + fileName(path, structure.files[i], separator) + ")\n";
            }
        }
        if(structure.folders){
            for(var folder in structure.folders){
                folders.push(folder);
            }
            folders.sort();
            for(var i = 0; i < folders.length; i++){
                folderStructure = structure.folders[folders[i]];
                path.push(folders[i]);
                if(folderStructure.index !== undefined){
                    str += tabs(path.length-1) + " * [" +folders[i] + "](./" + fileName(path, folderStructure.index, separator) + ")\n";
                }else{
                    str += tabs(path.length-1) + " * " + folders[i] + "\n";
                }
                str += generateMarkdown(structure.folders[folders[i]], path, separator);
                path.pop();
            }
        }
        return str;
    }

    function fileName(path, name, separator){
        return ((path.length > 0) ? path.join(separator) : "") + (path.length > 0 && name ? separator : "") + cleanName(name);
    }

    function cleanName(name){
        if(!name){
            return name;
        }
        return name.substring(0, name.indexOf(".md"));
    }

    function tabs(n){
        var str = "";
        while(n > 0){
            str += "\t";
            n--;
        }
        return str;
    }

    grunt.registerMultiTask('markdown-sidebar', 'Generate a markdown sidebar based on a directory content.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = {
            src: this.data.src,
            separator: this.data.separator || "|"
        };
        if(!options.src){
            grunt.log.error("You must specify a src option");
            return false;
        }
        generate(options.src, options.separator);
        grunt.log.ok("The file '" + options.src + "/_Sidebar.rm' was successfully generated");
    });
};