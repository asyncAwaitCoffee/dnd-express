drop table if exists classes;
drop sequence if exists classes_seq;

create sequence classes_seq
as smallint
increment by 1
start with 1
no cycle;

create table classes
(
	class_id smallint not null default nextval('classes_seq'),
	title varchar(50),
	hp_dice jsonb
);

drop table if exists races;

create table races
(
	race_id smallint not null,
	race_name varchar(50) not null,
	race_features json,
	parent_race smallint
);