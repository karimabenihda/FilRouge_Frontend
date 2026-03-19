import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({title,value}) {
  return (
    <div
      // className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    //  className="*:data-[slot=card]:from-[#c8ad93]/25    *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
 className="*:data-[slot=card]:from-[#c8ad93]/25   *:data-[slot=card]:bg-gradient-to-t "
      >
      <Card className="@container/card">
      {/* <Card className="w-full"> */}
        <CardHeader>
          <CardDescription className="text-[#5c6f91]">Total Revenue</CardDescription>
          <CardTitle className="text-[#101828]  text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
          <CardAction>
            <Badge  className="text-[#1e3753]" variant="outline">
              <IconTrendingUp />
              {/* {pourcentage} */}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-[#101828] line-clamp-1 flex gap-2 font-medium">
            {title} <IconTrendingUp className="text-[#101828] size-4" />
          </div>
          <div className="text-[#5c6f91] text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

    </div>
  );
}
