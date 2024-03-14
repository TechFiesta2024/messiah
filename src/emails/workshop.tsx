import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

export default function WorkshopEmail() {
	return (
		<Html>
			<Preview>Business Logic in Frontend</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								black: "#010100",
								red: "#FF002B",
							},
						},
					},
				}}
			>
				<Head />
				<Body className="bg-black text-base font-sans relative antialiased">
					<Container className="bg-black text-white p-45 mt-20">
						<Heading className="text-center my-0 leading-8">
							Thank You for joining
							<br />
							<span className="text-red">Business Logic</span>
							&nbsp;Workshop
						</Heading>

						<Section>
							<Row>
								<Text className="text-base">
								Welcome to our Business Logic in Frontend workshop! We're thrilled to have you join us as we explore the intersection of design thinking, user experience, and frontend development.
								</Text>
							</Row>
						</Section>

						<div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
							<div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
								<div className="w-full max-w-3xl mx-auto mb-20">
									<div className="-my-6">
										<div className="relative pl-8 sm:pl-32 py-6 group">
											<div className="font-medium text-gray-400 mb-1 sm:mb-0">
												08:00 PM - 09:00 PM
											</div>
											<div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
												<time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white bg-red rounded-full">
													30 | March
												</time>
												<div className="text-xl font-bold text-white">
												Design Thinking
												</div>
											</div>
											<div className="text-slate-500">
											Immerse yourself in the principles of design thinking, a human-centered approach to problem-solving that emphasizes empathy, ideation, and iteration.
Learn how to identify user needs, pain points, and opportunities through empathetic observation and analysis.
											</div>
										</div>
										<div className="relative pl-8 sm:pl-32 py-6 group">
											<div className="font-medium text-gray-400 mb-1 sm:mb-0">
												08:00 PM - 09:00 PM
											</div>
											<div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
												<time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white bg-red rounded-full">
													30 | March
												</time>
												<div className="text-xl font-bold text-white">
												Design Synchronization
												</div>
											</div>
											<div className="text-slate-500">
											Explore the importance of branding in frontend development and learn how to create compelling brand identities that resonate with target audiences.
											Understand the importance of synchronizing design decisions with client requirements, design rules, and insights from persona interviews.
											</div>
										</div>
									</div>
								</div>
							</div>
							We encourage you to actively participate, ask questions, and collaborate with your peers to make the most out of this learning experience. By the end of the workshop, you'll be equipped with the knowledge and skills to create user-centric frontend solutions that drive business success.
							<br />
							<br />
							Once again, welcome to the Business Logic in Frontend workshop! We're excited to embark on this journey of creativity and innovation with you.
						</div>
					</Container>

					<Container className="mt-15">
						<Text className="text-center text-gray-400 mb-45">
							Academy of Technology, Grand Trunk Rd, Adisaptagram,
							West Bengal 712502
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
