const rp = require('request-promise');
const config = require("./jsons/configs.json")
const { Beatmap, Osu: { DifficultyCalculator, PerformanceCalculator } } = require('osu-bpdpc')

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

function get_pp(beatmapid, maxcombo, count50, count100, count300, countMiss, countKatu, countGeki, perfect, mods) {
    beatmaplink = `https://osu.ppy.sh/osu/${beatmapid}`
    return rp(beatmaplink).then(osu => {
        let beatmap = Beatmap.fromOsu(osu)
        let score = {
            maxcombo: maxcombo,
            count50: count50,
            count100: count100,
            count300: count300,
            countMiss: countMiss,
            countKatu: countKatu,
            countGeki: countGeki,
            perfect: perfect,
            mods: mods,
        }
        diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate()
        perfCalc = PerformanceCalculator.use(diffCalc).calculate(score).totalPerformance.toFixed(2)
        console.log(beatmaplink)
        console.log(score)
        return perfCalc
    })
}

function randomnumber(x) {
    return Math.floor(Math.random() * x);
}

module.exports = {
    randomnumber,
    get_user,
    get_user_recent,
    get_pp
}