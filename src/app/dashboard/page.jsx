import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import data from "./data.json"

export default function Page() {
 const title="a"
 const value=1233
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards   title={title}             value={value}/>

        {/* <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div> */}

        <DataTable data={data} />
      </div>
    </div>
  )
}
