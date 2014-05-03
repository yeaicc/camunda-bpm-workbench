
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: [ 
            'lib/less', 
            'bower_components/bootstrap/less',
            'bower_components/bpmn-js/example/',
            'node_modules/camunda-simple-grid/lib/less' ]
        },
        files: {
          'dist/css/developer.css': 'lib/less/developer.less'
        }
      }
    },
    browserify: {
      options: {
        transform: [ 'brfs' ],
        browserifyOptions: {
          builtins: [ 'fs' ],
          noParse: [
            'node_modules/angular/lib/angular.min.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/lodash/dist/lodash.js'
          ],
          commondir: false
        },
        bundleOptions: {
          detectGlobals: false,
          insertGlobalVars: []
        }
      },
      development: {
        files: {
          'dist/developer.js': [ 'lib/js/developer.js' ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/developer.min.js': [ 'dist/developer.js' ]
        }
      }
    },
    copy: {
      resources: {
        files: [

          // bpmn-io javascript
          { expand: true, cwd: 'bower_components/bpmn-js/dist/', src: [ 'bpmn.js'], dest: 'dist/' },
          // bootstrap fonts
          { expand: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: [ '*'], dest: 'dist/fonts/' },

          // bootstrap javascript
          { expand: true, cwd: 'bower_components/bootstrap/dist/js/', src: [ '*.min.js'], dest: 'dist/' },


          // index.html
          { expand: true, cwd: 'lib/', src: [ '**.html' ], dest: 'dist/' },

          // root views
          { expand: true, cwd: 'lib/js/', src: [ '*/**.html' ], dest: 'dist/views/' },

          // images
          { expand: true, cwd: 'lib/', src: [ 'img/*' ], dest: 'dist/' },

          // fonts
          { expand: true, cwd: 'lib/', src: [ 'font/developer.*' ], dest: 'dist/' },
        ]
      }
    },
    watch: {
      less: {
        files: [ 'lib/less/*.less' ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'lib/js/**/*.js',
          'lib/js/**/*.html'
        ],
        tasks: [ 'browserify:development' ]
      },
      resources: {
        files: [
          'lib/index.html',
          'lib/js/**/*.html',
          'lib/img/*',
          'lib/font/developer.*'
        ],
        tasks: [ 'copy:resources' ]
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '*',
          base: 'dist/'
        }
      }
    }
  });

  grunt.registerTask('build', [ 'less', 'browserify', 'copy', 'uglify' ]);

  grunt.registerTask('auto-build', [ 'build', 'connect', 'watch' ]);

  grunt.registerTask('default', [ 'build' ]);
};
