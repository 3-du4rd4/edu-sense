import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerAction?: ReactNode;
};

export function DashboardCard({
  title,
  description,
  children,
  className,
  contentClassName,
  headerAction,
}: DashboardCardProps) {
  return (
    <Card className={cn("rounded-3xl", className)}>
      {(title || description || headerAction) && (
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}

            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {headerAction}
        </CardHeader>
      )}

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
