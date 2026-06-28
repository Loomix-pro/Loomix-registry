import React from "react"

const SkeletonStaticPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-blue-600 dark:text-blue-500">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

export default SkeletonStaticPage
