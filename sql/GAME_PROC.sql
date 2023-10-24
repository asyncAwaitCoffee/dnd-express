create or replace procedure next_round
(
	_character_id bigint,
	
	out deleted_effects json,
	out applied json
)
language plpgsql
security definer
as $$
declare _agg_effects jsonb;
declare _effects record;
declare _effect record;
declare _accumulated_effects jsonb = '{}';

begin

	update character_effects
		set duration_actual = duration_actual - 1
	where character_id = _character_id;
		
	with del_effects as (
		delete from character_effects
		where character_id = _character_id
			and duration_actual < 1
		returning effect_id, effects_actual
	)	
	select
		json_agg(effect_id), json_agg(effects_actual) into deleted_effects, _agg_effects
	from del_effects;
	
	for _effects in
		( select es from jsonb_array_elements(_agg_effects) as j(es) )
	loop
		for _effect in
			( select k, v from jsonb_each(_effects.es) as j(k, v))
		loop
			if not _accumulated_effects ? _effect.k then
				select _accumulated_effects || jsonb_build_object(_effect.k, _effect.v) into _accumulated_effects;
			else
				select _accumulated_effects || jsonb_build_object(_effect.k, _effect.v::int + (_accumulated_effects -> _effect.k)::int) into _accumulated_effects;
			end if;
		end loop;
	end loop;
	
	if exists (select * from jsonb_object_keys(_accumulated_effects)) then
		call apply_character_effects(_character_id, _accumulated_effects::json, true, applied);
	end if;

end; $$;

create or replace procedure long_rest
(
	_character_id bigint,
	
	out current_hp smallint,
	out max_hp smallint,
	out spell_slots_actual smallint[],
	out charges_restored jsonb,
	out deleted_effects json
)
language plpgsql
security definer
as $$
declare _agg_effects jsonb;
declare _effects record;
declare _effect record;
declare _accumulated_effects jsonb = '{}';
declare _result json;
begin
		
	with del_effects as (
		delete from character_effects
		where character_id = _character_id
			and duration_actual is not null
		returning effect_id, effects_actual
	)	
	select
		json_agg(effect_id), json_agg(effects_actual) into deleted_effects, _agg_effects
	from del_effects;
		
	for _effects in
		( select es from jsonb_array_elements(_agg_effects) as j(es) )
	loop
		for _effect in
			( select k, v from jsonb_each(_effects.es) as j(k, v))
		loop
			if not _accumulated_effects ? _effect.k then
				select _accumulated_effects || jsonb_build_object(_effect.k, _effect.v) into _accumulated_effects;
			else
				select _accumulated_effects || jsonb_build_object(_effect.k, _effect.v::int + (_accumulated_effects -> _effect.k)::int) into _accumulated_effects;
			end if;
		end loop;
	end loop;
		
	if exists (select * from jsonb_object_keys(_accumulated_effects)) then
		call apply_character_effects(_character_id, _accumulated_effects::json, true, _result);
	end if;
	
	update characters_list as cl
		set current_hp = cl.max_hp,
			spell_slots_actual = cl.spell_slots_max
	where cl.character_id = _character_id
	returning cl.current_hp, cl.max_hp, cl.spell_slots_actual into current_hp, max_hp, spell_slots_actual;
	
	with charges_update as (
		update character_class_features as ccf
			set charges_actual = (formulas.process_formula(_character_id, f.charges) -> 'flat')::smallint
		from features as f
			where f.feature_id = ccf.feature_id
				and ccf.character_id = _character_id
				and f.charges is not null
		returning ccf.feature_id, ccf.charges_actual
		)	
	select
		coalesce(charges_restored, '{}'::jsonb) || jsonb_build_object(feature_id, charges_actual) into charges_restored
	from charges_update;

end; $$;