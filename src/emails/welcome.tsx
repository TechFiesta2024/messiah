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
	Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface NetlifyWelcomeEmailProps {
	steps?: {
		id: number;
		Description: React.ReactNode;
	}[];
	links?: string[];
}

const PropDefaults: NetlifyWelcomeEmailProps = {
	steps: [
		{
			id: 1,
			Description: (
				<li className="mb-20" key={1}>
					<strong>What to Expect:</strong> Techfiesta24 promises to be
					a day packed with innovation, learning, and networking.
					Whether you're a seasoned tech enthusiast or just starting
					your journey, our event has something for everyone. Engage
					with industry experts, participate in hands-on workshops,
					and explore the latest in technology trends.{" "}
				</li>
			),
		},
		{
			id: 2,
			Description: (
				<li className="mb-20" key={2}>
					<strong>Connect with Us:</strong> Stay connected with us on
					social media to receive real-time updates, sneak peeks, and
					exclusive content leading up to the event. Follow us on
					[Social Media Handles] to join the conversation and connect
					with fellow participants.{" "}
				</li>
			),
		},
		{
			id: 4,
			Description: (
				<li className="mb-20" key={4}>
					<strong>Any Questions?</strong> If you have any questions or
					require additional information, feel free to reach out to
					our dedicated support team at{" "}
					<Link>contact@aotfiesta24.tech</Link>.{" "}
				</li>
			),
		},
	],
};

export const NetlifyWelcomeEmail = ({
	steps = PropDefaults.steps,
	links = PropDefaults.links,
}: NetlifyWelcomeEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Welcome To Techfiesta24</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								black: "#010100",
								red: "#FF002B",
								redfaded: "#DD6D71",
								yellowish: "#FEFAE0",
								white: "#FFFFFF",
								grey: "#ACACAC",
								yellowish28: "rgba(254,250,224,28%)",
							},
							spacing: {
								0: "0px",
								20: "20px",
								45: "45px",
							},
						},
					},
				}}
			>
				<Body className="bg-black text-base font-sans">
					<Img
						src="https://storage-techfiesta24.blr1.cdn.digitaloceanspaces.com/logo_main.png"
						width="200"
						height="200"
						alt="Techfiesta24"
						className="mx-auto my-20"
					/>
					<Container className="bg-black text-white p-45">
						<Heading className="text-center my-0 leading-8">
							Welcome&nbsp; to &nbsp;
							<span className="text-red">Techfiesta24</span>
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

						<ul>{steps?.map(({ Description }) => Description)}</ul>

						<Section className="text-center">
							<Button className="bg-white text-black rounded-lg py-3 px-[18px]">
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
};

export const welcome = render(<NetlifyWelcomeEmail />);
