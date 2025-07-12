import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactNode,
} from "react";
import { createContext, useCallback, useContext, useId, useMemo } from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import type {
  NameType,
  Payload as RechartsPayload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "../utils/cn";

// Constants
const THEMES = { light: "", dark: ".dark" } as const;

const RECHARTS_OVERRIDES = [
  "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
  "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
  "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
  "[&_.recharts-layer]:outline-hidden",
  "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
  "[&_.recharts-radial-bar-background-sector]:fill-muted",
  "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
  "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
  "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
  "[&_.recharts-sector]:outline-hidden",
  "[&_.recharts-surface]:outline-hidden",
] as const;

// Types
export type ChartConfig = {
  [k in string]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

// Context
const ChartContext = createContext<ChartContextProps | null>(null);

// Hook
export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// Helper functions
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey = key;

  // Check if key exists in payload and is a string
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return config[configLabelKey] || config[key];
}

function generateChartStyles(id: string, config: ChartConfig) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return "";
  }

  return Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const styles = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {\n${styles}\n}`;
    })
    .join("\n");
}

// Chart Style Component
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const styleContent = useMemo(
    () => generateChartStyles(id, config),
    [id, config]
  );

  if (!styleContent) {
    return null;
  }

  return <style>{styleContent}</style>;
};

// Main Chart Container
export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig;
  children: ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  const contextValue = useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex aspect-video justify-center text-xs",
          ...RECHARTS_OVERRIDES,
          className
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// Tooltip Components
export const ChartTooltip = Tooltip;

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: RechartsPayload<ValueType, NameType>[];
  label?: string | number;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (
    label: unknown,
    payload: RechartsPayload<ValueType, NameType>[]
  ) => ReactNode;
  labelClassName?: string;
  formatter?: (
    value: ValueType,
    name: NameType,
    item: RechartsPayload<ValueType, NameType>,
    index: number,
    payload: RechartsPayload<ValueType, NameType>[]
  ) => ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    return value ? (
      <div className={cn("font-medium", labelClassName)}>{value}</div>
    ) : null;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  const renderTooltipItem = useCallback(
    (item: RechartsPayload<ValueType, NameType>, index: number) => {
      const key = `${nameKey || item.name || item.dataKey || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const indicatorColor = color || item.payload?.fill || item.color;

      if (formatter && item?.value !== undefined && item.name) {
        return formatter(item.value, item.name, item, index, item.payload);
      }

      return (
        <>
          {itemConfig?.icon ? (
            <itemConfig.icon />
          ) : (
            !hideIndicator && (
              <div
                className={cn(
                  "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                  {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent":
                      indicator === "dashed",
                    "my-0.5": payload?.length === 1 && indicator === "dashed",
                  }
                )}
                style={
                  {
                    "--color-bg": indicatorColor,
                    "--color-border": indicatorColor,
                  } as CSSProperties
                }
              />
            )
          )}
          <div
            className={cn(
              "flex flex-1 justify-between leading-none",
              payload?.length === 1 && indicator !== "dot"
                ? "items-end"
                : "items-center"
            )}
          >
            <div className="grid gap-1.5">
              {payload?.length === 1 && indicator !== "dot" && tooltipLabel}
              <span className="text-muted-foreground">
                {itemConfig?.label || item.name}
              </span>
            </div>
            {item.value && (
              <span className="ml-4 font-medium font-mono text-foreground tabular-nums">
                {item.value.toLocaleString()}
              </span>
            )}
          </div>
        </>
      );
    },
    [
      config,
      color,
      nameKey,
      formatter,
      hideIndicator,
      indicator,
      payload?.length,
      tooltipLabel,
    ]
  );

  if (!(active && payload?.length)) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div
            className={cn(
              "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
              indicator === "dot" && "items-center"
            )}
            key={
              typeof item.dataKey === "string" ? item.dataKey : `item-${index}`
            }
          >
            {renderTooltipItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Legend Components
export const ChartLegend = Legend;

interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: LegendPayload[];
  verticalAlign?: "top" | "bottom" | "middle";
  nameKey?: string;
}

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            key={item.value || `legend-item-${key}`}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

export { ChartStyle };
