drop table if exists items;
drop sequence if exists items_seq;

create sequence items_seq
as bigint
increment by 1
start with 1
--cache 1000
no cycle;

create table items
(
	duration smallint,
	category smallint,
	subcategory smallint,
	body_part smallint,
	qty_in_stack int,
	max_qty int,
	item_id bigint default nextval('items_seq'),
	is_equipable boolean,
	is_consumable boolean,
	is_usable boolean,
	effect_id bigint,
	title varchar(50),
	image_path varchar(50),
	description varchar(200)
);

create unique index items_uix on items
(
	item_id
);

drop table if exists class_inventory;
create table class_inventory
(
	class_id bigint,
	item_id bigint,
	quantity bigint
);

create index class_inventory_ix on class_inventory
(
	class_id,
	item_id
);

drop table if exists character_inventory;
create table character_inventory
(
	character_id bigint,
	cell_id smallint,
	item_id bigint,
	quantity_actual bigint,
	item_location smallint
);

create unique index character_inventory_uix on character_inventory
(
	character_id,
	cell_id
);