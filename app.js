// imports
const { info, Console } = require('console')
const { response } = require('express')
const express = require('express')
const app = express()
const port = 1234
const mysql = require('mysql')
const fetch = require("node-fetch")
const { cpuUsage } = require('process')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const api_lol_key = ' RGAPI-9bf99511-c90f-425c-bdf6-afc1f4db2d93'


var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "EfreiElo"
})

db.connect(function(err) {
    if(err) throw err;
    console.log("Connected to DB")
})

// Listen on port 3000
app.listen(port,() => console.info(`Lisenting on port ${port}`))

app.use(express.static('views'))
app.use('views', express.static(__dirname + 'views'))


// Set Views
app.set('views','./views')
app.set('view engine','ejs')

//const step_1_request = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${api_lol_key}`
//const step_2_request = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${EncryptedID}?api_key=${api_lol_key}`

async function get_player_data_step1(summoner) {   
    const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(summoner)}?api_key=${api_lol_key}`);
    return response
    
} 
async function get_player_data_step2(encryptedID) {
    const response = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedID}?api_key=${api_lol_key}`)
    return response
}
function soloq_over_flex(data) {
    if(data[0] === undefined || data[0].length == 0 ||data[0] == "error") {
        return 'error'
    } else {
        if(data[0].queueType == "RANKED_SOLO_5x5") {
            return 0
        } else if (data[1] === undefined || data[1].length == 0 || data[1] == "error") {
            return "error"
        } else {
            return 1
        }
    }
}
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
async function update_data_players(summoner) {
    get_player_data_step1(summoner)
    .then(response => {
        if(response['status'] != 200 ) {
            console.log("ERROR API " + response['status'])
            return "error"
        } else {
            return response.json()
        }
    })   
    .then(data => {
        let sql = `UPDATE info_players SET lvl = '${data.summonerLevel}', icone ='${data.profileIconId}' WHERE accountID = '${data.id}'`
        let query = db.query(sql,function (err, result) {
            if (err) throw err;
        })
        get_player_data_step2(data.id)
        .then(response => {
            if(response['status'] != 200 ) {
                console.log("ERROR API " + response['status'])
                return "error"
            } else {
                return response.json()
            }
        })
        .then(data2 => {
            let i = soloq_over_flex(data2)
            if(i != "error") {
                let winrate =  data2[i].wins / (data2[i].losses + data2[i].wins) * 100           
                let sql =` UPDATE info_players SET tier = '${data2[i].tier}', rank_ok = '${data2[i].rank}', lp = ${data2[i].leaguePoints}, wins = ${data2[i].wins}, looses = ${data2[i].losses}, winrate = ${winrate} WHERE accountID = '${data2[i].summonerId}'`;
                let query = db.query(sql,function(err, result) {
                    if (err) throw err;
                })
            }
                     
        })
    })
}
async function get_data_outside_scope(data,summoner) {
    let check_sql = `SELECT nom_invocateur FROM info_players WHERE nom_invocateur = '${summoner}'`;
    let query_check = await db.query(check_sql,function(err, result) {
        if (err) throw err;
        if (result != "") {
            console.log("USER " + summoner + " ALREADY EXISTS");
        } else {
            console.log(data)
            let sql = `INSERT INTO info_players (nom_invocateur,accountID,icone,lvl) VALUES ('${summoner}','${data.id}','${data.profileIconId}','${data.summonerLevel}')`;
            let query = db.query(sql, function (err,result) {
                if (err) throw err;
                console.log("User " + summoner + " was inserted in database");
            })
        }
    })
    get_player_data_step2(data.id)
    .then(response => {
        if(response['status'] != 200 ) {
            console.log("ERROR API " + response['status'])
            return "error"
        } else {
            console.log("working")
            return response.json()
        }
    })
    .then(data => {
        //console.log(data)
        if(data != "error" && isEmpty(data) == false) {
            let i = soloq_over_flex(data)
            let winrate = data[i].wins / (data[i].losses + data[i].wins) * 100
            let sql =` UPDATE info_players SET tier = '${data[i].tier}', rank_ok = '${data[i].rank}', lp = ${data[i].leaguePoints}, wins = ${data[i].wins}, looses = ${data[i].losses}, winrate = ${winrate} WHERE accountID = '${data[i].summonerId}'`;
            let query = db.query(sql, function(err, result) {
                if (err) throw err;
            })
        }
        
        
    })
}
async function insert_database_player_info(summoner) {
    await get_player_data_step1(summoner)
    .then(response =>  {
        if(response['status'] != 200) {
            console.log("ERROR API " + response['status'])
            return "error"
        } else {
            return response.json()
        }
        
    })  
    .then(data => {
        if(data != "error") {
            get_data_outside_scope(data,summoner)
        }
        
    }) 
}
function encode_using_utf8(summoner) {   
    return encodeURI(summoner)
}
function summoner_info_sql_to_dict(info_players_query) {
    var info_players = []
    info_players_query.forEach(element => {
        var dict = {
            nom_invocateur: "",
            lvl: "",
            icone: "",
            elo: "",
            rank: "",
            tier: "",
            winrate: ""
        };
        dict.nom_invocateur = element.nom_invocateur;
        dict.lvl = element.lvl;
        dict.icone = `http://ddragon.leagueoflegends.com/cdn/11.3.1/img/profileicon/${element.icone}.png`;
        if(element.rank_ok == null) {
            dict.rank = "UNRANKED"
            dict.winrate = "UNRANKED"
        } else {
            dict.rank = element.rank_ok
            dict.winrate = element.winrate + " %"
        }
        dict.elo = 0
        switch(element.tier) {
            case 'CHALLENGER':
                dict.elo = 2400
                break;
            case 'GRANDMASTER':
                dict.elo = 2400
                break;
            case 'MASTER':
                dict.elo = 2400
                break;
            case 'DIAMOND':
                dict.elo = 2000
                break;
            case 'PLATINUM':
                dict.elo = 1600
                break;
            case 'GOLD':
                dict.elo = 1200
                break;
            case 'SILVER':
                dict.elo = 800
                break;
            case 'BRONZE':
                dict.elo = 400
                break;
            case 'IRON':
                dict.elo = 0
                break;
        }
        switch(element.rank_ok) {
            case'III':
                dict.elo += 100
                break;
            case 'II':
                dict.elo += 200
                break;
            case 'I':
                if(element.tier != "CHALLENGER" && element.tier != "GRANDMASTER" && element.tier != "MASTER") {
                    dict.elo += 300
                }
                break;
        }
        dict.elo += element.lp
        dict.tier = element.tier;
        info_players.push(dict);
    });
    return sort_players_descending(info_players);
}
function update_all_players(info_players) {
    NbRequest = 0
    info_players.forEach(element => {
        console.log(element.summoner)
    })
}
function sort_players_descending(info_players){
    var changed;
    do{
        changed = false;
        for(var i=0; i < info_players.length-1; i++) {
            if(info_players[i].elo < info_players[i+1].elo) {
                var tmp = info_players[i];
                info_players[i] = info_players[i+1];
                info_players[i+1] = tmp;
                changed = true;
            }
        }
    } while(changed);
    return info_players;
}
function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );  
  }
async function refresh_all_players(data_players) {
    //console.log(data_players)
    data_players.forEach((element,i) => {   
        setTimeout(() => {
            update_data_players(element.nom_invocateur)
                console.log(element.nom_invocateur + " has been updated")
          }, i * 5000);
       
    })
}
function load_index(req, res) {
    let info_players = [];
    let sql = "SELECT id, nom_invocateur,lvl,icone,elo,rank_ok,tier,winrate,lp FROM info_players"
    let query = db.query(sql, (err, info_players_query, fields) => {
        info_players = summoner_info_sql_to_dict(info_players_query)
        res.render('index',{info_players: info_players}) 
        refresh_all_players(info_players)
    })
    return info_players;
}
app.get('',(req,res) => {
    load_index(req, res)
})

app.get('/register',(req,res) => {
    res.render('register')
})
app.get('/404',(req,res) => {
    res.render('404')
})
app.get('/index',(req,res) => {
   load_index(req, res)
})
app.post('/addplayer', (req, res) => {
    var summoner = req.body.summoner
    insert_database_player_info(summoner)
    res.render('registered',{summoner: summoner})
})
