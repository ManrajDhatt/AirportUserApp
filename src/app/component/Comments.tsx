import React from "react"

export default function Comments() {
	return (
		<div className="py-10 px-10">
			<a
				href="#"
				className="block max-w-sm p-6 bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
			>
				<p className="font-medium text-gray-700 dark:text-gray-300">
					Here are the biggest enterprise technology acquisitions of
					2021 so far, in reverse chronological order.
				</p>
				<div className="flex items-center gap-4 mt-4 text-gray-900 dark:text-white">
					<img
						src="/images/comment_user.jpg"
						className="rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm"
						width={50}
						height={50}
						alt="User Avatar"
					/>
					<div className="flex flex-col justify-start text-sm">
						<p className="font-bold text-lg">John Doe</p>
						<p className="text-gray-500 dark:text-gray-400">
							CEO, Company Inc.
						</p>
					</div>
				</div>
			</a>
		</div>
	)
}
