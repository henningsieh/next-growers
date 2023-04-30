import Head from 'next/head';
import Image from "next/image";
import Navbar from '../../components/Navbar';
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const UserReports = () => {
  const { data: session, status } = useSession();

  const { data: reports, 
          isLoading, 
          isError 
  } = api.reports.getAllReports.useQuery();
  
	if (isLoading) return <div>Loading reports 🔄</div>
	if (isError)   return <div>Error fetching reports ❌</div>
  console.log(reports)

  return (
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
  )
}

export default UserReports