.print '    inserting "{date}"'

insert into cases_sum
select
    r.key,
    date('{date}'),
    ifnull(rep.cases, 0),
    ifnull(rep.cases_rep_1, 0),
    ifnull(rep.cases_rep_2, 0),
    ifnull(rep.cases_rep_3, 0),
    ifnull(rep.cases_rep_4, 0),
    ifnull(rep.cases_rep_5, 0),
    ifnull(rep.cases_rep_past, 0),
    ifnull(acc.cases_week_0, 0),
    ifnull(acc.cases_week_7, 0),
    ifnull(md.cases_md_week_0, 0),
    ifnull(md.cases_md_week_7, 0),
    ifnull(acc.cases_total, 0),
    ifnull(rep.deaths, 0),
    ifnull(acc.deaths_week_0, 0),
    ifnull(acc.deaths_week_7, 0),
    ifnull(acc.deaths_total, 0)
from regions as 'r'
left outer join (
    select
        c.region,
        sum(c.cases * case when c.rep_date > date('{date}', '-6 day') then 1 else 0 end) as 'cases',
        sum(c.cases * case when c.rep_date = date('{date}', '-1 day') then 1 else 0 end) as 'cases_rep_1',
        sum(c.cases * case when c.rep_date = date('{date}', '-2 day') then 1 else 0 end) as 'cases_rep_2',
        sum(c.cases * case when c.rep_date = date('{date}', '-3 day') then 1 else 0 end) as 'cases_rep_3',
        sum(c.cases * case when c.rep_date = date('{date}', '-4 day') then 1 else 0 end) as 'cases_rep_4',
        sum(c.cases * case when c.rep_date = date('{date}', '-5 day') then 1 else 0 end) as 'cases_rep_5',
        sum(c.cases * case when c.rep_date < date('{date}', '-5 day') then 1 else 0 end) as 'cases_rep_past',
        sum(c.deaths) as 'deaths'
    from cases as 'c'
    where c.date = date('{date}')
    group by c.region
) as 'rep'
    on rep.region = r.key
left outer join (
    select
        c.region,
        sum(c.cases * case when c.date <= date('{date}') and c.date > date('{date}', '-7 day') and c.rep_date > date(c.date, '-6 day') then 1 else 0 end) as 'cases_week_0',
        sum(c.cases * case when c.date <= date('{date}', '-7 day') and c.date > date('{date}', '-14 day') and c.rep_date > date(c.date, '-6 day') then 1 else 0 end) as 'cases_week_7',
        sum(c.cases) as 'cases_total',
        sum(c.deaths * case when c.date <= date('{date}') and c.date > date('{date}', '-7 day') then 1 else 0 end) as 'deaths_week_0',
        sum(c.deaths * case when c.date <= date('{date}', '-7 day') and c.date > date('{date}', '-14 day') then 1 else 0 end) as 'deaths_week_7',
        sum(c.deaths) as 'deaths_total'
    from cases as 'c'
    where c.date <= date('{date}')
    group by c.region
) as 'acc'
    on acc.region = r.key
left outer join (
    select
        c.region,
        sum(c.cases * case when c.rep_date >= date('{date}', '-7 day') and c.rep_date < date('{date}', '-0 day') then 1 else 0 end) as 'cases_md_week_0',
        sum(c.cases * case when c.rep_date >= date('{date}', '-14 day') and c.rep_date < date('{date}', '-7 day') then 1 else 0 end) as 'cases_md_week_7'
    from cases as 'c'
    where c.date <= date('{date}')
    group by c.region
) as 'md'
    on md.region = r.key;
