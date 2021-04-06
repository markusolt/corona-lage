# Corona Lage

Visit the live website on [github.io](https://markusolt.github.io/corona-lage).

**This project is very much still in development. It is not intended for public use yet. Use at your own discretion**

This project is a simple website to display the number of *Covid-19* cases per county across Germany, of which there are *412*. It is currently only intended for my own personal use. The website uses the official [numbers provided by the RKI](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0), although the interpretation and calculation of various metrics is my own.

## Contribute

Use the following commands to check out the git repository. The build scripts expect the `web` branch to be checked out next to the `master` branch, in a folder called `web/`.

```
mkdir corona-lage
cd corona-lage
git clone https://github.com/markusolt/corona-lage.git main
cd main
git worktree add ../web web
```

To execute the daily build script `./build.ps1`, you need to have the following tools installed.

- [PowerShell](https://github.com/powershell/powershell)
- [SQLite](https://sqlite.org/cli.html)

Then execute the following commands. This will populate the `.cache/` directory with temporary files and update the `.csv` files in `../web/api/`.

```
pwsh ./build.ps1

pushd ../web
git commit -a -m build
git push
popd
```

## Todo

- handle empty `./cache/rki` directory
