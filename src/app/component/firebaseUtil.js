import { db } from "../lib/firebase"
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	where,
} from "firebase/firestore"

// Function to fetch all stores from Firestore
export const fetchStores = async () => {
	try {
		const storesCollection = collection(db, "stores")
		const storesSnapshot = await getDocs(storesCollection)
		const storesList = storesSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))

		return storesList
	} catch (error) {
		console.error("Error fetching stores:", error)
		return []
	}
}

export const getCategoriesForStore = async (storeID) => {
	try {
		console.log("Fetching categories for store:", storeID) // Debugging

		if (!storeID) throw new Error("storeID is undefined")

		const categoriesRef = collection(
			db,
			`stores/${storeID}/categories`
		) // Access subcollection
		const querySnapshot = await getDocs(categoriesRef)

		let categories = []
		querySnapshot.forEach((doc) => {
			categories.push({ id: doc.id, ...doc.data() })
		})

		console.log("Fetched categories:", categories) // Debug fetched data

		if (categories.length === 0)
			throw new Error("No categories found for this store")

		return categories
	} catch (error) {
		console.error("Error fetching categories:", error)
		throw error
	}
}

// Function to fetch all products for a specific category in a specific store
export const getProductsForCategory = async (storeID, categoryID) => {
	const productsRef = collection(
		db,
		`stores/${storeID}/categories/${categoryID}/products`
	)

	// No need to filter by catalogueCategoryId, just fetch all products in this category
	const querySnapshot = await getDocs(productsRef)

	let products = []

	querySnapshot.forEach((doc) => {
		products.push({ id: doc.id, ...doc.data() })
	})

	return products
}
export const getProductDetails = async (productId, categoryId) => {
	const productRef = doc(
		db,
		"stores",
		"storeId",
		"categories",
		categoryId,
		"products",
		productId
	)
	const docSnap = await getDoc(productRef)

	if (docSnap.exists()) {
		return docSnap.data() // Return the product details
	} else {
		throw new Error("Product not found")
	}
}
export const getProductById = async (
	storeID,
	categoryID,
	productId
) => {
	try {
		// Fetch the product document from Firestore
		const productRef = doc(
			db,
			`stores/${storeID}/categories/${categoryID}/products`,
			productId
		)
		const docSnap = await getDoc(productRef)

		if (!docSnap.exists()) {
			throw new Error("Product not found")
		}
		const productData = docSnap.data()
		// Return the full product data
		return {
			id: docSnap.id,
			catalogueProductName: docSnap.data().catalogueProductName,
			catalogueCategoryName: docSnap.data().catalogueCategoryName,
			productImageUrl: docSnap.data().productImageUrl,
			productDescription: docSnap.data().productDescription,
			price: docSnap.data().price,
			stock:docSnap.data().stock
			// quantity: productData.quantity || 0,
			// name: productData.name || "Unknown Product",
			// storeName: productData.storeName || "Unknown Store",
			// createdAt: productData.createdAt || null,
			// updatedAt: productData.updatedAt || null,
			// brand: productData.brand || "Unknown Brand",
			// rating: productData.rating || 0,
			// reviews: productData.reviews || [],
		}
	} catch (error) {
		console.error("Error fetching product:", error)
		throw error
	}
}
import { toast } from "react-toastify"
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth"
import { app } from "../lib/firebase"

const auth = getAuth(app)

// Login function
