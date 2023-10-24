drop table if exists proficiencies;
drop sequence if exists proficiencies_seq;

create sequence proficiencies_seq
as bigint
increment by 1
start with 1
no cycle;

create table proficiencies
(
	proficiency_id bigint default nextval('proficiencies_seq'),
	title varchar(50),
	description varchar(200),
	code varchar(20),
	category char(1)
);

drop table if exists class_proficiencies;

create table class_proficiencies
(
	class_id smallint not null,
	proficiency_id bigint,
	class_level smallint
);