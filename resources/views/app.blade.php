
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta
        name="description"
        content="BlogVerse Pro adalah platform blog untuk membaca, membuat, mengelola, dan membagikan artikel serta informasi menarik."
    >

    <meta name="theme-color" content="#2563eb">

    <title inertia>{{ config('app.name', 'BlogVerse Pro') }}</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
