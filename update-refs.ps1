$files = @(
    'c:\Users\52558\Downloads\CampamentoOnawa\index.html',
    'c:\Users\52558\Downloads\CampamentoOnawa\css\styles.css',
    'c:\Users\52558\Downloads\CampamentoOnawa\css\animations.css',
    'c:\Users\52558\Downloads\CampamentoOnawa\js\main.js'
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $content = Get-Content $file -Raw -Encoding UTF8

    # Replace all image extensions with .webp (in both double-quote and single-quote contexts)
    $content = $content -replace '\.png"',   '.webp"'
    $content = $content -replace '\.jpeg"',  '.webp"'
    $content = $content -replace '\.jpg"',   '.webp"'
    $content = $content -replace "\.png'",   ".webp'"
    $content = $content -replace "\.jpeg'",  ".webp'"
    $content = $content -replace "\.jpg'",   ".webp'"
    # Also handle unquoted references (e.g. url(Assets/img.png))
    $content = $content -replace '\.png\)',  '.webp)'
    $content = $content -replace '\.jpeg\)', '.webp)'
    $content = $content -replace '\.jpg\)',  '.webp)'

    Set-Content $file -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Actualizado: $file"
}

Write-Host "Todas las referencias actualizadas a .webp"
