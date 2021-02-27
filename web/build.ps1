push-location $psscriptroot;

$target_dir = "../../web";
$home_url = "/corona-lage";
$config = convertfrom-json (get-content -raw "./config.json");

$modules = $config.modules | foreach {
    get-item -literalpath "js/$_.js"
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

(get-content -raw "./200.html").replace("{HOME}", $home_url).replace("{JS_HASH}", $js_hash).replace("{CSS_HASH}", $css_hash) | set-content -nonewline "$target_dir/200.html";
$html_hash = (get-filehash "$target_dir/200.html").hash.substring(0, 5);

(get-content -raw "./manifest.webmanifest").replace("{HOME}", $home_url) | set-content -nonewline "$target_dir/manifest.webmanifest";
(get-content -raw "./404.html").replace("{HOME}", $home_url).replace("{HTML_HASH}", $html_hash) | set-content -nonewline "$target_dir/404.html";

pop-location;
