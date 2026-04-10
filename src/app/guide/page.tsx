import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Operations Guide - Logistics',
  robots: 'noindex, nofollow',
};

const sections = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'services', label: 'Services' },
  { id: 'news', label: 'News' },
  { id: 'seo', label: 'SEO (重点)' },
  { id: 'inquiries', label: 'Inquiries' },
  { id: 'banners', label: 'Banners' },
  { id: 'images', label: 'Images' },
  { id: 'settings', label: 'Settings' },
  { id: 'security', label: 'Security (安全)' },
  { id: 'backup', label: 'Backup (备份)' },
  { id: 'deploy', label: 'Deploy (部署)' },
];

export default function GuidePage() {
  return (
    <div className="guide-page min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h1 className="text-base font-semibold text-gray-900">后台操作指南</h1>
          </div>
          <a href="/admin" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            进入后台
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        {/* Sidebar */}
        <nav className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-[72px]">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">目录</p>
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block px-3 py-1.5 text-[13px] text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-all"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Intro Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">管理后台操作指南</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              本指南详细说明网站后台各项功能的操作方法，涵盖内容管理、SEO 优化、图片管理、数据备份等所有模块。
            </p>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              后台地址：<Code>/admin</Code> · 默认账号可在 Settings 页面修改密码
            </div>
          </div>

          {/* All sections in cards */}
          <div className="space-y-6">
            {/* Dashboard */}
            <Section id="dashboard" title="1. Dashboard 仪表盘">
              <P>登录后台后的首页，展示网站核心数据概览：</P>
              <UL>
                <li><B>页面访问量</B> — 网站页面浏览次数统计，支持 today vs yesterday 对比</li>
                <li><B>在线访客</B> — 当前正在浏览网站的用户数（实时）</li>
                <li><B>询盘数</B> — 客户提交的咨询数量，新询盘角标提醒</li>
                <li><B>流量趋势图</B> — 按天展示访问量和独立访客走势（支持 7d / 14d / 30d / 90d 切换）</li>
                <li><B>热门页面</B> — 访问量最高的页面排行，含进度条可视化</li>
                <li><B>来源统计</B> — 访客来源 Referrer 排行</li>
              </UL>
              <Tip>点击右上角 Refresh 按钮实时更新数据。</Tip>
            </Section>

            {/* Services */}
            <Section id="services" title="2. Services 服务管理">
              <P>管理网站展示的物流服务项目。</P>
              <Sub>新增服务</Sub>
              <OL>
                <li>点击 <Code>+ Add Service</Code></li>
                <li>填写 <B>Name</B>（如「海运整箱」「空运快递」）</li>
                <li><B>Slug</B> 自动生成 URL 路径，如 <Code>ocean-freight</Code></li>
                <li>选择 <B>Image</B> — 通过图片选择器从图库选择</li>
                <li><B>Content</B> — Markdown 编辑器，支持实时预览</li>
                <li>设置 <B>Sort Order</B> 排序序号</li>
                <li>勾选 <B>Active</B> 发布</li>
              </OL>
              <Sub>Markdown 编辑器</Sub>
              <P>Content 字段提供两种模式：</P>
              <UL>
                <li><B>Markdown 模式</B> — Markdown 语法，自动实时预览</li>
                <li><B>HTML 模式</B> — 直接写 HTML，精确控制排版</li>
              </UL>
              <Tip>推荐 Markdown 模式。如需复杂表格或自定义样式，切换到 HTML 模式。</Tip>
              <Sub>图片选择器</Sub>
              <UL>
                <li>点击 Browse 打开图片浏览器</li>
                <li>左侧目录树，支持搜索文件名</li>
                <li>可直接上传新图片</li>
                <li>点击图片即选中</li>
              </UL>
            </Section>

            {/* News */}
            <Section id="news" title="3. News 新闻管理">
              <P>发布公司新闻、行业资讯、物流动态。</P>
              <Sub>新增文章</Sub>
              <OL>
                <li>点击 <Code>+ Add News</Code></li>
                <li><B>Title</B> — 标题（同时影响 SEO）</li>
                <li><B>Slug</B> — 建议英文短横线分隔，如 <Code>new-shipping-route-europe</Code></li>
                <li><B>Category</B>、<B>Cover Image</B>、<B>Excerpt</B></li>
                <li><B>Content</B> — Markdown/HTML 双模式编辑器</li>
                <li>设置 <B>Active</B> 发布</li>
              </OL>
              <Sub>Markdown 示例</Sub>
              <CodeBlock>{`## 航线更新

- **深圳 → 鹿特丹** — 每周两班
- **上海 → 汉堡** — 每周三班

| 航线 | 传统时效 | 新时效 |
|------|---------|-------|
| 深圳→鹿特丹 | 35天 | 25天 |

> 所有航线均提供全程追踪服务。`}</CodeBlock>
            </Section>

            {/* SEO */}
            <Section id="seo" title="4. SEO 搜索引擎优化" badge="重点">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <B>什么是 SEO？</B>
                <span className="block mt-1">让 Google、Bing 更好理解页面内容，搜索结果中获得更高排名，带来免费精准流量。</span>
              </div>
              <Sub>4.1 服务页 SEO 技巧</Sub>
              <UL>
                <li><B>名称具体</B> — 如「International Ocean Freight (FCL/LCL)」</li>
                <li><B>Content 丰富</B> — 200 字以上，使用 H2/H3 分节</li>
                <li><B>Slug 英文关键词</B> — 如 <Code>ocean-freight-fcl</Code></li>
              </UL>
              <Sub>4.2 新闻 SEO 价值</Sub>
              <UL>
                <li>每周至少 1 篇 — Google 喜欢持续更新</li>
                <li>Title 含关键词 — 如「New Shipping Route from Shenzhen to Rotterdam」</li>
                <li>文章中链接到相关服务页 — 形成内部链接网络</li>
              </UL>
              <Sub>4.3 检查清单</Sub>
              <Checklist items={[
                '每个服务有 200 字以上详细 Content',
                '服务和新闻都有封面图',
                '每周至少 1 篇新闻文章',
                'Slug 使用英文短横线，含关键词',
              ]} />
              <Sub>4.4 已内置的自动化 SEO</Sub>
              <UL>
                <li><B>Sitemap</B> — 自动生成 <Code>/sitemap.xml</Code></li>
                <li><B>Robots.txt</B> — 允许抓取，禁止 /admin 和 /api</li>
                <li><B>H1/H2 语义化</B> — 符合最佳实践</li>
                <li><B>图片懒加载</B> — 自动优化</li>
              </UL>
            </Section>

            {/* Inquiries */}
            <Section id="inquiries" title="5. Inquiries 询盘管理">
              <P>客户通过 Contact 页面提交的咨询信息。</P>
              <UL>
                <li>查看姓名、邮箱、公司、电话、留言</li>
                <li>标记 <B>已读/未读</B> 状态</li>
                <li>Dashboard 新询盘角标提醒</li>
              </UL>
              <Tip>建议每天检查新询盘并及时回复。</Tip>
            </Section>

            {/* Banners */}
            <Section id="banners" title="6. Banners 轮播图管理">
              <P>管理首页顶部轮播横幅。</P>
              <UL>
                <li><B>Title / Subtitle</B> — 标题和副标题</li>
                <li><B>Image</B> — 背景图（建议 1920×800px+）</li>
                <li><B>Link</B> — 点击跳转链接（可选）</li>
                <li><B>Sort Order</B> / <B>Active</B> — 排序和显示控制</li>
              </UL>
              <Tip>建议 3-5 张轮播图，使用高质量大图。</Tip>
            </Section>

            {/* Images */}
            <Section id="images" title="7. Images 图片管理">
              <P>集中管理网站所有图片文件。</P>
              <UL>
                <li><B>Upload</B> — 上传到 <Code>/images/uploads/</Code></li>
                <li><B>浏览</B> — 按目录树浏览</li>
                <li><B>搜索</B> — 按文件名搜索</li>
                <li><B>Copy URL</B> — 复制路径用于内容引用</li>
                <li><B>删除</B> — 仅可删除上传的图片</li>
              </UL>
              <Tip>限制：单张最大 10MB，支持 JPG/PNG/GIF/WebP/SVG。</Tip>
            </Section>

            {/* Settings */}
            <Section id="settings" title="8. Settings 系统设置">
              <Sub>8.1 General（常规）</Sub>
              <UL>
                <li><B>Site Name / Description</B> — 名称和 SEO 描述</li>
                <li><B>Contact Info</B> — 电话、邮箱、地址</li>
              </UL>
              <Sub>8.2 Social Media</Sub>
              <P>WhatsApp、WeChat、LinkedIn 等链接，显示在页脚。</P>
              <Sub>8.3 About</Sub>
              <P>About 页面公司介绍和统计数据。</P>
              <Sub>8.4 Change Password</Sub>
              <P>修改管理员密码，最少 6 位。</P>
            </Section>

            {/* Security */}
            <Section id="security" title="9. Security 安全策略" badge="重要" badgeColor="red">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-800">
                以下安全机制已自动生效，无需手动配置。
              </div>
              <Sub>9.1 API 鉴权</Sub>
              <P>所有管理接口需登录 Token。客户提交询盘不需登录。</P>
              <Sub>9.2 XSS 防护</Sub>
              <P>自动过滤 <Code>&lt;script&gt;</Code>、<Code>onclick</Code> 等危险内容。</P>
              <Sub>9.3 路由保护</Sub>
              <P>未登录访问 <Code>/admin</Code> 自动跳转登录页。Token 有效期 8 小时。</P>
              <Sub>上线前检查</Sub>
              <Checklist color="red" items={[
                '修改默认管理员密码',
                '设置 JWT_SECRET 环境变量（32 位+ 随机字符串）',
                '域名启用 HTTPS',
              ]} />
            </Section>

            {/* Backup */}
            <Section id="backup" title="10. Backup 数据备份">
              <Sub>下载备份</Sub>
              <P>Admin → Backup → Download Backup。备份前自动 WAL checkpoint 确保完整。</P>
              <Sub>恢复备份</Sub>
              <UL>
                <li>上传 .db 备份文件</li>
                <li>自动验证 SQLite 有效性</li>
                <li>恢复前自动保存当前库</li>
              </UL>
              <Tip>恢复操作会覆盖当前数据库，操作前先下载当前备份！</Tip>
            </Section>

            {/* Deploy */}
            <Section id="deploy" title="11. Deploy 部署">
              <Sub>服务器要求</Sub>
              <UL>
                <li>Node.js 18+</li>
                <li>1GB+ 内存，5GB+ 磁盘</li>
                <li>域名已解析到服务器 IP</li>
              </UL>
              <Sub>部署步骤</Sub>
              <CodeBlock>{`# 拉取代码
git clone <repo-url> logistics && cd logistics

# 安装 & 构建 & 启动
npm install
npm run build
npm start`}</CodeBlock>
              <Sub>环境变量</Sub>
              <div className="overflow-x-auto my-3">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead><tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">变量</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">说明</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">默认</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-4 py-2"><Code>JWT_SECRET</Code></td><td className="px-4 py-2 text-gray-600">令牌密钥</td><td className="px-4 py-2 text-gray-400">必须设置</td></tr>
                    <tr><td className="px-4 py-2"><Code>PORT</Code></td><td className="px-4 py-2 text-gray-600">服务端口</td><td className="px-4 py-2 text-gray-400">3000</td></tr>
                  </tbody>
                </table>
              </div>
              <Sub>Nginx + HTTPS</Sub>
              <CodeBlock>{`server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}</CodeBlock>
            </Section>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
            Admin Operations Guide
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---- Reusable Components ---- */

function Section({ id, title, badge, badgeColor = 'red', children }: {
  id: string; title: string; badge?: string; badgeColor?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 scroll-mt-20">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        {title}
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            badgeColor === 'red' ? 'bg-red-100 text-red-600' : 'bg-red-100 text-red-600'
          }`}>{badge}</span>
        )}
      </h3>
      {children}
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-gray-800 mt-5 mb-2 pl-3 border-l-2 border-blue-500">{children}</h4>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="text-gray-800 font-semibold">{children}</strong>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc ml-5 my-2 space-y-1 text-sm text-gray-600 leading-relaxed marker:text-gray-300">{children}</ul>;
}

function OL({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal ml-5 my-2 space-y-1 text-sm text-gray-600 leading-relaxed marker:text-gray-400">{children}</ol>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 my-3 text-sm text-blue-700">
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      <span>{children}</span>
    </div>
  );
}

function Checklist({ items, color = 'green' }: { items: string[]; color?: string }) {
  const styles = color === 'red'
    ? 'bg-red-50 border-red-100 text-red-700'
    : 'bg-emerald-50 border-emerald-100 text-emerald-700';
  const check = color === 'red' ? 'text-red-400' : 'text-emerald-400';
  return (
    <div className={`${styles} border rounded-xl p-4 my-3`}>
      <ul className="space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`${check} mt-0.5`}>☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 text-gray-300 text-[13px] px-5 py-4 rounded-xl overflow-x-auto my-3 leading-relaxed border border-gray-800">
      <code>{children}</code>
    </pre>
  );
}
