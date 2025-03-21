# Twitter 开发者应用程序设置指南

按照以下步骤设置 Twitter 开发者应用程序，以便在 SWEATSHOP 项目中使用 Twitter 登录功能：

## 1. 创建 Twitter 开发者账户

1. 访问 [Twitter 开发者平台](https://developer.twitter.com)
2. 使用你的 Twitter 账户登录
3. 如果你尚未拥有开发者账户，请申请一个（可能需要填写一些问卷）

## 2. 创建新项目和应用

1. 进入开发者门户后，点击 "Projects & Apps" > "Overview"
2. 点击 "+ New Project" 按钮
3. 输入项目名称和使用案例（例如，"SWEATSHOP ID Card Generator"）
4. 提供项目描述
5. 在项目中，创建一个新的应用程序（"+ Add App"）
6. 提供应用名称（例如 "SWEATSHOP"）

## 3. 设置 OAuth 2.0 认证

1. 在应用详情页面，点击 "Settings" > "User authentication settings"
2. 启用 OAuth 2.0
3. 设置类型为 "Web App"
4. 添加以下回调 URL:
   - 开发环境: `http://localhost:3001/api/auth/callback/twitter`
   - 生产环境: `https://your-domain.com/api/auth/callback/twitter`
5. 设置网站 URL（你的应用网站地址）
6. 确保选择了以下 OAuth 2.0 权限:
   - `tweet.read`
   - `users.read`
   - `offline.access`
7. 保存设置

## 4. 获取 API 密钥

1. 在应用详情页面，查找 "Keys and Tokens" 部分
2. 复制 "OAuth 2.0 Client ID" - 这是你的 `TWITTER_CLIENT_ID`
3. 点击 "Regenerate" 按钮来获取 "OAuth 2.0 Client Secret" - 这是你的 `TWITTER_CLIENT_SECRET`
4. 将这些值添加到 `.env.local` 文件中

## 5. 配置应用权限

1. 在应用设置的 "App permissions" 部分，确保激活了 "Read" 权限
2. 如果需要，还可以设置允许的 "App URL"

## 注意事项

- Twitter 开发者策略会不时更改，如果你在设置过程中遇到问题，请查看最新的 Twitter 开发者文档。
- 确保你的应用遵循 Twitter 的开发者协议和策略。
- 开发者账户可能有 API 请求限制，留意可能的速率限制。

## 疑难解答

如果在使用 Twitter 登录时遇到问题：

1. 确保你的回调 URL 格式正确且与应用设置中的完全一致
2. 检查 `.env.local` 文件中的 API 密钥是否正确
3. 确保 `NEXTAUTH_URL` 与你的应用程序 URL 一致
4. 在开发过程中将 `DEBUG=true` 设置在 `.env.local` 文件中以获取更多日志信息
5. 检查浏览器控制台和服务器日志中是否有错误信息 