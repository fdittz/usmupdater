var fs = require('fs');
var Buffer = require('buffer').Buffer;
var constants = require('constants');
String.prototype.repeat = function(n) {
    return new Array(1 + (n || 0)).join(this);
}
the31DaysMonths = [1,3,5,7,8,10,12];
the30DaysMonths = [4,6,9,11];

//method to complete the value with 0s
function zeros(hexString,val) {
	return hexString + "0".repeat(val - hexString.length);
}
function writeHex(team,teamNumber,leagueNumber) {
	if (leagueNumber == 8) {
		hexTeam = zeros(a2hex(team.name),48) + "0000"
	}
	else {
		attendance = team.attendance.toString(16);
		if (attendance.length < 4)
			attendance = "0" + attendance;
		attendenceInverted = attendance[2] + attendance[3] + attendance[0] + attendance[1];
		hexTeam = zeros(a2hex(team.name),48) +  
			"0".repeat(52-48) + 
			zeros(a2hex(team.coach),48) +
			"0".repeat(104-100) +
			zeros(a2hex(team.nickname),48) +
			"0".repeat(156-152) +
			zeros(a2hex(team.stadium),60) +
			"0".repeat(218-216) +
			zeros(a2hex(team.fanzine),48,1) +
			"0".repeat(284-266) +
			zeros(a2hex(team.editor),48,2) +
			"0".repeat(350-332) +
			team.awayColor.toString(16) +
			team.homeColor.toString(16) +
			hexPadding(team.rank.toString(16)) +
			"0".repeat(358-354) +
			hexPadding(team.derbyCode.toString(16)) +
			"0".repeat(376-360) +
			hexPadding(team.country.toString(16)) +
			hexPadding(team.division.toString(16)) +
			"0".repeat(1266-380) +
			attendenceInverted +
			"0".repeat(1342-1270);
	}
	return hexTeam;
}

function leapYear(year) {
  	return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function writeHexPlayer(player,teamNumber,leagueNumber) {
	try {
		var bdate = player.birthDate.split("/");

		if (player.birthMonth > 12)
			player.birthMonth = 12;
		else if (player.birthMonth < 0) {
			player.birthMonth = 0;
		}
		if (player.birthDay < 1) {
			player.birthDay = 1;
		}

		if (the31DaysMonths.indexOf(player.birthMonth) > -1) {
			if (player.birthDay > 31) {
				player.birthDay = 31;
			}
		}
		else if (the30DaysMonths.indexOf(player.birthMonth)  > -1) {
			if (player.birthDay > 30) {
				player.birthDay = 30;
			}
		}
		else {
			var year = 0;
			//No elegant way of doing this. Had to pick a number to determine what is 1900's and what is 2000's
			if (player.birthYear > 40)
				year = "19" + player.birthYear.toString();
			else 
				year = "20" + player.birthYear.toString();
			if (leapYear(year)) {
				if (player.birthDay > 29) {
					player.birthDay = 29;
				}
			}
			else 
				if (player.birthDay > 28) {
					player.birthDay = 28;
				}

		}

		hexPlayer = zeros(a2hex(player.firstName),26) + 
			"0".repeat(28-26) + 
			zeros(a2hex(player.lastName),26) +
			"0".repeat(58-54) +
			hexPadding(parseInt(player.birthDay).toString(16)) +
			hexPadding((parseInt(player.birthMonth) - 1).toString(16)) +
			hexPadding(parseInt(player.birthYear).toString(16)) +
			hexPadding(player.nation.toString(16));
		if (leagueNumber != 8) {
			hexPlayer = hexPlayer + hexPadding(teamNumber.toString(16)) + 
				"00" + 
				hexPadding(leagueNumber.toString(16)) +
				"FFFF" +
				"0".repeat(288-76);
			}
		else {
			hexPlayer = hexPlayer + "0".repeat(106-66) +
				hexPadding(teamNumber.toString(16))+
				"0".repeat(288-108);
		}
		hexPlayer = hexPlayer +
			hexPadding(player.skills.kp.toString(16)) +
			hexPadding(player.skills.ta.toString(16)) +
			hexPadding(player.skills.ps.toString(16)) +
			hexPadding(player.skills.sh.toString(16)) +
			hexPadding(player.skills.pc.toString(16)) +
			"64" +
			hexPadding(player.skills.he.toString(16)) +
			hexPadding(player.skills.st.toString(16)) +
			hexPadding(player.skills.sp.toString(16)) +
			hexPadding(player.skills.bc.toString(16)) +
			"0".repeat(316-308) +
			hexPadding(player.development.toString(16)) +
			"FFFFFFFF00" +
			hexPadding(player.side.toString(16)) +
			"00000000000000000000000000FFFFFFFF00000000" +
			hexPadding(leagueNumber.toString(16));
		return hexPlayer;
	} catch (err) {
		return false
	}	
}


function writeFile(output,filename) {
		try {
			fs.writeFileSync(filename, output, 'hex')
			return true;
		} catch (err) {
			return false
		}
		/*fs.writeFileSync(filename, output, 'hex', function(err) {
		    if(err) {
		    	console.log(err);
		        console.log(output);
		        return false;
		    } else {
		        console.log("The file was saved!");
		        return true;
		    }
		});*/
}

function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }

  return arr.join('');
}

function hexPadding(str) {
	if (typeof(str) == "number")
		str = str.toString();
	if (str.length < 2)
		return "0" + str;
	return str
}