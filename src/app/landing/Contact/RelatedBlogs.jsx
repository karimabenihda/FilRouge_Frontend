import React from "react";

function RelatedBlogs() {
  const blogs = [
    {
      title: "How We Transformed a Small Living Room",
      desc: "Discover how modern furniture and smart layouts can completely change a compact space.",
      image: "/images/blog/living-room.jpg",
    },
    {
      title: "Kitchen Makeover: From Basic to Beautiful",
      desc: "A minimalist kitchen redesign using elegant wood and neutral tones.",
      image: "/images/blog/kitchen.jpg",
    },
    {
      title: "Bedroom Comfort Starts With the Right Furniture",
      desc: "Learn how choosing the right bed and lighting improves sleep and style.",
      image: "/images/blog/bedroom.jpg",
    },
  ];

  return (
    <div className="mt-32">
      <div className="text-center mb-12">
        <p className="text-xs text-indigo-600 font-medium">
          Inspiration
        </p>
        <h2 className="text-3xl font-semibold text-slate-800">
          Stories From Our Clients
        </h2>
        <p className="text-gray-500 mt-2">
          Real transformations using our furniture collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-slate-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {blog.desc}
              </p>
              <span className="text-indigo-600 text-sm font-medium">
                Read more →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RelatedBlogs;