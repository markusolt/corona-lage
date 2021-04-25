.print '    inserting "{date}"'

.import 'cache/intensivregister/{date}.csv' intensivregister_csv
create table intensivregister as
select
    'DE' || AGS as 'region',
    faelle_covid_aktuell as 'patients',
    faelle_covid_aktuell_beatmet as 'patients_vent',
    betten_gesamt as 'capacity'
from intensivregister_csv;

insert into care
select
    r.key,
    date('{date}'),
    sum(ir.patients),
    sum(ir.patients_vent),
    sum(ir.capacity)
from regions as 'r'
inner join intensivregister as 'ir'
    on ir.region = r.key
group by r.key;

drop table intensivregister_csv;
drop table intensivregister;
