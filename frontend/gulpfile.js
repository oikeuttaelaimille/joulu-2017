var gulp = require('gulp')

var AWS = {
    'accessKeyId':      process.env.AWS_ACCESS_KEY_ID,
    'secretAccessKey':  process.env.AWS_SECRET_ACCESS_KEY,
    'region':           'eu-central-1',
}

var s3   = require('gulp-s3-upload')(AWS)

gulp.task('default', () => {
    gulp.src('./dist/**')
        .pipe(s3({
            Bucket: process.env.BUCKET,
            CacheControl: 'max-age=604800, no-transform, public',
        }));
});
