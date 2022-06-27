function console_log(msg) {
	console.log(msg);
	fetch(`/console_log_msg_${Date.now()}_${encodeURIComponent(msg)}`).then(() => {}, () => {});
}

function remove_timer(timers, timer_id) {
	timers.splice(timers.findIndex(item => item.timer_id == timer_id), 1);
}

function c14n_timers(timers) {
	// sort by end
	timers.sort((a,b) => a.end > b.end)

	// remove old
	var now = Date.now();
	var i = -1;
	while (true) {
		i = timers.findIndex(timer => timer.end <= now);
		if ( i == -1 ) { break; }
		timers.splice(i, 1);
		continue;
	}
}

function add_endtime(timers, h_m, popular) {
	hours = parseInt(h_m.substr(0, 2), 10);
	minutes = parseInt(h_m.substr(3, 5), 10);

	var timer_id = timers.reduce((max, timer) => timer.timer_id > max ? timer.timer_id : max, -1);
	timer_id++;
	var now = Date.now()
	var newend = new Date();
	newend.setHours(hours, minutes);
	if (newend <= now) {
		// Adding a time for tomorrow
		newend = new Date();
		newend.setDate(newend.getDate() + 1); 	// This does wrap around the month, I tested
		newend.setHours(hours, minutes);
	}

	newend.setSeconds(0);
	newend.setMilliseconds(0);

	newend = newend.getTime();

	timers.push({timer_id: timer_id, start: now, end: newend});
	c14n_timers(timers);

	if (popular.endtime == undefined ) {
		popular.endtime = [];
	}
	var endtime = popular.endtime;
	for (let i=0; i<endtime.length; i++) {
		endtime[i][1] *= 0.9
	}
	i = endtime.findIndex((item) => item[0][0] == hours && item[0][1] == minutes);
	if ( i == -1 ) {
		endtime.push([[hours, minutes], 1]);
	} else {
		endtime[i][1]++;
	}
	endtime.sort((a, b) => a[1] < b[1])

	// Trim extras
	if (endtime.length > 10) {
		endtime.splice(10, endtime.length-5);
	}
}

function add_countdown(timers, hours, minutes, popular) {
	if (hours == 0 && minutes == 0) {
		return;
	}
	var timer_id = timers.reduce((max, timer) => timer.timer_id > max ? timer.timer_id : max, -1);
	timer_id++;
	var now = Date.now();

	var newend = now + (hours*60*60 + minutes*60)*1000;
	timers.push({timer_id: timer_id, start: now, end: newend});
	c14n_timers(timers);
	if (popular.countdown == undefined ) {
		popular.countdown = [];
	}
	var countdown = popular.countdown;
	for (let i=0; i<countdown.length; i++) {
		countdown[i][1] *= 0.9
	}
	i = countdown.findIndex((item) => item[0][0] == hours && item[0][1] == minutes);
	if ( i == -1 ) {
		countdown.push([[hours, minutes], 1]);
	} else {
		countdown[i][1]++;
	}
	countdown.sort((a, b) => a[1] < b[1])

	// Trim extras
	if (countdown.length > 10) {
		countdown.splice(10, countdown.length-5);
	}
}

function fmt_duration(msec) {
	sec = Math.floor(msec / 1000);
	mins = Math.floor(sec / 60);
	sec %= 60;
	hrs = Math.floor(mins / 60);
	mins %= 60;
	output = "";
	if (hrs > 0) {
		output += `${hrs}h `;
	}
	if (hrs > 0 || mins > 0) {
		output += `${mins}m `;
	}
	if (hrs == 0 && mins < 5) {
		output += `${sec}s `;
	}
	return output;

}

function fraction(total, passed) {
	passed = Math.max(passed, 0);
	if (passed > total) {
		return 0;
	}
	return -Math.log2(1 - (passed/total));
}

function register_sw() {
	console_log("start of register_sw function");
	if (!('serviceWorker' in navigator)) {
		console_log("serviceWorker not supported");
		return;
	}

	navigator.serviceWorker.register('sw.js')
		.then(
			() => { console_log('Service Worker Registered'); },
			(...args) => { console_log("service worker failed "+args);     }
		);
	console_log("end of register_sw function");
}

// Register service worker to control making site work offline
register_sw()
