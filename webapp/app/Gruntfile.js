'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var TEST_BROWSERS = [ 'PhantomJS' ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          paths: [
            'assets/less',
            'bower_components/bootstrap/less',
            'node_modules/bpmn-js/example/css/',
            'node_modules/camunda-simple-grid/lib/less'
          ]
        },
        files: {
          'dist/css/developer.css': 'assets/less/developer.less'
        }
      }
    },

    karma: {
      options: {
        configFile: 'test/config/karma.unit.js',
      },
      single: {
        singleRun: true,
        autoWatch: false,

        browsers: TEST_BROWSERS,

        browserify: {
          debug: false,
          transform: [ 'brfs' ]
        }
      },
      unit: {
        browsers: TEST_BROWSERS
      }
    },

    browserify: {
      options: {
        transform: [ 'brfs' ],
        browserifyOptions: {
          builtins: [ 'fs' ],
          commondir: false
        },
        bundleOptions: {
          detectGlobals: false,
          insertGlobalVars: []
        }
      },
      app: {
        files: {
          'dist/developer.js': [ 'lib/developer.js' ]
        }
      },
      watch: {
        options: {
          watch: true,
          keepalive: true
        },
        files: {
          'dist/developer.js': [ 'lib/developer.js' ],
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

    jshint: {
      lib: [
        ['lib']
      ],
      options: {
        jshintrc: true
      }
    },

    copy: {
      resources: {
        files: [

          // bootstrap fonts
          { expand: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: [ '*'], dest: 'dist/fonts/' },

          // index.html
          { expand: true, cwd: 'lib/', src: [ 'index.html' ], dest: 'dist/' },

          // images
          { expand: true, cwd: 'assets/', src: [ 'img/*' ], dest: 'dist/' },

          // fonts
          { expand: true, cwd: 'assets/', src: [ 'font/developer.*' ], dest: 'dist/' },
        ]
      }
    },
    watch: {
      less: {
        files: [ 'assets/less/*.less' ],
        tasks: [ 'less' ]
      },
      resources: {
        files: [
          'lib/index.html',
          'assets/img/**.*',
          'assets/font/developer.*'
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

  grunt.registerTask('test', [ 'karma:single' ]);

  grunt.registerTask('auto-test', [ 'karma:unit' ]);

  grunt.registerTask('build', [ 'less', 'karma:single', 'browserify:app', 'copy', 'uglify' ]);

  grunt.registerTask('auto-build', [
    'less',
    'copy',
    'connect',
    'browserify:watch',
    'watch'
  ]);

  grunt.registerTask('default', [ 'build' ]);
};
