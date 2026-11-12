<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            abort(403, 'Anda harus login terlebih dahulu.');
        }

        if ($request->user()->role !== $role) {
            abort(403, 'Anda tidak memiliki hak akses.');
        }

        return $next($request);
    }
}