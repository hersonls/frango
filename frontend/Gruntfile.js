'use strict';


module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    source: 'source/',
    dist: 'dist/',
    tmp: '.tmp/'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        nospawn: false
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      babel: {
        files: ['<%= config.source %>static/scripts/{,*/}*.js'],
        tasks: ['babel:dist']
      },
      babelTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['babel:test', 'test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.source %>static/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', ]
      },
      styles: {
        files: ['<%= config.source %>static/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', ]
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true,
        watchOptions: {
          ignored: ''
        }
      },
      livereload: {
        options: {
          files: [
            '<%= config.source %>templates/{,*/}*.html',
            '<%= config.source %>templates/**/*.html',
            '<%= config.tmp %>static/styles/{,*/}*.css',
            '<%= config.source %>static/images/{,*/}*',
            '<%= config.tmp %>static/scripts/{,*/}*.js',
          ],
          port: 9000,
          proxy: 'localhost:8000'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.tmp %>',
            '<%= config.dist %>*',
            '!<%= config.dist %>.git*'
          ]
        }]
      },
      server: '<%= config.tmp %>'
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true,
        includePaths: ['.', config.source+'/static/']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.source %>static/styles',
          src: ['*.{scss,sass}', '!_*.{scss,sass}'],
          dest: '<%= config.tmp %>static/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.source %>static/styles',
          src: ['*.{scss,sass}', '!_*.{scss,sass}'],
          dest: '<%= config.tmp %>static/styles',
          ext: '.css'
        }]
      }
    },

    // Compiles ES6 with Babel
    babel: {
      options: {
          sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.source %>static/scripts',
          src: '{,*/}*.js',
          dest: '<%= config.tmp %>static/scripts',
          ext: '.js'
        }]
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.source %>static/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>static/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.source %>static/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>static/images'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      options: {
        directory: '<%= config.source %>static/bower_components',
        "overrides": {
          "slick-carousel": {
            "main": [
              "slick/slick.min.js",
              "slick/slick.scss",
              "slick/slick-theme.scss",
              "slick/fonts/*"
            ]
          }
        }
      },
      app: {
        src: ['<%= config.source %>templates/{,*/}*.html'],
        exclude: ['bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./
      },
      sass: {
        src: ['<%= config.source %>static/styles/{,*/}*.{scss,sass}'],
        ignorePath: /^(\.\.\/)+/
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        root: '<%= config.source %>static/',
        dest: '<%= config.dist %>'
      },
      html: '<%= config.source %>templates/base.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>static/images',
          '<%= config.dist %>static/styles'
        ]
      },
      html: ['<%= config.dist %>templates/{,*/}*.html'],
      css: ['<%= config.dist %>static/styles/{,*/}*.css']
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.source %>',
          dest: '<%= config.dist %>',
          src: [
            'static/*.{ico,png,txt}',
            'static/images/{,*/}*.webp',
            'templates/{,*/}*.html',
            'static/**/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.source %>',
          src: 'static/bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
          dest: '<%= config.dist %>'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: 'templates/{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      dist: [
        'babel',
        'sass',
        'imagemin',
        'svgmin'
      ],
      server: [
        'babel:dist',
        'sass:server'
      ]
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'wiredep',
    'concurrent:server',
    // 'postcss',
    'browserSync:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    // 'filerev',
    'usemin',
    'htmlmin'
  ]);

  // Default grunt task. Run when any args is passed.
  grunt.registerTask('default', [
    'clean',
    'wiredep',
    'sass:dev',
    'babel',
  ]);
};
