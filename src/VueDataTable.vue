<template>
  <section class="vdt" :aria-label="label">
    <div v-if="searchable" class="vdt__toolbar">
      <label class="vdt__search-label" :for="searchId">{{ searchLabel }}</label>
      <input :id="searchId" v-model="query" class="vdt__search" type="search" :placeholder="searchPlaceholder" />
      <span class="vdt__count" aria-live="polite">{{ filteredRows.length }} {{ countLabel }}</span>
    </div>
    <div class="vdt__scroll">
      <table>
        <thead><tr>
          <th v-for="column in columns" :key="column.key" :aria-sort="column.sortable ? ariaSort(column) : undefined">
            <button v-if="column.sortable !== false" class="vdt__sort" type="button" @click="toggleSort(column)">
              {{ column.label }} <span aria-hidden="true">{{ sortMark(column) }}</span>
            </button>
            <span v-else>{{ column.label }}</span>
          </th>
        </tr></thead>
        <tbody>
          <tr v-for="(row, index) in pageRows" :key="rowKey(row, index)">
            <td v-for="column in columns" :key="column.key">{{ formatCell(row, column) }}</td>
          </tr>
          <tr v-if="pageRows.length === 0"><td class="vdt__empty" :colspan="columns.length">{{ emptyText }}</td></tr>
        </tbody>
      </table>
    </div>
    <nav v-if="paginated && pageCount > 1" class="vdt__pagination" :aria-label="paginationLabel">
      <button type="button" :disabled="page <= 1" @click="page--">{{ previousLabel }}</button>
      <span aria-live="polite">{{ page }} / {{ pageCount }}</span>
      <button type="button" :disabled="page >= pageCount" @click="page++">{{ nextLabel }}</button>
    </nav>
  </section>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from "vue";

export type DataTableColumn<T> = {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  format?: (value: T[keyof T], row: T) => string | number;
};
const props = withDefaults(defineProps<{
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey?: keyof T & string;
  label?: string;
  searchable?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  countLabel?: string;
  emptyText?: string;
  paginated?: boolean;
  pageSize?: number;
  paginationLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}>(), {
  rowKey: "id" as keyof T & string,
  label: "Data table",
  searchable: true,
  searchLabel: "Search",
  searchPlaceholder: "Search rows...",
  countLabel: "results",
  emptyText: "No results found.",
  paginated: true,
  pageSize: 8,
  paginationLabel: "Table pagination",
  previousLabel: "Previous",
  nextLabel: "Next",
});
const query = ref("");
const page = ref(1);
const sortKey = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");
const searchId = `vdt-search-${Math.random().toString(36).slice(2, 9)}`;
const filteredRows = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase();
  let result = props.rows.filter((row) => !needle || props.columns.some((column) => String(row[column.key] ?? "").toLocaleLowerCase().includes(needle)));
  if (sortKey.value) {
    const key = sortKey.value;
    result = [...result].sort((a, b) => {
      const left = a[key], right = b[key];
      const comparison = typeof left === "number" && typeof right === "number" ? left - right : String(left ?? "").localeCompare(String(right ?? ""), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection.value === "asc" ? comparison : -comparison;
    });
  }
  return result;
});
const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / Math.max(1, props.pageSize))));
const pageRows = computed(() => props.paginated ? filteredRows.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize) : filteredRows.value);
watch([query, () => props.rows, () => props.pageSize], () => { page.value = 1; });
watch(pageCount, (count) => { if (page.value > count) page.value = count; });
function toggleSort(column: DataTableColumn<T>) {
  if (sortKey.value === column.key) sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  else { sortKey.value = column.key; sortDirection.value = "asc"; }
}
function ariaSort(column: DataTableColumn<T>) { return sortKey.value !== column.key ? "none" : sortDirection.value === "asc" ? "ascending" : "descending"; }
function sortMark(column: DataTableColumn<T>) { return sortKey.value !== column.key ? "↕" : sortDirection.value === "asc" ? "↑" : "↓"; }
function rowKey(row: T, index: number) { return String(row[props.rowKey] ?? index); }
function formatCell(row: T, column: DataTableColumn<T>) { const value = row[column.key]; return column.format ? column.format(value, row) : String(value ?? "—"); }
</script>

<style>
.vdt{color:#202938;font:14px/1.5 system-ui,sans-serif}.vdt__toolbar{display:flex;align-items:center;gap:12px;margin-bottom:12px}.vdt__search-label{font-weight:600}.vdt__search{max-width:280px;padding:8px 10px;border:1px solid #cbd3df;border-radius:7px;font:inherit}.vdt__count{margin-left:auto;color:#667085}.vdt__scroll{overflow-x:auto;border:1px solid #e2e7ef;border-radius:10px}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:11px 14px;border-bottom:1px solid #edf0f5;white-space:nowrap}th{background:#f7f8fb;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#475467}tbody tr:last-child td{border-bottom:0}.vdt__sort{border:0;background:none;color:inherit;font:inherit;font-weight:700;cursor:pointer;padding:0}.vdt__sort:focus-visible,.vdt button:focus-visible,.vdt input:focus-visible{outline:3px solid #8ca3ff;outline-offset:2px}.vdt__empty{text-align:center;color:#667085;padding:28px}.vdt__pagination{display:flex;align-items:center;justify-content:flex-end;gap:14px;margin-top:12px}.vdt__pagination button{padding:7px 11px;border:1px solid #cbd3df;border-radius:7px;background:white;font:inherit;cursor:pointer}.vdt__pagination button:disabled{opacity:.45;cursor:not-allowed}
</style>
