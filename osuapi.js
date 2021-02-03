const rp = require('request-promise');
const config = require("./jsons/configs.json")

api_key = config.apikey
base_api = "https://osu.ppy.sh/api/"
recent_api_url = `${base_api}` + "get_user_recent"
user_api_url = `${base_api}` + "get_user"
beatmap_api_url = `${base_api}` + "get_beatmaps"
user_best_url = `${base_api}` + "get_user_best"
beatmap_scores = `${base_api}` + "get_scores"

function getuser(username) {
    getuserlink = `${user_api_url}?k=${api_key}&u=${username}`
    return rp(getuserlink).then(body => {
        obj = JSON.parse(body)
        return obj;
    });
}

function randomnumber(x) {
    return Math.floor(Math.random() * x);
}

module.exports = {
    randomnumber,
    getuser
}
