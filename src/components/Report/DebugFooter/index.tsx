import React from "react";

import type { IsoReportWithPostsFromDb } from "~/types";

interface ReportDetailsProps {
  report: IsoReportWithPostsFromDb; // Replace 'Report' with the actual type of your report
}

const ReportDebugFooter: React.FC<ReportDetailsProps> = ({
  report,
}) => {
  return (
    <>
      <h1>from DB</h1>
      <h2>Title: {report.title}</h2>
      <p>Created {report.createdAt}</p>
      <p>{report.description}</p>
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(report, null, 4)}</pre>
    </>
  );
};

export default ReportDebugFooter;
