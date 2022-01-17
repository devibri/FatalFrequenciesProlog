// Create the prolog sesssion and load phandelver.prolog.
session = pl.create();
session.consult("database.prolog");

// Array of variable bindings, one per answer, returned by prolog query

var scene_tag; 
var page = "scenes";

//display_scene_list(); 
clear_scene_info();
display_scene_name();
display_scene_info(); 

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
	scene_tag = "sadies_sob_story";
	var binding = function(answer) {
    	scene_output_area.innerHTML = scene_output_area.innerHTML + "<h2>" + answer.lookup("Name");  + "</h2>";
	}
	
	session.query("scene_name(" + scene_tag + ", Name).");
	session.answer(binding);
}

// Displays a list of all of the clues in the current scene 
function display_scene_info() {
	scene_tag = "sadies_sob_story";
	var get_all_bindings = function(answers) {
		console.log(answers);
		answers.sort(); 
		console.log(answers);
		for (var i = 0; i < answers.length; i++) {

    		var clue = answers[i];
    		print_scene_info(clue);
		}
	}
	
	session.query("clue(Number, " + scene_tag + ", Clue, Known).");
	session.answers(get_callback(get_all_bindings));
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


// When you click the checkbox for a clue, have this update the result in the database
$(document).on("click", "input[name='clue']", function () {
	var checked = $(this).prop('checked');
	var clueText = this.nextSibling.data.trim().substring(3);
	var clueNumber = this.nextSibling.data.trim().substring(0, 1);
	console.log(clueText); 
	console.log(clueNumber);
	
	var remove_from_world = function(binding) {
	}

	var statement = "retract(clue(Number, Name, \"" + clueText + "\", Known)).";
	console.log(clueText);
	session.query(statement);
	session.answer(remove_from_world);
	
	var add_to_world = function(binding) {
	}

	session.query("asserta(clue(" + clueNumber + ", " + scene_tag + ", \"" + clueText + "\", " + checked + ")).");
	session.answer(add_to_world);

	if (page == "scenes") {
		reload();
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
		console.log(answers);
		answers.sort(); 
		console.log(answers);
		for (var i = 0; i < answers.length; i++) {
    		var clue = answers[i];
    		print_scene_info(clue);
		}
	}
	
	session.query("clue(Number, Name, Clue, Known).");
	session.answers(get_callback(get_all_bindings));

  console.log("clicked link");
  return false;
}

// displays the page with the scene info on it 
function display_scene_page() {
	reload();
	return false;
}
