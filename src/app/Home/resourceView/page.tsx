import { Suspense } from "react";
import ResourceViewer from "./resourceViewer";

export default function Page(){
    return(
        <Suspense fallback={<div className="flex h-screen w-full bg-white flex-col items-center justify-center">
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  <p className="mt-2 text-gray-500">Loading video...</p>
</div>}>
            <ResourceViewer />
        </Suspense>
    )
}