import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (!bootstrapPassword) {
      return NextResponse.json({ error: 'Server authentication is not configured in .env' }, { status: 500 });
    }

    if (password === bootstrapPassword) {
      return NextResponse.json({
        success: true,
        user: {
          email: 'admin@donne.vn',
          fullName: 'Chủ Quản Dọn Nè',
          role: 'SUPER_ADMIN',
        },
        token: 'auth_token_' + Buffer.from(Date.now().toString()).toString('base64'),
      });
    }

    return NextResponse.json({ error: 'Mật khẩu quản trị không chính xác' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
