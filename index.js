const OpenAI = require("openai");
const fs = require('node:fs/promises');

require('dotenv').config()

const openai = new OpenAI();

const askGPT = async (word) => {
	return openai.chat.completions.create({
		messages: [
			{ "role": "system", "content": "You will be given a spanish verb in unconjugated form." },
			{ "role": "system", "content": "Take the verb given and create a csv file that gives sentences using the verb in a conjugated form. The first column in the csv will be the spanish sentence, the second column will be the english translation, the third column will list the verb tense, the fourth column should be the verb in unconjugated form." },
			{ "role": "system", "content": "You must include at least 2 usages of the following verb tenses: indicative present, imperative, subjunctive present, preterite, indicative perfect, future, indicative imperfect, conditional, and imperfect subjunctive." },
			{ "role": "system", "content": "Please also include some sentences that use the progressive and perfect tenses as you see fit or any common uses in spanish." },
			{ "role": "system", "content": "Please make the sentences fun and things that someone might use in typical everyday conversation, feel free to include words that could help to build my vocabulary as well." },
			{ "role": "system", "content": "Please make sure there are at minimum 35 sentences, you can include additional verb conjugations as necessary." },
			{ "role": "system", "content": "Please format it as a CSV file so that I can just take the response and save it to a file." },
			{ "role": "user", "content": word }
		],
		model: "gpt-4-turbo-2024-04-09",
	});
}

const writeToFile = async (fileName, text) => {
	try {
		await fs.appendFile(fileName, text);
	} catch (err) {
		console.log(err);
	}
}

// words selected from the KOFI method of learning spanish conjugations
// https://www.asiteaboutnothing.net/w_ultimate_spanish_conjugation.php
const words = ["Ser","Haber","Estar","Hablar","Deber","Vivir","Tener","Decir","Hacer","Poder","Ir","Dar","Ver","Saber","Querer","Creer","Poner","Parecer","Seguir","Pensar","Venir","Encontrar","Salir","Volver","Sentir","Producir","Buscar","Oír","Entender","Morir","Caer","Jugar","Elegir","Traer","Andar","Incluir","Valer","Reunir","Actuar","Caber","Enviar","Adquirir","Coger","Sonreír","Prohibir","Oler","Asir","Lucir","Aislar","Adecuar","Averiguar","Bendecir","Complacer","Pudrir","Predecir","Yacer","Erguir","Aunar","Rehusar","Errar","Engullir","Discernir","Gruñir","Endeudarse","Delinquir","Argüir","Reñir","Corroer","Tañer","Prohijar","Raer","Europeizar"]

words.forEach(word => {
	askGPT(word).then(stuff => {
		console.log(stuff)
		writeToFile(`flashcards.csv`, stuff.choices[0].message.content)
		console.log(`wrote flashcards for word ${word}`)
	})
});