module.exports = function (grunt) {
    'use strict';

    // Internal paths 
    var core_src =  ['engine/src/core/*.js'],
        module_src =  ['engine/src/core/modules/**/*.js'],
        core_dest =  'engine/build/fabler-core.js',
        module_dest =  'engine/build/fabler-modules.js',
        fabler_dest = 'engine/build/<%= pkg.name %>-<%= pkg.version %>.js';

    // Configure project build here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            core: {
                src: core_src,
                dest: core_dest
            },
            modules: {
                src: module_src,
                dest: module_dest
            },
            all: {
                src: [core_dest, module_dest],
                dest: fabler_dest
            }
        },
        uglify: {
        }
    });

    // Load required task runners
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Setup project tasks
    // Help info
    grunt.registerTask('default', 'Help info', function () {
        grunt.log.error('Please choose a specific task. To build ' +
                       'Fabler for use, run "dist"');
    });

    grunt.registerTask('build-core', 'Build the core of the engine',
                       ['concat:core']);
    grunt.registerTask('build-modules', 'Build the modules of the engine',
                       ['concat:modules']);
    grunt.registerTask('build', 'Build the source file',
                       ['build-core', 'build-modules', 'concat:all']);
};
