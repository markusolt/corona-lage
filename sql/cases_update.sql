.mode csv
.separator ,
.header on
.bail on

.import '../web/api/cases/cases.csv' cases_csv
create table cases as
select
    region,
    date,
    rep_date,
    cases,
    deaths
from cases_csv
where date < date('{date}');

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
and (cases <> 0 or deaths <> 0);

insert into cases
select
    region,
    date('{date}') as 'date',
    rep_date,
    cases,
    deaths
from (
    select
        r.region,
        r.rep_date,
        r.cases - ifnull(sum(c.cases), 0) as 'cases',
        r.deaths - ifnull(sum(c.deaths), 0) as 'deaths'
    from rki as 'r'
    left outer join cases as 'c'
        on c.region = r.region and c.rep_date = r.rep_date
    group by r.region, r.rep_date
)
where (cases <> 0 or deaths <> 0);

.once '../web/api/cases/cases.csv'
select
    region,
    date,
    rep_date,
    cases,
    deaths
from cases
order by region, date desc, rep_date desc;
