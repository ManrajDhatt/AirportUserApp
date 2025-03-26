import MainData from "@/app/component/StoreData/MainData"

export default function StorePage({
	params,
}: {
	params: { storeId: string }
}) {
	return (
		<div className="p-10">
			<h1 className="text-2xl font-bold">Store Details</h1>
			<MainData /> {/* Pass storeId to MainData */}
		</div>
	)
}
