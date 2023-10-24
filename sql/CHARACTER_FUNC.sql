create or replace function get_characters_list
(
	_account_id bigint
)
returns table
(
	character_id bigint,
	character_name varchar(50),
	race_id smallint,
	main_class smallint,
	main_level smallint
)
language plpgsql
security definer												-- ??
as $$ begin

return query
	select
		cl.character_id,
		cl.character_name,
		cl.race_id,
		cl.main_class,
		cl.main_level
	from characters_list as cl
	where cl.character_id = ANY (select unnest(a.characters_list) from accounts as a where a.account_id = _account_id)
	order by cl.character_id;
	
end;$$;

create or replace function get_character_stats
(
	_character_id bigint
)
returns table
(
	character_name varchar(50),
	race_id smallint,
	main_class smallint,
	main_level smallint,
	str smallint,
	dex smallint,
	con smallint,
	"int" smallint,
	wis smallint,
	cha smallint,
	temp_hp smallint,
	max_hp smallint,
	current_hp smallint,
	spell_slots_max smallint[],
	spell_slots_actual smallint[]
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	cl.character_name,
	cl.race_id,
	cl.main_class,
	cl.main_level,
	cl.str,
	cl.dex,
	cl.con,
	cl.int,
	cl.wis,
	cl.cha,
	cl.temp_hp,
	cl.max_hp,
	cl.current_hp,
	cl.spell_slots_max,
	cl.spell_slots_actual
from characters_list as cl
where character_id = _character_id;

end;$$;

create or replace function get_ability_scores
(
	_account_id bigint,
	_character_id bigint
)
returns table
(
	_str smallint,
	_dex smallint,
	_con smallint,
	_int smallint,
	_wis smallint,
	_cha smallint
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	str,
	dex,
	con,
	int,
	wis,
	cha
from character_list
where character_id = _character_id
	and account_id = _account_id;

end;$$;