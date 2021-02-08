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
