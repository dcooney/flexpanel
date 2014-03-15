module.exports = function (grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      sass: {
         dist: {
            options: {
               style: 'expanded' //compressed
            },
            files: {
               'css/base.css': 'sass/base.scss',
               'css/flexpanel.css': 'sass/flexpanel.scss',
            }
         }
      },  
      cssmin: {
		add_banner: {
		    options: {
		      banner: '/* jQuery FlexPanel v1.1 - https://github.com/dcooney/flexpanel */'
		    },
		    files: {
		      'css/flexpanel.min.css': ['css/flexpanel.css'],
		      'css/base.min.css': ['css/base.css']
		    }
		  }
	  },    
      concat: {
         dist: {
            src: [
               'js/libs/*.js', // All JS in the libs folder
               'js/functions.js' // This specific file
            ],
            dest: 'js/build/production.js',
         }
      },
      uglify: {
         build: {
            src: 'js/jquery.flexpanel.js',
            dest: 'js/jquery.flexpanel.min.js'
         }
      },
      watch: {
         css: {
            files: '**/*.scss',
            tasks: ['sass', 'cssmin']
         },
         js: {
           files: 'js/*.js',
           tasks: ['uglify']
         },
      },
   });

   grunt.loadNpmTasks('grunt-contrib-sass');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');

   grunt.registerTask('default', ['sass', 'uglify', 'cssmin', 'watch']);
};