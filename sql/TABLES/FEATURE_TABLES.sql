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

create unique index custom_features_uix on custom_features
(
	feature_id
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

create index character_custom_features_ix on character_custom_features
(
	character_id
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

create unique index features_uix on features
(
	feature_id
);

drop table if exists class_features;

create table class_features
(
	class_id smallint not null,
	feature_id bigint,
	class_level smallint
);

create unique index class_features_uix on class_features
(
	class_id,
	feature_id
);

drop table if exists character_class_features;

create table character_class_features
(
	character_id bigint,
	feature_id bigint,
	charges_actual smallint
);

create unique index character_class_features_uix on character_class_features
(
	character_id,
	feature_id
);