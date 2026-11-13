<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_can_be_displayed(): void
    {
        $response = $this->get('/login');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Auth/Login')
        );
    }

    public function test_register_page_can_be_displayed(): void
    {
        $response = $this->get('/register');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Auth/Register')
        );
    }

    public function test_user_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'David Simbolon',
            'username' => 'davidtest',
            'email' => 'david@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('dashboard.index'));

        $this->assertDatabaseHas('users', [
            'username' => 'davidtest',
            'email' => 'david@example.com',
            'role' => 'member',
        ]);

        $this->assertAuthenticated();
    }

    public function test_member_can_login(): void
    {
        $user = User::factory()->create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@example.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $response = $this->post('/login', [
            'email' => 'member@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('dashboard.index'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_admin_can_login(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin Test',
            'username' => 'admintest',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('admin.index'));
        $this->assertAuthenticatedAs($admin);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'name' => 'Wrong Test',
            'username' => 'wrongtest',
            'email' => 'wrong@example.com',
            'password' => 'password123',
        ]);

        $response = $this->post('/login', [
            'email' => 'wrong@example.com',
            'password' => 'passwordsalah',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create([
            'name' => 'Logout Test',
            'username' => 'logouttest',
        ]);

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }
}
