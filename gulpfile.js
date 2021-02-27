let src_folder = "src";

let path = {
    src:{
        sass: src_folder + "/sass/style.sass",
        css: src_folder + "/css",
        js: src_folder + "/js",
        jsScript: src_folder + "/js/scripts.js",
        img: src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        imgReady: src_folder + "/img",
        imgSprite: src_folder + "/iconsprite/*.svg",
        imgReadySprite: src_folder + "sprite.svg",
        fonts: src_folder + "/fonts/**/*.ttf",
        fontsReady: src_folder + "/fonts",
        otfFonts: src_folder + "/fonts/*.otf",
    },
    clean:{
        css: src_folder + "/css",
        jsMin: src_folder + "/js/scripts.min.js",
    },
    watch:{
        js: src_folder + "/*.js",
        sass: src_folder + "/css/*.sass"
    }
}

let { dest, src } = require("gulp"),
    gulp = require("gulp"),
    /* Обновление браузера start*/
    browsersync = require("browser-sync").create(),
    /* Обновление браузера end*/
    del = require("del"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    svgSprite = require("gulp-svg-sprite"),
    fonter = require("gulp-fonter");


 /* Обновление браузера start*/
/* function browserSync() {
    browsersync.init({
        server:{
            baseDir: "public/"
        },
        port: 3000,
        notify: false
    })
} */
 /* Обновление браузера end*/



function css() {
    clean(path.clean.css);
    return src(path.src.sass)
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(group_media())
        .pipe(dest(path.src.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.src.css)) 
}

function js() {
    clean(path.clean.jsMin);
    return src(path.src.jsScript)
        .pipe(dest(path.src.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.src.js)) 
        .pipe(browsersync.stream())
}



function fonts() {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.src.fontsReady))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.src.fontsReady))
}

function clean(path) {
    return del(path)
}

/* function watchFiles() {
    gulp.watch([path.watch.js, path.watch.css], build);
} */

/* Сборка sprite svg */
gulp.task('svgSprite', function () {
    return gulp.src(path.src.imgSprite)
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: path.src.imgReadySprite
                    }
                }
            })
        )
        .pipe(dest(path.src.imgReady))
})

/* Оптимизация картинок */
gulp.task('images', function () {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgPlugins: [{ removeViewBox: false }],
                interlanced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.src.imgReady))
})

gulp.task('otf2ttf', function () {
    return gulp.src(path.src.otfFonts)
        .pipe(
            fonter({
                formats: ['ttf']
            })
        )
        .pipe(dest(path.src.fontsReady))
})

gulp.task('watch', function () {
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.sass], css);
})



let build = gulp.series(css, js);
/* let watch = gulp.parallel(build, watchFiles, browserSync); */



exports.build = build;


exports.css = css;
exports.js = js;
exports.fonts = fonts;
/* exports.watch = watch; */
exports.default = build;

