create or replace procedure add_class_features
(
	_character_id bigint,
	_class_id smallint
)
language plpgsql
security definer												-- ??
as $$
begin
	
	insert into character_class_features
		(character_id, feature_id, charges_actual)
	select _character_id, f.feature_id, (formulas.process_formula(_character_id, charges) -> 'flat')::smallint
	from class_features as cf
		join features as f
			on f.feature_id = cf.feature_id
	where class_id = _class_id;

end;
$$;

create or replace procedure add_character_custom_feature
(
	_character_id bigint,
	_title varchar(30),
	_description varchar(100),
	_effects json,
	_duration smallint,
	_charges smallint,
	
	out feature_id bigint
)
language plpgsql
security definer												-- ??
as $$
begin

	insert into custom_features as cf
		(title, description, charges)
	values
		(_title, _description, _charges)
	returning cf.feature_id into feature_id;
	
	insert into character_custom_features
		(character_id, feature_id, effects_actual, duration_actual, charges_actual)
	values
		(_character_id, feature_id, _effects, _duration, _charges);
		
end; $$;

create or replace procedure delete_character_custom_feature
(
	_character_id bigint,
	_feature_id bigint	
)
language plpgsql
security definer												-- ??
as $$ begin

	delete
	from character_custom_features
	where character_id = _character_id
		and feature_id = _feature_id;
		
	delete	--or dont?
	from custom_features
	where feature_id = _feature_id;

end;$$;

create or replace procedure pay_feature_cost
(
	_character_id bigint,
	_feature_id bigint,
	
	out charges_actual smallint
)
security definer
language plpgsql
as $$
begin
	update character_class_features as ccf
		set charges_actual = ccf.charges_actual - 1
	where ccf.character_id = _character_id
		and ccf.character_id = _character_id
		and ccf.charges_actual > 0
	returning ccf.charges_actual into charges_actual;
end;$$;