
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    timeout: 30000,
    maxRetries: 1
});

const tanyaGroq = async ({ instruksi, riwayat, pesan }) => {
    const messages = [
        {
            role: 'system',
            content: instruksi
        },

        ...riwayat
            .filter(item =>
                ['user', 'model', 'assistant'].includes(item.role) &&
                typeof item.teks === 'string'
            )
            .map(item => ({
                role: item.role === 'model' ? 'assistant' : item.role,
                content: item.teks.slice(0, 2000)
            })),

        {
            role: 'user',
            content: pesan
        }
    ];

    const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.4,
        max_completion_tokens: 300
    });

    return response.choices[0]?.message?.content?.trim() || '';
};

module.exports = { tanyaGroq };
