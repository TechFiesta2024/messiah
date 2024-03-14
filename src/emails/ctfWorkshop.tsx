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
import { render } from "@react-email/render";
import * as React from "react";

function WorkshopCTF() {
	return (
		<Html>
			<Preview>Capture The Flag Workshop</Preview>
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
							<span className="text-red">Capture The Flag</span>
							&nbsp;Workshop
						</Heading>

						<Section>
							<Row>
								<Text className="text-base">
									TODO Content Congratulations! We are
									thrilled to inform you that your
									registration for the Hardware Workshop has
									been successfully processed. Welcome to an
									exciting journey of hands-on learning andk
									exploration in the world of hardware and
									embedded systems.
								</Text>
							</Row>
						</Section>

						<div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
							<div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
								<div className="w-full max-w-3xl mx-auto">
									<div className="-my-6">
										<div className="relative pl-8 sm:pl-32 py-6 group">
											<div className="font-medium text-gray-400 mb-1 sm:mb-0">
												10:00 PM - 11:00 PM
											</div>
											<div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
												<time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white bg-red rounded-full">
													18 | March
												</time>
												<div className="text-xl font-bold text-white">
													Into to Workshop
												</div>
											</div>
											<div className="text-slate-500">
												Pretium lectus quam id leo. Urna
												et pharetra pharetra massa
												massa. Adipiscing enim eu neque
												aliquam vestibulum morbi blandit
												cursus risus.
											</div>
										</div>
									</div>
									<div className="relative pl-8 sm:pl-32 py-6 group">
										<div className="font-medium text-gray-400 mb-1 sm:mb-0">
											The origin
										</div>
										<div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
											<time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white bg-red rounded-full">
												19 | March
											</time>
											<div className="text-xl font-bold text-white">
												Acme was founded in Milan, Italy
											</div>
										</div>
										<div className="text-slate-500">
											Pretium lectus quam id leo. Urna et
											pharetra pharetra massa massa.
											Adipiscing enim eu neque aliquam
											vestibulum morbi blandit cursus
											risus.
										</div>
									</div>
									<div className="relative pl-8 sm:pl-32 py-6 group">
										<div className="font-medium text-gray-400 mb-1 sm:mb-0">
											The origin
										</div>
										<div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-red after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
											<time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white bg-red rounded-full">
												20 | March
											</time>
											<div className="text-xl font-bold text-white">
												Acme was founded in Milan, Italy
											</div>
										</div>
										<div className="text-slate-500">
											Pretium lectus quam id leo. Urna et
											pharetra pharetra massa massa.
											Adipiscing enim eu neque aliquam
											vestibulum morbi blandit cursus
											risus.
										</div>
									</div>
								</div>
							</div>
						</div>
					</Container>

					<Container className="mt-20">
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

export const workshopCTFHTML = render(<WorkshopCTF />, {
	pretty: true,
});
