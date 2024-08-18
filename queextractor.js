const fs = require("fs");
const axios = require("axios");
const TurndownService = require("turndown");
const hljs = require("highlight.js/lib/core");
const cpp = require("highlight.js/lib/languages/cpp");
hljs.registerLanguage("cpp", cpp);

const QUESTIONS_URL =
	"https://raw.githubusercontent.com/mauriziomarini/linkedin-skill-assessments-quizzes-1/master/c%2B%2B/c%2B%2Bquiz.md";
const QUESTIONS_PATH = "src/assets/questions.json";

// Ensure that the questions.json file exists
if (!fs.existsSync(QUESTIONS_PATH)) {
	fs.writeFileSync(QUESTIONS_PATH, JSON.stringify({ data: [] }, null, 2));
}

const CACHED_QUESTIONS_RAW = fs.readFileSync(QUESTIONS_PATH);
const CACHED_QUESTIONS = JSON.parse(CACHED_QUESTIONS_RAW);

(async () => {
	try {
		const response = await axios.get(QUESTIONS_URL);
		const markdownContent = response.data;

		console.log("Markdown content fetched:", markdownContent.slice(0, 500)); // Log the first 500 characters

		const questions = parseQuestions(markdownContent);

		console.log("Parsed questions:", questions);

		saveQuestions(questions);
	} catch (err) {
		console.error("An error occurred:", err);
	}
})();

function parseQuestions(markdown) {
	const questionBlocks = markdown.split("\n\n#### Q");
	console.log("Question blocks found:", questionBlocks.length);

	const questions = questionBlocks.slice(1).map((block, index) => {
		const [questionText, ...rest] = block.split("\n\n");
		const codeBlock = rest.find((line) => line.startsWith("```cpp"));
		const answerChoices = rest.filter((line) => line.startsWith("- ["));

		console.log(`Question ${index + 1} text:`, questionText);
		console.log(`Question ${index + 1} code block:`, codeBlock);
		console.log(`Question ${index + 1} answer choices:`, answerChoices);

		const correctAnswer = answerChoices
			.find((choice) => choice.includes("[x]"))
			?.replace(/- \[x\] /, "")
			.trim();

		const parsedChoices = answerChoices.map((choice) => {
			return choice.replace(/- \[[x ]\] /, "").trim();
		});

		return {
			id: index + 1,
			title: `Q${index + 1}. ${questionText.trim()}`,
			code: codeBlock
				? codeBlock.replace(/```cpp|```/g, "").trim()
				: null,
			choices: parsedChoices,
			answer: correctAnswer || "", // Use correct answer if found, otherwise empty string
		};
	});

	return questions;
}

function saveQuestions(data) {
	const turndownService = new TurndownService();
	const questions = {
		updatedAt: new Date(),
		data: data.map((data) => {
			data.code = data.code
				? hljs.highlight(data.code, { language: "cpp" }).value
				: null;
			data.answer = turndownService.turndown(data.answer);
			data.choices = data.choices.map((choice) =>
				turndownService.turndown(choice)
			);
			return data;
		}),
	};

	if (
		JSON.stringify(CACHED_QUESTIONS.data) !== JSON.stringify(questions.data)
	) {
		fs.writeFile(
			QUESTIONS_PATH,
			JSON.stringify(questions, null, 2),
			(err) => {
				if (err) throw err;
				console.log("The updated questions.json file has been saved.");
			}
		);
	} else {
		console.log("Nothing to update.");
	}
}