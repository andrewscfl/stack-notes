const sass = require('node-sass')
module.exports = (grunt) => {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/style.css': 'sass/main.scss'
        }
      },
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPreceision: -1
      },
      target: {
        files: {
          'dist/css/style.min.css': ['dist/css/style.css']
        }
      },
    },
    watch: {
      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass']
      },
      cssmin: {
        files: ['dist/css/style.css'],
        tasks: ['cssmin']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default task(s).
  grunt.registerTask('default', ['watch'])

};
