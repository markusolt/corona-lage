$cache = "./cache";
$docs = "./docs";
$sql = "./sql";
$target_dir = "../web";
$dirty = $false;

# todo: dynamically determine $date_first
# todo: add more robust handling of intermediate missing dates
$date_first = "2020-10-23";

function create_dir($path) {
    new-item -path $path -itemtype directory -erroraction ignore | out-null;
}

function file_exists($path) {
    return (test-path -literalpath $path -pathtype leaf);
}

function download_file($uri, $path) {
    invoke-webrequest -uri $uri -outfile $path;
}

function fetch_json($uri) {
    return (invoke-webrequest -uri $uri).content | convertfrom-json;
}

function log($verb, $target, $level, $slow) {
    $noun = "";
    if ($target) {
        $noun = " `"$target`"";
    }

    $indent = " " * ($level * 4);

    $tail = "";
    if ($slow) {
        $tail = "...";
    }
    write-host -message "$indent$verb$noun$tail";
}

create_dir -path "$target_dir/api";
create_dir -path "$cache";

if (-not (file_exists -path "$target_dir/api/regions/regions.csv")) {
    log "generating" "/api/regions/regions.csv";

    create_dir -path "$target_dir/api/regions/";

    if (-not (file_exists -path "$cache/rki_landkreise.csv")) {
        log "downloading" "rki_landkreise.csv" 1 $true;

        download_file -uri "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.csv" -path "$cache/rki_landkreise.csv";
    }

    if (-not (file_exists -path "$cache/rki_bundeslander.csv")) {
        log "downloading" "rki_bundeslander.csv" 1 $true;

        download_file -uri "https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.csv" -path "$cache/rki_bundeslander.csv";
    }

    if (-not (file_exists -path "$cache/geonames_postalcodes.csv")) {
        log "downloading" "geonames_postalcodes.csv" 1 $true;

        download_file -uri "http://download.geonames.org/export/zip/DE.zip" -path "$cache/geonames_postalcodes.zip";
        expand-archive -path "$cache/geonames_postalcodes.zip" -destinationpath "$cache/geonames_postalcodes/";
        import-csv -path "$cache/geonames_postalcodes/DE.txt" -delimiter "`t" -header (
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
        ) | export-csv -path "$cache/geonames_postalcodes.csv" -usequotes asneeded;

        remove-item -path "$cache/geonames_postalcodes.zip";
        remove-item -path "$cache/geonames_postalcodes/" -recurse;
    }

    log "processing" $null 1 $true;

    get-content -path "$sql/regions_process_1.sql" | sqlite3;
    import-csv -path "$cache/regions-with-related-words.csv" | foreach-object {
        $_.words = ($_.words.tolower() -split "[^a-z0-9äöüß]+" | where-object { $_.length -gt 2; } | sort-object | select-object -unique) -join ",";
        $_;
    } | export-csv -path "$target_dir/api/regions/regions.csv" -usequotes asneeded;
    remove-item -path "$cache/regions-with-related-words.csv";

    $dirty = $true;
}

log "checking for new" "rki_cases.csv" 0 $true;
$resp = fetch_json -uri "https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.csv?url_only=true";
if (-not $resp.upToDate) {
    write-error -message "download of `"rki_cases.csv`" is not available!";
    return;
}

$timestamp = $resp.sourceLastModified.tostring("o");
$date = $timestamp.substring(0, 10);
$new_cases_available = $false;
if ($timestamp -ne ("" + (get-content -path "$cache/rki/timestamp" -raw -erroraction ignore)).trim()) {
    log "downloading" "rki/$date.csv" 1 $true;
    download_file -uri $resp.url -path "$cache/rki/$date.csv";
    $timestamp | set-content -path "cache/rki/timestamp";

    $new_cases_available = $true;
}

if (-not (file_exists -path "$target_dir/api/cases/cases.csv")) {
    log "generating" "/api/cases/cases.csv";

    create_dir -path "$target_dir/api/cases/";

    log "processing" $date_first 1 $true;
    (get-content -path "sql/cases_init.sql" -raw).replace("{date}", $date_first) | sqlite3 | write-error;

    $i = (get-date -date $date_first).addhours(12);
    $target = get-date -date $date_last;
    while ($i -lt $target) {
        $i = $i.adddays(1);
        $i_str = (get-date -date $i -asutc -format "o").substring(0, 10);

        log "processing" $i_str 1 $true;
        (get-content -path "sql/cases_update.sql" -raw).replace("{date}", $i_str) | sqlite3;
    }

    $new_cases_available = $false;
    $dirty = $true;
}

if ($new_cases_available) {
    log "updating" "api/cases/cases.csv";

    log "processing" $null 1 $true;
    (get-content -path "sql/cases_update.sql" -raw).replace("{date}", $date) | sqlite3;

    $dirty = $true;
}

if ($dirty) {
    if (-not (file_exists -path "$target_dir/api/cases/sum.csv")) {
        log "building" "api/cases/sum.csv";
        log "preparing" $null 1 $true;

        "region,date,cases,cases_rep_1,cases_rep_2,cases_rep_3,cases_rep_4,cases_rep_5,cases_rep_past,cases_week_0,cases_week_7,cases_total,deaths,deaths_week_0,deaths_week_7,deaths_total" | set-content -path "$target_dir/api/cases/sum.csv";

        $date_last = $date;
        $i = (get-date -date $date_first).addhours(12);
        $target = get-date -date $date_last;
        1..1 | foreach {
            get-content -path "sql/cases_sum_update_1.sql" -raw | write-output;
            while ($i -lt $target) {
                $i = $i.adddays(1);
                $i_str = (get-date -date $i -asutc -format "o").substring(0, 10);

                log "processing" $i_str 1 $true;
                (get-content -path "sql/cases_sum_update_2.sql" -raw).replace("{date}", $i_str) | write-output;
            }
            get-content -path "sql/cases_sum_update_3.sql" -raw | write-output;
        } | sqlite3;
    } else {
        log "updating" "api/cases/sum.csv";
        log "preparing" $null 1 $true;
        log "processing" $date 1 $true;
        ((get-content -path "sql/cases_sum_update_1.sql" -raw) + (get-content -path "sql/cases_sum_update_2.sql" -raw) + (get-content -path "sql/cases_sum_update_3.sql" -raw)).replace("{date}", $date) | sqlite3;
    }

    log "building" "api/cases/sum_28.csv";
    (get-content -path "sql/cases_sum_28_build.sql" -raw).replace("{date}", $date) | sqlite3;

    $dirty = $true;
}

if ($dirty) {
    get-date -asutc -format "o" | set-content -path "$target_dir/api/updated";
}

copy-item -path "docs/*" -destination "../web/" -recurse -force
