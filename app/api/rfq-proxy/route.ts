// app/api/rfq-proxy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 插件会把表单数据放在请求体里传过来
    const formData = await request.json();
    console.log('RFQ 数据：', formData);

    // 这里可以添加你自己的处理逻辑，比如发邮件通知自己
    // await sendNotification(formData);

    return NextResponse.json({ message: '数据已接收' });
  } catch (error) {
    console.error('处理RFQ数据时出错:', error);
    return NextResponse.json({ error: '数据格式不正确' }, { status: 400 });
  }
}