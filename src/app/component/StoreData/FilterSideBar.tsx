"use client"
import React, { useState } from "react"

export default function FilterSideBar() {
	const [value, setValue] = useState<number>(5000)
	const [min, setMin] = useState<number>(5000)
	const [max, setMax] = useState<number>(5000)
	return (
		<div>
			<div className="text-white max-w-72 p-2 space-y-4">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold border-b border-gray-500 pb-5">
						Filter Products
					</h2>
					<h2 className="pt-5 pb-2">By Price</h2>
					<div className="flex items-center gap-3">
						<div className="flex flex-col">
							<p>Min</p>
							<input
								className="bg-transparent border-2 h-10 border-gray-400 rounded-lg w-[120px] pl-2"
								type="text"
								placeholder="10"
								onChange={(e) => setMin(Number(e.target.value))}
								min={10}
							/>
						</div>
						<div className="flex flex-col">
							<p>Max</p>
							<input
								className="bg-transparent border-2 h-10 border-gray-400 rounded-lg w-[120px] pl-2"
								type="text"
								placeholder="5000"
								max={5000}
								onChange={(e) => setMax(Number(e.target.value))}
							/>
						</div>
					</div>
					<input
						type="range"
						min={0}
						max={5000}
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
						className="w-full py-5"
					/>
					<div className="text-center text-2xl text-green-600">
						${value}
					</div>
					<div className="flex flex-col gap-3 py-5">
						<p>By Categories</p>
						<div className="flex items-center gap-3 justify-around">
							<p className="bg-gray-500 rounded-full px-3 py-1">
								Smartphones
							</p>
							<p className="bg-gray-500 rounded-full px-3 py-1">
								Computers
							</p>
						</div>
						<div className="flex items-center gap-3 justify-around">
							<p className="bg-gray-500 rounded-full px-3 py-1">
								Headphones
							</p>
							<p className="bg-gray-500 rounded-full px-3 py-1">
								Watches
							</p>
						</div>
					</div>
				</div>
				<button className="border-2 border-gray-500 px-3 py-2 w-full rounded-lg">
					Clear Filter
				</button>
			</div>
		</div>
	)
}
