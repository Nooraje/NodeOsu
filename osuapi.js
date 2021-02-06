const rp = require('request-promise');
const config = require("./jsons/configs.json")
const {
    Beatmap,
    Osu: {
        DifficultyCalculator,
        PerformanceCalculator
    }
} = require('osu-bpdpc')

api_key = config.apikey
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

function get_beatmap(beatmapid) {
    beatmap_url = `${beatmap_api_url}?k=${api_key}&b=${beatmapid}`
    return rp(beatmap_url).then(body => {
        try {
            obj = JSON.parse(body)
            return obj;
        } catch {
            return []
        }
    });
}


function get_pp(beatmapid, maxcombo, count50, count100, count300, countmiss, perfect, mods) {
    beatmaplink = `https://osu.ppy.sh/osu/${beatmapid}`
    return rp(beatmaplink).then(osu => {
        let beatmap = Beatmap.fromOsu(osu)
        let score = {
            maxcombo: maxcombo * 1,
            count50: count50 * 1,
            count100: count100 * 1,
            count300: count300 * 1,
            countMiss: countmiss * 1,
            perfect: perfect * 1,
            mods: mods * 1,
        }
        diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate()
        perfCalc = PerformanceCalculator.use(diffCalc).calculate(score).totalPerformance.toFixed(0)
        return perfCalc
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
    if (num & 1 << 6) data.push("DT")
    if (num & 1 << 7) data.push("RX")
    if (num & 1 << 8) data.push("HT")
    if (num & 1 << 9) data.push("NC")
    if (num & 1 << 10) data.push("FL")
    if (num & 1 << 12) data.push("SO")
    if (num & 1 << 14) data.push("PF")
    if (num & 1 << 20) data.push("FI")
    if (num & 1 << 29) data.push("v2")
    return data
}

function get_rank_emote(rank) {
    if (rank == "A") {
        return "<:A_Emote:783829607982956565>"
    }
    if (rank == "B") {
        return "<:B_Emote:783829608222425138>"
    }
    if (rank == "C") {
        return "<:C_Emote:783829608235401216>"
    }
    if (rank == "F") {
        return "<:F_Emote:783826073997148202>"
    }
}

function get_if_fc_pp(beatmapid, maxcombo, count50, count100, count300, perfect, mods) {
    beatmaplink = `https://osu.ppy.sh/osu/${beatmapid}`
    return rp(beatmaplink).then(osu => {
        let beatmap = Beatmap.fromOsu(osu)
        let score = {
            maxcombo: maxcombo * 1,
            count50: count50 * 1,
            count100: count100 * 1,
            count300: count300 * 1,
            countMiss: 0,
            perfect: perfect * 1,
            mods: mods * 1,
        }
        diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate()
        perfCalc = PerformanceCalculator.use(diffCalc).calculate(score).totalPerformance.toFixed(0)
        return perfCalc
    })
}

function accuracyCalc(c300, c100, c50, misses) {
    var totalHits = c300 * 1 + c100 * 1 + c50 * 1 + misses * 1;
    var accuracy = 0.0;
    if (totalHits > 0) {
        accuracy = (c50 * 50.0 + c100 * 100.0 + c300 * 300.0) /
            (totalHits * 300.0) * 100;
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

    if(second < 30) {
        return "Submitted **Just Now**"
    } else if (second < 60) {
        return `**${second.toFixed(0)} seconds** ago`
    } else if (total_minutes < 60) {
        return `**${total_minutes.toFixed(0)} minutes** ago`
    } else if (total_hours < 24) {
        return `**${total_hours.toFixed(0)} hours** ago`
    } else if (total_days < 30) {
        return `**${total_days.toFixed(0)} days** ago`
    } else if (total_months < 12) {
        return `**${total_moths.toFixed(0)} months** ago`
    }
}

module.exports = {
    randomnumber,
    get_user,
    get_user_recent,
    get_pp,
    accuracyCalc,
    get_if_fc_pp,
    get_beatmap,
    num_to_mod,
    get_rank_emote,
    get_onehundred_emote,
    get_fifty_emote,
    get_miss_emote,
    secondto
}