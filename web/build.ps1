push-location $psscriptroot;

$target_dir = "./target/corona-lage";
$home_url = "/corona-lage";
$config = convertfrom-json (get-content -raw "./config.json");

$modules = $config.modules | foreach {
    get-item -literalpath "mod/$_.js"
};

$modules | foreach {
    prettier $_.fullname --write --loglevel error
};

1..1 | foreach {
    "`"use strict`"; const use = {};" | write-output;

    $modules | foreach {
        $name = $_.basename -replace "^[^a-zA-Z_]+|[^a-zA-Z0-9_]+", "";
        $src = (get-content -raw $_.fullname).replace("{HOME}", $home_url).replace("{DATE}", (get-date -format "o").substring(0, 19));

        "use.$name = (() => {$src})();" | write-output;
    } | write-output;
} | terser -mc --toplevel | set-content -literalpath "$target_dir/index.js";
$js_hash = (get-filehash "$target_dir/index.js").hash.substring(0, 5);

((get-content -raw "./index.css") -replace "\s+", " ").replace("{HOME}", $home_url) | set-content "$target_dir/index.css";
$css_hash = (get-filehash "$target_dir/index.css").hash.substring(0, 5);

(get-content -raw "./index.html").replace("{HOME}", $home_url).replace("{JS_HASH}", $js_hash).replace("{CSS_HASH}", $css_hash) | set-content -nonewline "$target_dir/index.html";
$html_hash = (get-filehash "$target_dir/index.html").hash.substring(0, 5);

(get-content -raw "./manifest.webmanifest").replace("{HOME}", $home_url) | set-content -nonewline "$target_dir/manifest.webmanifest";
(get-content -raw "./404.html").replace("{HOME}", $home_url).replace("{HTML_HASH}", $html_hash) | set-content -nonewline "$target_dir/404.html";

# todo: for dev environment only:
(get-content -raw "./404.html").replace("{HOME}", $home_url).replace("{HTML_HASH}", $html_hash) | set-content -nonewline "$target_dir/../404.html";

pop-location;
