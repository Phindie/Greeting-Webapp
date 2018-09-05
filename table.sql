
create table greet(
  id serial not null primary key,
  users_greeted varchar(100) not null,
  user_language text not null,
  counter int not null
);
