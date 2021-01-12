const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
// import router from './routes/api_routes';
const routes = require('./routes/api_routes')

const users = require('./models/user');
const webpush = require('web-push');
const app = express();
const path =  require('path')

var passport = require('passport');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const LocalStrategy = require('passport-local').Strategy
var flash = require('express-flash');

app.use(flash());

app.use(session({
  secret: "Session",
  resave: false,
  saveUninitialized: false
}))

app.use(function(req, res, next) {
	next();
})

var admins = require('./models/admin')

var email = "nageswararao.nyros@gmail.com";
var password = "12345678";
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

var bcrypt = require('bcrypt')

bcrypt.hash(password, 10, function(err, hash) {
	admins.findOne({
		email: email
	}, function(err, admin){
		if(admin){
			// console.log(admin, "Previous")
		}else{
			admins.create({
				email: email,
				password: hash
			}, function(err, new_admin){
				// console.log(new_admin)
			})
		}
	})
});

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser({limit: '50mb'}));
app.use(cors())
mongoose.connect('mongodb+srv://sasiva:saisiva@123@cluster0-wt890.mongodb.net/TaskManager?retryWrites=true&w=majority',{ useNewUrlParser: true });

mongoose.connection.once('open', function () {
    console.log('MongoDB connection open');
});

app.use(express.static(path.join(__dirname, './admin')));
// app.use(express.static(path.join(__dirname, './images')));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './public/admin_assets')));

app.use(express.static(path.join(__dirname, './admin/assets/admin_assets')))

app.set('views', path.join(__dirname, './admin/views'));
app.set('view engine','ejs'); 

app.engine('ejs', require('ejs').__express);

app.get('/dashboard',(req, res)=>{

	res.render('index');

});

require('./admin/passport-config')(passport);

const admin_routes = require('./routes/admin_routes')(passport)
app.use('/api', routes)
app.use('/admin', admin_routes)

const http=require('http');

const server = http.Server(app)
const port = process.env.PORT || 5000
app.listen(port, function () {
   console.log('app listening on port '+port+'')
})

var CronJob = require('cron').CronJob;
