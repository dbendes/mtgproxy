$(document).ready(function(){

	

				
				var getCards = function(){
					//grab the mbID and store it				
					var textareaInput = $("#proxyList").val();
	
					//first,  show status message that something is going on
					$("#status").html("<p>Status: Searching for proxies</p>");
	
					//check if someone entered an mbID id, i.e. if var mbID is blank
					if(textareaInput==''){
						//if empty,show an error
						$("#status").html("<p>You didn't put in any cards! Enter some MTG cards and try again.");
						
					}
					else {
					//must have input an ID - run the program
					
						//split the input by lines
						var splitInput = textareaInput.split(/\n/)
					
						//create var for the API call
						var jsonURL = ""
						var isItOk = true;

						//blank out the other elements of the page
						$("#status").html('');
						$("#fetchContainer").html('');
						$("#title").html('');
						$("#startertop").html('');

						//change the CSS for the startertop
						$("#startertop").attr("class", "afterClick adjustprint");

						// create an object array for the cards
						proxyArray = [];

						// create objects in proxy array
						
						createObjects(proxyArray, splitInput)

						//proxyArray = createObjects(proxyArray,splitInput);
						

						//var proxyArrayImages = loopCards(proxyArray);

						
						//checkIsItOk(proxyArrayImages,isItOk)
					}


				}

	$("#search").click(function(){
		getCards();
	});
});



function appendCard(card){
	console.log(typeof card.imageURL);
	if (typeof card.imageURL == "string"){
		for (i=0; i < card.quantity; i++)
		{
			$("#resultsContainer").append('<div class="card .print"><img src=' + card.imageURL + '></div>');
		}

	}
	
}

function loopCards (cards){
	for (var i=0; i<cards.length; i++) {

		getImages(cards[i].jsonURL, i, cards);
	}
	$("badCardsList").append("</br>")
	//return cards
}

function getImages (cardURL,index, cards){
	UrlExists(cardURL, function(status){
    	console.log(status);
    	if(status === 200){

			$.getJSON(cardURL,{},(function(data){
				cards[index].imageURL = data.editions[data.editions.length-1].image_url,index
				appendCard(cards[index])
			}));
    	}
    	else if(status===404){
			$("#status").html("<p>Some of the cards you entered were invalid.</br>We pulled the ones that were valid, but you might want to try again.</br>If you want to print just these, this message will not appear on the printed page.</p></br>Below is a list of the bad inputs.");
			$("#badCardsList").append("<li>" + cards[index].quantity + " " + cards[index].cardName + "</li>");
		}   
    }
);
}

function createObjects(proxyArray, splitInput){
	for (var i=0; i<splitInput.length; i++)
	{
		proxyArray[i] = new Object();
		if (!isNaN(parseInt(splitInput[i].charAt(0)))) {
			proxyArray[i].quantity = splitInput[i].substr(0,splitInput[i].indexOf(' '));
			proxyArray[i].cardName = splitInput[i].substr(splitInput[i].indexOf(' ')+1);
			proxyArray[i].cardNameHyphenated = splitInput[i].substr(splitInput[i].indexOf(' ')+1).toLowerCase().replace(/\s/g, "-");	
		}
		else
		{
			proxyArray[i].quantity = 1;
			proxyArray[i].cardNameHyphenated = splitInput[i].toLowerCase().replace(/\s/g, "-");
		}				
		proxyArray[i].jsonURL = "https://api.deckbrew.com/mtg/cards/" + proxyArray[i].cardNameHyphenated;
		proxyArray[i].imageURL = "";
	}
	loopCards (proxyArray)
}

function UrlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
               cb.apply(this, [xhr.status]);
        }
    });
}