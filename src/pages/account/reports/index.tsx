import Head from 'next/head';
import Image from "next/image";
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
        <title>Create new Report</title>
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
              <div className="hero-content flex-col sm:flex-row">
                <Image alt="no report image" width={640} height={429} src="/A-rAZGIE2pA-unsplash.jpg" className="max-w-sm rounded-lg shadow-2xl" />
                <div className=''>
                  <h1 className="text-4xl font-bold">No Reports found! 😢</h1>
                  <p className="py-6 text-xl">You haven&apos;t created any reports yet.</p>
                <button className='btn btn-active btn-secondary text-secondary-content font-bold w-full'>
                  Create and upload your first report now! 🚀</button>
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </main>
    </section>






/* 

    <section>
      <Head>
        <title>Create a new Report</title>
        <meta
          name="description"
          content="Upload and create your Report to growagram.com"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar session={session} status={status} />

			{reports.length ?
				reports.map((report) => {
					return (
            <>
              <div className="card w-96 bg-neutral-100/20 shadow-xl image-full">
                <figure><Image src="https://picsum.photos/200/120" width={200} height={120} alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">{report.title}</h2>
                  <p>{report.description}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </>
            )
				})
				: "Create your first report..."}

    </section>

 */

  )
}

export default UserReports