.once '../web/api/cases/cases.csv'
select
    region,
    date,
    rep_date,
    cases,
    deaths
from cases
order by region, date desc, rep_date desc;
