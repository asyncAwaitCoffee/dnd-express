create or replace function formulas.process_formula
(
	_character_id bigint,
	_data jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare _result jsonb;
declare _function_name varchar(50) := _data -> 'formula';
begin

	execute 'select formulas.' || _function_name || '($1)' using _character_id into _result;

	return _result;
	
end; $$;

create or replace function formulas.rage_charges
(
	_character_id bigint
)
returns jsonb
language plpgsql
security definer
as $$
declare _charges smallint;
declare _class_level smallint;
begin
	select
		main_level into _class_level
	from characters_list
	where main_class = 1;
	
	_charges := case
			when _class_level > 16 then 6
			when _class_level > 11 then 5
			when _class_level > 5 then 4
			when _class_level > 2 then 3
			else 2
		end;
			
	return jsonb_build_object ('flat', _charges);
end; $$;
/*
create or replace function formulas.rage_damage
(
	_character_id bigint
)
returns jsonb
language plpgsql
security definer
as $$
declare _damage smallint;
declare _class_level smallint;
begin
	select
		main_level into _class_level
	from character_list
	where character_id = _character_id
		and main_class = 1;
	
	_damage := case
			when _class_level > 15 then 4
			when _class_level > 8 then 3
			else 2
		end;
			
	return jsonb_build_object ('flat', _damage);
end; $$
*/