import { useMemo } from "react"


const Status = ({  value }: any) => {
  const className = useMemo((): string => {
    let base = "inline-flex rounded-lg bg-opacity-10 py-1 px-3 text-sm font-medium ";

    if (value === "Approved") {
      base += "bg-success text-success";
    } else if (value === "Rejected") {
      base += "bg-danger text-danger";
    } else {
      base += "bg-warning text-warning";
    }

    return base;
  }, [value])

  return (
    <p className={className}>{value}</p>
  )
}

export default Status
