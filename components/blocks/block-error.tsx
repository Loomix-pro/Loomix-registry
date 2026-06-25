import React from "react"

interface BlockErrorProps {
  error?: any
  formattedStyle?: string
  blockName?: string
}

export default function BlockError({
  error,
  formattedStyle = "نامشخص",
  blockName = "کامپوننت",
}: BlockErrorProps) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NEXT_PUBLIC_SHOW_CMS_ERRORS !== "true"
  ) {
    return null
  }

  return (
    <div
      className="bg-red-50 border border-red-300 p-8 rounded-2xl my-8 mx-auto max-w-5xl text-right shadow-sm"
      dir="rtl"
    >
      <div className="flex items-center gap-3 mb-4 border-b border-red-200 pb-4">
        <span className="text-3xl" role="img" aria-label="warning">
          ⚠️
        </span>
        <h3 className="text-red-900 font-bold text-xl">
          خطا در بارگذاری {blockName}:{" "}
          <span className="font-mono text-red-600 bg-red-100 px-2 py-1 rounded">
            {formattedStyle}
          </span>
        </h3>
      </div>
      <p className="text-red-800 text-sm mb-4 leading-relaxed">
        این پیام فقط در <strong>حالت پیش‌نمایش (Preview)</strong> یا{" "}
        <strong>محیط توسعه (Development)</strong> نمایش داده می‌شود.
        <br />
        دلیل خطا معمولاً یکی از موارد زیر است:
      </p>
      <ul className="list-disc list-inside text-red-700 text-sm mb-6 space-y-1">
        <li>فایلی با این نام هنوز از طریق Webhook سینک نشده است.</li>
        <li>خطای کدنویسی (Syntax Error) در فایل کامپوننت وجود دارد.</li>
        <li>کامپوننت به فایل دیگری نیاز دارد که روی سرور وجود ندارد.</li>
      </ul>
      {error && (
        <div
          className="bg-white p-4 rounded-xl text-left text-xs text-red-900 overflow-x-auto border border-red-100 shadow-inner font-mono"
          dir="ltr"
        >
          {error.stack || error.message || String(error)}
        </div>
      )}
    </div>
  )
}
