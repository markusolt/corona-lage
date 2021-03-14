.mode csv
.separator ,
.header on
.bail on

.import 'cache/rki/{date}.csv' rki_csv
create table rki as
select
    region,
    rep_date,
    cases,
    deaths
from (
    select
        'DE' || IdLandkreis as 'region',
        date(substr(replace(Meldedatum, '/', '-'), 1, 10)) as 'rep_date',
        sum(AnzahlFall * case when NeuerFall > -1 then 1 else 0 end) as 'cases',
        sum(AnzahlTodesfall * case when NeuerTodesfall > -1 then 1 else 0 end) as 'deaths'
    from rki_csv
    group by Meldedatum, IdLandkreis
)
where rep_date < date('{date}')
and cases <> 0 or deaths <> 0;

.once '../web/api/cases/cases.csv'
select
    region,
    date(rep_date, '1 day') as date,
    rep_date,
    cases,
    deaths
from rki
order by region, date desc, rep_date desc;
