import Head from 'next/head';
import Navbar from '../../components/Layout/Navbar';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const AddReport = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

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

      <main className="h-screen bg-black text-white">
        <div className="flex place-content-center h-screen">
          <form>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Report Title"
                value={formData.title}
                
              />
              <textarea
                name="content"
                placeholder="Report Content"
                value={formData.content}
              ></textarea>
              {/* Add other fields as needed */}
              <button type="submit">Create Report</button>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
};

export default AddReport;
