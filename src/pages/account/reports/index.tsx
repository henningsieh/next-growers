import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"

import { Button, Container, Title } from '@mantine/core';
import Head from 'next/head';
import { api } from "~/utils/api";

import Add from "./add";

const UserReports = () => {

  const { data: session } = useSession()

  if (!session) {

    return <Container className="text-center text-4xl">Access Denied</Container>

  } else {

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

    // FETCH OWN REPORTS
    const { data: reports, isLoading, isError } = api.reports.getOwn.useQuery();

    if (isLoading) return <div>Loading reports 🔄</div>
    if (isError)   return <div>Error fetching your reports ❌ Please sign in!</div>

    return (
      <section>
        <Head>
          <title>Your Reports</title>
          <meta
          name="description"
          content="Upload and create your Report to growagram.com"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="m-2 h-screen">
          <div className="w-5/6 m-auto flex flex-col place-content-center min-h-max">
            <div className="w-full flex flex-col space-y-4">


            <Title order={1}>Your Reports</Title>

              {/* LOOP OVER REPORTS */}
              {reports.length
              ? reports.map((report) => {
                return (
                  <div key={report.id} className="rounded-md shadow-xl">
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
              })
              : 
                <div className="hero max-h-screen bg-primary text-primary-content rounded-md">
                  <div className="hero-content flex-col md:flex-row">
                    {/* <Image alt="no report image" width={640} height={429} src="/A-rAZGIE2pA-unsplash.jpg" className="max-w-sm rounded-lg shadow-2xl" /> */}
                    <div className='text-center'>
                      <h1 className="whitespace-nowrap text-3xl font-bold">No Reports found! 😢</h1>
                      <p className="error py-6 font-bold text-lg">You haven&apos;t created any reports yet.</p>
                        {/* <Button className=' btn btn-active 
                              btn-secondary text-secondary-content
                              w-full whitespace-nowrap font-bold'
                            > Create your first report! 🚀</Button> */}
                    </div>
                  </div>
                </div>
              }
{/*               <Link href="/account/reports/add">
                <Button color="orange.6" variant="outline" fullWidth >
                  Add Report
                </Button>
              </Link> */}


            </div>

              <Add />

          </div>
        </main>
      </section>
    )
  }
}

export default UserReports


/**
 * 
 * PROTECTED PAGE
 */
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(
        ctx.req,
        ctx.res,
        authOptions
      ),
    },
  }
}