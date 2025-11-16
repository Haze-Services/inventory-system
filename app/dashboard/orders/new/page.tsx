import { Suspense } from "react"
import NewOrderPage from "./NewOrderForm"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewOrderPage />
    </Suspense>
  )
}
