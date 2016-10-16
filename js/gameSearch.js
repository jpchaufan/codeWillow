


// SEARCH LIST
var gamesList = [
	{
		"id": 0,
		"name": "Comet Dodge",
		"tags": ["casual", "action"],
		"keywords": ["space", "ship", "asteroid", "infinite"],
		"thumb": "imgs/thumbs/comet-dodge-thumb.png",
		"url": "games/comet_dodge/index.html",
	},
	{
		"id": 1,
		"name": "Cloud Hop",
		"tags": ["platformer", "casual", "action"],
		"keywords": ["cloud", "infinite runner", "wizard", "mage", "sky"],
		"thumb": "imgs/thumbs/cloud-hop-thumb.png",
		"url": "games/cloud_hop/index.html",
	}
];
// $.getJSON('js/gamesList.json', function(data){
// 	gamesList = data;
//     displaySearchableTags()
// })


// SEARCH INTERFACE
var searchShowing = false;
function clearSearch(){
	$('.clearSearch').click(function(){
		$('#gamesSearch').val('');
		$('#gamesSearchResults').html('');
		searchShowing = false;
		toggleHideWhenSearching();
	});
}

function runGamesSearch(){
	var input = $('#gamesSearch').val();
	searchShowing = true;
	var clearResultsBtn = '<span class="clearSearch">(clear search results)</span>'

	if ( input.length == 0 ){
		$('#gamesSearchResults').html('<hr/><p class="danger">Enter something to search!</p>'+clearResultsBtn);
		clearSearch();
		return;
	}

	// verify that input only has letters, spaces, and commas;
	
	var results = SearchEngine.search(input);
	var output = '<hr/>';
	if (results){
		output += '<p class="success">'+results.length+' Result(s) found!</p>'+clearResultsBtn;
		var game;
		var i;
		for (i = 0; i < results.length; i++) {
			game = results[i].result;
			output += '<div class="game-view"><h4>'+game.name+'</h4><div class="thumb">';
			output += '<img src="'+game.thumb+'" alt="play '+game.name+' at codeWillow.com">';
			output += '</div><div class="desc"><h4>'+game.name+'</h4><p>Tags: '+game.tags.join(', ')+'</p>';
			output += '<a href="'+game.url+'" target="_blank" class="button">PLAY</a></div></div>';
		};
	} else {
		output += '<p class="danger">Sorry, nothing found.</p>'+clearResultsBtn;
	}

	$('#gamesSearchResults').html(output);
	clearSearch();
	toggleHideWhenSearching();
}


// AUTO SEARCH TAGS

getAllTags = function(){
	var output = [];
	var tag;
	var i;
	for (i = 0; i < gamesList.length; i++) {
		var k;
		for (var k = 0; k < gamesList[i].tags.length; k++) {
			tag = gamesList[i].tags[k];
			if (output.indexOf(tag) == -1){
				output.push(tag);
			}
		};
		
	};
	return output;
}
function displaySearchableTags(){
    if (currentPage == 'games'){
        var output = '<span class="success">Click: </span>';
        var tags = getAllTags().sort();
        var i;
        for (i = 0; i < tags.length; i++) {
            output += '<span class="clickToSearch">'+tags[i]+'</span>';
            if (i < tags.length-1){ 
                output += ', ' 
            } else {
                output += '<br/><br/>'
            }
        };
        $('#searchTags').html(output);

        $('.clickToSearch').click(function(){
            $('#gamesSearch').val( $(this).html() );
            runGamesSearch();
        });
    }
}
displaySearchableTags();

function toggleHideWhenSearching(){
	if (searchShowing){
		$('.hideWhenSearching').hide();
	} else {
		$('.hideWhenSearching').show();
	}
}


// SEARCH ENGINE

SearchResult = function(obj, type){
	this.result = obj;
	this.hits = 1;
	this.type = type;
}

var SearchEngine = {
	detect: function(searchWord, targetWord){
		if ( targetWord.match( new RegExp(searchWord, 'i') ) ){
			return true;
		}
		return false; 
	},
	searchForName: function(word){
		var results = [];
		gamesList.forEach(function(gameObj){
			if ( SearchEngine.detect(word, gameObj.name) ){
				results.push(new SearchResult(gameObj, 'game'));
			} 
		});

		if (results.length == 0){
			return false;
		} else {
			return results
		}
	},
	searchForTags: function(word){
		var results = [];
		gamesList.forEach(function(gameObj){
			var i;
			for (i = 0; i < gameObj.tags.length; i++) {
				if ( SearchEngine.detect(word, gameObj.tags[i]) ){
					results.push(new SearchResult(gameObj, 'game'));	
				}
			};
		});

		if (results.length == 0){
			return false;
		} else {
			return results
		}
	},
	searchForKeywords: function(word){
		var results = [];
		gamesList.forEach(function(gameObj){
			var i;
			for (i = 0; i < gameObj.keywords.length; i++) {
				if ( SearchEngine.detect(word, gameObj.keywords[i]) ){
					results.push(new SearchResult(gameObj, 'game'));	
				}
			};
		});

		if (results.length == 0){
			return false;
		} else {
			return results
		}
	},
	searchTerms: function(str){
		return str.match(/[a-z]+/gi);
	},
	tallyResult: function(resultsToAdd, resultsSoFar){
		var x;
		var newResults = resultsSoFar;
		// var newResults = resultsSoFar;
		for (var x = 0; x < resultsToAdd.length; x++) {
			var resultAlreadyHere = false;
			var i;
			for (i = 0; i < newResults.length; i++) {
				if (newResults[i].result == resultsToAdd[x].result){
					newResults[i].hits++;
					resultAlreadyHere = true;
					break;
				}
			};
			if (!resultAlreadyHere){
				newResults.push(resultsToAdd[x]);
			}
		};

		return newResults;
	},
	sort: function(results){

		var output = [];
		var max; 
		var maxI;
		var i;
		while ( results.length > 0 ){
			max = results[0];
			maxI = 0;
			for (i = 1; i < results.length; i++) {
				if ( results[i].hits > max.hits ){
					max = results[i];
					maxI = i;
				}
			};
			output.push( results.splice(maxI, 1)[0] );	
		}
		return output;
	},
	search: function(search){
		var searchTheseWords = SearchEngine.searchTerms(search);
		var result = {};
		var finalResult = [];

		// SEARCH FOR NAME
		var i;
		for (i = 0; i < searchTheseWords.length; i++) {
			result = SearchEngine.searchForName(searchTheseWords[i].toLowerCase());
			if (result){ finalResult = finalResult = SearchEngine.tallyResult(result, finalResult); }
		};

		// SEARCH FOR TAGS
		for (i = 0; i < searchTheseWords.length; i++) {
			result = SearchEngine.searchForTags(searchTheseWords[i].toLowerCase());
			if (result){ finalResult = SearchEngine.tallyResult(result, finalResult); }
		};

		// SEARCH BY KEYWORDS
		for (i = 0; i < searchTheseWords.length; i++) {
			result = SearchEngine.searchForKeywords(searchTheseWords[i].toLowerCase());
			if (result){ finalResult = SearchEngine.tallyResult(result, finalResult); }
		};

		if (finalResult.length == 0){
			return false;
		} else {
			finalResult = SearchEngine.sort( finalResult );
			return finalResult;
		}
	}
};







