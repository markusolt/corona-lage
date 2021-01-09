.mode csv
.separator ,
.header on
.bail on

.import 'cache/rki_landkreise.csv' rki_landkreise_csv
create table regions as
select
    'DE' || substr('00000' || RS, -5, 5) as 'key',
    GEN as 'name',
    EWZ + 0 as 'population'
from rki_landkreise_csv;

insert into regions
select
    'DE' as 'key',
    'Bundesrepublik Deutschland' as 'name',
    sum(population) as 'population'
from regions;

.import 'cache/rki_bundeslander.csv' rki_bundeslander_csv
insert into regions
select
    'DE' || substr('00' || rec.LAN_ew_AGS, -2, 2) as 'key',
    rec.LAN_ew_GEN as 'name',
    sum(population) as 'population'
from rki_bundeslander_csv as rec
left outer join regions as reg
    on 'DE' || substr('00' || rec.LAN_ew_AGS, -2, 2) = substr(reg.key, 1, 4)
group by rec.LAN_ew_AGS;

.import 'cache/geonames_postalcodes.csv' geonames_postalcodes_csv
create table postal_codes as
select
    'DE' || admin_3_id as 'key',
    admin_1_name as 'parent_name',
    postal_code,
    place
from geonames_postalcodes_csv
where admin_3_id <> '';

.once 'cache/regions-with-related-words.csv'
select
    reg.key,
    reg.name,
    reg.population,
    reg.name || ' ' || ifnull(group_concat(post.parent_name, ' '), '') || ' ' || ifnull(group_concat(post.postal_code, ' '), '') || ' ' || ifnull(group_concat(post.place, ' '), '') as 'words'
from regions as 'reg'
left outer join postal_codes as 'post'
    on reg.key = post.key
group by reg.key
order by reg.key;

.q
