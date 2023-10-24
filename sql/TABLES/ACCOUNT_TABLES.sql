drop table if exists accounts;
drop sequence if exists accounts_seq;

create sequence accounts_seq
as bigint
increment by 1
start with 1
--cache 1000
no cycle;

create table accounts
(
	account_id bigint not null default nextval('accounts_seq'),
	account_login varchar(20) not null unique,
	account_password char(64) not null,
	account_token uuid not null default gen_random_uuid(),
	characters_list bigint[] not null default '{}'
);

create unique index accounts_uix_login on accounts
(
	account_login
);

create unique index accounts_uix_id on accounts
(
	account_id
);

create unique index accounts_uix_token on accounts
(
	account_token
);

drop table if exists characters_list;
drop sequence if exists characters_list_seq;

create sequence characters_list_seq
as bigint
increment by 1
start with 1
--cache 1000
no cycle;

create table characters_list
(
	character_id bigint not null default nextval('characters_list_seq'),
	character_name varchar(50),
	race_id smallint,
	main_class smallint,
	main_level smallint,
	sub_classes json,
	str smallint,
	dex smallint,
	con smallint,
	int smallint,
	wis smallint,
	cha smallint,
	max_hp smallint,
	current_hp smallint,
	temp_hp smallint default 0,
	spell_slots_max smallint[],
	spell_slots_actual smallint[],
	is_generated boolean
);

create unique index characters_list_uix on characters_list
(
	character_id
);