// Create the prolog sesssion and load phandelver.prolog.
session = pl.create();
session.consult("database.prolog");


// Array of variable bindings, one per answer, returned by prolog query
var bindings = [];

display_scene_list(); 

/*
 * Returns a callback function to pass to session.answers(). 
 * The parameter is the function for the callback to call (with the bindings as parameter)
 * when prolog has found all the answers. 
*/
function get_callback(funcWhenDone) 
{
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

function display_scene_list() {
	var get_all_bindings = function(answers) {
		for (var i = 0; i < answers.length; i++) {
    		var clue = answers[i];
    		print_clues(clue);
		}
	}
	
	session.query("clue(Scene, Clue).");
	session.answers(get_callback(get_all_bindings));
}

function print_clues(clue) {
	var clue_desc = clue.lookup("Clue");  
	output_area.innerHTML = output_area.innerHTML + "<p>" + clue_desc + "</p>";
}