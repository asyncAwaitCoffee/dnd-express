create or replace function get_character_inventory
(
	_character_id bigint
)
returns table
(
	cell_id smallint,
	item_id bigint,
	image_path varchar(50),
	qty_in_stack int,
	quantity_actual bigint,
	max_quantity int,
	is_equipable boolean,
	body_part smallint,
	item_location smallint,
	is_consumable boolean,
	is_usable boolean,
	title varchar(50),
	description varchar(200),
	is_equiped boolean
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	ci.cell_id,
	i.item_id,
	--e.effects,
	i.image_path,
	i.qty_in_stack,
	ci.quantity_actual,
	i.max_qty,
	i.is_equipable,
	i.body_part,
	ci.item_location,
	i.is_consumable,
	i.is_usable,
	i.title,
	i.description,
	(i.is_equipable and i.body_part = ci.item_location) as is_equiped
from character_inventory as ci
	join items as i
		on i.item_id = ci.item_id
where character_id = _character_id
order by ci.cell_id;
end;$$;

create or replace function get_inventory_item
(
	_character_id bigint,
	_cell_id smallint
)
returns table
(
	_item_id smallint,
	_item_effects json,
	_image_path varchar(50),
	_is_stackable boolean,
	_quantity smallint,
	_max_quantity smallint,
	_is_equipable boolean,
	_body_part smallint,
	_item_location smallint,
	_is_consumable boolean,
	_title varchar(50),
	_description varchar(200)
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	cell_id,
	item_effects,
	image_path,
	is_stackable,
	quantity,
	max_quantity,
	is_equipable,
	body_part,
	item_location,
	is_consumable,
	title,
	description
from character_inventory
where character_id = _character_id
	and cell_id = _cell_id;

end;$$;


create or replace function get_equipment_effects
(
	_character_id bigint
)
returns table
(
	effect_id bigint,
	base_effects jsonb,
	mark_effects jsonb,
	asis_effects jsonb
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	e.effect_id,
	e.base_effects,
	e.mark_effects,
	e.asis_effects
from character_inventory as ci
	join items as i
		on i.item_id = ci.item_id
	join effects as e
		on e.effect_id = i.effect_id
where ci.character_id = _character_id
	and ci.item_location = i.body_part;

end;$$;