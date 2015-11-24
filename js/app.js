(function(window, $){
	
	/*
	 * following the SFC conventions, each item in the array is
	 * a byte-sized value representing a character
	 *
	 */
	
	// mantra: six-character array(string)
	var mantraTest = [179,156,193,162,135,189];
	var mantraInput = [0, 0, 0, 0, 0, 0];
	
	
	// characters: collection of every single character
	var character = [
		//{id: 0, char: " "},
		{id: 122, char: "-"},
		{id: 123, char: "A"},
		{id: 124, char: "I"},
		{id: 125, char: "U"},
		{id: 126, char: "E"},
		{id: 127, char: "O"},
		{id: 128, char: "KA"},
		{id: 129, char: "KI"},
		{id: 130, char: "KU"},
		{id: 131, char: "KE"},
		{id: 132, char: "KO"},
		{id: 133, char: "SA"},
		{id: 134, char: "SHI"},
		{id: 135, char: "SU"},
		{id: 136, char: "SE"},
		{id: 137, char: "SO"},
		{id: 138, char: "TA"},
		{id: 139, char: "CHI"},
		{id: 140, char: "TSU"},
		{id: 141, char: "TE"},
		{id: 142, char: "TO"},
		{id: 143, char: "NA"},
		{id: 144, char: "NI"},
		{id: 145, char: "NU"},
		{id: 146, char: "NE"},
		{id: 147, char: "NO"},
		{id: 148, char: "HA"},
		{id: 149, char: "HI"},
		{id: 150, char: "FU"},
		{id: 151, char: "HE"},
		{id: 152, char: "HO"},
		{id: 153, char: "MA"},
		{id: 154, char: "MI"},
		{id: 155, char: "MU"},
		{id: 156, char: "ME"},
		{id: 157, char: "MO"},
		{id: 158, char: "YA"},
		{id: 159, char: "YU"},
		{id: 160, char: "YO"},
		{id: 161, char: "RA"},
		{id: 162, char: "RI"},
		{id: 163, char: "RU"},
		{id: 164, char: "RE"},
		{id: 165, char: "RO"},
		{id: 166, char: "WA"},
		{id: 167, char: "WO"},
		{id: 168, char: "N"},

		{id: 169, char: "GA"},
		{id: 170, char: "GI"},
		{id: 171, char: "GU"},
		{id: 172, char: "GE"},
		{id: 173, char: "GO"},
		{id: 174, char: "ZA"},
		{id: 175, char: "ZI"},
		{id: 176, char: "ZU"},
		{id: 177, char: "ZE"},
		{id: 178, char: "ZO"},
		{id: 179, char: "DA"},
		{id: 180, char: "JI"},
		{id: 181, char: "DU"},
		{id: 182, char: "DE"},
		{id: 183, char: "DO"},
		{id: 184, char: "BA"},
		{id: 185, char: "BI"},
		{id: 186, char: "BU"},
		{id: 187, char: "BE"},
		{id: 188, char: "BO"},
		{id: 189, char: "PA"},
		{id: 190, char: "PI"},
		{id: 191, char: "PU"},
		{id: 192, char: "PE"},
		{id: 193, char: "PO"},
		{id: 194, char: "~a"},
		{id: 195, char: "~i"},
		{id: 196, char: "~u"},
		{id: 197, char: "~e"},
		{id: 198, char: "~o"},
		{id: 199, char: "~tsu"},
		{id: 200, char: "~ya"},
		{id: 201, char: "~yu"},
		{id: 202, char: "~yo"},
		{id: 203, char: "VU"}
	];
	
	
	// on document.ready, initialize
	$(document).ready(function() {
		console.log("dom ready, initializing...");
		
		fillUpButtons();
		
		// bind button clicks
		$("#div-katakana button").on("click", function() {
			var posZero = mantraInput.indexOf(0);
			if (posZero > -1)
				mantraInput[posZero] = parseInt(this.dataset.id);
			
			refresh();
		});
		
		// bind keypresses (for backspace)
		$(document).on("keypress", function(e) {
			if(e.which === 8) {
				var posZero = mantraInput.indexOf(0);
				
				if (posZero === -1)
					posZero = 6;
				
				if (posZero)
					mantraInput[posZero - 1] = 0;
				
				refresh();
				
			};
		});
		
		/*
		var parsed = parseMantra(mantraTest);
		*/
		
		console.log(
			
		);
	});
	
	
	var refresh = function() {
		// update view
		updateMantraView(mantraInput);
		
		// parse mantra
		var parsed = parseMantra(mantraInput);
		var finalMantra = null;
		
		// process pieces
		$("#words").empty();
		$.each(parsed, function(index, chain) {
			// display each part
			var $li = $("<li/>");
			$li.html(mantraToString(chain.chain));
			$("#words").prepend($li);
			
			// modify mantra
			finalMantra = modifyMantra(
				finalMantra,
				window.MANTRAS.base[chain.base],
				window.MANTRAS.prefix[chain.prefix]
			);
		});
		console.log("final mantra:");
		console.log(finalMantra);
		
		if(finalMantra === undefined)
			return null;
		
		// corrections
		// MP cost can't be less than 1
		if (finalMantra.mpCost < 1)
			finalMantra.mpCost = 1;
		
		// power can't be less than 0
		if (finalMantra.power < 0)
			finalMantra.power = 0;
		
		// display final mantra effects
		$("#m-effect").html(finalMantra.effect);
		$("#m-status").html(finalMantra.statEffect + "/" + finalMantra.status);
		$("#m-power").html(finalMantra.power);
		$("#m-mpcost").html(finalMantra.mpCost);
		$("#m-element").html(finalMantra.ele);
		$("#m-targetting").html(finalMantra.targetting);
		
	};
	
	
	var modifyMantra = function(fMantra, base, prefix) {
		console.log(base);
		console.log(prefix);
		
		// if mantra is empty, take base and slap it in mantra
		if (fMantra === null) {
			fMantra = base
		} else {
			
			// element from base can be modified
			if((fMantra.inhEle === true) && (prefix.inhEle))
				fMantra.ele = base.ele;
			
			// targetting from base can be modified
			if((fMantra.inhTar === true) && (prefix.inhTar))
				fMantra.targetting = base.targetting;
			
			// base power from base can be modified
			if((fMantra.inhPow === true) && (prefix.inhPow))
				fMantra.power = base.power;
			
			// other properties can be modified
			// must test this
			if((fMantra.inhOth === true) && (prefix.inhOth)) {	
				fMantra.effect = base.effect;
				fMantra.status = base.status;
				fMantra.statEffect = base.statEffect;
			}
			
			
			// ignore all modifiers if type=2???
			if((fMantra.type === 2) || (base.type === 2)) {
				console.log("TYPE 2 should ignore everything else");
			} else {
				// apply prefix MP and power modifiers
				fMantra.mpCost += prefix.mpCost;
				fMantra.power += prefix.power;
			};
		};
		
		return fMantra;
	};
	
	
	/**
	 * parseMantra
	 *
	 * Parses a mantra from the end, obtaining all of its components
	 * 
	 * Returns an ordered array with them
	 * 
	 **/
	var parseMantra = function(mantra) {
		// if length=0, nothing to parse
		if(mantra.length==0) {
			console.log("length=0");
			return null;
		};
		
		console.log("parsing mantra...");
		
		// start parsing
		// copy to new array trimming the 0s
		var eMantra = [];
		for(var i = 0; i < mantra.length; i++) {
			if (mantra[i] !== 0)
				eMantra.push(mantra[i]);
		};
		
		console.log(eMantra);

		var mantraSegments = [];
		
		// run through mantra finding chain matches (from the end)
		do {
			var match = {chain: []};
		
			// find longest chain of characters that matches
			$.each(window.MANTRAS.library, function(index, chain) {
			
				var thisChain = chain.chain;
			
				// only check if mantra isn't shorter than chain
				if(thisChain.length <= eMantra.length) {
			
					// get end of the chain to match
					var eChain = eMantra.slice(0 - thisChain.length);
				
					// compare arrays
					var is_same = thisChain.length == eChain.length && thisChain.every(function(element, index) {
						return element === eChain[index]; 
					});
				
					// if we have a match, compare and keep longest chain
					if (is_same) {
						if(match.chain.length < eChain.length)
							match = chain;
					};
				
				};
			
			});
			
			mantraSegments.push(match);
			
			// strip matched chain from mantra
			eMantra = eMantra.slice(0, 0 - match.chain.length);
			
		} while(eMantra.length);
		
		// entire mantra parsed
		return(mantraSegments);
		
	};
	
	
	var updateMantraView = function(mantra) {
		$("#mantra").html(mantraToString(mantra));
	};
	
	
	var mantraToString = function(mantra) {
		var output = "";
		console.log(mantra);
		$.each(mantra, function(index, charIndex) {
			if(charIndex) {
				var char = $.grep(character, function(e) {
					return e.id === charIndex;
				})[0].char;
				output+= char + " ";
			};
		});
		return output;
	};
	
	
	var fillUpButtons = function() {
		var $kata = $("#div-katakana");
		
		$.each(character, function(index, obj) {
			var $btn = $("<button/>");
			$btn.html(obj.char);
			$btn.attr("data-id", obj.id);
			$kata.append($btn);
		});
		
	};
	
})(window, jQuery, undefined);


















