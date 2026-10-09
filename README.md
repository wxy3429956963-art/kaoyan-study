# 向前 · 考研学习计划

GitHub Pages 前端 + Supabase 登录/数据库。四科每日任务、打卡、时长、计划日历和统计保留。相同邮箱账户的多设备记录保存在云端，支持实时订阅、切回页面刷新及每 30 秒补充刷新。

## 必须完成的账户配置

1. 在自己的 Supabase 账户中新建项目，保存自己设置的数据库密码；密码不放入网页或仓库。
2. 在项目 SQL Editor 执行 supabase/schema.sql。它创建三张表，启用 RLS，仅允许登录用户读写自己的数据。
3. 取得项目 URL 和 publishable key（旧项目可用 anon key）。不要使用 secret key 或 service_role key。
4. 新建 GitHub 仓库 kaoyan-study。免费 GitHub Pages 通常需要公开仓库；仓库只有程序代码，不包含学习记录。
5. 将项目 URL 和公开 publishable key 写入 src/supabase-config.json。也可用 VITE_SUPABASE_URL 和 VITE_SUPABASE_PUBLISHABLE_KEY 环境变量覆盖；仓库配置只允许公开 key。
6. Settings → Pages → Source 选择 GitHub Actions，然后推送 main，等待 Deploy study site 完成。
7. 在 Supabase Authentication → URL Configuration 设置 Site URL 为实际 GitHub Pages 地址，并把相同地址添加到允许的 Redirect URLs。
8. 打开部署后的网页，用邮箱获取登录链接；手机电脑分别用同一邮箱登录。登录邮件受 Supabase 邮件服务的额度和策略限制。

## 本地运行

复制 .env.example 为 .env 并填写项目 URL 和 publishable key。

```sh
npm ci
npm test
npm run dev
```

## 隐私与验证边界

网页和源代码可以公开，学习记录由 Supabase RLS 隔离。浏览器仅保存登录会话，不把 localStorage 当作学习数据库。

上线前须实测：匿名读取被拒绝；两个账户不能互读；同一账户在两个设备的打卡和时长同步；刷新保留记录。未连接真实 Supabase 项目前不能声称云端同步已经实测通过。

