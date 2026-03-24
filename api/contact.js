import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, interest, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Jméno a email jsou povinné.' });
    }

    try {
        await resend.emails.send({
            from: 'Nodi Star Web <onboarding@resend.dev>',
            to: 'info@nodistar.cz',
            subject: `Nová poptávka od ${name}`,
            html: `
                <h2>Nová poptávka z webu nodistar.cz</h2>
                <table style="border-collapse:collapse;width:100%;max-width:600px;">
                    <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Jméno:</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email:</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefon:</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone || '—'}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Zájem:</td><td style="padding:8px;border-bottom:1px solid #eee;">${interest || '—'}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;">Zpráva:</td><td style="padding:8px;">${message || '—'}</td></tr>
                </table>
            `,
            replyTo: email,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Nepodařilo se odeslat.' });
    }
}
