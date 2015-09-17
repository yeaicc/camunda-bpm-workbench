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
            'bower_components/bootstrap/less'
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
        browserifyOptions: {
          builtins: false,
          insertGlobalVars: {
            process: function () {
                return 'undefined';
            },
            Buffer: function () {
                return 'undefined';
            }
          }
        },
        transform: [ 'brfs' ]
      },
      app: {
        files: {
          'dist/workbench.js': [ 'lib/workbench.js' ]
        }
      },
      watch: {
        options: {
          keepalive: true,
          browserifyOptions: {
            builtins: false,
            debug: true,
            insertGlobalVars: {
              process: function () {
                  return 'undefined';
              },
              Buffer: function () {
                  return 'undefined';
              }
            }
          },
          watch: true
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
          { expand: true, cwd: 'bower_components/bootstrap/dist/fonts', src: [ '*' ], dest: 'dist/fonts' },

          // bpmn font
          { expand: true, cwd: 'assets/font/bpmn-font/font', src: [ '*' ], dest: 'dist/fonts' },

          // index.html
          { expand: true, cwd: 'lib', src: [ 'index.html' ], dest: 'dist' },

          // images
          { expand: true, cwd: 'assets', src: [ 'img/*' ], dest: 'dist' }
        ]
      },

      debug_overlay: {
        files: [{
          src: require.resolve('bpmn-js-debug-overlay/assets/debug-overlay.css'),
          dest: 'dist/vendor/bpmn-js-debug-overlay/debug-overlay.css'
        }]
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
        files: [ 'assets/less/**/*.less' ],
        tasks: [ 'less' ]
      },
      resources: {
        files: [
          'lib/index.html',
          'assets/img/**.*',
          'assets/font/workbench.*',
          'lib/**/*.js',
          'lib/**/*.html'
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
/*          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
              console.info('res.setHeader', res.setHeader)
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                next();
            });

            return middlewares;
          }*/
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
