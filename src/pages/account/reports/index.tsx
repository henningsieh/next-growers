import { api } from "~/utils/api";
import toast from "react-hot-toast";

const UserReports = () => {


  const { data: reports, 
          isLoading, 
          isError 
  } = api.reports.getAllReports.useQuery();

	if (isLoading) return <div>Loading todos 🔄</div>
	if (isError)   return <div>Error fetching todos ❌</div>



  return (
    <div>{void console.log(reports)}</div>
  )
}

export default UserReports