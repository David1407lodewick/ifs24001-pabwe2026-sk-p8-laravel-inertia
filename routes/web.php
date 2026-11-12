
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminExportController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Artikel publik
Route::get('/posts', [PostController::class, 'index'])
    ->name('posts.index');

Route::get('/posts/{slug}', [PostController::class, 'show'])
    ->name('posts.show');


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::get('/login', [AuthController::class, 'showLogin'])
    ->name('login');

Route::post('/login', [AuthController::class, 'login'])
    ->name('login.store');

Route::get('/register', [AuthController::class, 'showRegister'])
    ->name('register');

Route::post('/register', [AuthController::class, 'register'])
    ->name('register.store');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
| Dapat diakses oleh Member dan Admin yang sudah login.
*/

Route::middleware('auth')->group(function () {

    // Menampilkan halaman profil
    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile.index');

    // Memperbarui informasi profil dan foto
    Route::put('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    // Mengubah password
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.password');
});


/*
|--------------------------------------------------------------------------
| Member Dashboard Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:member'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {

        // Dashboard Member
        Route::get('/', [DashboardController::class, 'index'])
            ->name('index');

        // Membuat artikel
        Route::post('/posts', [PostController::class, 'store'])
            ->name('posts.store');

        // Memperbarui artikel
        Route::put('/posts/{post}', [PostController::class, 'update'])
            ->name('posts.update');

        // Menghapus artikel
        Route::delete('/posts/{post}', [PostController::class, 'destroy'])
            ->name('posts.destroy');
    });


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard Admin
        Route::get('/', [AdminController::class, 'index'])
            ->name('index');

        // Export data pengguna
        Route::get('/export/users', [AdminExportController::class, 'users'])
            ->name('export.users');

        // Export data artikel
        Route::get('/export/posts', [AdminExportController::class, 'posts'])
            ->name('export.posts');
    });
