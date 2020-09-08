use temp__block_converter;

drop table if exists data_before;
drop table if exists data_after;

create table data_before (
  post_id int,
  data text
) charset=utf8 collate utf8_unicode_ci;

create table data_after (
  post_id int,
  data text
) charset=utf8 collate utf8_unicode_ci;

grant all on temp__block_converter.* to 'block_converter'@'%' identified by 'block_converter';

