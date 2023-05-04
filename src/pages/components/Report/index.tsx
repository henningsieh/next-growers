/* eslint-disable @typescript-eslint/no-unused-vars */
import type{ Report } from '~/types'
import { Button } from '@mantine/core'
import { api } from "~/utils/api";


type ReportProps = {
	report: Report
}
export function Report ({ report }: ReportProps)  {

	const trpc = api.useContext();
    const { mutate: deleteMutation } = api.reports.deleteReport.useMutation({
        onMutate: async (deleteId) => {
    
          // Cancel any outgoing refetches so they don't overwrite our optimistic update
          await trpc.reports.getAll.cancel()
    
          // Snapshot the previous value
          const previousReports = trpc.reports.getAll.getData()
    
          // Optimistically update to the new value
          trpc.reports.getAll.setData(undefined, (prev) => {
            if (!prev) return previousReports
            return prev.filter(t => t.id !== deleteId)
          })
    
          // Return a context object with the snapshotted value
          return { previousReports }
        },
        // If the mutation fails,
        // use the context returned from onMutate to roll back
        onError: (err, newTodo, context) => {
          // toast.error(`An error occured when deleting todo`)
          if (!context) return
          trpc.reports.getAll.setData(undefined, () => context.previousReports)
        },
        // Always refetch after error or success:
        onSettled: async () => {
          console.log("SETTLED")
          await trpc.reports.getAll.invalidate()
        },
      });

    
  return (
        <div>{report.id}
        
        
        
        <p>id: {report.id}</p>
        <div className='bg-primary rounded-md'>titel:  {report.title}</div>
        <p>description: {report.description}</p>
        <Button variant="outline"  uppercase color="red"
        onClick={() => {
            deleteMutation(report.id)
        }}>
        Delete Report! &nbsp;⚠️
        </Button>
    
    
    </div>
  )
}
