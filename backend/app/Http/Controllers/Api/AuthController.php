<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login and issue Sanctum token.
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = $request->email;
        if ($email === 'pemda@merata.id') {
            $email = 'pemerintah@merata.id';
        }

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Revoke existing tokens
        $user->tokens()->delete();

        $token = $user->createToken('merata-api')->plainTextToken;

        $user->load(['sekolah', 'guru.sekolah']);

        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'sekolah_id' => $user->sekolah_id,
                'sekolah' => $user->sekolah,
                'guru' => $user->guru,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Logout and revoke token.
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user('sanctum') ?? $request->user();
            if ($user && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }
        } catch (\Throwable $e) {
            // Silently ignore if token is already revoked or missing
        }

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * Get current authenticated user profile.
     * GET /api/me
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['sekolah', 'guru.sekolah']);

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'sekolah_id' => $user->sekolah_id,
            'sekolah' => $user->sekolah,
        ];

        // If guru, include teacher profile
        if ($user->role === 'guru' && $user->guru) {
            $data['guru'] = $user->guru;
        }

        return response()->json($data);
    }
}
