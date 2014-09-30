## grunt-markdown-sidebar

This grunt task generates a sidebar for a git wiki from a directory content. The directory should be flat (no folder structure). If you want to organize your wiki in folders, you can flatten it using the [grunt-flatten](https://github.com/aam229/grunt-flatten) task. 


For example, when generating with the sperator set to "|", the following directory structure:
```
in/
    foo-bar.rm
    foo.rm
    foo|bar.rm
    bar|index.rm
    bar|foo.rm
    src|foo|bar.rm
    src|bar|foo.rm
```
would generate the following _Sidebar.rm:

* [foo-bar] (./foo-bar)
* [bar] (./bar)
   * [foo] (./bar|foo)
* [foo] (./foo)
   * [bar] (./foo|bar)
* src
   * foo
     * [bar] (./src|foo|bar)
   * bar
      * [foo] (./src|bar|foo)

### Usage
Install using npm:
```
npm install --save https://github.com/aam229/grunt-markdown-sidebar
```

Add the plugin's configuration to your `Gruntfile`:
```javascript
//Configure
grunt.initConfig({
  "markdown-sidebar": {
     src: "path/to/input"
  }
});
//Add task
grunt.loadNpmTasks('grunt-markdown-sidebar');
```
