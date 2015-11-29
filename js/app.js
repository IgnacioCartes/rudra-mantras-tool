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
	
	
	// 
	
	/**
	 * on document.ready
	 *
	 * Initialize, setting bindings to buttons and keyboard
	 * 
	 **/
	$(document).ready(function() {
		log("dom ready, initializing...");
		
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
		
	});
	
	
	/**
	 * refresh();
	 *
	 * Display and recalculate the new mantra
	 * 
	 **/
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
			console.log(chain.base, chain.prefix);
			finalMantra = modifyMantra(
				finalMantra,
				window.MANTRAS.base[chain.base],
				window.MANTRAS.prefix[chain.prefix]
			);
		});
		
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
		$("#m-type").html(typeToString(finalMantra.type));
		$("#m-stat").html(statToString(finalMantra.statEffect));
		$("#m-status").html(statusToString(finalMantra.status, finalMantra.status2));
		$("#m-power").html(finalMantra.power);
		$("#m-mpcost").html(finalMantra.mpCost);
		$("#m-element").html(elementToString(finalMantra.element));
		$("#m-targetting").html(targetingToString(finalMantra.targeting));
		
	};
	
	
	/**
	 * modifyMantra();
	 *
	 * Applies a new prefix or sets a base to a mantra
	 * Called for every additional word to modify the base 
	 * 
	 * Returns the modified mantra
	 *
	 **/
	var modifyMantra = function(fMantra, base, prefix) {
		
		console.log(base);
		console.log(prefix);
		
		// misc functions
		// $C0/D7E6
		var accuracyMod = function() {
			fMantra.accuracy += prefix.accuracy;
			fMantra.accuracy /= 2;
		};
		
		// $C0/D697
		var mpCostMod = function() {
			fMantra.mpCost += prefix.mpCost;
			if(fMantra.mpCost < 1) fMantra.mpCost = 1;
			if(fMantra.mpCost > 63) fMantra.mpCost = 63;
		};
		
		// varies
		var powerMod = function(mult) {
			fMantra.power += parseInt(prefix.power * (mult || 1));
			if(fMantra.power < 0) fMantra.power = 0;
			if(fMantra.power > 255) fMantra.power = 255;
		}
		
		// $C0/D6CF
		var oppositeElement = function(e) {
			if(e & 21) {
				return e << 1;
			} else {
				return e >> 1;
			}
		};
		
		// $C0/D6F6
		var inheritanceMod = function() {
			var inh = fMantra.inheritance & prefix.inheritance;
			console.log("inheritance: " + inh);
			
			if(inh & 1) {
				fMantra.inheritance = base.inheritance;
				fMantra.status = base.status;
				fMantra.status2 = base.status2;
				fMantra.statEffect = base.statEffect;
				fMantra.forms = base.forms;
				fMantra.type = base.type;
				fMantra.animation = base.animation;
			};
			
			if(inh & 2) {
				fMantra.power = base.power;
				fMantra.accuracy = base.accuracy;
			};
			
			if(inh & 4) fMantra.element = base.element;
			if(inh & 8) fMantra.targeting = base.targeting;
			if(inh & 16) fMantra.mpCost = base.mpCost;
		};
		
		
		
		// if mantra is empty, take base and slap it in mantra
		if (fMantra === null) {
			fMantra = $.extend({}, base);
		} else {
			
			// prefix handling changes based on type
			var type = (fMantra.type & 192) >> 6;
			console.log("type: "+type)
			

			// acc and mpcost mods run always unless its type 2 base
			if(type !== 2) {
				accuracyMod();
				mpCostMod();
			};
			
			
			// element checks only if type is 0
			// elements different than 0 (void)
			if((type == 0) && (fMantra.element !== 0) && (base.element !== 0)) {
				// same elements
				if(fMantra.element & base.element) {
					powerMod();
					// power/2 if equal words
				}
				// opposite elements
				else if(fMantra.element & oppositeElement(base.element)) {		
					fMantra.power /= 2;
				}
				// neutral elements
				else {
					inheritanceMod();
					powerMod(0.5);
					// power/2 if equal words
				};
				
			};
			
			if((type == 0) && ((fMantra.element == 0) || (base.element == 0))) {
				inheritanceMod();
				powerMod();
				// power/2 if equal words
			};
			
			if((type == 1) || (type == 3)) {
				inheritanceMod();
				powerMod();
				// power/2 if equal words
			};
			
			if (type == 2)
				inheritanceMod();
			
		};
		return fMantra;
	};
	
	
	/**
	 * parseMantra();
	 *
	 * Parses a mantra from the end, obtaining all of its components
	 * 
	 * Returns an ordered array with them
	 * 
	 **/
	var parseMantra = function(mantra) {
		// if length=0, nothing to parse
		if(mantra.length==0) {
			log("length=0");
			return null;
		};
		
		log("parsing mantra...");
		
		// start parsing
		// copy to new array trimming the 0s
		var eMantra = [];
		for(var i = 0; i < mantra.length; i++) {
			if (mantra[i] !== 0)
				eMantra.push(mantra[i]);
		};
		
		log(eMantra);

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
	
	
	// Other minor functions
	
	var updateMantraView = function(mantra) {
		$("#mantra").html(mantraToString(mantra));
	};
	
	
	var mantraToString = function(mantra) {
		var output = "";
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
	
	
	var typeToString = function(type) {
		switch(type & 63) {
			case 3: return "quake (earth)";
			case 4: return "damage";
			case 5: return "damage+buff";
			case 6: return "damage (air)";
			case 7: return "damage (water)";
			case 9: return "quake";
			case 11: return "damage+suicide";
			case 12: return "instant death";
			case 13: return "annihilator";
			case 14: return "cause status";
			case 15: return "stat up";
			case 16: return "stat down";
			case 17: return "revive";
			case 18: return "auto-life";
			case 20: return "defense up";
			case 21: return "defense down";
			case 22: return "mdef up";
			case 23: return "mdef down";
			case 24: return "drain HP";
			case 25: return "drain MP";
			case 26: return "revive+suicide";
			case 27: return "heal";
			case 28: return "block status";
			case 29: return "clear all status";
			case 30: return "remove pollution";
			case 31: return "escape";
			case 32: return "random";
			default: return "N/A";
		};
	};
	
	var statToString = function(stat) {
		switch(stat) {
			case 1: return "strength up";
			case 2: return "dexterity up";
			case 4: return "speed up";
			case 8: return "spirit up";
			case 256: return "strength down";
			case 512: return "dexterity down";
			case 1024: return "speed down";
			case 2048: return "spirit down";
			case 3840: return "multiple down";
			default: return "N/A";
		}
	};
	
	var statusToString = function(status, status2) {
		switch(status + (status2 << 16)) {
			case 1: return "burn";
			case 2: return "freeze";
			case 4: return "shock";
			case 8: return "float";
			case 16: return "regen";
			case 32: return "pollution";
			case 64: return "madness";
			case 65536: return "always hit";
			case 131072: return "always crit";
			case 1048576: return "phys atk down";
			case 2097152: return "phys atk up";
			case 4194304: return "accuracy down";
			case 8388608: return "accuracy up";
			case 33554432: return "avoid attack";
			case 67108864: return "avoid spell";
			case 268435456: return "def/mdef down";
			case 536870912: return "def/mdef up";
			case 1073741824: return "evasion down";
			case -2147483648: return "evasion up";
			default: return "N/A";
		}
	};
	
	var elementToString = function(element) {
		switch(element) {
			case 1: return "fire";
			case 2: return "water";
			case 4: return "thunder";
			case 8: return "wind";
			case 16: return "light";
			case 32: return "dark";
			default: return "void";
		};
	};
	
	var targetingToString = function(targeting) {
		switch(targeting) {
			case 49: return "single ally or enemy";
			case 50: return "all allies or enemies";
			case 53: return "single ally";
			case 54: return "all allies";
			case 56: return "all enemies and allies";
			case 57: return "single enemy or ally";
			case 58: return "all enemies or allies";
			case 60: return "all enemies and allies";
			case 61: return "single enemy";
			case 62: return "all enemies";
			case 63: return "random";
			default: return "N/A";
		};
	};
	
	var log = function(message) {
		console.log(message);
	};
	
	
})(window, jQuery, undefined);


















