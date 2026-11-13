<?php

namespace Tests\Feature;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_auth_user_is_null(): void
    {
        $middleware = new HandleInertiaRequests();

        $request = Request::create('/', 'GET');
        $request->setUserResolver(fn () => null);

        $shared = $middleware->share($request);

        $this->assertArrayHasKey('auth', $shared);
        $this->assertArrayHasKey('user', $shared['auth']);
        $this->assertNull($shared['auth']['user']);
    }

    public function test_authenticated_user_data_is_shared(): void
    {
        $user = User::create([
            'name' => 'User Test',
            'username' => 'usertest',
            'email' => 'user@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $middleware = new HandleInertiaRequests();

        $request = Request::create('/', 'GET');
        $request->setUserResolver(fn () => $user);

        $shared = $middleware->share($request);

        $this->assertArrayHasKey('auth', $shared);
        $this->assertArrayHasKey('user', $shared['auth']);

        $this->assertSame([
            'id' => $user->id,
            'name' => 'User Test',
            'username' => 'usertest',
            'email' => 'user@test.com',
            'role' => 'member',
        ], $shared['auth']['user']);
    }
}
