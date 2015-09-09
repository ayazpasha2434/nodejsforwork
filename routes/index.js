/* GET home page. */
exports.home = function(req, res){
    res.render('home');
};

exports.about = function(req,res){
    res.render('about');
};

exports.quick_tutorial = function(req,res){
    res.render('quick_tutorial');
};

exports.contact = function(req, res){
    res.render('contact');
}

exports.install_node = function(req,res){
    res.render('install_node');
};

exports.node_newrelic = function(req,res){
    res.render('node_newrelic');
};

exports.simple_web = function(req, res){
    res.render('simple_web');
}

exports.sync_loop = function(req, res){
    res.render('sync_loop');
}

exports.parallel_task = function(req, res){
    res.render('parallel_task');
}

exports.get_http = function(req, res){
    res.render('get_http');
}

exports.post_http = function(req, res){
    res.render('post_http');
}

exports.timer_task = function(req, res){
    res.render('timer_task');
}

exports.schedule_task = function(req, res){
    res.render('schedule_task');
}

exports.cron_setup = function(req, res){
    res.render('cron_setup');
}

exports.upload_files = function(req, res){
    res.render('upload_files');
}

exports.notify_ios = function(req, res){
    res.render('notify_ios');
}

exports.notify_android = function(req, res){
    res.render('notify_android');
}

exports.graceful_restart = function(req, res){
    res.render('graceful_restart');
}

exports.encrypt = function(req, res){
    res.render('encrypt');
}