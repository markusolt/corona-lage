.mode csv
.separator ,
.header on
.bail on

.import '../web/api/regions/regions.csv' regions_csv
create table regions as
select
    key
from regions_csv;

.import '../web/api/care/care.csv' care_csv
create table care as
select
    region,
    date,
    patients,
    patients_vent,
    capacity
from care_csv
where date < date('{date}');

drop table regions_csv;
drop table care_csv;
