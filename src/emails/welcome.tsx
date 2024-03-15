import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

export default function WelcomeEmail() {
	return (
		<Html>
			<Head />
			<Preview>Welcome To TechFiesta24🎉</Preview>
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
				<Body className="bg-black text-base font-sans">
					<Img
						src="https://storage-techfiesta24.blr1.cdn.digitaloceanspaces.com/logo_main.png"
						width="150"
						height="150"
						alt="TechFiesta24"
						className="mx-auto"
					/>
					<Container className="bg-black text-white p-45">
						<Heading className="text-center my-0 leading-8">
							Welcome&nbsp; to &nbsp;
							<span className="text-red">Techfiesta24</span>
							<br />
							&amp; Humatronics
						</Heading>

						<Section>
							<Row>
								<Text className="text-base">
									Congratulations on successfully registering
									for our much-anticipated event. We are
									thrilled to have you on board and look
									forward to an incredible Techfiesta
									experience together.
								</Text>
							</Row>
						</Section>

						<ul>
							<li>
								<strong>What to Expect From TechFiesta:</strong>{" "}
								Techfiesta24 promises to be a day packed with
								innovation, learning, and networking. Whether
								you're a seasoned tech enthusiast or just
								starting your journey, our event has something
								for everyone.
							</li>
							<li>
								<strong>
									What to Expect From Humatronics:
								</strong>
								Showcase your diverse talents in extempore
								speaking, painting, math problem-solving, and
								science exhibitions. From spontaneous speeches
								to intricate artworks, from complex
								problem-solving to groudbreaking scientific
								displays. Humatronics celebrates brilliance
								across multiple disciplines, fostering a culture
								of exploration and discovery
							</li>
							<li>
								<strong>Connect with Us:</strong> Stay connected
								with us on social media to receive real-time
								updates, sneak peeks, and exclusive content
								leading up to the event. Follow us on [Social
								Media Handles] to join the conversation and
							</li>
							<li>
								<strong>Any Questions?</strong> If you have any
								questions or require additional information,
								feel free to reach out to our dedicated support
								team at{" "}
								<Link href="mailto:contact@aotfiesta24.tech">
									contact@aotfiesta24.tech
								</Link>
								.
							</li>
						</ul>
						<Section className="text-center mt-20">
							<Button
								href="https://arrakis-techfiesta.vercel.app/dashboard"
								className="bg-white text-black rounded-lg py-3 px-[18px]"
							>
								Go to your dashboard
							</Button>
						</Section>
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
