const rp = require('request-promise');
const config = require("./jsons/configs.json")
const {
	Beatmap,
	Osu: {
		DifficultyCalculator,
		PerformanceCalculator
	}
} = require('osu-bpdpc')
var ojsama = require("ojsama");
api_key = config.osuapikey
base_api = "https://osu.ppy.sh/api/"
recent_api_url = `${base_api}` + "get_user_recent"
user_api_url = `${base_api}` + "get_user"
beatmap_api_url = `${base_api}` + "get_beatmaps"
user_best_url = `${base_api}` + "get_user_best"
beatmap_scores = `${base_api}` + "get_scores"

function get_user(username) {
	user_url = `${user_api_url}?k=${api_key}&u=${username}`
	return rp(user_url).then(body => {
		try {
			obj = JSON.parse(body)
			return obj;
		} catch {
			return []
		}
	});
}

function get_user_recent(username) {
	recent_url = `${recent_api_url}?k=${api_key}&u=${username}`
	return rp(recent_url).then(body => {
		try {
			obj = JSON.parse(body)
			return obj;
		} catch {
			return []
		}
	});
}

function get_user_best(username) {
	get_user_best_url = `${user_best_url}?k=${api_key}&u=${username}`
	return rp(get_user_best_url).then(body => {
		try {
			obj = JSON.parse(body)
			return obj;
		} catch {
			return []
		}
	});
}

function get_beatmap(beatmapid, mods) {
	beatmap_url = `${beatmap_api_url}?k=${api_key}&b=${beatmapid}&mods=${mods}`
	return rp(beatmap_url).then(body => {
		try {
			obj = JSON.parse(body)
			return obj;
		} catch {
			return []
		}
	});
}

function get_pp(beatmapid, acc_percent, combo, nmiss, mods) {
	beatmaplink = `https://osu.ppy.sh/osu/${beatmapid}`
	var parser = new ojsama.parser();
	return rp(beatmaplink).then(body => {
		parser.feed(body)
		var map = parser.map;;
		var stars = new ojsama.diff().calc({
			map: map,
			mods: mods
		});
		var pp = ojsama.ppv2({
			stars: stars,
			combo: combo,
			nmiss: nmiss,
			acc_percent: acc_percent,
		});
		var max_combo = map.max_combo();
		combo = combo || max_combo;
		console.log(pp.toString());
		return pp.total.toFixed(0)
	})
}

function get_if_fc_pp(beatmapid, acc_percent, combo, mods) {
	beatmaplink = `https://osu.ppy.sh/osu/${beatmapid}`
	var parser = new ojsama.parser();
	return rp(beatmaplink).then(body => {
		parser.feed(body)
		var map = parser.map;
		var stars = new ojsama.diff().calc({
			map: map,
			mods: mods
		});
		var pp = ojsama.ppv2({
			stars: stars,
			combo: combo,
			nmiss: 0,
			acc_percent: acc_percent,
		});
		var max_combo = map.max_combo();
		combo = combo || max_combo;
		console.log(pp.toString());
		return pp.total.toFixed(0)
	})
}

function num_to_mod(num) {
	data = []
	if (num == 0) data.push("No Mod")
	if (num & 1 << 0) data.push("NF")
	if (num & 1 << 1) data.push("EZ")
	if (num & 1 << 2) data.push("TD")
	if (num & 1 << 3) data.push("HD")
	if (num & 1 << 4) data.push("HR")
	if (num & 1 << 5) data.push("SD")
	if (num & 1 << 7) data.push("RX")
	if (num & 1 << 8) data.push("HT")
	if (num & 1 << 9) {
		data.push("NC")
	} else if (num & 1 << 6) {
		data.push("DT")
	}
	if (num & 1 << 10) data.push("FL")
	if (num & 1 << 12) data.push("SO")
	if (num & 1 << 14) data.push("PF")
	if (num & 1 << 20) data.push("FI")
	if (num & 1 << 29) data.push("v2")
	return data
}

function num_to_num_but_diff_increase_mods_only(number) {
	total = 0
	if (number & 1 << 4) {
		total += 1 << 4
	}
	if (number & 1 << 1) {
		total += 1 << 1
	}
	if (number & 1 << 9) {
		total += 1 << 6
	} else if (number & 1 << 6) {
		total += 1 << 6
	}
	if (number & 1 << 8) {
		total += 1 << 8
	}
	return total
}

function get_rank_emote(rank) {
	if (rank == "A") {
		return "<:A_Emote:649752233226928131>"
	}
	if (rank == "B") {
		return "<:B_Emote:649752243259703317>"
	}
	if (rank == "C") {
		return "<:C_Emote:649752253883744265>"
	}
	if (rank == "D") {
		return "<:D_Emote:649752265095380993>"
	}
	if (rank == "XH") {
		return "<:SSH_Emote:649752313677873184>"
	}
	if (rank == "X") {
		return "<:SS_Emote:649752304357998632>"
	}
	if (rank == "SH") {
		return "<:SH_Emote:649752294665093140>"
	}
	if (rank == "S") {
		return "<:S_Emote:649752285613785121>"
	}
	if (rank == "F") {
		return "<:F_Emote:783826073997148202>"
	}
}

function accuracyCalc(c300, c100, c50, misses) {
	var totalHits = c300 * 1 + c100 * 1 + c50 * 1 + misses * 1;
	var accuracy = 0.0;
	if (totalHits > 0) {
		accuracy = (c50 * 50.0 + c100 * 100.0 + c300 * 300.0) / (totalHits * 300.0) * 100;
	}
	return accuracy.toFixed(2)
};

function randomnumber(x) {
	return Math.floor(Math.random() * x);
}

function get_fifty_emote() {
	return "<:50_emote:783826074118127636>"
}

function get_onehundred_emote() {
	return "<:100_Emote:783826074135429150>"
}

function get_miss_emote() {
	return "<:Miss_Emote:783826074052067369>"
}

function secondto(second) {
	total_minutes = second / 60
	total_hours = total_minutes / 60
	total_days = total_hours / 24
	total_months = total_days / 30
	total_years = total_months / 12
	if (second < 30) {
		return "Submitted **Just Now**"
	} else if (second < 60) {
		return `**${parseInt(second)} seconds** ago`
	} else if (total_minutes < 60) {
		return `**${parseInt(total_minutes)} minutes** ago`
	} else if (total_hours < 24) {
		return `**${parseInt(total_hours)} hours** ago`
	} else if (total_days < 30) {
		return `**${parseInt(total_days)} days** ago`
	} else if (total_months < 12) {
		if (total_days - parseInt(total_months) * 30 >= 5) {
			return `**${parseInt(total_months)} months ${parseInt(total_days) - parseInt(total_months) * 30} days** ago`
		} else {
			return `**${parseInt(total_months)} months** ago`
		}
	} else {
		if (total_months - parseInt(total_years) * 12 >= 1) {
			return `**${parseInt(total_years)} years ${parseInt(total_months - parseInt(total_years) * 12)} months** ago`
		} else {
			return `**${parseInt(total_years)} years** ago`
		}
	}
}

function range(start, stop, step) {
	if (typeof stop == 'undefined') {
		// one param defined
		stop = start;
	}
	if (typeof step == 'undefined') {
		step = 1;
	}
	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}
	var result = [];
	for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}
	return result;
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
	randomnumber,
	get_user,
	get_user_recent,
	get_user_best,
	get_pp,
	accuracyCalc,
	get_if_fc_pp,
	get_beatmap,
	num_to_mod,
	get_rank_emote,
	get_onehundred_emote,
	get_fifty_emote,
	get_miss_emote,
	secondto,
	range,
	sleep,
	num_to_num_but_diff_increase_mods_only
}