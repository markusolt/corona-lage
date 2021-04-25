.mode csv
.separator ,
.header on
.bail on

.print '    creating "care.csv"'

.import '../web/api/regions/regions.csv' regions_csv
create table regions as
select
    key
from regions_csv;

.import 'cache/intensivregister/{date}.csv' intensivregister_csv
create table intensivregister as
select
    'DE' || AGS as 'region',
    faelle_covid_aktuell as 'patients',
    faelle_covid_aktuell_beatmet as 'patients_vent',
    betten_gesamt as 'capacity'
from intensivregister_csv;

create table care as
select
    r.key as 'region',
    date('{date}') as 'date',
    sum(ir.patients) as 'patients',
    sum(ir.patients_vent) as 'patients_vent',
    sum(ir.capacity) as 'capacity'
from regions as 'r'
inner join intensivregister as 'ir'
    on ir.region = r.key
group by r.key;

drop table regions_csv;
drop table intensivregister_csv;
drop table intensivregister;
