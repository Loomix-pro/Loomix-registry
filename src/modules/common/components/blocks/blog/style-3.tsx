import React from "react"

export default function Style3({ title, subtitle, posts }: BlogBlockProps) {
  return (
    <section className="py-20 bg-rose-50 w-full overflow-hidden">
      <div className="content-container">
        <div
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
          dir="rtl"
        >
          <h2 className="text-4xl font-black text-rose-900">
            {title ?? "استایل ویژه شماره ۳"}
          </h2>
          <p className="text-rose-700">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-4" dir="rtl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-between"
            >
              <h3 className="text-lg font-bold text-rose-900">{post.title}</h3>
              <span className="text-xs text-rose-500 bg-rose-100 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
