.mode csv
.separator ,
.header on
.bail on

.import '../web/api/regions/regions.csv' regions_csv
create table regions as
select
    key
from regions_csv;

.import '../web/api/cases/cases.csv' cases_csv
create table cases as
select
    r.key as 'region',
    c.date,
    c.rep_date,
    ifnull(sum(c.cases), 0) as 'cases',
    ifnull(sum(c.deaths), 0) as 'deaths'
from regions as 'r'
inner join cases_csv as 'c'
    on substr(c.region, 1, length(r.key)) = r.key
group by r.key, c.date, c.rep_date;

create table samples as
select
    r.key as 'region',
    d.date
from regions as 'r'
cross join (
    select date('{date}') as 'date'
    union all select date('{date}', '-1 day') as 'date'
    union all select date('{date}', '-2 day') as 'date'
    union all select date('{date}', '-3 day') as 'date'
    union all select date('{date}', '-4 day') as 'date'
    union all select date('{date}', '-5 day') as 'date'
    union all select date('{date}', '-6 day') as 'date'
    union all select date('{date}', '-7 day') as 'date'
    union all select date('{date}', '-8 day') as 'date'
    union all select date('{date}', '-9 day') as 'date'
    union all select date('{date}', '-10 day') as 'date'
    union all select date('{date}', '-11 day') as 'date'
    union all select date('{date}', '-12 day') as 'date'
    union all select date('{date}', '-13 day') as 'date'
    union all select date('{date}', '-14 day') as 'date'
    union all select date('{date}', '-15 day') as 'date'
    union all select date('{date}', '-16 day') as 'date'
    union all select date('{date}', '-17 day') as 'date'
    union all select date('{date}', '-18 day') as 'date'
    union all select date('{date}', '-19 day') as 'date'
    union all select date('{date}', '-20 day') as 'date'
    union all select date('{date}', '-21 day') as 'date'
    union all select date('{date}', '-22 day') as 'date'
    union all select date('{date}', '-23 day') as 'date'
    union all select date('{date}', '-24 day') as 'date'
    union all select date('{date}', '-25 day') as 'date'
    union all select date('{date}', '-26 day') as 'date'
    union all select date('{date}', '-27 day') as 'date'
) as 'd';

create table cases_sum as
select
    s.region,
    s.date,
    rep.cases,
    rep.cases_rep_1,
    rep.cases_rep_2,
    rep.cases_rep_3,
    rep.cases_rep_4,
    rep.cases_rep_5,
    rep.cases_rep_past,
    rep.deaths,
    acc.cases_week_0,
    acc.cases_week_7,
    acc.cases_total,
    acc.deaths_week_0,
    acc.deaths_week_7,
    acc.deaths_total
from samples as 's'
inner join (
    select
        s.region,
        s.date,
        ifnull(sum(c.cases * case when c.rep_date > date(s.date, '-6 day') then 1 else 0 end), 0) as 'cases',
        ifnull(sum(c.cases * case when c.rep_date = date(s.date, '-1 day') then 1 else 0 end), 0) as 'cases_rep_1',
        ifnull(sum(c.cases * case when c.rep_date = date(s.date, '-2 day') then 1 else 0 end), 0) as 'cases_rep_2',
        ifnull(sum(c.cases * case when c.rep_date = date(s.date, '-3 day') then 1 else 0 end), 0) as 'cases_rep_3',
        ifnull(sum(c.cases * case when c.rep_date = date(s.date, '-4 day') then 1 else 0 end), 0) as 'cases_rep_4',
        ifnull(sum(c.cases * case when c.rep_date = date(s.date, '-5 day') then 1 else 0 end), 0) as 'cases_rep_5',
        ifnull(sum(c.cases * case when c.rep_date < date(s.date, '-5 day') then 1 else 0 end), 0) as 'cases_rep_past',
        ifnull(sum(c.deaths), 0) as 'deaths'
    from samples as 's'
    left outer join cases as 'c'
        on c.region = s.region
        and c.date = s.date
    group by s.region, s.date
) as 'rep'
    on rep.region = s.region
    and rep.date = s.date
inner join (
    select
        s.region,
        s.date,
        ifnull(sum(c.cases * case when c.date <= date(s.date) and c.date > date(s.date, '-7 day') and c.rep_date > date(c.date, '-6 day') then 1 else 0 end), 0) as 'cases_week_0',
        ifnull(sum(c.cases * case when c.date <= date(s.date, '-7 day') and c.date > date(s.date, '-14 day') and c.rep_date > date(c.date, '-6 day') then 1 else 0 end), 0) as 'cases_week_7',
        ifnull(sum(c.cases), 0) as 'cases_total',
        ifnull(sum(c.deaths * case when c.date <= date(s.date) and c.date > date(s.date, '-7 day') then 1 else 0 end), 0) as 'deaths_week_0',
        ifnull(sum(c.deaths * case when c.date <= date(s.date, '-7 day') and c.date > date(s.date, '-14 day') then 1 else 0 end), 0) as 'deaths_week_7',
        ifnull(sum(c.deaths), 0) as 'deaths_total'
    from samples as 's'
    left outer join cases as 'c'
        on c.region = s.region
        and c.date <= s.date
    group by s.region, s.date
) as 'acc'
    on acc.region = s.region
    and acc.date = s.date;

.once '../web/api/cases/sum.csv'
select
    region,
    date,
    cases,
    cases_rep_1,
    cases_rep_2,
    cases_rep_3,
    cases_rep_4,
    cases_rep_5,
    cases_rep_past,
    cases_week_0,
    cases_week_7,
    cases_total,
    deaths,
    deaths_week_0,
    deaths_week_7,
    deaths_total
from cases_sum
order by region asc, date desc;

.q
