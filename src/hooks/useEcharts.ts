import * as echarts from 'echarts'
import { onMounted, onUnmounted, reactive, Ref, shallowRef } from 'vue'

export function useEcharts(
  chartRef: Ref<HTMLElement | null>,  // 图表dom元素
  initOptions: echarts.EChartsOption, // 图表的初始配置
  theme?: string | object | null  // 可选，设置 ECharts 主题
) {
  // 创建Echarts响应式实例
  const chartInstance = shallowRef<echarts.EChartsType | null>(null)

  // 创建响应式option，保存图表配置
  const options = reactive<echarts.EChartsOption>(initOptions)

  //初始化图表
  const initChart = () => {
    // 确保 chartRef 绑定了 DOM 元素且 chartInstance 尚未初始化
    if (chartRef.value && !chartInstance.value) {
      // 初始化 ECharts 实例并赋值给 chartInstance
      chartInstance.value = echarts.init(chartRef.value, theme)
      // 设置图表的初始选项
      chartInstance.value.setOption(options)
    }
  }

  // 更新图表配置
  const updateChartOptions = (newOptions: echarts.EChartsOption) => {
    if (chartInstance.value) {
      // 使用新的选项更新图表，不合并现有选项并延迟更新以优化性能
      chartInstance.value.setOption(newOptions, {notMerge: true, lazyUpdate: true})
    }
  }

  // 处理窗口大小调整的函数，确保图表能够自动调整大小
  const handleResize = () => {
    chartInstance.value?.resize()
  }

  // 销毁图表实例，释放内存并清空引用
  const disposeChart = () => {
    chartInstance.value?.dispose()
    chartInstance.value = null
  };

  // 组件挂载初始化
  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })

  // 组件卸载
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    disposeChart()
  })

  return {
    chartInstance,
    options,
    initChart,
    updateChartOptions,
    handleResize,
    disposeChart
  }
}