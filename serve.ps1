# Minimální statický HTTP server pro lokální náhled (bez závislostí).
param([int]$Port = 8123, [string]$Root = "")

$ErrorActionPreference = "Stop"
$root = $Root
if (-not $root) { if ($PSScriptRoot) { $root = $PSScriptRoot } else { $root = (Get-Location).Path } }

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="text/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".svg"="image/svg+xml"; ".woff2"="font/woff2"; ".png"="image/png";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".webp"="image/webp";
  ".xml"="application/xml; charset=utf-8"; ".txt"="text/plain; charset=utf-8";
  ".ico"="image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart("/"))
    if ($rel -eq "") { $rel = "index.html" }
    $path = Join-Path $root $rel

    # složka → index.html
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
    # "/cenik" bez lomítka → "/cenik/index.html"
    if (-not (Test-Path $path) -and (Test-Path (Join-Path $root "$rel/index.html"))) {
      $path = Join-Path $root "$rel/index.html"
    }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $notFound = Join-Path $root "404.html"
      if (Test-Path $notFound) {
        $bytes = [System.IO.File]::ReadAllBytes($notFound)
        $res.ContentType = "text/html; charset=utf-8"
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    }
    $res.OutputStream.Close()
  } catch {
    try { $res.StatusCode = 500; $res.OutputStream.Close() } catch {}
  }
}
