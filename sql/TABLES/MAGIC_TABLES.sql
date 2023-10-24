drop table if exists spells;
drop sequence if exists spells_seq;

create sequence spells_seq
as bigint
increment by 1
start with 1
no cycle;

create table spells
(
	spell_id bigint default nextval('spells_seq'),
	title varchar(50),
	description varchar(200),
	duration smallint,
	effect_id bigint,
	spell_level smallint,
	additional_cost jsonb,
	is_powerable boolean,
	spell_type char(1)	
);

create unique index spells_uix on spells
(
	spell_id
);

drop table if exists effects;
drop sequence if exists effects_seq;

create sequence effects_seq
as bigint
increment by 1
start with 1
no cycle;

create table effects
(
	effect_id bigint default nextval('effects_seq'),
	is_stackable boolean,
	title varchar(50),
	image_path varchar(50),
	base_effects jsonb,
	mark_effects jsonb,
	asis_effects jsonb
);

create unique index effects_uix on effects
(
	effect_id
);

drop table if exists character_effects;

create table character_effects
(
	character_id bigint,
	effect_id bigint,
	duration_actual smallint,
	effects_actual jsonb,
	origin varchar(20)
);

create index character_effects_ix on character_effects
(
	character_id
);

drop table if exists character_spells;

create table character_spells
(
	character_id bigint,
	spell_id bigint
);

create index character_spells_ix on character_spells
(
	character_id
);

drop table if exists class_spells;

create table class_spells
(
	class_id smallint,
	spell_id bigint
);

create index class_spells_ix on class_spells
(
	class_id
);

drop table if exists applicable_effects;

create table applicable_effects
(
	effect_names varchar(10)[]
);