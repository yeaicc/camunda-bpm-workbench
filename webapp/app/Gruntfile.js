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
            'node_modules/camunda-simple-grid/lib/less'
          ]
        },
        files: {
          'dist/css/workbench.css': 'assets/less/workbench.less'
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
          'dist/workbench.js': [ 'lib/workbench.js' ]
        }
      },
      watch: {
        options: {
          watch: true,
          keepalive: true,
          bundleOptions: {
            detectGlobals: false,
            insertGlobalVars: [],
            debug: true
          }
        },
        files: {
          'dist/workbench.js': [ 'lib/workbench.js' ],
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/workbench.min.js': [ 'dist/workbench.js' ]
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
          { expand: true, cwd: 'assets/', src: [ 'font/**/*' ], dest: 'dist/' },
        ]
      },

      diagram_js: {
        files: [{
          src: require.resolve('diagram-js/assets/diagram-js.css'),
          dest: 'dist/vendor/diagram-js/diagram-js.css'
        }]
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
          'assets/font/workbench.*'
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
