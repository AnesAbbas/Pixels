// npm install --global gulp-cli
// npm install --save-dev gulp gulp-terser gulp-zip gulp-if
const gulp = require('gulp');
const terser = require('gulp-terser');
// const zip = require('gulp-zip');
const gulpIf = require('gulp-if');
const path = require('path');

// Define the source and output paths
const paths = {
  src: 'source_code/**/*',
  dest: {
    unzipped: 'output',
    zipped: '.'
  }
};

// Function to determine if a file is a JavaScript file but not jQuery
const isJsButNotJQuery = (file) => {
    const extname = path.extname(file.path);
    const basename = path.basename(file.path);
    return extname === '.js' && !basename.startsWith('jquery');
  };
  
  // Task to copy original files to the unzipped folder and process JS files
  gulp.task('copy-and-process-files', function() {
    return gulp.src(paths.src, {encoding: false})
      .pipe(gulpIf(isJsButNotJQuery, terser())) // Minify and obfuscate only non-jQuery JS files
      .pipe(gulp.dest(paths.dest.unzipped));
  });
  
  // Task to zip the processed files
  gulp.task('zip-files', async function() {
    const zip = (await import('gulp-zip')).default;
    return gulp.src(paths.dest.unzipped + '/**/*', {encoding: false})
      .pipe(zip('output.zip'))
      .pipe(gulp.dest(paths.dest.zipped));
  });
  
  // Default task
  gulp.task('default', gulp.series('copy-and-process-files', 'zip-files'));