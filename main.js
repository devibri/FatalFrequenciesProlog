// Create the prolog sesssion and load phandelver.prolog.
session = pl.create();
session.consult("database.prolog");

// Array of variable bindings, one per answer, returned by prolog query

var scene_tag; 
var page = "scenes";

//display_scene_list(); 

display_scene("sadies_sob_story");
//display_scene_name();
//display_scene_info(); 

function reload() {
	page = "scenes";
	clear_scene_info();
	display_scene_name();
	display_scene_info(); 
}

/*
 * Returns a callback function to pass to session.answers(). 
 * The parameter is the function for the callback to call (with the bindings as parameter)
 * when prolog has found all the answers. 
*/
function get_callback(funcWhenDone) 
{
	var bindings = [];
	var callbackFunc = function(answer) 
	{
		if (answer == false) 
		{
			// We're done finding answers. Execute funcWhenDone with the bindings.
			funcWhenDone(bindings);
		}
		else 
		{
			// We've gotten another non-false answer - add it to the bindings.
			bindings.push(answer);
		}
	}
	return callbackFunc;
} 

// Takes a list of all of the scene names in the game and outputs them
function display_scene_list() {
	var get_all_bindings = function(answers) {
		for (var i = 0; i < answers.length; i++) {
    		var name = answers[i];
    		print_scene_names(name);
		}
	}
	
	session.query("scene_name(Scene, Name).");
	session.answers(get_callback(get_all_bindings));
}

// Displays the name of the current scene
function display_scene_name() {
	var binding = function(answer) {
    	scene_output_area.innerHTML = scene_output_area.innerHTML + "<h2>" + answer.lookup("Name");  + "</h2>";
	}
	
	session.query("scene_name(" + scene_tag + ", Name).");
	session.answer(binding);
}

// Displays a list of all of the clues in the current scene 
function display_scene_info() {
	var get_all_bindings = function(answers) {
		answers.sort(); 
		for (var i = 0; i < answers.length; i++) {
    		var clue = answers[i];
    		print_scene_info(clue);
		}
	}
	
	session.query("clue(Number, " + scene_tag + ", Clue, Known).");
	session.answers(get_callback(get_all_bindings));
}

// Displays a list of all of the clues in the current scene 
function display_scene_info_by_index(start, end) {
	var binding = function(answer) {
		console.log(i);
    	print_scene_info(answer, i);
	}

	for (var i = start; i <= end; i++) {
		session.query("clue(" + i + ", " + scene_tag + ", Clue, Known).");
		session.answer(binding);
	}
}

// Outputs the name of a scene
function print_scene_names(name) {
	var scene_name = name.lookup("Name");  
	output_area.innerHTML = output_area.innerHTML + "<p>" + scene_name + "</p>";
}

// Outputs the clue of a scene
function print_scene_info(clue) {
	var clue_name = clue.lookup("Clue").toString(); 
	var clue_known = clue.lookup("Known").toString();
	var clue_number = clue.lookup("Number").toString();
	var checkbox;
	if (clue_known == "true") {
		checkbox = "<input type='checkbox' name='clue' checked>";
	} else {
		checkbox = "<input type='checkbox' name='clue'>";
	}
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>" + checkbox + clue_number + ") " + clue_name.replace(/^["'](.+(?=["']$))["']$/, '$1') + "</p>";
}


// Outputs the clue of a scene for which the index of the clue is specified
function print_scene_info(clue, index) {
	var clue_name = clue.lookup("Clue").toString(); 
	var clue_known = clue.lookup("Known").toString();
	var checkbox;
	if (clue_known == "true") {
		checkbox = "<input type='checkbox' name='clue' checked>";
	} else {
		checkbox = "<input type='checkbox' name='clue'>";
	}
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>" + checkbox + index + ") " + clue_name.replace(/^["'](.+(?=["']$))["']$/, '$1') + "</p>";
}


// When you click the checkbox for a clue, have this update the result in the database
$(document).on("click", "input[name='clue']", function () {
	var checked = $(this).prop('checked');
	var clueText = this.nextSibling.data.trim().substring(3);
	var clueNumber = this.nextSibling.data.trim().substring(0, 1);
	
	var remove_from_world = function(binding) {
	}

	var statement = "retract(clue(Number, Name, \"" + clueText + "\", Known)).";
	session.query(statement);
	session.answer(remove_from_world);
	
	var add_to_world = function(binding) {
	}

	session.query("asserta(clue(" + clueNumber + ", " + scene_tag + ", \"" + clueText + "\", " + checked + ")).");
	session.answer(add_to_world);

	if (page == "scenes") {
		display_scene(scene_tag);
	} else if (page == "clues") {
		display_all_clues();
	}
});

// removes all the current scene info from webpage so it can be redisplayed
function clear_scene_info() {
	scene_output_area.innerHTML = "";
}

// handles clicking link to show all clues
var el = document.getElementById('clues_link');
el.onclick = display_all_clues;

// handles clicking link to show all clues
var el2 = document.getElementById('scenes_link');
el2.onclick = display_scene_page;

// displays the list of all of the clues 
function display_all_clues() {
	page = "clues";
	clear_scene_info(); 

	var get_all_bindings = function(answers) {
		answers.sort(); 
		for (var i = 0; i < answers.length; i++) {
    		var clue = answers[i];
    		print_scene_info(clue);
		}
	}
	
	session.query("clue(Number, Name, Clue, Known).");
	session.answers(get_callback(get_all_bindings));
	return false;
}

// displays the page with the scene info on it 
function display_scene_page() {
	page = "scenes";
	display_scene(scene_tag);
	return false;
}


// Displays the info for a given scene
function display_scene(tag) {
	clear_scene_info();
	scene_tag = tag; 
	display_scene_name(); 
	if (tag == "sadies_sob_story") {
		display_scene_sadies_sob_story();
	}
	
}

function display_scene_sadies_sob_story() {
	scene_output_area.innerHTML = scene_output_area.innerHTML +  "<p>The scenario starts off for Vivian Sinclair on a Monday morning after she’s turned in her most recent story. Invite the player to describe it, if she likes. She may rest on her laurels and joke around with the guys in the Herald Tribune’s newsroom, or she may already be scouring a pile of newspaper clippings and notes for her next lead. Around 9 a.m., she gets a telephone call from downstairs.</p>";
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>Use this as an opportunity to establish Viv’s newsroom and how she meets with interested parties. Does she have the receptionist send them up to her desk in a smoky room full of (mostly) men bent over typewriters and paper-strewn desks? Or does she meet with her Sources and sometime- clients in another location, such as a restaurant across the street? Have the player take a moment to describe something important that Viv keeps at her desk in the newsroom, or her regular order at the restaurant.</p>";
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>The player begins with one Problem card in hand (“Sucker for a Pretty Face,” “Hand-to- Mouth,” “Anything for a Story,” or “Hot-Tempered,”). If this is the player’s first One-2- One session, explain how the acquisition and Countering of Problem cards works.</p>"
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>Viv’s visitor is a fragile, waif-like girl. Sadie Cain speaks in the soft, defensive tone of someone who has gone through her story several times already. She’s cried too long to have any tears left. Instead, her eyes reflect a quiet blankness</p>";
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>Sadie’s fiancé, George Preston, disappeared three days ago under mysterious circumstances. She thinks the police are framing him for a murder, just like those articles Viv wrote about police frame-ups a few years ago. She wants Viv to find him and to prove him innocent. She explains the situation as follows:</p>"
	display_scene_info_by_index(1, 4);
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p><strong>Assess Honesty:</strong> Viv’s encountered types who try to get their loved ones a trial in the press before it ever goes to court. Most of the time, they know the guy did it. This girl seems utterly convinced of her fiancé’s innocence.</p>";
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p><strong>Streetwise:</strong> The police rarely care about getting the right guy when both victim and suspect come from the lower strata. If this case looks open and shut to them, they’ll arrest George as soon as they find him and call it a day.</p>";
	scene_output_area.innerHTML = scene_output_area.innerHTML + "<p>In response to specific questions, Sadie responds with the following information:</p>";
	display_scene_info_by_index(5, 7);
} 