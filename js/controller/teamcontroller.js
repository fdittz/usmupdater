var teamApp = angular.module('teamApp', ['ngRoute']);

teamApp.config(function($routeProvider) {
  $routeProvider

  // route for index
  .when('/', {
      templateUrl : 'directory.html',
      controller  : 'indexCtrl'
  })

  // route for the editor
  .when('/editor', {
      templateUrl : 'editor.html',
      controller  : 'teamCtrl'
  });
});

teamApp.factory("directoryService", function() {
  var directory = "";
  var setDirectory = function(value) {
    directory = value;
  }
  var getDirectory = function() {
    return directory
  }

  return {
    setDirectory: setDirectory,
    getDirectory: getDirectory
  };

});

teamApp.controller( "indexCtrl",function ($scope,directoryService,$location){
    if (localStorage.directory)
      $scope.directory = JSON.parse(localStorage.directory);
    else
      $scope.directory = ""

    $scope.toEditor = function() {
      directoryService.setDirectory($scope.directory.path);
      localStorage.directory = JSON.stringify($scope.directory);
      $location.path('editor');

    }

});

teamApp.controller('teamCtrl', function ($scope,directoryService) {
  $scope.modifiedLeagues = [];

  $scope.nations = [{"id":0, "name" : "England"},{"id":1, "name" : "Scotland"},{"id":2, "name" : "Wales"},{"id":3, "name" : "N. Ireland"},{"id":4, "name" : "Ireland"},{"id":5, "name" : "Holland"},{"id":6, "name" : "Germany"},{"id":7, "name" : "France"},{"id":8, "name" : "Italy"},{"id":9, "name" : "Spain"},{"id":10, "name" : "Denmark"},{"id":11, "name" : "Sweden"},{"id":12, "name" : "Norway"},{"id":13, "name" : "Brazil"},{"id":14, "name" : "Australia"},{"id":15, "name" : "Portugal"},{"id":16, "name" : "Yugoslavia"},{"id":17, "name" : "Tobago"},{"id":18, "name" : "Canada"},{"id":19, "name" : "Greece"},{"id":20, "name" : "Iceland"},{"id":21, "name" : "Finland"},{"id":22, "name" : "South Africa"},{"id":23, "name" : "Russia"},{"id":24, "name" : "Romania"},{"id":25, "name" : "Zimbabwe"},{"id":26, "name" : "Croatia"},{"id":27, "name" : "Switzerland"},{"id":28, "name" : "Argentina"},{"id":29, "name" : "New Zealand"},{"id":30, "name" : "Ghana"},{"id":31, "name" : "USA"},{"id":32, "name" : "West Indies"},{"id":33, "name" : "Czech Rep"},{"id":34, "name" : "Bulgaria"},{"id":35, "name" : "Jamaica"},{"id":36, "name" : "Georgia"},{"id":37, "name" : "Belgium"},{"id":38, "name" : "Colombia"},{"id":39, "name" : "Malta"},{"id":40, "name" : "Poland"},{"id":41, "name" : "Austria"},{"id":42, "name" : "Cyprus"},{"id":43, "name" : "Israel"},{"id":44, "name" : "Cameroon"},{"id":45, "name" : "Sierra Leonne"},{"id":46, "name" : "Bermuda"},{"id":47, "name" : "Nigeria"},{"id":48, "name" : "Turkey"},{"id":49, "name" : "Hungary"},{"id":50, "name" : "Ukraine"},{"id":51, "name" : "Slovenia"},{"id":52, "name" : "Slovakia"},{"id":53, "name" : "Maldova"},{"id":54, "name" : "Liechtenstein"},{"id":55, "name" : "Japan"},{"id":56, "name" : "Bosnia"},{"id":57, "name" : "Morocco"},{"id":58, "name" : "Lithuania"},{"id":59, "name" : "Albania"},{"id":60, "name" : "Egypt"},{"id":61, "name" : "Macedonia"},{"id":62, "name" : "Tonga"},{"id":63, "name" : "Guinea"},{"id":64, "name" : "Luxembourg"},{"id":65, "name" : "Uruguay"},{"id":66, "name" : "Algeria"},{"id":67, "name" : "Liberia"},{"id":68, "name" : "Tunisia"},{"id":69, "name" : "Zaire"},{"id":70, "name" : "Senegal"},{"id":71, "name" : "Chad"},{"id":72, "name" : "Panama"},{"id":73, "name" : "Congo"},{"id":74, "name" : "Estonia"},{"id":75, "name" : "Costa Rica"},{"id":76, "name" : "Surinam"},{"id":77, "name" : "Zambia"},{"id":78, "name" : "Belarus"},{"id":79, "name" : "Namibia"},{"id":80, "name" : "Chile"},{"id":81, "name" : "Barbados"},{"id":82, "name" : "Madagascal"},{"id":83, "name" : "Singapore"},{"id":84, "name" : "Latvia"},{"id":85, "name" : "Paraguay"},{"id":86, "name" : "Trinadad"},{"id":87, "name" : "Bolivia"},{"id":88, "name" : "Faroe Islands"},{"id":89, "name" : "Armenia"},{"id":90, "name" : "Azerbaijan"},{"id":91, "name" : "Bosnia"},{"id":92, "name" : "Tadzhikistan"},{"id":93, "name" : "Mexico"},{"id":94, "name" : "Uzbekistan"},{"id":95, "name" : "Ecuador"},{"id":96, "name" : "Peru"},{"id":97, "name" : "Venezuela"},{"id":98, "name" : "El Salvador"},{"id":99, "name" : "Guatemala"},{"id":100, "name" : "Honduras"},{"id":101, "name" : "San Marino"},{"id":102, "name" : "Montenegro"},{"id":103, "name" : "Sta. Lucia"},{"id":104, "name" : "China"},{"id":105, "name" : "Ivory Coast"},{"id":106, "name" : "Burundi"}];
  $scope.clipboard = {};
  $scope.clipboard.team = [];
  $scope.clipboard.player = [];
  $scope.splitter = function(string, nb) {
    $scope.array = string.split(',');
    return $scope.result = $scope.array[nb];
  }
   loadLeaguesFromFiles(directoryService.getDirectory());

  $scope.getNumberOfTeamsPerDivision = function(array,divi) {
    var count = 0;
    for (var i in array) {
      if (array[i].division == divi)
        count++;
    }
    return count;
  }

  $scope.getPlayerCount = function() {
    var players = 0;
    for (var i = 0; i < $scope.teams.length; i++) {
      players = players + $scope.teams[i].players.length;
    }
    return players;
  }

  $scope.getAllDivisionsTeamsCount = function() {
    var teamsPerDivision = [];
    for (var idiv in $scope.league.divisions) {
      teamsPerDivision.push($scope.getNumberOfTeamsPerDivision($scope.league.teams,$scope.league.divisions[idiv].id));
    }
    return teamsPerDivision;
  }

  $scope.onDivisionChange = function() {
    $scope.divisionTeamCount = $scope.getAllDivisionsTeamsCount();
  }

  $scope.getDerby = function(code) {
    derbyTeams = []

    for (var dteam in $scope.teams) {
      if ($scope.teams[dteam] != $scope.thisTeam)
        if ($scope.teams[dteam].derbyCode == code)
          derbyTeams.push($scope.teams[dteam].name);
    }
    $scope.derbyTeams = derbyTeams;
  }

  $scope.changeTeam = function() {
     $scope.getDerby($scope.thisTeam.derbyCode);
  }

  $scope.changeLeague = function(num) {
    if ($scope.league) {
      $scope.changeTeam();
    }

    $scope.league = leagues[num];
    $scope.teams = $scope.league.teams;
    $scope.thisTeam = $scope.league.teams[0];
    $scope.playerCount = $scope.getPlayerCount();
    $scope.divisionTeamCount = $scope.getAllDivisionsTeamsCount();
    $scope.stadiums = [];
    $scope.cups = [];
    switch($scope.league.name) {
    case "French":
        $scope.stadiums = stadiums.f;
        $scope.cups = cups.f;
        break;
    case "English":
        $scope.stadiums = stadiums.n;
        $scope.cups = cups.n;
        break;
    case "German":
        $scope.stadiums = stadiums.g;
        $scope.cups = cups.g;
        break;
    case "Italian":
        $scope.stadiums = stadiums.i;
        $scope.cups = cups.i;
        break;
    case "Scottish":
        $scope.stadiums = stadiums.s;
        $scope.cups = cups.s;
        break;
    case "Spanish":
        $scope.stadiums = stadiums.p;
        $scope.cups = cups.p;
        break;
    case "Dutch":
        $scope.stadiums = stadiums.d;
        $scope.cups = cups.d;
        break;

    }
    $scope.changeTeam()
  }
  $scope.changeLeague(1);


  $scope.call = function() {
  	alert(teams[0].name);
  }
  
  $scope.developments = [0,1,2,3,4,5,6,7,8,9,0];
  $scope.colors = [
                    {"id":0,"name":"White"},
                    {"id":1,"name":"Black"},
                    {"id":2,"name":"Red"},
                    {"id":3,"name":"Blue"},
                    {"id":4,"name":"Light Blue"},
                    {"id":5,"name":"Purple"},
                    {"id":6,"name":"Yellow"},
                    {"id":7,"name":"Orange"},
                    {"id":8,"name":"(White)"},
                    {"id":9,"name":"Green"}
  ];
  $scope.sides = [
                  {"id":0,"label":"all"},
                  {"id":1,"label":"left"},
                  {"id":2,"label":"right"},
                  {"id":3,"label":"centre"}
  ];


  $scope.addPlayer = function() {
    player = {
      "firstName" : "",
      "lastName" : "",
      "birthDate" : "",
      "nation" : 0,
      "development" : 0,
      "side" : 0,
      "skills" : {
        "kp" : 0,
        "ta" : 0,
        "ps" : 0,
        "sh" : 0,
        "pc" : 0,
        "he" : 0,
        "st" : 0,
        "sp" : 0,
        "bc" : 0
      }
    }; 

  	$scope.thisTeam.players.push(player);
    $scope.playerCount++;
  }
  $scope.deletePlayer = function(index) { 
  	var playerToDelete = $scope.thisTeam.players.splice(index,1);
    $scope.playerCount--;

  }

  $scope.getPosition = function(player) {
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
	  	return position;
  }
  $scope.toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
  $scope.checkField = function(field) {
    var notInUefaAndOthers = ["division", "fanzine", "fanzine-editor", "stadium-cups-derby"];
    var notInOthers = ["coach","stadium","nickname","attendance","rank","home-color","away-color"];
    var leagueName = $scope.league.name;
    if (notInUefaAndOthers.indexOf(field) > -1) {
      if (leagueName == "UEFA" || leagueName == "Other Leagues") {
        return false;
      }
    }
    if (notInOthers.indexOf(field) > -1) {
      if (leagueName == "Other Leagues") {
        return false;
      }
    }
    return true;
  }

$scope.unclip = function() {    
    $scope.clipboard.player[0].editStatus = "";
    $scope.clipboard.team.pop();
    $scope.clipboard.player.pop();
}
$scope.clip = function(thisPlayer) {
  if ($scope.clipboard.player.length > 0)
    $scope.unclip();
  thisPlayer.editStatus = "clipboard";
  $scope.clipboard.player.push(thisPlayer);


}
$scope.copyPlayer = function(thisPlayer) {
  $scope.clipboard.team.push($scope.thisTeam);
  $scope.clip(thisPlayer);
}
$scope.pastePlayer = function() {
  if (($scope.clipboard.team.length > 0) && ($scope.clipboard.player.length > 0)) {
    if ($scope.thisTeam.players.length < 30) {
      $scope.findAndDeletePlayer($scope.clipboard.team[0],$scope.clipboard.player[0]);
      $scope.thisTeam.players.push($scope.clipboard.player[0]);
      $scope.unclip();
    }
    else {
      alert("This team already has 30 players");
    }
  }
} 

$scope.findAndDeletePlayer = function (team,player) {
  for (var i = 0; i < team.players.length; i++) {
    if (equal(JSON.parse(angular.toJson(team.players[i])), JSON.parse(angular.toJson(player))))
      team.players.splice(i,1);
    }
} 

$scope.writeHex = function(league) {
  var out = ""
  var playersOut = ""
  for (var i = 0; i < $scope.teams.length; i++) {
    lastTeam = writeHex($scope.teams[i],i,$scope.league.leagueNumber);
    out = out + lastTeam;
    for (var j = 0; j < $scope.teams[i].players.length; j++) {
        var hexPlayer = writeHexPlayer($scope.teams[i].players[j],i,$scope.league.leagueNumber);
        if (hexPlayer != false) {
          playersOut = playersOut + hexPlayer;
        }
    }
  }
  if(writeFile(playersOut,directoryService.getDirectory() + "/PLAYER"+$scope.league.leagueCode+".DAT")) {
    if (saveTeams = writeFile(out,directoryService.getDirectory() + "/TEAM"+$scope.league.leagueCode+".DAT")) {
        return true;
    }
  }  
}


$scope.saveAll = function() {
  $scope.modifiedLeagues = []
  for (var i in leagues) {
    if (!equal(leagueOrig[i],JSON.parse(angular.toJson(leagues[i])))) {
      $scope.modifiedLeagues.push(leagues[i].name);
    }
  }
}

$scope.confirmSave = function() {
  for (var i in leagues) {
    if (!equal(leagueOrig[i],JSON.parse(angular.toJson(leagues[i])))) {      
      if ($scope.writeHex(leagues[i])) {
        leagueOrig[i] = $.extend(true, {}, JSON.parse(angular.toJson(leagues[i])));
        $scope.modifiedLeagues = []
      }

    }
  }

}
  
});
  /**
 * A generic confirmation for risky actions.
 * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
 */
	teamApp.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);
teamApp.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i++)
      input.push(i);
    return input;
  };
});

teamApp.filter('commas', function(text){
  return text.replace(",", '<br/>');
});

teamApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);