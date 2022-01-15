:- set_prolog_flag(double_quotes, atom).
current_prolog_flag(character_escapes, true).

%%%%%%%%%%%% SCENE INFO %%%%%%%%%%%%%

:- dynamic(scene/1).
scene(sadies_sob_story).
scene(fullers_electrical_repair).

:- dynamic(scene_name/2).
scene_name(sadies_sob_story, "Sadie’s Sob Story").
scene_name(fullers_electrical_repair, "Fuller’s Electrical Repair").

:- dynamic(clue/3).
clue(sadies_sob_story, "She met George at the New York Public Library. She loves George because she found him entirely different from your ordinary Joe. He read books about the human brain and the spirit world and all kinds of things. He thought a lot. George would have gone to college, only his family couldn’t afford it.", false).
clue(sadies_sob_story, "[Core, Fuller’s Electrical Repair] George works as an electrical repairman at Fuller’s Electrical Repair, just a couple blocks north of Fulton Street in downtown Brooklyn.", false).
clue(fullers_electrical_repair, "She always thought George different from the other boys. Bit of a dreamer. Sometimes used to just stare off into space. Why, one time she thought she saw him squinting as though he were trying to see something just out of view.", false).
