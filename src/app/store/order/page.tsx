"use client";

import React from "react"

export default function page() {
	return (
		<div className="custom-bg py-10 px-8 md:px-20 mt-10">
			<div>
				<h3 className="text-white font-bold text-3xl md:text-5xl">
					Featured Products
				</h3>
				<p className="border-b text-white py-2 px-2">
					Please fill out the address form if you haven't saved it
				</p>
			</div>
			<div className="grid lg:grid-cols-2 mt-8">
				{/* Shipping Address Form */}
				<div className="flex flex-col w-full lg:w-[95%]">
					<form
						action=""
						className="custom-form-color text-white p-6 rounded-lg shadow-lg"
					>
						<h3 className="text-xl font-semibold mb-6">
							Shipping Address
						</h3>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
							<div>
								<label htmlFor="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
							<div>
								<label htmlFor="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
						</div>
						<div className="mb-4">
							<label htmlFor="address">Address</label>
							<input
								type="text"
								id="address"
								className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
							/>
						</div>
						{/* Add any other sections of the form */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
							<div>
								<label htmlFor="phone">Phone</label>
								<input
									type="text"
									id="city"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
							<div>
								<label htmlFor="city">City</label>
								<input
									type="text"
									id="postalCode"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
							<div>
								<label htmlFor="zipCode">ZIP Code</label>
								<input
									type="text"
									id="city"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
							<div>
								<label htmlFor="country">Country</label>
								<input
									type="text"
									id="postalCode"
									className="w-full mt-2 px-3 py-2 rounded-md bg-black text-white"
								/>
							</div>
						</div>
						<button className="bg-white text-black px-5 py-2 rounded-lg hover:opacity-55">
							Save
						</button>
					</form>
				</div>

				{/* Order Summary */}
				<div className="flex-grow p-6 h-[450px] text-white custom-form-color rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold mb-4">Order Items</h2>
					<div className="flex flex-col gap-5">
						<h3 className="text-xl font-semibold mb-2">
							Order Summary
						</h3>
						<div className="flex justify-between items-center text-lg">
							<p>SubTotal</p>
							<p>$20.56</p>
						</div>
						<div className="flex justify-between items-center text-lg">
							<p>Shipping</p>
							<p>$5.00</p>
						</div>
						<div className="flex justify-between items-center text-lg">
							<p>Tax</p>
							<p>$1.56</p>
						</div>
						<div className="flex justify-between items-center text-lg font-bold mt-4">
							<p>Total</p>
							<p>$27.12</p>
						</div>
						<button className="mt-6 px-6 py-2 w-36 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
							Place Order
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
