<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     * Usage: middleware('role:guru') or middleware('role:admin,pemerintah')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke fitur ini.',
                'required_role' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
