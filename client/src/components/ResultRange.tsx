const ResultRange = ({ data }: any) => {
  const adjustedEndIdx = Math.min(data?.page * data?.limit, data?.totalDocs);
  const adjustedStartIdx = Math.min(data?.pagingCounter, data?.totalDocs);

  return <div className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{adjustedStartIdx} to {adjustedEndIdx}</span> of <span className="font-semibold text-gray-900 dark:text-white">{data?.totalDocs}</span> results</div>;
}

export default ResultRange;
