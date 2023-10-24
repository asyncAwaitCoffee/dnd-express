create or replace procedure add_class_items
(
	_character_id bigint,
	_class_id smallint
)
language plpgsql
security definer												-- ??
as $$
begin
	
	insert into character_inventory
		(character_id, cell_id, item_id, quantity_actual, item_location)
	select
		_character_id, row_number() over(order by null), item_id, quantity, 0
	from class_inventory
	where class_id = _class_id;
	
	--should be limited by the size of character inventory

end;
$$;

create or replace procedure equip_item
(
	_character_id bigint,
	_cell_id smallint,
	
	out effect_id bigint,
	out base_effects jsonb,
	out mark_effects jsonb,
	out asis_effects jsonb
)
language plpgsql
security definer												-- ??
as $$ begin

	update character_inventory as ci
		set item_location = i.body_part
	from items as i	
		join effects as e
			on i.effect_id = e.effect_id
	where ci.character_id = _character_id
		and ci.cell_id = _cell_id
		and ci.item_id = i.item_id
	returning e.effect_id, e.base_effects, e.mark_effects, e.asis_effects into effect_id, base_effects, mark_effects, asis_effects;

end;
$$;

create or replace procedure unequip_item
(
	_character_id bigint,
	_cell_id smallint,
	
	out effect_id bigint
)
language plpgsql
security definer												-- ??
as $$ begin

	update character_inventory as ci
		set item_location = 0
	from items as i	
		join effects as e
			on i.effect_id = e.effect_id
	where ci.character_id = _character_id
		and ci.cell_id = _cell_id
		and ci.item_id = i.item_id
	returning e.effect_id into effect_id;
end;
$$;

create or replace procedure use_item
(
	_character_id bigint,
	_cell_id smallint,
	
	out effect_id bigint,
	out base_effects jsonb,
	out mark_effects jsonb,
	out asis_effects jsonb,
	out duration jsonb,
	out title varchar(50),
	out image_path varchar(20),
	out is_stackable boolean,	--effects
	out is_deleted boolean
)
language plpgsql
security definer												-- ??
as $$
declare _quantity_actual smallint;
begin
	update character_inventory as ci
		set quantity_actual = quantity_actual - 1
	from items as i
		join effects as e
			on e.effect_id = i.effect_id
	where character_id = _character_id
		and cell_id = _cell_id
		and i.item_id = ci.item_id
	returning e.effect_id, e.base_effects, e.mark_effects, e.asis_effects, i.duration, e.title, e.image_path, e.is_stackable, quantity_actual
	into effect_id, base_effects, mark_effects, asis_effects, duration, title, image_path, is_stackable, _quantity_actual;
	
	if (_quantity_actual < 1) then
		begin
			delete from character_inventory
				where character_id = _character_id
			and cell_id = _cell_id;
			
			select true into is_deleted;
		end;
	end if;
end;
$$;

create or replace procedure spend_item
(
	_character_id bigint,
	_cell_id smallint,
	_amount smallint,
	
	out is_deleted boolean
)
language plpgsql
security definer												-- ??
as $$
declare _item_quantity smallint;
begin

	update character_inventory
		set quantity_actual = quantity_actual - _amount
	where character_id = _character_id
		and cell_id = _cell_id
	returning quantity_actual into _item_quantity;
	
	if (_item_quantity < 1) then
		begin
			delete from character_inventory
				where character_id = _character_id
			and cell_id = _cell_id;
			
			select true into is_deleted;
		end;
	end if;

end;
$$;

create or replace procedure delete_item
(
	_character_id bigint,
	_cell_id smallint,
	
	out effect_id bigint
)
language plpgsql
security definer												-- ??
as $$ begin

	delete from character_inventory as ci
		using items as i
	where ci.character_id = _character_id
		and ci.cell_id = _cell_id
		and i.item_id = ci.item_id
	returning case
		when (i.is_equipable and i.body_part = ci.item_location)
		then i.effect_id
		else null end
	into effect_id;

end;
$$;