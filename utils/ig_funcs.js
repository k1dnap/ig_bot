const puppeteer = require('puppeteer');
const fs = require('fs');


workflow = {}
module.exports = class Instagram_profile{
	constructor(name){
		this.name = name;
		this.login = name;
		// this.data = require('./profiles/'+name+'/profile_temp_files.json');
		//get this from this.data, bcs it'll be managed through settings
		// this.follow_limit = 40;
		// this.active_follows_limit = 1400;

		//
		this.browser = null;
		this.page = null;
	}
	async runBrowser(params = {}) {
		let args = [
			'--no-sandbox'
		]
		let browser = await puppeteer.launch({
			headless: params.test? false : true,
			userDataDir: "./data/chrome_profiles/"+this.name,
			args: args
		});
		let page = (await browser.pages())[0];
		const fakeDevice = puppeteer.devices['iPhone 6'];
		await page.emulate(fakeDevice);
		this.browser = browser;
		this.page = page;
		// await page.goto('https://instagram.com')
		return
	}
	async closeBrowser(params = {}) {
		await this.browser.close();
		this.browser = null;
		this.page = null;
		return
	}
	async createProfile(params = {}){
		await this.runBrowser({test:true});
		if (!params.password){
			return console.log('no password presented')
		}
		let login = this.name;
		let password = params.password;
		let page = this.page;
		await page.goto('https://www.instagram.com/accounts/login/');
		await page.waitFor('input[name=username]', { visible: true });
		await new Promise(resolve => setTimeout(resolve, 500));// sleep 0.5 sec
		await page.type('input[name=username]', login, { delay: 50 })
		await new Promise(resolve => setTimeout(resolve, 500));// sleep 0.5 sec
		await page.type('input[name=password]', password, { delay: 50 })
		await new Promise(resolve => setTimeout(resolve, 500));// sleep 0.5 sec
		await page.evaluate( ()=>{
			document.querySelector('form').querySelectorAll('button')[2].click()
		})

		await new Promise(resolve => setTimeout(resolve, 5000));// sleep 5 secs
		let result;
		if (page.url().includes('challenge')){ 
			console.log('you have 120 secs to submit the verification in opened browser, after, it`ll be closed')
			result = 'verify'
		} else if (page.url().includes('accounts/login')) {
			console.log('invalid user_name or password, after, it`ll be closed')
			result = 'fail'
		} else {
			console.log('success')
			result = 'success'
		}
		if (result !== 'verify'){
			await this.closeBrowser();
		}
		return result
	}
	async sendVerificationCode(){
		let page = this.page;
		await page.evaluate(()=>{
			document.querySelectorAll('button')[1].click();
		})
	}
	async verifyProfile(params ={}){
		if (!params.verification_code){
			return console.log('no verification_code presented')
		}
		let verification_code = params.verification_code;
		await page.type('#security_code', verification_code, { delay: 50 })
		await new Promise(resolve => setTimeout(resolve, 500));// sleep 0.5 sec
		await page.evaluate( ()=>{
			document.querySelector('form').querySelector('button').click()
		})
		await new Promise(resolve => setTimeout(resolve, 5000));// sleep 0.5 sec

		// #check_if_code is correct
	}
	async loadSettings(){
		let settings;
		db.profiles.find({login:this.name},(err,objs)=>{
			settings = objs[0];
		})
		while(!settings) await new Promise(resolve=>setTimeout(resolve, 200) )
		this.settings = settings;
		return;
	}
	async loadTempData(){
		let temp;
		db.profiles_temp.find({login:this.name}, (err,objs)=>{
			if (objs.length === 0){
				temp = {
					login: this.name,
					currently_subscribed_to: [],
					was_subscribed_to: []
				}
			} else {
				temp = objs[0]
			}

		})
		while(!temp) await new Promise(resolve=>setTimeout(resolve, 200) )
		this.need_to_subscribe = [];
		await Promise.all(this.settings.followers_list.map(async login=>{
			let accounts_list;
			db.scraped_accounts_all.find({ from: { $in: [login] }},(err,objs)=>{
				if (objs.length !== 0){
					objs.map(acc=>{
						if (!temp.was_subscribed_to.includes(acc)) this.need_to_subscribe.push(acc.login);
					})
				}
				accounts_list = true;
			})
			while(!accounts_list) await new Promise(resolve=>setTimeout(resolve, 200) )
		}))
		this.temp = temp;
		//this.need_to_subscribe
		return
	}
	//find why it doesn't displays edges using headless browser
	async getFollowers(from) {
		console.log('getting followers from: ' +from+ ` using `+ this.name)
		if (!this.browser){
			// await this.runBrowser();
			await this.runBrowser({test:true});
		}
		let browser = this.browser;
		let page = this.page;
		let default_account_data = {
			from: from,
			last_query: null,
		} 
		//load account data
		let account_data;
		db.scraped_accounts.find({from},(err,objs)=>{
			if(objs.length === 0) account_data = default_account_data
			else account_data = objs[0]
		})
		while(!account_data)await new Promise(resolve=>setTimeout(resolve, 200));

		await page.goto('https://www.instagram.com/'+from+'/?__a=1')
		let id = await page.evaluate(()=>{
			return JSON.parse(document.querySelector("body").textContent).logging_page_id.split('_')[1]
		})
		//start of scraping stuff
		let has_next = true;
		while(has_next === true){ // start of while cycle
			// if there is no browser
			if (!this.browser){
				await this.runBrowser({test:true});
				browser = this.browser;
				page = this.page;
			}
			let acc_URL;//used in page.goto()
			// if it's its first iteration
			if (!account_data.last_query) {
				acc_URL = 'https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B"id"%3A"'+id+'"%2C"include_reel"%3Atrue%2C"fetch_mutual"%3Atrue%2C"first"%3A24%7D';
			} else {
				acc_URL = 'https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B"id"%3A"'+id+'"%2C"include_reel"%3Atrue%2C"fetch_mutual"%3Afalse%2C"first"%3A12%2C"after"%3A"'+account_data.last_query+'"%7D';				
			}
			await page.goto(acc_URL);
			let data = await page.evaluate(()=>{ return JSON.parse(document.querySelector("body").textContent) });
			try {
				data = data.data.user.edge_followed_by			
			} catch (error) {
				// there are 2 variants, or it's banned or json is broken?
				console.log('smth wrong with JSON object, probably youre banned for 20 minutes at '+ new Date())
				console.log(data)
				console.log(error)
				await this.close_browser();
				await new Promise(resolve => setTimeout(resolve, 1000*60*20));// sleep for 20 minutes
				continue;

			}
			has_next = data.page_info.has_next_page
			if (has_next === true){
				account_data.last_query = data.page_info.end_cursor
			}
			let scraped_data = data.edges.map(el=> el.node.username)
			await Promise.all(scraped_data.map(async el => {
				let acc;
				db.scraped_accounts_all.find({login:el}, (err,objs)=>{
					acc = objs.length == 0? 'not_exists' : acc=objs[0]
				})
				while (!acc) await new Promise(resolve=> setTimeout(resolve, 200));
				if(acc ==='not_exists'){
					acc = {login:el, from:[from]}
				} else {
					acc.from.push(from)
				}
				db.scraped_accounts_all.update({login:el}, acc,{upsert:true})
			}))
			// account_data.save()
			db.scraped_accounts.update({from}, account_data, {upsert: true})
			// fs.writeFileSync('./scraped_accounts/'+from+'.json', JSON.stringify(account_data,null,2) );
			// accounts_all.save()
			// fs.writeFileSync('./accounts_all.json', JSON.stringify(accounts_all,null,2));
			console.log(this.name + ' scraped ' + scraped_data.length +' elements from '+ from + ' at '+ new Date())


		} // end of while cycle
		console.log('get_followers() from: '+from+'\nDone at '+ new Date())
		await this.closeBrowser();
	}
	async followAll(){
		let finished;
		await this.loadSettings();
		await this.loadTempData();
		if(this.settings.follow!== true){
			this.settings.follow = true;
			//update settings
			let update_settings = this.settings;
			db.profiles.update({login:this.name}, update_settings, {upsert:true})
		}
		
		while (!finished) {

			if (this.settings.today_cycles > 10){
				console.log('exceed today cycles, sleep 1 hour till ready to start')
				await new Promise(resolve=>setTimeout(resolve,1000*60*1))
				continue;
			}
			//load browser if needed
			if(!this.browser) await this.runBrowser({test:true});
			//block images
			let page = this.page;
			await page.setRequestInterception(true);
			page.on('request', request => {
				if (request.resourceType() === 'image')
					request.abort();
				else
					request.continue();
			});
			//
			while (this.temp.currently_subscribed_to.length >= this.settings.active_follows_limit){
				console.log('active_follows_limit is bigger, unfollowing')
				try {
					await this.unfollowOne()
				} catch (error) {
					console.log(error)
					break
				}
				// await this.unfollow(this.data.currently_subscribed_to.shift())
			}
			let launched;
			while (this.temp.currently_subscribed_to.length < this.settings.active_follows_limit && this.need_to_subscribe.length!== 0){
				launched = true;
				console.log('active_follows_limit is less, following')
				try {
					await this.followOne()
				} catch (error) {
					console.log(error)	
					console.log('sleep for 10 hours')
					await new Promise(resolve => setTimeout(resolve, 1000*60*60*10)) //sleep 10 hours
					break;
				}				
			}
			if (launched){
				this.settings.today_cycles++
				//save temp
				let update_temp = this.temp;
				db.profiles_temp.update({login:this.name}, update_temp, {upsert:true})
				//save settings
				let update_settings = this.settings;
				db.profiles.update({login:this.name}, update_settings, {upsert:true})
			}
			if( this.need_to_subscribe.length === 0){
				this.settings.follow = false;
				//save settings
				let update_settings = this.settings;
				db.profiles.update({login:this.name}, update_settings, {upsert:true})
			} else {
				await new Promise(resolve=>setTimeout(resolve, 1000*60*60)) // sleep 1h
			}
		}
	}
	async followOne(){
		let item = this.need_to_subscribe.shift();
		// if()
		let page = this.page;

		let errr = false;
		await page.goto("https://www.instagram.com/"+item, { timeout: 30000 }).catch(e => {
			console.error(e);
			this.need_to_subscribe.unshift(item);
			errr = true;
		})
		if (errr === true){
			return;
		}
		let page_broken = await page.evaluate(()=>{
			return document.querySelector('body').getAttribute('class').includes('404')
		})
		if (page_broken === true){
			console.log(`just skip it!`)
			return;
		}
		let status = await page.evaluate( ()=>{
			elem = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelector('button')
			compStyles = window.getComputedStyle(elem);
			if (compStyles.backgroundColor === "rgba(0, 0, 0, 0)"){
				//subscribed or have a msg
				return false;
			} else {
				//click
				elem.click()
				return true;
			}
		})
		if (status === true){
			await new Promise(resolve => setTimeout(resolve, 1000*4)) //sleep 4 secs after clicking on button
			//$ add checker for it, 
			let subscribed = await page.evaluate(()=>{
				elem = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelector('button')
				compStyles = window.getComputedStyle(elem);
				if (compStyles.backgroundColor !== "rgba(0, 0, 0, 0)"){
					//subscribed or have a msg
					return false;
				} else {
					return true;
				}
			})
			//if not subscribed after clicking button
			if (subscribed === false){
				console.log('nothing happend after clicking "follow" button, mostlikeley you`re banned, '+ somenum + ' done')
				this.data.need_to_subscribe.unshift(item);
				throw 'mostlikeley banned';

			}
			console.log(this.name +' successfully subscribed to '+ item)
			this.temp.currently_subscribed_to.push(item);
		} else{
			console.log(this.name +' already subscribed to '+ item)
			this.temp.currently_subscribed_to.push(item);
			await new Promise(resolve => setTimeout(resolve, 1000*2)) //sleep 2 secs after clicking on button
		}
		this.temp.was_subscribed_to.push(item);
		//update profile's temp after each cycle
		let update_temp = this.temp;
		db.profiles_temp.update({login:this.name}, update_temp, {upsert:true})
		
	}
	async unfollowOne(){
		let browser = this.browser;
		let page = this.page;
		let id = this.temp.currently_subscribed_to.shift();
		console.log(this.name+ ` unfollowing `+ id)
		await page.goto('https://instagram.com/'+id)
		let page_broken = await page.evaluate(()=>{
			return document.querySelector('body').getAttribute('class').includes('404')
		})
		if (page_broken === true){
			console.log(`just skip it!`)
			return;
		}
		let result = await page.evaluate( ()=>{
			elem = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelector('button')
			compStyles = window.getComputedStyle(elem);
			if (compStyles.backgroundColor === "rgba(0, 0, 0, 0)"){
				if (document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelectorAll('button').length === 1){
					click_button = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelector('button')
				} else {
					click_button = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelectorAll('button')[1]
				}
				click_button.click()
				//subscribed
				return false;
			} else {
				//not subscribed
				return true;
			}
		})
		if (result !== true){
			await new Promise(resolve => setTimeout(resolve, 1000*1)) //sleep 1 sec after clicking on button
			await page.evaluate( ()=>{
				Array.from(document.querySelectorAll('div')).filter( el=> el.getAttribute('role') == 'dialog')[0].querySelector('button').click()
			})
			await new Promise(resolve => setTimeout(resolve, 1000*1)) //sleep 1 sec after clicking on button
		} else{ 
			console.log('youre already unfollowing him')
		}
		//check if really unsubscribed
		let subscribed = true; //default
		if(result !== true){
			await page.goto('https://instagram.com/'+id)
			subscribed = await page.evaluate( ()=>{
				elem = document.querySelector("#react-root > section > main > div > header > section").querySelectorAll('div')[2].querySelector('button')
				compStyles = window.getComputedStyle(elem);
				if (compStyles.backgroundColor === "rgba(0, 0, 0, 0)"){
					//subscribed
					return false;
				} else {
					//not subscribed
					return true;
				}
			})
			if(!subscribed)this.temp.currently_subscribed_to.unshift(id);
		}
		let update_temp = this.temp;
		db.profiles_temp.update({login:this.name}, update_temp, {upsert:true})
		if(!subscribed)throw 'reached unfollow limit'
	}
}
async function main() {
	let profile = new Instagram_profile('vliuvh');
	await profile.get_followers('hh_ru')
	await profile.follow_all()
	// await profile.unfollow(profile.data.currently_subscribed_to.shift())
	console.log('main_done')

}
// main()	

