
/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    project: {
      src: 'src',
      app: 'public',
      assets: '<%= project.app %>/assets',
      css: [
        '<%= project.src %>/scss/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },

    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'public')];
          }
        }
      }
    },

    /**
     * Clean files and folders
     * https://github.com/gruntjs/grunt-contrib-clean
     * Remove generated files for clean deploy
     */
    clean: {
      dist: [
        '<%= project.assets %>/css/style.unprefixed.css',
        '<%= project.assets %>/css/style.prefixed.css'
      ]
    },

    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      files: [
        'src/js/*.js',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    handlebars: {
      compile: {
        options: {
          processName: function(filePath) {
            // Removes the "src/hbs/" and ".hbs" parts of key names.
            var prefix = "src/templates/";
            var suffix = ".hbs";
            
            return filePath.slice( prefix.length , filePath.lastIndexOf(suffix) );
          }
        },
        files: {
          "public/assets/js/template.js":"src/templates/**/*.hbs"
        }
      }
    },

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev: {
        src: [ 'src/js/public/match.js', 'src/js/public/library/*.js'],
        dest: 'public/assets/js/app.js'
      },
      options: {
        stripBanners: true,
        sourceMap: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },
    
    bower_concat: {
      all: {
        dest: 'public/assets/js/lib.js',
        cssDest: 'public/assets/css/lib.css',
        dependencies: {
          'underscore': [ 'jquery' ],
          'handlebars': [ 'jquery' , 'underscore' ],
          'backbone': [ 'jquery' , 'underscore' , 'handlebars' ]
        }
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      options: {
        banner: '<%= tag.banner %>',
        sourceMap: true
      },
      dist: {
        src: '<%= concat.dev.dest %>',
        dest: 'public/assets/js/*.js',
        files: {
          '<%= project.assets %>/js/*.js': '<%= project.js %>'
        }
      },
      handlebars: {
        options: {
          sourceMap: true
        },
        src: 'public/assets/js/template.js',
        dest: 'public/assets/js/template.js'
      }
    },

    copy: {
      files: {
        cwd: 'src/js',             // set working folder / root to copy
        src: 'public/*',               // copy all files and subfolders
        dest: 'public/assets/js',  // destination folder
        expand: true,               // required when using cwd
        flatten: true
      }
    },

    /**
     * Compile Sass/SCSS files
     * https://github.com/gruntjs/grunt-contrib-sass
     * Compiles all Sass/SCSS files and appends project banner
     */
    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.assets %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      }
    },

    /**
     * Autoprefixer
     * Adds vendor prefixes automatically
     * https://github.com/nDmitry/grunt-autoprefixer
     */
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          'safari 6',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dev: {
        files: {
          '<%= project.assets %>/css/style.min.css': ['<%= project.assets %>/css/style.unprefixed.css']
        }
      },
      dist: {
        files: {
          '<%= project.assets %>/css/style.prefixed.css': ['<%= project.assets %>/css/style.unprefixed.css']
        }
      }
    },

    /**
     * CSSMin
     * CSS minification
     * https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      dev: {
        options: {
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.assets %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.assets %>/css/style.unprefixed.css'
          ]
        }
      },
      dist: {
        options: {
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.assets %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.assets %>/css/style.prefixed.css'
          ]
        }
      }
    },

    /**
     * Build bower components
     * https://github.com/yatskevich/grunt-bower-task
     */
    bower: {
      dev: {
        dest: '<%= project.assets %>/components/'
      },
      dist: {
        dest: '<%= project.assets %>/components/'
      }
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      concat: {
        files: '<%= project.src %>/js/**/*.js',
        tasks: ['concat:dev', 'jshint']
      },
      copy: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['copy']
      },
      sass: {
        files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev', 'cssmin:dev', 'autoprefixer:dev']
      },
      handlebars: {
        files: 'src/templates/**/*.hbs',
        tasks: [ 'handlebars:compile' ]
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.assets %>/css/*.css',
          '<%= project.assets %>/js/{,*/}*.js',
          '<%= project.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'sass:dev',
    // 'bower:dev',
    'autoprefixer:dev',
    'cssmin:dev',
    'handlebars:compile',
    'jshint',
    'concat:dev',
    'connect:livereload',
    // 'open',
    'copy',
    'bower_concat',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'sass:dist',
    // 'bower:dist',
    'autoprefixer:dist',
    'cssmin:dist',
    'handlebars:compile',
    'clean:dist',
    'copy',
    'bower_concat',
    'concat:dev',
    'jshint'
    // 'uglify'
  ]);

};
