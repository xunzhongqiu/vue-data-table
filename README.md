# @portfolio/vue-data-table

[English](#english) | [简体中文](#简体中文)

## English

An accessible, typed data table component for Vue 3. Includes client-side sorting, keyword search, pagination, and an empty state. No UI framework dependency.

### Install and build

```sh
npm install
npm run build
```

### Usage

```vue
<script setup lang="ts">
import { VueDataTable, type DataTableColumn } from "@portfolio/vue-data-table";
type User = { id: number; name: string; role: string };
const rows: User[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer" },
  { id: 2, name: "Grace Hopper", role: "Engineer" },
];
const columns: DataTableColumn<User>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
];
</script>
<template><VueDataTable :rows="rows" :columns="columns" row-key="id" /></template>
```

Set `searchable="false"` or `paginated="false"` to disable those features. Use `page-size` to change page length and a column's `format` callback to customize displayed values. Search labels, empty text, and pagination labels can be localized with props.

### Accessibility and limitations

Uses semantic table markup, keyboard-operable sort and pagination controls, visible focus indicators, and live result announcements. Sorting and searching happen in the browser; use server-side data operations for large datasets.

## 简体中文

适用于 Vue 3 的强类型、无障碍数据表格组件，内置客户端排序、关键词搜索、分页和空状态，不依赖 UI 框架。

### 安装与构建

```sh
npm install
npm run build
```

### 使用示例

```vue
<script setup lang="ts">
import { VueDataTable, type DataTableColumn } from "@portfolio/vue-data-table";
type User = { id: number; name: string; role: string };
const rows: User[] = [
  { id: 1, name: "Ada Lovelace", role: "工程师" },
  { id: 2, name: "Grace Hopper", role: "工程师" },
];
const columns: DataTableColumn<User>[] = [
  { key: "name", label: "姓名" },
  { key: "role", label: "职位" },
];
</script>
<template><VueDataTable :rows="rows" :columns="columns" row-key="id" /></template>
```

设置 `searchable="false"` 或 `paginated="false"` 可关闭对应功能。通过 `page-size` 修改每页条数；列定义中的 `format` 回调可以自定义单元格显示内容。搜索标签、空状态文字和分页标签均可通过属性本地化。

### 无障碍支持与限制

组件使用语义化表格结构，排序和分页控件支持键盘操作，提供清晰的焦点样式和动态结果播报。排序与搜索在浏览器端执行；处理大数据集时建议改为服务端查询。
