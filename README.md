# bomb-web

VPN 商品购买网站前端，基于 Vue 3 + TypeScript + Vite + Element Plus。

## 技术栈

- Vue 3 + TypeScript
- Vite 6
- Element Plus
- Pinia
- Vue Router
- Axios

## 启动

```bash
cd bomb-web
npm install
npm run dev
```

访问：http://localhost:5173

## 后端联调

确保 `bomb-server` 已在 `http://localhost:8080` 启动。Vite 已配置 `/api` 代理。

## 页面说明

| 路径 | 说明 |
|------|------|
| `/` | 商品列表 |
| `/login` | 登录 |
| `/register` | 注册 |
| `/checkout/:productId` | 确认订单 |
| `/pay/result` | 支付结果 |
| `/my/orders` | 我的订单 |
| `/my/entitlement` | 我的权益 |
| `/admin/products` | 商品管理（管理员） |
| `/admin/orders` | 订单管理（管理员） |
| `/admin/entitlements` | 权益管理（管理员） |

## 默认管理员

使用后端 seed 数据：`admin` / `admin123`
