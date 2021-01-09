# Corona Lage

**This repository is very much still in development. Please do not rely on the current data api. Also, please expect the git repository to get rebased in the future, the commit history may not be persistent yet.**

You can take a look at the current build by visiting [github.io](markusolt.github.io/corona-lage).

## Contribute

You need to have powershell and sqlite installed.

```
mkdir corona-lage
cd corona-lage
git clone https://github.com/markusolt/corona-lage.git main
cd main
git worktree add ../web web
```

## Todos

- overview page
    - intertactive search filter
    - interactive sorting on following fields
        - incidence
        - increase
    - list all regions with following information:
        - name
        - type
        - parent name
        - current incidence
        - current increase
        - total deaths
- regional page
    - name, type and parent name
    - current incidence and increase
    - todo: history of incidence ovver past 28 days (table or chart or other?)
    - todo: link to explanation page of incidence calculation
    - todo: list related regions
        - parent region
        - nearest bigger city
        - nearby small towns
            - can we guarantee all regions are connected by such adverts?
    - maybe: how many days until incidence of 200 (or 50, or 500, etc.)
- news page
    - sorted by date, then region population descending
    - qualities
        - incidence at least 200
        - incidence at least 50
        - incidence over global average
        - incidence over parents average
    - highlight regions on special occasions
        - incidence now at least 200 (was below 200 for all 5 previous days)
        - incidence below 200 for 5 past days, was at least 200 6 days ago
    - highlight best region every day
        - highest incidence
        - biggest absolute change in reproduction rate
