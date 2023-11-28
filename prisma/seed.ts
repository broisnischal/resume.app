import { prisma } from "~/utils/db.server";

async function seed() {
	console.log("Seeding database");

	await prisma.programmingLanguages.deleteMany();
	await prisma.softSkills.deleteMany();

	const softskills = [
		"Communication",
		"Team Collaboration",
		"Problem Solving",
		"Time Management",
		"Adaptability",
		"Critical Thinking",
		"Creativity",
		"Leadership",
		"Emotional Intelligence",
		"Active Listening",
		"Conflict Resolution",
		"Decision Making",
	];

	const programminglanguages = [
		"TypeScript",
		"JavaScript",
		"HTML",
		"CSS",
		"React",
		"Next.js",
		"Astro",
		"Node.js",
		"Flutter",
		"C#",
		"Python",
		"Java",
	];

	const transactionpromises = programminglanguages.map((language) =>
		prisma.programmingLanguages.create({
			data: {
				name: language,
				slug: language.toLowerCase().replace(" ", ""),
			},
		}),
	);

	await prisma.$transaction(transactionpromises);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Seeding complete! ");
		await prisma.$disconnect();
	});
