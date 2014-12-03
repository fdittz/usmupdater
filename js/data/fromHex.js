
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var constants = require('constants');
directory = "";
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


function readLeagues(){}


function readTeams(leaguecode) {
	var teams = new Array()
	teamsFile = fs.readFileSync(directory + "/TEAM" + leaguecode + ".DAT", 'hex') 
	teamsHex = teamsFile.match(/.{1,1342}/g);
	for (var i = 0; i < teamsHex.length; i++) {
		var hexTeamName = teamsHex[i].substring(0,48).replace(/00/g,"");
		var hexCoachName = teamsHex[i].substring(52,100).replace(/00/g,"");
		var hexNickname = teamsHex[i].substring(104,152).replace(/00/g,"");
		var hexStadiumName = teamsHex[i].substring(156,216).replace(/00/g,"");
		var hexFanzine = teamsHex[i].substring(218,266).replace(/00/g,"");
		var hexEditor = teamsHex[i].substring(284,332).replace(/00/g,"");
		var hexAwayColor = teamsHex[i].substring(350,351);
		var hexHomeColor = teamsHex[i].substring(351,352);
		var hexRank = teamsHex[i].substring(352,354);
		var hexDerbyCode = teamsHex[i].substring(358,360);
		var hexCountry = teamsHex[i].substring(376,378);
		var hexDivision = teamsHex[i].substring(378,380);
		var auxHexAttendanceInverted = teamsHex[i].substring(1266,1270);
		var hexAttendance = auxHexAttendanceInverted[2] + auxHexAttendanceInverted[3] + auxHexAttendanceInverted[0] + auxHexAttendanceInverted[1] 




		var hexRecordWinTeam = teamsHex[i].substring(832,834);
		var hexRecordWinScore1 = teamsHex[i].substring(706,708);
		var hexRecordWinScore2 = teamsHex[i].substring(704,706);
		var hexRecordDefeatTeam= teamsHex[i].substring(892,834);


		team = {};
		team.index = i;
		team.name = hex2a(hexTeamName);
		team.coach = hex2a(hexCoachName);
		team.stadium = hex2a(hexStadiumName);
		team.nickname = hex2a(hexNickname);
		team.fanzine = hex2a(hexFanzine);
		team.editor = hex2a(hexEditor);
		team.country = parseInt(hexCountry,16);
		team.division = parseInt(hexDivision,16);
		team.attendance = parseInt(hexAttendance,16);
		team.rank = parseInt(hexRank,16);
		team.homeColor = parseInt(hexHomeColor,16);
		team.awayColor = parseInt(hexAwayColor,16);
		team.derbyCode = parseInt(hexDerbyCode,16);

		//team.records = {};
		//team.records.win = {};


		team.players = [];

		if (team.name != "")
			teams[i] = team

	}
	return teams;
}

function readOtherTeams() {
	var teams = new Array()
	teamsFile = fs.readFileSync(directory + "/TEAMW.DAT", 'hex') 
	teamsHex = teamsFile.match(/.{1,52}/g);
	for (var i = 0; i < teamsHex.length; i++) {
		var hexTeamName = teamsHex[i].substring(0,48).replace(/00/g,"");
		team = {};
		team.index = i;
		team.name = hex2a(hexTeamName);
		team.players = [];
		if (team.name != "")
			teams[i] = team;
	}
	return teams;
}


  	//console.log(teams)
function populateWithPlayers(teams,leaguecode) {
	playersFile = fs.readFileSync(directory + "/PLAYER" + leaguecode + ".DAT", 'hex')
  //console.log(data);
  	var players = playersFile.match(/.{1,374}/g)
  	for (var i = 0; i < players.length; i++) {
  		var hexFirstName = players[i].substring(0,26).replace(/00/g,"");  
  		var hexLastName = players[i].substring(28,54).replace(/00/g,"");
  		var hexBirthDay = players[i].substring(58,60);
  		var hexBirthMonth = players[i].substring(60,62);
  		var hexBirthYear = players[i].substring(62,64);
  		var hexNation = players[i].substring(64,66);
  		if (leaguecode != "W")
  			var hexTeam = players[i].substring(66,68);
  		else
  			var hexTeam = players[i].substring(106,108);  		
  		var hexKp = players[i].substring(288,290);
  		var hexTa = players[i].substring(290,292);
  		var hexPs = players[i].substring(292,294);
  		var hexSh = players[i].substring(294,296);
  		var hexPc = players[i].substring(296,298);
  		var hexHe = players[i].substring(300,302);
  		var hexSt = players[i].substring(302,304);
  		var hexSp = players[i].substring(304,306);
  		var hexBc = players[i].substring(306,308);
  		var hexDevelopment = players[i].substring(316,318);
  		var hexSide = players[i].substring(328,330);
 	  	player = {}; 
	  	player.firstName = hex2a(hexFirstName);
	  	player.lastName = hex2a(hexLastName);
	  	player.birthDay = parseInt(hexBirthDay,16);
	  	player.birthMonth = parseInt(hexBirthMonth,16) + 1;
	  	player.birthYear = parseInt(hexBirthYear,16);
	  	player.birthDate = player.birthDay + "/" + player.birthMonth + "/" + player.birthYear;
	  	player.nation = parseInt(hexNation,16);
	  	player.development = parseInt(hexDevelopment,16);
	  	player.side = parseInt(hexSide,16);
	  	player.skills = {};
	  	player.skills.kp = parseInt(hexKp,16);
	  	player.skills.ta = parseInt(hexTa,16);
	  	player.skills.ps = parseInt(hexPs,16);
	  	player.skills.sh = parseInt(hexSh,16);
	  	player.skills.pc = parseInt(hexPc,16);
	  	player.skills.he = parseInt(hexHe,16);
	  	player.skills.st = parseInt(hexSt,16);
	  	player.skills.sp = parseInt(hexSp,16);
	  	player.skills.bc = parseInt(hexBc,16);

	  	var positionCalc = {
	  		"kp":player.skills.kp,
	  		"ta":player.skills.ta,
	  		"ps":player.skills.ps,
	  		"sh":player.skills.sh,
	  	}
	  	var keys = _.keys(positionCalc);
		function itemgetter(key) { return positionCalc[key]; }
		position = _.max(keys, itemgetter);
	  	player.position = position;
	  	player.editStatus = ""


	  	try {
	  		teams[parseInt(hexTeam,16)].players.push(player);
	  	} catch (err) {

	  	}
  	}
  	return teams;
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function loadLeaguesFromFiles(where) {
	directory = where;
	console.log("THIS DIR " + directory )
	english = {}
	english.name = "English";
	english.leagueNumber = 0;
	english.leagueCode = "N";
	english.maxPlayers = 3200
	english.maxTeams = 114
	english.divisions = [];
	english.divisions.push({"id": 0, "name":"Premiership"});
	english.divisions.push({"id": 1, "name":"Division 1"});
	english.divisions.push({"id": 2, "name":"Division 2"});
	english.divisions.push({"id": 3, "name":"Division 3"});
	english.divisions.push({"id": 4, "name":"Conference"});
	english.teams = populateWithPlayers(readTeams("N"),"N");

	french = {}
	french.name = "French";
	french.leagueNumber = 1;
	french.leagueCode = "F";
	french.maxPlayers = 1200;
	french.maxTeams = 38;
	french.divisions = [];
	french.divisions.push({"id": 0, "name": "Division 1", "maxTeams":18});
	french.divisions.push({"id": 1, "name": "Division 2", "maxTeams":20});
	french.teams = populateWithPlayers(readTeams("F"),"F");

	german = {}
	german.name = "German";
	german.leagueNumber = 2;
	german.leagueCode = "G";
	german.maxPlayers = 2600
	german.maxTeams = 108
	german.divisions = [];
	german.divisions.push({"id": 0, "name": "1. Bundesliga"});
	german.divisions.push({"id": 1, "name": "2. Bundesliga"});
	german.divisions.push({"id": 2, "name": "Regionalliga Südwest"});
	german.divisions.push({"id": 3, "name": "Regionalliga Süd"});
	german.divisions.push({"id": 4, "name": "Regionalliga Nord"});
	german.divisions.push({"id": 5, "name": "Regionalliga Nordost"});
	german.teams = populateWithPlayers(readTeams("G"),"G");

	italian = {}
	italian.name = "Italian";
	italian.leagueCode = "I";
	italian.leagueNumber = 3;
	italian.maxPlayers = 1100;
	italian.maxTeams = 38;
	italian.divisions = [];
	italian.divisions.push({"id": 0, "name": "Serie A"});
	italian.divisions.push({"id": 1, "name": "Serie B"});
	italian.teams = populateWithPlayers(readTeams("I"),"I");

	scottish = {}
	scottish.name = "Scottish";
	scottish.leagueNumber = 4;
	scottish.leagueCode = "S";
	scottish.maxPlayers = 1300;
	scottish.maxTeams = 40;
	scottish.divisions = [];
	scottish.divisions.push({"id": 0, "name": "Premiership"});
	scottish.divisions.push({"id": 1, "name": "Division 1"});
	scottish.divisions.push({"id": 2, "name": "Division 2"});
	scottish.divisions.push({"id": 3, "name": "Division 3"});
	scottish.teams = populateWithPlayers(readTeams("S"),"S");

	spanish = {}
	spanish.name = "Spanish";
	spanish.leagueNumber = 5;
	spanish.leagueCode = "P";
	spanish.maxPlayers = 1200;
	spanish.maxTeams = 42;
	spanish.divisions = [];
	spanish.divisions.push({"id": 0, "name": "Division 1"});
	spanish.divisions.push({"id": 1, "name": "Division 2"});
	spanish.teams = populateWithPlayers(readTeams("P"),"P");

	dutch = {}
	dutch.name = "Dutch";
	dutch.leagueNumber = 6;
	dutch.leagueCode = "D";
	dutch.maxPlayers = 1200;
	dutch.maxTeams = 38;
	dutch.divisions = [];
	dutch.divisions.push({"id": 0, "name": "KPN Telecompetite"});
	dutch.divisions.push({"id": 1, "name": "Toto"});
	dutch.teams = populateWithPlayers(readTeams("D"),"D");

	uefa = {}
	uefa.name = "UEFA";
	uefa.leagueNumber = 7;
	uefa.leagueCode = "X";
	uefa.maxPlayers = 2286;
	uefa.maxTeams = 127;
	uefa.divisions = [];
	uefa.teams = populateWithPlayers(readTeams("X"),"X");

	other = {}
	other.name = "Other Leagues";
	other.leagueNumber = 8;
	other.leagueCode = "W";
	other.maxPlayers = 2286;
	other.maxTeams = 127;
	other.divisions = [];
	other.teams = populateWithPlayers(readOtherTeams(),"W");

	leagues = [];
	leagues.push(english);
	leagues.push(french);
	leagues.push(german);
	leagues.push(italian);
	leagues.push(scottish);
	leagues.push(spanish);
	leagues.push(dutch);
	leagues.push(uefa);
	leagues.push(other);


	leagueOrig = $.extend(true, [], leagues);
}