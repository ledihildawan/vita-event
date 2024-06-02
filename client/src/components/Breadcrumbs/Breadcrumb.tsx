import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  items: {
    _id: string;
    name: string;
    path: string;
    active: boolean;
  }[];
}

const Breadcrumb = ({ items, pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {items.map((item) => (
            <li key={item._id} className={`font-medium ${item.active && 'text-primary'}`}>
              {item.active ? item.name : <Link to={item.path}>{item.name} /</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
