import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"

import { Button, Container } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { api } from "~/utils/api";

const UserReports = () => {

  const { data: session } = useSession()

  if (!session) {

    return <Container className="text-center text-4xl">Access Denied</Container>

  } else {

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

        <main className="m-2 h-screen bg-base-100 text-base-content">
          <div className="flex place-content-center h-screen">
            <div className="flex flex-col space-y-4">

            {reports.length
            ? reports.map((report) => {
              return (
                <>
                  <div key={report.id} className="rounded-md shadow-xl">
                    <p>id: <pre>{report.id}</pre></p>
                    <div className='bg-primary rounded-md'>titel: <pre> {report.title}</pre></div>
                    <p>Description: {report.description}</p>
                  </div>
                </>
                )})
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
                <Link href="/account/reports/add">
                <Button color="orange.6" variant="outline" fullWidth >
                Create a report! 🚀
              </Button>
              </Link>
            </div>
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