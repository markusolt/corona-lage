.once '../web/api/cases/cases.csv'
select
    region,
    nullif(date, '') as 'date',
    rep_date,
    nullif(age, '') as 'age',
    nullif(gender, '') as 'gender',
    cases,
    deaths
from cases
order by region, date desc, rep_date desc, age, gender;
