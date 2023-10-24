drop table if exists custom_features;
drop sequence if exists custom_features_seq;

create sequence custom_features_seq
as bigint
increment by 1
start with 1
no cycle;

create table custom_features
(
	feature_id bigint not null default nextval('custom_features_seq'),
	title varchar(50),
	description varchar(100),
	effects json,
	duration smallint,
	is_stackable boolean,
	image_path varchar(50),
	spell_level smallint,
	additional_cost jsonb,
	charges smallint,
	is_powerable boolean,
	is_passive boolean
);

drop table if exists character_custom_features;

create table character_custom_features
(
	character_id bigint,
	feature_id bigint,
	effects_actual json,
	duration_actual smallint,
	charges_actual smallint
);

drop table if exists features;
drop sequence if exists features_seq;

create sequence features_seq
as bigint
increment by 1
start with 1
no cycle;

create table features
(
	feature_id bigint not null default nextval('features_seq'),
	title varchar(50),
	description varchar(200),
	duration smallint,
	effect_id bigint,
	is_stackable boolean,
	image_path varchar(50),
	spell_level smallint,
	additional_cost jsonb,
	charges jsonb,
	is_powerable boolean,
	is_active boolean,
	feature_type char(1)
);

drop table if exists class_features;

create table class_features
(
	class_id smallint not null,
	feature_id bigint,
	class_level smallint
);

drop table if exists character_class_features;

create table character_class_features
(
	character_id bigint,
	feature_id bigint,
	charges_actual smallint
);

drop table if exists character_feature_effects;

create table character_feature_effects
(
	character_id bigint,
	feature_id bigint,
	effects_actual jsonb,
	duration_actual smallint
);