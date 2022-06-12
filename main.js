
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

function add_endtime(timers, form) {
	var timer_id = timers.reduce((max, timer) => timer.timer_id > max ? timer.timer_id : max, -1);
	timer_id++;
	var now = Date.now()
	var newend = new Date();
	newend.setHours(parseInt(form.endtime.value.substr(0, 2), 10), parseInt(form.endtime.value.substr(3, 5), 10));
	if (newend <= now) {
		// try again tomorrow 
		newend = new Date();
		newend.setDate(newend.getDate() + 1);
		newend.setHours(parseInt(form.endtime.value.substr(0, 2), 10), parseInt(form.endtime.value.substr(3, 5), 10));
	}

	newend.setSeconds(0);
	newend.setMilliseconds(0);
	newend = newend.getTime();

	timers.push({timer_id: timer_id, start: now, end: newend});
	c14n_timers(timers);
}

function add_countdown(timers, hours, minutes, popular) {
	var timer_id = timers.reduce((max, timer) => timer.timer_id > max ? timer.timer_id : max, -1);
	timer_id++;
	var now = Date.now();
	//var hours = parseInt(form.hours.value, 10);
	//var minutes = parseInt(form.minutes.value, 10);
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
	console.log("countdown", JSON.stringify(countdown));
	i = countdown.findIndex((item) => item[0][0] == hours && item[0][1] == minutes);
	console.log("i", i);
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

// Register service worker to control making site work offline
// This doesn't work??
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

