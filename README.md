# 时间日历应用

这是一个基于React和TypeScript开发的应用，用于显示日期、时间、中国农历以及节假日信息。

## 功能

- 实时显示当前时间
- 显示当月日历
- 显示中国农历信息（年、月、日、天干地支、生肖等）
- 显示节假日信息

## 使用技术

- React
- TypeScript
- Vite
- dayjs (处理日期时间)
- lunar-typescript (处理中国农历和节假日)

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run serve
```

## 项目结构

```
time-weather/
├── public/           # 静态资源
├── src/              # 源代码
│   ├── components/   # React组件
│   │   ├── Calendar.tsx       # 日历组件
│   │   ├── Clock.tsx          # 时钟组件
│   │   ├── LunarInfo.tsx      # 农历信息组件
│   │   └── HolidayInfo.tsx    # 节假日信息组件
│   ├── App.tsx       # 主应用组件
│   ├── main.tsx      # 入口文件
│   └── styles.css    # 全局样式
├── index.html        # HTML模板
├── package.json      # 项目依赖和脚本
├── tsconfig.json     # TypeScript配置
├── vite.config.ts    # Vite配置
└── README.md         # 项目说明
``` 