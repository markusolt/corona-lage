.mode csv
.separator ,
.header on
.bail on

.import '../web/api/cases/sum.csv' cases_sum_csv
create table cases_sum as
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
    cases_md_week_0,
    cases_md_week_7,
    cases_total,
    deaths,
    deaths_week_0,
    deaths_week_7,
    deaths_total,
    care_patients,
    care_patients_vent,
    care_capacity
from cases_sum_csv
where date < date('{date}');

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

.import '../web/api/care/care.csv' care_csv
create table care as
select
    r.key as 'region',
    c.date,
    ifnull(sum(c.patients), 0) as 'patients',
    ifnull(sum(c.patients_vent), 0) as 'patients_vent',
    ifnull(sum(c.capacity), 0) as 'capacity'
from regions as 'r'
inner join care_csv as 'c'
    on substr(c.region, 1, length(r.key)) = r.key
group by r.key, c.date;

drop table cases_sum_csv;
drop table regions_csv;
drop table cases_csv;
drop table care_csv;
