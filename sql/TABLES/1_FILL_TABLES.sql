truncate table features;
alter sequence features_seq restart;

insert into features
	(title, description, duration, effect_id, is_stackable, image_path, spell_level, additional_cost, charges, is_powerable, is_active, feature_type)
values
	('Rage', 'In battle, you fight with primal ferocity. On your turn, you can enter or end a rage state as a bonus action.', 10, 5, false, 'rage', null, null, '{"formula": "rage_charges"}', null, true, 'a')
;

truncate table class_features;

insert into class_features
	(class_id, feature_id, class_level)
values
	(1,1,1);

truncate table proficiencies;
alter sequence proficiencies_seq restart;

insert into proficiencies
	(title, description, code, category)
values
	('Light Armor', 'Allows to use armor of type without penalties.', 'armor_class', 'a'),
	('Medium Armor', 'Allows to use armor of type without penalties.', 'armor_class', 'a'),
	('Shield', 'Allows to use shield without penalties.', 'shield_class', 'a'),
	('Simple Weapon', 'Allows to use weapon of type without penalties.', 'weapon', 'w'),
	('Martial Weapon', 'Allows to use weapon of type without penalties.', 'weapon', 'w'),
	('Saving Throw: Strength', 'Rises chances of successfull saving throw.', 'str_save', 's'),
	('Saving Throw: Dexterity', 'Rises chances of successfull saving throw.', 'dex_save', 's'),
	('Saving Throw: Constitution', 'Rises chances of successfull saving throw.', 'con_save', 's'),
	('Saving Throw: Intelligence', 'Rises chances of successfull saving throw.', 'int_save', 's'),
	('Saving Throw: Wisdom', 'Rises chances of successfull saving throw.', 'wis_save', 's'),
	('Saving Throw: Charisma', 'Rises chances of successfull saving throw.', 'cha_save', 's'),
	('Animal Handling', 'Rises chances of successfull skill check.', 'animal', 'c'),
	('Athletics', 'Rises chances of successfull skill check.', 'athletics', 'c'),
	('Intimidation', 'Rises chances of successfull skill check.', 'intimidation', 'c'),
	('Nature', 'Rises chances of successfull skill check.', 'nature', 'c'),
	('Perception', 'Rises chances of successfull skill check.', 'perception', 'c'),
	('Survival', 'Rises chances of successfull skill check.', 'survival', 'c'),
	('Persuasion', 'Rises chances of successfull skill check.', 'persuasion', 'c'),
	('Performance', 'Rises chances of successfull skill check.', 'performance', 'c'),
	('Arcana', 'Rises chances of successfull skill check.', 'arcana', 'c'),
	('Medicine', 'Rises chances of successfull skill check.', 'medicine', 'c'),
	('Insight', 'Rises chances of successfull skill check.', 'insight', 'c'),
	('Religion', 'Rises chances of successfull skill check.', 'religion', 'c');

truncate table class_proficiencies;
insert into class_proficiencies
	(class_id, proficiency_id, class_level)
values
	--Barbarian
	(1,1,1),(1,2,1),(1,3,1),(1,4,1),(1,5,1),(1,6,1),(2,7,1),(1,8,1),(2,9,1),(2,10,1),
	(2,11,1),(1,12,1),(1,13,1),(1,14,1),(1,15,1),(1,16,1),(1,17,1),
	--Druid
	(2,1,1),(2,2,1),(2,3,1),(2,9,1),(2,10,1),(2,16,1),(2,17,1),(2,20,1),(2,21,1),(2,12,1),(2,15,1),(2,22,1),(2,23,1)
	;


truncate table classes;
alter sequence classes_seq restart;

insert into classes
	(title, hp_dice)
values
	('Barbarian', '{"12": 1}'),
	('Druid', '{"8": 1}'),;

truncate table effects;
alter sequence effects_seq restart;

insert into effects
	(is_stackable,title,image_path,base_effects,mark_effects,asis_effects)
values
	(false,'Stone Skin','stone_skin','{"armor_class": {"flat": 3}}',null,null),
	(false,'Blessed Body','blessed_body','{"max_hp": {"flat": 10}, "speed": {"dices": {"4": 3}}}',null,null),
	(false,'Hawk Eye','hawk_eye','{"accuracy": {"dices": {"4": 1}}}',null,null),
	(false,'Health Potion','potion_health','{"max_hp": {"dices": {"10": 2}}, "current_hp": {"dices": {"4": 1}}}',null,null),
	(false,'Rage','rage','{"damage": {"formula": "rageDamage"}}','{"advantage": ["athletics", "str_save", "dex_save"], "resistance": ["bludge", "pierce", "slash"]}',null),
	
	(false,null,null,null,null,'{ "accuracy": {"flat": 1}, "damage": {"dices": {"8": 1, "4": 2}, "flat": 1}, "armor_class": {"flat": 1} }'),
	(false,null,null,null,null,'{ "armor_class": {"flat": 2} }'),
	(false,null,null,null,null,'{ "armor_class": {"flat": 16} }'),
	(false,null,null,'{"restore_food": {"flat": 1}}',null,null),
	(false,null,null,'{"current_mp": {"flat": 1}}',null,null);

truncate table items;
alter sequence items_seq restart;

insert into items
	(duration, category, subcategory, body_part, qty_in_stack, max_qty, is_equipable, is_consumable, is_usable, effect_id, title, image_path, description)
values
	(null, 1, 1, 3, 1, null, true, false, false, 6, 'Green Guard Sword', 'weapon_sword', 'Silver sword with green flame engraving.'),
	(null, 2, 1, 5, 1, null, true, false, false, 7, 'Green Guard Shield', 'armor_shield', 'Silver shield with green flame engraving.'),
	(null, 2, 4, 4, 1, null, true, false, false, 8, 'Green Guard Armor', 'armor_body', 'Silver armor with green flame engraving.'),
	(10, 3, 1, null, 10, null, false, true, true, 4, 'Health Potion', 'potion_health', 'Bottle with thick red liquid.'),
	(null, 3, 1, null, 10, null, false, true, true, 10, 'Mana Potion', 'potion_mana', 'Bottle with thick blue liquid.'),
	(null, 4, 1, null, 1000000, 1000000000, false, false, false, null, 'Gold Coins', 'coin_gold', 'Gold coins.'),
	(1200, 3, 2, null, 10, null, false, true, false, 9, 'Grilled Meat', 'supply_food', 'Delicious grilled meat.'),
	(null, 1, 1, 3, 1, null, true, false, false, 6, 'Green Guard Club', 'weapon_club', 'Wooden club encrusted with green orb.');


truncate table spells;
alter sequence spells_seq restart;

insert into spells
	(title, description, duration, effect_id, spell_level, additional_cost, is_powerable, spell_type)
values
	('Stone Skin','Increases AC by 3 for 5 turns.',5,1, 1, null, false, 'i'),
	('Blessed Body','Increases Max. HP by 10 and Speed by 3d4 for 5 turns.',5,2,1, null, false, 'i'),
	('Hawk Eye','Increases Accuracy by 1d4 for 10 turns.',10,3,2, null, false, 'i');

truncate table applicable_effects;
insert into applicable_effects
	(effect_names)
values
	('{"temp_hp", "max_hp", "current_hp", "current_mp"}');
	
truncate table class_spells;

insert into class_spells
	(class_id, spell_id)
values
	(1, 1), (1, 2),
	(2, 1), (2, 2), (2, 3);
	
truncate table class_inventory;
insert into class_inventory
	(class_id, item_id, quantity)
values
	(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 10), (1, 6, 500), (1, 7, 8),
	(2, 8, 1), (2, 2, 1), (2, 3, 1), (2, 4, 10), (2, 5, 10), (2, 6, 500), (2, 7, 8);