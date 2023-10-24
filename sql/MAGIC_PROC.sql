create or replace procedure add_character_effects
(
	_character_id bigint,
	_effect_id bigint,
	_effects_actual json,
	_origin varchar(20),
	_duration smallint,
	_is_stackable boolean,
	
	out _result json
)
language plpgsql
security definer												-- ??
as $$
declare _is_found bigint;
declare _effects_actual_current json;
begin		
		perform
			ce.effect_id 
		from character_effects as ce
		where ce.character_id = _character_id
			and ce.effect_id = _effect_id;
					
		--if found ??
		if not found or (found and _is_stackable)
		then
			if _duration is not null then
				insert into character_effects
				(character_id, effect_id, duration_actual, effects_actual, origin) values
				(_character_id, _effect_id, _duration, _effects_actual, _origin);
			end if;
			
			if _effects_actual is not null then
				call apply_character_effects(_character_id, _effects_actual, false, _result);
			end if;
		
		elsif found and not _is_stackable
		then
		
			select effects_actual into _effects_actual_current
			from character_effects
			where effect_id = _effect_id
				and character_id = _character_id;
		
			update character_effects
				set duration_actual = _duration,
					effects_actual = _effects_actual
			where effect_id = _effect_id
				and character_id = _character_id;
			
			if _effects_actual is not null then
				call re_apply_character_effects(_character_id, _effects_actual, _effects_actual_current, _result);
			end if;
			
		end if;
		
		select coalesce(_result, '{}') into _result;
end;
$$;

create or replace procedure apply_character_effects
(
	_character_id bigint,
	_magic_effects json,
	_is_cancelling boolean,
	
	out _result json
)
language plpgsql
security definer												-- ??
as $$
	declare query_text text = 'update characters_list set ';
	declare query_returning text = ' returning json_build_object(';
	declare _sign text = case when _is_cancelling then ' - ' else ' + ' end;
	declare _buff record;
	declare _update boolean = false;
begin
	
	for _buff in
		select * from json_each_text(_magic_effects)
	loop
		if not is_effect_applicable(_buff.key) then
			continue;
		end if;
		query_text = query_text || _buff.key || ' = ' || _buff.key || _sign || _buff.value || ', ';
		query_returning = query_returning || quote_literal(_buff.key) || ', ' || _buff.key || ', ';
		select true into _update;
	end loop;
	
	if not _update then
		return;
	end if;
	
	query_text = RTRIM(query_text, ', ') || ' where character_id = ' || _character_id;
	query_text = query_text || RTRIM(query_returning, ', ') || ');';
	
	execute query_text into _result;

end; $$;

create or replace procedure re_apply_character_effects
(
	_character_id bigint,
	_magic_effects_new json,
	_magic_effects_old json,
	
	out _result json
)
language plpgsql
security definer												-- ??
as $$
/*
	обновляем эффекты вычитая из новых значений старые в соответствующих ключах
*/
	declare query_text text = 'update characters_list set ';
	declare query_returning text = ' returning json_build_object(';
	declare _buff record;
	declare _update boolean = false;
begin
	
	for _buff in
		select * from json_each_text(_magic_effects_new)
	loop
		if not is_effect_applicable(_buff.key) then
			continue;
		end if;
		query_text = query_text || _buff.key || ' = ' || _buff.key || ' + ' || _buff.value || ' - ' || (_magic_effects_old::json -> _buff.key) || ', ';
		query_returning = query_returning || quote_literal(_buff.key) || ', ' || _buff.key || ', ';
		select true into _update;
	end loop;
	
	if not _update then
		return;
	end if;
	
	query_text = RTRIM(query_text, ', ') || ' where character_id = ' || _character_id;
	query_text = query_text || RTRIM(query_returning, ', ') || ');';
	
	execute query_text into _result;

end; $$;

create or replace procedure pay_spell_cost
(
	_character_id bigint,
	_slot_level smallint,
	_additional_cost jsonb,
	
	out _slot_count smallint
)
language plpgsql
security definer												-- ??
as $$
begin

	if _slot_level is not null then
		update characters_list
			set spell_slots_actual[_slot_level] = spell_slots_actual[_slot_level] - 1
		where character_id = _character_id
			and spell_slots_actual[_slot_level] > 0
		returning spell_slots_actual[_slot_level] into _slot_count;
	end if;

end; $$;

create or replace procedure restore_hp
(
	_character_id bigint,
	_amount smallint,
	
	out current_hp json	--json ?
)
language plpgsql
security definer												-- ??
as $$
begin

	update characters_list as cl
		set current_hp = GREATEST(LEAST(cl.current_hp + _amount, max_hp), -max_hp)
	where cl.character_id = _character_id
	returning cl.current_hp into current_hp;

end;
$$;

create or replace procedure restore_mp
(
	_character_id bigint,
	_amount smallint,
	
	out spell_slots_actual smallint[]
)
language plpgsql
security definer												-- ??
as $$
begin

	update characters_list as cl
		set spell_slots_actual = cl.spell_slots_max
	where cl.character_id = _character_id
	returning cl.spell_slots_actual into spell_slots_actual;

end;
$$;