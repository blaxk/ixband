module.exports = function ( grunt ) {
    'use strict';

    var pkg = grunt.file.readJSON( 'package.json' ),
        comment = '/**\n * <%= pkg.name %> - Javascript Library\n * @package	{<%= pkg.name %>}\n * @version v<%= pkg.buildVersion %> - <%= grunt.template.today("yymmdd") %> (blaxk)\n * The MIT License (MIT), http://ixband.com\n */\n';

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        'concat': {
            options: {
                separator: '\n\n\n',
                stripBanners: true,
                banner: comment + ';(function () {\n    "use strict";\n\n',
                process: function( src, filepath ) {
                    var result = src.replace( /\$B.VERSION = '';/, "$B.VERSION = '" + pkg.buildVersion + "';" );
                    return result.replace( /^/gm, '    ' );
                },
                footer: '\n})();'
            },
            dist: {
                src: [
                    'src/main.js',
                    'src/common/common.js',
                    'src/dom/dom.js',
                    'src/selector/selector.js',
                    'src/event/CustomEvents.js',
                    'src/common/Class.js',
                    'src/ua/ua.js',
                    'src/api/api.js',
                    'src/array/array.js',
                    'src/color/color.js',
                    'src/event/event.js',
                    'src/geom/geom.js',
                    'src/html/html.js',
                    'src/measure/measure.js',
                    'src/mobile/mobile.js',
                    'src/net/net.js',
                    'src/string/string.js',
                    'src/object/object.js',
                    'src/style/style.js',
                    'src/utils/utils.js',
                    'src/utils/ease.js',
                    'src/utils/Between.js',
                    'src/utils/Delay.js',
                    'src/utils/RemainTimer.js',
                    'src/utils/Timer.js',
                    'src/utils/TweenCore.js',
                    'src/utils/TweenCSS.js',
                    'src/event/TouchEvent.js',
                    'src/event/DoubleTab.js',
                    'src/event/GestureAxis.js',
                    'src/event/MultiTouch.js',
                    'src/event/ParallaxScroll.js',
                    'src/event/Responsive.js',
                    'src/event/Rotation.js',
                    'src/event/Swipe.js',
                    'src/geom/Matrix.js',
                    'src/geom/Matrix3D.js',
                    'src/net/HttpRequest.js',
                    'src/net/ImageLoader.js',
                    'src/net/JSLoader.js'
                ],
                dest: 'bin/v<%= pkg.version %>/<%= pkg.name %>_<%= pkg.version %>.js'
            }
        },
        'uglify': {
            options: {
                banner: comment,
                ASCIIOnly: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'bin/v<%= pkg.version %>',
                    src: ['<%= pkg.name %>_<%= pkg.version %>.js'],
                    dest: 'bin/v<%= pkg.version %>/',
                    rename: function ( dest, src ) {
                        return dest + src.replace( /.js$/, '.min.js' );
                    }
                }]
            }
        },
        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'test/',
                    src: '**/*',
                    dest: 'test/'
                }],
                options: {
                    //ixBand new version source
                    replacements: [{
                        pattern: /\/v[0-9.]+\//g,
                        replacement: '/v' + pkg.version + '/'
                    }, {
                        pattern: /\/ixBand_([0-9.]+)(.min)*.js/g,
                        replacement: function ( match, p1, p2 ) {
                            return '/ixBand_' + pkg.version + ( p2 || '' ) + '.js';
                        }
                    }]
                }
            }
        },
        'watch': {
            template: {
                options: {
                    liereload: true
                },
                files: ['src/**/*.js'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-string-replace' );

    // Default task(s).
    grunt.registerTask( 'default', ['concat', 'watch'] );
    //JS compress
    grunt.registerTask( 'compress', ['uglify'] );
    //*.html ixband version replace
    grunt.registerTask( 'html-replace', ['string-replace'] );
};