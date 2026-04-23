# ═══════════════════════════════════════════════
#  Update Hero Images List
#  Run this script from the project root whenever
#  you add or remove images in Assets/HeroImage/
# ═══════════════════════════════════════════════

$folder = Join-Path $PSScriptRoot "Assets\HeroImage"
$output = Join-Path $folder "images.js"

# Supported image extensions
$extensions = @("*.png", "*.jpg", "*.jpeg", "*.webp", "*.avif")

# Collect all image filenames (exclude images.js itself)
$images = @()
foreach ($ext in $extensions) {
    Get-ChildItem -Path $folder -Filter $ext -File | ForEach-Object {
        $images += $_.Name
    }
}

# Sort alphabetically for consistency
$images = $images | Sort-Object

# Build the JS file content
$lines = @()
$lines += "/* =============================================="
$lines += "   HERO IMAGES — Auto-generated image list"
$lines += "   To regenerate, run: powershell -File update-hero-images.ps1"
$lines += "   Or manually add filenames to this array."
$lines += "   ============================================== */"
$lines += "var HERO_IMAGES = ["

for ($i = 0; $i -lt $images.Count; $i++) {
    $comma = if ($i -lt $images.Count - 1) { "," } else { "" }
    $lines += "    '$($images[$i])'" + $comma
}

$lines += "];"
$lines += ""

$content = $lines -join "`n"
Set-Content -Path $output -Value $content -Encoding UTF8

Write-Host "✅ Updated $output with $($images.Count) images:" -ForegroundColor Green
$images | ForEach-Object { Write-Host "   • $_" }
