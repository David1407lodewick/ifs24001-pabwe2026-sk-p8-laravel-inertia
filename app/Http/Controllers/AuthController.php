<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Menampilkan halaman login
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    // Menampilkan halaman register
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    // Memproses registrasi pengguna
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'member',
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->route('dashboard.index');
    }

    // Memproses login menggunakan username dan password
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt(
            $credentials,
            $request->boolean('remember')
        )) {
            return back()
                ->withErrors([
                    'username' => 'Username atau password tidak sesuai.',
                ])
                ->onlyInput('username');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        // Mengarahkan Admin ke dashboard Admin
        if ($user->isAdmin()) {
            return redirect()->route('admin.index');
        }

        // Mengarahkan Member ke dashboard Member
        return redirect()->route('dashboard.index');
    }

    // Memproses logout pengguna
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
