import Link from "next/link";

const JSPBreadcrumb = ({ items }) => {
  return (
    <nav className="text-lg text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, idx) => (
          <li key={idx}>
            {idx > 0 && <span>/ </span>}
            {item.href ? (
              <Link href={item.href} className="text-blue-600">{item.label}</Link>
            ) : (
              <span className="text-gray-700 font-bold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default JSPBreadcrumb;