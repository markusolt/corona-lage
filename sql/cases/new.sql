.mode csv
.separator ,
.header on
.bail on

.print '  cases.csv:'

.import 'cache/rki/{date}.csv' rki_csv
create table rki as
select
    region,
    rep_date,
    age,
    gender,
    cases,
    deaths
from (
    select
        'DE' || IdLandkreis as 'region',
        date(substr(replace(Meldedatum, '/', '-'), 1, 10)) as 'rep_date',
        case Altersgruppe
            when 'A00-A04' then '00..04'
            when 'A05-A14' then '05..14'
            when 'A15-A34' then '15..34'
            when 'A35-A59' then '35..59'
            when 'A60-A79' then '60..79'
            when 'A80+' then '80..'
            when 'unbekannt' then ''
            else '<' || Altersgruppe || '>'
        end as 'age',
        case Geschlecht
            when 'M' then 'M'
            when 'W' then 'F'
            when 'unbekannt' then ''
            else '<' || Geschlecht || '>'
        end as 'gender',
        sum(AnzahlFall * case when NeuerFall > -1 then 1 else 0 end) as 'cases',
        sum(AnzahlTodesfall * case when NeuerTodesfall > -1 then 1 else 0 end) as 'deaths'
    from rki_csv
    group by Meldedatum, IdLandkreis, Altersgruppe, Geschlecht
)
where rep_date < date('{date}')
and (cases <> 0 or deaths <> 0);

create table cases as
select
    region,
    '' as 'date',
    rep_date,
    age,
    gender,
    cases,
    deaths
from (
    select
        r.region,
        r.rep_date,
        r.age,
        r.gender,
        r.cases as 'cases',
        r.deaths as 'deaths'
    from rki as 'r'
    group by r.region, r.rep_date, r.age, r.gender
)
where (cases <> 0 or deaths <> 0);

drop table rki_csv;
drop table rki;
