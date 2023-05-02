import { Button } from '@mantine/core';
import Head from 'next/head';
import Image from "next/image";
import Link from 'next/link';
import { api } from "~/utils/api";

const UserReports = () => {

  const { data: reports, 
          isLoading, 
          isError 
  } = api.reports.getOwnReports.useQuery();
  
	if (isLoading) return <div>Loading reports 🔄</div>
	if (isError)   return <div>Error fetching your reports ❌ Please sign in!</div>
  // console.log(reports)

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
                <div className="rounded-md shadow-xl">
                  <div className='bg-primary rounded-md'>Titel: {report.title}</div>
                  <p>{report.description}</p>
                </div>
              </>
          )})
          : 
            <div className="hero max-h-screen bg-primary text-primary-content rounded-md">
              <div className="hero-content flex-col md:flex-row">
                {/* <Image alt="no report image" width={640} height={429} src="/A-rAZGIE2pA-unsplash.jpg" className="max-w-sm rounded-lg shadow-2xl" /> */}
                <div className='text-center'>
                  <h1 className="whitespace-nowrap text-4xl font-bold">No Reports found! 😢</h1>
                  <p className="error py-6 font-bold text-lg">You haven&apos;t created any reports yet.</p>
                    {/* <Button className=' btn btn-active 
                          btn-secondary text-secondary-content
                          w-full whitespace-nowrap font-bold'
                        > Create your first report! 🚀</Button> */}
                    <Link href="/account/reports/add">
                    <Button color="orange.6" variant="outline" fullWidth >
                    Create your first report! 🚀
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </main>
    </section>





  )
}

export default UserReports