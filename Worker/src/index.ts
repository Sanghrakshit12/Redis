import { createClient } from "redis";
const client = createClient()


async function processSubmission(submission:string) {
    const { problemId, code, language } = JSON.parse(submission)
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);
    await new Promise((x) => setTimeout(x, 3000))
    console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
    try {
        await client.connect();
        console.log("Redis Client Connected to Worker")
        while (true) {
            const submission = await client.brPop("Submission", 0)
            
            console.log(submission)
            // @ts-ignore
            await processSubmission(submission.element);
        }
    }
    catch (e) {
        console.log("Error Processing Submission", e)
    }
}

startWorker()




