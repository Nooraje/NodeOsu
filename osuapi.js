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
        //console.log(beatmaplink)
        //console.log(score)
        return perfCalc
    })
}

function num_to_mod(num) {
    data = []
    if(num == 0) data.push("No Mod,") 
    return data
}

function get_rank_emote(rank) {
    if(rank == "A") {
        return "<:A_Emote:783829607982956565>"
    }
    if(rank == "B") {
        return "<:B_Emote:783829608222425138>"
    }
    if(rank == "C") {
        return "<:C_Emote:783829608235401216>"
    }
    if(rank == "F") {
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
        console.log(beatmaplink)
        //console.log(score)
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
    get_miss_emote
}