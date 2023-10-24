create or replace procedure create_new_account
(
	_login varchar(20),
	_password char(64),
	
	out account_token uuid
)
language plpgsql
security definer												-- ??
as $$ begin

	insert into accounts as a
		(account_login, account_password)
	values
		(_login, _password)
	returning a.account_token into account_token;

end;
$$;