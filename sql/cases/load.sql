.mode csv
.separator ,
.header on
.bail on

.print '  cases.csv:'

.import '../web/api/cases/cases.csv' cases_csv
create table cases as
select
    region,
    date,
    rep_date,
    age,
    gender,
    cases,
    deaths
from cases_csv
where date < date('{date}');

drop table cases_csv;
