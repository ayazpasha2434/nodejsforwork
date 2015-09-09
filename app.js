var express = require('express');

var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var babys = require('./routes/babysitter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.home);
app.get('/home', routes.home);
app.get('/about', routes.about);
app.get('/install_node', routes.install_node);
app.get('/node_newrelic', routes.node_newrelic);
app.get('/quick_tutorial', routes.quick_tutorial);
app.get('/contact', routes.contact);
app.get('/node_newrelic', routes.node_newrelic);
app.get('/notify_android', routes.notify_android);
app.get('/notify_ios', routes.notify_ios);
app.get('/schedule_task', routes.schedule_task);
app.get('/timer_task', routes.timer_task);
app.get('/upload_files', routes.upload_files);
app.get('/sync_loop', routes.sync_loop);
app.get('/parallel_task', routes.parallel_task);
app.get('/simple_web', routes.simple_web);
app.get('/get_http', routes.get_http);
app.get('/post_http', routes.post_http);
app.get('/cron_setup', routes.cron_setup);

app.get('/get_nearest_babysitters', babys.nearest_baby_sitters);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || 3000;

app.listen(port);

module.exports = app;