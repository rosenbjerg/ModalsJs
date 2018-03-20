module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['*.js'],
                        dest: 'dist'
                    }
                ]
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                compress: true,
                mangle: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.js', '!*.min.js'],
                    ext: '.min.js',
                    dest: 'dist',
                }]
            }
        },
        sass: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.scss'],
                    dest: 'dist',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask("default", ["babel", "uglify", "sass", "cssmin"]);
};