create or replace procedure create_new_character
(
	_account_id bigint,
	_character_name varchar(50),
	_race_id smallint,
	_main_class smallint,
	_main_level smallint,
	_str smallint,
	_dex smallint,
	_con smallint,
	_int smallint,
	_wis smallint,
	_cha smallint,
	_hp smallint,
	_spell_slots smallint[],
	
	out character_id bigint
)
language plpgsql
security definer												-- ??
as $$ begin

	insert into characters_list as cl
		(character_name, race_id, main_class, main_level, str, dex, con, int, wis, cha, max_hp, current_hp, spell_slots_max, spell_slots_actual, is_generated)
	values
		(_character_name, _race_id, _main_class, _main_level, _str, _dex, _con, _int, _wis, _cha, _hp, _hp, _spell_slots, _spell_slots, false)
	returning cl.character_id into character_id;
	
	update accounts
		set characters_list = ARRAY_APPEND(characters_list, character_id)
	where account_id = _account_id;

end;
$$;

create or replace procedure delete_character
(
	_account_id bigint,
	_character_id bigint
)
language plpgsql
security definer												-- ??
as $$ begin

	delete from characters_list
	where character_id = _character_id;
	
	update accounts
		set characters_list = array_remove(characters_list, _character_id)
	where account_id = _account_id;

	delete from character_inventory
	where character_id = _character_id;

	delete from character_class_features
	where character_id = _character_id;

	delete from character_custom_features
	where character_id = _character_id;

	delete from character_effects
	where character_id = _character_id;

	delete from character_spells
	where character_id = _character_id;

end;$$;