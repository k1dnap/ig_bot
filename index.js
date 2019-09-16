const express = require('express');
const app = express();
const fs = require('fs').promises;
const Instagram_profile = require('./utils/ig_funcs');
const path = require('path');
const Datastore = require('nedb');
const remove = require('remove');

//db global
db = {}
db.profiles = new Datastore({filename : 'data/profiles', autoload: true });
db.profiles_temp = new Datastore({filename : 'data/profiles_temp', autoload: true });
db.scraped_accounts = new Datastore({filename : 'data/scraped_accounts', autoload: true });
db.scraped_accounts_all = new Datastore({filename : 'data/scraped_accounts_all', autoload: true });

const workflow = {}
const default_profile = {
	active_follows_limit : 400,
	followers_list: [],
	status: {
		followed_total: 0,
		current_following: 0,
		current_followers: 0,
		need_to_verify: false
	},
	follow_type: 'list',//`crawl`,
	follow: false,
	crawl_startpoint: '',
	crawl_current: '',
	// follow_type: `list`,
	num_of_cycles_per_day : 10,
	today_cycles: 0,
	today: 'today'
}

//static next + bootstrap
app.use('/_next', express.static(__dirname+'/out/_next'));
app.use('/static', express.static(__dirname+'/out/static'));

//main
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/out/index.html'));
});
app.get('/api/profiles_all',async function(req,res){
	let profiles;
	db.profiles.find({}, (err, res)=>{
		profiles = res;
	})
	while(!profiles){
		await new Promise(resolve=> setTimeout(resolve,100))
	}
	res.send(profiles);
});
//add_profile
app.get('/add_profile',function(req,res){
	res.sendFile(path.join(__dirname+'/out/add_profile.html'));
});
//verify_profile
app.get('/verify_profile',function(req,res){
	res.sendFile(path.join(__dirname+'/out/verify_profile.html'));
});
app.get('/api/verify_profile', async function(req, res) {
	let login = req.query.login;
	let action = req.query.action // create||check||verify
	if (action === 'create'){
		let password = req.query.password;
		workflow[login] = {}
		workflow[login].profile = new Instagram_profile(login);
		workflow[login].status = 'loading'
		res.send('');
		let result = await workflow[login].profile.createProfile({password}); // success||fail||verify
		workflow[login].status = result
		return;
	} else if (action === 'check'){
		res.send({status: workflow[login].status});
		if (workflow[login].status == 'success'){
			//clone default
			let new_profile = JSON.parse(JSON.stringify(default_profile))
			new_profile.login = login;
			db.profiles.update({login},new_profile, {upsert:true})
		} 
	}	else if (action === 'sendCode'){
		res.send('');
		await workflow[login].profile.sendVerificationCode()
	} else if (action === 'verify'){
		let verification_code = req.query.code;
		workflow[login].status = 'loading'
		res.send('');
		let result = await workflow[login].profile.verifyProfile({verification_code}) // success||fail
		workflow[login].status = result
	}
});
//profile_main
app.get('/profile', function(req,res) {
	res.sendFile(path.join(__dirname+'/out/profile.html'));
});
app.get('/api/profile_data',async function(req,res){
	let login = req.query.login
	let profile_data;
	
	db.profiles.find({login}, (err, res)=>{
		profile_data = res[0];
	})
	while(!profile_data){
		await new Promise(resolve=> setTimeout(resolve,100))
	}
	res.send(profile_data);
});
app.get('/api/scraped_accounts',async function(req,res){
	let scraped_accounts;
	
	db.scraped_accounts.find({},(err, res)=>{
		scraped_accounts = res;
	})
	while(!scraped_accounts){
		await new Promise(resolve=> setTimeout(resolve,100))
	}
	res.send(scraped_accounts);
});
app.get('/api/manage_followers_list',async function(req,res) {
	let login = req.query.login;
	let arr = req.query.arr;
	let followers_list = arr.split('|')
	db.profiles.update({login},{ $set: {followers_list}})
	res.send('');
});
app.get('/api/delete_profile',async function(req,res) {
	let login = req.query.login;
	await remove(__dirname+'/data/chrome_profiles/'+login, function(err){
    if (err) console.error(err);
    else     console.log('success!');
	});
	console.log()
	db.profiles.remove({login},{})
	db.profiles_temp.remove({login},{})
	//delete chrome profile folder

	// remove('/home/esr', function(err){
  //   if (err) console.error(err);
  //   else     console.log('success!');
	// });
	res.send('');
});
//start following
app.get('/api/start_following', function(req,res) {
	let login = req.query.login
	let ig_profile = new Instagram_profile(login);
	ig_profile.followAll()
	let text = 'Started followAll() at ' + login;
	console.log(text)
	res.send('')
});
//scrape
app.get('/scraper',function(req,res){
	res.sendFile(path.join(__dirname+'/out/scraper.html'));
});
app.get('/api/scrape',async function(req,res){
	let login = req.query.login
	let profile;
	db.profiles.find({login}, (err,objs)=>{
		profile = objs[0]
	})
	while(!profile)await new Promise(resolve=>setTimeout(resolve, 1000));
	let ig_profile = new Instagram_profile(profile.login);
	ig_profile.getFollowers(req.query.acc_to_scrape)
	let text = 'Started to scrape '+ req.query.acc_to_scrape+ ' using ' + profile.login;
	res.send(text)
});

//redirect page
app.get('/redirect_page', function(req,res){
	let page = req.query.page
	let text = req.query.text
	//if autoredirect, or manual redirect on page
	//plus redirect time, default 5 sec
	res.render('redirect', {
		locals: {
			title: 'redirect',
			page: page,
			text:text
		},
	});
})


//profiles section

app.get('/profile_settings', function(req,res){
	let id = req.query.id
	let profile = Profiles[id]
	let init_data = require('./profiles/'+profile.name+'/profile_temp_files.json')
	if (!!req.query.settings){
		//accept form
	}else{
		profile.id = id
		res.render('profile_settings', {locals: {
			profile: profile,
			title: profile.name,
			fields: fields
		}});
	}

})
app.get('/profile_manage_subscribe_list', function(req,res) {
	let id = req.query.id
	//if submitting form
	if (!!req.query.accounts){
		let accs = req.query.accounts
		let init_data = require('./profiles/'+Profiles[id].name+'/profile_temp_files.json')
		accs.map(el=>{
			let acc_data = require('./scraped_accounts/'+el+'.json')
			acc_data.scraped.map(zel => {
				//check if already inside of it
				if (!init_data.need_to_subscribe.includes(zel) 
					&& !init_data.was_subscribed_to.includes(zel)
					&& zel !==  Profiles[id].name){
					init_data.need_to_subscribe.push(zel);
				}
			})
		})
		let template_ = JSON.stringify(init_data, null, 2)
		fs.writeFileSync('./profiles/'+Profiles[id].name+'/profile_temp_files.json', template_);
		let text = 'Successfully managed'
		res.redirect('/redirect_page?page=/profiles?id='+id+'&text='+text)
	} else {
		let profile = Profiles[id]
		let scraped_accounts = files = fs.readdirSync('./scraped_accounts').map(el=>el.split('.json')[0])
		profile.id = id
		res.render('profile_manage_subscribe_list', {locals: {
			profile: profile,
			title: profile.name,
			scraped_accounts: scraped_accounts
		}});
	}
});
app.get('/start_following', function(req,res) {
	let id = req.query.id
	let profile = new Instagram_profile(Profiles[id].name);
	profile.follow_all();
	let text = 'Started to follow using ' + Profiles[id].name
	res.redirect('/redirect_page?page=/profiles?id='+id+'&text='+text)
});
app.get('/scrape',function(req,res){
	if (!!req.query.acc_to_scrape){
		let id = req.query.user_acc
		let profile = new Instagram_profile(Profiles[id].name);
		profile.get_followers(req.query.acc_to_scrape)
		let text = 'Started to scrape '+ req.query.acc_to_scrape+ ' using ' + Profiles[id].name
		res.redirect('/redirect_page?page=/&text='+text)
	} else {
		res.render('scrape', {locals: {
			title: 'Get followers from',
			profiles: Profiles}
		});
	}
});

async function main(){
	// workflow = new Workflow();
	app.listen(process.env.PORT || 5000, "0.0.0.0",function() {
		console.log('Application worker ' + process.pid + ' started...');
	});
};
main();
