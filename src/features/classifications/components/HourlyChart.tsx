import { BarChart3 } from "lucide-react";
import { useState, useMemo, useCallback, memo } from "react";
import type { HourlyCount } from "../types/classification.types";

interface HourlyChartProps {
  data: HourlyCount[];
}

interface TooltipData {
  hour: string;
  count: number;
  x: number;
  y: number;
}

interface ChartPoint {
  x: number;
  y: number;
  count: number;
  hour: string;
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = 800;
const CHART_DISPLAY_HEIGHT = 280;
const PADDING = { top: 20, bottom: 30, left: 10, right: 5 } as const;
const CHART_COLOR = "rgb(99, 102, 241)";
const GRID_COLOR = "rgb(229, 231, 235)";
const GRID_STROKE_WIDTH = "0.3";
const LINE_STROKE_WIDTH = "1.5";
const POINT_RADIUS = { default: 2, active: 2.5, hover: 4 };
const POINT_STROKE_WIDTH = "0.8";
const TOOLTIP_OFFSET_Y = 60;
const EMPTY_STATE_HEIGHT = "h-64";

const ChartHeader = memo(() => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-indigo-50 rounded-lg">
      <BarChart3 className="w-5 h-5 text-indigo-600" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Hourly Activity</h2>
      <p className="text-sm text-gray-600">Classifications per hour (last 24h)</p>
    </div>
  </div>
));

ChartHeader.displayName = 'ChartHeader';

const EmptyState = memo(() => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <ChartHeader />
    <div className={`flex items-center justify-center ${EMPTY_STATE_HEIGHT} text-gray-500`}>
      No data available
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';

const formatHour = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString(undefined, { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false 
  });
};

const formatTooltipTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString(undefined, { 
    month: "short",
    day: "numeric",
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false 
  });
};

const getTextAlign = (index: number, total: number): React.CSSProperties['textAlign'] => {
  if (index === 0) return 'left';
  if (index === total - 1) return 'right';
  return 'center';
};

export function HourlyChart({ data }: HourlyChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const chartMetrics = useMemo(() => {
    const maxCount = Math.max(...data.map(item => item.count), 1);
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    
    return { maxCount, innerHeight, innerWidth };
  }, [data]);

  const points = useMemo<ChartPoint[]>(() => {
    const { maxCount, innerHeight, innerWidth } = chartMetrics;
    const divisor = Math.max(data.length - 1, 1);
    
    return data.map((item, index) => ({
      x: PADDING.left + (index / divisor) * innerWidth,
      y: PADDING.top + (1 - item.count / maxCount) * innerHeight,
      count: item.count,
      hour: item.hour
    }));
  }, [data, chartMetrics]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
      .join(' ');
  }, [points]);

  const handlePointHover = useCallback((point: ChartPoint, event: React.MouseEvent<SVGCircleElement>) => {
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    
    setTooltip({
      hour: point.hour,
      count: point.count,
      x: (point.x / CHART_WIDTH) * rect.width,
      y: (point.y / CHART_HEIGHT) * rect.height
    });
  }, []);

  const handlePointLeave = useCallback(() => setTooltip(null), []);

  if (data.length === 0) return <EmptyState />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <ChartHeader />

      <div className="space-y-3">
        <div className="relative">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: `${CHART_DISPLAY_HEIGHT}px` }}
          >
            {/* Grid lines */}
            <line x1={PADDING.left} y1={PADDING.top} x2={CHART_WIDTH - PADDING.right} y2={PADDING.top} stroke={GRID_COLOR} strokeWidth={GRID_STROKE_WIDTH} vectorEffect="non-scaling-stroke" />
            <line x1={PADDING.left} y1={CHART_HEIGHT / 2} x2={CHART_WIDTH - PADDING.right} y2={CHART_HEIGHT / 2} stroke={GRID_COLOR} strokeWidth={GRID_STROKE_WIDTH} vectorEffect="non-scaling-stroke" />
            <line x1={PADDING.left} y1={CHART_HEIGHT - PADDING.bottom} x2={CHART_WIDTH - PADDING.right} y2={CHART_HEIGHT - PADDING.bottom} stroke={GRID_COLOR} strokeWidth={GRID_STROKE_WIDTH} vectorEffect="non-scaling-stroke" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={CHART_COLOR}
              strokeWidth={LINE_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Points */}
            {points.map((point) => {
              const isActive = tooltip?.hour === point.hour;
              return (
                <g key={point.hour}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={POINT_RADIUS.hover}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={(e) => handlePointHover(point, e)}
                    onMouseLeave={handlePointLeave}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? POINT_RADIUS.active : POINT_RADIUS.default}
                    fill={CHART_COLOR}
                    stroke="white"
                    strokeWidth={POINT_STROKE_WIDTH}
                    vectorEffect="non-scaling-stroke"
                    className="pointer-events-none transition-all"
                  />
                </g>
              );
            })}
          </svg>

          {/* Y-axis labels (left side) */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-5 pr-2">
            <span className="text-xs text-gray-600 font-medium">{chartMetrics.maxCount}</span>
            <span className="text-xs text-gray-600 font-medium">{Math.round(chartMetrics.maxCount / 2)}</span>
            <span className="text-xs text-gray-600 font-medium">0</span>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap z-10 pointer-events-none"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - TOOLTIP_OFFSET_Y}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-semibold">{formatTooltipTime(tooltip.hour)}</div>
              <div className="text-gray-300">
                Count: <span className="font-bold text-white">{tooltip.count}</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          )}

          <div className="flex justify-between px-2 mt-2 ml-8">
            {data.map((item, index) => (
              <span 
                key={index} 
                className="text-xs text-gray-600 font-medium"
                style={{ flex: 1, textAlign: getTextAlign(index, data.length) }}
              >
                {formatHour(item.hour)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-indigo-500 rounded" />
            <span className="text-sm text-gray-600">Classifications</span>
          </div>
          <span className="text-sm text-gray-500">
            Peak: <span className="font-semibold text-gray-700">{chartMetrics.maxCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
