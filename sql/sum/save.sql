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
    cases_md_week_0,
    cases_md_week_7,
    cases_total,
    deaths,
    deaths_week_0,
    deaths_week_7,
    deaths_total,
    cast(care_patients as int) as 'care_patients',
    cast(care_patients_vent as int) as 'care_patients_vent',
    cast(care_capacity as int) as 'care_capacity'
from cases_sum
order by region asc, date desc;
