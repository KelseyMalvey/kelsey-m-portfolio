<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import rawMetrics from '../data/metrics.json'

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
)

interface Metric {
  month: string
  year: number
  revenue: number
  visitors: number
  conversions: number
  orders: number
}

type MetricKey = 'revenue' | 'visitors' | 'conversions' | 'orders'

const metrics = rawMetrics as Metric[]
const selectedMonth = ref('all')
const lastMetric = metrics[metrics.length - 1]!
const previousMetric = metrics[metrics.length - 2]!

const monthOptions = [
  { title: 'All months', value: 'all' },
  ...metrics.map((metric) => ({ title: `${metric.month} ${metric.year}`, value: metric.month })),
]

const activeMetrics = computed(() => {
  if (selectedMonth.value === 'all') {
    return metrics
  }

  return metrics.filter((metric) => metric.month === selectedMonth.value)
})

const isYearView = computed(() => selectedMonth.value === 'all')

const aggregate = computed(() => {
  const currentMetrics = activeMetrics.value
  const revenue = currentMetrics.reduce((total, metric) => total + metric.revenue, 0)
  const visitors = currentMetrics.reduce((total, metric) => total + metric.visitors, 0)
  const orders = currentMetrics.reduce((total, metric) => total + metric.orders, 0)
  const conversions = currentMetrics.reduce((total, metric) => total + metric.conversions, 0) / currentMetrics.length

  return { revenue, visitors, conversions, orders }
})

const comparison = computed(() => {
  if (isYearView.value) {
    return {
      revenue: lastMetric.revenue - previousMetric.revenue,
      visitors: lastMetric.visitors - previousMetric.visitors,
      conversions: lastMetric.conversions - previousMetric.conversions,
      orders: lastMetric.orders - previousMetric.orders,
      base: previousMetric,
    }
  }

  const index = metrics.findIndex((metric) => metric.month === selectedMonth.value)
  const current = metrics[index] ?? lastMetric
  const previous = metrics[index - 1] ?? current

  return {
    revenue: current.revenue - previous.revenue,
    visitors: current.visitors - previous.visitors,
    conversions: current.conversions - previous.conversions,
    orders: current.orders - previous.orders,
    base: previous,
  }
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function percentChange(value: number, base: number) {
  if (base === 0) return 0
  return Math.round((value / base) * 100)
}

const summaryCards = computed(() => [
  {
    label: 'Revenue',
    value: formatCurrency(aggregate.value.revenue),
    delta: percentChange(comparison.value.revenue, comparison.value.base.revenue),
    icon: 'mdi-cash-multiple',
    color: 'primary',
  },
  {
    label: 'Visitors',
    value: formatNumber(aggregate.value.visitors),
    delta: percentChange(comparison.value.visitors, comparison.value.base.visitors),
    icon: 'mdi-account-group-outline',
    color: 'info',
  },
  {
    label: 'Conversions',
    value: formatPercent(aggregate.value.conversions),
    delta: comparison.value.conversions,
    icon: 'mdi-target',
    color: 'success',
    isPoints: true,
  },
  {
    label: 'Orders',
    value: formatNumber(aggregate.value.orders),
    delta: percentChange(comparison.value.orders, comparison.value.base.orders),
    icon: 'mdi-shopping-outline',
    color: 'warning',
  },
])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: { intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148, 163, 184, 0.12)' },
      ticks: { color: '#94a3b8' },
    },
  },
}

const conversionOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales.y,
      suggestedMin: 0,
      suggestedMax: 5,
    },
  },
}

const revenueChartData = computed(() => ({
  labels: activeMetrics.value.map((metric) => metric.month),
  datasets: [
    {
      label: 'Revenue',
      data: activeMetrics.value.map((metric) => metric.revenue),
      backgroundColor: '#7c83fd',
      borderRadius: 5,
      maxBarThickness: 34,
    },
  ],
}))

const visitorsChartData = computed(() => ({
  labels: activeMetrics.value.map((metric) => metric.month),
  datasets: [
    {
      label: 'Visitors',
      data: activeMetrics.value.map((metric) => metric.visitors),
      borderColor: '#4fc3f7',
      backgroundColor: 'rgba(79, 195, 247, 0.14)',
      pointBackgroundColor: '#4fc3f7',
      pointBorderColor: '#101827',
      pointBorderWidth: 2,
      pointRadius: 4,
      tension: 0.35,
    },
  ],
}))

const conversionChartData = computed(() => ({
  labels: activeMetrics.value.map((metric) => metric.month),
  datasets: [
    {
      label: 'Conversion rate',
      data: activeMetrics.value.map((metric) => metric.conversions),
      borderColor: '#61d6a5',
      backgroundColor: 'rgba(97, 214, 165, 0.18)',
      pointBackgroundColor: '#61d6a5',
      pointBorderColor: '#101827',
      pointBorderWidth: 2,
      pointRadius: 4,
      fill: true,
      tension: 0.35,
    },
  ],
}))

function metricDelta(key: MetricKey) {
  return key === 'conversions'
    ? comparison.value.conversions
    : comparison.value[key]
}

function deltaLabel(card: (typeof summaryCards.value)[number]) {
  const delta = card.delta
  if (card.isPoints) {
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts`
  }

  return `${delta >= 0 ? '+' : ''}${delta}%`
}
</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center px-4 px-md-8" max-width="1440">
        <v-icon icon="mdi-chart-box-outline" color="primary" class="mr-3" />
        <v-app-bar-title class="font-weight-bold">My Dashboard</v-app-bar-title>
        <v-spacer />
        <v-select
          v-model="selectedMonth"
          :items="monthOptions"
          item-title="title"
          item-value="value"
          label="Period"
          variant="outlined"
          density="compact"
          hide-details
          single-line
          style="max-width: 190px"
        />
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="dashboard-container px-4 px-md-8 py-8" max-width="1440">
        <div class="d-flex flex-wrap align-end justify-space-between ga-4 mb-6">
          <div>
            <div class="text-overline text-primary">Business overview</div>
            <h1 class="text-h4 text-md-h3 font-weight-bold">Performance</h1>
            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
              {{ isYearView ? 'Full-year performance for 2025' : `${selectedMonth} 2025 performance` }}
            </p>
          </div>
          <v-chip prepend-icon="mdi-calendar-month-outline" variant="tonal" color="primary">
            {{ isYearView ? 'Jan – Dec 2025' : `${selectedMonth} 2025` }}
          </v-chip>
        </div>

        <v-row>
          <v-col v-for="card in summaryCards" :key="card.label" cols="12" sm="6" lg="3">
            <v-card class="metric-card h-100" rounded="lg" variant="tonal">
              <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between mb-5">
                  <span class="text-body-2 text-medium-emphasis">{{ card.label }}</span>
                  <v-avatar :color="card.color" variant="tonal" size="36">
                    <v-icon :icon="card.icon" size="small" />
                  </v-avatar>
                </div>
                <div class="text-h5 font-weight-bold">{{ card.value }}</div>
                <div
                  class="d-flex align-center text-caption mt-3"
                  :class="card.delta >= 0 ? 'text-success' : 'text-error'"
                >
                  <v-icon
                    :icon="card.delta >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                    size="small"
                    class="mr-1"
                  />
                  {{ deltaLabel(card) }}
                  <span class="text-medium-emphasis ml-1">vs previous</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <v-card rounded="lg" variant="tonal" class="chart-card h-100">
              <v-card-item>
                <v-card-title>Monthly revenue</v-card-title>
                <v-card-subtitle>Gross revenue by month</v-card-subtitle>
              </v-card-item>
              <v-card-text class="chart-frame">
                <Bar :data="revenueChartData" :options="chartOptions" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card rounded="lg" variant="tonal" class="chart-card h-100">
              <v-card-item>
                <v-card-title>Visitors over time</v-card-title>
                <v-card-subtitle>Unique visitors by month</v-card-subtitle>
              </v-card-item>
              <v-card-text class="chart-frame">
                <Line :data="visitorsChartData" :options="chartOptions" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-card rounded="lg" variant="tonal" class="chart-card">
              <v-card-item>
                <v-card-title>Conversion trend</v-card-title>
                <v-card-subtitle>Percentage of visitors who placed an order</v-card-subtitle>
              </v-card-item>
              <v-card-text class="chart-frame chart-frame-wide">
                <Line :data="conversionChartData" :options="conversionOptions" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
}

.chart-frame {
  height: 280px;
}

.chart-frame-wide {
  height: 300px;
}

.metric-card,
.chart-card {
  border-color: rgba(148, 163, 184, 0.14);
}
</style>
