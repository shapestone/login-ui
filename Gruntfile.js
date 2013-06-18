module.exports = function(grunt) {

    grunt.initConfig({

        //our JSHint options
        jshint: {
            all: ['main.js'] //files to lint
        },

        //our concat options
        concat: {
            options: {
                separator: ';' //separates scripts
            },
            dist: {
                src: ['app/js/*.js', 'app/js/**/*.js'], //Using mini match for your scripts to concatenate
                dest: 'app/js/script.js' //where to output the script
            }
        },

        //our uglify options
        uglify: {
            js: {
                files: {
                    '/app/js/script.js': ['app/js/script.js'] //save over the newly created script
                }
            }
        }
    });

    //load our tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //default tasks to run
    //grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

    grunt.registerTask('development', ['jshint']);
    grunt.registerTask('production', ['jshint', 'concat', 'uglify']);

}