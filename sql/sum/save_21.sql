.once '../web/api/cases/sum_21.csv'
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
from cases_sum
where date > date('{date}', '-21 day')
order by region asc, date desc;
