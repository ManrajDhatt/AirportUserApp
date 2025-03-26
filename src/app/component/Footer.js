import React from "react";

export default function Footer() {
	return (
		<footer className="bg-[#F8F9FA] text-black pt-10">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0">
						<a href="/" className="flex items-center">
							<img
								 src="/images/airport_images/Untitled design.png" className="h-24 w-auto me-3" alt="Brand Logo" />

							
							<span className="self-center text-2xl font-semibold whitespace-nowrap">
								Flyair
							</span>
						</a>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
						<div>
							<h2 className="mb-6 text-sm font-semibold uppercase text-black">Resources</h2>
							<ul className="text-black font-medium">
								<li className="mb-4">
									<a href="#" className="hover:underline">Blog</a>
								</li>
								<li>
									<a href="#" className="hover:underline">Support</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-6 text-sm font-semibold uppercase text-black">Follow us</h2>
							<ul className="text-black font-medium">
								<li className="mb-4">
									<a href="#" className="hover:underline">GitHub</a>
								</li>
								<li>
									<a href="#" className="hover:underline">Twitter</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-6 text-sm font-semibold uppercase text-black">Legal</h2>
							<ul className="text-black font-medium">
								<li className="mb-4">
									<a href="#" className="hover:underline">Privacy Policy</a>
								</li>
								<li>
									<a href="#" className="hover:underline">Terms & Conditions</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-black" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<span className="text-sm text-black">
						© {new Date().getFullYear()} MyBrand. All Rights Reserved.
					</span>
					<div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
						<a href="#" className="text-black hover:text-gray-700">Facebook</a>
						<a href="#" className="text-black hover:text-gray-700">Instagram</a>
						<a href="#" className="text-black hover:text-gray-700">LinkedIn</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
