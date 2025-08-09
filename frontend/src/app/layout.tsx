import './globals.css'

export const metadata = {
  title: 'Agentic GUI - 生成式用户界面的未来',
  description: '探索 AI Agent 驱动的动态界面生成技术，体验运行时生成式 UI 的魅力',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
