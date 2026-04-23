$cwebp = "C:\Users\52558\Downloads\CampamentoOnawa\cwebp_tool\libwebp-1.4.0-windows-x64\bin\cwebp.exe"
$assetsDir = "C:\Users\52558\Downloads\CampamentoOnawa\Assets"

$images = Get-ChildItem -Path $assetsDir -Recurse -Include "*.png","*.jpg","*.jpeg"

$totalSize = 0
$newSize = 0
$count = 0

foreach ($img in $images) {
    $outPath = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    Write-Host "Convirtiendo: $($img.Name) ..."
    & $cwebp -q 82 $img.FullName -o $outPath 2>$null
    if (Test-Path $outPath) {
        $orig = $img.Length
        $webp = (Get-Item $outPath).Length
        $totalSize += $orig
        $newSize += $webp
        $saved = [math]::Round((($orig - $webp) / $orig) * 100, 1)
        Write-Host "  $($img.Name) -> $([math]::Round($orig/1KB))KB => $([math]::Round($webp/1KB))KB (ahorro: $saved%)"
        $count++
    }
}

$totalSavedMB = [math]::Round(($totalSize - $newSize) / 1MB, 2)
$totalOrigMB  = [math]::Round($totalSize / 1MB, 2)
$totalNewMB   = [math]::Round($newSize / 1MB, 2)

Write-Host ""
Write-Host "============================================"
Write-Host "Convertidas: $count imagenes"
Write-Host "Peso original total: $totalOrigMB MB"
Write-Host "Peso WebP total:     $totalNewMB MB"
Write-Host "Ahorro total:        $totalSavedMB MB"
Write-Host "============================================"
