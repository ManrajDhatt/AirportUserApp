import React from "react"
import { MoveRight } from "lucide-react"

export default function Banner() {
	return (
		<div className="bg-gradient-to-r from-[#f6f6f6] to-[#e9e9e9] py-10">
			<div className="flex flex-col lg:flex-row justify-around items-center px-10">
				<div className="flex flex-col gap-3 text-gray-900 justify-center items-center lg:items-start">
					<h2 className="font-extrabold text-4xl lg:text-6xl">Discover the Latest</h2>
					<h2 className="font-extrabold text-4xl lg:text-6xl">Gadgets</h2>
					<h2 className="font-extrabold text-4xl lg:text-6xl">With Exciting Deals</h2>
					<p className="text-lg text-gray-700 text-center lg:text-left">
						Explore a wide range of electronics at unbeatable prices
					</p>
					<div className="flex gap-3 py-3 items-center justify-center lg:justify-start rounded-full px-5 bg-[#ff9800] text-white text-lg mt-5 shadow-md hover:bg-[#e68900] transition duration-300">
						<MoveRight />
						<button className="font-semibold">Shop Now</button>
					</div>
				</div>
				<img
					src="/images/headphone_main.png"
					alt="Headphones"
					height={400}
					width={400}
					className="max-w-xs lg:max-w-md drop-shadow-lg"
				/>
			</div>
		</div>
	)
}