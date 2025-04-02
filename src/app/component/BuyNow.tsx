"use client"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { doc, collection, writeBatch, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/app/lib/firebase"
import { useStore } from "@/app/context/StoreContext";

interface BuyNowButtonProps {
  product: {
    id: string
    catalogueProductName: string
    price: string
    productImageUrl: string
  }
  storeId: string
  quantity: number
  disabled?: boolean
}

export default function BuyNowButton({ product, storeId, quantity, disabled }: BuyNowButtonProps) {
  const router = useRouter()
  const { setShowLoginModal } = useStore()

  const handleBuyNow = async () => {
    const user = auth.currentUser

    if (!user?.uid) {
      sessionStorage.setItem("redirectAfterLogin", "/order_history")
      setShowLoginModal(true)
      return
    }

    if (!product) {
      toast.error("No product details available.")
      return
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const { latitude, longitude } = position.coords

      const batch = writeBatch(db)

      const orderRef = doc(collection(db, "Orders"))
      batch.set(orderRef, {
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: "pending",
        location: { latitude, longitude },
        storeStatuses: { [storeId]: "pending" },
      })

      const storeOrderRef = doc(collection(db, "Orders", orderRef.id, "StoreOrders"))
      batch.set(storeOrderRef, {
        storeId: storeId,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      const productRef = doc(db, "Orders", orderRef.id, "StoreOrders", storeOrderRef.id, "products", product.id)
      batch.set(productRef, {
        id: product.id,
        name: product.catalogueProductName,
        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
        quantity: quantity,
        productImageUrl: product.productImageUrl,
        storeId: storeId,
      })

      await batch.commit()

      toast.success("Order placed successfully!", { autoClose: 500 })
      setTimeout(() => {
        router.push("/order_history")
      }, 1000)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    }
  }

  return (
    <button
      className={bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all ${disabled ? "opacity-50 cursor-not-allowed" : ""}}
      onClick={handleBuyNow}
      disabled={disabled}
    >
      Buy Now
    </button>
  )
}