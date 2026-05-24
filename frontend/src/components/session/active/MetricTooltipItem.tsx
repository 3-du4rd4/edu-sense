import { LucideIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MetricTooltipItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  span?: string;
  active?: boolean;
};

export function MetricTooltipItem({
  icon: Icon,
  label,
  value,
  span,
  active = false,
}: MetricTooltipItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex cursor-default items-center justify-center rounded-full p-1.5 transition gap-2 hover:bg-muted">
          <Icon
            className={
              active
                ? "size-4 shrink-0 text-[#76DF64]"
                : "size-4 shrink-0 text-muted-foreground"
            }
          />

          {span && (
            <span className="text-xs text-muted-foreground">{span}</span>
          )}
        </div>
      </TooltipTrigger>

      <TooltipContent>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </TooltipContent>
    </Tooltip>
  );
}
