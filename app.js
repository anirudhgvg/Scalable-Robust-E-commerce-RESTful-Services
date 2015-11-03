
/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var routes = require('./routes');
var newuser = require('./routes/newuser');
var user = require('./routes/user');
var admin = require('./routes/admin');
var http = require('http');
var path = require('path');
var app = express();
var SessionStore = require('connect-mongo')(session);
var sessionstore = new SessionStore({
    db: 'mysession',
    host: 'localhost',
    collection: 'session',
    autoReconnect: true
});


conn = require('./routes/mongo.js').conn;
//console.log(conn);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    genid: function (req) {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    store: sessionstore,
    secret: 'mysecret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 15 * 60 * 1000 }
}))
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/',routes.loadResponse);
app.post('/logout', routes.loadLogout);
app.post('/registerUser', newuser.loadPostRegisterpage);
app.post('/login', newuser.loadPostLoginpage);

app.post('/updateInfo', user.loadPostUpdateProfile);
app.post('/buyProduct', user.loadBuyProduct);
app.post('/modifyProduct', admin.loadModifyProducts);
app.post('/getOrders', admin.loadGetOrders);
app.get('/viewUsers', admin.loadviewUsers);
app.get('/getProducts', routes.loadViewProducts);



http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
