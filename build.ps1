$target_dir = "../web";

$new_cases = $false;

function download_daily_arcgis($id, $name) {
    new-item -path "./cache/$name/" -itemtype directory -erroraction ignore | out-null;
    $resp = (invoke-webrequest -uri "https://opendata.arcgis.com/datasets/$id.csv?url_only=true").content | convertfrom-json;
    if (-not $resp.upToDate) {
        $host.UI.WriteErrorLine("download of `"$name`" not available!");
        return $false;
    }

    $timestamp = $resp.sourceLastModified.tostring("o");
    $date = $timestamp.substring(0, 10);
    if ($timestamp -ne ("" + (get-content -path "./cache/$name/timestamp" -raw -erroraction ignore)).trim()) {
        write-host -message "downloading `"$name/$date.csv`"";
        invoke-webrequest -uri $resp.url -outfile "./cache/$name/$date.csv" -erroraction stop;
        $timestamp | set-content -path "./cache/$name/timestamp";

        return $date;
    }

    return $false;
}

download_daily_arcgis "ef4b445a53c1406892257fe63129a8ea_0" "bundeslander" | out-null;
download_daily_arcgis "917fc37a709542548cc3be077a786c17_0" "landkreise" | out-null
download_daily_arcgis "8fc79b6cf7054b1b80385bda619f39b8_0" "intensivregister" | out-null

$date = download_daily_arcgis "dd4580c810204019a7b8eb3e0b329dd6_0" "rki";
if ($date -eq $false) {
    if ($false) {
        $date = (get-date -asutc -format "o").substring(0, 10);

        write-host -message "downloading `"rki/$date.csv`" from alternate source";
        invoke-webrequest -uri "https://www.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data" -outfile "./cache/rki/$date.csv" -erroraction stop;
        copy-item -literalpath "./cache/rki/$date.csv" -destination "./cache/rki/$date (alt).csv";
    } else {
        return;
    }
}
$new_cases = $true;

# create regions.csv
if (-not (test-path -literalpath "$target_dir/api/regions/regions.csv" -pathtype leaf)) {
    write-host -message "`"./api/regions/regions.csv`":";

    new-item -path "$target_dir/api/regions/" -itemtype directory -erroraction ignore | out-null;

    if (-not (test-path -literalpath "./cache/rki_landkreise.csv" -pathtype leaf)) {
        write-host -message "    downloading `"rki_landkreise.csv`"";
        invoke-webrequest -uri "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.csv" -outfile "./cache/rki_landkreise.csv" -erroraction stop;
    }

    if (-not (test-path -literalpath "./cache/rki_bundeslander.csv" -pathtype leaf)) {
        write-host -message "    downloading `"rki_bundeslander.csv`"";
        invoke-webrequest -uri "https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.csv" -outfile "./cache/rki_bundeslander.csv" -erroraction stop;
    }

    if (-not (test-path -literalpath "./cache/geonames_postalcodes.csv" -pathtype leaf)) {
        write-host -message "    downloading `"geonames_postalcodes.csv`"";
        invoke-webrequest -uri "https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.csv" -outfile "./cache/geonames_postalcodes.zip" -erroraction stop;

        expand-archive -path "./cache/geonames_postalcodes.zip" -destinationpath "./cache/geonames_postalcodes/";
        import-csv -path "./cache/geonames_postalcodes/DE.txt" -delimiter "`t" -header (
            "country_code",
            "postal_code",
            "place",
            "admin_1_name",
            "admin_1_id",
            "admin_2_name",
            "admin_2_id",
            "admin_3_name",
            "admin_3_id",
            "lat",
            "lon",
            "accuracy"
        ) | export-csv -path "./cache/geonames_postalcodes.csv" -usequotes asneeded;

        remove-item -path "./cache/geonames_postalcodes.zip";
        remove-item -path "./cache/geonames_postalcodes/" -recurse;
    }

    get-content -raw -path "./sql/regions.sql" | sqlite3 | write-host;

    write-host -message "    creating `"regions.csv`"";
    import-csv -path "./cache/regions-with-related-words.csv" | foreach-object {
        $_.words = ($_.words.tolower() -split "[^a-z0-9äöüß]+" | where-object { $_.length -gt 2; } | sort-object | select-object -unique) -join ",";
        $_;
    } | export-csv -path "$target_dir/api/regions/regions.csv" -usequotes asneeded;
    remove-item -path "./cache/regions-with-related-words.csv";
}

# udpate cases.csv
if ($new_cases -or (-not (test-path -literalpath "$target_dir/api/cases/cases.csv" -pathtype leaf))) {
    write-host -message "`"./api/cases/cases.csv`":";

    # todo: automatically determine first date based on contents of "./cache/rki/"
    $date_first = "2020-10-31";
    $sql = "";

    if (test-path -literalpath "$target_dir/api/cases/cases.csv" -pathtype leaf) {
        $sql += (get-content -raw -path "./sql/cases/load.sql").replace("{date}", $date);
        $sql += (get-content -raw -path "./sql/cases/add.sql").replace("{date}", $date);
    } else {
        new-item -path "$target_dir/api/cases/" -itemtype directory -erroraction ignore | out-null;

        $sql += (get-content -raw -path "./sql/cases/new.sql").replace("{date}", $date_first);
        $sql_step = get-content -raw -path "./sql/cases/add.sql";

        $i = (get-date -date $date_first).addhours(12);
        $date_last = get-date -date $date;
        while ($i -lt $date_last) {
            $i = $i.adddays(1);
            $sql += $sql_step.replace("{date}", (get-date -date $i -asutc -format "o").substring(0, 10));
        }
    }
    $sql += get-content -raw -path "./sql/cases/save.sql";

    $sql | sqlite3 | write-host;

    $new_cases = $true;
}

# update sum.csv
if ($new_cases -or (-not (test-path -literalpath "$target_dir/api/cases/sum.csv" -pathtype leaf))) {
    write-host -message "`"./api/cases/sum.csv`":";

    $date_first = "2020-10-31";
    $sql = "";

    if (test-path -literalpath "$target_dir/api/cases/sum.csv" -pathtype leaf) {
        $sql += (get-content -raw -path "./sql/sum/load.sql").replace("{date}", $date);
        $sql += (get-content -raw -path "./sql/sum/add.sql").replace("{date}", $date);
    } else {
        new-item -path "$target_dir/api/cases/" -itemtype directory -erroraction ignore | out-null;

        $sql += get-content -raw -path "./sql/sum/new.sql";
        $sql_step = get-content -raw -path "./sql/sum/add.sql";

        $i = (get-date -date $date_first).addhours(12);
        $date_last = get-date -date $date;
        while ($i -lt $date_last) {
            $i = $i.adddays(1);
            $sql += $sql_step.replace("{date}", (get-date -date $i -asutc -format "o").substring(0, 10));
        }
    }
    $sql += (get-content -raw -path "./sql/sum/save_21.sql").replace("{date}", $date);
    $sql += get-content -raw -path "./sql/sum/save.sql";

    $sql | sqlite3 | write-host;

    $new_cases = $true;
}

if ($new_cases) {
    get-date -asutc -format "o" | set-content -path "$target_dir/api/updated";
}

get-content -raw -path "$target_dir/api/updated" | write-host;
