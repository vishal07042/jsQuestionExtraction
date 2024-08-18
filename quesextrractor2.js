














// const axios = require('axios');
// const fs = require('fs');

// // URL of the quiz file
// const url = 'https://raw.githubusercontent.com/Ebazhanov/linkedin-skill-assessments-quizzes/main/c%2B%2B/c%2B%2B-quiz.md';

// // Function to fetch the content from the URL
// async function fetchQuizContent() {
//     try {
//         const response = await axios.get(url);
//         console.log('Content fetched successfully!');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching quiz content:', error);
//     }
// }

// // Function to parse the content and extract questions with their correct answers
// function extractQuestionsWithCorrectAnswers(content) {
//     const lines = content.split('\n');
//     let questions = [];
//     let currentQuestion = '';
//     let correctAnswers = [];

//     lines.forEach(line => {
//         if (line.trim().startsWith('#### Q')) {
//             if (currentQuestion !== '') {
//                 questions.push({
//                     question: currentQuestion,
//                     answers: correctAnswers
//                 });
//             }
//             currentQuestion = line.trim();
//             correctAnswers = [];
//         } else if (line.trim().startsWith('- [x]')) {
//             correctAnswers.push(line.replace('- [x]', '').trim());
//         }
//     });

//     if (currentQuestion !== '') {
//         questions.push({
//             question: currentQuestion,
//             answers: correctAnswers
//         });
//     }

//     console.log(`Extracted ${questions.length} questions.`);
//     return questions;
// }

// // Function to save extracted questions to a file
// function saveQuestionsToFile(questions, fileName) {
//     const data = questions.map((item, index) => {
//         const answers = item.answers.map(ans => `   Correct answer: ${ans}`).join('\n');
//         return `${index + 1}. ${item.question}\n${answers}`;
//     }).join('\n\n');

//     fs.writeFileSync(fileName, data, 'utf8');
//     console.log(`Questions saved to ${fileName}`);
// }

// // Main function to execute the script
// (async function main() {
//     const content = await fetchQuizContent();
//     if (content) {
//         const questions = extractQuestionsWithCorrectAnswers(content);
//         saveQuestionsToFile(questions, 'extracted_questions.txt');
//     }
// })();



const axios = require("axios");
const fs = require("fs");

// URL of the quiz file
const url =
	"https://raw.githubusercontent.com/Ebazhanov/linkedin-skill-assessments-quizzes/main/c%2B%2B/c%2B%2B-quiz.md";

// Function to fetch the content from the URL
async function fetchQuizContent() {
	try {
		const response = await axios.get(url);
		console.log("Content fetched successfully!");
		return response.data;
	} catch (error) {
		console.error("Error fetching quiz content:", error);
	}
}

// Function to parse the content and extract questions with their correct answers
function extractQuestionsWithCorrectAnswers(content) {
	const lines = content.split("\n");
	let questions = [];
	let currentQuestion = "";
	let correctAnswers = [];

	lines.forEach((line) => {
		if (line.trim().startsWith("#### Q")) {
			if (currentQuestion !== "") {
				questions.push({
					question: currentQuestion,
					answers: correctAnswers,
				});
			}
			currentQuestion = line.trim();
			correctAnswers = [];
		} else if (line.trim().startsWith("- [x]")) {
			correctAnswers.push(line.replace("- [x]", "").trim());
		}
	});

	if (currentQuestion !== "") {
		questions.push({
			question: currentQuestion,
			answers: correctAnswers,
		});
	}

	console.log(`Extracted ${questions.length} questions.`);
	return questions;
}

// Function to save extracted questions to a file
function saveQuestionsToFile(questions, fileName) {
	const data = questions
		.map((item, index) => {
			const answers = item.answers
				.map((ans) => `   Correct answer: ${ans}`)
				.join("\n");
			return `${index + 1}. ${item.question}\n${answers}`;
		})
		.join("\n\n");

	fs.writeFileSync(fileName, data, "utf8");
	console.log(`Questions saved to ${fileName}`);
}

// Main function to execute the script
(async function main() {
	const content = await fetchQuizContent();
	if (content) {
		const questions = extractQuestionsWithCorrectAnswers(content);
		saveQuestionsToFile(questions, "extracted_questions.txt");
	}
})();