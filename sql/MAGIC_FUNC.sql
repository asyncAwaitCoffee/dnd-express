create or replace function get_character_spells
(
	_character_id bigint
)
returns table
(
	spell_id bigint,
	title varchar(50),
	description varchar(200),
	duration smallint,
	image_path varchar(200),
	spell_level smallint,
	additional_cost jsonb,
	spell_type char(1),
	is_stackable boolean,
	effect_id bigint,
	base_effects jsonb,
	mark_effects jsonb,
	asis_effects jsonb
)
language plpgsql
security definer												-- ??
as $$
begin
	return query
		select
			s.spell_id,
			s.title,
			s.description,
			s.duration,
			e.image_path,
			s.spell_level,
			s.additional_cost,
			s.spell_type,
			e.is_stackable,
			e.effect_id,
			e.base_effects,
			e.mark_effects,
			e.asis_effects
		from characters_list as cl
			join class_spells as cs
				on cs.class_id = cl.main_class
			join spells as s
				on cs.spell_id = s.spell_id
			join effects as e
				on e.effect_id = s.effect_id
		where cl.character_id = _character_id;				
end; $$;

create or replace function get_character_effects
(
	_character_id bigint
)
returns table
(
	effect_id bigint,
	title varchar(50),
	duration smallint,
	effects_actual jsonb,
	mark_effects jsonb,
	asis_effects jsonb,
	is_stackable boolean,
	image_path varchar(50),
	origin varchar(20)
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	ce.effect_id, e.title, ce.duration_actual, ce.effects_actual, e.mark_effects, e.asis_effects, e.is_stackable, e.image_path, ce.origin
from character_effects as ce
	join effects as e
		on ce.effect_id = e.effect_id
where ce.character_id = _character_id;

end;$$;

--вызывается на каждый ключ в json и делае запрос в таблицу applicable_effects
--можно вытащить код в соответстующие процедуры, но сложнее обновлять
create or replace function is_effect_applicable
(
	_effect_name text
)
returns boolean
language plpgsql
security definer												-- ??
as $$
declare _applicable_effects varchar(10)[];
begin

	select effect_names into _applicable_effects from applicable_effects;
	
	return
		_effect_name = ANY(_applicable_effects);

end;$$;