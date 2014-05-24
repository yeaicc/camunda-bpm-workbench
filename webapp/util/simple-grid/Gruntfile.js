
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: [ 'lib/less' ]
        },
        files: {
          'dist/simple-grid.css': 'lib/less/simple-grid.less'
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
          'dist/simple-grid.js': [ 'lib/js/simple-grid.js' ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/simple-grid.min.js': [ 'dist/simple-grid.js' ]
        }
      }
    },
    copy: {
      resources: {
        files: [
          // index.html
          { expand: true, cwd: 'lib/', src: [ 'index.html' ], dest: 'dist/' },

          // images
          { expand: true, cwd: 'lib/', src: [ 'img/*' ], dest: 'dist/' },

          // fonts
          { expand: true, cwd: 'lib/', src: [ 'font/simple-grid.*' ], dest: 'dist/' },
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
          'lib/img/*',
          'lib/font/simple-grid.*'
        ],
        tasks: [ 'copy:resources' ]
      }
    }
  });

  grunt.registerTask('build', [ 'less', 'browserify', 'copy', 'uglify' ]);

  grunt.registerTask('auto-build', [ 'build', 'watch' ]);

  grunt.registerTask('default', [ 'build' ]);
};
