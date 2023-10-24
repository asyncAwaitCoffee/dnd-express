create or replace function get_account_token_by_login
(
	_account_login varchar(20),
	_account_password char(64)
)
returns table
(
	account_token uuid
)
language plpgsql
security definer												-- ??
as $$
begin

return query
	select
		a.account_token
	from accounts as a
	where account_login = _account_login
		and account_password = _account_password;
			
end;$$;

create or replace function get_account_by_token
(
	_account_token uuid
)
returns table (
	account_id bigint,
	account_login varchar(20),
	characters_list bigint[]
)
language plpgsql
security definer												-- ??
as $$
begin	

return query
	select
		a.account_id,
		a.account_login,
		a.characters_list
	from accounts as a
	where account_token = _account_token;

end;$$;




create or replace function get_login_by_uuid
(
	_account_uuid uuid
)
returns varchar(20)
language plpgsql
security definer												-- ??
as $$
declare _account_login varchar(20);
begin	

	select account_login into _account_login
	from player_account
	where account_uuid = _account_uuid;

	if (found) then
		return _account_login;
	else
		raise exception 'Nonexistent ID';
	end if;

end;$$;







create or replace function get_account_id_by_uuid
(
	_account_uuid uuid
)
returns bigint
language plpgsql
security definer												-- ??
as $$
declare _account_id bigint;
begin	

	select account_id into _account_id
	from player_account
	where account_uuid = _account_uuid;

	if (found) then
		return _account_id;
	else
		raise exception 'Nonexistent UUID';
	end if;

end;$$;

create or replace function get_class_data
(
	_class_id smallint
)
returns table
(
	_class_features jsonb,
	_abilities_per_level jsonb
)
language plpgsql
security definer												-- ??
as $$ begin

return query
select
	class_features,
	abilities_per_level
from classes
where class_id = _class_id;

end;$$