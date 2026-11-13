<?php

namespace Tests\Unit;

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    public function test_guest_is_rejected(): void
    {
        $middleware = new RoleMiddleware();

        $request = Request::create('/test', 'GET');
        $request->setUserResolver(fn () => null);

        try {
            $middleware->handle(
                $request,
                fn ($request) => new Response('OK'),
                'member'
            );

            $this->fail('Guest seharusnya ditolak.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
            $this->assertSame(
                'Anda harus login terlebih dahulu.',
                $exception->getMessage()
            );
        }
    }

    public function test_user_with_wrong_role_is_rejected(): void
    {
        $middleware = new RoleMiddleware();

        $request = Request::create('/test', 'GET');

        $user = (object) [
            'role' => 'member',
        ];

        $request->setUserResolver(fn () => $user);

        try {
            $middleware->handle(
                $request,
                fn ($request) => new Response('OK'),
                'admin'
            );

            $this->fail('Pengguna dengan role berbeda seharusnya ditolak.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
            $this->assertSame(
                'Anda tidak memiliki hak akses.',
                $exception->getMessage()
            );
        }
    }

    public function test_user_with_correct_role_can_continue(): void
    {
        $middleware = new RoleMiddleware();

        $request = Request::create('/test', 'GET');

        $user = (object) [
            'role' => 'member',
        ];

        $request->setUserResolver(fn () => $user);

        $expectedResponse = new Response('Berhasil');

        $response = $middleware->handle(
            $request,
            fn ($request) => $expectedResponse,
            'member'
        );

        $this->assertSame($expectedResponse, $response);
        $this->assertSame('Berhasil', $response->getContent());
    }
}
