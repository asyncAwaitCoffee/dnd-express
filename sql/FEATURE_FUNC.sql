create or replace function get_character_class_features
(
	_character_id bigint
)
returns table
(
	feature_id bigint,
	title varchar(50),
	description varchar(200),
	charges_actual smallint,
	is_active boolean,
	feature_type char(1)
)
language plpgsql
security definer
as $$
begin
	return query
		select
			f.feature_id,
			f.title,
			f.description,
			ccf.charges_actual,
			f.is_active,
			f.feature_type
		from characters_list as cl
			join class_features as cf
				on cf.class_id = cl.main_class
			join character_class_features as ccf
				on ccf.feature_id = cf.feature_id
					and cl.character_id = ccf.character_id
			join classes as c
				on c.class_id = cf.class_id
			join features as f
				on f.feature_id = cf.feature_id
			where cl.character_id = _character_id
				and cf.class_level <= cl.main_level;
end;$$;


create or replace function get_character_class_feature
(
	_character_id bigint,
	_feature_id bigint
)
returns table
(
	feature_id bigint,
	title varchar(50),
	duration smallint,
	effect_id bigint,
	base_effects jsonb,
	mark_effects jsonb,
	asis_effects jsonb,
	image_path varchar(50)
)
language plpgsql
security definer
as $$
begin
	return query
		select
			f.feature_id,
			f.title,
			f.duration,
			f.effect_id,
			e.base_effects,
			e.mark_effects,
			e.asis_effects,
			f.image_path
		from character_class_features as ccf
			join features as f
				on f.feature_id = ccf.feature_id
			join effects as e
				on e.effect_id = f.effect_id
			where ccf.character_id = _character_id;
end;$$;

create or replace function get_class_proficiencies
(
	_character_id bigint
)
returns table
(
	title varchar(50),
	description varchar(200),
	code varchar(200),
	category char(1)
)
language plpgsql
security definer
as $$
begin
	return query
		select
			p.title,
			p.description,
			p.code,
			p.category
		from characters_list as cl
			join class_proficiencies as cp
				on cp.class_id = cl.main_class
			join classes as c
				on c.class_id = cp.class_id
			join proficiencies as p
				on p.proficiency_id = cp.proficiency_id
			where cl.character_id = _character_id
				and cp.class_level <= cl.main_level;
end;$$;

create or replace function get_character_custom_features
(
	_character_id bigint
)
returns table
(
	feature_id bigint,
	title varchar(30),
	description varchar(100),
	charges smallint
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	cf.feature_id,
	cf.title,
	cf.description,
	cf.charges
from character_custom_features as ccf
	join custom_features as cf
		on ccf.feature_id = cf.feature_id
where character_id = _character_id;

end;$$;