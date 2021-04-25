.once '../web/api/care/care.csv'
select
    region,
    date,
    patients,
    patients_vent,
    capacity
from care
order by region, date desc;
